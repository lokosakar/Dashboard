'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '.././store/useAuthStore';
import { Card, Button, Input, Modal, Form, Row, Col, Typography, message, Popconfirm, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, BookOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export default function NotesPage() {
  const { user } = useAuthStore();
  const [notes, setNotes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => { if (user) fetchNotes(); }, [user]);

  const fetchNotes = async () => {
    const res = await fetch(`/api/notes?userId=${user.id}`);
    const json = await res.json();
    setNotes(json.data);
  };

  const handleSave = async (values) => {
    const method = editingNote ? 'PUT' : 'POST';
    const payload = editingNote ? { ...values, id: editingNote._id } : { ...values, userId: user.id };

    const res = await fetch('/api/notes', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      message.success(editingNote ? 'Catatan diupdate!' : 'Catatan ditambah!');
      setIsModalOpen(false);
      setEditingNote(null);
      form.resetFields();
      fetchNotes();
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/notes?id=${id}`, { method: 'DELETE' });
    if (res.ok) { message.success('Dibuang ke tong sampah!'); fetchNotes(); }
  };

  const openEdit = (note) => {
    setEditingNote(note);
    form.setFieldsValue(note);
    setIsModalOpen(true);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 32 }}>
        <Title level={2} style={{ color: '#fff', margin: 0 }}><BookOutlined /> Second Brain</Title>
        <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => { setEditingNote(null); form.resetFields(); setIsModalOpen(true); }}>
          Tambah Ide Baru
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        {notes.map(note => (
          <Col xs={24} sm={12} lg={8} key={note._id}>
            <Card 
              style={{ background: '#1a1a1a', border: '1px solid #333' }}
              actions={[
                <EditOutlined key="edit" onClick={() => openEdit(note)} />,
                <Popconfirm title="Hapus catatan?" onConfirm={() => handleDelete(note._id)} okText="Ya" cancelText="Batal">
                  <DeleteOutlined key="delete" style={{ color: '#ff4d4f' }} />
                </Popconfirm>
              ]}
            >
              <Card.Meta 
                title={<span style={{ color: '#fff' }}>{note.title}</span>} 
                description={<Paragraph ellipsis={{ rows: 3 }} style={{ color: '#aaa' }}>{note.content}</Paragraph>}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Modal 
        title={editingNote ? "Edit Catatan" : "Catatan Baru"} 
        open={isModalOpen} 
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        style={{ borderRadius: 12 }}
      >
        <Form form={form} layout="vertical" onFinish={handleSave} style={{ marginTop: 20 }}>
          <Form.Item name="title" label="Judul Ide" rules={[{ required: true }]}>
            <Input placeholder="Mau catat apa Boss?" />
          </Form.Item>
          <Form.Item name="content" label="Isi Catatan" rules={[{ required: true }]}>
            <Input.TextArea rows={6} placeholder="Tulis detailnya di sini..." />
          </Form.Item>
          <Button type="primary" htmlType="submit" block size="large">Simpan Brain</Button>
        </Form>
      </Modal>
    </div>
  );
}