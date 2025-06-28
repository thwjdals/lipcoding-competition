

import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

// 컨트롤러 import
import { signup, login } from './controllers/authController.js';
import { getMe, getProfileImage, updateProfile } from './controllers/userController.js';
import { getMentors } from './controllers/mentorController.js';
import { createMatchRequest, getIncomingRequests, getOutgoingRequests, acceptMatchRequest, rejectMatchRequest, deleteMatchRequest } from './controllers/matchController.js';
import { verifyJWT } from './controllers/authMiddleware.js';

// 인증/회원가입

// 인증/회원가입
app.post('/api/signup', signup);
app.post('/api/login', login);

// 내 정보/프로필 (인증 필요)

import multer from 'multer';

// 업로드 폴더 및 multer 설정
const upload = multer({
  dest: path.join(__dirname, 'uploads'),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 제한
});

app.get('/api/me', verifyJWT, getMe);
app.put('/api/profile', verifyJWT, updateProfile);
app.post('/api/profile/image', verifyJWT, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: '파일이 없습니다.' });
  // 파일 경로를 반환 (실제 서비스라면 보안 처리 필요)
  const imageUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl });
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/api/images/:role/:id', getProfileImage);

// 멘토 리스트 (인증 필요 없음)
app.get('/api/mentors', getMentors);

// 매칭 요청 관련 (인증 필요)
app.post('/api/match-requests', verifyJWT, createMatchRequest);
app.get('/api/match-requests/incoming', verifyJWT, getIncomingRequests);
app.get('/api/match-requests/outgoing', verifyJWT, getOutgoingRequests);
app.put('/api/match-requests/:id/accept', verifyJWT, acceptMatchRequest);
app.put('/api/match-requests/:id/reject', verifyJWT, rejectMatchRequest);
app.delete('/api/match-requests/:id', verifyJWT, deleteMatchRequest);

// Swagger UI 및 OpenAPI 문서 제공
const openapiPath = path.join(__dirname, 'openapi.json');
let openapiDoc = {};
try {
  openapiDoc = JSON.parse(fs.readFileSync(openapiPath, 'utf-8'));
} catch (err) {
  console.error('OpenAPI 문서 로드 실패:', err);
}
app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(openapiDoc));
app.get('/openapi.json', (req, res) => {
  res.json(openapiDoc);
});
// 루트로 접속 시 Swagger UI로 리다이렉트
app.get('/', (req, res) => {
  res.redirect('/swagger-ui');
});



app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
