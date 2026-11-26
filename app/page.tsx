import { connection } from "next/server";
import { Suspense } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ContactForm } from "@/presentation/contacts/contact-form";
import { ContactList } from "@/presentation/contacts/contact-list";
import { ThemeToggle } from "@/presentation/theme-toggle";
import { addContactAction, loadContacts, setFollowUpAction } from "./contacts-actions";

// Lue à chaque requête : la liste (et la date du jour qui calcule les retards)
// ne doit pas être figée dans la page pré-générée.
async function Contacts() {
  await connection();
  const contacts = await loadContacts();
  return <ContactList contacts={contacts} setFollowUpAction={setFollowUpAction} />;
}

export default function Home() {
  return (
    <>
      <header className="bg-sidebar text-sidebar-foreground">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-6 sm:px-6">
          <h1 className="text-4xl font-bold tracking-wide uppercase sm:text-5xl">Pipeline</h1>
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
        <section aria-labelledby="contacts-titre">
          <h2 id="contacts-titre" className="text-3xl font-bold tracking-wide uppercase">
            Contacts
          </h2>
          <div className="mt-4">
            <Suspense fallback={<p className="text-muted-foreground text-sm">Chargement des contacts…</p>}>
              <Contacts />
            </Suspense>
          </div>
        </section>
        <aside className="lg:sticky lg:top-6">
          <ContactForm action={addContactAction} />
        </aside>
      </main>
    </>
  );
}
