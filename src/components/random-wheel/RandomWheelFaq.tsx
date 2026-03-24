import { cn } from "@/lib/utils";
import Image from "next/image";

function FaqCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article
      className={cn(
        "flex flex-col rounded-xl border border-white/10 bg-fpl-1100/90 p-5 sm:p-6 md:p-7 break-inside-avoid",
      )}
    >
      <h3 className="flex items-center gap-3 text-lg font-bold leading-snug text-white sm:text-xl">
        <Image
          src="/images/football-wheel-logo.svg"
          alt={title}
          width={32}
          height={32}
        />
        <span>{title}</span>
      </h3>
      <div className="mt-4 space-y-3 text-body-sm text-white/75 [&_a]:font-medium [&_a]:text-sky-400 [&_a]:underline [&_a]:underline-offset-2 [&_a]:transition-colors hover:[&_a]:text-sky-300">
        {children}
      </div>
    </article>
  );
}

export default function RandomWheelFaq() {
  return (
    <section
      className="w-full border-t border-white/10 pt-8 md:pt-10"
      aria-labelledby="random-wheel-faq-heading"
    >
      <div className="mb-5 md:mb-6">
        <h2
          id="random-wheel-faq-heading"
          className="text-h2 font-bold tracking-tight text-white"
        >
          Questions & Answers
        </h2>
      </div>

      <div className="md:columns-2 xl:columns-3 space-y-4">
        <FaqCard title="What is the Football Wheel?">
          <p>
            Football Wheel is an interactive, random generator tool designed for
            football fans. Whether you are looking for a team to play with in
            PES/FIFA/FC24, deciding which match to watch, or running a friendly
            sweepstake, our wheel provides a fun and unbiased way to pick a
            team.
          </p>
        </FaqCard>

        <FaqCard title="How does it work?">
          <p>
            It&apos;s simple: Spin the wheel to generate a random football team.
            The wheel is pre-loaded with teams from the world&apos;s top
            leagues, ensuring a truly random selection every time you click.
          </p>
        </FaqCard>

        <FaqCard title="How do I spin the wheel?">
          <p>
            You can click directly on the wheel to start the animation. For
            power users, you can also use the keyboard shortcut: Ctrl + Enter
            (or Cmd + Enter on Mac).
          </p>
        </FaqCard>

        <FaqCard title="Can I customize the list of teams?">
          <p>Yes! You have two ways to do this:</p>
          <ul className="list-disc space-y-1.5 pl-5 marker:text-white/40">
            <li>
              Quick Presets: Use our <b>Quick Presets</b> tab to instantly load
              teams from specific competitions like the Champions League, World
              Cup, Euro, or individual domestic leagues.
            </li>
            <li>
              Manual Selection: Go to the <b>Choose Teams</b> tab to check or
              uncheck specific teams, allowing you to create a completely custom
              wheel list.
            </li>
          </ul>
        </FaqCard>

        <FaqCard title="Is my spin history saved?">
          <p>
            Yes. You can view your recent results in the <b>Previous Spins</b>{" "}
            tab. We store up to 50 of your most recent spins directly on your
            device, so you won&apos;t lose track of your results even if you
            refresh the page.
          </p>
        </FaqCard>

        <FaqCard title="Is Football Wheel free to use?">
          <p>
            Yes, the tool is completely free for everyone to use as many times
            as they like.
          </p>
        </FaqCard>

        <FaqCard title="Which leagues and teams are included?">
          <p>
            Our database includes 231 teams from the most popular leagues in the
            world, including:
          </p>
          <ul className="list-disc space-y-1.5 pl-5 marker:text-white/40">
            <li>England: Premier League &amp; Championship</li>
            <li>Spain: La Liga</li>
            <li>Germany: Bundesliga</li>
            <li>Italy: Serie A</li>
            <li>France: Ligue 1</li>
            <li>Netherlands: Eredivisie</li>
            <li>Portugal: Primeira Liga</li>
            <li>Brazil: Campeonato Brasileiro Serie A</li>
            <li>International: Major National Teams</li>
          </ul>
        </FaqCard>

        <FaqCard title="How can I share my custom wheel with friends?">
          <p>
            Sharing is easy. You don&apos;t need to send a file; simply copy and
            paste the current URL from your browser address bar. The URL
            automatically updates to contain the data for the specific teams you
            have selected, allowing your friends to see the exact same wheel.
          </p>
        </FaqCard>
      </div>
    </section>
  );
}
