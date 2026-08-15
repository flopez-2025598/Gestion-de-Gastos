import { usersRepository } from './users.repository.js';
import type { UserProfile, UpdateProfileInput, UpdateRoleInput } from './users.types.js';

function toUserProfile(user: {
  id: number;
  fullName: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}): UserProfile {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export const usersService = {
  async getProfile(userId: number): Promise<UserProfile> {
    const user = await usersRepository.findById(userId);
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }
    return toUserProfile(user);
  },

  async updateProfile(userId: number, input: UpdateProfileInput): Promise<UserProfile> {
    const user = await usersRepository.updateProfile(userId, input);
    return toUserProfile(user);
  },

  async listAll(): Promise<UserProfile[]> {
    const users = await usersRepository.findAll();
    return users.map(toUserProfile);
  },

  async getById(id: number): Promise<UserProfile> {
    const user = await usersRepository.findById(id);
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }
    return toUserProfile(user);
  },

  async updateRole(id: number, input: UpdateRoleInput): Promise<UserProfile> {
    const user = await usersRepository.findById(id);
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }
    const updated = await usersRepository.updateRole(id, input.role);
    return toUserProfile(updated);
  },
};