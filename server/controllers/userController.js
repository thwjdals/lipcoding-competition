// 사용자 정보 관련 컨트롤러
// 내 정보 조회, 프로필 이미지, 프로필 수정

import { users } from '../data.js';

// JWT 토큰에서 id, email, role 추출 (base64 디코딩)
function parseToken(token) {
  try {
    const [id, email, role] = Buffer.from(token, 'base64').toString().split(':');
    return { id: Number(id), email, role };
  } catch {
    return null;
  }
}

// 내 정보 조회
export const getMe = (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: '인증 필요' });
  }
  const token = auth.split(' ')[1];
  const payload = parseToken(token);
  if (!payload) return res.status(401).json({ message: '토큰 오류' });
  const user = users.find(u => u.id === payload.id);
  if (!user) return res.status(401).json({ message: '사용자 없음' });
  res.status(200).json({ id: user.id, email: user.email, role: user.role, profile: user.profile });
};


// 프로필 이미지 반환 (실제 이미지는 URL로 대체)
export const getProfileImage = (req, res) => {
  // /images/:role/:id
  const { role, id } = req.params;
  const user = users.find(u => u.id === Number(id) && u.role === role);
  if (!user) return res.status(404).send('Not found');
  // 실제 이미지는 URL로 대체
  res.redirect(user.profile.imageUrl);
};


// 프로필 수정
export const updateProfile = (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: '인증 필요' });
  }
  const token = auth.split(' ')[1];
  const payload = parseToken(token);
  if (!payload) return res.status(401).json({ message: '토큰 오류' });
  const user = users.find(u => u.id === payload.id && u.email === payload.email && u.role === payload.role);
  if (!user) return res.status(401).json({ message: '사용자 없음' });
  const { name, bio, image, skills } = req.body;
  if (name) user.profile.name = name;
  if (bio) user.profile.bio = bio;
  // image가 /uploads/로 시작하면 서버 저장 파일로 간주
  if (image && (image.startsWith('/uploads/') || image.startsWith('http'))) {
    user.profile.imageUrl = image;
  }
  if (user.role === 'mentor' && skills) user.profile.skills = skills;
  res.status(200).json({ id: user.id, email: user.email, role: user.role, profile: user.profile });
};
