'use client'
import { User } from "@/types/user"
import { createContext, useContext, ReactNode, useState, useEffect } from "react"

interface UserContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined)

// Custom hook to access user context
export const useUser = () => {
  const context = useContext(UserContext)

  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

// Provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  const value = {
    user,
    setUser,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
