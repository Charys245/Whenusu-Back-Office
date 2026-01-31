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


// ============================================
// REGISTER
// ============================================

export interface RegisterPayload {
  last_name: string;
  first_name: string;
  phone_number: string;
  password: string;
  email?: string;
  region_id?: string;
  avatar_url?: File; // Pour l'upload de fichier
}

export interface RegisterResponse {
  message: string;
  data: {
    id: string;
    lastName: string;
    firstName: string;
    email: string;
    phoneNumber: string;
    createdAt: string;
    updatedAt: string;
  };
}

// ============================================
// USER PROFILE
// ============================================

export interface GetUserProfileResponse {
  message: string;
  data: {
    id: string;
    last_name: string;
    first_name: string;
    email: string;
    phone_number: string;
    avatar_url: string | null;
    region_id: string | null;
    send_notif: boolean;
  };
}

export interface UpdateProfilePayload {
  last_name?: string;
  first_name?: string;
  email?: string;
  phone_number?: string;
  region_id?: string;
  avatar_url?: File;
  send_notif?: boolean;
}

export interface UpdateProfileResponse {
  message: string;
  data: User;
}

// ============================================
// PASSWORD
// ============================================

export interface UpdatePasswordPayload {
  password: string;
  newPassWord: string;
}

export interface UpdatePasswordResponse {
  message: string;
}

// ============================================
// DELETE ACCOUNT
// ============================================

export interface DeleteAccountResponse {
  message: string;
}

// ============================================
// PASSWORD RECOVERY (3 steps)
// ============================================

// Step 1: Verify user exists
export interface VerifyUserPayload {
  email: string;
}

export interface VerifyUserResponse {
  message: string;
}

// Step 2: Verify OTP code
export interface VerifyOtpPayload {
  email: string;
  otpCode: string;
}

export interface VerifyOtpResponse {
  message: string;
  userId: string;
}

// Step 3: Reset password
export interface ForgotPasswordPayload {
  userId: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ForgotPasswordResponse {
  message: string;
}