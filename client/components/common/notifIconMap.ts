import {
  Banknote,
  Bell,
  CheckCircle,
  FileText,
  IndianRupee,
  Lock,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import type { NotificationType } from "@/modules/notifications/types/notification.types";

export const NOTIF_ICON_MAP: Record<NotificationType, LucideIcon> = {
  loan_applied: FileText,
  loan_sanctioned: CheckCircle,
  loan_rejected: XCircle,
  loan_disbursed: Banknote,
  payment_recorded: IndianRupee,
  loan_closed: Lock,
  general: Bell,
};
