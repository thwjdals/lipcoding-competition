// 메모리 DB 역할을 하는 데이터 파일

import bcrypt from 'bcryptjs';

const mentorBios = [
  '안녕하세요! 열정적인 개발자이자 멘토입니다. 함께 성장해요!',
  '실무 경험을 바탕으로 친절하게 도와드릴 수 있습니다.',
  '기초부터 실전까지 꼼꼼하게 알려드릴게요.',
  '최신 트렌드와 실무 노하우를 공유합니다.',
  '멘티의 눈높이에 맞춰 설명하는 것을 좋아합니다.',
  '프로젝트 경험이 풍부한 멘토입니다.',
  '질문 환영! 언제든 편하게 물어보세요.',
  '함께 코딩하며 성장하는 즐거움을 느껴봐요.',
  '실제 사례 중심으로 멘토링합니다.',
  '취업/이직 준비도 도와드릴 수 있습니다.'
];

export const users = [
  // 멘토 13명
  ...Array.from({ length: 13 }).map((_, i) => ({
    id: i + 1,
    email: `mentor${i + 1}@example.com`,
    password: bcrypt.hashSync('password123', 10),
    role: 'mentor',
    profile: {
      name: `멘토${i + 1}`,
      bio: mentorBios[i % mentorBios.length],
      imageUrl: 'https://placehold.co/500x500.jpg?text=MENTOR',
      skills: [
        'React',
        'Node.js',
        'JavaScript',
        'TypeScript',
        'Vue',
        'Python',
        'Java',
        'SQL',
        'AWS',
        'Docker',
      ].slice(0, ((i % 5) + 2)),
      experienceCount: Math.floor(Math.random() * 10) + 1 // 1~10 랜덤 경험 수
    },
  })),
  // 멘티 7명 예시 추가
  ...Array.from({ length: 7 }).map((_, i) => ({
    id: 100 + i + 1,
    email: `mentee${i + 1}@example.com`,
    password: bcrypt.hashSync('password123', 10),
    role: 'mentee',
    profile: {
      name: `멘티${i + 1}`,
      bio: `열정적인 멘티${i + 1}입니다!`,
      imageUrl: 'https://placehold.co/500x500.jpg?text=MENTEE',
    },
  })),
];


export const matchRequests = [
  // 예시 신청 데이터 (상태: pending/accepted/rejected)
  { id: 1, mentorId: 1, menteeId: 101, message: 'React 멘토링 받고 싶어요!', status: 'pending' },
  { id: 2, mentorId: 2, menteeId: 102, message: 'Node.js 궁금한 점이 많아요!', status: 'pending' },
  { id: 3, mentorId: 3, menteeId: 103, message: '포트폴리오 첨삭 부탁드립니다.', status: 'accepted', updatedAt: '2025-06-27T12:00:00Z' },
  { id: 4, mentorId: 4, menteeId: 104, message: '면접 준비 도와주세요.', status: 'rejected', updatedAt: '2025-06-26T15:00:00Z' },
  { id: 5, mentorId: 5, menteeId: 105, message: 'JavaScript 심화 질문 있습니다.', status: 'pending' },
  { id: 6, mentorId: 1, menteeId: 102, message: '멘토님, 실무 경험 듣고 싶어요.', status: 'pending' },
  { id: 7, mentorId: 2, menteeId: 101, message: 'Vue.js도 알려주실 수 있나요?', status: 'pending' },
  { id: 8, mentorId: 3, menteeId: 106, message: '취업 전략 상담 원합니다.', status: 'pending' },
  { id: 9, mentorId: 6, menteeId: 107, message: 'AWS 실습 멘토링 희망합니다.', status: 'pending' },
];

// 요청 이력: 상태가 변경(수락/거절/취소 등)된 요청을 별도로 저장
export const matchRequestHistory = [
  // 예시: { id: 1, mentorId: 1, menteeId: 2, message: '멘토링 받고 싶어요!', status: 'rejected', updatedAt: '2025-06-28T12:00:00Z' }
];

// id 자동 증가를 위한 헬퍼
export let userIdSeq = 1;
export let matchRequestIdSeq = 1;

export function getNextUserId() {
  return userIdSeq++;
}

export function getNextMatchRequestId() {
  return matchRequestIdSeq++;
}
