import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

export default function MatchRequestNavButton() {
  const [role, setRole] = React.useState('');
  const [pendingCount, setPendingCount] = React.useState(0);
  React.useEffect(() => {
    async function fetchRoleAndPending() {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch('/api/me', { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const me = await res.json();
          setRole(me.role);
          if (me.role === 'mentor') {
            const resReq = await fetch('/api/match-requests/incoming', { headers: { Authorization: `Bearer ${token}` } });
            if (resReq.ok) {
              const reqs = await resReq.json();
              setPendingCount((reqs || []).filter(r => r.status === 'pending').length);
            }
          } else if (me.role === 'mentee') {
            const resReq = await fetch(`/api/match-requests/outgoing?menteeId=${me.id}`, { headers: { Authorization: `Bearer ${token}` } });
            if (resReq.ok) {
              const reqs = await resReq.json();
              setPendingCount((reqs || []).length);
            }
          }
        }
      } catch {}
    }
    fetchRoleAndPending();
  }, []);
  return (
    <Link to="/match-requests">
      <Button size="middle" style={{ marginLeft: 8, position: 'relative' }}>
        {role === 'mentor' ? '받은 매칭 요청 관리' : role === 'mentee' ? '신청한 매칭 요청 관리' : '매칭 요청 관리'}
        {role === 'mentor' && pendingCount > 0 && (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 18,
            height: 18,
            borderRadius: '50%',
            background: 'red',
            color: 'white',
            fontSize: 12,
            fontWeight: 700,
            position: 'absolute',
            top: -4,
            right: -14,
            padding: '0 5px',
            zIndex: 1
          }}>{pendingCount}</span>
        )}
      </Button>
    </Link>
  );
}
