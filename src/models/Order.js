import mongoose from 'mongoose';
// مرحله ۳: ثبت سفارش و کم‌کردن موجودی از این مدل استفاده می‌کند
const OrderSchema = new mongoose.Schema(
  {
    customer: { name: String, phone: String, address: String },
    items: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, name: String, price: Number, qty: Number }],
    total: Number,
    status: { type: String, default: 'pending' }
  },
  { timestamps: true }
);
export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
