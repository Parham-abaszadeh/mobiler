import mongoose from 'mongoose';
const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    brand: String,
    category: { type: String, required: true, index: true },
    price: { type: Number, required: true },
    oldPrice: Number,
    colors: [String],
    caption: String,
    description: String,
    specs: [{ k: String, v: String }],
    stock: { type: Number, default: 0, min: 0 },
    sold: { type: Number, default: 0 },
    image: String,
    isOffer: { type: Boolean, default: false }
  },
  { timestamps: true }
);
export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
