import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { ProfileCard } from "./_components/ProfileCard";

export const metadata: Metadata = { title: "My Profile" };

export default function ProfilePage() {
  return (
    <PageContainer size="narrow">
      <PageHeader
        title="My Profile"
        subtitle="Manage your personal details and eligibility information."
      />
      <ProfileCard />
    </PageContainer>
  );
}