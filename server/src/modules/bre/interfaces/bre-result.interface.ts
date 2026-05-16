import { EmploymentMode } from '../../../common/enums/employment-mode.enum';

export interface BREFailedRule {
  rule: string;
  message: string;
}

export interface BREResult {
  passed: boolean;
  failedRules: BREFailedRule[];
}

export interface BREInput {
  dob: string; // ISO date string
  monthlySalary: number;
  employmentMode: EmploymentMode;
  pan: string;
}
