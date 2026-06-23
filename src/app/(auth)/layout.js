// Auth layout — no Navbar or Footer
export default function AuthLayout({ children }) {
  return (
    <div style={{ backgroundColor: "#FAFAF9" }} className="min-h-screen">
      {children}
    </div>
  );
}