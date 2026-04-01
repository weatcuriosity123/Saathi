import Card from "@/components/ui/Card";

export default function PageTemplate({ title, description, sections = [] }) {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-text">{title}</h1>
        {description ? <p className="text-slate-600">{description}</p> : null}
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((section) => (
          <Card key={section.title}>
            <h2 className="text-lg font-semibold text-text">{section.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{section.content}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
