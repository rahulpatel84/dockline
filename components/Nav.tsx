import Link from "next/link";
import site from "@/data/site.json";
import { NavLinks } from "./NavLinks";

export function Nav() {
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <Link className="logo" href="/" aria-label={`${site.name} home`}>
          <span className="dot">
            <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="mdg-logo-water" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6fc5bc" />
                  <stop offset="100%" stopColor="#15808f" />
                </linearGradient>
              </defs>
              <path d="M4 30 Q 10 26 16 30 T 28 30 T 40 30 L 40 40 L 4 40 Z" fill="url(#mdg-logo-water)" opacity="0.9" />
              <rect x="6" y="24" width="28" height="3" rx="1" fill="#fff" />
              <rect x="9" y="24" width="2" height="10" fill="#fff" opacity="0.9" />
              <rect x="19" y="24" width="2" height="10" fill="#fff" opacity="0.9" />
              <rect x="29" y="24" width="2" height="10" fill="#fff" opacity="0.9" />
              <circle cx="30" cy="12" r="4" fill="#fff" opacity="0.95" />
            </svg>
          </span>
          <span className="logo-text">{site.shortName}</span>
        </Link>
        <NavLinks />
      </div>
    </header>
  );
}
