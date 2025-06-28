import React, { useState } from 'react';
import { Form, Input, Button, Select, Card, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Option } = Select;

const SignupPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (res.status === 201) {
        message.success('회원가입이 완료되었습니다. 로그인 해주세요!');
        navigate('/login');
      } else {
        const data = await res.json();
        message.error(data.message || '회원가입 실패');
      }
    } catch (e) {
      message.error('서버 오류');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '60px auto', padding: 24 }}>
      <Card>
        <Title level={3} style={{ textAlign: 'center' }}>회원가입</Title>
        <Form layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item label="이메일" name="email" rules={[{ required: true, message: '이메일을 입력하세요.' }]}>
            <Input id="email" type="email" autoFocus />
          </Form.Item>
          <Form.Item label="비밀번호" name="password" rules={[{ required: true, message: '비밀번호를 입력하세요.' }, { min: 6, message: '6자 이상 입력' }]}> 
            <Input.Password id="password" />
          </Form.Item>
          <Form.Item label="이름" name="name" rules={[{ required: true, message: '이름을 입력하세요.' }]}> 
            <Input id="name" />
          </Form.Item>
          <Form.Item label="역할" name="role" rules={[{ required: true, message: '역할을 선택하세요.' }]}> 
            <Select id="role" placeholder="멘토 또는 멘티 선택">
              <Option value="mentor">멘토</Option>
              <Option value="mentee">멘티</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button id="signup" type="primary" htmlType="submit" block loading={loading}>회원가입</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SignupPage;
