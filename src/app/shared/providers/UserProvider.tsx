"use client";

import { createContext, useContext, ReactNode } from "react";

export interface UserType {
  email?: string;
  nickname?: string;
}

const UserContext = createContext<UserType | null>(null);

export function UserProvider({
  user,
  children,
}: {
  user: UserType | null;
  children: ReactNode;
}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext);
