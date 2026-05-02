// Inline type for Edge compatibility
export type AppRole = "admin" | "bursar" | "teacher" | "parent";
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  BookOpen,
  CalendarDays,
  CheckSquare,
  CreditCard,
  FileText,
  Home,
  Megaphone,
  MessageSquare,
  Settings,
  User,
  Users,
  Wallet
} from "lucide-react";

export type NavigationItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export type RouteMeta = {
  title: string;
  subtitle?: string;
};

export const navigation: Record<AppRole, NavigationItem[]> = {
  admin: [
    { href: "/admin/dashboard", label: "Dashboard", icon: Home },
    { href: "/admin/leads", label: "Admissions", icon: Users },
    { href: "/admin/announce", label: "Broadcasts", icon: Bell },
    { href: "/admin/announcements", label: "Announcements", icon: Megaphone }
  ],
  bursar: [
    { href: "/bursar", label: "Dashboard", icon: Home },
    { href: "/bursar/payments", label: "Payments", icon: CreditCard },
    { href: "/bursar/balances", label: "Balances", icon: Wallet },
    { href: "/bursar/reports", label: "Fee Reports", icon: FileText },
    { href: "/bursar/announcements", label: "Announcements", icon: Megaphone }
  ],
  teacher: [
    { href: "/teacher", label: "Dashboard", icon: Home },
    { href: "/teacher/classes", label: "Classes", icon: Users },
    { href: "/teacher/students", label: "Students", icon: User },
    { href: "/teacher/attendance", label: "Attendance", icon: CheckSquare },
    { href: "/teacher/announcements", label: "Homework", icon: BookOpen },
    { href: "/teacher/profile", label: "Profile", icon: Settings }
  ],
  parent: [
    { href: "/parent", label: "Dashboard", icon: Home },
    { href: "/parent/fees", label: "Fees", icon: CreditCard },
    { href: "/parent/announcements", label: "Announcements", icon: Megaphone },
    { href: "/parent/applications", label: "Applications", icon: FileText },
    { href: "/parent/messages", label: "Messages", icon: MessageSquare },
    { href: "/parent/events", label: "Events", icon: CalendarDays },
    { href: "/parent/settings", label: "Settings", icon: Settings }
  ]
};

export const routeMeta: Record<AppRole, Record<string, RouteMeta>> = {
  admin: {
    "/admin/dashboard": {
      title: "Admin Dashboard",
      subtitle: "Manage accounts, fees, payments, and operational visibility."
    },
    "/admin/leads": {
      title: "Admissions Leads",
      subtitle: "Track WhatsApp inquiries and move families through the admissions pipeline."
    },
    "/admin/announce": {
      title: "Broadcast Center",
      subtitle: "Send quick portal, SMS, or WhatsApp-style updates from one place."
    },
    "/admin/announcements": {
      title: "Announcements",
      subtitle: "Create, target, and manage notices for parents, teachers, and learners."
    }
  },
  bursar: {
    "/bursar": {
      title: "Bursar Dashboard",
      subtitle: "Keep fee structures, balances, and recent payments in sync."
    },
    "/bursar/payments": {
      title: "Payments",
      subtitle: "Record school payments quickly and review the latest receipts."
    },
    "/bursar/balances": {
      title: "Balances",
      subtitle: "Review every learner balance and prioritize families who need follow-up."
    },
    "/bursar/reports": {
      title: "Fee Reports",
      subtitle: "See collection totals, outstanding balances, and current fee structures."
    },
    "/bursar/announcements": {
      title: "Announcements",
      subtitle: "Share finance-related reminders and family payment updates."
    }
  },
  teacher: {
    "/teacher": {
      title: "Teacher Dashboard",
      subtitle: "A focused view of classes, learners, homework, and daily momentum."
    },
    "/teacher/classes": {
      title: "My Classes",
      subtitle: "See the classes currently assigned to you."
    },
    "/teacher/students": {
      title: "Students",
      subtitle: "View the learners in your classes and their current status."
    },
    "/teacher/attendance": {
      title: "Attendance",
      subtitle: "Mark and review attendance with a clean daily workflow."
    },
    "/teacher/announcements": {
      title: "Homework",
      subtitle: "Post homework and review recent notices from one workspace."
    },
    "/teacher/profile": {
      title: "Profile",
      subtitle: "Your account details and contact information."
    }
  },
  parent: {
    "/parent": {
      title: "Parent Dashboard",
      subtitle: "Stay close to student progress, fees, communication, and school updates."
    },
    "/parent/fees": {
      title: "Fees",
      subtitle: "Review balances, payment history, and current billing information."
    },
    "/parent/announcements": {
      title: "Announcements",
      subtitle: "See the latest notices relevant to your family."
    },
    "/parent/applications": {
      title: "Applications",
      subtitle: "Track admissions-related activity and next steps."
    },
    "/parent/messages": {
      title: "Messages",
      subtitle: "Reach the school quickly with the right contact channel."
    },
    "/parent/events": {
      title: "Events",
      subtitle: "Keep up with key school dates and family-facing calendar items."
    },
    "/parent/settings": {
      title: "Settings",
      subtitle: "Manage your account and session preferences."
    }
  }
};

export function getNavigation(role: AppRole) {
  return navigation[role];
}

export function getRouteMeta(role: AppRole, pathname: string) {
  return routeMeta[role][pathname] ?? {
    title: navigation[role].find((item) => item.href === pathname)?.label ?? "Portal",
    subtitle: "Unified school workspace"
  };
}
