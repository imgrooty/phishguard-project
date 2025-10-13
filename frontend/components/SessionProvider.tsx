"use client";
import { SessionProvider } from "next-auth/react"
import React from "react";

interface SessionProviderProps {
  children: React.ReactNode;
}       
export const SessionProviderComponent: React.FC<SessionProviderProps> = ({ children }) => {
  return (
    <SessionProvider>   
        {children}
    </SessionProvider>
  );
}