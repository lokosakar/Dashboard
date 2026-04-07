'use client';

import { useEffect, useRef } from 'react';
import { Row, Col, Card, Statistic, Typography, List, Tag, Spin } from 'antd';
import { BookOutlined, BulbOutlined, HistoryOutlined } from '@ant-design/icons';
import gsap from 'gsap';
import { useNotes } from '../hooks/useNotes';
import { useAuthStore } from '../store/useAuthStore';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Biar bisa nampilin "2 hours ago", "1 day ago", dll
dayjs.extend(relativeTime);

const { Title, Text } = Typography;

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const { notes, isLoading } = useNotes();
  const dashboardRef = useRef(null);

  // 1. Animasi GSAP
  useEffect(() => {
    if (!isLoading) {
      gsap.fromTo(
        '.dashboard-item',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power3.out' }
      );
    }
  }, [isLoading]);

  // 2. Logic AI Insight (Nyari tag yang paling sering dipakai)
  const getAIInsight = () => {
    if (!notes || notes.length === 0) return "Belum cukup data. Yuk mulai tulis ide-ide lu!";
    
    const allTags = notes.flatMap(note => note.tags || []);
    if (allTags.length === 0) return "AI menyarankan lu pakai fitur 'Tags' biar catatan lebih rapi.";

    const tagCounts = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {});

    // Urutin tag dari yang paling banyak
    const topTag = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a])[0];
    
    return `Lu sering banget nulis tentang "${topTag}" akhir-akhir ini. Pertahankan fokusnya!`;
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Spin size="large" />
      </div>
    );
  }

  const recentNotes = notes.slice(0, 5); // Ambil 5 catatan terakhir

  return (
    <div ref={dashboardRef}>
      <Title level={2} style={{ color: '#fff', marginBottom: '8px' }}>
        Welcome back, {user?.email?.split('@')[0]}! 👋
      </Title>
      <Text style={{ color: '#888', fontSize: '16px', display: 'block', marginBottom: '32px' }}>
        Ini ringkasan dari Second Brain lu.
      </Text>

      <Row gutter={[24, 24]}>
        {/* Card 1: Total Notes */}
        <Col xs={24} md={12} lg={8} className="dashboard-item">
          <Card bordered={false} style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px' }}>
            <Statistic 
              title={<span style={{ color: '#aaa' }}>Total Notes</span>}
              value={notes.length} 
              prefix={<BookOutlined style={{ color: '#722ed1', marginRight: '8px' }} />}
              valueStyle={{ color: '#fff', fontSize: '32px', fontWeight: 'bold' }}
            />
          </Card>
        </Col>

        {/* Card 2: AI Insights */}
        <Col xs={24} md={12} lg={16} className="dashboard-item">
          <Card bordered={false} style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ background: '#722ed120', padding: '12px', borderRadius: '50%' }}>
                <BulbOutlined style={{ color: '#722ed1', fontSize: '24px' }} />
              </div>
              <div>
                <Text style={{ color: '#aaa', display: 'block', marginBottom: '4px' }}>AI Insight</Text>
                <Text style={{ color: '#fff', fontSize: '18px' }}>
                  {getAIInsight()}
                </Text>
              </div>
            </div>
          </Card>
        </Col>

        {/* Card 3: Recent Activity (List Note Terakhir) */}
        <Col xs={24} className="dashboard-item">
          <Card 
            title={<span style={{ color: '#fff' }}><HistoryOutlined style={{ marginRight: '8px'}} /> Aktivitas Terakhir</span>} 
            bordered={false} 
            style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px' }}
            headStyle={{ borderBottom: '1px solid #333' }}
          >
            {recentNotes.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={recentNotes}
                renderItem={(item) => (
                  <List.Item style={{ borderBottom: '1px solid #333' }}>
                    <List.Item.Meta
                      title={<span style={{ color: '#fff', fontSize: '16px' }}>{item.title}</span>}
                      description={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                          <Text style={{ color: '#666', fontSize: '12px' }}>
                            {dayjs(item.createdAt).fromNow()}
                          </Text>
                          <div>
                            {item.tags?.slice(0, 2).map(tag => (
                              <Tag color="purple" key={tag} style={{ border: 'none', fontSize: '10px' }}>
                                {tag}
                              </Tag>
                            ))}
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Text style={{ color: '#888' }}>Belum ada aktivitas. Yuk bikin note pertama lu!</Text>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}