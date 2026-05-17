export enum Role {
  Admin = "admin",
  Sales = "sales",
  Sanction = "sanction",
  Disbursement = "disbursement",
  Collection = "collection",
  Borrower = "borrower",
}

export enum LoanStatus {
  Pending = "pending",
  Applied = "applied",
  Sanctioned = "sanctioned",
  Disbursed = "disbursed",
  Closed = "closed",
  Rejected = "rejected",
}

export enum EmploymentMode {
  Salaried = "salaried",
  SelfEmployed = "self_employed",
  Unemployed = "unemployed",
}
