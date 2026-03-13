/* eslint-disable */
// scripts/download-logos.js
// Run from project root: node scripts/download-logos.js

const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const https = require('https');
const http = require('http');

const projectRoot = path.join(__dirname, '..');
const dataDir = path.join(projectRoot, 'src', 'data');
const imagesBaseDir = path.join(projectRoot, 'public', 'images');

const leaguesJsonPath = path.join(dataDir, 'leagues.json');
const teamsJsonPath = path.join(dataDir, 'teams.json');

const leaguesDir = path.join(imagesBaseDir, 'leagues');
const teamsDir = path.join(imagesBaseDir, 'teams');
const flagsDir = path.join(imagesBaseDir, 'flags');

async function ensureDir(dir) {
  await fsp.mkdir(dir, { recursive: true });
}

function getFilenameFromUrl(url) {
  try {
    const u = new URL(url);
    const pathname = u.pathname;
    const lastSegment = pathname.split('/').filter(Boolean).pop();
    if (lastSegment) return lastSegment;
  } catch (e) {
    // Fallback if URL constructor fails
  }
  const parts = url.split('/').filter(Boolean);
  return parts.pop() || 'unknown';
}

function downloadFile(url, destPath) {
  return new Promise(async (resolve, reject) => {
    try {
      await ensureDir(path.dirname(destPath));

      if (fs.existsSync(destPath)) {
        console.log(`Skipping (exists): ${destPath}`);
        return resolve();
      }

      console.log(`Downloading ${url} -> ${destPath}`);

      const client = url.startsWith('https') ? https : http;

      const request = client.get(url, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          // Handle simple redirect
          const redirectUrl = res.headers.location.startsWith('http')
            ? res.headers.location
            : new URL(res.headers.location, url).href;
          res.resume(); // discard
          return downloadFile(redirectUrl, destPath).then(resolve).catch(reject);
        }

        if (res.statusCode !== 200) {
          res.resume(); // discard
          return reject(
            new Error(`Request failed with status ${res.statusCode} for ${url}`)
          );
        }

        const fileStream = fs.createWriteStream(destPath);
        res.pipe(fileStream);

        fileStream.on('finish', () => {
          fileStream.close(() => resolve());
        });

        fileStream.on('error', (err) => {
          fs.unlink(destPath, () => reject(err));
        });
      });

      request.on('error', (err) => {
        reject(err);
      });
    } catch (err) {
      reject(err);
    }
  });
}

async function downloadLeagueLogos(leagues) {
  await ensureDir(leaguesDir);
  for (const league of leagues) {
    if (!league.logoRef) continue;
    const filename = getFilenameFromUrl(league.logoRef);
    const dest = path.join(leaguesDir, filename);
    try {
      await downloadFile(league.logoRef, dest);
    } catch (err) {
      console.error(`Failed league logo for "${league.name}" (${league.id}):`, err.message);
    }
  }
}

async function downloadLeagueFlags(leagues) {
  await ensureDir(flagsDir);
  for (const league of leagues) {
    const flagUrl = league.area && league.area.flag;
    if (!flagUrl) continue;
    const filename = getFilenameFromUrl(flagUrl);
    const dest = path.join(flagsDir, filename);
    try {
      await downloadFile(flagUrl, dest);
    } catch (err) {
      console.error(
        `Failed flag for "${league.name}" (${league.id}) area "${league.area && league.area.name}":`,
        err.message
      );
    }
  }
}

async function downloadTeamLogos(teams) {
  await ensureDir(teamsDir);
  for (const team of teams) {
    if (!team.logoRef) continue;
    const filename = getFilenameFromUrl(team.logoRef);
    const dest = path.join(teamsDir, filename);
    try {
      await downloadFile(team.logoRef, dest);
    } catch (err) {
      console.error(`Failed team logo for "${team.name}" (${team.id}):`, err.message);
    }
  }
}

async function main() {
  const leaguesRaw = await fsp.readFile(leaguesJsonPath, 'utf8');
  const teamsRaw = await fsp.readFile(teamsJsonPath, 'utf8');

  const leagues = JSON.parse(leaguesRaw);
  const teams = JSON.parse(teamsRaw);

  console.log(`Leagues: ${leagues.length}, Teams: ${teams.length}`);

  await downloadLeagueLogos(leagues);
  await downloadLeagueFlags(leagues);
  await downloadTeamLogos(teams);

  console.log('Done.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});