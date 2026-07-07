// Curated lessons from Briddhi's own YouTube channel — "Briddhi Uni".
// Video IDs are real (pulled from the channel feed). Organised into beginner-first tracks.

export const CHANNEL = {
  name: "Briddhi Uni",
  handle: "Briddhi Uni",
  url: "https://www.youtube.com/channel/UCoS1GsNFQxkhKybSDAUK39g",
  id: "UCoS1GsNFQxkhKybSDAUK39g",
};

export type TrackKey = "start" | "mf101" | "realestate" | "money";

export interface Track {
  key: TrackKey;
  label: string;
  tagline: string;
  emoji: string;
}

export const TRACKS: Track[] = [
  { key: "start", label: "Start Here", tagline: "Money basics for absolute beginners", emoji: "🌱" },
  { key: "mf101", label: "Mutual Fund 101", tagline: "The full 6-part beginner series", emoji: "📘" },
  { key: "realestate", label: "Real Estate", tagline: "From land to long-term wealth", emoji: "🏠" },
  { key: "money", label: "Money & Tax", tagline: "Smarter decisions with your income", emoji: "🧾" },
];

export interface Lesson {
  id: string; // YouTube video id
  title: string;
  track: TrackKey;
  ep?: number; // episode number within a series
  blurb: string;
}

// Ordered so that within each track, beginners can watch top-to-bottom.
export const LESSONS: Lesson[] = [
  // ---- Start Here ----
  {
    id: "zuBo3Hb0Mqw",
    title: "Inflation vs Investment",
    track: "start",
    blurb: "Why money sitting idle loses value — and how investing fights back against rising prices.",
  },
  {
    id: "CkaMlk8cA-U",
    title: "Wants vs Needs",
    track: "start",
    blurb: "The first habit of every investor: telling the difference between what you want and what you need.",
  },
  {
    id: "9aLXxmBJfWw",
    title: "Do you need a lot of money to invest?",
    track: "start",
    blurb: "Spoiler: no. How anyone can start investing in Bangladesh with a small amount.",
  },
  {
    id: "Md96BqW436E",
    title: "A Chairman's Take on Bangladesh: Investments, Business & Policies",
    track: "start",
    blurb: "Big-picture perspective on investing and opportunity in Bangladesh, with Amir Humayun Mahmud Chowdhury.",
  },

  // ---- Mutual Fund 101 (the flagship series) ----
  {
    id: "-SFJb1uzq8k",
    title: "Mutual Fund 101 — Series Introduction",
    track: "mf101",
    ep: 0,
    blurb: "Meet the series. A simple, no-jargon guide to mutual funds, presented with EDGE Asset Management.",
  },
  {
    id: "aOIVLxjDe3Y",
    title: "What is a Mutual Fund?",
    track: "mf101",
    ep: 1,
    blurb: "The core idea: many investors pooling money, managed by professionals. Start here.",
  },
  {
    id: "0cWdKh2t5Jg",
    title: "What is NAV?",
    track: "mf101",
    ep: 2,
    blurb: "Net Asset Value explained — the 'price' of one unit of a fund, and why it moves.",
  },
  {
    id: "thM31u3IWHA",
    title: "Open-ended & Closed-ended Funds",
    track: "mf101",
    ep: 3,
    blurb: "The two main types of mutual funds and how you buy or sell each one.",
  },
  {
    id: "TseSLK3Egg0",
    title: "What is SIP & Lumpsum Investment?",
    track: "mf101",
    ep: 4,
    blurb: "Two ways to invest: a little every month (SIP) or all at once (lumpsum). Which suits you?",
  },
  {
    id: "UoK4UENaFxk",
    title: "What is Taka Cost Averaging?",
    track: "mf101",
    ep: 5,
    blurb: "How investing a fixed amount regularly smooths out market ups and downs.",
  },
  {
    id: "qYOa75ZmOk0",
    title: "Types of Mutual Funds",
    track: "mf101",
    ep: 6,
    blurb: "Growth, income, balanced, Shariah — match a fund type to your goal and risk.",
  },

  // ---- Real Estate ----
  {
    id: "iXCqZ-RjVfo",
    title: "Real Estate 101: From Land to Wealth",
    track: "realestate",
    blurb: "How real estate builds long-term wealth in Bangladesh, featuring CPDL.",
  },

  // ---- Money & Tax (Briddhir Kotha) ----
  {
    id: "s70eIo7ppw4",
    title: "New Income Tax Slabs & Rebate Rules Explained",
    track: "money",
    blurb: "The latest tax slabs and rebate rules — what they mean for your take-home and savings.",
  },
  {
    id: "ZIDTBoQq6rQ",
    title: "Tax Optimization: FDR vs Mutual Fund",
    track: "money",
    blurb: "A side-by-side look at fixed deposits and mutual funds from a tax point of view.",
  },
  {
    id: "KBfN22uK04s",
    title: "New Tax Rules on Sanchayapatra Explained",
    track: "money",
    blurb: "What changed for Sanchayapatra (savings certificates) and how it affects your returns.",
  },
];

export const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
export const embedUrl = (id: string, autoplay = false) =>
  `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1${autoplay ? "&autoplay=1" : ""}`;
export const watchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;
