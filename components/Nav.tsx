import Link from "next/link";
import site from "@/data/site.json";
import { NavLinks } from "./NavLinks";

export function Nav() {
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <Link className="logo" href="/" aria-label={`${site.name} home`}>
          <span className="dot">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
              <path d="M3 18h18M5 18v-7l7-4 7 4v7M9 18v-4h6v4" />
            </svg>
          </span>
          <span>
            {site.shortName}
            <small>Tampa Bay</small>
          </span>
        </Link>
        <NavLinks />
      </div>
    </header>
  );
}
