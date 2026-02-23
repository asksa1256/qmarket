import Link from "next/link";
import Image from "next/image";

export default function HeaderLogo() {
  return (
    <Link href="/" className="lg:w-[280px] md:w-[240px] shrink-0">
      <Image src="/images/logo.png" alt="큐마켓" width={140} height={54} priority />
    </Link>
  );
}
