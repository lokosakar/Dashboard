// src/app/notes/page.js
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button, Row, Col, Typography, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import gsap from 'gsap';
import NoteCard from '../components/notes/NoteCard';
import NoteModal from '../components/notes/NoteModal';
import { useNotes } from '../hooks/useNotes';

const { Title } = Typography;

export default function NotesPage() {
  const { notes, isLoading, createNote } = useNotes();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const containerRef = useRef(null);

  // Animasi GSAP pas kartu notes muncul
  useEffect(() => {
    if (!isLoading && notes.length > 0) {
      gsap.fromTo(
        '.note-card-animate', 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, [notes, isLoading]);

  const handleSave = async (values) => {
    await createNote(values);
    setIsModalVisible(false);
  };

  return (
    <div ref={containerRef}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2} style={{ color: '#fff', margin: 0 }}>My Notes</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => setIsModalVisible(true)}
          style={{ background: '#722ed1', borderColor: '#722ed1' }}
        >
          New Note
        </Button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>
      ) : (
        <Row gutter={[16, 16]}>
          {notes.map(note => (
            <Col xs={24} sm={12} md={8} lg={6} key={note._id} className="note-card-animate">
              <NoteCard 
                note={note} 
                onEdit={() => console.log('Fitur edit menyusul', note)}
                onDelete={() => console.log('Fitur delete menyusul', note._id)}
              />
            </Col>
          ))}
          {notes.length === 0 && (
            <p style={{ color: '#888', margin: 'auto', marginTop: '50px' }}>Belum ada note. Ayo buat "Second Brain" kamu!</p>
          )}
        </Row>
      )}

      <NoteModal 
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSave={handleSave}
      />
    </div>
  );
}