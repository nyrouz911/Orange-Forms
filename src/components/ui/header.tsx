// src/components/ui/header.tsx
import React from 'react';
import {auth, signOut} from '@/auth';
import {Button} from './button';
import Image from 'next/image';
import Link from 'next/link';
import {Search} from 'lucide-react';
import LocaleLink from '@/components/LocaleLink';
import {getTranslations} from 'next-intl/server';

function SignOutBtn({label}: {label: string}) {
  return (
    <form
      action={async () => {
        'use server';
        await signOut();
      }}
    >
      <Button type="submit" className="bg-[var(--brand-orange-500)] hover:opacity-90">
        {label}
      </Button>
    </form>
  );
}

const Header = async () => {
  const session = await auth();
  const t = await getTranslations('nav');

  // Safe labels (fallbacks if a key is missing)
  const safe = (key: string, fallback: string) => {
    const val = t(key as any);
    if (!val || val === key || val === `nav.${key}`) return fallback;
    return val;
  };

  const label = {
    myAccount: safe('myAccount', 'My account'),
    signOut: safe('signOut', 'Sign out'),
    signIn:  safe('signIn',  'Sign in'),
    home:    safe('home',    'Home'),
    dashboard: safe('dashboard', 'Dashboard'),
    settings: safe('settings', 'Settings'),
  };

  return (
    <header className="border-b border-black/30">
      <nav className="bg-[var(--brand-black)] text-white">
        <div className="mx-auto max-w-screen-xl px-4">
          {/* Row 1: brand + account */}
          <div className="flex h-16 items-center justify-between">
            <LocaleLink href="/">
              <div className="flex items-center gap-3">
                <Image
                  src="/favicon.ico"
                  alt="Orange logo"
                  width={28}
                  height={28}
                  className="shrink-0"
                />
                <span className="text-2xl md:text-3xl font-bold tracking-tight">
                  Forms
                </span>
              </div>
            </LocaleLink>

            <div className="flex items-center gap-6">
              {session?.user ? (
                <div className="flex items-center gap-3">
                  <LocaleLink href="/settings">
                    <Button
                      variant="outline"
                      className="border-[var(--brand-orange-500)] text-[var(--brand-orange-500)] hover:bg-[var(--brand-orange-500)] hover:text-black"
                    >
                      {label.myAccount}
                    </Button>
                  </LocaleLink>

                  {session.user.name && session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : null}

                  <SignOutBtn label={label.signOut} />
                </div>
              ) : (
                // NextAuth sign-in route is not locale-prefixed
                <Link href="/api/auth/signin" className="hidden sm:block">
                  <Button
                    variant="link"
                    className="text-[var(--brand-orange-500)] hover:text-[var(--brand-orange-500)]"
                  >
                    {label.signIn}
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10" />

          {/* Row 2: sub-nav + search */}
          <div className="flex h-12 items-center justify-between">
            <div className="flex items-center gap-6 text-base md:text-lg font-semibold">
              <LocaleLink href="/">
                <span className="text-white hover:text-[var(--brand-orange-500)]">{label.home}</span>
              </LocaleLink>
              <LocaleLink href="/view-forms">
                <span className="text-white hover:text-[var(--brand-orange-500)]">{label.dashboard}</span>
              </LocaleLink>
              <LocaleLink href="/settings">
                <span className="text-white hover:text-[var(--brand-orange-500)]">{label.settings}</span>
              </LocaleLink>
            </div>
            {/* <button aria-label="Search" className="p-2 rounded-md hover:bg-white/5">
              <Search className="h-5 w-5" />
            </button> */}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
