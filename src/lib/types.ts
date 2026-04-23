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
