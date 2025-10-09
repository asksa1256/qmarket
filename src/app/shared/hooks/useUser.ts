"use client";

import { useQuery } from "@tanstack/react-query";

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await fetch("/api/auth/profile");
      const data = await res.json();
      return data.user;
    },
  });
}
