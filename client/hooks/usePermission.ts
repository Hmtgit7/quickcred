import { useAuthStore, selectRole } from "@/modules/auth/store/authStore";
import { Role } from "@/types/enums";

/**
 * Returns permission helpers based on the current user's role.
 * Use this hook to conditionally render UI elements.
 */
export function usePermission() {
  const role = useAuthStore(selectRole);

  const hasRole = (...roles: Role[]): boolean => {
    if (!role) return false;
    return roles.includes(role as Role);
  };

  const isAdmin = role === Role.Admin;
  const isBorrower = role === Role.Borrower;
  const isSales = role === Role.Sales;
  const isSanction = role === Role.Sanction;
  const isDisbursement = role === Role.Disbursement;
  const isCollection = role === Role.Collection;
  const isExecutive = !isBorrower && !isAdmin && role !== null;

  return { role, hasRole, isAdmin, isBorrower, isSales, isSanction, isDisbursement, isCollection, isExecutive };
}
