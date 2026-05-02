export interface WelfareService {
  name: string;
  dept: string;
  level: 'high' | 'mid' | 'low';
  amount: string;
  summary: string;
  docs?: string[];
}

export interface ResultsData {
  eligible: WelfareService[];
  needsCheck: WelfareService[];
  notEligible: WelfareService[];
}

// ── AI Agent API 응답 타입 ──

export interface WelfareCandidate {
  serv_id: string;
  serv_nm: string;
  serv_dgst: string;
  department: string;
  eligibility_reason: string;
  score: number;
  priority: number;
  required_documents: string[];
  application_fields: string[];
  application_url: string | null;
  detail_fetched: boolean;
}

export type ChatResponseType = 'interview' | 'service_select' | 'done' | 'no_results';

export interface InterviewData {
  question: string;
  missing_fields: string[];
}

export interface ServiceSelectData {
  candidates: string; // 포맷된 텍스트
  welfare_candidates: WelfareCandidate[];
  error: string | null;
}

export interface DoneData {
  final_report: string;
  document_guidance: string;
  application_guide: string;
  selected_service: WelfareCandidate | null;
  welfare_candidates: WelfareCandidate[];
}

export interface ChatResponse {
  thread_id: string;
  type: ChatResponseType;
  data: InterviewData | ServiceSelectData | DoneData | Record<string, never>;
}
