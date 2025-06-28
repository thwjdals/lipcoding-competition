import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { publicApi } from '../api';

const { Title } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await publicApi().post('/login', values);
      // 서버에서 status 200과 토큰이 있는지 확인
      if (res.status === 200 && res.data.token) {
        localStorage.setItem('token', res.data.token);
        message.success('로그인 성공!');
        navigate('/dashboard');
      } else {
        // 서버에서 실패 메시지가 오면 표시
        message.error(res.data.message || '로그인 실패');
      }
    } catch (e) {
      // 네트워크 오류 또는 인증 실패 시
      message.error('이메일 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '60px auto', padding: 24 }}>
      <Card>
        <Title level={3} style={{ textAlign: 'center' }}>로그인</Title>
        <Form layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item label="이메일" name="email" rules={[{ required: true, message: '이메일을 입력하세요.' }]}> 
            <Input id="email" type="email" autoFocus />
          </Form.Item>
          <Form.Item label="비밀번호" name="password" rules={[{ required: true, message: '비밀번호를 입력하세요.' }]}> 
            <Input.Password id="password" />
          </Form.Item>
          <Form.Item>
            <Button id="login" type="primary" htmlType="submit" block loading={loading}>로그인</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
