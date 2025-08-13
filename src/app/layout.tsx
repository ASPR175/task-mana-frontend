// src/app/layout.tsx
"use client";


import './globals.css';
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const setToken = useAuthStore((state) => state.setToken);

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored) {
      setToken(stored);
    }
  }, [setToken]);

  return <>{children}</>;
}



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthInitializer>{children}</AuthInitializer>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}

