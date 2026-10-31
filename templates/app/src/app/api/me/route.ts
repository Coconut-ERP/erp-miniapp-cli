import { withErp } from "@/lib/api/route";

export const dynamic = "force-dynamic";

/** Verified identity for the current initData session — pattern for ERP routes. */
export const GET = withErp(async ({ user }) => {
  const { id, email, displayName, fullName } = user;

  return {
    user: {
      id,
      email,
      displayName: displayName ?? fullName ?? email,
      fullName: fullName ?? null,
    },
  };
});
