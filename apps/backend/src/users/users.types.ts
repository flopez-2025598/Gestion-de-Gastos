export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateProfileInput {
  fullName?: string;
}

export interface UpdateRoleInput {
  role: 'ADMIN' | 'USER';
}