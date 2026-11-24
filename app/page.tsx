import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ContactCard } from "@/presentation/contacts/contact-card";
import { ContactForm } from "@/presentation/contacts/contact-form";
import { demoContacts } from "@/presentation/contacts/demo-contacts";
import { ThemeToggle } from "@/presentation/theme-toggle";

export default function Home() {
  const lateCount = demoContacts.filter((c) => c.followUp.late).length;

  return (
    <>
      <header className="bg-sidebar text-sidebar-foreground">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-6 sm:px-6">
          <div>
            <h1 className="text-4xl font-bold tracking-wide uppercase sm:text-5xl">Pipeline</h1>
            <p className="mt-1 text-sm opacity-90">
              {demoContacts.length} relances à faire, dont {lateCount} en retard · données d’exemple
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
        <section aria-labelledby="relances-titre">
          <h2 id="relances-titre" className="text-3xl font-bold tracking-wide uppercase">
            Relances du jour
          </h2>
          <div className="mt-4 grid gap-3">
            {demoContacts.map((contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        </section>
        <aside className="lg:sticky lg:top-6">
          <ContactForm />
        </aside>
      </main>
    </>
  );
}
