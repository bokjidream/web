import type { ResultsData } from './types';

export const RESULTS_DATA: ResultsData = {
  eligible: [
    {
      name: '기초연금',
      dept: '보건복지부',
      level: 'high',
      amount: '월 최대 33만 4천원',
      summary: '만 65세 이상, 소득·재산이 기준 이하인 어르신께 지급되는 연금',
      docs: ['신분증', '통장 사본', '소득·재산 증빙'],
    },
    {
      name: '주거급여 (맞춤형 급여)',
      dept: '국토교통부',
      level: 'high',
      amount: '월 최대 35만원 (지역·가구원 수별 상이)',
      summary: '소득이 기준 중위소득 48% 이하인 가구의 주거비 지원',
      docs: ['임대차계약서', '신분증', '가족관계증명서'],
    },
    {
      name: '에너지바우처',
      dept: '산업통상자원부',
      level: 'high',
      amount: '연 최대 30만 4천원',
      summary: '겨울철 난방비 등 에너지 비용을 국가가 일부 지원',
      docs: ['신분증', '주민등록등본'],
    },
  ],
  needsCheck: [
    {
      name: '국민기초생활보장 생계급여',
      dept: '보건복지부',
      level: 'mid',
      amount: '월 최대 76만 5천원 (1인 가구)',
      summary: '부양의무자·재산 추가 확인이 필요합니다',
      docs: ['소득·재산 신고서', '가족관계증명서', '통장 사본'],
    },
    {
      name: '노인맞춤돌봄서비스',
      dept: '보건복지부',
      level: 'mid',
      amount: '안부확인·가사지원 등 (월 16~40시간)',
      summary: '건강상태 확인 후 서비스 수준이 결정됩니다',
      docs: ['신분증', '건강 문진 결과'],
    },
  ],
  notEligible: [
    {
      name: '장애인연금',
      dept: '보건복지부',
      level: 'low',
      amount: '월 최대 42만 4천원',
      summary: '등록 장애 여부 확인이 필요해 현재 대상에서 제외',
    },
  ],
};
