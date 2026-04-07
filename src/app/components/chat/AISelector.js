'use client';

import { Radio } from 'antd';
import { BulbOutlined, LineChartOutlined, EditOutlined } from '@ant-design/icons';

export default function AISelector({ value, onChange }) {
  return (
    <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
      <Radio.Group value={value} onChange={(e) => onChange(e.target.value)} buttonStyle="solid">
        <Radio.Button value="smart"><BulbOutlined /> Smart Assistant</Radio.Button>
        <Radio.Button value="analyst"><LineChartOutlined /> Data Analyst</Radio.Button>
        <Radio.Button value="writer"><EditOutlined /> Pro Writer</Radio.Button>
      </Radio.Group>
    </div>
  );
}