import { cookies } from 'next/headers';
import { COOKIE } from '@/lib/auth';
export const dynamic = 'force-dynamic';

export async function POST() {
  (await cookies()).delete(COOKIE);
  return Response.json({ ok: true });
}
