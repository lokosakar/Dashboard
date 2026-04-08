import mongoose from 'mongoose';

export const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(process.env.MONGODB_URI);
};

// 1. User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

// 2. Note Schema (Second Brain)
const noteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  isDeleted: { type: Boolean, default: false } // SOFT DELETE
}, { timestamps: true });

// 3. Product Schema (Inventory)
const productSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  sku: { type: String, required: true },
  costPrice: { type: Number, required: true },
  sellPrice: { type: Number, required: true },
  stock: { type: Number, required: true },
  imageUrl: { type: String, default: '' },
  isDeleted: { type: Boolean, default: false } // SOFT DELETE
}, { timestamps: true });

// 4. Order Schema (Kasir)
const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  marketplace: { type: String, required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    qty: { type: Number, required: true },
    sellPrice: { type: Number, required: true }
  }],
  totalRevenue: { type: Number },
  netProfit: { type: Number },
  isDeleted: { type: Boolean, default: false } // SOFT DELETE
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Note = mongoose.models.Note || mongoose.model('Note', noteSchema);
export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);