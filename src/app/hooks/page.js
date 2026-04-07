'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '.././store/useAuthStore'; // Sesuaikan path Zustand lu
import { useRouter } from 'next/navigation';

export default function ProductsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({ name: '', sku: '', costPrice: 0, sellPrice: 0, stock: 0, imageUrl: '' });

  useEffect(() => {
    if (!user) {
      router.push('/'); // Lempar ke login kalau belum masuk
      return;
    }
    fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    const res = await fetch(`/api/finance/products?userId=${user.id}`);
    const json = await res.json();
    if (json.success) setProducts(json.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/finance/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, userId: user.id })
    });
    
    if (res.ok) {
      fetchProducts(); // Refresh tabel
      setFormData({ name: '', sku: '', costPrice: 0, sellPrice: 0, stock: 0, imageUrl: '' }); // Reset
    }
    setLoading(false);
  };

  if (!user) return null;

  return (
    <div className="p-8 bg-[#121212] min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-8 text-purple-400">Inventory Products</h1>

      {/* TAMPILAN FORM ADD PRODUCT */}
      <div className="bg-[#1e1e1e] p-6 rounded-xl mb-8 border border-gray-800">
        <h2 className="text-xl mb-4 font-semibold">Tambah Produk Baru</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input className="p-3 bg-black border border-gray-700 rounded text-white" placeholder="Nama Produk" required 
            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <input className="p-3 bg-black border border-gray-700 rounded text-white" placeholder="SKU (Kode Barang)" required 
            value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} />
          <input className="p-3 bg-black border border-gray-700 rounded text-white" type="number" placeholder="Modal (Cost Price)" required 
            value={formData.costPrice} onChange={e => setFormData({...formData, costPrice: Number(e.target.value)})} />
          <input className="p-3 bg-black border border-gray-700 rounded text-white" type="number" placeholder="Harga Jual (Sell Price)" required 
            value={formData.sellPrice} onChange={e => setFormData({...formData, sellPrice: Number(e.target.value)})} />
          <input className="p-3 bg-black border border-gray-700 rounded text-white" type="number" placeholder="Stok Awal" required 
            value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} />
          <input className="p-3 bg-black border border-gray-700 rounded text-white" placeholder="URL Gambar (Opsional)" 
            value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
          
          <button disabled={loading} type="submit" className="col-span-2 bg-purple-600 hover:bg-purple-700 p-3 rounded font-bold transition-all">
            {loading ? 'Menyimpan...' : '+ Simpan Produk'}
          </button>
        </form>
      </div>

      {/* TABLE PRODUCTS */}
      <div className="bg-[#1e1e1e] p-6 rounded-xl border border-gray-800 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700 text-gray-400">
              <th className="pb-3">Gambar</th>
              <th className="pb-3">Produk</th>
              <th className="pb-3">SKU</th>
              <th className="pb-3">Stok</th>
              <th className="pb-3">Modal</th>
              <th className="pb-3">Harga Jual</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id} className="border-b border-gray-800 hover:bg-gray-800 transition-all">
                <td className="py-3">
                  {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="w-12 h-12 object-cover rounded" /> : <div className="w-12 h-12 bg-gray-700 rounded"></div>}
                </td>
                <td className="py-3 font-semibold">{p.name}</td>
                <td className="py-3 text-gray-400">{p.sku}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${p.stock <= 5 ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'}`}>
                    {p.stock} pcs
                  </span>
                </td>
                <td className="py-3 text-red-400">Rp {p.costPrice.toLocaleString('id-ID')}</td>
                <td className="py-3 text-green-400">Rp {p.sellPrice.toLocaleString('id-ID')}</td>
              </tr>
            ))}
            {products.length === 0 && <tr><td colSpan="6" className="text-center py-6 text-gray-500">Belum ada produk.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}