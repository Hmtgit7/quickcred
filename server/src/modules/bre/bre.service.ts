import { Injectable } from '@nestjs/common';
import { BREInput, BREResult, BREFailedRule } from './interfaces/bre-result.interface';
import { EmploymentMode } from '../../common/enums/employment-mode.enum';
import { BRE as BRE_CONSTANTS } from '../../common/constants';

@Injectable()
export class BREService {
  /**
   * Pure function — no DB, no side effects.
   * Evaluates all rules and returns every failed rule (not just first).
   */
  evaluate(input: BREInput): BREResult {
    const failedRules: BREFailedRule[] = [];

    // Rule 1 — Age between 23 and 50
    const age = this.calculateAge(input.dob);
    if (age < BRE_CONSTANTS.MIN_AGE || age > BRE_CONSTANTS.MAX_AGE) {
      failedRules.push({
        rule: 'AGE',
        message: `Applicant age must be between ${BRE_CONSTANTS.MIN_AGE} and ${BRE_CONSTANTS.MAX_AGE} years. Current age: ${age}`,
      });
    }

    // Rule 2 — Monthly salary >= 25,000
    if (input.monthlySalary < BRE_CONSTANTS.MIN_MONTHLY_SALARY) {
      failedRules.push({
        rule: 'SALARY',
        message: `Monthly salary must be at least ₹${BRE_CONSTANTS.MIN_MONTHLY_SALARY.toLocaleString('en-IN')}`,
      });
    }

    // Rule 3 — Valid PAN format
    if (!BRE_CONSTANTS.PAN_REGEX.test(input.pan.toUpperCase())) {
      failedRules.push({
        rule: 'PAN',
        message:
          'PAN must match format: 5 uppercase letters + 4 digits + 1 uppercase letter (e.g., ABCDE1234F)',
      });
    }

    // Rule 4 — Not unemployed
    if (input.employmentMode === EmploymentMode.Unemployed) {
      failedRules.push({
        rule: 'EMPLOYMENT',
        message: 'Unemployed applicants are not eligible for a loan',
      });
    }

    return {
      passed: failedRules.length === 0,
      failedRules,
    };
  }

  private calculateAge(dobString: string): number {
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  }
}
