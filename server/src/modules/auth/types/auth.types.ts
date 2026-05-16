import { User } from '../../users/schemas/user.schema';
import { AuthTokens } from '../interfaces/auth-tokens.interface';

export type AuthResponse = AuthTokens & {
  user: Omit<User, 'password' | 'refreshToken'>;
};
