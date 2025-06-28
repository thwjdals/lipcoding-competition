import { useEffect, useState } from 'react';
import { Card, Typography, Form, Input, Button, Spin, message, Tag } from 'antd';
import { authApi } from '../api';
import MatchRequestNavButton from '../components/MatchRequestNavButton';

const { Title } = Typography;

const ProfilePage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const res = await authApi().get('/me');
        
        console.log('내 프로필:', res.data);
        setProfile(res.data.profile);
        setRole(res.data.role);
      } catch (e) {
        message.error('내 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  // profile이 바뀔 때마다 폼 필드 채우기
  useEffect(() => {
    if (profile) {
      form.setFieldsValue({
        name: profile?.name,
        bio: profile?.bio,
        imageUrl: profile?.imageUrl,
        skills: Array.isArray(profile?.skills) ? profile.skills.join(', ') : '',
      });
    }
  }, [profile, form]);

  // 이미지 업로드 핸들러
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/profile/image', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.imageUrl) {
        form.setFieldsValue({ imageUrl: data.imageUrl });
        message.success('이미지 업로드 성공');
      } else {
        message.error(data.message || '이미지 업로드 실패');
      }
    } catch (err) {
      message.error('이미지 업로드 중 오류 발생');
    }
  };

  const onFinish = async (values) => {
    setSaving(true);
    try {
      const payload = {
        name: values.name,
        bio: values.bio,
        imageUrl: values.imageUrl,
      };
      if (role === 'mentor') {
        payload.skills = values.skills.split(',').map(s => s.trim()).filter(Boolean);
      }
      const res = await authApi().put('/profile', payload);
      setProfile(res.data.profile);
      message.success('프로필이 저장되었습니다.');
    } catch (e) {
      message.error('프로필 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Spin style={{ display: 'block', margin: '60px auto' }} />;
  }

  return (
    <div style={{ maxWidth: 500, margin: '60px auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <MatchRequestNavButton />
      </div>
      <Card>
        <Title level={3} style={{ textAlign: 'center' }}>내 프로필</Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            name: profile?.name,
            bio: profile?.bio,
            imageUrl: profile?.imageUrl,
            skills: profile?.skills?.join(', '),
          }}
        >
          <Form.Item label="이름" name="name" rules={[{ required: true, message: '이름을 입력하세요.' }]}> <Input /> </Form.Item>
          <Form.Item label="소개" name="bio"> <Input.TextArea rows={3} /> </Form.Item>
          <Form.Item label="프로필 이미지">
            <Input
              value={form.getFieldValue('imageUrl')}
              onChange={e => form.setFieldsValue({ imageUrl: e.target.value })}
              placeholder="이미지 URL 또는 업로드를 이용하세요"
              style={{ marginBottom: 8 }}
            />
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ marginTop: 8 }} />
            {form.getFieldValue('imageUrl') && (
              <div style={{ marginTop: 12, textAlign: 'center' }}>
                <img
                  src={form.getFieldValue('imageUrl').startsWith('/uploads/') ? form.getFieldValue('imageUrl') : form.getFieldValue('imageUrl')}
                  alt="프로필 미리보기"
                  style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }}
                />
              </div>
            )}
          </Form.Item>
          {role === 'mentor' && (
            <Form.Item label="기술 스택 (쉼표로 구분)" name="skills">
              <Input placeholder="예: React, Node.js, TypeScript" />
              <div style={{ marginTop: 8 }}>
                {profile?.skills?.map(skill => (
                  <Tag color="blue" key={skill}>{skill}</Tag>
                ))}
              </div>
            </Form.Item>
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={saving} block>
              저장
            </Button>
          </Form.Item>
          {role === 'mentee' && (
            <Form.Item>
              <Button
                type="default"
                block
                style={{ marginTop: 8 }}
                onClick={() => {
                  window.location.href = '/mentors';
                }}
              >
                멘토링 요청하러 가기
              </Button>
            </Form.Item>
          )}
        </Form>
      </Card>
    </div>
  );
};

export default ProfilePage;
