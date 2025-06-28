
import React, { useEffect, useState } from 'react';
import { List, Card, Spin, message, Tag, Button, Typography, Avatar } from 'antd';

const { Title } = Typography;


const MatchRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    async function fetchRequests() {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        // Get user info to determine role and id
        const resMe = await fetch('/api/me', { headers: { Authorization: `Bearer ${token}` } });
        if (!resMe.ok) throw new Error();
        const me = await resMe.json();
        setRole(me.role);
        setUserId(me.id);
        let reqUrl = '';
        if (me.role === 'mentor') {
          reqUrl = '/api/match-requests/incoming';
        } else if (me.role === 'mentee') {
          reqUrl = `/api/match-requests/outgoing?menteeId=${me.id}`;
        } else {
          setRequests([]);
          setLoading(false);
          return;
        }
        const res = await fetch(reqUrl, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          setRequests(data);
        } else {
          message.error('신청 내역을 불러오지 못했습니다.');
        }
      } catch {
        message.error('신청 내역을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    }
    fetchRequests();
  }, []);

  // Helper: pretty status
  const statusColor = (status) => {
    if (status === 'pending') return 'blue';
    if (status === 'accepted') return 'green';
    if (status === 'rejected') return 'red';
    return 'default';
  };

  // Render for mentee: 신청 내역
  const renderMenteeRequests = () => (
    <Card title="내가 신청한 매칭 요청 내역">
      {loading ? (
        <Spin />
      ) : (
        <List
          dataSource={requests}
          locale={{ emptyText: '신청한 매칭 요청이 없습니다.' }}
          renderItem={req => (
            <List.Item>
              <div style={{ width: '100%' }}>
                <b>멘토:</b> {req.mentorName || req.mentor?.name || req.mentorId}
                <Tag color={statusColor(req.status)} style={{ marginLeft: 8 }}>{req.status}</Tag>
                <div style={{ marginTop: 4, color: '#888' }}>{req.message}</div>
                {/* 철회/취소 버튼 등 확장 가능 */}
              </div>
            </List.Item>
          )}
        />
      )}
    </Card>
  );

  // Render for mentor: 받은 요청
  const renderMentorRequests = () => (
    <Card title="받은 매칭 요청 목록">
      {loading ? (
        <Spin />
      ) : (
        <List
          dataSource={requests}
          locale={{ emptyText: '받은 매칭 요청이 없습니다.' }}
          renderItem={req => (
            <List.Item>
              <div style={{ width: '100%' }}>
                <b>멘티:</b> {req.menteeName || req.mentee?.name || req.menteeId}
                <Tag color={statusColor(req.status)} style={{ marginLeft: 8 }}>{req.status}</Tag>
                <div style={{ marginTop: 4, color: '#888' }}>{req.message}</div>
                {/* 수락/거절 버튼 등 확장 가능 */}
              </div>
            </List.Item>
          )}
        />
      )}
    </Card>
  );

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: 24 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
        {role === 'mentor' ? '받은 매칭 요청 관리' : role === 'mentee' ? '신청한 매칭 요청 관리' : '매칭 요청 관리'}
      </Title>
      {role === 'mentor' && renderMentorRequests()}
      {role === 'mentee' && renderMenteeRequests()}
      {!role && (
        <Card><Spin />로그인 후 이용 가능합니다.</Card>
      )}
    </div>
  );
};

export default MatchRequestsPage;
