import mongoose from 'mongoose';
export const ORDER_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'];

const OrderSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true, sparse: true },
    customer: { name: String, phone: String, address: String },
    items: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, name: String, price: Number, qty: Number }],
    total: Number,
    method: { type: String, enum: ['cash', 'installment'], default: 'cash' },
    status: { type: String, enum: ORDER_STATUSES, default: 'pending', index: true }
  },
  { timestamps: true }
);
export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
