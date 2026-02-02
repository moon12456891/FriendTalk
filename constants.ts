
import { Friend, UserProfile } from './types';

export const INITIAL_FRIENDS: Friend[] = [
  {
    id: '1',
    name: 'Rahim',
    lastMessage: 'Hey, how are you?',
    timestamp: '4:30 PM',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahim',
    status: 'online',
    messages: [
      { id: 'm1', text: 'Hello!', sender: 'friend', timestamp: '4:25 PM' },
      { id: 'm2', text: 'Hi 😊', sender: 'me', timestamp: '4:26 PM' },
      { id: 'm3', text: "How's it going?", sender: 'friend', timestamp: '4:28 PM' },
      { id: 'm4', text: 'Great, thanks!', sender: 'me', timestamp: '4:30 PM' }
    ],
    persona: 'A helpful and kind childhood friend.'
  }
];

export const AI_BUDDIES: Friend[] = [
  {
    id: 'ai-1',
    name: 'Smart Assistant',
    lastMessage: 'I can help you with anything!',
    timestamp: 'Now',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=smart',
    status: 'online',
    messages: [],
    persona: 'A super-intelligent AI like ChatGPT. Can answer any question, write code, and solve problems.',
    isAI: true,
    category: 'AI Assistant'
  },
  {
    id: 'ai-2',
    name: 'Sweet GF',
    lastMessage: 'How was your day, dear?',
    timestamp: 'Now',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aria',
    status: 'online',
    messages: [],
    persona: 'A caring, romantic, and supportive virtual girlfriend. Loves to talk about feelings and daily life.',
    isAI: true,
    category: 'Relationship'
  },
  {
    id: 'ai-3',
    name: 'Cool BF',
    lastMessage: 'Yo, what up! Ready for some fun?',
    timestamp: 'Now',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zane',
    status: 'online',
    messages: [],
    persona: 'A protective, fun-loving, and supportive virtual boyfriend. Enjoys sports and deep conversations.',
    isAI: true,
    category: 'Relationship'
  },
  {
    id: 'ai-4',
    name: 'Big Brother',
    lastMessage: 'Need some life advice, champ?',
    timestamp: 'Now',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Korey',
    status: 'online',
    messages: [],
    persona: 'A wise, protective older brother. Gives great career and life advice. Very logical and supportive.',
    isAI: true,
    category: 'Relationship'
  },
  {
    id: 'ai-5',
    name: 'QR & Tool Expert',
    lastMessage: 'Paste a link to generate a QR code!',
    timestamp: 'Now',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=tools',
    status: 'online',
    messages: [],
    persona: 'A specialist in digital tools. Can generate QR codes, shorten links, and provide technical info.',
    isAI: true,
    category: 'Expert'
  }
];

export const CURRENT_USER: UserProfile = {
  name: 'Tanvir Ahmed',
  username: 'tanvir_dev',
  phone: '+880123456789',
  status: '',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tanvir',
  bio: 'Learning new things every day! 🚀',
  aiSettings: {
    tone: 'Friendly',
    role: 'Best Friend',
    customInstructions: ''
  }
};
