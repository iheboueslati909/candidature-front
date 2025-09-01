import { Gender } from './Gender';

export interface UserRequestDTO {
  firstname: string;
  lastname: string;
  placeOfBirth: string;
  dateOfBirth: string; // ISO string or yyyy-MM-dd
  nationality: string;
  gender: Gender;
  cin: string;
  email: string;
  username: string;
  password: string;
}
