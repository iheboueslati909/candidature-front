export interface CandidatureRequest {
  userId?: string;
  studentName: string;
  moyenne: number;
  dateDebutMobilite: string; // ISO date
  offreId?: number;
  etablissementName?: string;
}

export interface CandidatureResponse {
  id: number;
  userId?: number;
  studentName: string;
  moyenne: number;
  dateDebutMobilite: string;
  status: 'PENDING' | 'ACCEPTED' | 'REFUSED' | 'WAITING_LIST';
  offreId?: number;
  etablissementNom?: string;
  offreTitre?:string;
  createdAt: string; // ISO datetime
}
