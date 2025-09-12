export interface MessageContent {
  text: string;
  imageUrl?: string;
}

export interface MessageTemplate {
  _id?: string;
  name: string;
  type: 'Text' | 'Text-Image';
  message: MessageContent;
  workspaceId: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}
