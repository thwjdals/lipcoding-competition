// 멘토 리스트 관련 컨트롤러


import { users, matchRequests } from '../data.js';

// 멘토 리스트 조회 (멘티만 가능, skill/order_by 쿼리 지원)
export const getMentors = (req, res) => {
  // 인증 및 역할 체크는 라우터에서 처리한다고 가정
  let mentors = users.filter(u => u.role === 'mentor');
  const { skill, order_by } = req.query;
  if (skill) {
    mentors = mentors.filter(m => m.profile.skills && m.profile.skills.includes(skill));
  }
  if (order_by === 'name') {
    mentors.sort((a, b) => a.profile.name.localeCompare(b.profile.name));
  } else if (order_by === 'skill') {
    mentors.sort((a, b) => (a.profile.skills?.[0] || '').localeCompare(b.profile.skills?.[0] || ''));
  } else if (order_by === 'request_count') {
    mentors.sort((a, b) => {
      const aCount = matchRequests.filter(r => r.mentorId === a.id && r.status === 'pending').length;
      const bCount = matchRequests.filter(r => r.mentorId === b.id && r.status === 'pending').length;
      return bCount - aCount;
    });
  } else {
    mentors.sort((a, b) => a.id - b.id);
  }
  res.status(200).json(mentors.map(m => ({
    id: m.id,
    email: m.email,
    role: m.role,
    profile: m.profile,
    requestCount: matchRequests.filter(r => r.mentorId === m.id && r.status === 'pending').length
  })));
};
