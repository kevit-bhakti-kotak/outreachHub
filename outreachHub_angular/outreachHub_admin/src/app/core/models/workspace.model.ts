export interface Workspace {
  _id?: string;
  name: string;
  description?: string;
  members?: { userId: string; role: string }[];
}
