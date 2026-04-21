export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface UserPayload {
  first_name: string;
  last_name: string;
  email: string;
}
