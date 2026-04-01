import "@/styles/globals.css";

export const metadata = {
  title: "SAATHI | Affordable Learning for Every Student",
  description: "High-quality education from verified experts starting at just ₹100.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-surface font-body text-on-surface antialiased">
        {children}
      </body>
    </html>
  );
}
