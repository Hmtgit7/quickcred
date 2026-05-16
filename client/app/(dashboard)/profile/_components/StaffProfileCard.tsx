import { BadgeCheck, BriefcaseBusiness, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { User } from "@/types/user.types";

interface StaffProfileCardProps {
  user: User;
}

export function StaffProfileCard({ user }: StaffProfileCardProps) {
  const roleLabel = user.role.charAt(0).toUpperCase() + user.role.slice(1);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base">Account Details</CardTitle>
            <CardDescription className="mt-0.5 text-xs">
              Staff accounts are managed by system administrators.
            </CardDescription>
          </div>
          <Badge variant="secondary" className="gap-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <BadgeCheck className="h-3 w-3" />
            Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        <ProfileField icon={BriefcaseBusiness} label="Name" value={user.fullName ?? "Not set"} />
        <ProfileField icon={Mail} label="Email" value={user.email} />
        <ProfileField icon={BriefcaseBusiness} label="Role" value={roleLabel} />
      </CardContent>
    </Card>
  );
}

function ProfileField({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof BriefcaseBusiness;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="mt-2 break-anywhere text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
