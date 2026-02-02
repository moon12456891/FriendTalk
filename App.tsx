
import React, { useState, useEffect, useRef } from 'react';
import { 
  GraduationCap, MessageCircle, Search, Home, PlusCircle, User, 
  ChevronLeft, Smile, Send, LogOut, Camera, Check, 
  ExternalLink, Users, CheckCircle2, Loader2, Phone, Languages, X,
  UserPlus, Download, Sparkles, CodeXml, FileCode, ChevronRight, Copy,
  FileText, Database, ShieldCheck
} from 'lucide-react';
import { INITIAL_FRIENDS, CURRENT_USER, AI_BUDDIES } from './constants';
import { Friend, Message, UserProfile } from './types';
import { generateFriendResponse } from './services/geminiService';
import { supabase } from './supabase';

type AppState = 'splash' | 'login' | 'signup' | 'success' | 'profileSetup' | 'main';
type Tab = 'home' | 'friends' | 'chats' | 'profile';
type Language = 'en' | 'bn';

const translations = {
  en: {
    appName: "FriendTalk",
    tagline: "Connect with everyone, instantly",
    getStarted: "Log In / Sign Up",
    continueAsGuest: "Continue as Guest",
    login: "Log In",
    signup: "Sign Up",
    emailPhone: "Email or Phone",
    password: "Password",
    forgotPass: "Forgotten password?",
    or: "or",
    createNewAcc: "Create New Account",
    quickEasy: "It's quick and easy.",
    firstName: "Full Name",
    username: "Username",
    phone: "Phone Number",
    bio: "Bio",
    bioPlaceholder: "Something about you...",
    continueHome: "Save & Finish",
    home: "Home",
    friends: "Friends",
    chat: "Chat",
    profile: "Profile",
    search: "Search",
    mind: "What's on your mind?",
    photo: "Photo",
    logout: "Log Out",
    typeMsg: "Type a message...",
    editProfile: "Edit Profile",
    save: "Save Changes",
    loading: "Please wait...",
    saveSuccess: "Profile saved!",
    errorOccurred: "Something went wrong.",
    alreadyAcc: "Already have an account?",
    accSuccess: "Account Created!",
    welcomeMsg: "Welcome to FriendTalk! Let's set up your profile.",
    setupProfile: "Setup Profile",
    profileSetupTitle: "Setup Your Profile",
    feeling: "Feeling",
    aiBuddies: "AI Buddies",
    findFriends: "Find Friends",
    mutual: "Mutual",
    addFriend: "Add Friend",
    chatsTitle: "Recent Chats",
    online: "Online",
    status: "Status",
    langSelect: "Language",
    guestMode: "Guest Mode",
    signUpFull: "Sign Up for full experience",
    installApp: "Install App",
    sourceCode: "Project Vault",
    viewFiles: "View App Source Code",
    copyCode: "Copy Code",
    copied: "Copied!",
    fileStructure: "File Structure"
  },
  bn: {
    appName: "ফ্রেন্ডটক",
    tagline: "সবার সাথে যুক্ত হোন, তাৎক্ষণিকভাবে",
    getStarted: "লগ ইন / সাইন আপ",
    continueAsGuest: "গেস্ট হিসেবে শুরু করুন",
    login: "লগ ইন",
    signup: "সাইন আপ",
    emailPhone: "ইমেইল বা ফোন",
    password: "পাসওয়ার্ড",
    forgotPass: "পাসওয়ার্ড ভুলে গেছেন?",
    or: "অথবা",
    createNewAcc: "নতুন অ্যাকাউন্ট তৈরি করুন",
    quickEasy: "এটি দ্রুত এবং সহজ।",
    firstName: "পূর্ণ নাম",
    username: "ইউজার নেম",
    phone: "ফোন নম্বর",
    bio: "বায়ো",
    bioPlaceholder: "নিজের সম্পর্কে কিছু লিখুন...",
    continueHome: "সেভ করে শুরু করুন",
    home: "হোম",
    friends: "বন্ধু",
    chat: "চ্যাট",
    profile: "প্রোফাইল",
    search: "খুঁজুন",
    mind: "আপনার মনে কি আছে?",
    photo: "ছবি",
    logout: "লগ আউট",
    typeMsg: "কিছু লিখুন...",
    editProfile: "প্রোফাইল এডিট",
    save: "পরিবর্তন সেভ করুন",
    loading: "অপেক্ষা করুন...",
    saveSuccess: "প্রোফাইল আপডেট হয়েছে!",
    errorOccurred: "দুঃখিত, কোনো সমস্যা হয়েছে।",
    alreadyAcc: "আগে থেকেই অ্যাকাউন্ট আছে?",
    accSuccess: "অ্যাকাউন্ট তৈরি হয়েছে!",
    welcomeMsg: "ফ্রেন্ডটক-এ স্বাগতম! আপনার প্রোফাইল সেট আপ করুন।",
    setupProfile: "প্রোফাইল সেটআপ",
    profileSetupTitle: "প্রোফাইল সেটআপ করুন",
    feeling: "অনুভূতি",
    aiBuddies: "এআই বন্ধু",
    findFriends: "বন্ধু খুঁজুন",
    mutual: "মিউচুয়াল",
    addFriend: "বন্ধু যোগ করুন",
    chatsTitle: "সাম্প্রতিক চ্যাট",
    online: "অনলাইন",
    status: "স্ট্যাটাস",
    langSelect: "ভাষা",
    guestMode: "গেস্ট মোড",
    signUpFull: "পূর্ণ সুবিধার জন্য সাইন আপ করুন",
    installApp: "অ্যাপ নামান",
    sourceCode: "প্রজেক্ট ভল্ট",
    viewFiles: "অ্যাপ সোর্স কোড দেখুন",
    copyCode: "কোড কপি করুন",
    copied: "কপি হয়েছে!",
    fileStructure: "ফাইল স্ট্রাকচার"
  }
};

