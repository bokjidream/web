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

// ── RAG 상세 조회 타입 ──

export interface ApplicationForm {
  title: string;
  url: string;
  file_type: 'pdf' | 'hwp' | 'hwpx' | 'etc';
}

export interface WelfareDetail {
  serv_id: string;
  serv_nm: string;
  application_url: string;
  application_method: string;
  application_forms: ApplicationForm[];
  required_documents: string[];
  alw_serv_cn: string;   // 지원 서비스 내용
  sprt_cyc_nm: string;   // 지원 주기
  srv_pvsn_nm: string;   // 서비스 제공 방식
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
  application_method: string;
  application_url: string | null;
  application_forms: ApplicationForm[];
  detail_fetched: boolean;
  tgtr_dtl_cn: string;   // 지원대상 상세
  slct_crit_cn: string;  // 선정기준
  alw_serv_cn: string;   // 지원내용
  sprt_cyc_nm: string;   // 지원주기
  srv_pvsn_nm: string;   // 서비스 제공방식
}

export type ChatResponseType =
  | 'interview'
  | 'service_select'
  | 'service_detail'
  | 'draft_fields'
  | 'done'
  | 'no_results';

export interface InterviewData {
  question: string;
  missing_fields: string[];
}

export interface ServiceSelectData {
  candidates: string; // 포맷된 텍스트
  welfare_candidates: WelfareCandidate[];
  error: string | null;
}

export interface ReferenceDoc {
  title: string;
  url: string;
}

export interface FilledForm {
  original_title: string;
  original_url: string;
  file_type: 'hwp' | 'hwpx' | string;
  download_key: string;          // "{thread_id}/{filename}" — AI 서버 /forms/download 경로
  status: 'success' | 'skipped' | 'failed' | 'guide_only';
  error?: string | null;
  guide_text?: string | null;    // status === 'guide_only' (PDF) 시 LLM 생성 안내문
  user_inputs?: Record<string, string>;  // HWP 자동 채우기 실패 시 사용자 입력값 (수동 작성 참고용)
}

export interface ServiceDetailData {
  selected_service: WelfareCandidate;
  welfare_candidates: WelfareCandidate[];
}

export interface DraftField {
  id: string;
  label: string;
  type: 'text';
}

export interface DraftFieldsData {
  fields: DraftField[];
  form_title: string;
  selected_service?: WelfareCandidate;
  welfare_candidates?: WelfareCandidate[];
}

export interface DoneData {
  final_report: string;
  selected_service: WelfareCandidate | null;
  welfare_candidates: WelfareCandidate[];
  filled_forms?: FilledForm[];
  reference_docs?: ReferenceDoc[];
}

export interface ChatResponse {
  thread_id: string;
  type: ChatResponseType;
  data: InterviewData | ServiceSelectData | ServiceDetailData | DraftFieldsData | DoneData | Record<string, never>;
}
