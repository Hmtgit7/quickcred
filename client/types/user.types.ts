import { EmploymentMode, Role } from "./enums";

export interface User {
  _id: string;
  email: string;
  role: Role;
  fullName?: string;
  pan?: string;
  dob?: string;
  monthlySalary?: number;
  employmentMode?: EmploymentMode;
  profileCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfilePayload {
  fullName: string;
  pan: string;
  dob: string;
  monthlySalary: number;
  employmentMode: EmploymentMode;
}
