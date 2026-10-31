"use client";

import { ErrorState, LoadingRows, PageHeader } from "@erp/miniapp-ui";
import { ServiceRequestForm } from "@/components/features/service-request-form";
import { FORM_PAGE } from "@/constants/pages";
import { useServiceRequestFormOptions } from "@/hooks/use-service-requests";

export function FormPage() {
  const optionsQuery = useServiceRequestFormOptions();

  if (optionsQuery.isLoading) {
    return (
      <>
        <PageHeader {...FORM_PAGE.header} />
        <LoadingRows rows={5} />
      </>
    );
  }

  if (optionsQuery.error) {
    return (
      <>
        <PageHeader {...FORM_PAGE.header} />
        <ErrorState
          title={FORM_PAGE.errorTitle}
          error={optionsQuery.error}
          onRetry={() => void optionsQuery.refetch()}
        />
      </>
    );
  }

  if (!optionsQuery.data) return null;

  return (
    <>
      <PageHeader {...FORM_PAGE.header} />
      <ServiceRequestForm options={optionsQuery.data} />
    </>
  );
}
