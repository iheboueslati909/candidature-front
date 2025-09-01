export interface FormApplicationHistory {
  applicationId: number;
  userId: string;
  status: string;
  createdAt: string | null;
  updatedAt: string | null;
  form: FormInfo;           // Nested form info
  formDataList: FormDataModel[];
}

export interface FormInfo {
  formId: number;
  formName: string;
  description: string;
  placesDisp: number;
  equation?: string | null;
  datelimite: string;
  university: UniversityInfo;
}

export interface UniversityInfo {
  universityId: number;
  name: string;
  location: string;
}

export interface FormDataModel {
  dataId: number;
  userId: string;
  value: string;
  field: FormFieldModel;     // Nested field info
}

export interface FormFieldModel {
  fieldId: number;
  fieldName: string;
  fieldLabel: string;
  fieldType: string;
  configuration?: string;
  coefficient?: number;
}
