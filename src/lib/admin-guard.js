import { cookies } from 'next/headers';
import { COOKIE, verifyToken } from './auth';

// دومین لایه‌ی محافظت (علاوه بر middleware) برای APIهای ادمین
export async function isAdmin() {
  const jar = await cookies();
  return verifyToken(jar.get(COOKIE)?.value, process.env.SESSION_SECRET);
}
export const unauthorized = () => Response.json({ error: 'نیاز به ورود به پنل' }, { status: 401 });
export const bad = (error, status = 400) => Response.json({ error }, { status });
