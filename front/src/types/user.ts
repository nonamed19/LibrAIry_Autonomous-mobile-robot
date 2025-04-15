export interface User {
  userId: number;
  userName: string;
  isAdmin: boolean;
}

export interface UserRecord {
  bookIsbn: string;
  borrowAt: string;
  returnAt?: string;
  status: string;
}
