import { cookies } from 'next/headers';
import { COOKIE, MAX_AGE, createToken, checkCredentials } from '@/lib/auth';
export const dynamic = 'force-dynamic';

export async function POST(req) {
  const { ADMIN_EMAIL, ADMIN_PASSWORD, SESSION_SECRET } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !SESSION_SECRET || SESSION_SECRET.length < 16) {
    return Response.json({ error: 'متغیرهای ADMIN_EMAIL / ADMIN_PASSWORD / SESSION_SECRET تنظیم نشده‌اند' }, { status: 500 });
  }
  let body = {};
  try { body = await req.json(); } catch {}
  const ok = typeof body.email === 'string' && typeof body.password === 'string' && (await checkCredentials(body.email, body.password));
  if (!ok) {
    await new Promise((r) => setTimeout(r, 800)); // کند کردن حدس‌زدن رمز
    return Response.json({ error: 'ایمیل یا رمز عبور اشتباه است' }, { status: 401 });
  }
  const jar = await cookies();
  jar.set(COOKIE, await createToken(SESSION_SECRET), {
    httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: MAX_AGE
  });
  return Response.json({ ok: true });
}
