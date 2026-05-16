import { Test, TestingModule } from '@nestjs/testing';
import { BREService } from './bre.service';
import { EmploymentMode } from '../../common/enums/employment-mode.enum';

describe('BREService', () => {
  let service: BREService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BREService],
    }).compile();
    service = module.get<BREService>(BREService);
  });

  const validDob = () => {
    // Age 30 — always valid
    const d = new Date();
    d.setFullYear(d.getFullYear() - 30);
    return d.toISOString().split('T')[0];
  };

  it('should pass all rules for a valid applicant', () => {
    const result = service.evaluate({
      dob: validDob(),
      monthlySalary: 50_000,
      pan: 'ABCDE1234F',
      employmentMode: EmploymentMode.Salaried,
    });
    expect(result.passed).toBe(true);
    expect(result.failedRules).toHaveLength(0);
  });

  it('should reject applicant below minimum age (23)', () => {
    const dob = new Date();
    dob.setFullYear(dob.getFullYear() - 20); // age 20
    const result = service.evaluate({
      dob: dob.toISOString().split('T')[0],
      monthlySalary: 50_000,
      pan: 'ABCDE1234F',
      employmentMode: EmploymentMode.Salaried,
    });
    expect(result.passed).toBe(false);
    expect(result.failedRules.some((r) => r.rule === 'AGE')).toBe(true);
  });

  it('should reject applicant above maximum age (50)', () => {
    const dob = new Date();
    dob.setFullYear(dob.getFullYear() - 55); // age 55
    const result = service.evaluate({
      dob: dob.toISOString().split('T')[0],
      monthlySalary: 50_000,
      pan: 'ABCDE1234F',
      employmentMode: EmploymentMode.Salaried,
    });
    expect(result.passed).toBe(false);
    expect(result.failedRules.some((r) => r.rule === 'AGE')).toBe(true);
  });

  it('should reject salary below ₹25,000', () => {
    const result = service.evaluate({
      dob: validDob(),
      monthlySalary: 20_000,
      pan: 'ABCDE1234F',
      employmentMode: EmploymentMode.Salaried,
    });
    expect(result.passed).toBe(false);
    expect(result.failedRules.some((r) => r.rule === 'SALARY')).toBe(true);
  });

  it('should reject invalid PAN format', () => {
    const result = service.evaluate({
      dob: validDob(),
      monthlySalary: 50_000,
      pan: 'invalid123',
      employmentMode: EmploymentMode.Salaried,
    });
    expect(result.passed).toBe(false);
    expect(result.failedRules.some((r) => r.rule === 'PAN')).toBe(true);
  });

  it('should accept all valid PAN formats', () => {
    const validPans = ['ABCDE1234F', 'ZZZZZ9999Z', 'PANPM1234A'];
    validPans.forEach((pan) => {
      const result = service.evaluate({
        dob: validDob(),
        monthlySalary: 50_000,
        pan,
        employmentMode: EmploymentMode.Salaried,
      });
      expect(result.failedRules.some((r) => r.rule === 'PAN')).toBe(false);
    });
  });

  it('should reject unemployed applicants', () => {
    const result = service.evaluate({
      dob: validDob(),
      monthlySalary: 50_000,
      pan: 'ABCDE1234F',
      employmentMode: EmploymentMode.Unemployed,
    });
    expect(result.passed).toBe(false);
    expect(result.failedRules.some((r) => r.rule === 'EMPLOYMENT')).toBe(true);
  });

  it('should collect ALL failed rules not just first', () => {
    const dob = new Date();
    dob.setFullYear(dob.getFullYear() - 20); // age 20 — fails AGE
    const result = service.evaluate({
      dob: dob.toISOString().split('T')[0],
      monthlySalary: 10_000, // fails SALARY
      pan: 'bad', // fails PAN
      employmentMode: EmploymentMode.Unemployed, // fails EMPLOYMENT
    });
    expect(result.passed).toBe(false);
    expect(result.failedRules.length).toBe(4);
  });
});
