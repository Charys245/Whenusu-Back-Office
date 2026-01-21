import type { User } from "./User";

export interface LoginWithPhonePayload {
  phone_number: string;
  password: string;
}

export interface LoginWithEmailPayload {
  email: string;
  password: string;
}

export interface RegistrationPayload {
  last_name: string;
  first_name: string;
  email: string;
  phone_number: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  userPermissions: string[];
  token: string;
}

export interface RegistrationResponse {
  message: string;
  data: {
    lastName: string;
    firstName: string;
    email: string;
    phoneNumber: string;
    id: string;
    createdAt: string;
    updatedAt: string;
  };
}
