// 본인만 접근 허용 + 비밀번호 검증 미들웨어
import { users } from '../data.js';
import bcrypt from 'bcryptjs';

// (onlySelf 미들웨어 삭제)

// 비밀번호 검증 미들웨어 (body.password 필요)
export function verifyPassword(req, res, next) {
  const userId = Number(req.user.sub);
  const { password } = req.body;
  const user = users.find(u => u.id === userId);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
  }
  next();
}
// JWT 대신 base64(id:email:role) 토큰 파싱
export function verifyJWT(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: '인증 필요' });
  }
  const token = auth.split(' ')[1];
  try {
    const [id, email, role] = Buffer.from(token, 'base64').toString().split(':');
    if (!id || !email || !role) throw new Error();
    req.user = { id: Number(id), email, role };
    next();
  } catch {
    return res.status(401).json({ message: '토큰 오류' });
  }
}
