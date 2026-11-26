import { connection } from "next/server";
import { cache, Suspense } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AgendaSections } from "@/presentation/contacts/agenda-sections";
import { agendaSummary } from "@/presentation/contacts/agenda-summary";
import { ContactForm } from "@/presentation/contacts/contact-form";
import { ThemeToggle } from "@/presentation/theme-toggle";
import { addContactAction, loadAgenda, setFollowUpAction } from "./contacts-actions";

// Lu à chaque requête (la date du jour décide qui relancer), une seule fois
// par requête pour le bandeau et les sections.
const getAgenda = cache(async () => {
  await connection();
  return loadAgenda();
});

async function Summary() {
  const agenda = await getAgenda();
  return <>{agendaSummary(agenda)}</>;
}

async function Sections() {
  const agenda = await getAgenda();
  return <AgendaSections agenda={agenda} setFollowUpAction={setFollowUpAction} />;
}

export default function Home() {
  return (
    <>
      <header className="bg-sidebar text-sidebar-foreground">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-6 sm:px-6">
          <div>
            <h1 className="text-4xl font-bold tracking-wide uppercase sm:text-5xl">Pipeline</h1>
            <p className="text-sidebar-foreground/80 mt-1 text-sm" aria-live="polite">
              <Suspense fallback="Chargement des relances…">
                <Summary />
              </Suspense>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="#nouveau-contact"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90",
              )}
            >
              Ajouter un contact
            </a>
            <ThemeToggle className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" />
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <Suspense fallback={<p className="text-muted-foreground text-sm">Chargement des contacts…</p>}>
          <Sections />
        </Suspense>
        <aside className="lg:sticky lg:top-6">
          <ContactForm action={addContactAction} />
        </aside>
      </main>
    </>
  );
}
