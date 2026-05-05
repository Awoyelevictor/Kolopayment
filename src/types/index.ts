export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
}

export interface Group {
  id: string;
  name: string;
  contributionAmount: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  membersCount: number;
  maxMembers: number;
  progress: number;
  status: 'active' | 'completed';
  nextPayoutDate?: string;
  isMyTurn?: boolean;
}
