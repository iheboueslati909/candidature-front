export interface PageResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  numberOfElements: number;
  hasPrevious: boolean;
  hasNext: boolean;
  first: boolean;
  last: boolean;
  hasContent: boolean;
}