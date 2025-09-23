export interface Campaign {
  _id: string;
  name: string;
  description?: string;
  status?: 'Draft' | 'Running' | 'Completed';
  selectedTags?: string[];
  templateId?: string | { _id: string; name: string };
  workspaceId?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  audienceCount?: number; 
}
