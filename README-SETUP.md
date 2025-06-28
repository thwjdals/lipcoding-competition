# 프로젝트 초기 세팅 안내 (Express + React)

## 1. 서버(Express)
- 위치: `server/`
- 설치 및 실행:
  ```bash
  cd server
  npm install
  npm run dev
  ```
- 기본 포트: 4000
- CORS 허용

## 2. 클라이언트(React)
- 위치: `client/`
- 설치 및 실행:
  ```bash
  cd client
  npm install
  npm start
  ```
- 개발 서버: http://localhost:3000
- API 프록시: 필요시 `package.json`에 proxy 설정 추가

## 3. 공통
- `.gitignore`에 node_modules, build, .env 등 포함
- 한글 주석 및 안내문 포함

---

이제 각 폴더에서 의존성 설치 후 실행하면 개발 환경이 준비됩니다.
