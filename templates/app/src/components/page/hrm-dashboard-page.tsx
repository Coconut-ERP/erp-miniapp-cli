"use client";

import { FormStack } from "@erp/miniapp-ui";
import { HrmDashboard } from "@/components/features/hrm-dashboard";

export function HrmDashboardPage() {
  return (
    <FormStack className="gap-4">
      <HrmDashboard />
    </FormStack>
  );
}