const SOURCE_CODE_FILES = [
  { 
    name: 'App.tsx', 
    language: 'typescript',
    content: `// FriendTalk: Main Application Logic\n// Developed with React, Tailwind CSS, and Gemini API\n\nimport React, { useState, useEffect } from 'react';\nimport { supabase } from './supabase';\nimport { generateFriendResponse } from './services/geminiService';\n\nexport default function App() {\n  // State Management for Authentication, Tabs, and Real-time Chat\n  const [appState, setAppState] = useState('splash');\n  const [activeTab, setActiveTab] = useState('home');\n  \n  // Gemini API integration for AI Buddies\n  const handleSendMessage = async () => {\n     // Logic for sending messages and receiving AI responses\n  };\n\n  return (\n    <div className="friendtalk-app">\n       {/* Responsive UI Components */}\n    </div>\n  );\n}`
  },
  { 
    name: 'constants.ts', 
    language: 'typescript',
    content: `import { Friend, UserProfile } from './types';\n\nexport const INITIAL_FRIENDS: Friend[] = [\n  { id: '1', name: 'Rahim', lastMessage: 'Hey!', timestamp: '4:30 PM', ... }\n];\n\nexport const AI_BUDDIES: Friend[] = [\n  { id: 'ai-1', name: 'Smart Assistant', persona: 'Super-intelligent AI...', isAI: true },\n  { id: 'ai-2', name: 'Sweet GF', persona: 'Caring, romantic virtual girlfriend...', isAI: true },\n  { id: 'ai-5', name: 'QR Expert', persona: 'Specialist in digital tools...', isAI: true }\n];`
  },
  { 
    name: 'types.ts', 
    language: 'typescript',
    content: `export interface Message { id: string; text: string; sender: 'me' | 'friend'; timestamp: string; type?: string; }\n\nexport interface Friend { id: string; name: string; avatar: string; messages: Message[]; persona: string; isAI?: boolean; }\n\nexport interface UserProfile { name: string; username: string; phone: string; avatar: string; bio?: string; }`
  },
  { 
    name: 'supabase.ts', 
    language: 'typescript',
    content: `import { createClient } from '@supabase/supabase-js';\n\nconst supabaseUrl = 'https://vaqgodppfruxacdgxrah.supabase.co';\nconst supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';\n\nexport const supabase = createClient(supabaseUrl, supabaseAnonKey);`
  },
  { 
    name: 'services/geminiService.ts', 
    language: 'typescript',
    content: `import { GoogleGenAI } from "@google/genai";\n\nexport const generateFriendResponse = async (friend, userMessage, history, userProfile) => {\n  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });\n  const response = await ai.models.generateContent({\n    model: 'gemini-3-flash-preview',\n    contents: [...history, { role: 'user', parts: [{ text: userMessage }] }],\n    config: { systemInstruction: \`IDENTITY: \${friend.name}... \`, tools: [{ googleSearch: {} }] }\n  });\n  return { text: response.text, links: extractLinks(response) };\n};`
  },
  { 
    name: 'schema.sql', 
    language: 'sql',
    content: `-- Supabase Database Schema\nCREATE TABLE public.profiles (\n  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,\n  name TEXT, username TEXT UNIQUE, bio TEXT, avatar TEXT, phone TEXT,\n  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n);\n\n-- Row Level Security (RLS)\nALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;\nCREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);`
  }
];

