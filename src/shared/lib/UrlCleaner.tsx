"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function UrlCleaner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.toString().length > 0) {
      window.history.replaceState(null, "", pathname);
    }
  }, [pathname, searchParams]);

  return null;
}
