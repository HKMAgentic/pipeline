"use client";

// Gère le thème clair/sombre : ajoute la classe .dark sur <html> quand il le faut.
// Par défaut, suit le réglage de l'ordinateur.
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

export function ThemeProvider(props: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props} />;
}
