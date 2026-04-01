import Link from "next/link";

const items = [
  { href: "/dashboard", label: "Overview" },
  { href: "/course-player", label: "Course Player" },
  { href: "/checkout", label: "Checkout" },
];

export default function Sidebar() {
  return (
    <aside className="w-full rounded-xl border border-slate-200 bg-white p-4 md:w-64">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
        Student Panel
      </h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
