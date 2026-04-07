'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useRouter } from 'next/navigation';
import { Card, Form, Input, InputNumber, Button, Table, Typography, message, Tag, Space } from 'antd';
import { InboxOutlined, PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function ProductsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [form] = Form.useForm();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }
    fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    const res = await fetch(`/api/finance/products?userId=${user.id}`);
    const json = await res.json();
    if (json.success) setProducts(json.data);
  };

  const onFinish = async (values) => {
    setLoading(true);
    
    // Gabungin data form sama ID user yang lagi login
    const productData = { ...values, userId: user.id };

    const res = await fetch('/api/finance/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    
    if (res.ok) {
      message.success('Mantap! Produk baru berhasil masuk gudang!');
      form.resetFields(); // Kosongin form setelah sukses
      fetchProducts(); // Refresh tabel di bawah
    } else {
      const err = await res.json();
      message.error('Gagal nyimpen bro: ' + err.message);
    }
    setLoading(false);
  };

  // ==========================================
  // SETUP KOLOM TABEL INVENTORY
  // ==========================================
  const columns = [
    {
      title: 'Gambar',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (url) => url ? (
        <img src={url} alt="product" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #333' }} />
      ) : (
        <div style={{ width: '50px', height: '50px', background: '#333', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>📦</div>
      )
    },
    {
      title: 'Nama Produk',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span style={{ fontWeight: 'bold', fontSize: '15px' }}>{text}</span>
    },
    {
      title: 'SKU (Kode)',
      dataIndex: 'sku',
      key: 'sku',
      render: (text) => <Tag color="default">{text}</Tag>
    },
    {
      title: 'Sisa Stok',
      dataIndex: 'stock',
      key: 'stock',
      sorter: (a, b) => a.stock - b.stock,
      render: (stock) => (
        <Tag color={stock <= 5 ? 'error' : 'success'} style={{ fontSize: '14px', padding: '4px 8px' }}>
          {stock} Pcs
        </Tag>
      )
    },
    {
      title: 'Modal (Cost)',
      dataIndex: 'costPrice',
      key: 'costPrice',
      sorter: (a, b) => a.costPrice - b.costPrice,
      render: (val) => <span style={{ color: '#f87171' }}>Rp {val.toLocaleString('id-ID')}</span>
    },
    {
      title: 'Harga Jual',
      dataIndex: 'sellPrice',
      key: 'sellPrice',
      sorter: (a, b) => a.sellPrice - b.sellPrice,
      render: (val) => <span style={{ color: '#4ade80', fontWeight: 'bold' }}>Rp {val.toLocaleString('id-ID')}</span>
    }
  ];

  if (!user) return null;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      <Title level={2} style={{ color: '#fff', marginBottom: '24px' }}>
        <InboxOutlined style={{ marginRight: '10px' }} /> 
        Master Inventory
      </Title>

      {/* FORM TAMBAH PRODUK */}
      <Card 
        title="Tambah Produk Baru" 
        bordered={false} 
        style={{ marginBottom: '24px', background: '#1a1a1a' }} 
        headStyle={{ color: '#fff', borderBottom: '1px solid #333' }}
      >
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={onFinish}
        >
          {/* Baris 1: Nama & SKU */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Form.Item name="name" label={<span style={{ color: '#aaa' }}>Nama Produk</span>} rules={[{ required: true, message: 'Wajib diisi bro!' }]} style={{ flex: 2, minWidth: '200px' }}>
              <Input size="large" placeholder="Contoh: Keyboard Mechanical RGB" />
            </Form.Item>
            <Form.Item name="sku" label={<span style={{ color: '#aaa' }}>SKU (Kode Barang)</span>} rules={[{ required: true, message: 'Wajib diisi bro!' }]} style={{ flex: 1, minWidth: '150px' }}>
              <Input size="large" placeholder="Contoh: KB-001" />
            </Form.Item>
          </div>

          {/* Baris 2: Harga & Stok */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Form.Item name="costPrice" label={<span style={{ color: '#aaa' }}>Harga Modal (Rp)</span>} rules={[{ required: true, message: 'Masukin modalnya' }]} style={{ flex: 1, minWidth: '150px' }}>
              <InputNumber size="large" min={0} style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} parser={value => value.replace(/\$\s?|(\.*)/g, '')} />
            </Form.Item>
            
            <Form.Item name="sellPrice" label={<span style={{ color: '#aaa' }}>Harga Jual (Rp)</span>} rules={[{ required: true, message: 'Masukin harga jualnya' }]} style={{ flex: 1, minWidth: '150px' }}>
              <InputNumber size="large" min={0} style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} parser={value => value.replace(/\$\s?|(\.*)/g, '')} />
            </Form.Item>

            <Form.Item name="stock" label={<span style={{ color: '#aaa' }}>Stok Awal</span>} rules={[{ required: true, message: 'Isi stoknya' }]} style={{ flex: 1, minWidth: '100px' }}>
              <InputNumber size="large" min={0} style={{ width: '100%' }} />
            </Form.Item>
          </div>

          {/* Baris 3: Gambar */}
          <Form.Item name="imageUrl" label={<span style={{ color: '#aaa' }}>Link Gambar (Opsional)</span>}>
            <Input size="large" placeholder="https://contoh.com/gambar-produk.png (Bisa dikosongin dulu)" />
          </Form.Item>

          <Button type="primary" htmlType="submit" size="large" loading={loading} icon={<PlusOutlined />} style={{ background: '#722ed1', borderColor: '#722ed1', fontWeight: 'bold' }}>
            Simpan Produk Ke Gudang
          </Button>
        </Form>
      </Card>

      {/* TABEL DAFTAR PRODUK */}
      <Card 
        title="Daftar Barang Di Gudang" 
        bordered={false} 
        style={{ background: '#1a1a1a' }} 
        headStyle={{ color: '#fff', borderBottom: '1px solid #333' }}
      >
        <Table 
          dataSource={products} 
          columns={columns} 
          rowKey="_id" 
          pagination={{ pageSize: 10 }} 
          locale={{ emptyText: 'Gudang masih kosong bro, tambahin barang dulu di atas.' }}
          scroll={{ x: 800 }}
        />
      </Card>

    </div>
  );
}