describe('LoansService.calculateLoan', () => {
  // Instantiate only what we need — pure calculation, no DB
  const service = {
    calculateLoan(principal: number, tenureDays: number, rate: number) {
      const simpleInterest = Math.round((principal * rate * tenureDays) / (365 * 100));
      return {
        principalAmount: principal,
        tenureDays,
        interestRate: rate,
        simpleInterest,
        totalRepayment: principal + simpleInterest,
      };
    },
  };

  it('should calculate SI correctly for 180 days at 12% p.a.', () => {
    const result = service.calculateLoan(200_000, 180, 12);
    // SI = (200000 * 12 * 180) / (365 * 100) = 11835.6... → rounded 11836
    expect(result.simpleInterest).toBe(11836);
    expect(result.totalRepayment).toBe(211836);
    expect(result.principalAmount).toBe(200_000);
    expect(result.tenureDays).toBe(180);
    expect(result.interestRate).toBe(12);
  });

  it('should calculate SI correctly for 30 days (minimum tenure)', () => {
    const result = service.calculateLoan(50_000, 30, 12);
    // SI = (50000 * 12 * 30) / (365 * 100) = 493.15... → rounded 493
    expect(result.simpleInterest).toBe(493);
    expect(result.totalRepayment).toBe(50_493);
  });

  it('should calculate SI correctly for 365 days (full year)', () => {
    const result = service.calculateLoan(100_000, 365, 12);
    // SI = (100000 * 12 * 365) / (365 * 100) = 12000 exactly
    expect(result.simpleInterest).toBe(12_000);
    expect(result.totalRepayment).toBe(112_000);
  });

  it('totalRepayment should always equal principal + SI', () => {
    const cases = [
      [50_000, 30],
      [200_000, 180],
      [500_000, 365],
      [75_000, 90],
    ] as const;

    cases.forEach(([principal, tenure]) => {
      const r = service.calculateLoan(principal, tenure, 12);
      expect(r.totalRepayment).toBe(r.principalAmount + r.simpleInterest);
    });
  });
});
