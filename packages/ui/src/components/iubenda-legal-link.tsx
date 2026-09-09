"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const initialized = new WeakSet<HTMLAnchorElement>();
let loading = false;

function loadEmbeds() {
  const links = Array.from(
    document.querySelectorAll<HTMLAnchorElement>("a.iubenda-embed"),
  );
  if (loading || links.every((link) => initialized.has(link))) return;
  loading = true;
  const script = document.createElement("script");
  script.src = "https://cdn.iubenda.com/iubenda.js";
  script.async = true;
  script.onload = () => {
    links.forEach((link) => initialized.add(link));
    loading = false;
    script.remove();
    // A streamed footer can mount while the provider script is in flight.
    loadEmbeds();
  };
  script.onerror = () => {
    loading = false;
    script.remove();
  };
  document.body.appendChild(script);
}

export function IubendaLegalLink({
  href,
  children,
}: {
  href: string;
  children: string;
}) {
  const pathname = usePathname();
  useEffect(() => {
    loadEmbeds();
  }, [pathname, href]);
  // No local click interception: if the embed is unavailable this stays a link.
  return (
    <a
      href={href}
      title={children}
      className="iubenda-nostyle no-brand iubenda-noiframe iubenda-embed"
    >
      {children}
    </a>
  );
}
