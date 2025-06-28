// 인증 관련 컨트롤러
// 회원가입, 로그인


import { users, getNextUserId } from '../data.js';
import bcrypt from 'bcryptjs';

// 회원가입
export const signup = (req, res) => {
  const { email, password, name, role } = req.body;
  if (!email || !password || !name || !role) {
    return res.status(400).json({ message: '필수 항목 누락' });
  }
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: '이미 존재하는 이메일' });
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = {
    id: getNextUserId(),
    email,
    password: hashedPassword, // 해시 저장
    role,
    profile: {
      name,
      bio: '',
      imageUrl: role === 'mentor' ? 'https://placehold.co/500x500.jpg?text=MENTOR' : 'https://placehold.co/500x500.jpg?text=MENTEE',
      skills: role === 'mentor' ? [] : undefined
    }
  };
  users.push(newUser);
  // 회원가입 후 바로 토큰 발급 (base64 인코딩: id:email:role)
  const token = Buffer.from(`${newUser.id}:${newUser.email}:${newUser.role}`).toString('base64');
  res.status(201).json({ id: newUser.id, email: newUser.email, role: newUser.role, token });
};


// 로그인
export const login = (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
  }
  // 토큰 발급 (base64 인코딩: id:email:role)
  const token = Buffer.from(`${user.id}:${user.email}:${user.role}`).toString('base64');
  res.status(200).json({ id: user.id, email: user.email, role: user.role, token });
}
