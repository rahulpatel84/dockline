"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const items = [
  { href: "/", label: "Home", match: (p: string) => p === "/" },
  { href: "/guides", label: "Guides", match: (p: string) => p.startsWith("/guides") },
  { href: "/tools", label: "Tools", match: (p: string) => p.startsWith("/tools") },
  { href: "/about", label: "About", match: (p: string) => p.startsWith("/about") },
];

export function NavLinks() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <button
        type="button"
        className="menu-toggle"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="primary-nav"
        onClick={() => setOpen((v) => !v)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          {open ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      <nav id="primary-nav" className={`links${open ? " open" : ""}`}>
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className={it.match(pathname) ? "on" : ""}
            onClick={() => setOpen(false)}
          >
            {it.label}
          </Link>
        ))}
        <Link href="/quote" className="btn btn-coral" onClick={() => setOpen(false)}>
          Get Free Quotes
        </Link>
      </nav>
      {open && <div className="menu-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />}
    </>
  );
}
