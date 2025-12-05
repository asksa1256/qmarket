import { ReactNode } from "react";

export default function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-2xl font-bold px-4 py-3 rounded-md bg-secondary mb-4">
      {children}
    </h2>
  );
}
