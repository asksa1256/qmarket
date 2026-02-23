import SearchBar from "@/features/item-search/ui/SearchBar";
import FAQButton from "@/features/faq/ui/FAQButton";
import PatchNoteButton from "@/features/patch-note/ui/PatchNoteButton";
import UserMenu from "./UserMenu";
import { cn } from "@/shared/lib/utils";
import { User } from "@supabase/supabase-js";

interface DesktopNavProps {
  pathname: string;
  user: User | null | undefined;
}

export default function DesktopNav({ pathname, user }: DesktopNavProps) {
  return (
    <div className="hidden md:flex flex-1 items-center justify-between">
      {pathname !== "/" && (
        <SearchBar
          className={cn("mx-auto w-full max-w-xs [&_svg]:md:right-4", {
            hidden: pathname === "/",
          })}
        />
      )}

      <div
        className={cn("flex gap-2 shrink-0 justify-end", {
          "lg:w-[280px] md:w-[240px]": pathname !== "/",
          "w-full": pathname === "/",
        })}
      >
        <FAQButton onClose={() => {}} />
        <PatchNoteButton onClose={() => {}} />
        <UserMenu user={user} />
      </div>
    </div>
  );
}
