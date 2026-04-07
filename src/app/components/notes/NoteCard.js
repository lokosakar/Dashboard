
// src/components/notes/NoteCard.js
'use client';

import { Card, Tag, Popconfirm, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

export default function NoteCard({ note, onEdit, onDelete }) {
  return (
    <Card
      className="note-card"
      actions={[
        <Tooltip title="Edit Note" key="edit">
          <EditOutlined onClick={() => onEdit(note)} style={{ color: '#722ed1' }} />
        </Tooltip>,
        <Popconfirm
          key="delete"
          title="Hapus Note"
          description="Yakin mau hapus catatan ini?"
          onConfirm={() => onDelete(note._id)}
          okText="Hapus"
          cancelText="Batal"
          okButtonProps={{ danger: true }}
        >
          <Tooltip title="Delete Note">
            <DeleteOutlined style={{ color: '#ff4d4f' }} />
          </Tooltip>
        </Popconfirm>,
      ]}
      bordered={false}
    >
      <Card.Meta
        title={<span style={{ color: '#fff', fontSize: '18px' }}>{note.title}</span>}
        description={
          <div style={{ color: '#aaa', marginTop: '8px' }}>
            {/* Teks dibatasi max 3 baris biar rapi */}
            <p style={{ 
              margin: '0 0 16px 0', 
              display: '-webkit-box', 
              WebkitLineClamp: 3, 
              WebkitBoxOrient: 'vertical', 
              overflow: 'hidden',
              minHeight: '65px'
            }}>
              {note.content}
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                {note.tags?.map(tag => (
                  <Tag color="purple" key={tag} style={{ border: 'none' }}>
                    {tag}
                  </Tag>
                ))}
              </div>
              {/* Format tanggal pakai dayjs */}
              <span style={{ fontSize: '12px', color: '#555' }}>
                {dayjs(note.createdAt).format('DD MMM YYYY')}
              </span>
            </div>
          </div>
        }
      />
    </Card>
  );
}