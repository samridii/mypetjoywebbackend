export interface IUserType {
  fullName: string;
  email: string;
  password: string;
  role?: "user" | "admin";
}

export interface UserResponseDTO {
  id: string;
  fullName: string;
  email: string;
  role: "user" | "admin";
}

export interface RegisterDTO {
  fullName: string;
  email: string;
  password: string;
  role?: "user" | "admin";
}

export interface LoginDTO {
  email: string;
  password: string;
}