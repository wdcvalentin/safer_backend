export interface UserDetails {
  id: string;
  name: string;
  email: string;
  mailSubscriptionSent?: boolean;
  contacts?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  contacts: string[];
}

export interface userContactsEmail {
  emails: string[];
}

export interface userDataState {
  id: string;
  name: string;
  state: string;
  contacts: string[];
}
