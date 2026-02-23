"use client";

import { useUser } from "@/shared/hooks/useUser";
import { usePathname } from "next/navigation";
import HeaderLogo from "./header/HeaderLogo";
import DesktopNav from "./header/DesktopNav";
import MobileNav from "./header/MobileNav";

export default function Header() {
  const { data: user } = useUser();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 backdrop-blur-sm z-50">
      <div className="flex items-center justify-between py-2 lg:max-w-6xl mx-auto px-4 xl:px-0">
        <HeaderLogo />
        <DesktopNav pathname={pathname} user={user} />
        <MobileNav user={user} />
      </div>
    </header>
  );
}
