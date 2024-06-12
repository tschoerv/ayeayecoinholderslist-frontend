"use client";
import { NextUIProvider } from '@nextui-org/react'
import { useState, useEffect } from 'react'

export function Providers({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
        <NextUIProvider>
        {mounted && children}
        </NextUIProvider>
  );
}

