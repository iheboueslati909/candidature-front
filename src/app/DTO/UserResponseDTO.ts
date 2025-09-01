import { Gender } from './Gender';

export interface UserResponseDTO {
  id: string;
  firstname: string;
  lastname: string;
  placeOfBirth: string;
  dateOfBirth: string;
  nationality: string;
  gender: Gender;
  cin: string;
  email: string;
  username: string;
  enabled: boolean;
  passwordNeedToBeModified: boolean;
  lastLogin: string;
  createBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  roles: string[];
}
