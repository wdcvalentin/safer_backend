import { Url } from 'url';

export interface UserRecord {
  userId?: string;
  name: string;
  locationUrl: Url | string;
  location?: string;
  device?: 'ios' | 'android' | 'windows' | 'macos' | 'web';
}
