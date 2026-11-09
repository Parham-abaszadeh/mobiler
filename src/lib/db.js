import mongoose from 'mongoose';
const g = globalThis;
g._mobiler ||= { conn: null, promise: null };

export async function connectDB() {
  if (g._mobiler.conn) return g._mobiler.conn;
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI تنظیم نشده است');
  g._mobiler.promise ||= mongoose
    .connect(process.env.MONGODB_URI, {
      dbName: 'mobiler',
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 5
    })
    .catch((e) => {
      g._mobiler.promise = null; // اگر اتصال شکست خورد، دفعه‌ی بعد دوباره تلاش شود
      throw e;
    });
  g._mobiler.conn = await g._mobiler.promise;
  return g._mobiler.conn;
}
