'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useRouter } from 'next/navigation';
import { Card, Typography, Row, Col, Statistic, Tag, Skeleton } from 'antd';
import { WalletOutlined, RiseOutlined, ShoppingOutlined, BookOutlined, RocketOutlined } from '@ant-design/icons';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const { Title, Text } = Typography;

export default function DashboardPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ revenue: 0, profit: 0, orders: 0, products: 0, notes: 0 });
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    if (!user) { router.push('/'); return; }
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Tarik 3 data sekaligus secara paralel biar cepet!
      const [resOrders, resProducts, resNotes] = await Promise.all([
        fetch(`/api/finance/orders?userId=${user.id}`),
        fetch(`/api/finance/products?userId=${user.id}`),
        fetch(`/api/notes?userId=${user.id}`)
      ]);

      const jsonOrders = await resOrders.json();
      const jsonProducts = await resProducts.json();
      const jsonNotes = await resNotes.json();

      const orders = jsonOrders.data || [];
      const products = jsonProducts.data || [];
      const notes = jsonNotes.data || [];

      // 1. Hitung Angka Summary
      const totalRev = orders.reduce((sum, ord) => sum + (ord.totalRevenue || 0), 0);
      const totalProf = orders.reduce((sum, ord) => sum + (ord.netProfit || 0), 0);

      setStats({
        revenue: totalRev,
        profit: totalProf,
        orders: orders.length,
        products: products.length,
        notes: notes.length
      });

      // 2. Olah Data Buat Grafik Garis (Omzet Harian)
      const groupedByDate = orders.reduce((acc, order) => {
        const dateObj = new Date(order.createdAt);
        const dateStr = `${dateObj.getDate()}/${dateObj.getMonth() + 1}`; // Format: Tgl/Bln
        
        if (!acc[dateStr]) acc[dateStr] = { name: dateStr, Omzet: 0, Profit: 0 };
        acc[dateStr].Omzet += order.totalRevenue || 0;
        acc[dateStr].Profit += order.netProfit || 0;
        return acc;
      }, {});
      
      // Ambil 7 hari terakhir aja biar grafiknya gak kepanjangan
      setChartData(Object.values(groupedByDate).slice(-7));

      // 3. Olah Data Buat Grafik Donat (Marketplace Terlaris)
      const groupedByMarket = orders.reduce((acc, order) => {
        const market = order.marketplace || 'Lainnya';
        if (!acc[market]) acc[market] = { name: market, value: 0 };
        acc[market].value += 1;
        return acc;
      }, {});
      setPieData(Object.values(groupedByMarket));

    } catch (error) {
      console.error("Gagal narik data dashboard", error);
    }
    setLoading(false);
  };

  // Warna buat Pie Chart
  const COLORS = ['#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'];

  if (!user) return null;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <Title level={2} style={{ color: '#fff', margin: 0 }}>
            Welcome back, <span style={{ color: '#8b5cf6' }}>Boss!</span> 🚀
          </Title>
          <Text style={{ color: '#aaa', fontSize: 16 }}>Ini rangkuman kerajaan bisnis lu hari ini.</Text>
        </div>
        <Tag color="purple" style={{ padding: '6px 16px', fontSize: 14, borderRadius: 20 }}>
          <RiseOutlined /> System Status: Excellent
        </Tag>
      </div>

      {loading ? (
        <Skeleton active paragraph={{ rows: 10 }} />
      ) : (
        <>
          {/* BARIS 1: KOTAK ANGKA (SUMMARY CARDS) */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
              <Card bordered={false} style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)', border: '1px solid #333' }}>
                <Statistic title={<span style={{ color: '#aaa' }}>Total Omzet</span>} value={stats.revenue} prefix="Rp" valueStyle={{ color: '#fff', fontWeight: 'bold' }} />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card bordered={false} style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, #0a0a0a 100%)', border: '1px solid #10b981' }}>
                <Statistic title={<span style={{ color: '#aaa' }}>Net Profit (Cuan Bersih)</span>} value={stats.profit} prefix="Rp" valueStyle={{ color: '#10b981', fontWeight: 'bold' }} />
              </Card>
            </Col>
            <Col xs={12} sm={12} lg={6}>
              <Card bordered={false} style={{ background: '#1a1a1a', border: '1px solid #333' }}>
                <Statistic title={<span style={{ color: '#aaa' }}>Total Transaksi</span>} value={stats.orders} prefix={<ShoppingOutlined style={{ color: '#8b5cf6' }}/>} valueStyle={{ color: '#fff' }} />
              </Card>
            </Col>
            <Col xs={12} sm={12} lg={6}>
              <Card bordered={false} style={{ background: '#1a1a1a', border: '1px solid #333' }}>
                <Statistic title={<span style={{ color: '#aaa' }}>Aset Data</span>} value={stats.products + stats.notes} prefix={<BookOutlined style={{ color: '#ec4899' }}/>} valueStyle={{ color: '#fff' }} suffix="Items" />
              </Card>
            </Col>
          </Row>

          {/* BARIS 2: GRAFIK ANALYTICS */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            {/* Grafik Garis (Omzet) */}
            <Col xs={24} lg={16}>
              <Card title="📈 Tren Penjualan Harian" bordered={false} style={{ background: '#1a1a1a', border: '1px solid #333' }} headStyle={{ color: '#fff', borderBottom: '1px solid #333' }}>
                <div style={{ width: '100%', height: 300 }}>
                  {chartData.length > 0 ? (
                    <ResponsiveContainer>
                      <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorOmzet" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                        <XAxis dataKey="name" stroke="#888" tick={{ fill: '#888' }} />
                        <YAxis stroke="#888" tick={{ fill: '#888' }} tickFormatter={(value) => `${value / 1000}k`} />
                        <Tooltip contentStyle={{ background: '#222', border: '1px solid #444', borderRadius: 8 }} itemStyle={{ color: '#fff' }} />
                        <Area type="monotone" dataKey="Omzet" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorOmzet)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>Belum ada data penjualan nih Boss.</div>
                  )}
                </div>
              </Card>
            </Col>

            {/* Grafik Donat (Marketplace) */}
            <Col xs={24} lg={8}>
              <Card title="🎯 Sumber Order" bordered={false} style={{ background: '#1a1a1a', border: '1px solid #333', height: '100%' }} headStyle={{ color: '#fff', borderBottom: '1px solid #333' }}>
                <div style={{ width: '100%', height: 300 }}>
                  {pieData.length > 0 ? (
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ background: '#222', border: 'none', borderRadius: 8, color: '#fff' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>Ordernya masih sepi.</div>
                  )}
                </div>
              </Card>
            </Col>
          </Row>

          {/* BARIS 3: QUICK LINKS (MENU CEPAT) */}
          <Title level={4} style={{ color: '#fff', marginTop: 16 }}>⚡ Quick Actions</Title>
          <Row gutter={[16, 16]}>
            {[
              { title: 'Tulis Catatan', icon: <BookOutlined />, path: '/notes', color: '#108ee9' },
              { title: 'Tanya AI', icon: <RocketOutlined />, path: '/chat', color: '#722ed1' },
              { title: 'Kasir', icon: <ShoppingOutlined />, path: '/finance/orders', color: '#10b981' }
            ].map((mod, idx) => (
              <Col xs={12} sm={8} key={idx}>
                <Card hoverable onClick={() => router.push(mod.path)} style={{ background: '#111', border: '1px solid #333', textAlign: 'center' }} bodyStyle={{ padding: '16px' }}>
                  <div style={{ fontSize: 24, color: mod.color, marginBottom: 8 }}>{mod.icon}</div>
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>{mod.title}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </div>
  );
}