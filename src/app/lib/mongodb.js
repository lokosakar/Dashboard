import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Tolong tambahin MONGODB_URI di .env.local bro!');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = { bufferCommands: false };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ MANTAP! MongoDB Konek Sempurna!");
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// ==========================================
// 1. AUTH & SECOND BRAIN SCHEMAS
// ==========================================
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

const noteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: String }],
}, { timestamps: true });

// ==========================================
// 2. FINANCE ERP SCHEMAS (NEW)
// ==========================================
const productSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  sku: { type: String, required: true },
  category: { type: String },
  costPrice: { type: Number, required: true },
  sellPrice: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  imageUrl: { type: String, default: '' },
}, { timestamps: true });

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  marketplace: { type: String, required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    qty: { type: Number, required: true },
    sellPrice: { type: Number, required: true },
    costPrice: { type: Number, required: true } // Disimpan saat order terjadi
  }],
  adminFeePercent: { type: Number, default: 0 },
  shippingCost: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  adsCost: { type: Number, default: 0 },
  status: { type: String, default: 'Completed' },
  
  // Auto-calculated fields
  totalRevenue: { type: Number, required: true },
  totalCost: { type: Number, required: true },
  grossProfit: { type: Number, required: true },
  marketplaceFee: { type: Number, required: true },
  netProfit: { type: Number, required: true },
}, { timestamps: true });

// ==========================================
// EXPORT MODELS (Mencegah Error Overwrite Next.js)
// ==========================================
export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Note = mongoose.models.Note || mongoose.model('Note', noteSchema);
export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);