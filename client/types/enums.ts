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
  Rejected = "rejected",
  Disbursed = "disbursed",
  Closed = "closed",
}

export enum EmploymentMode {
  Salaried = "salaried",
  SelfEmployed = "self_employed",
  Unemployed = "unemployed",
}