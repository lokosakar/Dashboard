'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useRouter } from 'next/navigation';
import { Card, Form, Input, InputNumber, Button, Table, Typography, message, Tag, Popconfirm } from 'antd';
import { InboxOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function ProductsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [form] = Form.useForm();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) { router.push('/'); return; }
    fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    const res = await fetch(`/api/finance/products?userId=${user.id}`);
    const json = await res.json();
    if (json.success) setProducts(json.data);
  };

  const onFinish = async (values) => {
    setLoading(true);
    const res = await fetch('/api/finance/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...values, userId: user.id })
    });
    if (res.ok) {
      message.success('Mantap! Produk masuk gudang!');
      form.resetFields();
      fetchProducts();
    } else {
      message.error('Gagal nyimpen bro!');
    }
    setLoading(false);
  };

  // FUNGSI PENCET TOMBOL HAPUS
  const handleDelete = async (id) => {
    const res = await fetch(`/api/finance/products?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      message.success('Barang berhasil dibuang!');
      fetchProducts();
    }
  };

  const columns = [
    {
      title: 'Gambar',
      dataIndex: 'imageUrl',
      render: (url) => url ? <img src={url} alt="product" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8, border: '1px solid #333' }} /> : <div style={{ width: 50, height: 50, background: '#333', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📦</div>
    },
    { title: 'Nama Produk', dataIndex: 'name', render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span> },
    { title: 'SKU', dataIndex: 'sku', render: (text) => <Tag>{text}</Tag> },
    { title: 'Stok', dataIndex: 'stock', render: (stock) => <Tag color={stock <= 5 ? 'error' : 'success'}>{stock} Pcs</Tag> },
    { title: 'Harga Jual', dataIndex: 'sellPrice', render: (val) => <span style={{ color: '#4ade80', fontWeight: 'bold' }}>Rp {val?.toLocaleString('id-ID')}</span> },
    // TAMBAHAN KOLOM AKSI HAPUS
    {
      title: 'Aksi',
      key: 'action',
      render: (_, record) => (
        <Popconfirm title="Yakin buang barang ini?" description="Tenang, data kasir gak bakal error." onConfirm={() => handleDelete(record._id)} okText="Hapus" cancelText="Batal" okButtonProps={{ danger: true }}>
          <Button danger type="text" icon={<DeleteOutlined />} />
        </Popconfirm>
      )
    }
  ];

  if (!user) return null;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <Title level={2} style={{ color: '#fff', marginBottom: 24 }}><InboxOutlined style={{ marginRight: 10 }} /> Master Inventory</Title>
      
      <Card title="Tambah Produk Baru" bordered={false} style={{ marginBottom: 24, background: '#1a1a1a' }} headStyle={{ color: '#fff', borderBottom: '1px solid #333' }}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Form.Item name="name" label={<span style={{ color: '#aaa' }}>Nama Produk</span>} rules={[{ required: true }]} style={{ flex: 2 }}><Input size="large" /></Form.Item>
            <Form.Item name="sku" label={<span style={{ color: '#aaa' }}>SKU</span>} rules={[{ required: true }]} style={{ flex: 1 }}><Input size="large" /></Form.Item>
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Form.Item name="costPrice" label={<span style={{ color: '#aaa' }}>Modal (Rp)</span>} rules={[{ required: true }]} style={{ flex: 1 }}><InputNumber size="large" style={{ width: '100%' }} /></Form.Item>
            <Form.Item name="sellPrice" label={<span style={{ color: '#aaa' }}>Jual (Rp)</span>} rules={[{ required: true }]} style={{ flex: 1 }}><InputNumber size="large" style={{ width: '100%' }} /></Form.Item>
            <Form.Item name="stock" label={<span style={{ color: '#aaa' }}>Stok</span>} rules={[{ required: true }]} style={{ flex: 1 }}><InputNumber size="large" style={{ width: '100%' }} /></Form.Item>
          </div>
          <Form.Item name="imageUrl" label={<span style={{ color: '#aaa' }}>Link Gambar</span>}><Input size="large" /></Form.Item>
          <Button type="primary" htmlType="submit" size="large" loading={loading} icon={<PlusOutlined />} style={{ background: '#722ed1', borderColor: '#722ed1' }}>Simpan Ke Gudang</Button>
        </Form>
      </Card>

      <Card title="Daftar Barang" bordered={false} style={{ background: '#1a1a1a' }} headStyle={{ color: '#fff', borderBottom: '1px solid #333' }}>
        <Table dataSource={products} columns={columns} rowKey="_id" pagination={{ pageSize: 10 }} scroll={{ x: 800 }} />
      </Card>
    </div>
  );
}