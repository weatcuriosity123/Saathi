export default function AuthLayout({ children }) {
  return (
    <div className="flex-grow flex items-center justify-center p-6 md:p-12 w-full">
      {children}
    </div>
  );
}
