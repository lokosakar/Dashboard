'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useRouter } from 'next/navigation';
import { Card, Form, Select, InputNumber, Button, Table, Typography, message, Tag, Space, Divider } from 'antd';
import { ShoppingCartOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function OrdersPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [form] = Form.useForm();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }
    fetchProducts();
    fetchOrders();
  }, [user]);

  const fetchProducts = async () => {
    const res = await fetch(`/api/finance/products?userId=${user.id}`);
    const json = await res.json();
    if (json.success) setProducts(json.data.filter(p => p.stock > 0)); 
  };

  const fetchOrders = async () => {
    const res = await fetch(`/api/finance/orders?userId=${user.id}`);
    const json = await res.json();
    if (json.success) setOrders(json.data);
  };

  const onFinish = async (values) => {
    // Validasi kalau keranjang kosong
    if (!values.items || values.items.length === 0) {
      return message.error('Tambahin minimal 1 barang dulu bro!');
    }

    setLoading(true);

    // Kita mapping setiap barang yang ditambahin buat dicari harga jual aslinya
    const mappedItems = values.items.map(item => {
      const productDetail = products.find(p => p._id === item.productId);
      return {
        productId: item.productId,
        qty: item.qty,
        sellPrice: productDetail.sellPrice, // Otomatis narik harga jual dari master produk
      };
    });

    const newOrderData = {
      userId: user.id,
      marketplace: values.marketplace,
      adminFeePercent: 5, // Default fee 5%
      items: mappedItems
    };

    const res = await fetch('/api/finance/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrderData)
    });
    
    if (res.ok) {
      message.success('Order beruntun berhasil dibuat! Cuan ngalir!');
      form.resetFields(['items']); // Kosongin keranjangnya aja, marketplace biarin
      fetchOrders();
      fetchProducts(); // Refresh stok produk biar update
    } else {
      const err = await res.json();
      message.error('Gagal: ' + err.message);
    }
    setLoading(false);
  };

  // ==========================================
  // SETUP KOLOM TABEL (DENGAN FILTER & SORTER)
  // ==========================================
  const columns = [
    {
      title: 'Tanggal',
      dataIndex: 'createdAt',
      key: 'createdAt',
      // Sorter buat ngurutin dari yang terbaru/terlama
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (text) => <span style={{ color: '#aaa' }}>{new Date(text).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
    },
    {
      title: 'Marketplace',
      dataIndex: 'marketplace',
      key: 'marketplace',
      // Fitur Filter by Marketplace
      filters: [
        { text: 'Shopee', value: 'Shopee' },
        { text: 'Tokopedia', value: 'Tokopedia' },
        { text: 'Tiktok Shop', value: 'Tiktok' },
        { text: 'Offline / WA', value: 'Offline' },
      ],
      onFilter: (value, record) => record.marketplace === value,
      render: (text) => <Tag color="purple">{text}</Tag>
    },
    {
      title: 'Item Terjual (Keranjang)',
      key: 'item',
      // Render banyak barang dalam 1 baris order
      render: (_, record) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {record.items.map((item, idx) => (
            <div key={idx} style={{ fontSize: '13px', color: '#e5e7eb' }}>
              • {item.productId ? item.productId.name : 'Produk Terhapus'} 
              <Tag color="blue" style={{ marginLeft: 8, border: 'none' }}>x{item.qty}</Tag>
            </div>
          ))}
        </div>
      )
    },
    {
      title: 'Omzet (Revenue)',
      dataIndex: 'totalRevenue',
      key: 'totalRevenue',
      sorter: (a, b) => a.totalRevenue - b.totalRevenue,
      render: (val) => <span style={{ color: '#60a5fa' }}>Rp {val.toLocaleString('id-ID')}</span>
    },
    {
      title: 'Profit Bersih',
      dataIndex: 'netProfit',
      key: 'netProfit',
      // Sorter buat nyari "Pesanan Terbaik" (Cuan Paling Gede)
      sorter: (a, b) => a.netProfit - b.netProfit,
      defaultSortOrder: 'descend', // Otomatis yang untungnya paling gede di atas
      render: (val) => <span style={{ color: '#4ade80', fontWeight: 'bold' }}>Rp {val.toLocaleString('id-ID')}</span>
    }
  ];

  if (!user) return null;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      <Title level={2} style={{ color: '#fff', marginBottom: '24px' }}>
        <ShoppingCartOutlined style={{ marginRight: '10px' }} /> 
        Sales & Orders
      </Title>

      {/* FORM KASIR DINAMIS */}
      <Card 
        title="Kasir Pintar (Bisa Tambah Banyak Barang)" 
        bordered={false} 
        style={{ marginBottom: '24px', background: '#1a1a1a' }} 
        headStyle={{ color: '#fff', borderBottom: '1px solid #333' }}
      >
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={onFinish} 
          // Defaultnya minimal ada 1 slot barang kosong buat diisi
          initialValues={{ marketplace: 'Shopee', items: [{ productId: undefined, qty: 1 }] }}
        >
          <Form.Item name="marketplace" label={<span style={{ color: '#aaa' }}>Platform Penjualan</span>} style={{ maxWidth: '300px' }}>
            <Select size="large">
              <Select.Option value="Shopee">Shopee</Select.Option>
              <Select.Option value="Tokopedia">Tokopedia</Select.Option>
              <Select.Option value="Tiktok">Tiktok Shop</Select.Option>
              <Select.Option value="Offline">Offline / WA</Select.Option>
            </Select>
          </Form.Item>

          <Divider style={{ borderColor: '#333', color: '#777' }}>Daftar Keranjang Belanja</Divider>

          {/* INI KUNCI BUAT NAMBAHIN BARANG BANYAK (DYNAMIC FIELDS) */}
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    
                    <Form.Item
                      {...restField}
                      name={[name, 'productId']}
                      rules={[{ required: true, message: 'Pilih produknya bro!' }]}
                      style={{ width: '400px' }}
                    >
                      <Select size="large" placeholder="-- Pilih Barang dari Inventory --">
                        {products.map(p => (
                          <Select.Option key={p._id} value={p._id}>
                            {p.name} (Sisa Stok: {p.stock})
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'qty']}
                      rules={[{ required: true, message: 'Isi jumlahnya' }]}
                    >
                      <InputNumber size="large" min={1} placeholder="Qty" />
                    </Form.Item>

                    <MinusCircleOutlined 
                      style={{ color: '#ef4444', fontSize: '20px', marginLeft: '10px' }} 
                      onClick={() => remove(name)} 
                    />
                  </Space>
                ))}
                
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} style={{ borderColor: '#722ed1', color: '#b37feb', height: '50px' }}>
                    Tambah Barang Ke Keranjang
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Button type="primary" htmlType="submit" size="large" loading={loading} style={{ background: '#722ed1', borderColor: '#722ed1', fontWeight: 'bold', width: '100%', height: '50px', fontSize: '16px' }}>
            Proses Order Sekarang!
          </Button>
        </Form>
      </Card>

      {/* TABEL PINTAR */}
      <Card 
        title="Buku Penjualan" 
        bordered={false} 
        style={{ background: '#1a1a1a' }} 
        headStyle={{ color: '#fff', borderBottom: '1px solid #333' }}
      >
        <Table 
          dataSource={orders} 
          columns={columns} 
          rowKey="_id" 
          pagination={{ pageSize: 10 }} 
          locale={{ emptyText: 'Belum ada penjualan nih bro.' }}
          scroll={{ x: 800 }} // Biar gak rusak kalau di layar kecil
        />
      </Card>

    </div>
  );
}

