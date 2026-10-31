import { Button, NotFoundState } from "@erp/miniapp-ui";
import Link from "next/link";
import { APP_NOT_FOUND } from "@/constants/errors";

export default function NotFound() {
  return (
    <NotFoundState
      title={APP_NOT_FOUND.title}
      description={APP_NOT_FOUND.description}
      action={
        <Button asChild>
          <Link href="/dashboard">{APP_NOT_FOUND.action}</Link>
        </Button>
      }
    />
  );
}
