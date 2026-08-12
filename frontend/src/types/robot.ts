export interface Robot {
  id: number;
  name: string;
  imageUrl?: string;
  status: string;
}

export interface RobotLog {
  type: string;
  content: string;
  createdAt: string;
  completedAt?: string;
}
