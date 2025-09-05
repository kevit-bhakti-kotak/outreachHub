export interface IContact {
  _id?: string;
  name: string;
  phoneNumber?: string;
  tags?: string[];       // important feature you mentioned
  workspaceId?: string;  // backend will use this
  createdBy?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
