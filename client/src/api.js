import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: false,
});

// 인증이 필요한 요청: 토큰 자동 첨부
export function authApi() {
  // 인스턴스 복사 (토큰 첨부)
  const instance = api;
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  return instance;
}

// 인증 필요 없는 요청: 토큰 미첨부
export function publicApi() {
  // 토큰 없이 요청 (interceptor 미적용)
  return api;
}
