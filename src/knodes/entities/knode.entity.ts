export interface KNode {
  _id?: string;
  name: string;
  visual?: Record<string, unknown>;
  activeVersion?: number;
  version?: number;
  isPublic?: boolean;
  type?: string;
  dataContent: Record<string, unknown>;
  mapId?: string;
  iAmId?: string;
  // ... other fields
}
