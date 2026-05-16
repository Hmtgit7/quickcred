import {
  LayoutDashboard,
  FileText,
  Users,
  CheckSquare,
  Banknote,
  CreditCard,
  BarChart3,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Role } from "@/types/enums";
import { ROUTES } from "@/constants/routes";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  roles?: Role[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    href: ROUTES.DASHBOARD,
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: ROUTES.LOANS.ROOT,
    label: "My Loans",
    icon: FileText,
    roles: [Role.Borrower],
  },
  {
    href: ROUTES.SALES,
    label: "Sales",
    icon: Users,
    roles: [Role.Sales, Role.Admin],
  },
  {
    href: ROUTES.SANCTION,
    label: "Sanction",
    icon: CheckSquare,
    roles: [Role.Sanction, Role.Admin],
  },
  {
    href: ROUTES.DISBURSEMENT,
    label: "Disbursement",
    icon: Banknote,
    roles: [Role.Disbursement, Role.Admin],
  },
  {
    href: ROUTES.COLLECTION,
    label: "Collection",
    icon: CreditCard,
    roles: [Role.Collection, Role.Admin],
  },
  {
    href: ROUTES.ANALYTICS,
    label: "Analytics",
    icon: BarChart3,
    roles: [Role.Admin],
  },
  {
    href: ROUTES.PROFILE,
    label: "Profile",
    icon: User,
  },
];