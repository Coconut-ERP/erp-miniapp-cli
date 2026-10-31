import type { UserDto } from "erp-sdk";
import { getErp } from "@/lib/erp/app";

interface CachedSession {
  user: UserDto;
  expiresAt: number;
}

const SESSION_CACHE_LIMIT = 500;
const sessions = new Map<string, CachedSession>();

function prune(): void {
  const now = Date.now();
  for (const [key, value] of sessions) {
    if (value.expiresAt <= now) sessions.delete(key);
  }
  if (sessions.size > SESSION_CACHE_LIMIT) sessions.clear();
}

/**
 * Trades a signed initData string for a verified user. Cached per string so a
 * burst of requests from one open app costs a single exchange with the ERP.
 */
export async function resolveUser(initData: string): Promise<UserDto> {
  const cached = sessions.get(initData);
  if (cached && cached.expiresAt > Date.now()) return cached.user;

  const { app } = await getErp();
  const { user, expiresIn } = await app.session(initData);
  prune();
  sessions.set(initData, {
    user,
    expiresAt: Date.now() + Math.max(expiresIn - 60, 60) * 1000,
  });
  return user;
}
