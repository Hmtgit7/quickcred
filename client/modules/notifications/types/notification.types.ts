export type NotificationType =
  | "loan_applied"
  | "loan_sanctioned"
  | "loan_rejected"
  | "loan_disbursed"
  | "payment_recorded"
  | "loan_closed"
  | "general";

export interface ServerNotification {
  _id: string;
  recipientId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  loanId?: string | null;
  createdAt: string;
}

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  loanId?: string | null;
  createdAt: string;
}

export interface NotificationPage {
  notifications: Notification[];
  unreadCount: number;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
