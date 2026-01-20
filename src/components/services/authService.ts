import api from './api';

export interface LoginRequest {
  identitier: string;
  password: string;
}

export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
  phoneNumber: string;
  birthDate: string; // Format: "2025-09-18T..."
  countryId: string;
}

export interface UpdateUserAccountRequest {
  userId: string;
  userName: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  countryId: string;
}

export interface UpdateUserProfileRequest {
  bio: string;
  heigh: number;
  weight: number;
  profileVisibility: boolean;
  bloodType: number;
  activeType: number;
  hikingExperience: number;
  personnalizedRecomendations: boolean;
}

export interface UserResponse {
  id: string;
  userName: string;
  email: string;
  role?: string;
  avatar?: string;
}

export const authService = {
  // POST Login: account/login
  login: async (credentials: LoginRequest) => {
    const response = await api.post('/account/login', credentials);
    return response.data; 
  },

  // POST Register: account/register
  register: async (data: RegisterRequest) => {
    const response = await api.post('/account/register', data);
    return response.data;
  },

  // GET Get User: Account
  getCurrentUser: async () => {
    const response = await api.get<UserResponse>('/Account');
    return response.data;
  },

  // PUT Update User Account: Account/Update
  updateAccount: async (data: UpdateUserAccountRequest) => {
    const response = await api.put('/Account/Update', data);
    return response.data;
  },

  // PUT Update User Data (setup user): Account/UpdateUserData
  updateUserData: async (data: UpdateUserProfileRequest) => {
    const response = await api.put('/Account/UpdateUserData', data);
    return response.data;
  },

  // PUT Update User Data (userId): Account/Update/UserAccount?userId={{userID}}
  updateUserById: async (userId: string, data: UpdateUserAccountRequest) => {
    const response = await api.put(`/Account/Update/UserAccount?userId=${userId}`, data);
    return response.data;
  }
};