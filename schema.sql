
-- ১. আগের কোনো ট্রিগার বা ফাংশন থাকলে তা মুছে ফেলা (Cleanup)
-- এটি নিশ্চিত করে যে কোনো পুরনো কনফিগারেসন নতুন কোডের সাথে সংঘর্ষ করবে না।
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS public.profiles;

-- ২. প্রোফাইল টেবিল তৈরি করা (Create Profiles Table)
-- এখানে আমরা ইউজারদের প্রোফাইল তথ্য যেমন নাম, বায়ো এবং প্রোফাইল পিকচার সেভ করব।
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  username TEXT UNIQUE,
  bio TEXT,
  avatar TEXT, -- এখানে ছবি বেস৬৪ (Base64) ফরম্যাটে স্টোর হবে
  phone TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ৩. আরএলএস বা রো লেভেল সিকিউরিটি চালু করা (Enable RLS)
-- এটি ছাড়া কেউ ডেটা পড়তে বা লিখতে পারবে না।
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ৪. সিকিউরিটি পলিসি তৈরি করা (Define RLS Policies)

-- পলিসি ১: যে কেউ অন্য সবার প্রোফাইল দেখতে পারবে (Search বা Chat লিস্টের জন্য)
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

-- পলিসি ২: ইউজার শুধুমাত্র তার নিজের প্রোফাইল রো (Row) তৈরি করতে পারবে
CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- পলিসি ৩: ইউজার শুধুমাত্র তার নিজের প্রোফাইল তথ্য আপডেট করতে পারবে
CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- ৫. অটোমেটিক প্রোফাইল তৈরির ফাংশন (Trigger Function)
-- যখনই কোনো নতুন ইউজার সাইন-আপ করবে, এই ফাংশনটি অটোমেটিক্যালি 'profiles' টেবিলে একটি রো তৈরি করে দিবে।
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'New User'), 
    'https://api.dicebear.com/7.x/avataaars/svg?seed=' || new.id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ৬. ট্রিগারটি চালু করা (Enable Trigger)
-- এই ট্রিগারটি auth.users টেবিলে নজর রাখবে।
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
