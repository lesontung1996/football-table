'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Teams' },
    { href: '/schedule', label: 'Schedule' },
    { href: '/table', label: 'Table' },
  ];

  return (
    <nav className="bg-fpl-purple text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-xl font-bold tracking-tight">Premier League Table</h1>
          <div className="flex gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-md transition-colors ${
                  pathname === item.href
                    ? 'bg-fpl-purple-dark font-semibold'
                    : 'hover:bg-fpl-purple-light'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
