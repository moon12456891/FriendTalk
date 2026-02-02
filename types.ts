
export interface MessageLink {
  title: string;
  url: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'friend';
  timestamp: string;
  type?: 'text' | 'image' | 'video' | 'qr' | 'link';
  mediaUrl?: string;
  links?: MessageLink[];
}

export interface AISettings {
  tone: 'Friendly' | 'Funny' | 'Serious' | 'Motivational';
  role: 'Teacher' | 'Best Friend' | 'Tech Expert' | 'Life Coach';
  customInstructions: string;
}

export interface Friend {
  id: string;
  name: string;
  username?: string;
  phone?: string;
  lastMessage: string;
  timestamp: string;
  avatar: string;
  status: 'online' | 'offline';
  messages: Message[];
  persona: string;
  isAI?: boolean;
  category?: 'Human' | 'AI Assistant' | 'Relationship' | 'Expert';
}

export interface UserProfile {
  name: string;
  username: string;
  phone: string;
  status: string;
  avatar: string;
  bio?: string;
  interests?: string[];
  isVerified?: boolean;
  aiSettings: AISettings;
}

export interface FriendRequest {
  id: string;
  name: string;
  avatar: string;
}

export interface Notification {
  id: string;
  type: 'request' | 'suggestion' | 'message' | 'system';
  text: string;
}
