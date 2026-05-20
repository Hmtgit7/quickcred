"use client";

import { useState } from "react";
import { Eye, Users, X, Mail, Briefcase, IndianRupee, Calendar } from "lucide-react";
import { DataTable, type Column } from "@/components/common/DataTable";
import { DataTablePagination } from "@/components/common/DataTablePagination";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useLeads } from "@/modules/users/hooks/useLeads";
import { LoanStatus } from "@/types/enums";
import type { User } from "@/types/user.types";
import { formatCurrency, formatDate } from "@/lib/utils";

export function SalesLeadsTable() {
  const [page, setPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState<User | null>(null);
  const { data, isLoading } = useLeads(page, 10);

  const columns: Column<User>[] = [
    {
      key: "name",
      header: "Borrower",
      render: (user) => (
        <div>
          <p className="font-medium">{user.fullName ?? "Profile pending"}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
      ),
    },
    {
      key: "profile",
      header: "Profile",
      render: (user) =>
        user.profileCompleted ? (
          <StatusBadge status={LoanStatus.Closed} />
        ) : (
          <StatusBadge status={LoanStatus.Pending} />
        ),
    },
    {
      key: "salary",
      header: "Salary",
      className: "tabular-nums",
      render: (user) =>
        user.monthlySalary ? formatCurrency(user.monthlySalary) : "Not added",
    },
    {
      key: "employment",
      header: "Employment",
      render: (user) => user.employmentMode ?? "Not added",
    },
    {
      key: "joined",
      header: "Registered",
      render: (user) => (
        <span className="text-xs text-muted-foreground">
          {formatDate(user.createdAt)}
        </span>
      ),
    },
    {
      key: "action",
      header: "Action",
      render: (user) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setSelectedLead(user)}
        >
          <Eye className="mr-1.5 h-3.5 w-3.5" />
          View details
        </Button>
      ),
    },
  ];

  return (
    <>
      <div className="space-y-2">
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          keyExtractor={(user) => user._id}
          isLoading={isLoading}
          emptyIcon={Users}
          emptyTitle="No leads available"
          emptyDescription="Registered borrowers without loan applications will appear here."
        />
        {data && <DataTablePagination meta={data} onPageChange={setPage} />}
      </div>

      <LeadDetailModal
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
      />
    </>
  );
}

interface LeadDetailModalProps {
  lead: User | null;
  onClose: () => void;
}

function LeadDetailModal({ lead, onClose }: LeadDetailModalProps) {
  return (
    <Dialog open={Boolean(lead)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            Lead Profile
          </DialogTitle>
        </DialogHeader>

        {lead && (
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/30 px-4 py-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {(lead.fullName ?? lead.email).charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground">
                  {lead.fullName ?? "Name not provided"}
                </p>
                <p className="text-xs text-muted-foreground">{lead.email}</p>
              </div>
              <StatusBadge
                status={
                  lead.profileCompleted ? LoanStatus.Closed : LoanStatus.Pending
                }
              />
            </div>

            <Separator />

            {/* Details grid */}
            <div className="space-y-3">
              <DetailRow
                icon={<Mail className="h-3.5 w-3.5" />}
                label="Email"
                value={lead.email}
              />
              <DetailRow
                icon={<Briefcase className="h-3.5 w-3.5" />}
                label="Employment"
                value={lead.employmentMode ?? "Not provided"}
              />
              <DetailRow
                icon={<IndianRupee className="h-3.5 w-3.5" />}
                label="Monthly salary"
                value={
                  lead.monthlySalary
                    ? formatCurrency(lead.monthlySalary)
                    : "Not provided"
                }
              />
              <DetailRow
                icon={<Calendar className="h-3.5 w-3.5" />}
                label="Date of birth"
                value={lead.dob ? formatDate(lead.dob) : "Not provided"}
              />
              <DetailRow
                icon={<Calendar className="h-3.5 w-3.5" />}
                label="Registered"
                value={formatDate(lead.createdAt)}
              />
              {lead.pan && (
                <DetailRow
                  icon={<Eye className="h-3.5 w-3.5" />}
                  label="PAN"
                  value={lead.pan}
                />
              )}
            </div>

            <Separator />

            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="mr-1.5 h-3.5 w-3.5" />
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function DetailRow({ icon, label, value }: DetailRowProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="text-right text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}