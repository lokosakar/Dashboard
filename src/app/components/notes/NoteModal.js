'use client';

import { Modal, Form, Input, Select } from 'antd';
import { useEffect } from 'react';

export default function NoteModal({ visible, onCancel, onSave, initialData, loading }) {
  const [form] = Form.useForm();

  // Update form kalau ada data yang mau di-edit
  useEffect(() => {
    if (visible) {
      if (initialData) {
        form.setFieldsValue(initialData);
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialData, form]);

  return (
    <Modal
      title={initialData ? "Edit Note" : "Create New Note"}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      okText="Save"
    >
      <Form form={form} layout="vertical" onFinish={onSave}>
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input placeholder="Enter note title..." />
        </Form.Item>
        <Form.Item name="tags" label="Tags">
          <Select mode="tags" placeholder="Press enter to add tags" />
        </Form.Item>
        <Form.Item name="content" label="Content" rules={[{ required: true }]}>
          <Input.TextArea rows={6} placeholder="Write your thoughts here..." />
        </Form.Item>
      </Form>
    </Modal>
  );
}