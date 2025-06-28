import React, { useEffect, useState } from 'react';
import { Card, Typography, List, Avatar, Tag, Spin, message, Button } from 'antd';
import { Link } from 'react-router-dom';
import { publicApi } from '../api';
import MatchRequestNavButton from '../components/MatchRequestNavButton';

const { Title } = Typography;

const DashboardPage = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myProfile, setMyProfile] = useState(null);
  const [orderBy, setOrderBy] = useState('name');
  const [myRequests, setMyRequests] = useState([]);
  const [myRole, setMyRole] = useState('');
  const [myId, setMyId] = useState(null);

  console.log('myProfile:', myProfile);

  // 멘토 목록 최초 로딩
  useEffect(() => {
    async function fetchMentors() {
      try {
        const res = await publicApi().get('/mentors', {
          params: { order_by: orderBy },
        });
        setMentors(res.data || []);
      } catch (e) {
        message.error('멘토 목록을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    }
    fetchMentors();
  }, [orderBy]);

  // 내 정보 및 내가 보낸 요청 목록 가져오기
  useEffect(() => {
    async function fetchMyInfoAndRequests() {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const resMe = await fetch('/api/me', { headers: { Authorization: `Bearer ${token}` } });
        if (resMe.ok) {
          const me = await resMe.json();
          setMyId(me.id);
          setMyProfile(me.profile);
          setMyRole(me.role);
          const resReq = await fetch(`/api/match-requests/outgoing?menteeId=${me.id}`, { headers: { Authorization: `Bearer ${token}` } });
          if (resReq.ok) {
            const reqs = await resReq.json();
            setMyRequests(reqs.filter(r => r.status === 'pending'));
          }
        }
      } catch {}
    }
    fetchMyInfoAndRequests();
  }, []);

  // (불필요한 중복 useEffect 제거)

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: 24 }}>
      {/* 상단 네비게이션 바 */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 16 }}>
        {myId ? (
          <>
            {myProfile?.imageUrl && (
              <Avatar
                src={myProfile.imageUrl}
                size={40}
                style={{ marginRight: 12, border: '2px solid #eee', background: '#fff' }}
              />
            )}
            <Link to="/profile">
              <Button type="primary" size="middle" style={{ marginLeft: 8 }}>
                내 프로필로 가기
              </Button>
            </Link>
            <MatchRequestNavButton />
            <Button
              size="middle"
              style={{ marginLeft: 8 }}
              onClick={() => {
                localStorage.removeItem('token');
                window.location.reload();
                }}
              >
                로그아웃
              </Button>
              </>
            ) : (
              <>
              <Link to="/signup">
                <Button size="middle" style={{ marginLeft: 8 }}>
                회원가입
                </Button>
              </Link>
              <Link to="/login">
                <Button size="middle" style={{ marginLeft: 8 }}>
                로그인
                </Button>
              </Link>
              </>
            )}
            </div>
            <Title level={2} style={{ textAlign: 'center' }}>멘토 리스트</Title>
            <Card style={{ marginBottom: 24 }}>
            <span style={{ marginRight: 8 }}>정렬:</span>
            <select value={orderBy} onChange={e => setOrderBy(e.target.value)} style={{ marginRight: 8 }}>
              <option value="name" id="name">이름순</option>
              <option value="skill" id="skill">스킬순</option>
              <option value="request_count" id="request-count">요청 많은순</option>
            </select>
            </Card>
            <Card>
            {loading || (!!myId && !myProfile) ? (
              <Spin style={{ display: 'block', margin: '40px auto' }} />
            ) : (
              <List
              itemLayout="vertical"
              dataSource={mentors}
              renderItem={mentor => {
              const isLoggedIn = !!myId;
              const alreadyRequested = isLoggedIn && myRequests.some(r => r.mentorId === mentor.id);
              // ...existing code for mentor card rendering...
              // (아래 부분은 기존과 동일하게 유지)
              let border, background, boxShadow, nameColor, nameShadow;
              if (alreadyRequested) {
                border = '2.5px solid #1890ff';
                background = 'linear-gradient(90deg, #e6f7ff 0%, #bae7ff 100%)';
                boxShadow = '0 0 16px 4px #1890ff, 0 0 0 4px #fff inset';
                nameColor = '#096dd9';
                nameShadow = '0 0 4px #bae7ff';
              } else if (mentor.requestCount > 10) {
                border = '2px solid #faad14';
                background = 'linear-gradient(90deg, #fffbe6 0%, #fff1b8 100%)';
                boxShadow = '0 0 16px 4px #faad14, 0 0 0 4px #fff inset';
                nameColor = '#d48806';
                nameShadow = '0 0 4px #ffe58f';
              }
              return (
                <List.Item
                  className="mentor"
                  style={{
                    marginBottom: 24,
                    boxShadow,
                    border,
                    background,
                    transition: 'all 0.3s',
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        id="profile-photo"
                        src={mentor.profile?.imageUrl || 'https://placehold.co/500x500.jpg?text=MENTOR'}
                        size={96}
                        shape="square"
                        style={{
                          marginRight: 24,
                          border: border || '1px solid #eee',
                          boxShadow: boxShadow?.replace('16px 4px', '8px 2px'),
                          transition: 'all 0.3s',
                        }}
                      />
                    }
                    title={
                      <span style={{
                        fontSize: 20,
                        fontWeight: 600,
                        color: nameColor,
                        textShadow: nameShadow,
                      }}>
                        {mentor.profile?.name}
                        {isLoggedIn && alreadyRequested && (
                          <span style={{ marginLeft: 8, fontSize: 16, color: '#1890ff' }}>🔵</span>
                        )}
                        {(!alreadyRequested && mentor.requestCount > 10) && (
                          <span style={{ marginLeft: 8, fontSize: 16, color: '#faad14' }}>★</span>
                        )}
                      </span>
                    }
                    description={
                      <>
                        <div style={{ margin: '8px 0' }}>{mentor.profile?.bio}</div>
                        <div>
                          {mentor.profile?.skills && mentor.profile.skills.map(skill => (
                            <Tag color="blue" key={skill} id="skill">{skill}</Tag>
                          ))}
                        </div>
                        <div style={{ marginTop: 8, color: '#888' }}>
                          🏆 멘토링 경험: {mentor.profile?.experienceCount ?? 0}회
                        </div>
                        <div style={{ marginTop: 4, color: alreadyRequested ? '#096dd9' : '#d46b08', fontWeight: alreadyRequested ? 700 : mentor.requestCount > 10 ? 700 : 400 }}>
                          📩 받은 요청: {mentor.requestCount ?? 0}개
                          {isLoggedIn && alreadyRequested && (
                            <span style={{ marginLeft: 8, color: '#1890ff', fontWeight: 700 }}>
                              이미 요청함
                            </span>
                          )}
                          {!alreadyRequested && mentor.requestCount > 10 && (
                            <span style={{ marginLeft: 8, color: '#faad14', fontWeight: 700 }}>
                              인기 멘토!
                            </span>
                          )}
                        </div>
                        {isLoggedIn && myRole === 'mentee' && (
                          alreadyRequested ? (
                            <Button
                              danger
                              size="small"
                              style={{ marginTop: 12 }}
                              onClick={async () => {
                                try {
                                  const token = localStorage.getItem('token');
                                  // 요청 객체에서 해당 mentorId의 요청 id 찾기 (실제 API에 맞게 조정 필요)
                                  const reqObj = myRequests.find(r => r.mentorId === mentor.id);
                                  if (!reqObj || !reqObj.id) {
                                    message.error('요청 정보가 올바르지 않습니다.');
                                    return;
                                  }
                                  const res = await fetch(`/api/match-requests/${reqObj.id}`, {
                                    method: 'DELETE',
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                    },
                                  });
                                  if (res.ok) {
                                    message.success('매칭 요청이 철회되었습니다.');
                                    setMyRequests(prev => prev.filter(r => r.mentorId !== mentor.id));
                                  } else {
                                    message.error('매칭 요청 철회에 실패했습니다.');
                                  }
                                } catch {
                                  message.error('매칭 요청 철회 중 오류가 발생했습니다.');
                                }
                              }}
                            >
                              매칭 요청 철회
                            </Button>
                          ) : (
                            <Button
                              type="primary"
                              size="small"
                              style={{ marginTop: 12 }}
                              onClick={async () => {
                                try {
                                  const token = localStorage.getItem('token');
                                  const res = await fetch('/api/match-requests', {
                                    method: 'POST',
                                    headers: {
                                      'Content-Type': 'application/json',
                                      Authorization: `Bearer ${token}`,
                                    },
                                    body: JSON.stringify({ mentorId: mentor.id, menteeId: myId, message: '멘토링을 받고 싶습니다!' }),
                                  });
                                  if (res.ok) {
                                    // 실제 응답에 요청 id가 있다면 반영
                                    const data = await res.json();
                                    message.success('매칭 요청이 전송되었습니다!');
                                    setMyRequests(prev => [...prev, { mentorId: mentor.id, status: 'pending', id: data.id }]);
                                  } else {
                                    message.error('매칭 요청에 실패했습니다.');
                                  }
                                } catch {
                                  message.error('매칭 요청 중 오류가 발생했습니다.');
                                }
                              }}
                            >
                              매칭 신청하기
                            </Button>
                          )
                        )}
                      </>
                    }
                  />
                </List.Item>
              );
            }}
          />
        )}
      </Card>
    </div>
  );
};

export default DashboardPage;
