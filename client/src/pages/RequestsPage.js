import React from 'react';
import { Card, Typography } from 'antd';

const { Title } = Typography;

const RequestsPage = () => {
  // 요청 목록, 상태, 수락/거절/취소 등 실제 구현은 추후 추가 예정입니다.
  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: 24 }}>
      <Card>
        <Title level={2} style={{ textAlign: 'center' }}>매칭 요청</Title>
        <p>이곳은 매칭 요청 페이지입니다. 멘티는 본인이 보낸 요청의 상태를, 멘토는 받은 요청을 관리할 수 있습니다.</p>
        {/* TODO: 요청 목록, 상태, 수락/거절/취소 기능 구현 */}
      </Card>
    </div>
  );
};

export default RequestsPage;
