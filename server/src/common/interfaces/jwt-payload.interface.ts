import { Role } from '../enums/role.enum';

export interface JwtPayload {
  sub: string; // MongoDB ObjectId as string
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}
