"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  BarChart3,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldAlert
} from "lucide-react";
import { motion } from "framer-motion";
import { signOut } from "next-auth/react";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active: boolean;
  collapsed: boolean;
}

const SidebarItem = ({ icon, label, href, active, collapsed }: SidebarItemProps) => {
  return (
    <Link href={href} aria-current={active ? "page" : undefined} title={collapsed ? label : undefined}>
      <motion.div
        whileHover={{ x: 5 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all mb-1 ${
          active
            ? "bg-teal-600 text-white shadow-lg shadow-teal-200 ring-4 ring-teal-50"
            : "text-gray-500 hover:bg-gray-50 hover:text-teal-600"
        }`}
      >
        <div
          className={`flex-shrink-0 transition-colors ${active ? "text-white" : "group-hover:text-teal-600"}`}
          aria-hidden="true"
        >
          {icon}
        </div>
        {collapsed ? (
          <span className="sr-only">{label}</span>
        ) : (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-bold text-sm whitespace-nowrap"
          >
            {label}
          </motion.span>
        )}
      </motion.div>
    </Link>
  );
};

function SidebarContent() {
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view") || "overview";
  const [collapsed, setCollapsed] = React.useState(false);

  const menuItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: "Overview", href: "/dashboard", view: "overview" },
    { icon: <Inbox className="w-5 h-5" />, label: "Inbox", href: "/dashboard?view=inbox", view: "inbox" },
    { icon: <BarChart3 className="w-5 h-5" />, label: "Analytics", href: "/dashboard?view=analytics", view: "analytics" },
    { icon: <ShieldAlert className="w-5 h-5" />, label: "Security", href: "/dashboard?view=security", view: "security" },
    { icon: <Settings className="w-5 h-5" />, label: "Settings", href: "/dashboard?view=settings", view: "settings" },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? "84px" : "280px" }}
      className="hidden lg:flex flex-col h-screen sticky top-0 bg-white border-r border-gray-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] z-40"
    >
      <div className="p-8 flex items-center justify-between relative">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 text-teal-600"
          >
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-200" aria-hidden="true">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-gray-900">PhishGuard</span>
          </motion.div>
        )}
        {collapsed && (
          <div
            className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-200 mx-auto"
            role="img"
            aria-label="PhishGuard"
          >
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3.5 top-1/2 -translate-y-1/2 bg-white border border-gray-100 rounded-full p-1.5 shadow-md hover:bg-gray-50 transition-all hover:scale-110 active:scale-95"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5 text-gray-400" /> : <ChevronLeft className="w-3.5 h-3.5 text-gray-400" />}
        </button>
      </div>

      <nav className="flex-1 px-4 mt-4 space-y-1">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.label}
            {...item}
            active={currentView === item.view}
            collapsed={collapsed}
          />
        ))}
      </nav>

      <div className="p-6">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all w-full group focus-visible:ring-2 focus-visible:ring-red-500/20 focus-visible:outline-none"
          aria-label="Sign Out"
          title={collapsed ? "Sign Out" : undefined}
        >
          <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
          {!collapsed && <span className="font-bold text-sm">Sign Out</span>}
        </button>
      </div>
    </motion.aside>
  );
}

export default function DashboardSidebar() {
  return (
    <Suspense fallback={<div className="w-[280px] h-screen bg-white border-r border-gray-100" />}>
      <SidebarContent />
    </Suspense>
  );
}