export default function App() {
  const [appState, setAppState] = useState<AppState>('splash');
  const [lang, setLang] = useState<Language>(() => (localStorage.getItem('friendtalk_lang') as Language) || 'en');
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isGuest, setIsGuest] = useState(false);
  const [showInstallTip, setShowInstallTip] = useState(false);
  const [viewingCode, setViewingCode] = useState(false);
  const [selectedFile, setSelectedFile] = useState<typeof SOURCE_CODE_FILES[0] | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('friendtalk_guest_profile');
    return saved ? JSON.parse(saved) : CURRENT_USER;
  });

  const [authIdentifier, setAuthIdentifier] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [fullName, setFullName] = useState(user.name);
  const [formUsername, setFormUsername] = useState(user.username);
  const [formBio, setFormBio] = useState(user.bio || '');
  const [formAvatar, setFormAvatar] = useState(user.avatar);
  const [formPhone, setFormPhone] = useState(user.phone);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const t = translations[lang];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
        setAppState('main');
        setIsGuest(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
        setAppState('main');
        setIsGuest(false);
      } else if (!isGuest) {
        setAppState('splash');
      }
    });

    return () => subscription.unsubscribe();
  }, [isGuest]);

  const fetchProfile = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (data) {
        const profileData = {
          ...CURRENT_USER,
          name: data.name || "User",
          username: data.username || '',
          bio: data.bio || '',
          avatar: data.avatar || CURRENT_USER.avatar,
          phone: data.phone || ''
        };
        setUser(profileData);
        setFullName(profileData.name);
        setFormUsername(profileData.username);
        setFormBio(profileData.bio);
        setFormAvatar(profileData.avatar);
        setFormPhone(profileData.phone);
      }
    } catch (err) {
      console.error("Profile sync error:", err);
    }
  };

  const handleGuestEntry = () => {
    setIsGuest(true);
    setAppState('main');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_SIZE = 400;
          if (width > height) { if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; } } 
          else { if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; } }
          canvas.width = width; canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          setFormAvatar(canvas.toDataURL('image/jpeg', 0.8));
          setIsLoading(false);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignUp = async () => {
    if (!authIdentifier || !authPassword || !fullName) {
      setAuthError(translations[lang].errorOccurred);
      return;
    }
    setIsLoading(true); setAuthError('');
    const email = authIdentifier.includes('@') ? authIdentifier : `${authIdentifier}@friendtalk.app`;
    const { error } = await supabase.auth.signUp({
      email, password: authPassword, options: { data: { full_name: fullName } }
    });
    if (error) { setAuthError(error.message); setIsLoading(false); } 
    else { setAppState('success'); setIsLoading(false); }
  };

  const handleLogIn = async () => {
    if (!authIdentifier || !authPassword) { setAuthError("Please fill all fields"); return; }
    setIsLoading(true); setAuthError('');
    const email = authIdentifier.includes('@') ? authIdentifier : `${authIdentifier}@friendtalk.app`;
    const { error } = await supabase.auth.signInWithPassword({ email, password: authPassword });
    if (error) setAuthError(error.message); else setAppState('main');
    setIsLoading(false);
  };

  const handleSaveProfile = async () => {
    setIsLoading(true); setAuthError('');
    
    if (isGuest) {
      const guestProfile = { ...user, name: fullName, username: formUsername, bio: formBio, avatar: formAvatar, phone: formPhone };
      setUser(guestProfile);
      localStorage.setItem('friendtalk_guest_profile', JSON.stringify(guestProfile));
      setIsLoading(false);
      if (appState === 'profileSetup') setAppState('main');
      else setActiveTab('home');
      return;
    }

    if (!session) return;
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: session.user.id,
        name: fullName,
        username: formUsername,
        bio: formBio,
        avatar: formAvatar,
        phone: formPhone,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (!error) {
      setUser(prev => ({ ...prev, name: fullName, username: formUsername, bio: formBio, avatar: formAvatar, phone: formPhone }));
      setIsLoading(false);
      if (appState === 'profileSetup') setAppState('main');
      else setActiveTab('home');
    } else {
      setAuthError(error.message);
      setIsLoading(false);
    }
  };

  const handleLogOut = async () => {
    if (isGuest) {
      setIsGuest(false);
      setAppState('splash');
      return;
    }
    await supabase.auth.signOut();
  };

  const handleCopyCode = (content: string) => {
    navigator.clipboard.writeText(content);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedFriend || isTyping) return;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = { id: Date.now().toString(), text: newMessage, sender: 'me', timestamp };
    const updatedMessages = [...selectedFriend.messages, userMsg];
    setSelectedFriend({ ...selectedFriend, messages: updatedMessages });
    setNewMessage('');

    if (selectedFriend.isAI) {
      setIsTyping(true);
      try {
        const result = await generateFriendResponse(selectedFriend, userMsg.text, updatedMessages, user);
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          text: result.text,
          sender: 'friend',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          links: result.links,
          type: result.functionCall ? 'qr' : 'text',
          mediaUrl: result.functionCall ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(result.functionCall.args.data)}` : undefined
        };
        setSelectedFriend(prev => prev ? { ...prev, messages: [...prev.messages, aiMsg] } : null);
      } catch (error) { console.error(error); } finally { setIsTyping(false); }
    }
  };

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [selectedFriend?.messages, isTyping]);

  if (appState === 'splash') {
    return (
      <div className="flex h-screen w-full bg-[#E3F2FD] flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700">
        <div className="mb-12">
           <div className="w-24 h-24 bg-[#1976D2] rounded-[32px] flex items-center justify-center text-white shadow-xl mx-auto mb-6 animate-pulse">
              <GraduationCap size={56} strokeWidth={2.5} />
           </div>
           <h1 className="text-4xl font-black text-black tracking-tight">{t.appName}</h1>
           <p className="text-sm font-bold text-gray-400 mt-2">{t.tagline}</p>
        </div>
        <div className="w-full max-w-xs space-y-4">
          <button onClick={() => setAppState('login')} className="w-full bg-[#1976D2] text-white py-4 rounded-[24px] font-black text-lg shadow-lg active:scale-95 transition-all">
            {t.getStarted}
          </button>
          <button onClick={handleGuestEntry} className="w-full bg-white text-gray-600 py-4 rounded-[24px] font-black text-lg shadow-sm border border-blue-100 active:scale-95 transition-all">
            {t.continueAsGuest}
          </button>
        </div>
      </div>
    );
  }

  if (appState === 'login') {
    return (
      <div className="flex flex-col h-screen w-full bg-[#E3F2FD] p-6 justify-center max-w-md mx-auto">
        <div className="text-center mb-8 relative">
           <button onClick={() => setAppState('splash')} className="absolute -top-10 left-0 p-2 text-gray-400"><ChevronLeft size={24} /></button>
          <h2 className="text-4xl font-black text-[#1976D2] tracking-tighter mb-2">{t.appName}</h2>
        </div>
        <div className="bg-white p-6 rounded-[32px] shadow-xl space-y-4 border border-blue-50">
          <input type="text" placeholder={t.emailPhone} value={authIdentifier} onChange={e => setAuthIdentifier(e.target.value)} className="w-full bg-[#F0F2F5] p-4 rounded-xl outline-none font-bold text-black border-2 border-transparent focus:border-blue-200" />
          <input type="password" placeholder={t.password} value={authPassword} onChange={e => setAuthPassword(e.target.value)} className="w-full bg-[#F0F2F5] p-4 rounded-xl outline-none font-bold text-black border-2 border-transparent focus:border-blue-200" />
          {authError && <p className="text-red-500 text-xs font-bold text-center">{authError}</p>}
          <button disabled={isLoading} onClick={handleLogIn} className="w-full bg-[#1976D2] text-white py-4 rounded-xl font-black text-lg shadow-md active:scale-95 flex items-center justify-center">
            {isLoading ? <Loader2 className="animate-spin" /> : t.login}
          </button>
          <button className="w-full text-[#1976D2] font-bold text-sm text-center">{t.forgotPass}</button>
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-[1px] bg-gray-200"></div>
            <span className="text-[10px] font-black text-gray-400 uppercase">{t.or}</span>
            <div className="flex-1 h-[1px] bg-gray-200"></div>
          </div>
          <button onClick={() => setAppState('signup')} className="w-full bg-[#42B72A] text-white py-3.5 rounded-xl font-black text-base shadow-md active:scale-95">
            {t.createNewAcc}
          </button>
        </div>
      </div>
    );
  }

  if (appState === 'signup') {
    return (
      <div className="flex flex-col h-screen w-full bg-[#E3F2FD] p-6 justify-center max-w-md mx-auto">
        <div className="bg-white p-8 rounded-[32px] shadow-2xl space-y-6 border border-blue-50 relative">
          <button onClick={() => setAppState('login')} className="absolute top-6 right-6 p-1 text-gray-400"><X size={24} /></button>
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-black leading-none">{t.signup}</h2>
            <p className="text-sm text-gray-500 font-bold">{t.quickEasy}</p>
          </div>
          <div className="space-y-4">
            <input type="text" placeholder={t.firstName} value={fullName} onChange={e => setFullName(e.target.value)} className="w-full bg-[#F0F2F5] p-4 rounded-xl outline-none font-bold text-black border-2 border-transparent focus:border-blue-200" />
            <input type="text" placeholder={t.emailPhone} value={authIdentifier} onChange={e => setAuthIdentifier(e.target.value)} className="w-full bg-[#F0F2F5] p-4 rounded-xl outline-none font-bold text-black border-2 border-transparent focus:border-blue-200" />
            <input type="password" placeholder={t.password} value={authPassword} onChange={e => setAuthPassword(e.target.value)} className="w-full bg-[#F0F2F5] p-4 rounded-xl outline-none font-bold text-black border-2 border-transparent focus:border-blue-200" />
            {authError && <p className="text-red-500 text-xs font-bold text-center">{authError}</p>}
            <button disabled={isLoading} onClick={handleSignUp} className="w-full bg-[#42B72A] text-white py-4 rounded-xl font-black text-lg shadow-md active:scale-95 flex items-center justify-center">
              {isLoading ? <Loader2 className="animate-spin" /> : t.signup}
            </button>
            <button onClick={() => setAppState('login')} className="w-full text-[#1976D2] font-black text-sm text-center">
              {t.alreadyAcc}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (appState === 'success') {
    return (
      <div className="flex h-screen w-full bg-[#E3F2FD] flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-500 text-white rounded-[32px] flex items-center justify-center mb-6 shadow-xl"><CheckCircle2 size={56} /></div>
        <h2 className="text-3xl font-black mb-2 text-black">{t.accSuccess}</h2>
        <p className="text-gray-500 mb-10 font-medium">{t.welcomeMsg}</p>
        <button onClick={() => setAppState('profileSetup')} className="w-full max-w-xs bg-[#1976D2] text-white py-4 rounded-2xl font-black text-lg shadow-lg active:scale-95">{t.setupProfile}</button>
      </div>
    );
  }

  if (viewingCode) {
    return (
      <div className="flex flex-col h-screen w-full bg-[#F8FAFC] text-black">
        <header className="h-[70px] bg-white border-b border-blue-100 flex items-center justify-between px-4 shrink-0 shadow-sm z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => {if(selectedFile) setSelectedFile(null); else setViewingCode(false);}} className="p-2 hover:bg-blue-50 rounded-full transition-colors"><ChevronLeft size={24} /></button>
            <div><h3 className="font-black text-base leading-none text-[#1976D2]">{t.sourceCode}</h3><p className="text-[10px] font-bold uppercase text-gray-400 mt-1 tracking-widest">{selectedFile ? selectedFile.name : t.fileStructure}</p></div>
          </div>
          {selectedFile && (
            <button onClick={() => handleCopyCode(selectedFile.content)} className="flex items-center gap-2 bg-[#1976D2] hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg transition-all active:scale-95">
              {codeCopied ? <Check size={14} /> : <Copy size={14} />} {codeCopied ? t.copied : t.copyCode}
            </button>
          )}
        </header>
        <div className="flex-1 overflow-hidden flex flex-col relative">
          {!selectedFile ? (
            <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar animate-in slide-in-from-bottom duration-300">
               {SOURCE_CODE_FILES.map(file => (
                 <button key={file.name} onClick={() => setSelectedFile(file)} className="w-full flex items-center justify-between p-5 bg-white rounded-3xl border border-blue-50 shadow-sm hover:border-[#1976D2] transition-all active:scale-[0.98]">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-blue-50 text-[#1976D2] rounded-2xl"><FileCode size={20} /></div>
                       <div className="text-left">
                          <p className="font-black text-sm tracking-tight">{file.name}</p>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mt-0.5">{file.language}</p>
                       </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-300" />
                 </button>
               ))}
               <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 mt-6">
                  <h4 className="font-black text-xs text-[#1976D2] uppercase tracking-widest mb-3 flex items-center gap-2"><ShieldCheck size={14} /> Developer Note</h4>
                  <p className="text-[11px] font-medium leading-relaxed text-gray-600">This vault contains the actual source code of <b>FriendTalk</b>. All files are documented for educational and development purposes. Security policies (RLS) and API configurations are embedded within the respective modules.</p>
               </div>
            </div>
          ) : (
            <div className="flex-1 overflow-auto bg-white p-4 animate-in fade-in duration-300">
               <div className="bg-[#0D1117] border border-gray-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#1976D2]/50"></div>
                  <pre className="text-blue-300 overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-relaxed selection:bg-blue-500/30">
                    <code>{selectedFile.content}</code>
                  </pre>
               </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (appState === 'profileSetup' || activeTab === 'profile') {
    const isEditing = activeTab === 'profile';
    return (
      <div className="flex flex-col h-screen w-full bg-[#E3F2FD]">
        <header className="h-[70px] bg-white border-b border-blue-100 flex items-center justify-between px-5 shrink-0 z-20 shadow-sm">
          {isEditing ? <button onClick={() => setActiveTab('home')} className="p-2 text-gray-400"><ChevronLeft size={24} /></button> : <div className="w-10"></div>}
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-black">{isEditing ? t.editProfile : t.profileSetupTitle}</h2>
            {isGuest && <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-tighter">{t.guestMode}</span>}
          </div>
          <div className="w-10"></div>
        </header>
        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar pb-32">
          <div className="flex flex-col items-center gap-4">
             <div className="relative">
                <div className="w-32 h-32 rounded-[40px] bg-white border-4 border-white shadow-xl overflow-hidden">
                  {formAvatar ? <img src={formAvatar} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-blue-50 flex items-center justify-center text-blue-200"><User size={64} /></div>}
                </div>
                <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-[#1976D2] text-white p-3 rounded-2xl shadow-lg active:scale-90 transition-transform"><Camera size={20} /></button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
             </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-[#1976D2] ml-2 tracking-widest">{t.firstName}</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full bg-white p-4 rounded-2xl shadow-sm outline-none font-bold text-black border-2 border-transparent focus:border-blue-100" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-[#1976D2] ml-2 tracking-widest">{t.username}</label>
              <input type="text" value={formUsername} onChange={e => setFormUsername(e.target.value)} className="w-full bg-white p-4 rounded-2xl shadow-sm outline-none font-bold text-black border-2 border-transparent focus:border-blue-100" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-[#1976D2] ml-2 tracking-widest">{t.phone}</label>
              <input type="text" value={formPhone} onChange={e => setFormPhone(e.target.value)} className="w-full bg-white p-4 rounded-2xl shadow-sm outline-none font-bold text-black border-2 border-transparent focus:border-blue-100" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-[#1976D2] ml-2 tracking-widest">{t.bio}</label>
              <textarea value={formBio} onChange={e => setFormBio(e.target.value)} placeholder={t.bioPlaceholder} className="w-full bg-white p-4 rounded-2xl shadow-sm outline-none font-medium text-black h-24 resize-none border-2 border-transparent focus:border-blue-100" />
            </div>
          </div>

          {/* Project Vault Option */}
          <button onClick={() => setViewingCode(true)} className="w-full flex items-center justify-between p-5 bg-white rounded-3xl shadow-sm border border-blue-50 active:scale-[0.98] transition-all group">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-[#1976D2] rounded-2xl group-hover:bg-[#1976D2] group-hover:text-white transition-colors"><CodeXml size={20} /></div>
                <div className="text-left">
                   <p className="font-black text-sm tracking-tight">{t.sourceCode}</p>
                   <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{t.viewFiles}</p>
                </div>
             </div>
             <ChevronRight size={18} className="text-gray-300" />
          </button>

          <div className="bg-white p-5 rounded-3xl shadow-sm border border-blue-50">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3"><Languages size={20} className="text-[#1976D2]" /><span className="font-bold text-sm text-black">{t.langSelect}</span></div>
                <div className="flex bg-blue-50 p-1 rounded-xl">
                   <button onClick={() => {setLang('en'); localStorage.setItem('friendtalk_lang', 'en');}} className={`px-3 py-1 text-[10px] font-black rounded-lg transition-all ${lang === 'en' ? 'bg-[#1976D2] text-white' : 'text-gray-400'}`}>EN</button>
                   <button onClick={() => {setLang('bn'); localStorage.setItem('friendtalk_lang', 'bn');}} className={`px-3 py-1 text-[10px] font-black rounded-lg transition-all ${lang === 'bn' ? 'bg-[#1976D2] text-white' : 'text-gray-400'}`}>BN</button>
                </div>
             </div>
          </div>

          <div className="bg-white p-5 rounded-3xl shadow-sm border border-blue-50">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3"><Download size={20} className="text-[#1976D2]" /><span className="font-bold text-sm text-black">{t.installApp}</span></div>
                <button onClick={() => setShowInstallTip(!showInstallTip)} className="text-[10px] font-black text-[#1976D2] uppercase px-3 py-1 bg-blue-50 rounded-lg">PWA</button>
             </div>
             {showInstallTip && <div className="mt-3 text-[10px] font-bold text-gray-400 bg-blue-50 p-3 rounded-xl">
               {lang === 'en' ? 'Tap browser menu and select "Add to Home Screen" to install.' : 'ব্রাউজার মেনু থেকে "Add to Home Screen" সিলেক্ট করে অ্যাপটি নামিয়ে নিন।'}
             </div>}
          </div>

          {isGuest && (
            <div className="bg-blue-600 text-white p-5 rounded-[24px] shadow-lg flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-black text-sm leading-tight mb-1">{t.signUpFull}</h4>
                <p className="text-[10px] opacity-80 font-bold uppercase tracking-tighter">Backup your chats & profile</p>
              </div>
              <button onClick={() => setAppState('signup')} className="bg-white text-blue-600 p-3 rounded-2xl shadow-sm active:scale-95 transition-all"><UserPlus size={20} /></button>
            </div>
          )}

          <button disabled={isLoading} onClick={handleSaveProfile} className="w-full bg-[#1976D2] text-white py-5 rounded-[24px] font-black text-lg shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3">
            {isLoading ? <Loader2 className="animate-spin" /> : <><Check size={20} /> {isEditing ? t.save : t.continueHome}</>}
          </button>
          
          <button onClick={handleLogOut} className="w-full bg-red-50 text-red-600 py-4 rounded-[24px] font-black text-sm flex items-center justify-center gap-2 mt-2"><LogOut size={18} /> {t.logout}</button>
        </div>
        {isEditing && (
           <nav className="h-[80px] bg-white border-t border-blue-100 flex items-center justify-around fixed bottom-0 w-full z-20 pb-4">
             <button onClick={() => setActiveTab('home')} className="flex flex-col items-center gap-1 text-gray-400 opacity-60"><Home size={22} /><span className="text-[10px] font-black uppercase">{t.home}</span></button>
             <button onClick={() => setActiveTab('friends')} className="flex flex-col items-center gap-1 text-gray-400 opacity-60"><Users size={22} /><span className="text-[10px] font-black uppercase">{t.friends}</span></button>
             <button onClick={() => setActiveTab('chats')} className="flex flex-col items-center gap-1 text-gray-400 opacity-60"><MessageCircle size={22} /><span className="text-[10px] font-black uppercase">{t.chat}</span></button>
             <button onClick={() => setActiveTab('profile')} className="flex flex-col items-center gap-1 text-[#1976D2] scale-110"><User size={22} /><span className="text-[10px] font-black uppercase">{t.profile}</span></button>
           </nav>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-[#E3F2FD] text-black font-sans overflow-hidden">
      <header className="h-[70px] bg-white border-b border-blue-100 flex items-center justify-between px-5 shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black text-[#1976D2] tracking-tighter">{t.appName}</h1>
          {isGuest && <span className="bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-lg text-[8px] font-black uppercase">{t.guestMode}</span>}
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2.5 bg-blue-50 text-[#1976D2] rounded-full"><Search size={20} /></button>
          <button onClick={() => setActiveTab('profile')} className="w-10 h-10 rounded-xl overflow-hidden border-2 border-blue-100 shadow-inner">
            <img src={user.avatar} className="w-full h-full object-cover" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {activeTab === 'home' && (
          <div className="p-5 space-y-6 animate-in slide-in-from-bottom duration-500">
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-blue-50">
               <div className="flex items-center gap-4 mb-4">
                  <img src={user.avatar} className="w-12 h-12 rounded-2xl object-cover border border-blue-50" />
                  <div className="flex-1 bg-blue-50 rounded-2xl p-4 text-gray-400 font-bold text-sm tracking-tight">{t.mind}</div>
               </div>
               <div className="flex justify-around pt-4 border-t border-blue-50">
                  <button className="flex items-center gap-2 text-xs font-black text-red-500 uppercase"><Camera size={16} /> {t.photo}</button>
                  <button className="flex items-center gap-2 text-xs font-black text-green-500 uppercase"><PlusCircle size={16} /> {t.status}</button>
                  <button className="flex items-center gap-2 text-xs font-black text-blue-500 uppercase"><Smile size={16} /> {t.feeling}</button>
               </div>
            </div>
            
            <h3 className="font-black text-lg text-[#1976D2] tracking-tight ml-2">{t.aiBuddies}</h3>
            <div className="grid grid-cols-1 gap-3">
              {AI_BUDDIES.map(ai => (
                <button key={ai.id} onClick={() => setSelectedFriend(ai)} className="flex items-center gap-4 p-4 bg-white rounded-3xl shadow-sm border border-blue-50 hover:border-[#1976D2] transition-all group active:scale-[0.98]">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden"><img src={ai.avatar} className="w-full h-full object-cover group-hover:scale-110 transition-transform" /></div>
                  <div className="flex-1 text-left"><span className="font-black text-lg text-black leading-none">{ai.name}</span><p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight line-clamp-1">{ai.persona}</p></div>
                  <PlusCircle className="text-[#1976D2]" size={24} />
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'friends' && (
          <div className="p-4 space-y-4 animate-in fade-in duration-500">
             <h2 className="text-2xl font-black px-2 uppercase tracking-tight">{t.findFriends}</h2>
             <div className="grid grid-cols-2 gap-3">
                {INITIAL_FRIENDS.map(f => (
                  <div key={f.id} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-blue-50 flex flex-col items-center p-5 text-center">
                    <img src={f.avatar} className="w-20 h-20 rounded-3xl bg-blue-50 mb-3 object-cover border border-blue-100" />
                    <h4 className="font-black truncate w-full text-black">{f.name}</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-4 tracking-widest">{t.mutual}: 12</p>
                    <button className="w-full bg-[#1976D2] text-white py-2.5 rounded-2xl text-[10px] font-black shadow-lg shadow-blue-100 active:scale-95">{t.addFriend}</button>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'chats' && (
          <div className="p-4 space-y-4 animate-in fade-in duration-500">
            <h2 className="text-2xl font-black px-2 uppercase tracking-tight">{t.chatsTitle}</h2>
            <div className="space-y-1">
              {INITIAL_FRIENDS.map(friend => (
                <button key={friend.id} onClick={() => setSelectedFriend(friend)} className="w-full flex items-center gap-4 p-4 hover:bg-white/40 rounded-3xl transition-all">
                  <img src={friend.avatar} className="w-14 h-14 rounded-2xl border border-blue-100 object-cover" />
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex justify-between items-center"><h3 className="font-black text-lg text-black truncate">{friend.name}</h3><span className="text-[10px] font-bold text-gray-400 uppercase">{friend.timestamp}</span></div>
                    <p className="text-sm text-gray-600 truncate font-medium">{friend.lastMessage}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      <nav className="h-[80px] bg-white border-t border-blue-100 flex items-center justify-around fixed bottom-0 w-full z-20 pb-4">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-[#1976D2] scale-110' : 'text-gray-400 opacity-60'}`}><Home size={22} /><span className="text-[10px] font-black uppercase">{t.home}</span></button>
        <button onClick={() => setActiveTab('friends')} className={`flex flex-col items-center gap-1 ${activeTab === 'friends' ? 'text-[#1976D2] scale-110' : 'text-gray-400 opacity-60'}`}><Users size={22} /><span className="text-[10px] font-black uppercase">{t.friends}</span></button>
        <button onClick={() => setActiveTab('chats')} className={`flex flex-col items-center gap-1 ${activeTab === 'chats' ? 'text-[#1976D2] scale-110' : 'text-gray-400 opacity-60'}`}><MessageCircle size={22} /><span className="text-[10px] font-black uppercase">{t.chat}</span></button>
        <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 ${(activeTab as string) === 'profile' ? 'text-[#1976D2] scale-110' : 'text-gray-400 opacity-60'}`}><User size={22} /><span className="text-[10px] font-black uppercase">{t.profile}</span></button>
      </nav>

      {selectedFriend && (
        <div className="absolute inset-0 z-50 bg-[#E3F2FD] flex flex-col animate-in slide-in-from-right duration-300">
          <header className="h-[70px] bg-white border-b border-blue-100 flex items-center px-4 gap-4 shrink-0 shadow-sm">
            <button onClick={() => setSelectedFriend(null)} className="p-2 hover:bg-blue-50 rounded-full"><ChevronLeft size={24} /></button>
            <div className="flex items-center gap-3">
              <img src={selectedFriend.avatar} className="w-10 h-10 rounded-xl border border-blue-100 object-cover" />
              <div><h3 className="font-black text-base text-black leading-none">{selectedFriend.name}</h3><p className="text-[10px] font-bold uppercase text-green-500">{t.online}</p></div>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto p-4 space-y-5 no-scrollbar">
            {selectedFriend.messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-[24px] text-sm font-medium shadow-sm flex flex-col gap-3 ${msg.sender === 'me' ? 'bg-[#1976D2] text-white rounded-tr-none' : 'bg-white text-black rounded-tl-none border border-blue-50'}`}>
                  {msg.type === 'qr' && msg.mediaUrl ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-3 bg-white rounded-2xl shadow-inner"><img src={msg.mediaUrl} alt="QR Code" className="w-48 h-48" /></div>
                      <p className="text-[10px] font-bold opacity-80">{msg.text}</p>
                    </div>
                  ) : <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>}
                  {msg.links && msg.links.length > 0 && (
                    <div className="flex flex-col gap-2 pt-2 border-t border-white/20">
                      {msg.links.map((link, idx) => (
                        <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-between p-3 rounded-xl text-[10px] font-black ${msg.sender === 'me' ? 'bg-white/20 text-white' : 'bg-blue-50 text-[#1976D2]'}`}>
                          <span className="truncate mr-2">{link.title}</span><ExternalLink size={14} />
                        </a>
                      ))}
                    </div>
                  )}
                  <div className={`text-[8px] font-black opacity-40 uppercase ${msg.sender === 'me' ? 'text-right' : 'text-left'}`}>{msg.timestamp}</div>
                </div>
              </div>
            ))}
            {isTyping && <div className="flex justify-start"><div className="bg-white p-3 rounded-2xl rounded-tl-none border border-blue-50 flex gap-1"><div className="w-1.5 h-1.5 bg-[#1976D2] rounded-full animate-bounce"></div><div className="w-1.5 h-1.5 bg-[#1976D2] rounded-full animate-bounce delay-75"></div><div className="w-1.5 h-1.5 bg-[#1976D2] rounded-full animate-bounce delay-150"></div></div></div>}
            <div ref={chatEndRef} />
          </div>
          <div className="p-4 bg-white border-t border-blue-100 pb-8">
            <div className="flex items-center gap-2 bg-[#F8FAFC] p-2 rounded-[24px] border border-blue-50">
              <input type="text" placeholder={t.typeMsg} className="flex-1 bg-transparent border-none outline-none font-bold px-3 py-2 text-black text-sm" value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} />
              <button onClick={handleSendMessage} disabled={!newMessage.trim() || isTyping} className="p-3 bg-[#1976D2] text-white rounded-2xl shadow-lg active:scale-90 transition-transform"><Send size={20} /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
