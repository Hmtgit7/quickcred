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

  const validInput = {
    dob: '1990-01-01', // age ~36 ✅
    monthlySalary: 50_000, // ✅
    employmentMode: EmploymentMode.Salaried, // ✅
    pan: 'ABCDE1234F', // ✅
  };

  it('should pass all rules for valid input', () => {
    const result = service.evaluate(validInput);
    expect(result.passed).toBe(true);
    expect(result.failedRules).toHaveLength(0);
  });

  it('should reject applicant below minimum age', () => {
    const result = service.evaluate({ ...validInput, dob: '2010-01-01' }); // age ~16
    expect(result.passed).toBe(false);
    expect(result.failedRules.some((r) => r.rule === 'AGE')).toBe(true);
  });

  it('should reject applicant above maximum age', () => {
    const result = service.evaluate({ ...validInput, dob: '1960-01-01' }); // age ~66
    expect(result.passed).toBe(false);
    expect(result.failedRules.some((r) => r.rule === 'AGE')).toBe(true);
  });

  it('should reject salary below 25,000', () => {
    const result = service.evaluate({ ...validInput, monthlySalary: 20_000 });
    expect(result.passed).toBe(false);
    expect(result.failedRules.some((r) => r.rule === 'SALARY')).toBe(true);
  });

  it('should reject invalid PAN format', () => {
    const result = service.evaluate({ ...validInput, pan: 'INVALID123' });
    expect(result.passed).toBe(false);
    expect(result.failedRules.some((r) => r.rule === 'PAN')).toBe(true);
  });

  it('should reject unemployed applicant', () => {
    const result = service.evaluate({
      ...validInput,
      employmentMode: EmploymentMode.Unemployed,
    });
    expect(result.passed).toBe(false);
    expect(result.failedRules.some((r) => r.rule === 'EMPLOYMENT')).toBe(true);
  });

  it('should report ALL failed rules — not just the first', () => {
    const result = service.evaluate({
      dob: '2010-01-01', // fails AGE
      monthlySalary: 10_000, // fails SALARY
      employmentMode: EmploymentMode.Unemployed, // fails EMPLOYMENT
      pan: 'BAD', // fails PAN
    });
    expect(result.passed).toBe(false);
    expect(result.failedRules).toHaveLength(4);
  });
});
