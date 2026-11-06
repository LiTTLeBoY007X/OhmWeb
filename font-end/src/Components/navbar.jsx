import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/shop", label: "ร้านค้า", icon: "▣" },
  { to: "/", label: "หน้าหลัก", icon: "⌂" },
  { to: "/history", label: "ประวัติ", icon: "◷" },
];

function NavBar() {
  const { pathname } = useLocation();

  return (
    <nav aria-label="เมนูหลัก" className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4">
      <div className="mx-auto flex max-w-md items-center justify-around rounded-[1.5rem] border border-white/70 bg-white/90 px-2 py-2 shadow-[0_12px_40px_-16px_rgba(21,67,45,0.35)] backdrop-blur-xl">
        {links.map(({ to, label, icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              aria-current={active ? "page" : undefined}
              className={`flex min-w-24 flex-col items-center gap-1 rounded-2xl px-4 py-2 text-xs font-medium transition ${active ? "bg-[#e4f4e8] text-[#174b37]" : "text-slate-500 hover:bg-slate-50 hover:text-[#174b37]"}`}
            >
              <span className="text-lg leading-none" aria-hidden="true">{icon}</span>
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default NavBar;
