// types/index.ts

export interface User {
  id: number;
  username: string;
  email?: string;
  isOnline: boolean;
}

export interface Message {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  senderId: number;
  receiverId: number | null;
  sender: {
    id: number;
    username: string;
    isOnline: boolean;
  };
}

export interface OnlineUsersProps {
  users: User[];
  onUserSelect: (userId: number) => void; // Zorunlu yaptık
}

export interface UserAvatarProps {
  username: string;
  isOnline: boolean;
  size: 'small' | 'medium' | 'large';
}

export interface MessageInputProps {
  onSend: (content: string) => void;
  placeholder?: string;
}

export interface MessageItemProps {
  message: Message;
  isOwnMessage: boolean;
}