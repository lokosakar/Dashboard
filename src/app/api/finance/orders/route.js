import { NextResponse } from 'next/server';
import { dbConnect, Order, Product } from '../../../lib/mongodb';

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { userId, marketplace, items, adminFeePercent = 0, shippingCost = 0, discount = 0, adsCost = 0 } = body;

    let totalRevenue = 0;
    let totalCost = 0;

    // 1. Loop items buat ngitung Revenue, Cost, dan ngurangin Stok
    for (let item of items) {
      // Ambil data produk asli dari DB buat ngecek modal (costPrice)
      const product = await Product.findById(item.productId);
      if (!product) throw new Error(`Produk dengan ID ${item.productId} tidak ditemukan`);
      if (product.stock < item.qty) throw new Error(`Stok ${product.name} tidak cukup! Sisa: ${product.stock}`);

      // Hitung finansial
      totalRevenue += (item.sellPrice * item.qty);
      totalCost += (product.costPrice * item.qty);

      // Simpan costPrice historis ke dalam item order
      item.costPrice = product.costPrice;

      // Kurangi stok produk
      product.stock -= item.qty;
      await product.save();
    }

    // 2. Kalkulasi Auto-Profit
    const grossProfit = totalRevenue - totalCost;
    const marketplaceFee = totalRevenue * (adminFeePercent / 100);
    const netProfit = grossProfit - marketplaceFee - shippingCost - discount - adsCost;

    // 3. Save Order
    const newOrder = await Order.create({
      userId,
      marketplace,
      items,
      adminFeePercent,
      shippingCost,
      discount,
      adsCost,
      totalRevenue,
      totalCost,
      grossProfit,
      marketplaceFee,
      netProfit,
      status: 'Completed'
    });

    return NextResponse.json({ success: true, data: newOrder });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    // Populate buat narik nama produk dari ID-nya
    const orders = await Order.find({ userId }).populate('items.productId').sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}