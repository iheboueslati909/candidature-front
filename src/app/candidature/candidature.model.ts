export interface CandidatureRequest {
  userId?: number;
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
  status: 'PENDING' | 'ACCEPTED' | 'REFUSED';
  offreId?: number;
  etablissementName?: string;
  createdAt: string; // ISO datetime
}
