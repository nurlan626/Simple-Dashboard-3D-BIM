import { Link, Outlet, useLocation } from "react-router";

export default function Layout() {
  const location = useLocation();

  const navLink = (to: string, label: string) => {
    const isActive = location.pathname === to || (to !== "/" && location.pathname.startsWith(to));
    return (
      <Link
        to={to}
        className={`block w-full rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
          isActive
            ? "bg-slate-700 text-white"
            : "text-slate-300 hover:bg-slate-700/60 hover:text-white"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="grid h-screen grid-cols-[220px_1fr] bg-slate-50">
      <aside className="flex flex-col bg-slate-800 shadow-xl">
        <div className="p-4 border-b border-slate-700">
          <span className="text-lg font-semibold tracking-tight text-white">BIM 3D</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navLink("/", "Designers")}
          {navLink("/editor", "Editor")}
        </nav>
      </aside>
      <main className="flex min-h-0 flex-1 flex-col overflow-auto">
        <div className="flex min-h-0 flex-1 flex-col">
          <Outlet />
        </div>
      </main>
    </div>
  );
}