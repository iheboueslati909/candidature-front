export interface LoginResponseDTO {
  jwt: string;
  roles: string[];
  username: string;
  // Add other fields as needed
}
