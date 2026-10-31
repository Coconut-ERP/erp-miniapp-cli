"use client";

import { ErrorState } from "@erp/miniapp-ui";
import { APP_ERROR } from "@/constants/errors";

export default function RouteError({ error, reset }: { error: Error; reset: () => void }) {
  return <ErrorState title={APP_ERROR.title} error={error} onRetry={reset} />;
}
