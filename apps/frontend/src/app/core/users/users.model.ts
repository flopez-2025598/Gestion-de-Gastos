import type { UserRole } from '../auth/auth.model';

export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt: string;
}
