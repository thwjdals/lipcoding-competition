// 멘토 매칭 요청 관련 컨트롤러


import { matchRequests, matchRequestHistory, getNextMatchRequestId } from '../data.js';

// 매칭 요청 생성 (멘티 전용)
export const createMatchRequest = (req, res) => {
  const { mentorId, menteeId, message } = req.body;
  if (!mentorId || !menteeId || !message) {
    return res.status(400).json({ message: '필수 항목 누락' });
  }
  // 동일 멘토에게 pending 상태 요청이 있으면 불가
  if (matchRequests.find(r => r.mentorId === mentorId && r.menteeId === menteeId && r.status === 'pending')) {
    return res.status(400).json({ message: '이미 요청이 존재합니다.' });
  }
  const reqObj = {
    id: getNextMatchRequestId(),
    mentorId,
    menteeId,
    message,
    status: 'pending'
  };
  matchRequests.push(reqObj);
  res.status(200).json(reqObj);
};


// 나에게 들어온 요청 목록 (멘토 전용)
export const getIncomingRequests = (req, res) => {
  const { mentorId } = req.query;
  const list = matchRequests.filter(r => r.mentorId === Number(mentorId));
  res.status(200).json(list);
};


// 내가 보낸 요청 목록 (멘티 전용)
export const getOutgoingRequests = (req, res) => {
  const { menteeId } = req.query;
  const list = matchRequests.filter(r => r.menteeId === Number(menteeId));
  res.status(200).json(list);
};


// 요청 수락 (멘토 전용)
export const acceptMatchRequest = (req, res) => {
  const { id } = req.params;
  const reqObj = matchRequests.find(r => r.id === Number(id));
  if (!reqObj) return res.status(404).json({ message: '요청 없음' });
  if (reqObj.status !== 'pending') return res.status(400).json({ message: '이미 처리된 요청' });
  reqObj.status = 'accepted';
  reqObj.updatedAt = new Date().toISOString();
  matchRequestHistory.push({ ...reqObj });
  // 같은 멘토의 다른 pending 요청은 모두 rejected 처리
  matchRequests.forEach(r => {
    if (r.mentorId === reqObj.mentorId && r.id !== reqObj.id && r.status === 'pending') {
      r.status = 'rejected';
      r.updatedAt = new Date().toISOString();
      matchRequestHistory.push({ ...r });
    }
  });
  res.status(200).json(reqObj);
};


// 요청 거절 (멘토 전용)
export const rejectMatchRequest = (req, res) => {
  const { id } = req.params;
  const reqObj = matchRequests.find(r => r.id === Number(id));
  if (!reqObj) return res.status(404).json({ message: '요청 없음' });
  if (reqObj.status !== 'pending') return res.status(400).json({ message: '이미 처리된 요청' });
  reqObj.status = 'rejected';
  reqObj.updatedAt = new Date().toISOString();
  matchRequestHistory.push({ ...reqObj });
  res.status(200).json(reqObj);
};


// 요청 삭제/취소 (멘티 전용)
export const deleteMatchRequest = (req, res) => {
  const { id } = req.params;
  const reqObj = matchRequests.find(r => r.id === Number(id));
  if (!reqObj) return res.status(404).json({ message: '요청 없음' });
  if (reqObj.status !== 'pending') return res.status(400).json({ message: '이미 처리된 요청' });
  reqObj.status = 'cancelled';
  reqObj.updatedAt = new Date().toISOString();
  matchRequestHistory.push({ ...reqObj });
  res.status(200).json(reqObj);
};
