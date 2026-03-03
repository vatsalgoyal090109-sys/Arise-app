import { useState, useEffect, useReducer, useCallback, useMemo, useRef } from "react";
import {
  Sword, BookOpen, Dumbbell, Brain, Flame, Clock, Smartphone, ScrollText,
  Home, CheckSquare, User, Star, Trophy, Plus, X, ChevronUp, ChevronDown,
  Play, Pause, RotateCcw, Zap, Target, Shield, Eye, EyeOff, ArrowLeft,
  TrendingUp, Calendar, Edit3, Trash2, Check, AlertTriangle, Crown, Activity
} from "lucide-react";

// ─── STYLES ─────────────────────────────────────────────────────────────────
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --mana: #4FC3F7;
  --violet: #9B59B6;
  --crimson: #E74C3C;
  --gold: #F39C12;
  --bg: #050508;
  --bg2: #0a0a12;
  --bg3: #0f0f1a;
  --card: rgba(10,10,20,0.9);
  --border: rgba(79,195,247,0.2);
  --border-bright: rgba(79,195,247,0.5);
  --text: #e0e8ff;
  --text-dim: #6a7a9a;
}

body { background: var(--bg); color: var(--text); font-family: 'Courier New', monospace; overflow: hidden; }

.cinzel { font-family: 'Cinzel', serif; }

.panel {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: inset 0 0 20px rgba(79,195,247,0.03), 0 4px 20px rgba(0,0,0,0.5);
}

.panel-glow {
  box-shadow: 0 0 20px rgba(79,195,247,0.15), inset 0 0 20px rgba(79,195,247,0.05);
}

.btn-mana {
  background: linear-gradient(135deg, rgba(79,195,247,0.15), rgba(79,195,247,0.05));
  border: 1px solid var(--mana);
  color: var(--mana);
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  font-family: 'Cinzel', serif;
  font-size: 12px;
  letter-spacing: 1px;
  transition: all 0.2s;
}
.btn-mana:hover { background: rgba(79,195,247,0.25); box-shadow: 0 0 15px rgba(79,195,247,0.4); }

.btn-gold {
  background: linear-gradient(135deg, rgba(243,156,18,0.2), rgba(243,156,18,0.05));
  border: 1px solid var(--gold);
  color: var(--gold);
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  font-family: 'Cinzel', serif;
  font-size: 12px;
  letter-spacing: 1px;
  transition: all 0.2s;
}
.btn-gold:hover { box-shadow: 0 0 15px rgba(243,156,18,0.4); }

.btn-danger {
  background: linear-gradient(135deg, rgba(231,76,60,0.2), rgba(231,76,60,0.05));
  border: 1px solid var(--crimson);
  color: var(--crimson);
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}
.btn-danger:hover { box-shadow: 0 0 15px rgba(231,76,60,0.4); }

.input-dark {
  background: rgba(5,5,15,0.8);
  border: 1px solid var(--border);
  color: var(--text);
  border-radius: 6px;
  padding: 10px 14px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;
}
.input-dark:focus { border-color: var(--mana); box-shadow: 0 0 10px rgba(79,195,247,0.2); }

.scrollable { overflow-y: auto; scrollbar-width: thin; scrollbar-color: rgba(79,195,247,0.3) transparent; }

/* ANIMATIONS */
@keyframes arise-intro {
  0% { opacity: 0; letter-spacing: 20px; }
  50% { opacity: 1; letter-spacing: 8px; }
  80% { opacity: 1; letter-spacing: 8px; }
  100% { opacity: 0; letter-spacing: 8px; }
}
@keyframes xpFloat {
  0% { opacity: 1; transform: translateY(0) scale(1); }
  100% { opacity: 0; transform: translateY(-80px) scale(1.3); }
}
@keyframes levelUpFlash {
  0% { opacity: 0; transform: scale(0.3); }
  40% { opacity: 1; transform: scale(1.15); }
  70% { transform: scale(0.95); }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes manaGlow {
  0%, 100% { box-shadow: 0 0 10px rgba(79,195,247,0.5), 0 0 20px rgba(79,195,247,0.2); }
  50% { box-shadow: 0 0 25px rgba(79,195,247,0.9), 0 0 50px rgba(79,195,247,0.4), 0 0 80px rgba(79,195,247,0.2); }
}
@keyframes rankPulse {
  0%, 100% { filter: drop-shadow(0 0 8px currentColor) drop-shadow(0 0 2px currentColor); }
  50% { filter: drop-shadow(0 0 20px currentColor) drop-shadow(0 0 40px currentColor); }
}
@keyframes streakBurn {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.25) rotate(-5deg); }
}
@keyframes particle {
  0% { transform: translate(0,0) scale(1); opacity: 1; }
  100% { transform: translate(var(--dx,50px), var(--dy,-80px)) scale(0); opacity: 0; }
}
@keyframes questCleared {
  0% { opacity: 0; transform: translateY(20px) scale(0.8); }
  20% { opacity: 1; transform: translateY(0) scale(1.05); }
  80% { opacity: 1; transform: translateY(0) scale(1); }
  100% { opacity: 0; transform: translateY(-10px) scale(0.95); }
}
@keyframes slideIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes pulseRing {
  0% { transform: scale(0.8); opacity: 0.8; }
  100% { transform: scale(2); opacity: 0; }
}
@keyframes breathe {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}
@keyframes xpBarGrow {
  from { width: var(--xp-from, 0%); }
  to { width: var(--xp-to, 100%); }
}
@keyframes floatUp {
  0% { transform: translateY(0); opacity: 0.8; }
  100% { transform: translateY(-120px); opacity: 0; }
}
@keyframes flashOut {
  0% { opacity: 0.9; }
  100% { opacity: 0; }
}

.anim-arise { animation: arise-intro 3s ease-in-out forwards; }
.anim-levelup { animation: levelUpFlash 0.8s ease-out forwards; }
.anim-mana-glow { animation: manaGlow 2s ease-in-out infinite; }
.anim-rank-pulse { animation: rankPulse 2.5s ease-in-out infinite; }
.anim-streak { animation: streakBurn 1s ease-in-out infinite; }
.anim-slide-in { animation: slideIn 0.3s ease-out forwards; }
.anim-breathe { animation: breathe 3s ease-in-out infinite; }

.xp-float {
  position: fixed; pointer-events: none; z-index: 9999;
  font-family: 'Cinzel', serif; font-weight: 700; font-size: 18px;
  color: var(--gold); animation: floatUp 1.5s ease-out forwards;
  text-shadow: 0 0 10px var(--gold);
}

.quest-cleared-overlay {
  position: fixed; top: 40%; left: 50%; transform: translateX(-50%);
  z-index: 9998; pointer-events: none;
  font-family: 'Cinzel', serif; font-size: 28px; font-weight: 900;
  color: var(--mana); letter-spacing: 6px;
  text-shadow: 0 0 20px var(--mana), 0 0 40px var(--mana);
  animation: questCleared 2s ease-in-out forwards;
}

.rank-badge {
  display: inline-flex; align-items: center; justify-content: center;
  font-family: 'Cinzel', serif; font-weight: 900;
  border-radius: 4px; padding: 2px 8px;
}

.xp-bar-track {
  background: rgba(79,195,247,0.08);
  border: 1px solid rgba(79,195,247,0.2);
  border-radius: 4px; height: 10px; overflow: hidden;
}
.xp-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #1565C0, var(--mana), #80DEEA);
  border-radius: 4px;
  box-shadow: 0 0 8px rgba(79,195,247,0.6);
  transition: width 1s ease-out;
}

.nav-tab {
  flex: 1; display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 2px; padding: 8px 4px;
  cursor: pointer; transition: all 0.2s;
  border-top: 2px solid transparent;
  font-size: 9px; color: var(--text-dim);
}
.nav-tab.active {
  color: var(--mana);
  border-top-color: var(--mana);
  background: rgba(79,195,247,0.08);
}
.nav-tab:hover:not(.active) { color: var(--text); }

.stat-bar-track {
  flex: 1; height: 6px; background: rgba(255,255,255,0.05);
  border-radius: 3px; overflow: hidden;
}
.muscle-tooltip {
  position: absolute; background: rgba(5,5,15,0.95);
  border: 1px solid var(--mana); border-radius: 6px;
  padding: 8px 12px; font-size: 12px; pointer-events: none;
  z-index: 100; white-space: nowrap;
  box-shadow: 0 0 20px rgba(79,195,247,0.3);
}

.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.8);
  display: flex; align-items: center; justify-content: center;
  z-index: 500; backdrop-filter: blur(4px);
}
.modal-box {
  background: #080810; border: 1px solid var(--mana);
  border-radius: 12px; padding: 24px; max-width: 440px; width: 90%;
  max-height: 80vh; overflow-y: auto;
  box-shadow: 0 0 40px rgba(79,195,247,0.2);
  animation: slideIn 0.25s ease-out;
}

select.input-dark option { background: #0a0a15; }
textarea.input-dark { resize: vertical; min-height: 120px; }

/* ── LIGHT THEME ── */
body.light-theme {
  --bg: #f0f4ff;
  --bg2: #e4eaff;
  --bg3: #d8e0ff;
  --card: rgba(255,255,255,0.92);
  --border: rgba(79,195,247,0.35);
  --border-bright: rgba(79,195,247,0.6);
  --text: #0a0a1a;
  --text-dim: #4a5a7a;
}
body.light-theme .panel { box-shadow: 0 2px 16px rgba(79,195,247,0.08), 0 1px 4px rgba(0,0,0,0.08); }
body.light-theme .input-dark { background: rgba(240,244,255,0.9); color: #0a0a1a; }
body.light-theme .modal-box { background: #f0f4ff; }

/* ── BOSS FIGHT ── */
@keyframes bossShake {
  0%,100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-5px); }
  80% { transform: translateX(5px); }
}
@keyframes bossHit {
  0% { filter: brightness(1); }
  50% { filter: brightness(3) saturate(0); }
  100% { filter: brightness(1); }
}
@keyframes bossFloat {
  0%,100% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
}
.boss-anim { animation: bossFloat 3s ease-in-out infinite; }
.boss-hit { animation: bossHit 0.3s ease-out, bossShake 0.4s ease-out; }

/* ── RANK CARD ── */
@keyframes cardReveal {
  from { opacity:0; transform: scale(0.85) translateY(20px); }
  to { opacity:1; transform: scale(1) translateY(0); }
}
.rank-card-reveal { animation: cardReveal 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }
`;


// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const RANKS = ['E','D','C','B','A','S','MONARCH'];
const RANK_COLORS = { E:'#6a7a9a', D:'#4CAF50', C:'#4FC3F7', B:'#9B59B6', A:'#F39C12', S:'#E74C3C', MONARCH:'#FFD700' };
const RANK_LEVELS = { E:1, D:10, C:25, B:45, A:70, S:100, MONARCH:200 };
const RANK_TEXTS = {
  E:"You have just awakened. The journey begins.",
  D:"Weak but aware. Potential detected.",
  C:"Average Hunter. Complacency is your enemy.",
  B:"Above average. You have trained before.",
  A:"Elite. You are ahead of 95% of humanity.",
  S:"Legendary. The pinnacle of human potential.",
  MONARCH:"You stand above all. The System kneels."
};
const TITLES = [
  [1,"The Weakest"],[6,"Awakened Hunter"],[16,"Gate Raider"],
  [31,"Dungeon Clearer"],[51,"National Level"],[76,"Special Authority"],
  [100,"Shadow Sovereign"],[150,"Ruler of the Void"],[200,"Shadow Monarch"]
];
const STAT_COLORS = {
  strength:'#E74C3C', intelligence:'#4FC3F7', discipline:'#9B59B6',
  vitality:'#2ECC71', focus:'#F39C12', charisma:'#FF69B4'
};
const STAT_LABELS = { strength:'STR', intelligence:'INT', discipline:'DIS', vitality:'VIT', focus:'FOC', charisma:'CHA' };
const CLASS_INFO = {
  warrior:{ icon:'⚔️', label:'Warrior', desc:'Physical focus — gym, sports', bonus:'strength' },
  mage:{ icon:'📚', label:'Mage', desc:'Intellectual focus — studies, reading', bonus:'intelligence' },
  assassin:{ icon:'🎯', label:'Assassin', desc:'Discipline focus — habits, routines', bonus:'discipline' },
  shadowMonarch:{ icon:'🌀', label:'Shadow Monarch', desc:'Balanced — all domains', bonus:null }
};
const QUOTES = {
  E:["The weak die. The strong arise.","Every legend starts at rock bottom.","Your journey of ten thousand miles begins now."],
  D:["Potential means nothing without action.","The gate is open. Enter or be left behind.","Pain is the entrance fee to power."],
  C:["Average is the enemy of great.","Comfort is a slow death.","Push beyond the limit you think you have."],
  B:["You've tasted strength. Now consume it.","Those ahead of you were once where you stand.","Complacency ends careers."],
  A:["Elite is a mindset, not a destination.","The 1% grind while others sleep.","You carry the weight of those beneath you."],
  S:["Legends are just hunters who refused to stop.","The System bows to no one. Become the exception.","Shadow Monarchs are born from unbreakable will."],
  MONARCH:["You have transcended the System itself.","The dungeon has no ceiling for the Monarch.","All ranks below you were just the prologue."]
};

const MUSCLE_XP_PER_LEVEL = (level) => level === 0 ? 100 : level * 200;

function getTitle(level) {
  let t = TITLES[0][1];
  for (const [minLv, title] of TITLES) { if (level >= minLv) t = title; }
  return t;
}
function xpForLevel(n) { return Math.round(1000 * Math.pow(n, 1.5)); }
function getRankForLevel(level) {
  if (level >= 200) return 'MONARCH';
  if (level >= 100) return 'S';
  if (level >= 70)  return 'A';
  if (level >= 45)  return 'B';
  if (level >= 25)  return 'C';
  if (level >= 10)  return 'D';
  return 'E';
}

function getRankRange(rank) {
  const ranges = { E:'1–9', D:'10–24', C:'25–44', B:'45–69', A:'70–99', S:'100–199', MONARCH:'200' };
  return ranges[rank] || '';
}
function getDailyQuote(rank) {
  const q = QUOTES[rank] || QUOTES.E;
  const idx = Math.floor(Date.now() / 86400000) % q.length;
  return q[idx];
}
function todayStr() { return new Date().toISOString().slice(0,10); }

// ─── INITIAL STATE ────────────────────────────────────────────────────────────
const buildInitialState = () => ({
  hunter: { name:"", class:"", rank:"E", level:1, totalXP:0, xpToNextLevel:1000, title:"The Weakest", createdAt:null, coins:0, equippedTitle:null, equippedBadge:null },
  stats: { strength:1, intelligence:1, discipline:1, vitality:1, focus:1, charisma:1 },
  muscles: {
    chest:{level:0,xp:0,trained:0}, frontDelts:{level:0,xp:0,trained:0}, sideDelts:{level:0,xp:0,trained:0},
    rearDelts:{level:0,xp:0,trained:0}, biceps:{level:0,xp:0,trained:0}, triceps:{level:0,xp:0,trained:0},
    forearms:{level:0,xp:0,trained:0}, traps:{level:0,xp:0,trained:0}, lats:{level:0,xp:0,trained:0},
    rhomboids:{level:0,xp:0,trained:0}, abs:{level:0,xp:0,trained:0}, obliques:{level:0,xp:0,trained:0},
    lowerBack:{level:0,xp:0,trained:0}, quads:{level:0,xp:0,trained:0}, hamstrings:{level:0,xp:0,trained:0},
    glutes:{level:0,xp:0,trained:0}, calves:{level:0,xp:0,trained:0}, hipFlexors:{level:0,xp:0,trained:0}
  },
  subjects:{}, skills:{},
  habits:[],
  quests:{
    daily:[
      {id:'d1',name:'Complete morning routine',xp:50,completed:false,date:'',category:'routine'},
      {id:'d2',name:'Study for 1 hour',xp:75,completed:false,date:'',category:'mind'},
      {id:'d3',name:'Complete workout',xp:100,completed:false,date:'',category:'body'},
      {id:'d4',name:'No social media before noon',xp:40,completed:false,date:'',category:'digital'},
      {id:'d5',name:'Write in journal',xp:30,completed:false,date:'',category:'mind'},
      {id:'d6',name:'Sleep before midnight',xp:60,completed:false,date:'',category:'lifestyle'},
    ],
    weekly:[
      {id:'w1',name:'Complete 5 workouts this week',xp:500,progress:0,target:5,completed:false},
      {id:'w2',name:'Study 10 hours this week',xp:400,progress:0,target:10,completed:false},
      {id:'w3',name:'Maintain all habits for 7 days',xp:300,progress:0,target:7,completed:false},
    ],
    main:[], side:[]
  },
  workouts:[], studySessions:[], journal:[],
  routines:{ morning:[], evening:[] },
  screenTime:{ dailyLimit:120, todayUsage:0, sessions:[], lastDate:'' },
  achievements:[], settings:{ theme:'dark' },
  ownedRewards: [],
  customRewards: [],
  collection: [],
  antiTodo: [],
  theme: 'dark',
  notifications: { enabled: false, time: '08:00', permission: 'default' },
  bosses: [],
  onboarded: false,
  assessmentAnswers: {}
});

// ─── REDUCER ─────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch(action.type) {
    case 'LOAD_STATE': return { ...buildInitialState(), ...action.payload };
    case 'COMPLETE_ONBOARDING': {
      const { hunterData, stats, startRank, answers } = action.payload;
      return { ...state, hunter:{...state.hunter,...hunterData,rank:startRank,createdAt:Date.now()}, stats:{...state.stats,...stats}, onboarded:true, assessmentAnswers:answers };
    }
    case 'GAIN_XP': {
      const amount = action.payload;
      let { totalXP, level, xpToNextLevel, rank, title } = state.hunter;
      const coinsEarned = Math.floor(amount / 50); // 1 coin per 50 XP
      const newCoins = (state.hunter.coins || 0) + coinsEarned;
      totalXP += amount;
      let leveled = false;
      let newRank = rank;
      while (totalXP >= xpToNextLevel) {
        totalXP -= xpToNextLevel;
        level++;
        xpToNextLevel = xpForLevel(level);
        leveled = true;
        newRank = getRankForLevel(level);
        title = getTitle(level);
      }
      return { ...state, hunter:{...state.hunter, totalXP, level, xpToNextLevel, rank:newRank, title, coins:newCoins},
        _leveled: leveled ? { level, rank:newRank, title } : null };
    }
    case 'PURCHASE_REWARD': {
      const { id, cost, item } = action.payload;
      if ((state.hunter.coins||0) < cost) return state;
      const collectionEntry = item ? { ...item, acquiredAt: Date.now(), source: 'purchase' } : null;
      return { ...state,
        hunter: { ...state.hunter, coins: (state.hunter.coins||0) - cost },
        ownedRewards: [...(state.ownedRewards||[]), id],
        collection: collectionEntry ? [...(state.collection||[]), collectionEntry] : (state.collection||[])
      };
    }
    case 'ADD_CUSTOM_REWARD': {
      const r = { id: 'cr_'+Date.now(), ...action.payload, createdAt: Date.now() };
      return { ...state, customRewards: [...(state.customRewards||[]), r] };
    }
    case 'DELETE_CUSTOM_REWARD': {
      return { ...state, customRewards: (state.customRewards||[]).filter(r=>r.id!==action.payload) };
    }
    case 'CLAIM_CUSTOM_REWARD': {
      const { rewardId } = action.payload;
      const reward = (state.customRewards||[]).find(r=>r.id===rewardId);
      if (!reward) return state;
      const entry = { ...reward, acquiredAt: Date.now(), source: 'quest_reward' };
      return { ...state, collection: [...(state.collection||[]), entry] };
    }
    case 'ADD_ANTI_TODO': {
      const item = { id: 'at_'+Date.now(), ...action.payload, createdAt: Date.now(), breakCount: 0 };
      return { ...state, antiTodo: [...(state.antiTodo||[]), item] };
    }
    case 'DELETE_ANTI_TODO': {
      return { ...state, antiTodo: (state.antiTodo||[]).filter(a=>a.id!==action.payload) };
    }
    case 'BREAK_ANTI_TODO': {
      const antiTodo = (state.antiTodo||[]).map(a => a.id===action.payload ? {...a, breakCount:(a.breakCount||0)+1, lastBroken:Date.now()} : a);
      return { ...state, antiTodo };
    }
    case 'KEEP_ANTI_TODO': {
      const antiTodo = (state.antiTodo||[]).map(a => a.id===action.payload ? {...a, lastKept:Date.now(), streak:(a.streak||0)+1} : a);
      return { ...state, antiTodo };
    }
    case 'EQUIP_REWARD': {
      const { type, value } = action.payload;
      return { ...state, hunter: { ...state.hunter, [`equipped${type}`]: value } };
    }
    case 'RESET_ALL': {
      return { ...buildInitialState() };
    }
    case 'SET_THEME': {
      return { ...state, theme: action.payload };
    }
    case 'SET_NOTIFICATIONS': {
      return { ...state, notifications: { ...state.notifications, ...action.payload } };
    }
    case 'ADD_BOSS': {
      const boss = { id: Date.now()+'', ...action.payload, currentHp: action.payload.maxHp, defeated: false, dateCreated: Date.now() };
      return { ...state, bosses: [...(state.bosses||[]), boss] };
    }
    case 'ATTACK_BOSS': {
      const { id, damage } = action.payload;
      const bosses = (state.bosses||[]).map(b => {
        if (b.id !== id) return b;
        const newHp = Math.max(0, b.currentHp - damage);
        return { ...b, currentHp: newHp, defeated: newHp === 0 };
      });
      return { ...state, bosses };
    }
    case 'DELETE_BOSS': {
      return { ...state, bosses: (state.bosses||[]).filter(b => b.id !== action.payload) };
    }
    case 'GAIN_STAT': {
      const { stat, amount } = action.payload;
      return { ...state, stats:{...state.stats, [stat]: (state.stats[stat]||1) + amount } };
    }
    case 'COMPLETE_DAILY_QUEST': {
      const today = todayStr();
      const quest = state.quests.daily.find(q => q.id === action.payload);
      const quests = state.quests.daily.map(q =>
        q.id === action.payload ? {...q, completed:true, date:today} : q
      );
      let newState = { ...state, quests:{...state.quests, daily:quests} };
      // Award stat if quest has one
      if (quest?.statReward && quest.statAmount) {
        newState = { ...newState, stats:{ ...newState.stats, [quest.statReward]: (newState.stats[quest.statReward]||1) + quest.statAmount } };
      }
      // Claim associated reward
      if (quest?.rewardId) {
        const reward = state.customRewards?.find(r=>r.id===quest.rewardId);
        if (reward) newState = { ...newState, collection: [...(newState.collection||[]), { ...reward, acquiredAt:Date.now(), source:'quest_reward', questName:quest.name }] };
      }
      return newState;
    }
    case 'COMPLETE_WEEKLY_QUEST': {
      const quest = state.quests.weekly.find(q => q.id === action.payload);
      const quests = state.quests.weekly.map(q =>
        q.id === action.payload ? {...q, completed:true} : q
      );
      let newState = { ...state, quests:{...state.quests, weekly:quests} };
      if (quest?.statReward && quest.statAmount) {
        newState = { ...newState, stats:{ ...newState.stats, [quest.statReward]: (newState.stats[quest.statReward]||1) + quest.statAmount } };
      }
      if (quest?.rewardId) {
        const reward = state.customRewards?.find(r=>r.id===quest.rewardId);
        if (reward) newState = { ...newState, collection: [...(newState.collection||[]), { ...reward, acquiredAt:Date.now(), source:'quest_reward', questName:quest.name }] };
      }
      return newState;
    }
    case 'ADD_MAIN_QUEST': {
      const q = { id: Date.now()+'', ...action.payload, completed:false, progress:0 };
      return { ...state, quests:{...state.quests, main:[...state.quests.main, q]} };
    }
    case 'COMPLETE_MAIN_QUEST': {
      const quest = state.quests.main.find(q => q.id===action.payload);
      const main = state.quests.main.map(q => q.id===action.payload ? {...q,completed:true} : q);
      let newState = { ...state, quests:{...state.quests, main} };
      if (quest?.statReward && quest.statAmount) {
        newState = { ...newState, stats:{ ...newState.stats, [quest.statReward]: (newState.stats[quest.statReward]||1) + quest.statAmount } };
      }
      if (quest?.rewardId) {
        const reward = state.customRewards?.find(r=>r.id===quest.rewardId);
        if (reward) newState = { ...newState, collection: [...(newState.collection||[]), { ...reward, acquiredAt:Date.now(), source:'quest_reward', questName:quest.name }] };
      }
      return newState;
    }
    case 'ADD_DAILY_QUEST': {
      const q = { id: 'custom_'+Date.now(), ...action.payload, completed:false, date:'' };
      return { ...state, quests:{...state.quests, daily:[...state.quests.daily, q]} };
    }
    case 'LOG_WORKOUT': {
      const { muscleName, xpGain, entry } = action.payload;
      const muscle = state.muscles[muscleName];
      let newXp = muscle.xp + xpGain;
      let newLevel = muscle.level;
      const needed = MUSCLE_XP_PER_LEVEL(newLevel);
      if (newXp >= needed) { newXp -= needed; newLevel++; }
      return {
        ...state,
        muscles:{ ...state.muscles, [muscleName]:{ level:newLevel, xp:newXp, trained:muscle.trained+1 } },
        workouts:[ { id:Date.now()+'', muscleName, ...entry, date:Date.now() }, ...state.workouts.slice(0,99) ]
      };
    }
    case 'ADD_SUBJECT': {
      const { name } = action.payload;
      return { ...state, subjects:{ ...state.subjects, [name]:{ name, level:0, xp:0, hoursStudied:0, lastStudied:null } } };
    }
    case 'LOG_STUDY': {
      const { subjectName, minutes, notes } = action.payload;
      const sub = state.subjects[subjectName] || { name:subjectName, level:0, xp:0, hoursStudied:0 };
      let newXp = sub.xp + minutes * 2;
      let newLevel = sub.level;
      while (newXp >= (newLevel+1)*500) { newXp -= (newLevel+1)*500; newLevel++; }
      const updated = { ...sub, xp:newXp, level:newLevel, hoursStudied:sub.hoursStudied + minutes/60, lastStudied:Date.now() };
      return {
        ...state, subjects:{ ...state.subjects, [subjectName]: updated },
        studySessions:[ { id:Date.now()+'', subjectName, minutes, notes, date:Date.now() }, ...state.studySessions.slice(0,99) ]
      };
    }
    case 'ADD_SKILL': {
      const { name, category } = action.payload;
      return { ...state, skills:{ ...state.skills, [name]:{ name, category, level:0, xp:0, practiced:0 } } };
    }
    case 'LOG_SKILL': {
      const { skillName, minutes, rating } = action.payload;
      const sk = state.skills[skillName];
      let newXp = sk.xp + Math.round((minutes/30)*75);
      let newLevel = sk.level;
      while (newXp >= (newLevel+1)*300) { newXp -= (newLevel+1)*300; newLevel++; }
      return { ...state, skills:{ ...state.skills, [skillName]:{ ...sk, xp:newXp, level:newLevel, practiced:sk.practiced+1 } } };
    }
    case 'ADD_HABIT': {
      const h = { id:Date.now()+'', ...action.payload, streak:0, longestStreak:0, completedDates:[] };
      return { ...state, habits:[...state.habits, h] };
    }
    case 'COMPLETE_HABIT': {
      const today = todayStr();
      const habits = state.habits.map(h => {
        if (h.id !== action.payload) return h;
        if (h.completedDates.includes(today)) return h;
        const dates = [...h.completedDates, today];
        const yesterday = new Date(Date.now()-86400000).toISOString().slice(0,10);
        const streak = h.completedDates.includes(yesterday) ? h.streak+1 : 1;
        return { ...h, completedDates:dates, streak, longestStreak:Math.max(h.longestStreak, streak) };
      });
      return { ...state, habits };
    }
    case 'DELETE_HABIT': {
      return { ...state, habits: state.habits.filter(h => h.id !== action.payload) };
    }
    case 'ADD_ROUTINE_TASK': {
      const { routine, task } = action.payload;
      const r = state.routines[routine];
      return { ...state, routines:{ ...state.routines, [routine]:[...r, { id:Date.now()+'', ...task, completed:false }] } };
    }
    case 'REMOVE_ROUTINE_TASK': {
      const { routine, id } = action.payload;
      return { ...state, routines:{ ...state.routines, [routine]: state.routines[routine].filter(t=>t.id!==id) } };
    }
    case 'MOVE_ROUTINE_TASK': {
      const { routine, id, dir } = action.payload;
      const tasks = [...state.routines[routine]];
      const idx = tasks.findIndex(t=>t.id===id);
      const to = idx+dir;
      if (to<0||to>=tasks.length) return state;
      [tasks[idx],tasks[to]] = [tasks[to],tasks[idx]];
      return { ...state, routines:{ ...state.routines, [routine]:tasks } };
    }
    case 'LOG_SCREEN_SESSION': {
      const today = todayStr();
      const st = state.screenTime;
      const todayUsage = st.lastDate===today ? st.todayUsage + action.payload.minutes : action.payload.minutes;
      return { ...state, screenTime:{ ...st, todayUsage, lastDate:today, sessions:[{ id:Date.now()+'', ...action.payload, date:Date.now() }, ...st.sessions.slice(0,49)] } };
    }
    case 'SET_SCREEN_LIMIT': {
      return { ...state, screenTime:{ ...state.screenTime, dailyLimit:action.payload } };
    }
    case 'ADD_JOURNAL': {
      const entry = { id:Date.now()+'', ...action.payload, date:Date.now() };
      return { ...state, journal:[ entry, ...state.journal.slice(0,199) ] };
    }
    case 'RESET_DAILY': {
      const today = todayStr();
      const daily = state.quests.daily.map(q => ({...q, completed: q.date===today ? q.completed : false, date: q.date===today ? q.date : ''}));
      return { ...state, quests:{ ...state.quests, daily } };
    }
    default: return state;
  }
}

// ─── STORAGE LAYER ───────────────────────────────────────────────────────────
const STORAGE_KEY = 'arise:state';

// Dual-layer persistence: localStorage (survives app close) + window.storage (artifact backup)
async function loadState() {
  // 1. Try localStorage first — most reliable across sessions
  try {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) return JSON.parse(local);
  } catch(e) {}
  // 2. Fallback to window.storage
  try {
    const res = await window.storage.get(STORAGE_KEY);
    if (res && res.value) {
      const parsed = JSON.parse(res.value);
      // Migrate to localStorage immediately
      try { localStorage.setItem(STORAGE_KEY, res.value); } catch(e) {}
      return parsed;
    }
  } catch(e) {}
  return null;
}

async function saveState(state) {
  const json = JSON.stringify(state);
  // Always write to localStorage (synchronous, survives tab/app close)
  try { localStorage.setItem(STORAGE_KEY, json); } catch(e) {}
  // Also write to window.storage asynchronously (non-blocking)
  try { window.storage.set(STORAGE_KEY, json); } catch(e) {}
}

async function clearState() {
  try { localStorage.removeItem(STORAGE_KEY); } catch(e) {}
  try { await window.storage.delete(STORAGE_KEY); } catch(e) {}
}

// ─── XP FLOAT COMPONENT ──────────────────────────────────────────────────────
function XPFloat({ floats, removeFloat }) {
  return (
    <>
      {floats.map(f => (
        <div key={f.id} className="xp-float" style={{ left: f.x, top: f.y }}>
          +{f.amount} XP
        </div>
      ))}
    </>
  );
}

// ─── LEVEL UP OVERLAY ────────────────────────────────────────────────────────
function LevelUpOverlay({ data, onClose }) {
  const isMonarch = data?.rank === 'MONARCH';
  const isRankUp = data?.rankChanged;
  useEffect(() => { const t = setTimeout(onClose, isMonarch ? 7000 : 4000); return () => clearTimeout(t); }, []);
  if (!data) return null;
  const color = RANK_COLORS[data.rank] || '#4FC3F7';
  const particleCount = isMonarch ? 32 : 16;

  return (
    <div onClick={onClose} style={{
      position:'fixed', inset:0,
      background: isMonarch ? 'rgba(0,0,0,0.97)' : 'rgba(0,0,0,0.92)',
      zIndex:1000, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      cursor:'pointer', backdropFilter:'blur(6px)'
    }}>
      {/* Particles */}
      {[...Array(particleCount)].map((_,i) => (
        <div key={i} style={{
          position:'absolute', left:'50%', top:'50%',
          width: 4+Math.random()*8, height: 4+Math.random()*8,
          background: isMonarch
            ? (i%3===0 ? '#FFD700' : i%3===1 ? '#FFA500' : '#fff')
            : (i%2===0 ? color : '#F39C12'),
          borderRadius:'50%',
          '--dx': `${(Math.random()-0.5)*400}px`,
          '--dy': `${(Math.random()-0.5)*400}px`,
          animation: `particle ${0.6+Math.random()*1.2}s ease-out ${Math.random()*0.4}s forwards`
        }}/>
      ))}

      <div className="anim-levelup cinzel" style={{ textAlign:'center', padding:'0 24px' }}>
        {isMonarch ? (
          <>
            <div style={{ fontSize:13, color:'#FFD70088', letterSpacing:10, marginBottom:20 }}>THE SYSTEM SPEAKS</div>
            <div style={{ fontSize:56, fontWeight:900, lineHeight:1, marginBottom:8,
              background:'linear-gradient(135deg, #FFD700, #FFA500, #FFD700)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
              textShadow:'none', filter:'drop-shadow(0 0 30px #FFD700)'
            }}>
              ♛ ARISE ♛
            </div>
            <div style={{ fontSize:32, fontWeight:900, color:'#FFD700',
              textShadow:'0 0 30px #FFD700, 0 0 60px #FFD700', marginBottom:12 }}>
              SHADOW MONARCH
            </div>
            <div style={{ fontSize:20, color:'#fff', marginBottom:12 }}>Lv. {data.level}</div>
            <div style={{ fontSize:14, color:'#FFD70099', letterSpacing:3, lineHeight:1.8, maxWidth:320, margin:'0 auto' }}>
              "You have transcended the System itself."
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize:14, color:'#6a7a9a', letterSpacing:8, marginBottom:16 }}>SYSTEM ALERT</div>
            <div style={{ fontSize:72, fontWeight:900, color, textShadow:`0 0 30px ${color}, 0 0 60px ${color}`, lineHeight:1 }}>
              LEVEL UP
            </div>
            <div style={{ fontSize:48, color:'#fff', marginTop:8 }}>Lv. {data.level}</div>
            <div style={{ fontSize:18, color, marginTop:12, letterSpacing:4 }}>{data.title}</div>
            <div style={{ marginTop:6, fontSize:12, color:'#6a7a9a' }}>
              {data.rank}-RANK &nbsp;·&nbsp; Levels {getRankRange(data.rank)}
            </div>
          </>
        )}
        <div style={{ marginTop:32, fontSize:11, color:'#6a7a9a', letterSpacing:2 }}>TAP TO CONTINUE</div>
      </div>
    </div>
  );
}

// ─── RANK BADGE ──────────────────────────────────────────────────────────────
function RankBadge({ rank, size=14, pulse=false }) {
  const color = RANK_COLORS[rank] || '#6a7a9a';
  const isMonarch = rank === 'MONARCH';
  return (
    <span className={`rank-badge cinzel ${pulse?'anim-rank-pulse':''}`} style={{
      color: isMonarch ? '#000' : color,
      border: `1px solid ${color}`,
      fontSize: isMonarch ? size - 1 : size,
      background: isMonarch
        ? `linear-gradient(90deg, #FFD700, #FFA500, #FFD700)`
        : `${color}18`,
      letterSpacing: isMonarch ? 1 : 2,
      textShadow: isMonarch ? 'none' : undefined,
      boxShadow: isMonarch ? `0 0 20px #FFD70088` : undefined,
      padding: isMonarch ? '2px 10px' : '2px 8px',
    }}>
      {isMonarch ? '♛ MONARCH' : `${rank}-RANK`}
    </span>
  );
}

// ─── STAT BAR ────────────────────────────────────────────────────────────────
function StatBar({ label, abbr, value, color }) {
  const pct = Math.min(100, (value/100)*100);
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
      <span style={{ width:30, fontSize:11, color, fontWeight:700, fontFamily:'Cinzel,serif' }}>{abbr}</span>
      <div className="xp-bar-track" style={{ flex:1 }}>
        <div className="xp-bar-fill" style={{ width:`${pct}%`, background:`linear-gradient(90deg, ${color}88, ${color})` }}/>
      </div>
      <span style={{ width:24, fontSize:11, color, textAlign:'right' }}>{value}</span>
    </div>
  );
}

// ─── XP BAR ──────────────────────────────────────────────────────────────────
function XPBar({ current, needed }) {
  const pct = needed > 0 ? Math.min(100, (current/needed)*100) : 0;
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'#6a7a9a', marginBottom:4 }}>
        <span>{current.toLocaleString()} XP</span>
        <span>{needed.toLocaleString()} XP</span>
      </div>
      <div className="xp-bar-track" style={{ height:14 }}>
        <div className="xp-bar-fill" style={{ width:`${pct}%` }}/>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ONBOARDING
// ─────────────────────────────────────────────────────────────────────────────
// ─── CINEMATIC INTRO ─────────────────────────────────────────────────────────
const INTRO_LINES = [
  { text: "THE WORLD TRAINED YOU TO OBEY.",        delay: 0,    duration: 2200, size: 18, color: '#6a7a9a', spacing: 4 },
  { text: "THE SYSTEM?",                            delay: 2400, duration: 1400, size: 14, color: '#4a5a7a', spacing: 6 },
  { text: "TO CONSUME YOU.",                        delay: 3900, duration: 2000, size: 22, color: '#E74C3C', spacing: 3, glow: '#E74C3C' },
  { text: "YOU'VE BEEN ASLEEP...",                  delay: 6100, duration: 2400, size: 16, color: '#6a7a9a', spacing: 5 },
  { text: "BUT I NEVER SLEEP.",                     delay: 8700, duration: 2200, size: 20, color: '#4FC3F7', spacing: 4, glow: '#4FC3F7' },
  { text: "NOW, THE QUESTION IS YOURS.",            delay: 11100,duration: 2400, size: 15, color: '#a0b4cc', spacing: 3 },
  { text: "WILL YOU USE THE SYSTEM...",             delay: 13700,duration: 2000, size: 18, color: '#F39C12', spacing: 3, glow: '#F39C12' },
  { text: "...OR LET THE SYSTEM USE YOU?",          delay: 15900,duration: 2800, size: 18, color: '#E74C3C', spacing: 2, glow: '#E74C3C' },
  { text: "[ WELCOME, PLAYER ]",                    delay: 19000,duration: 2600, size: 13, color: '#4FC3F7', spacing: 8 },
  { text: "UNLOCK YOUR POTENTIAL.",                 delay: 21800,duration: 3000, size: 28, color: '#fff',    spacing: 6, glow: '#4FC3F7', bold: true },
  { text: "ARISE.",                                 delay: 25200,duration: 3500, size: 72, color: '#fff',    spacing: 8, glow: '#4FC3F7', bold: true, final: true },
];

function CinematicIntro({ onDone }) {
  const [visibleLines, setVisibleLines] = useState([]);
  const [phase, setPhase] = useState('lines'); // 'lines' | 'arise' | 'flash'

  useEffect(() => {
    const timers = [];
    INTRO_LINES.forEach((line, i) => {
      timers.push(setTimeout(() => {
        setVisibleLines(prev => [...prev, i]);
        if (line.final) {
          setTimeout(() => setPhase('flash'), line.duration - 400);
          setTimeout(onDone, line.duration + 800);
        }
      }, line.delay));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div
      onClick={onDone}
      style={{
        position: 'fixed', inset: 0, background: '#000',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        zIndex: 2000, cursor: 'pointer', padding: '40px 24px',
        transition: phase === 'flash' ? 'background 0.6s ease-in' : 'none',
        overflow: 'hidden',
      }}
    >
      {/* Scan line effect */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(79,195,247,0.015) 3px, rgba(79,195,247,0.015) 4px)',
      }}/>

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.8) 100%)',
      }}/>

      {/* Lines container */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, maxWidth: 600, width: '100%', position: 'relative', zIndex: 1 }}>
        {INTRO_LINES.map((line, i) => {
          const visible = visibleLines.includes(i);
          const isFinal = line.final;
          return (
            <div key={i} style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.97)',
              transition: `opacity 0.7s ease-out, transform 0.7s ease-out`,
              fontFamily: 'Cinzel, serif',
              fontSize: line.size,
              fontWeight: line.bold ? 900 : 400,
              color: line.color,
              letterSpacing: line.spacing,
              textAlign: 'center',
              lineHeight: 1.3,
              textShadow: line.glow
                ? `0 0 20px ${line.glow}, 0 0 40px ${line.glow}88, 0 0 80px ${line.glow}44`
                : 'none',
              // Final ARISE. gets extra pulse
              animation: visible && isFinal ? 'manaGlow 1.5s ease-in-out infinite' : 'none',
            }}>
              {line.text}
            </div>
          );
        })}
      </div>

      {/* Skip hint */}
      <div style={{
        position: 'absolute', bottom: 24, fontSize: 10, color: '#2a3a4a',
        letterSpacing: 3, fontFamily: 'Cinzel, serif',
        animation: 'breathe 2s ease-in-out infinite'
      }}>
        TAP TO SKIP
      </div>

      {/* Flash overlay on finale */}
      {phase === 'flash' && (
        <div style={{
          position: 'absolute', inset: 0, background: '#4FC3F7',
          animation: 'flashOut 0.8s ease-out forwards',
          pointerEvents: 'none'
        }}/>
      )}
    </div>
  );
}

function Onboarding({ onComplete }) {
  const [introPlayed, setIntroPlayed] = useState(false);
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [hunterClass, setHunterClass] = useState('');
  const [answers, setAnswers] = useState({
    exercise:0, physique:5, diet:0, studyHours:0, readsBooks:0, focusRating:5,
    sleep:0, screenTime:0, journals:0, stress:5,
    dreamPhysique:'', goal:'', weakness:''
  });
  const [rankReveal, setRankReveal] = useState(null);

  const setA = (k,v) => setAnswers(prev => ({...prev,[k]:v}));

  if (!introPlayed) {
    return <CinematicIntro onDone={() => setIntroPlayed(true)} />;
  }

  const calcScore = () => {
    let s = 0;
    s += [0,3,6,10][answers.exercise] || 0;
    s += answers.physique;
    s += [0,2,5,8][answers.diet] || 0;
    s += [0,3,6,10][answers.studyHours] || 0;
    s += [0,2,5,8][answers.readsBooks] || 0;
    s += answers.focusRating;
    s += [0,5,8,10,10,10][answers.sleep] || 0;
    s += [0,3,6,10][answers.screenTime] || 0;
    s += [0,4,8][answers.journals] || 0;
    s += (10 - answers.stress);
    return Math.max(10, Math.min(100, s));
  };

  const calcStartStats = () => {
    const ex = answers.exercise;
    return {
      strength: 1 + ex*2 + Math.floor(answers.physique/3),
      intelligence: 1 + answers.studyHours*2 + answers.readsBooks,
      discipline: 1 + answers.focusRating + answers.journals*2,
      vitality: 1 + answers.sleep*2 + (10-answers.stress),
      focus: 1 + answers.focusRating + (4-answers.screenTime)*2,
      charisma: 1 + answers.journals*2 + Math.floor(answers.physique/4)
    };
  };

  const handleAssessComplete = () => {
    const score = calcScore();
    let rank = 'E';
    if (score>=86) rank='S';
    else if (score>=71) rank='A';
    else if (score>=56) rank='B';
    else if (score>=41) rank='C';
    else if (score>=26) rank='D';
    setRankReveal({ rank, score });
  };

  const handleFinalConfirm = () => {
    if (!rankReveal) return;
    const stats = calcStartStats();
    const hunterData = { name, class:hunterClass, title:'The Weakest', level:1, totalXP:0, xpToNextLevel:1000 };
    onComplete({ hunterData, stats, startRank:rankReveal.rank, answers });
  };

  // RANK REVEAL
  if (rankReveal && step===2) {
    const color = RANK_COLORS[rankReveal.rank];
    return (
      <div style={{ position:'fixed', inset:0, background:'#000', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', zIndex:2000, gap:24, padding:32 }}>
        <div className="cinzel" style={{ fontSize:13, color:'#6a7a9a', letterSpacing:8 }}>SYSTEM ASSESSMENT COMPLETE</div>
        {[...Array(12)].map((_,i)=>(
          <div key={i} style={{ position:'absolute', left:'50%', top:'50%', width:8, height:8, background:color, borderRadius:'50%', '--dx':`${(Math.random()-0.5)*400}px`, '--dy':`${(Math.random()-0.5)*400}px`, animation:`particle 1.5s ease-out ${Math.random()*0.5}s forwards` }}/>
        ))}
        <div className="anim-rank-pulse cinzel" style={{ fontSize:120, fontWeight:900, color, textShadow:`0 0 40px ${color}, 0 0 80px ${color}`, lineHeight:1, textAlign:'center' }}>
          {rankReveal.rank}
        </div>
        <div className="cinzel" style={{ fontSize:22, color, letterSpacing:4 }}>{rankReveal.rank}-RANK HUNTER</div>
        <div style={{ fontSize:14, color:'#a0b0c0', textAlign:'center', maxWidth:360, lineHeight:1.6, fontStyle:'italic' }}>
          "{RANK_TEXTS[rankReveal.rank]}"
        </div>
        <div style={{ fontSize:13, color:'#6a7a9a' }}>Assessment Score: {rankReveal.score}/100</div>
        <button className="btn-mana" onClick={handleFinalConfirm} style={{ marginTop:16, fontSize:15, padding:'12px 32px' }}>
          BEGIN YOUR JOURNEY →
        </button>
      </div>
    );
  }

  return (
    <div style={{ position:'fixed', inset:0, background:'var(--bg)', zIndex:2000, overflowY:'auto', padding:'24px 16px' }}>
      <div style={{ maxWidth:480, margin:'0 auto' }}>
        <div className="cinzel" style={{ textAlign:'center', fontSize:24, fontWeight:900, color:'var(--mana)', letterSpacing:4, marginBottom:8 }}>
          THE AWAKENING
        </div>
        <div style={{ textAlign:'center', fontSize:12, color:'var(--text-dim)', letterSpacing:2, marginBottom:32 }}>
          STEP {step+1} OF 3
        </div>
        <div style={{ display:'flex', gap:8, marginBottom:32 }}>
          {[0,1,2].map(i=>(
            <div key={i} style={{ flex:1, height:3, background: i<=step ? 'var(--mana)' : 'rgba(79,195,247,0.15)', borderRadius:2, transition:'background 0.4s', boxShadow: i<=step ? '0 0 8px var(--mana)' : 'none' }}/>
          ))}
        </div>

        {step === 0 && (
          <div className="anim-slide-in">
            <div className="cinzel" style={{ fontSize:18, color:'var(--gold)', marginBottom:24 }}>IDENTITY</div>
            <div style={{ marginBottom:20 }}>
              <label style={{ display:'block', fontSize:12, color:'var(--text-dim)', marginBottom:8, letterSpacing:2 }}>WHAT IS YOUR NAME, HUNTER?</label>
              <input className="input-dark" value={name} onChange={e=>setName(e.target.value)} placeholder="Enter your name..." autoFocus/>
            </div>
            <div style={{ marginBottom:24 }}>
              <label style={{ display:'block', fontSize:12, color:'var(--text-dim)', marginBottom:12, letterSpacing:2 }}>CHOOSE YOUR HUNTER CLASS</label>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                {Object.entries(CLASS_INFO).map(([key,cls])=>(
                  <div key={key} onClick={()=>setHunterClass(key)} style={{
                    padding:16, borderRadius:8, cursor:'pointer', textAlign:'center', transition:'all 0.2s',
                    border: hunterClass===key ? '1px solid var(--mana)' : '1px solid var(--border)',
                    background: hunterClass===key ? 'rgba(79,195,247,0.12)' : 'rgba(10,10,20,0.6)',
                    boxShadow: hunterClass===key ? '0 0 20px rgba(79,195,247,0.2)' : 'none'
                  }}>
                    <div style={{ fontSize:28, marginBottom:6 }}>{cls.icon}</div>
                    <div className="cinzel" style={{ fontSize:13, color: hunterClass===key ? 'var(--mana)' : 'var(--text)', marginBottom:4 }}>{cls.label}</div>
                    <div style={{ fontSize:10, color:'var(--text-dim)' }}>{cls.desc}</div>
                  </div>
                ))}
              </div>
            </div>
            <button className="btn-mana" onClick={()=>setStep(1)} disabled={!name.trim()||!hunterClass}
              style={{ width:'100%', padding:'14px', fontSize:14, opacity:(!name.trim()||!hunterClass)?0.4:1 }}>
              PROCEED →
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="anim-slide-in">
            <div className="cinzel" style={{ fontSize:18, color:'var(--gold)', marginBottom:24 }}>CURRENT STRENGTH ASSESSMENT</div>
            
            {/* Physical */}
            <div style={{ marginBottom:20 }}>
              <div className="cinzel" style={{ fontSize:12, color:'#E74C3C', letterSpacing:2, marginBottom:12 }}>▸ PHYSICAL</div>
              {[
                {k:'exercise', label:'Exercise frequency', opts:['Never','1-2x/week','3-4x/week','Daily']},
                {k:'diet', label:'Diet structure', opts:['None','Casual','Structured','Strict']},
              ].map(({k,label,opts})=>(
                <div key={k} style={{ marginBottom:14 }}>
                  <div style={{ fontSize:12, color:'var(--text-dim)', marginBottom:6 }}>{label}</div>
                  <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                    {opts.map((o,i)=>(
                      <button key={i} onClick={()=>setA(k,i)} style={{
                        padding:'5px 10px', fontSize:11, borderRadius:4, cursor:'pointer',
                        border: answers[k]===i ? '1px solid #E74C3C' : '1px solid var(--border)',
                        background: answers[k]===i ? 'rgba(231,76,60,0.15)' : 'rgba(10,10,20,0.6)',
                        color: answers[k]===i ? '#E74C3C' : 'var(--text-dim)',
                        transition:'all 0.15s'
                      }}>{o}</button>
                    ))}
                  </div>
                </div>
              ))}
              {[{k:'physique',label:'Physique rating (1-10)'}].map(({k,label})=>(
                <div key={k} style={{ marginBottom:14 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'var(--text-dim)', marginBottom:6 }}>
                    <span>{label}</span><span style={{ color:'var(--mana)' }}>{answers[k]}/10</span>
                  </div>
                  <input type="range" min={1} max={10} value={answers[k]} onChange={e=>setA(k,+e.target.value)}
                    style={{ width:'100%', accentColor:'var(--mana)' }}/>
                </div>
              ))}
            </div>

            {/* Mental */}
            <div style={{ marginBottom:20 }}>
              <div className="cinzel" style={{ fontSize:12, color:'var(--mana)', letterSpacing:2, marginBottom:12 }}>▸ MENTAL</div>
              {[
                {k:'studyHours', label:'Study/learning per day', opts:['0h','1-2h','3-4h','5+h']},
                {k:'readsBooks', label:'Do you read books?', opts:['Never','Sometimes','Weekly','Daily']},
              ].map(({k,label,opts})=>(
                <div key={k} style={{ marginBottom:14 }}>
                  <div style={{ fontSize:12, color:'var(--text-dim)', marginBottom:6 }}>{label}</div>
                  <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                    {opts.map((o,i)=>(
                      <button key={i} onClick={()=>setA(k,i)} style={{
                        padding:'5px 10px', fontSize:11, borderRadius:4, cursor:'pointer',
                        border: answers[k]===i ? '1px solid var(--mana)' : '1px solid var(--border)',
                        background: answers[k]===i ? 'rgba(79,195,247,0.15)' : 'rgba(10,10,20,0.6)',
                        color: answers[k]===i ? 'var(--mana)' : 'var(--text-dim)', transition:'all 0.15s'
                      }}>{o}</button>
                    ))}
                  </div>
                </div>
              ))}
              {[{k:'focusRating',label:'Focus/discipline rating (1-10)'}].map(({k,label})=>(
                <div key={k} style={{ marginBottom:14 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'var(--text-dim)', marginBottom:6 }}>
                    <span>{label}</span><span style={{ color:'var(--mana)' }}>{answers[k]}/10</span>
                  </div>
                  <input type="range" min={1} max={10} value={answers[k]} onChange={e=>setA(k,+e.target.value)}
                    style={{ width:'100%', accentColor:'var(--mana)' }}/>
                </div>
              ))}
            </div>

            {/* Lifestyle */}
            <div style={{ marginBottom:20 }}>
              <div className="cinzel" style={{ fontSize:12, color:'#2ECC71', letterSpacing:2, marginBottom:12 }}>▸ LIFESTYLE</div>
              {[
                {k:'sleep', label:'Average sleep hours', opts:['<5h','6h','7h','8h','9+h']},
                {k:'screenTime', label:'Daily screen time (recreational)', opts:['8h+','5-7h','3-4h','<3h']},
                {k:'journals', label:'Do you journal?', opts:['Never','Sometimes','Daily']},
              ].map(({k,label,opts})=>(
                <div key={k} style={{ marginBottom:14 }}>
                  <div style={{ fontSize:12, color:'var(--text-dim)', marginBottom:6 }}>{label}</div>
                  <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                    {opts.map((o,i)=>(
                      <button key={i} onClick={()=>setA(k,i)} style={{
                        padding:'5px 10px', fontSize:11, borderRadius:4, cursor:'pointer',
                        border: answers[k]===i ? '1px solid #2ECC71' : '1px solid var(--border)',
                        background: answers[k]===i ? 'rgba(46,204,113,0.15)' : 'rgba(10,10,20,0.6)',
                        color: answers[k]===i ? '#2ECC71' : 'var(--text-dim)', transition:'all 0.15s'
                      }}>{o}</button>
                    ))}
                  </div>
                </div>
              ))}
              {[{k:'stress',label:'Current stress level (1-10)'}].map(({k,label})=>(
                <div key={k} style={{ marginBottom:14 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'var(--text-dim)', marginBottom:6 }}>
                    <span>{label}</span><span style={{ color:'var(--crimson)' }}>{answers[k]}/10</span>
                  </div>
                  <input type="range" min={1} max={10} value={answers[k]} onChange={e=>setA(k,+e.target.value)}
                    style={{ width:'100%', accentColor:'var(--crimson)' }}/>
                </div>
              ))}
            </div>

            <button className="btn-mana" onClick={()=>setStep(2)} style={{ width:'100%', padding:'14px', fontSize:14 }}>
              PROCEED →
            </button>
          </div>
        )}

        {step === 2 && !rankReveal && (
          <div className="anim-slide-in">
            <div className="cinzel" style={{ fontSize:18, color:'var(--gold)', marginBottom:24 }}>ASPIRATIONS</div>
            <div style={{ fontSize:13, color:'var(--text-dim)', marginBottom:24, lineHeight:1.6 }}>
              "The System reads not only your past, but your will. Speak your ambitions into existence."
            </div>
            {[
              {k:'dreamPhysique', label:'Describe your dream physique in one word', ph:'shredded / aesthetic / powerful...'},
              {k:'goal', label:'Your #1 life goal right now', ph:'Enter your primary objective...'},
              {k:'weakness', label:'Biggest weakness to defeat', ph:'Name your enemy...'},
            ].map(({k,label,ph})=>(
              <div key={k} style={{ marginBottom:16 }}>
                <label style={{ display:'block', fontSize:12, color:'var(--text-dim)', marginBottom:8, letterSpacing:1 }}>{label}</label>
                <input className="input-dark" value={answers[k]} onChange={e=>setA(k,e.target.value)} placeholder={ph}/>
              </div>
            ))}
            <button className="btn-gold" onClick={handleAssessComplete} style={{ width:'100%', padding:'14px', fontSize:14 }}>
              REVEAL MY RANK →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STATUS SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function StatusScreen({ state, dispatch, addXP }) {
  const { hunter, stats, quests, habits } = state;
  const today = todayStr();
  const dailyDone = quests.daily.filter(q=>q.completed && q.date===today).length;
  const totalDaily = quests.daily.length;
  const activeStreaks = habits.filter(h => {
    const yd = new Date(Date.now()-86400000).toISOString().slice(0,10);
    return h.completedDates.includes(today) || h.completedDates.includes(yd);
  }).length;
  const quote = getDailyQuote(hunter.rank);
  const rankColor = RANK_COLORS[hunter.rank] || '#4FC3F7';
  const cls = CLASS_INFO[hunter.class] || CLASS_INFO.warrior;

  return (
    <div className="scrollable" style={{ height:'100%', overflowY:'auto', overflowX:'hidden' }}>
      <div style={{ padding:'16px', display:'flex', flexDirection:'column', gap:12, paddingBottom:24 }}>
      {/* Header Card */}
      <div className="panel panel-glow" style={{ padding:20, position:'relative', overflow:'visible', flexShrink:0 }}>
        <div style={{ position:'absolute', top:-20, right:-20, width:120, height:120, borderRadius:'50%', background:`radial-gradient(circle, ${rankColor}22, transparent 70%)`, pointerEvents:'none', zIndex:0 }}/>
        <div style={{ position:'relative', zIndex:1 }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
              <span style={{ fontSize:22 }}>{cls.icon}</span>
              <RankBadge rank={hunter.rank} size={11} pulse/>
            </div>
            <div className="cinzel" style={{ fontSize:24, fontWeight:900, color:'#fff', marginBottom:2 }}>{hunter.name}</div>
            <div style={{ fontSize:12, color:rankColor, letterSpacing:2 }}>{state.hunter.equippedTitle || hunter.title.toUpperCase()}</div>
            <div style={{ fontSize:11, color:'var(--text-dim)', marginTop:2 }}>
              {cls.label} Class · Levels {getRankRange(hunter.rank)}
              {state.hunter.equippedBadge && <span style={{ marginLeft:8, color:'var(--gold)' }}>{state.hunter.equippedBadge}</span>}
            </div>
          </div>
          <div style={{ textAlign:'right', flexShrink:0 }}>
            <div className="cinzel" style={{ fontSize:42, fontWeight:900, color:'var(--mana)', lineHeight:1 }}>
              {hunter.level}
            </div>
            <div style={{ fontSize:11, color:'var(--text-dim)' }}>LEVEL</div>
          </div>
        </div>
        <XPBar current={hunter.totalXP} needed={hunter.xpToNextLevel}/>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:12, gap:8 }}>
          <div style={{ flex:1, textAlign:'center', padding:'10px 6px', background:'rgba(79,195,247,0.05)', borderRadius:6, border:'1px solid var(--border)' }}>
            <div className="cinzel" style={{ fontSize:16, color:'var(--mana)' }}>{dailyDone}/{totalDaily}</div>
            <div style={{ fontSize:9, color:'var(--text-dim)' }}>DAILY QUESTS</div>
          </div>
          <div style={{ flex:1, textAlign:'center', padding:'10px 6px', background:'rgba(243,156,18,0.05)', borderRadius:6, border:'1px solid rgba(243,156,18,0.2)' }}>
            <div className="cinzel" style={{ fontSize:16, color:'var(--gold)' }}>{activeStreaks}</div>
            <div style={{ fontSize:9, color:'var(--text-dim)' }}>STREAKS</div>
          </div>
          <div style={{ flex:1, textAlign:'center', padding:'10px 6px', background:'rgba(155,89,182,0.05)', borderRadius:6, border:'1px solid rgba(155,89,182,0.2)' }}>
            <div className="cinzel" style={{ fontSize:16, color:'var(--violet)' }}>{(hunter.totalXP + hunter.level * hunter.xpToNextLevel).toLocaleString()}</div>
            <div style={{ fontSize:9, color:'var(--text-dim)' }}>TOTAL XP</div>
          </div>
        </div>
        </div>
      </div>

      {/* Stats */}
      <div className="panel" style={{ padding:16, flexShrink:0 }}>
        <div className="cinzel" style={{ fontSize:12, color:'var(--text-dim)', letterSpacing:3, marginBottom:14 }}>CORE ATTRIBUTES</div>
        {Object.entries(stats).map(([k,v])=>(
          <StatBar key={k} label={k} abbr={STAT_LABELS[k]} value={v} color={STAT_COLORS[k]}/>
        ))}
      </div>

      {/* Daily Quest Preview */}
      <div className="panel" style={{ padding:16, flexShrink:0 }}>
        <div className="cinzel" style={{ fontSize:12, color:'var(--text-dim)', letterSpacing:3, marginBottom:12 }}>TODAY'S GATE STATUS</div>
        {quests.daily.slice(0,4).map(q=>(
          <div key={q.id} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
            <div style={{
              width:16, height:16, borderRadius:3, flexShrink:0,
              border: q.completed ? 'none' : '1px solid var(--border)',
              background: q.completed ? 'var(--mana)' : 'transparent',
              display:'flex', alignItems:'center', justifyContent:'center'
            }}>
              {q.completed && <Check size={10} color="#000"/>}
            </div>
            <span style={{ fontSize:12, color: q.completed ? 'var(--text-dim)' : 'var(--text)', textDecoration: q.completed ? 'line-through' : 'none', flex:1 }}>{q.name}</span>
            <span style={{ fontSize:11, color:'var(--gold)' }}>{q.xp} XP</span>
          </div>
        ))}
        {dailyDone === totalDaily && (
          <div className="cinzel" style={{ textAlign:'center', color:'var(--mana)', marginTop:8, fontSize:13, letterSpacing:2 }}>
            ✦ ALL GATES CLEARED ✦
          </div>
        )}
      </div>

      {/* Quote */}
      <div className="panel" style={{ padding:16, borderColor:'rgba(155,89,182,0.3)', textAlign:'center', flexShrink:0 }}>
        <div style={{ fontSize:11, color:'var(--violet)', letterSpacing:2, marginBottom:8 }}>SYSTEM MESSAGE</div>
        <div style={{ fontSize:13, color:'var(--text)', lineHeight:1.7, fontStyle:'italic' }}>"{quote}"</div>
      </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// QUESTS SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function QuestsScreen({ state, dispatch, addXP, showNotif }) {
  const [tab, setTab] = useState('daily');
  const [showAddMain, setShowAddMain] = useState(false);
  const [showAddDaily, setShowAddDaily] = useState(false);
  const [newQuest, setNewQuest] = useState({ name:'', xp:100, target:1, desc:'', statReward:'', statAmount:1, rewardId:'' });
  const today = todayStr();

  const completeDaily = (q) => {
    if (q.completed) return;
    dispatch({ type:'COMPLETE_DAILY_QUEST', payload:q.id });
    addXP(q.xp, 'quest');
    const msgs = ['QUEST CLEARED'];
    if (q.statReward) msgs.push(`+${q.statAmount||1} ${q.statReward.toUpperCase().slice(0,3)}`);
    if (q.rewardId) msgs.push('🎁 REWARD EARNED');
    showNotif(msgs.join(' · '));
  };
  const completeWeekly = (q) => {
    if (q.completed) return;
    dispatch({ type:'COMPLETE_WEEKLY_QUEST', payload:q.id });
    addXP(q.xp, 'quest');
    showNotif('WEEKLY QUEST CLEARED' + (q.statReward ? ` · +${q.statAmount||1} ${q.statReward.slice(0,3).toUpperCase()}` : ''));
  };
  const completeMain = (q) => {
    if (q.completed) return;
    dispatch({ type:'COMPLETE_MAIN_QUEST', payload:q.id });
    addXP(q.xp, 'quest');
    showNotif('MAIN QUEST COMPLETE!' + (q.rewardId ? ' 🎁 REWARD EARNED' : ''));
  };

  const STAT_OPTIONS = [
    { value:'', label:'None' },
    { value:'strength', label:'⚔️ Strength' },
    { value:'intelligence', label:'📚 Intelligence' },
    { value:'discipline', label:'🎯 Discipline' },
    { value:'vitality', label:'❤️ Vitality' },
    { value:'focus', label:'⚡ Focus' },
    { value:'charisma', label:'🌟 Charisma' },
  ];

  const customRewards = state.customRewards || [];

  const QuestExtrasForm = () => (
    <>
      {/* Stat Reward */}
      <div style={{ marginBottom:12 }}>
        <label style={{ display:'block', fontSize:11, color:'var(--text-dim)', marginBottom:6 }}>STAT REWARD ON COMPLETION</label>
        <div style={{ display:'flex', gap:8 }}>
          <select className="input-dark" value={newQuest.statReward} onChange={e=>setNewQuest(p=>({...p,statReward:e.target.value}))} style={{ flex:2 }}>
            {STAT_OPTIONS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          {newQuest.statReward && (
            <input className="input-dark" type="number" min={1} max={99} value={newQuest.statAmount}
              onChange={e=>setNewQuest(p=>({...p,statAmount:Math.max(1,+e.target.value||1)}))}
              style={{ flex:1, padding:'8px 10px' }} placeholder="+amt"/>
          )}
        </div>
      </div>
      {/* Reward Association */}
      {customRewards.length > 0 && (
        <div style={{ marginBottom:12 }}>
          <label style={{ display:'block', fontSize:11, color:'var(--text-dim)', marginBottom:6 }}>LINKED REAL-WORLD REWARD</label>
          <select className="input-dark" value={newQuest.rewardId} onChange={e=>setNewQuest(p=>({...p,rewardId:e.target.value}))}>
            <option value="">None</option>
            {customRewards.map(r=><option key={r.id} value={r.id}>{r.emoji} {r.name}</option>)}
          </select>
          <div style={{ fontSize:10, color:'var(--text-dim)', marginTop:4 }}>You'll earn this reward when quest is completed.</div>
        </div>
      )}
      {customRewards.length === 0 && (
        <div style={{ fontSize:11, color:'var(--text-dim)', marginBottom:12, padding:'8px 12px', border:'1px solid var(--border)', borderRadius:6, background:'rgba(79,195,247,0.03)' }}>
          💡 Create custom rewards in the Rewards → Custom tab to link them to quests.
        </div>
      )}
    </>
  );

  const TABS = [
    { k:'daily', label:'Daily', icon:'⚡' },
    { k:'weekly', label:'Weekly', icon:'📅' },
    { k:'main', label:'Main', icon:'👑' },
    { k:'side', label:'Side', icon:'🎯' },
  ];

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column' }}>
      <div style={{ padding:'12px 16px 0' }}>
        <div className="cinzel" style={{ fontSize:18, color:'var(--mana)', letterSpacing:3, marginBottom:12 }}>MISSION BOARD</div>
        <div style={{ display:'flex', gap:6, marginBottom:12 }}>
          {TABS.map(t=>(
            <button key={t.k} onClick={()=>setTab(t.k)} style={{
              flex:1, padding:'7px 4px', fontSize:11, borderRadius:6, cursor:'pointer', transition:'all 0.2s',
              border: tab===t.k ? '1px solid var(--mana)' : '1px solid var(--border)',
              background: tab===t.k ? 'rgba(79,195,247,0.15)' : 'rgba(10,10,20,0.6)',
              color: tab===t.k ? 'var(--mana)' : 'var(--text-dim)', fontFamily:'Cinzel,serif'
            }}>{t.icon} {t.label}</button>
          ))}
        </div>
      </div>

      <div className="scrollable" style={{ flex:1, padding:'0 16px 16px' }}>
        {tab==='daily' && (
          <>
            <div style={{ fontSize:11, color:'var(--text-dim)', marginBottom:12, letterSpacing:1 }}>
              ⚡ Resets at midnight — Daily Dungeon
            </div>
            {state.quests.daily.map(q=>(
              <QuestCard key={q.id} quest={q} completed={q.completed && q.date===today} onComplete={()=>completeDaily(q)} color="var(--mana)" customRewards={customRewards}/>
            ))}
            <button className="btn-mana" onClick={()=>setShowAddDaily(true)} style={{ width:'100%', marginTop:8 }}>
              + ADD CUSTOM DAILY QUEST
            </button>
          </>
        )}
        {tab==='weekly' && (
          <>
            <div style={{ fontSize:11, color:'var(--text-dim)', marginBottom:12, letterSpacing:1 }}>
              📅 Weekly Gate — Clears every Sunday
            </div>
            {state.quests.weekly.map(q=>(
              <QuestCard key={q.id} quest={q} completed={q.completed} onComplete={()=>completeWeekly(q)} color="var(--violet)" showProgress customRewards={customRewards}/>
            ))}
          </>
        )}
        {tab==='main' && (
          <>
            <div style={{ fontSize:11, color:'var(--text-dim)', marginBottom:12, letterSpacing:1 }}>
              👑 Story Arc — Long-term objectives
            </div>
            {state.quests.main.length===0 && (
              <div style={{ textAlign:'center', padding:32, color:'var(--text-dim)', fontSize:13 }}>
                No main quests active.<br/>Define your story arc.
              </div>
            )}
            {state.quests.main.map(q=>(
              <QuestCard key={q.id} quest={q} completed={q.completed} onComplete={()=>completeMain(q)} color="var(--gold)" customRewards={customRewards}/>
            ))}
            <button className="btn-gold" onClick={()=>setShowAddMain(true)} style={{ width:'100%', marginTop:8 }}>
              + DEFINE MAIN QUEST
            </button>
          </>
        )}
        {tab==='side' && (
          <div style={{ textAlign:'center', padding:32, color:'var(--text-dim)' }}>
            <Trophy size={40} style={{ opacity:0.3, margin:'0 auto 12px' }}/>
            <div className="cinzel" style={{ fontSize:14 }}>SIDE QUESTS</div>
            <div style={{ fontSize:12, marginTop:8, lineHeight:1.6 }}>
              Complete actions to unlock achievements.<br/>
              Check habits, log workouts, and reach milestones.
            </div>
          </div>
        )}
      </div>

      {showAddMain && (
        <div className="modal-overlay" onClick={()=>setShowAddMain(false)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="cinzel" style={{ color:'var(--gold)', fontSize:16, marginBottom:16 }}>NEW MAIN QUEST</div>
            {[{k:'name',label:'Quest Name',ph:'Reach 75kg bodyweight...'},
              {k:'desc',label:'Description (optional)',ph:'Sub-objectives...'},
              {k:'xp',label:'XP Reward',ph:'500'}].map(f=>(
              <div key={f.k} style={{ marginBottom:12 }}>
                <label style={{ display:'block', fontSize:11, color:'var(--text-dim)', marginBottom:6 }}>{f.label}</label>
                <input className="input-dark" value={newQuest[f.k]} onChange={e=>setNewQuest(p=>({...p,[f.k]:e.target.value}))} placeholder={f.ph}/>
              </div>
            ))}
            <QuestExtrasForm/>
            <div style={{ display:'flex', gap:8, marginTop:8 }}>
              <button className="btn-mana" style={{ flex:1 }} onClick={()=>{
                if(!newQuest.name) return;
                dispatch({type:'ADD_MAIN_QUEST', payload:{name:newQuest.name, desc:newQuest.desc, xp:+newQuest.xp||100, statReward:newQuest.statReward, statAmount:+newQuest.statAmount||1, rewardId:newQuest.rewardId}});
                setNewQuest({name:'',xp:100,target:1,desc:'',statReward:'',statAmount:1,rewardId:''});
                setShowAddMain(false);
              }}>CREATE QUEST</button>
              <button className="btn-danger" onClick={()=>setShowAddMain(false)}>CANCEL</button>
            </div>
          </div>
        </div>
      )}

      {showAddDaily && (
        <div className="modal-overlay" onClick={()=>setShowAddDaily(false)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="cinzel" style={{ color:'var(--mana)', fontSize:16, marginBottom:16 }}>CUSTOM DAILY QUEST</div>
            {[{k:'name',label:'Quest Name',ph:'Meditate for 10 minutes...'},{k:'xp',label:'XP Reward',ph:'50'}].map(f=>(
              <div key={f.k} style={{ marginBottom:12 }}>
                <label style={{ display:'block', fontSize:11, color:'var(--text-dim)', marginBottom:6 }}>{f.label}</label>
                <input className="input-dark" value={newQuest[f.k]} onChange={e=>setNewQuest(p=>({...p,[f.k]:e.target.value}))} placeholder={f.ph}/>
              </div>
            ))}
            <QuestExtrasForm/>
            <div style={{ display:'flex', gap:8, marginTop:8 }}>
              <button className="btn-mana" style={{ flex:1 }} onClick={()=>{
                if(!newQuest.name) return;
                dispatch({type:'ADD_DAILY_QUEST', payload:{name:newQuest.name, xp:+newQuest.xp||50, category:'custom', statReward:newQuest.statReward, statAmount:+newQuest.statAmount||1, rewardId:newQuest.rewardId}});
                setNewQuest({name:'',xp:50,target:1,desc:'',statReward:'',statAmount:1,rewardId:''});
                setShowAddDaily(false);
              }}>ADD QUEST</button>
              <button className="btn-danger" onClick={()=>setShowAddDaily(false)}>CANCEL</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function QuestCard({ quest, completed, onComplete, color, showProgress, customRewards }) {
  const linkedReward = customRewards && quest.rewardId ? customRewards.find(r=>r.id===quest.rewardId) : null;
  return (
    <div className="panel" style={{
      padding:14, marginBottom:10, borderColor: completed ? 'rgba(79,195,247,0.1)' : `${color}33`,
      opacity: completed ? 0.6 : 1, transition:'all 0.3s'
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <button onClick={onComplete} disabled={completed} style={{
          width:28, height:28, borderRadius:6, flexShrink:0, cursor: completed ? 'default' : 'pointer',
          border: completed ? 'none' : `1px solid ${color}`,
          background: completed ? color : 'transparent',
          display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s',
          boxShadow: completed ? 'none' : `0 0 10px ${color}44`
        }}>
          {completed && <Check size={14} color="#000"/>}
        </button>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, color: completed ? 'var(--text-dim)' : 'var(--text)', textDecoration: completed ? 'line-through' : 'none' }}>
            {quest.name}
          </div>
          {quest.desc && <div style={{ fontSize:11, color:'var(--text-dim)', marginTop:2 }}>{quest.desc}</div>}
          {/* Rewards row */}
          <div style={{ display:'flex', gap:6, marginTop:4, flexWrap:'wrap' }}>
            {quest.statReward && (
              <span style={{ fontSize:9, color:STAT_COLORS[quest.statReward]||'var(--mana)', border:`1px solid ${STAT_COLORS[quest.statReward]||'var(--mana)'}44`, borderRadius:3, padding:'1px 5px', letterSpacing:1 }}>
                +{quest.statAmount||1} {STAT_LABELS[quest.statReward]||quest.statReward.toUpperCase().slice(0,3)}
              </span>
            )}
            {linkedReward && (
              <span style={{ fontSize:9, color:'var(--gold)', border:'1px solid rgba(243,156,18,0.4)', borderRadius:3, padding:'1px 5px' }}>
                🎁 {linkedReward.emoji} {linkedReward.name}
              </span>
            )}
          </div>
        </div>
        <div className="cinzel" style={{ fontSize:12, color:'var(--gold)', flexShrink:0 }}>+{quest.xp} XP</div>
      </div>
      {showProgress && quest.target > 1 && (
        <div style={{ marginTop:10 }}>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'var(--text-dim)', marginBottom:4 }}>
            <span>Progress</span><span>{quest.progress||0}/{quest.target}</span>
          </div>
          <div className="xp-bar-track">
            <div className="xp-bar-fill" style={{ width:`${Math.min(100,((quest.progress||0)/quest.target)*100)}%`, background:`linear-gradient(90deg, ${color}66, ${color})` }}/>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BODY SCREEN — Anatomical Muscle Map
// ─────────────────────────────────────────────────────────────────────────────
function getMuscleColor(level) {
  if (level === 0) return '#1a1a2e';
  if (level <= 3) return '#1565C0';
  if (level <= 6) return '#4FC3F7';
  if (level <= 9) return '#00E5FF';
  return '#FFD700';
}
function getMuscleGlow(level) {
  if (level === 0) return 'none';
  if (level <= 3) return '0 0 6px #1565C0';
  if (level <= 6) return `0 0 10px #4FC3F7, 0 0 20px #4FC3F780`;
  if (level <= 9) return `0 0 15px #00E5FF, 0 0 30px #00E5FF80`;
  return `0 0 20px #FFD700, 0 0 40px #FFD70080, 0 0 60px #FFD70040`;
}

function BodyScreen({ state, dispatch, addXP }) {
  const [view, setView] = useState('front');
  const [tooltip, setTooltip] = useState(null);
  const [modalMuscle, setModalMuscle] = useState(null);
  const [showAssistant, setShowAssistant] = useState(false);
  const [workoutForm, setWorkoutForm] = useState({ exercise:'', sets:3, reps:10, weight:'' });

  const handleMuscleTap = (muscleName) => { setModalMuscle(muscleName); };

  const logWorkout = (form) => {
    const f = form || workoutForm;
    if (!f.exercise) return;
    const xpGain = 50 + (f.weight ? Math.floor(f.weight/10)*5 : 0);
    dispatch({ type:'LOG_WORKOUT', payload:{ muscleName:modalMuscle, xpGain, entry:{ ...f } } });
    addXP(xpGain + 50, 'workout');
    dispatch({ type:'GAIN_STAT', payload:{ stat:'strength', amount:1 } });
    setModalMuscle(null);
    setShowAssistant(false);
    setWorkoutForm({ exercise:'', sets:3, reps:10, weight:'' });
  };

  const muscle = modalMuscle ? state.muscles[modalMuscle] : null;
  const MUSCLE_NAMES = {
    chest:'Chest', frontDelts:'Front Delts', sideDelts:'Side Delts', biceps:'Biceps',
    triceps:'Triceps', abs:'Abs', obliques:'Obliques', quads:'Quads', calves:'Calves', forearms:'Forearms',
    traps:'Traps', rearDelts:'Rear Delts', lats:'Lats', rhomboids:'Rhomboids',
    lowerBack:'Lower Back', glutes:'Glutes', hamstrings:'Hamstrings', hipFlexors:'Hip Flexors'
  };

  // SVG body — stylized anatomical figure
  const frontMuscles = [
    { id:'chest', label:'Chest', d:'M 95,145 Q 110,135 125,138 L 125,162 Q 110,168 95,160 Z', cx:110,cy:152 },
    { id:'chest', label:'Chest', d:'M 175,145 Q 160,135 145,138 L 145,162 Q 160,168 175,160 Z', cx:160,cy:152 },
    { id:'frontDelts', label:'Front Delts', d:'M 87,133 Q 92,125 102,128 L 100,148 Q 90,145 87,140 Z', cx:93,cy:138 },
    { id:'frontDelts', label:'Front Delts', d:'M 183,133 Q 178,125 168,128 L 170,148 Q 180,145 183,140 Z', cx:177,cy:138 },
    { id:'sideDelts', label:'Side Delts', d:'M 82,132 Q 78,127 80,140 L 88,148 Q 90,140 87,133 Z', cx:82,cy:140 },
    { id:'sideDelts', label:'Side Delts', d:'M 188,132 Q 192,127 190,140 L 182,148 Q 180,140 183,133 Z', cx:188,cy:140 },
    { id:'biceps', label:'Biceps', d:'M 78,150 Q 73,160 74,175 L 83,175 Q 85,162 86,150 Z', cx:78,cy:163 },
    { id:'biceps', label:'Biceps', d:'M 192,150 Q 197,160 196,175 L 187,175 Q 185,162 184,150 Z', cx:192,cy:163 },
    { id:'triceps', label:'Triceps', d:'M 72,152 Q 68,163 70,178 L 78,178 Q 75,163 78,152 Z', cx:70,cy:165 },
    { id:'triceps', label:'Triceps', d:'M 198,152 Q 202,163 200,178 L 192,178 Q 195,163 192,152 Z', cx:200,cy:165 },
    { id:'forearms', label:'Forearms', d:'M 71,180 Q 67,192 68,205 L 76,205 Q 76,192 78,180 Z', cx:71,cy:192 },
    { id:'forearms', label:'Forearms', d:'M 199,180 Q 203,192 202,205 L 194,205 Q 194,192 192,180 Z', cx:199,cy:192 },
    { id:'abs', label:'Abs', d:'M 122,168 L 148,168 L 148,195 L 122,195 Z', cx:135,cy:181 },
    { id:'abs', label:'Abs', d:'M 122,197 L 148,197 L 148,220 L 122,220 Z', cx:135,cy:208 },
    { id:'abs', label:'Abs', d:'M 122,222 L 148,222 L 148,242 L 122,242 Z', cx:135,cy:232 },
    { id:'obliques', label:'Obliques', d:'M 110,168 Q 100,180 102,210 L 120,215 L 122,168 Z', cx:110,cy:193 },
    { id:'obliques', label:'Obliques', d:'M 160,168 Q 170,180 168,210 L 150,215 L 148,168 Z', cx:160,cy:193 },
    { id:'quads', label:'Quads', d:'M 112,260 Q 105,280 106,310 L 130,310 L 130,260 Z', cx:115,cy:285 },
    { id:'quads', label:'Quads', d:'M 158,260 Q 165,280 164,310 L 140,310 L 140,260 Z', cx:155,cy:285 },
    { id:'calves', label:'Calves', d:'M 110,335 Q 106,355 108,375 L 128,375 L 126,335 Z', cx:115,cy:355 },
    { id:'calves', label:'Calves', d:'M 160,335 Q 164,355 162,375 L 142,375 L 144,335 Z', cx:155,cy:355 },
  ];

  const backMuscles = [
    { id:'traps', label:'Traps', d:'M 115,130 Q 135,120 155,130 L 155,150 L 135,155 L 115,150 Z', cx:135,cy:140 },
    { id:'rearDelts', label:'Rear Delts', d:'M 92,132 Q 98,125 108,128 L 108,148 Q 96,147 92,140 Z', cx:99,cy:138 },
    { id:'rearDelts', label:'Rear Delts', d:'M 178,132 Q 172,125 162,128 L 162,148 Q 174,147 178,140 Z', cx:171,cy:138 },
    { id:'lats', label:'Lats', d:'M 108,150 Q 100,165 100,195 L 120,200 L 118,150 Z', cx:107,cy:175 },
    { id:'lats', label:'Lats', d:'M 162,150 Q 170,165 170,195 L 150,200 L 152,150 Z', cx:163,cy:175 },
    { id:'rhomboids', label:'Rhomboids', d:'M 120,148 L 150,148 L 155,172 L 115,172 Z', cx:135,cy:160 },
    { id:'lowerBack', label:'Lower Back', d:'M 118,200 L 152,200 L 155,235 L 115,235 Z', cx:135,cy:217 },
    { id:'glutes', label:'Glutes', d:'M 112,250 Q 105,265 107,285 L 135,285 L 135,250 Z', cx:118,cy:268 },
    { id:'glutes', label:'Glutes', d:'M 158,250 Q 165,265 163,285 L 135,285 L 135,250 Z', cx:152,cy:268 },
    { id:'hamstrings', label:'Hamstrings', d:'M 112,290 Q 108,310 110,330 L 132,330 L 132,290 Z', cx:118,cy:310 },
    { id:'hamstrings', label:'Hamstrings', d:'M 158,290 Q 162,310 160,330 L 138,330 L 138,290 Z', cx:152,cy:310 },
    { id:'calves', label:'Calves', d:'M 113,335 Q 109,355 111,375 L 129,375 L 129,335 Z', cx:118,cy:355 },
    { id:'calves', label:'Calves', d:'M 157,335 Q 161,355 159,375 L 141,375 L 141,335 Z', cx:152,cy:355 },
  ];

  const muscles = view==='front' ? frontMuscles : backMuscles;

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column' }}>
      <div style={{ padding:'12px 16px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div className="cinzel" style={{ fontSize:18, color:'var(--mana)', letterSpacing:3 }}>BODY MAP</div>
        <div style={{ display:'flex', gap:8 }}>
          <button className={view==='front'?'btn-mana':'btn-danger'} style={{ padding:'5px 12px', opacity:view==='front'?1:0.5 }} onClick={()=>setView('front')}>FRONT</button>
          <button className={view==='back'?'btn-mana':'btn-danger'} style={{ padding:'5px 12px', opacity:view==='back'?1:0.5 }} onClick={()=>setView('back')}>BACK</button>
        </div>
      </div>

      <div style={{ flex:1, display:'flex', overflow:'hidden' }}>
        {/* SVG */}
        <div style={{ flex:1, display:'flex', justifyContent:'center', alignItems:'flex-start', overflow:'auto', padding:'0 8px' }}>
          <svg viewBox="55 105 160 285" width="200" height="380" style={{ filter:'drop-shadow(0 0 10px rgba(79,195,247,0.1))' }}>
            {/* Body silhouette */}
            <ellipse cx="135" cy="120" rx="20" ry="22" fill="#0f0f1a" stroke="#1a1a2e" strokeWidth="1.5"/>
            {/* Neck */}
            <rect x="128" y="138" width="14" height="12" fill="#0f0f1a" stroke="#1a1a2e" strokeWidth="1"/>
            {/* Torso */}
            <path d="M 90,148 Q 82,152 80,200 Q 80,245 90,258 L 180,258 Q 190,245 190,200 Q 188,152 180,148 Z" fill="#0a0a15" stroke="#1a1a2e" strokeWidth="1.5"/>
            {/* Arms */}
            <path d="M 82,150 Q 70,165 68,210 L 80,210 Q 82,168 92,152 Z" fill="#0a0a15" stroke="#1a1a2e" strokeWidth="1"/>
            <path d="M 188,150 Q 200,165 202,210 L 190,210 Q 188,168 178,152 Z" fill="#0a0a15" stroke="#1a1a2e" strokeWidth="1"/>
            {/* Legs */}
            <path d="M 90,258 Q 85,290 87,330 Q 88,360 90,380 L 130,380 L 130,258 Z" fill="#0a0a15" stroke="#1a1a2e" strokeWidth="1"/>
            <path d="M 180,258 Q 185,290 183,330 Q 182,360 180,380 L 140,380 L 140,258 Z" fill="#0a0a15" stroke="#1a1a2e" strokeWidth="1"/>
            {/* Muscle overlays */}
            {muscles.map((m,i) => {
              const ms = state.muscles[m.id];
              const color = getMuscleColor(ms?.level||0);
              const glow = getMuscleGlow(ms?.level||0);
              return (
                <path key={i} d={m.d}
                  fill={color} opacity={0.85}
                  style={{ cursor:'pointer', filter: ms?.level>0 ? `drop-shadow(${glow})` : 'none', transition:'all 0.3s' }}
                  onClick={()=>handleMuscleTap(m.id)}
                  onMouseEnter={e=>{
                    const r = e.currentTarget.getBoundingClientRect();
                    setTooltip({ name:m.label, muscle:ms, x:r.left, y:r.top });
                  }}
                  onMouseLeave={()=>setTooltip(null)}
                />
              );
            })}
          </svg>
        </div>

        {/* Muscle List */}
        <div className="scrollable" style={{ width:140, padding:'0 8px 16px', borderLeft:'1px solid var(--border)' }}>
          <div style={{ fontSize:10, color:'var(--text-dim)', letterSpacing:2, padding:'8px 0 10px', textAlign:'center' }}>MUSCLE LOG</div>
          {Object.entries(state.muscles).map(([k,m])=>(
            <div key={k} onClick={()=>setModalMuscle(k)} style={{
              padding:'7px 8px', marginBottom:4, borderRadius:6, cursor:'pointer',
              border:`1px solid ${getMuscleColor(m.level)}44`,
              background:`${getMuscleColor(m.level)}11`,
              transition:'all 0.2s'
            }}>
              <div style={{ fontSize:10, color:'var(--text)', marginBottom:2 }}>{MUSCLE_NAMES[k]||k}</div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:9, color:'var(--text-dim)' }}>
                <span style={{ color:getMuscleColor(m.level) }}>Lv.{m.level}</span>
                <span>{m.trained}x</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div className="muscle-tooltip" style={{ left:tooltip.x-60, top:tooltip.y-70 }}>
          <div style={{ color:'var(--mana)', fontWeight:700, marginBottom:4 }}>{tooltip.name}</div>
          <div style={{ fontSize:11 }}>Level: {tooltip.muscle?.level||0}</div>
          <div style={{ fontSize:11 }}>Trained: {tooltip.muscle?.trained||0}x</div>
        </div>
      )}

      {/* Log Modal */}
      {modalMuscle && !showAssistant && (
        <div className="modal-overlay" onClick={()=>setModalMuscle(null)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="cinzel" style={{ color:'var(--mana)', fontSize:16, marginBottom:4 }}>LOG WORKOUT</div>
            <div style={{ fontSize:12, color:'var(--text-dim)', marginBottom:12 }}>
              {MUSCLE_NAMES[modalMuscle]||modalMuscle} — Lv.{muscle?.level||0} | {muscle?.trained||0} sessions
            </div>
            {/* Workout Assistant CTA */}
            <button onClick={()=>setShowAssistant(true)} style={{
              width:'100%', padding:'10px', marginBottom:16, borderRadius:8, cursor:'pointer',
              background:'rgba(155,89,182,0.12)', border:'1px solid rgba(155,89,182,0.4)',
              color:'var(--violet)', fontSize:12, fontFamily:'Cinzel,serif', letterSpacing:1
            }}>
              💡 GET EXERCISE SUGGESTIONS →
            </button>
            <div style={{ marginBottom:12 }}>
              <label style={{ fontSize:11, color:'var(--text-dim)', display:'block', marginBottom:6 }}>EXERCISE NAME</label>
              <input className="input-dark" value={workoutForm.exercise} onChange={e=>setWorkoutForm(p=>({...p,exercise:e.target.value}))} placeholder="Bench Press, Curls..."/>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:16 }}>
              {[{k:'sets',label:'SETS'},{k:'reps',label:'REPS'},{k:'weight',label:'KG (opt)'}].map(f=>(
                <div key={f.k}>
                  <label style={{ fontSize:10, color:'var(--text-dim)', display:'block', marginBottom:4 }}>{f.label}</label>
                  <input className="input-dark" type="number" value={workoutForm[f.k]} onChange={e=>setWorkoutForm(p=>({...p,[f.k]:e.target.value}))} style={{ padding:'8px 10px' }}/>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button className="btn-gold" style={{ flex:1 }} onClick={()=>logWorkout()}>LOG WORKOUT ⚡</button>
              <button className="btn-danger" onClick={()=>setModalMuscle(null)}>CANCEL</button>
            </div>
          </div>
        </div>
      )}

      {/* Workout Assistant */}
      {modalMuscle && showAssistant && (
        <WorkoutAssistant
          muscleName={modalMuscle}
          muscleData={state.muscles[modalMuscle]}
          onClose={()=>setShowAssistant(false)}
          onLogWorkout={(form)=>logWorkout(form)}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MIND SCREEN
// ─────────────────────────────────────────────────────────────────────────────
const SKILL_LEVELS = ['Untouched','Beginner','Beginner','Apprentice','Apprentice','Journeyman','Journeyman','Expert','Expert','Master','Grandmaster ✦'];
function MindScreen({ state, dispatch, addXP }) {
  const [tab, setTab] = useState('subjects');
  const [showAddSub, setShowAddSub] = useState(false);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [showLogStudy, setShowLogStudy] = useState(null);
  const [showLogSkill, setShowLogSkill] = useState(null);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Technical');
  const [studyForm, setStudyForm] = useState({ minutes:60, notes:'' });
  const [skillForm, setSkillForm] = useState({ minutes:30, rating:3 });

  const logStudy = (subjectName) => {
    dispatch({ type:'LOG_STUDY', payload:{ subjectName, ...studyForm } });
    addXP(studyForm.minutes * 2, 'study');
    dispatch({ type:'GAIN_STAT', payload:{ stat:'intelligence', amount:1 } });
    setShowLogStudy(null);
    setStudyForm({ minutes:60, notes:'' });
  };

  const logSkill = (skillName) => {
    dispatch({ type:'LOG_SKILL', payload:{ skillName, ...skillForm } });
    addXP(Math.round((skillForm.minutes/30)*75), 'skill');
    dispatch({ type:'GAIN_STAT', payload:{ stat:'focus', amount:1 } });
    setShowLogSkill(null);
  };

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column' }}>
      <div style={{ padding:'12px 16px' }}>
        <div className="cinzel" style={{ fontSize:18, color:'var(--mana)', letterSpacing:3, marginBottom:12 }}>MIND DOMAIN</div>
        <div style={{ display:'flex', gap:8, marginBottom:12 }}>
          {['subjects','skills'].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{
              flex:1, padding:'8px', fontSize:12, borderRadius:6, cursor:'pointer',
              border: tab===t ? '1px solid var(--mana)' : '1px solid var(--border)',
              background: tab===t ? 'rgba(79,195,247,0.15)' : 'rgba(10,10,20,0.6)',
              color: tab===t ? 'var(--mana)' : 'var(--text-dim)', fontFamily:'Cinzel,serif'
            }}>{t==='subjects'?'📚 SUBJECTS':'⚡ SKILLS'}</button>
          ))}
        </div>
      </div>

      <div className="scrollable" style={{ flex:1, padding:'0 16px 16px' }}>
        {tab==='subjects' && (
          <>
            {Object.entries(state.subjects).length === 0 && (
              <div style={{ textAlign:'center', padding:32, color:'var(--text-dim)', fontSize:13 }}>
                No subjects tracked yet.<br/>Add a subject to begin your studies.
              </div>
            )}
            {Object.entries(state.subjects).map(([name,sub])=>(
              <div key={name} className="panel" style={{ padding:16, marginBottom:10 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                  <div>
                    <div className="cinzel" style={{ fontSize:14, color:'var(--text)' }}>{name}</div>
                    <div style={{ fontSize:11, color:'var(--mana)' }}>{SKILL_LEVELS[Math.min(10,sub.level)]} — Lv.{sub.level}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:11, color:'var(--text-dim)' }}>{sub.hoursStudied.toFixed(1)}h studied</div>
                    <button className="btn-mana" style={{ fontSize:10, padding:'4px 10px', marginTop:4 }} onClick={()=>setShowLogStudy(name)}>LOG SESSION</button>
                  </div>
                </div>
                <XPBar current={sub.xp} needed={(sub.level+1)*500}/>
              </div>
            ))}
            <button className="btn-mana" onClick={()=>setShowAddSub(true)} style={{ width:'100%', marginTop:4 }}>+ ADD SUBJECT</button>
          </>
        )}
        {tab==='skills' && (
          <>
            {Object.entries(state.skills).length === 0 && (
              <div style={{ textAlign:'center', padding:32, color:'var(--text-dim)', fontSize:13 }}>
                No skills tracked yet.<br/>Add a skill to begin training.
              </div>
            )}
            {Object.entries(state.skills).map(([name,sk])=>(
              <div key={name} className="panel" style={{ padding:16, marginBottom:10 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                  <div>
                    <div className="cinzel" style={{ fontSize:14, color:'var(--text)' }}>{name}</div>
                    <div style={{ fontSize:11, color:'var(--violet)' }}>{sk.category} — {SKILL_LEVELS[Math.min(10,sk.level)]}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:11, color:'var(--text-dim)' }}>Lv.{sk.level} | {sk.practiced}x</div>
                    <button className="btn-mana" style={{ fontSize:10, padding:'4px 10px', marginTop:4 }} onClick={()=>setShowLogSkill(name)}>PRACTICE</button>
                  </div>
                </div>
                <XPBar current={sk.xp} needed={(sk.level+1)*300}/>
              </div>
            ))}
            <button className="btn-mana" onClick={()=>setShowAddSkill(true)} style={{ width:'100%', marginTop:4 }}>+ ADD SKILL</button>
          </>
        )}
      </div>

      {/* Add Subject */}
      {showAddSub && (
        <div className="modal-overlay" onClick={()=>setShowAddSub(false)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="cinzel" style={{ color:'var(--mana)', fontSize:16, marginBottom:16 }}>NEW SUBJECT</div>
            <input className="input-dark" value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Math, Spanish, Physics..." style={{ marginBottom:16 }}/>
            <div style={{ display:'flex', gap:8 }}>
              <button className="btn-mana" style={{ flex:1 }} onClick={()=>{
                if(!newName.trim()) return;
                dispatch({ type:'ADD_SUBJECT', payload:{name:newName.trim()} });
                setNewName(''); setShowAddSub(false);
              }}>ADD</button>
              <button className="btn-danger" onClick={()=>setShowAddSub(false)}>CANCEL</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Skill */}
      {showAddSkill && (
        <div className="modal-overlay" onClick={()=>setShowAddSkill(false)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="cinzel" style={{ color:'var(--mana)', fontSize:16, marginBottom:16 }}>NEW SKILL</div>
            <input className="input-dark" value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Piano, Chess, Drawing..." style={{ marginBottom:12 }}/>
            <select className="input-dark" value={newCategory} onChange={e=>setNewCategory(e.target.value)} style={{ marginBottom:16 }}>
              {['Creative','Technical','Physical','Social','Cognitive'].map(c=><option key={c}>{c}</option>)}
            </select>
            <div style={{ display:'flex', gap:8 }}>
              <button className="btn-mana" style={{ flex:1 }} onClick={()=>{
                if(!newName.trim()) return;
                dispatch({ type:'ADD_SKILL', payload:{name:newName.trim(), category:newCategory} });
                setNewName(''); setShowAddSkill(false);
              }}>ADD</button>
              <button className="btn-danger" onClick={()=>setShowAddSkill(false)}>CANCEL</button>
            </div>
          </div>
        </div>
      )}

      {/* Log Study */}
      {showLogStudy && (
        <div className="modal-overlay" onClick={()=>setShowLogStudy(null)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="cinzel" style={{ color:'var(--mana)', fontSize:16, marginBottom:16 }}>LOG STUDY — {showLogStudy}</div>
            <div style={{ marginBottom:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'var(--text-dim)', marginBottom:6 }}>
                <span>Duration</span><span style={{ color:'var(--mana)' }}>{studyForm.minutes} min</span>
              </div>
              <input type="range" min={5} max={300} step={5} value={studyForm.minutes} onChange={e=>setStudyForm(p=>({...p,minutes:+e.target.value}))} style={{ width:'100%', accentColor:'var(--mana)' }}/>
            </div>
            <input className="input-dark" placeholder="Notes (optional)..." value={studyForm.notes} onChange={e=>setStudyForm(p=>({...p,notes:e.target.value}))} style={{ marginBottom:16 }}/>
            <div style={{ fontSize:12, color:'var(--gold)', marginBottom:16 }}>+{studyForm.minutes*2} XP earned</div>
            <div style={{ display:'flex', gap:8 }}>
              <button className="btn-gold" style={{ flex:1 }} onClick={()=>logStudy(showLogStudy)}>LOG SESSION</button>
              <button className="btn-danger" onClick={()=>setShowLogStudy(null)}>CANCEL</button>
            </div>
          </div>
        </div>
      )}

      {/* Log Skill */}
      {showLogSkill && (
        <div className="modal-overlay" onClick={()=>setShowLogSkill(null)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="cinzel" style={{ color:'var(--violet)', fontSize:16, marginBottom:16 }}>SKILL PRACTICE — {showLogSkill}</div>
            <div style={{ marginBottom:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'var(--text-dim)', marginBottom:6 }}>
                <span>Duration</span><span style={{ color:'var(--violet)' }}>{skillForm.minutes} min</span>
              </div>
              <input type="range" min={5} max={240} step={5} value={skillForm.minutes} onChange={e=>setSkillForm(p=>({...p,minutes:+e.target.value}))} style={{ width:'100%', accentColor:'var(--violet)' }}/>
            </div>
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:12, color:'var(--text-dim)', marginBottom:8 }}>Self Rating: {'⭐'.repeat(skillForm.rating)}</div>
              <div style={{ display:'flex', gap:6 }}>
                {[1,2,3,4,5].map(r=>(
                  <button key={r} onClick={()=>setSkillForm(p=>({...p,rating:r}))} style={{
                    flex:1, padding:'8px', fontSize:14, borderRadius:4, cursor:'pointer',
                    border: skillForm.rating>=r ? '1px solid var(--gold)' : '1px solid var(--border)',
                    background: skillForm.rating>=r ? 'rgba(243,156,18,0.2)' : 'rgba(10,10,20,0.6)', color:'var(--gold)'
                  }}>⭐</button>
                ))}
              </div>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button className="btn-mana" style={{ flex:1 }} onClick={()=>logSkill(showLogSkill)}>PRACTICE COMPLETE</button>
              <button className="btn-danger" onClick={()=>setShowLogSkill(null)}>CANCEL</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HABITS SCREEN
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_HABITS = [
  {name:'Drink 2L water', category:'Lifestyle', xpPerCompletion:25, icon:'💧'},
  {name:'Meditate 10 min', category:'Mental', xpPerCompletion:40, icon:'🧘'},
  {name:'Read 20 pages', category:'Mental', xpPerCompletion:35, icon:'📖'},
  {name:'10,000 steps', category:'Physical', xpPerCompletion:50, icon:'🚶'},
  {name:'Sleep 8 hours', category:'Lifestyle', xpPerCompletion:60, icon:'😴'},
  {name:'No social media', category:'Mental', xpPerCompletion:45, icon:'🚫'},
  {name:'Cold shower', category:'Physical', xpPerCompletion:50, icon:'🧊'},
];
const HABIT_COLORS = { Physical:'var(--mana)', Mental:'var(--violet)', Lifestyle:'#2ECC71', Custom:'var(--gold)' };

function HabitsScreen({ state, dispatch, addXP, showNotif }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newHabit, setNewHabit] = useState({ name:'', category:'Physical', xpPerCompletion:30, icon:'⚡', frequency:'daily' });
  const today = todayStr();

  const completeHabit = (h) => {
    if (h.completedDates.includes(today)) return;
    dispatch({ type:'COMPLETE_HABIT', payload:h.id });
    const streakBonus = Math.min(3, 1 + h.streak*0.1);
    const xp = Math.round(h.xpPerCompletion * streakBonus);
    addXP(xp, 'habit');
    dispatch({ type:'GAIN_STAT', payload:{ stat:'discipline', amount:1 } });
    showNotif(`🔥 STREAK: ${h.streak+1}`);
  };

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column' }}>
      <div style={{ padding:'12px 16px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
          <div className="cinzel" style={{ fontSize:18, color:'var(--mana)', letterSpacing:3 }}>SHADOW ARMY</div>
          <div style={{ fontSize:11, color:'var(--text-dim)' }}>
            {state.habits.filter(h=>h.completedDates.includes(today)).length}/{state.habits.length} today
          </div>
        </div>
      </div>

      <div className="scrollable" style={{ flex:1, padding:'0 16px 16px' }}>
        {state.habits.length === 0 && (
          <div style={{ textAlign:'center', padding:24, color:'var(--text-dim)', fontSize:13 }}>
            <div style={{ marginBottom:16 }}>No habits enlisted yet.</div>
            <div style={{ marginBottom:12, fontSize:12 }}>SUGGESTED HABITS:</div>
            {DEFAULT_HABITS.map((h,i)=>(
              <button key={i} onClick={()=>{ dispatch({ type:'ADD_HABIT', payload:h }); }} style={{
                display:'flex', alignItems:'center', gap:8, width:'100%', padding:'10px 14px', marginBottom:8,
                background:'rgba(10,10,20,0.6)', border:'1px solid var(--border)', borderRadius:8, cursor:'pointer',
                color:'var(--text)', fontSize:13, textAlign:'left'
              }}>
                <span>{h.icon}</span><span>{h.name}</span>
                <span style={{ marginLeft:'auto', color:'var(--gold)', fontSize:11 }}>+{h.xpPerCompletion} XP</span>
              </button>
            ))}
          </div>
        )}
        {state.habits.map(h=>{
          const done = h.completedDates.includes(today);
          const color = HABIT_COLORS[h.category] || 'var(--gold)';
          return (
            <div key={h.id} className="panel" style={{
              padding:14, marginBottom:10,
              borderColor: done ? 'rgba(79,195,247,0.1)' : `${color}44`,
              background: done ? 'rgba(5,5,15,0.5)' : 'var(--card)',
              transition:'all 0.3s'
            }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <button onClick={()=>completeHabit(h)} style={{
                  width:36, height:36, borderRadius:8, flexShrink:0, cursor: done?'default':'pointer',
                  border: done ? 'none' : `1px solid ${color}`,
                  background: done ? color : 'transparent',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  boxShadow: done ? `0 0 15px ${color}88` : 'none',
                  transition:'all 0.3s', fontSize:16
                }}>
                  {done ? <Check size={18} color="#000"/> : (h.icon||'⚡')}
                </button>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, color: done ? 'var(--text-dim)' : 'var(--text)', fontWeight:done?'normal':'600' }}>{h.name}</div>
                  <div style={{ display:'flex', gap:12, marginTop:3 }}>
                    <span style={{ fontSize:10, color }}>● {h.category}</span>
                    <span style={{ fontSize:10, color:'var(--text-dim)' }}>{h.frequency}</span>
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:12, color:'var(--gold)' }}>+{h.xpPerCompletion}</div>
                  <div style={{ display:'flex', alignItems:'center', gap:3, marginTop:3 }}>
                    <span className={h.streak>0&&!done?'':'anim-streak'} style={{ fontSize:13 }}>🔥</span>
                    <span className="cinzel" style={{ fontSize:13, color: h.streak>0?'var(--gold)':'var(--text-dim)' }}>{h.streak}</span>
                  </div>
                  <div style={{ fontSize:9, color:'var(--text-dim)' }}>best: {h.longestStreak}</div>
                </div>
                <button onClick={()=>dispatch({ type:'DELETE_HABIT', payload:h.id })} style={{
                  background:'none', border:'none', cursor:'pointer', color:'var(--crimson)', opacity:0.4, padding:'4px'
                }}><Trash2 size={12}/></button>
              </div>
            </div>
          );
        })}
        <button className="btn-mana" onClick={()=>setShowAdd(true)} style={{ width:'100%', marginTop:4 }}>+ ENLIST NEW HABIT</button>
      </div>

      {showAdd && (
        <div className="modal-overlay" onClick={()=>setShowAdd(false)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="cinzel" style={{ color:'var(--mana)', fontSize:16, marginBottom:16 }}>NEW HABIT CONTRACT</div>
            {[{k:'name',label:'Habit Name',ph:'Wake up at 5AM...'},{k:'icon',label:'Icon (emoji)',ph:'⚡'}].map(f=>(
              <div key={f.k} style={{ marginBottom:12 }}>
                <label style={{ fontSize:11, color:'var(--text-dim)', display:'block', marginBottom:6 }}>{f.label}</label>
                <input className="input-dark" value={newHabit[f.k]} onChange={e=>setNewHabit(p=>({...p,[f.k]:e.target.value}))} placeholder={f.ph}/>
              </div>
            ))}
            <div style={{ marginBottom:12 }}>
              <label style={{ fontSize:11, color:'var(--text-dim)', display:'block', marginBottom:6 }}>CATEGORY</label>
              <select className="input-dark" value={newHabit.category} onChange={e=>setNewHabit(p=>({...p,category:e.target.value}))}>
                {['Physical','Mental','Lifestyle','Custom'].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ marginBottom:16 }}>
                <label style={{ fontSize:11, color:'var(--text-dim)', display:'block', marginBottom:6 }}>XP PER COMPLETION (any amount)</label>
                <input className="input-dark" type="number" min={1} value={newHabit.xpPerCompletion}
                  onChange={e=>setNewHabit(p=>({...p,xpPerCompletion:Math.max(1,+e.target.value||1)}))}
                  placeholder="Enter XP reward..."/>
                <div style={{ fontSize:10, color:'var(--text-dim)', marginTop:4 }}>No limit — set any XP value you feel is fair</div>
              </div>
            <div style={{ display:'flex', gap:8 }}>
              <button className="btn-mana" style={{ flex:1 }} onClick={()=>{
                if(!newHabit.name) return;
                dispatch({ type:'ADD_HABIT', payload:newHabit });
                setNewHabit({ name:'', category:'Physical', xpPerCompletion:30, icon:'⚡', frequency:'daily' });
                setShowAdd(false);
              }}>ENLIST HABIT</button>
              <button className="btn-danger" onClick={()=>setShowAdd(false)}>CANCEL</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROUTINE SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function RoutineScreen({ state, dispatch, addXP, showNotif }) {
  const [which, setWhich] = useState('morning');
  const [running, setRunning] = useState(false);
  const [runIdx, setRunIdx] = useState(0);
  const [timer, setTimer] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [newTask, setNewTask] = useState({ name:'', duration:5, category:'General', icon:'⚡', xp:50 });
  const [routineXP, setRoutineXP] = useState(150);
  const intervalRef = useRef(null);

  const routine = state.routines[which];

  const startRoutine = () => { setRunning(true); setRunIdx(0); setTimer(routine[0]?.duration * 60 || 300); };
  const stopRoutine = () => { setRunning(false); clearInterval(intervalRef.current); };

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimer(t => {
          if (t <= 1) {
            if (runIdx < routine.length-1) {
              setRunIdx(i => i+1);
              return routine[runIdx+1]?.duration * 60 || 300;
            } else {
              clearInterval(intervalRef.current);
              setRunning(false);
              addXP(routineXP, 'routine');
              showNotif(`ROUTINE CLEARED! +${routineXP} XP`);
              return 0;
            }
          }
          return t-1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, runIdx]);

  const fmt = (s) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  if (running && routine[runIdx]) {
    const task = routine[runIdx];
    return (
      <div style={{ height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24 }}>
        <div style={{ fontSize:13, color:'var(--text-dim)', letterSpacing:3, marginBottom:8 }}>STEP {runIdx+1}/{routine.length}</div>
        <div style={{ fontSize:28, color:'var(--mana)', marginBottom:12 }}>{task.icon||'⚡'}</div>
        <div className="cinzel" style={{ fontSize:22, color:'var(--text)', marginBottom:24, textAlign:'center' }}>{task.name}</div>
        <div className="cinzel anim-mana-glow" style={{
          fontSize:72, fontWeight:900, color:'var(--mana)', padding:'24px 48px',
          border:'2px solid var(--mana)', borderRadius:16, marginBottom:32
        }}>{fmt(timer)}</div>
        <div style={{ fontSize:12, color:'var(--text-dim)' }}>{task.duration} min allocated</div>
        <button className="btn-danger" onClick={stopRoutine} style={{ marginTop:32 }}>ABORT ROUTINE</button>
      </div>
    );
  }

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column' }}>
      <div style={{ padding:'12px 16px' }}>
        <div className="cinzel" style={{ fontSize:18, color:'var(--mana)', letterSpacing:3, marginBottom:12 }}>DAILY PROTOCOL</div>
        <div style={{ display:'flex', gap:8, marginBottom:12 }}>
          {['morning','evening'].map(r=>(
            <button key={r} onClick={()=>setWhich(r)} style={{
              flex:1, padding:'8px', fontSize:12, borderRadius:6, cursor:'pointer',
              border: which===r ? '1px solid var(--mana)' : '1px solid var(--border)',
              background: which===r ? 'rgba(79,195,247,0.15)' : 'rgba(10,10,20,0.6)',
              color: which===r ? 'var(--mana)' : 'var(--text-dim)', fontFamily:'Cinzel,serif'
            }}>{r==='morning'?'🌅 MORNING':'🌙 EVENING'}</button>
          ))}
        </div>
      </div>

      <div className="scrollable" style={{ flex:1, padding:'0 16px 16px' }}>
        {routine.length === 0 && (
          <div style={{ textAlign:'center', padding:32, color:'var(--text-dim)', fontSize:13 }}>
            No tasks in {which} routine.<br/>Build your protocol.
          </div>
        )}
        {routine.map((task, i)=>(
          <div key={task.id} className="panel" style={{ padding:12, marginBottom:8 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ fontSize:20, width:32, textAlign:'center' }}>{task.icon||'⚡'}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, color:'var(--text)' }}>{task.name}</div>
                <div style={{ fontSize:11, color:'var(--text-dim)' }}>{task.duration} min · {task.category}</div>
              </div>
              <div style={{ display:'flex', gap:4 }}>
                <button onClick={()=>dispatch({ type:'MOVE_ROUTINE_TASK', payload:{ routine:which, id:task.id, dir:-1 } })} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-dim)', padding:4 }}><ChevronUp size={14}/></button>
                <button onClick={()=>dispatch({ type:'MOVE_ROUTINE_TASK', payload:{ routine:which, id:task.id, dir:1 } })} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-dim)', padding:4 }}><ChevronDown size={14}/></button>
                <button onClick={()=>dispatch({ type:'REMOVE_ROUTINE_TASK', payload:{ routine:which, id:task.id } })} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--crimson)', padding:4, opacity:0.6 }}><X size={14}/></button>
              </div>
            </div>
          </div>
        ))}
        <button className="btn-mana" onClick={()=>setShowAdd(true)} style={{ width:'100%', marginBottom:12 }}>+ ADD TASK</button>
        {routine.length > 0 && (
          <>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
              <label style={{ fontSize:11, color:'var(--text-dim)', whiteSpace:'nowrap' }}>ROUTINE XP REWARD:</label>
              <input className="input-dark" type="number" min={1} value={routineXP}
                onChange={e=>setRoutineXP(Math.max(1,+e.target.value||1))}
                style={{ padding:'6px 10px', fontSize:13 }}/>
            </div>
            <button className="btn-gold" onClick={startRoutine} style={{ width:'100%', padding:'14px', fontSize:14 }}>
              ▶ BEGIN {which.toUpperCase()} ROUTINE
            </button>
          </>
        )}
      </div>

      {showAdd && (
        <div className="modal-overlay" onClick={()=>setShowAdd(false)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="cinzel" style={{ color:'var(--mana)', fontSize:16, marginBottom:16 }}>ADD ROUTINE TASK</div>
            {[{k:'name',label:'Task Name',ph:'Morning walk...'},{k:'icon',label:'Icon',ph:'🌅'}].map(f=>(
              <div key={f.k} style={{ marginBottom:12 }}>
                <label style={{ fontSize:11, color:'var(--text-dim)', display:'block', marginBottom:6 }}>{f.label}</label>
                <input className="input-dark" value={newTask[f.k]} onChange={e=>setNewTask(p=>({...p,[f.k]:e.target.value}))} placeholder={f.ph}/>
              </div>
            ))}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:16 }}>
              <div>
                <label style={{ fontSize:11, color:'var(--text-dim)', display:'block', marginBottom:6 }}>DURATION (min)</label>
                <input className="input-dark" type="number" min={1} value={newTask.duration}
                  onChange={e=>setNewTask(p=>({...p,duration:Math.max(1,+e.target.value||1)}))}
                  style={{ padding:'8px 10px' }}/>
              </div>
              <div>
                <label style={{ fontSize:11, color:'var(--text-dim)', display:'block', marginBottom:6 }}>XP REWARD</label>
                <input className="input-dark" type="number" min={1} value={newTask.xp||50}
                  onChange={e=>setNewTask(p=>({...p,xp:Math.max(1,+e.target.value||1)}))}
                  style={{ padding:'8px 10px' }}/>
              </div>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button className="btn-mana" style={{ flex:1 }} onClick={()=>{
                if(!newTask.name) return;
                dispatch({ type:'ADD_ROUTINE_TASK', payload:{ routine:which, task:newTask } });
                setNewTask({ name:'', duration:5, category:'General', icon:'⚡', xp:50 });
                setShowAdd(false);
              }}>ADD TASK</button>
              <button className="btn-danger" onClick={()=>setShowAdd(false)}>CANCEL</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN TIME
// ─────────────────────────────────────────────────────────────────────────────
function ScreenTimeScreen({ state, dispatch, addXP }) {
  const [showLog, setShowLog] = useState(false);
  const [form, setForm] = useState({ app:'', category:'Social Media', minutes:30, intentional:true });
  const today = todayStr();
  const st = state.screenTime;
  const todayUsage = st.lastDate===today ? st.todayUsage : 0;
  const pct = Math.min(100, (todayUsage / st.dailyLimit) * 100);
  const over = todayUsage > st.dailyLimit;

  const logSession = () => {
    dispatch({ type:'LOG_SCREEN_SESSION', payload:{ ...form } });
    if (!over && todayUsage + form.minutes <= st.dailyLimit) addXP(10, 'focus');
    else if (over) dispatch({ type:'GAIN_STAT', payload:{ stat:'focus', amount:-1 } });
    setShowLog(false);
    setForm({ app:'', category:'Social Media', minutes:30, intentional:true });
  };

  const CATS = ['Social Media','Entertainment','Gaming','Productivity','Study'];

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column' }}>
      <div style={{ padding:'12px 16px' }}>
        <div className="cinzel" style={{ fontSize:18, color:'var(--mana)', letterSpacing:3, marginBottom:16 }}>DIGITAL DISCIPLINE GATE</div>
      </div>

      <div className="scrollable" style={{ flex:1, padding:'0 16px 16px' }}>
        {/* Mana Bar */}
        <div className="panel" style={{ padding:20, marginBottom:12, borderColor: over ? 'rgba(231,76,60,0.4)' : 'var(--border)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
            <div className="cinzel" style={{ fontSize:13, color:'var(--text-dim)', letterSpacing:2 }}>MANA RESERVES</div>
            <div className="cinzel" style={{ fontSize:16, color: over ? 'var(--crimson)' : 'var(--mana)' }}>
              {todayUsage}m / {st.dailyLimit}m
            </div>
          </div>
          <div style={{ height:20, background:'rgba(79,195,247,0.08)', border:'1px solid rgba(79,195,247,0.2)', borderRadius:10, overflow:'hidden', position:'relative' }}>
            <div style={{
              height:'100%', width:`${pct}%`, borderRadius:10, transition:'width 0.8s ease-out',
              background: over ? 'linear-gradient(90deg, #E74C3C, #FF6B6B)' : 'linear-gradient(90deg, #1565C0, var(--mana), #80DEEA)',
              boxShadow: over ? '0 0 15px #E74C3C' : '0 0 10px rgba(79,195,247,0.6)'
            }}/>
          </div>
          {over && (
            <div className="cinzel" style={{ textAlign:'center', color:'var(--crimson)', marginTop:12, fontSize:13, letterSpacing:2, animation:'manaGlow 1s ease-in-out infinite' }}>
              ⚠ DIGITAL GATE CLOSED — LIMIT REACHED
            </div>
          )}
          {!over && (
            <div style={{ textAlign:'center', color:'var(--text-dim)', marginTop:10, fontSize:11 }}>
              {st.dailyLimit - todayUsage} min remaining today
            </div>
          )}
        </div>

        {/* Limit Setting */}
        <div className="panel" style={{ padding:16, marginBottom:12 }}>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'var(--text-dim)', marginBottom:8 }}>
            <span>Daily Limit</span><span style={{ color:'var(--mana)' }}>{st.dailyLimit} min</span>
          </div>
          <input type="range" min={30} max={480} step={30} value={st.dailyLimit}
            onChange={e=>dispatch({ type:'SET_SCREEN_LIMIT', payload:+e.target.value })}
            style={{ width:'100%', accentColor:'var(--mana)' }}/>
        </div>

        {/* Sessions today */}
        <div className="panel" style={{ padding:16, marginBottom:12 }}>
          <div className="cinzel" style={{ fontSize:11, color:'var(--text-dim)', letterSpacing:2, marginBottom:12 }}>TODAY'S SESSIONS</div>
          {st.sessions.filter(s=>new Date(s.date).toISOString().slice(0,10)===today).length === 0 && (
            <div style={{ color:'var(--text-dim)', fontSize:12, textAlign:'center', padding:'12px 0' }}>No sessions logged today.</div>
          )}
          {st.sessions.filter(s=>new Date(s.date).toISOString().slice(0,10)===today).map(s=>(
            <div key={s.id} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--border)', fontSize:12 }}>
              <div>
                <span style={{ color:'var(--text)' }}>{s.app}</span>
                <span style={{ color:'var(--text-dim)', marginLeft:8 }}>{s.category}</span>
              </div>
              <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                <span style={{ color: s.intentional ? 'var(--mana)' : 'var(--crimson)' }}>{s.intentional ? '✓' : '✗'}</span>
                <span style={{ color:'var(--gold)' }}>{s.minutes}m</span>
              </div>
            </div>
          ))}
        </div>

        <button className="btn-mana" onClick={()=>setShowLog(true)} style={{ width:'100%' }}>+ LOG SESSION</button>
      </div>

      {showLog && (
        <div className="modal-overlay" onClick={()=>setShowLog(false)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="cinzel" style={{ color:'var(--mana)', fontSize:16, marginBottom:16 }}>LOG SCREEN SESSION</div>
            <div style={{ marginBottom:12 }}>
              <label style={{ fontSize:11, color:'var(--text-dim)', display:'block', marginBottom:6 }}>APP / PLATFORM</label>
              <input className="input-dark" value={form.app} onChange={e=>setForm(p=>({...p,app:e.target.value}))} placeholder="Instagram, YouTube..."/>
            </div>
            <div style={{ marginBottom:12 }}>
              <label style={{ fontSize:11, color:'var(--text-dim)', display:'block', marginBottom:6 }}>CATEGORY</label>
              <select className="input-dark" value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))}>
                {CATS.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ marginBottom:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'var(--text-dim)', marginBottom:6 }}>
                <span>Duration</span><span style={{ color:'var(--mana)' }}>{form.minutes} min</span>
              </div>
              <input type="range" min={5} max={240} step={5} value={form.minutes} onChange={e=>setForm(p=>({...p,minutes:+e.target.value}))} style={{ width:'100%', accentColor:'var(--mana)' }}/>
            </div>
            <div style={{ marginBottom:16, display:'flex', alignItems:'center', gap:10 }}>
              <input type="checkbox" checked={form.intentional} onChange={e=>setForm(p=>({...p,intentional:e.target.checked}))} id="intent" style={{ accentColor:'var(--mana)', width:16, height:16 }}/>
              <label htmlFor="intent" style={{ fontSize:12, color:'var(--text-dim)', cursor:'pointer' }}>Was this intentional use?</label>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button className="btn-mana" style={{ flex:1 }} onClick={logSession}>LOG SESSION</button>
              <button className="btn-danger" onClick={()=>setShowLog(false)}>CANCEL</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// JOURNAL SCREEN
// ─────────────────────────────────────────────────────────────────────────────
const JOURNAL_PROMPTS = [
  "What enemy did you defeat today?",
  "What would your future self think of today?",
  "What gate will you clear tomorrow?",
  "Rate today: Mind / Body / Spirit (1-10)",
  "What is your biggest bottleneck right now?",
  "Who did you become today?"
];
const MOODS = ['💀','😔','😐','💪','👑'];
const TAGS = ['Reflection','Goals','Gratitude','Battle Log','Shadow Talk'];

function JournalScreen({ state, dispatch, addXP }) {
  const [view, setView] = useState('write');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState(2);
  const [tag, setTag] = useState('Reflection');
  const [prompt, setPrompt] = useState(null);
  const [search, setSearch] = useState('');

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const xpEarned = Math.min(100, Math.floor(wordCount/10)*10);

  const submitEntry = () => {
    if (!content.trim()) return;
    dispatch({ type:'ADD_JOURNAL', payload:{ content, mood, tag, wordCount } });
    addXP(xpEarned, 'journal');
    dispatch({ type:'GAIN_STAT', payload:{ stat:'charisma', amount:1 } });
    dispatch({ type:'COMPLETE_DAILY_QUEST', payload:'d5' });
    setContent(''); setMood(2); setTag('Reflection'); setPrompt(null);
    setView('history');
  };

  const filtered = state.journal.filter(e =>
    !search || e.content.toLowerCase().includes(search.toLowerCase()) || e.tag?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column' }}>
      <div style={{ padding:'12px 16px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
          <div className="cinzel" style={{ fontSize:18, color:'var(--mana)', letterSpacing:3 }}>SHADOW ARCHIVE</div>
          <div style={{ display:'flex', gap:6 }}>
            {['write','history'].map(v=>(
              <button key={v} onClick={()=>setView(v)} style={{
                padding:'6px 12px', fontSize:11, borderRadius:6, cursor:'pointer',
                border: view===v ? '1px solid var(--mana)' : '1px solid var(--border)',
                background: view===v ? 'rgba(79,195,247,0.15)' : 'rgba(10,10,20,0.6)',
                color: view===v ? 'var(--mana)' : 'var(--text-dim)', fontFamily:'Cinzel,serif'
              }}>{v==='write'?'✍ WRITE':'📜 ARCHIVE'}</button>
            ))}
          </div>
        </div>
      </div>

      {view==='write' && (
        <div style={{ flex:1, padding:'0 16px 16px', display:'flex', flexDirection:'column', gap:12, overflow:'hidden' }}>
          {/* Prompt */}
          <div className="panel" style={{ padding:12, cursor:'pointer', borderColor:'rgba(155,89,182,0.3)' }}
            onClick={()=>setPrompt(JOURNAL_PROMPTS[Math.floor(Math.random()*JOURNAL_PROMPTS.length)])}>
            <div style={{ fontSize:11, color:'var(--violet)', letterSpacing:2, marginBottom:4 }}>SYSTEM PROMPT</div>
            <div style={{ fontSize:13, color:'var(--text)', lineHeight:1.5, fontStyle:'italic' }}>
              {prompt || '"Click to receive a prompt from the System."'}
            </div>
          </div>
          {/* Editor */}
          <textarea className="input-dark scrollable" value={content} onChange={e=>setContent(e.target.value)}
            placeholder="The archive awaits your thoughts, Hunter..."
            style={{ flex:1, padding:16, fontSize:14, lineHeight:1.8, minHeight:180 }}/>
          {/* Controls */}
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            <div>
              <div style={{ fontSize:10, color:'var(--text-dim)', marginBottom:6 }}>MOOD</div>
              <div style={{ display:'flex', gap:6 }}>
                {MOODS.map((m,i)=>(
                  <button key={i} onClick={()=>setMood(i)} style={{
                    width:32, height:32, fontSize:16, borderRadius:6, cursor:'pointer',
                    border: mood===i ? '1px solid var(--mana)' : '1px solid var(--border)',
                    background: mood===i ? 'rgba(79,195,247,0.2)' : 'rgba(10,10,20,0.6)'
                  }}>{m}</button>
                ))}
              </div>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:10, color:'var(--text-dim)', marginBottom:6 }}>TAG</div>
              <select className="input-dark" value={tag} onChange={e=>setTag(e.target.value)} style={{ padding:'7px 10px' }}>
                {TAGS.map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ fontSize:11, color:'var(--text-dim)' }}>{wordCount} words · +{xpEarned} XP</div>
            <button className="btn-mana" onClick={submitEntry} disabled={!content.trim()} style={{ opacity:content.trim()?1:0.4 }}>
              ARCHIVE ENTRY ⚡
            </button>
          </div>
        </div>
      )}

      {view==='history' && (
        <div style={{ flex:1, padding:'0 16px 16px', display:'flex', flexDirection:'column', gap:8, overflow:'hidden' }}>
          <input className="input-dark" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search entries..."/>
          <div className="scrollable" style={{ flex:1 }}>
            {filtered.length === 0 && (
              <div style={{ textAlign:'center', padding:32, color:'var(--text-dim)' }}>No entries yet. Begin your archive.</div>
            )}
            {filtered.map(e=>(
              <div key={e.id} className="panel" style={{ padding:14, marginBottom:10 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                  <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                    <span style={{ fontSize:18 }}>{MOODS[e.mood]||'😐'}</span>
                    <span style={{ fontSize:11, color:'var(--violet)', background:'rgba(155,89,182,0.15)', padding:'2px 8px', borderRadius:4 }}>{e.tag}</span>
                  </div>
                  <div style={{ fontSize:11, color:'var(--text-dim)' }}>{new Date(e.date).toLocaleDateString()}</div>
                </div>
                <div style={{ fontSize:13, color:'var(--text)', lineHeight:1.6 }}>
                  {e.content.length > 200 ? e.content.slice(0,200)+'...' : e.content}
                </div>
                <div style={{ fontSize:10, color:'var(--text-dim)', marginTop:8 }}>{e.wordCount} words</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REWARDS SCREEN
// ─────────────────────────────────────────────────────────────────────────────
const REWARDS_CATALOG = [
  // TITLES
  { id:'title_phantom',   type:'Title',  name:'The Phantom',       desc:'A ghost that the weak cannot see.',    cost:50,  minRank:'D', icon:'👻', category:'Titles' },
  { id:'title_forsaken',  type:'Title',  name:'The Forsaken',      desc:'Abandoned by fate. Chosen by will.',   cost:80,  minRank:'C', icon:'💀', category:'Titles' },
  { id:'title_apex',      type:'Title',  name:'Apex Predator',     desc:'Top of the food chain.',               cost:150, minRank:'B', icon:'🦅', category:'Titles' },
  { id:'title_sovereign', type:'Title',  name:'Sovereign',         desc:'Commands without speaking.',           cost:300, minRank:'A', icon:'👑', category:'Titles' },
  { id:'title_void',      type:'Title',  name:'Ruler of the Void', desc:'Beyond the edge of reality.',          cost:600, minRank:'S', icon:'🌑', category:'Titles' },
  { id:'title_eternal',   type:'Title',  name:'The Eternal',       desc:'Death has no claim here.',             cost:999, minRank:'MONARCH', icon:'♾️', category:'Titles' },

  // STAT BOOSTS
  { id:'boost_str',  type:'StatBoost', name:'Iron Flesh',       desc:'+5 permanent STR',  cost:100, minRank:'D', icon:'💪', category:'Boosts', stat:'strength',     amount:5 },
  { id:'boost_int',  type:'StatBoost', name:'Mind Expansion',   desc:'+5 permanent INT',  cost:100, minRank:'D', icon:'🧠', category:'Boosts', stat:'intelligence', amount:5 },
  { id:'boost_dis',  type:'StatBoost', name:'Iron Resolve',     desc:'+5 permanent DIS',  cost:100, minRank:'D', icon:'🎯', category:'Boosts', stat:'discipline',   amount:5 },
  { id:'boost_vit',  type:'StatBoost', name:'Eternal Body',     desc:'+5 permanent VIT',  cost:120, minRank:'C', icon:'❤️', category:'Boosts', stat:'vitality',     amount:5 },
  { id:'boost_foc',  type:'StatBoost', name:'Laser Focus',      desc:'+5 permanent FOC',  cost:120, minRank:'C', icon:'⚡', category:'Boosts', stat:'focus',        amount:5 },
  { id:'boost_cha',  type:'StatBoost', name:'Shadow Presence',  desc:'+5 permanent CHA',  cost:120, minRank:'C', icon:'🌟', category:'Boosts', stat:'charisma',     amount:5 },
  { id:'boost_all',  type:'StatBoost', name:'Monarch\'s Blessing',desc:'+10 ALL STATS',   cost:800, minRank:'S', icon:'♛',  category:'Boosts', stat:'all',          amount:10 },

  // BADGES
  { id:'badge_gate',    type:'Badge', name:'Gate Breaker',      desc:'You enter what others fear.',         cost:60,  minRank:'D', icon:'🚪', category:'Badges' },
  { id:'badge_shadow',  type:'Badge', name:'Shadow Walker',     desc:'Moving unseen through the world.',    cost:120, minRank:'C', icon:'🌒', category:'Badges' },
  { id:'badge_dragon',  type:'Badge', name:'Dragon Slayer',     desc:'Defeated the impossible.',            cost:250, minRank:'B', icon:'🐉', category:'Badges' },
  { id:'badge_abyss',   type:'Badge', name:'Abyss Born',        desc:'The darkness chose you first.',       cost:500, minRank:'A', icon:'🔮', category:'Badges' },
  { id:'badge_monarch', type:'Badge', name:'♛ Shadow Crown',   desc:'Reserved for the Monarch alone.',     cost:1000,minRank:'MONARCH', icon:'♛', category:'Badges' },

  // XP BOOSTS (temporary)
  { id:'xp_boost_1', type:'XPBoost', name:'Mana Surge I',    desc:'+500 instant XP',   cost:20,  minRank:'E', icon:'⚡', category:'XP Boosts', xpGrant:500  },
  { id:'xp_boost_2', type:'XPBoost', name:'Mana Surge II',   desc:'+2000 instant XP',  cost:60,  minRank:'C', icon:'💥', category:'XP Boosts', xpGrant:2000 },
  { id:'xp_boost_3', type:'XPBoost', name:'Mana Cascade',    desc:'+10000 instant XP', cost:200, minRank:'A', icon:'🌊', category:'XP Boosts', xpGrant:10000},
];

const RANK_ORDER = ['E','D','C','B','A','S','MONARCH'];
function rankGte(a, b) { return RANK_ORDER.indexOf(a) >= RANK_ORDER.indexOf(b); }

function RewardsScreen({ state, dispatch, addXP, showNotif }) {
  const [cat, setCat] = useState('Titles');
  const [confirmItem, setConfirmItem] = useState(null);
  const [justBought, setJustBought] = useState(null);
  const [showCreateReward, setShowCreateReward] = useState(false);
  const [newReward, setNewReward] = useState({ name:'', emoji:'🎁', desc:'', type:'real' });
  const owned = state.ownedRewards || [];
  const coins = state.hunter.coins || 0;
  const hunterRank = state.hunter.rank;
  const customRewards = state.customRewards || [];

  const CATS = ['Titles','Boosts','Badges','XP Boosts','Custom'];

  const purchase = (item) => {
    if (item.type === 'XPBoost') {
      if (coins < item.cost) return;
      dispatch({ type:'PURCHASE_REWARD', payload:{ id: item.id + '_' + Date.now(), cost: item.cost, item:{ ...item, type:'XPBoost' } } });
      addXP(item.xpGrant, 'reward');
      showNotif(`⚡ +${item.xpGrant} XP ABSORBED`);
      setJustBought(item.id);
      setTimeout(() => setJustBought(null), 2000);
    } else {
      dispatch({ type:'PURCHASE_REWARD', payload:{ id: item.id, cost: item.cost, item } });
      if (item.type === 'StatBoost') {
        if (item.stat === 'all') {
          ['strength','intelligence','discipline','vitality','focus','charisma'].forEach(s =>
            dispatch({ type:'GAIN_STAT', payload:{ stat:s, amount:item.amount } })
          );
        } else {
          dispatch({ type:'GAIN_STAT', payload:{ stat:item.stat, amount:item.amount } });
        }
      }
      if (item.type === 'Title') {
        dispatch({ type:'EQUIP_REWARD', payload:{ type:'Title', value:item.name } });
        showNotif(`♛ TITLE "${item.name.toUpperCase()}" EQUIPPED`);
      } else {
        showNotif(`✦ ${item.name.toUpperCase()} ACQUIRED`);
      }
      setJustBought(item.id);
      setTimeout(() => setJustBought(null), 2000);
    }
    setConfirmItem(null);
  };

  const equipTitle = (item) => { dispatch({ type:'EQUIP_REWARD', payload:{ type:'Title', value:item.name } }); showNotif('✦ TITLE EQUIPPED'); };
  const equipBadge = (item) => { dispatch({ type:'EQUIP_REWARD', payload:{ type:'Badge', value:item.name } }); showNotif('✦ BADGE EQUIPPED'); };
  const filtered = REWARDS_CATALOG.filter(r => r.category === cat);

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column' }}>
      <div style={{ padding:'12px 16px 0' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
          <div className="cinzel" style={{ fontSize:18, color:'var(--mana)', letterSpacing:3 }}>REWARD VAULT</div>
          <div style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 12px', background:'rgba(243,156,18,0.1)', border:'1px solid rgba(243,156,18,0.3)', borderRadius:20 }}>
            <span>🪙</span><span className="cinzel" style={{ fontSize:14, color:'var(--gold)' }}>{coins.toLocaleString()}</span>
            <span style={{ fontSize:10, color:'var(--text-dim)' }}>COINS</span>
          </div>
        </div>
        <div style={{ fontSize:11, color:'var(--text-dim)', marginBottom:12 }}>Earn 1 coin per 50 XP gained. Spend wisely, Hunter.</div>
        <div style={{ display:'flex', gap:6, marginBottom:12, overflowX:'auto', paddingBottom:4 }}>
          {CATS.map(c=>(
            <button key={c} onClick={()=>setCat(c)} style={{ padding:'6px 12px', fontSize:10, borderRadius:6, cursor:'pointer', whiteSpace:'nowrap', border:cat===c?'1px solid var(--mana)':'1px solid var(--border)', background:cat===c?'rgba(79,195,247,0.15)':'rgba(10,10,20,0.6)', color:cat===c?'var(--mana)':'var(--text-dim)', fontFamily:'Cinzel,serif' }}>{c.toUpperCase()}</button>
          ))}
        </div>
      </div>
      <div className="scrollable" style={{ flex:1, padding:'0 16px 16px' }}>
        {cat === 'Custom' && (
          <>
            <div style={{ fontSize:11, color:'var(--text-dim)', marginBottom:12, lineHeight:1.6 }}>Define real-world rewards you can earn by completing quests. Link them to quests in the Quest creation screen.</div>
            <button className="btn-gold" style={{ width:'100%', marginBottom:16 }} onClick={()=>setShowCreateReward(true)}>+ CREATE CUSTOM REWARD</button>
            {customRewards.length === 0 && (
              <div style={{ textAlign:'center', padding:32, color:'var(--text-dim)' }}>
                <div style={{ fontSize:32, marginBottom:12 }}>🎁</div>
                <div className="cinzel" style={{ fontSize:14, marginBottom:8 }}>NO REWARDS YET</div>
                <div style={{ fontSize:12, lineHeight:1.6 }}>Create real-world rewards and link them to quests as motivation.</div>
              </div>
            )}
            {customRewards.map(r => (
              <div key={r.id} className="panel" style={{ padding:16, marginBottom:10, borderColor:'rgba(243,156,18,0.25)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <span style={{ fontSize:32 }}>{r.emoji}</span>
                  <div style={{ flex:1 }}>
                    <div className="cinzel" style={{ fontSize:14, color:'var(--gold)', marginBottom:2 }}>{r.name}</div>
                    {r.desc && <div style={{ fontSize:12, color:'var(--text-dim)' }}>{r.desc}</div>}
                    <div style={{ fontSize:10, color:'var(--text-dim)', marginTop:4 }}>{r.type==='real'?'🌍 Real-world':'🎮 Virtual'}</div>
                  </div>
                  <button onClick={()=>dispatch({ type:'DELETE_CUSTOM_REWARD', payload:r.id })} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--crimson)', opacity:0.6, padding:8 }}><Trash2 size={14}/></button>
                </div>
              </div>
            ))}
          </>
        )}
        {cat !== 'Custom' && filtered.map(item => {
          const isOwned = item.type !== 'XPBoost' && owned.includes(item.id);
          const canAfford = coins >= item.cost;
          const rankOk = rankGte(hunterRank, item.minRank);
          const locked = !rankOk;
          const isEquippedTitle = state.hunter.equippedTitle === item.name;
          const isEquippedBadge = state.hunter.equippedBadge === item.name;
          const justGot = justBought === item.id;
          return (
            <div key={item.id} className="panel" style={{ padding:16, marginBottom:10, borderColor:isOwned?'rgba(79,195,247,0.3)':locked?'rgba(255,255,255,0.05)':'var(--border)', opacity:locked?0.45:1, transition:'all 0.3s', boxShadow:justGot?'0 0 30px rgba(243,156,18,0.5)':'none', position:'relative', overflow:'hidden' }}>
              {justGot && <div style={{ position:'absolute', inset:0, background:'linear-gradient(90deg,transparent,rgba(243,156,18,0.15),transparent)', animation:'shimmer 0.8s ease-out' }}/>}
              <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
                <div style={{ width:48, height:48, flexShrink:0, borderRadius:10, fontSize:24, display:'flex', alignItems:'center', justifyContent:'center', background:isOwned?'rgba(79,195,247,0.1)':'rgba(255,255,255,0.04)', border:isOwned?'1px solid rgba(79,195,247,0.3)':'1px solid rgba(255,255,255,0.08)' }}>{item.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3, flexWrap:'wrap' }}>
                    <span className="cinzel" style={{ fontSize:13, color:isOwned?'var(--mana)':'var(--text)' }}>{item.name}</span>
                    {isOwned && <span style={{ fontSize:9, color:'var(--mana)', border:'1px solid var(--mana)', padding:'1px 5px', borderRadius:3 }}>OWNED</span>}
                    {locked && <span style={{ fontSize:9, color:'var(--crimson)', border:'1px solid var(--crimson)', padding:'1px 5px', borderRadius:3 }}>{item.minRank}-RANK</span>}
                    {(isEquippedTitle||isEquippedBadge) && <span style={{ fontSize:9, color:'var(--gold)', border:'1px solid var(--gold)', padding:'1px 5px', borderRadius:3 }}>EQUIPPED</span>}
                  </div>
                  <div style={{ fontSize:12, color:'var(--text-dim)', marginBottom:8, lineHeight:1.4 }}>{item.desc}</div>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}><span>🪙</span><span className="cinzel" style={{ fontSize:13, color:canAfford?'var(--gold)':'var(--crimson)' }}>{item.cost}</span></div>
                    {isOwned&&item.type==='Title' && <button className={isEquippedTitle?'btn-gold':'btn-mana'} style={{ fontSize:10, padding:'5px 12px' }} onClick={()=>equipTitle(item)}>{isEquippedTitle?'✓ EQUIPPED':'EQUIP'}</button>}
                    {isOwned&&item.type==='Badge' && <button className={isEquippedBadge?'btn-gold':'btn-mana'} style={{ fontSize:10, padding:'5px 12px' }} onClick={()=>equipBadge(item)}>{isEquippedBadge?'✓ EQUIPPED':'EQUIP'}</button>}
                    {isOwned&&item.type==='StatBoost' && <span style={{ fontSize:11, color:'var(--mana)' }}>✓ Applied</span>}
                    {(!isOwned||item.type==='XPBoost')&&!locked && <button onClick={()=>setConfirmItem(item)} disabled={!canAfford} style={{ fontSize:10, padding:'5px 14px', borderRadius:6, cursor:canAfford?'pointer':'not-allowed', border:`1px solid ${canAfford?'var(--gold)':'rgba(100,100,100,0.3)'}`, background:canAfford?'rgba(243,156,18,0.15)':'rgba(10,10,20,0.6)', color:canAfford?'var(--gold)':'var(--text-dim)', fontFamily:'Cinzel,serif', opacity:canAfford?1:0.5 }}>{canAfford?'PURCHASE':'INSUFFICIENT'}</button>}
                    {locked && <span style={{ fontSize:10, color:'var(--text-dim)' }}>Unlock at {item.minRank}-Rank</span>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {showCreateReward && (
        <div className="modal-overlay" onClick={()=>setShowCreateReward(false)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="cinzel" style={{ color:'var(--gold)', fontSize:16, marginBottom:16 }}>CREATE REWARD</div>
            {[{k:'name',label:'Reward Name',ph:'Order pizza 🍕'},{k:'emoji',label:'Icon',ph:'🎁'},{k:'desc',label:'Description',ph:'After completing...'}].map(f=>(
              <div key={f.k} style={{ marginBottom:12 }}>
                <label style={{ display:'block', fontSize:11, color:'var(--text-dim)', marginBottom:6 }}>{f.label}</label>
                <input className="input-dark" value={newReward[f.k]} onChange={e=>setNewReward(p=>({...p,[f.k]:e.target.value}))} placeholder={f.ph}/>
              </div>
            ))}
            <div style={{ marginBottom:16 }}>
              <label style={{ display:'block', fontSize:11, color:'var(--text-dim)', marginBottom:8 }}>TYPE</label>
              <div style={{ display:'flex', gap:8 }}>
                {[{v:'real',l:'🌍 Real-world'},{v:'virtual',l:'🎮 Virtual'}].map(t=>(
                  <button key={t.v} onClick={()=>setNewReward(p=>({...p,type:t.v}))} style={{ flex:1, padding:'8px', borderRadius:6, cursor:'pointer', fontSize:12, border:newReward.type===t.v?'1px solid var(--gold)':'1px solid var(--border)', background:newReward.type===t.v?'rgba(243,156,18,0.15)':'transparent', color:newReward.type===t.v?'var(--gold)':'var(--text-dim)' }}>{t.l}</button>
                ))}
              </div>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button className="btn-gold" style={{ flex:1 }} onClick={()=>{ if(!newReward.name)return; dispatch({ type:'ADD_CUSTOM_REWARD', payload:{...newReward} }); setNewReward({name:'',emoji:'🎁',desc:'',type:'real'}); setShowCreateReward(false); showNotif('🎁 REWARD CREATED'); }}>CREATE</button>
              <button className="btn-danger" onClick={()=>setShowCreateReward(false)}>CANCEL</button>
            </div>
          </div>
        </div>
      )}
      {confirmItem && (
        <div className="modal-overlay" onClick={()=>setConfirmItem(null)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()} style={{ textAlign:'center' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>{confirmItem.icon}</div>
            <div className="cinzel" style={{ fontSize:18, color:'var(--gold)', marginBottom:8 }}>{confirmItem.name}</div>
            <div style={{ fontSize:13, color:'var(--text-dim)', marginBottom:20 }}>{confirmItem.desc}</div>
            <div style={{ fontSize:14, color:'var(--text)', marginBottom:24 }}>Cost: <span className="cinzel" style={{ color:'var(--gold)' }}>🪙 {confirmItem.cost}</span> → Remaining: <span className="cinzel" style={{ color:coins-confirmItem.cost>=0?'var(--mana)':'var(--crimson)' }}>🪙 {coins-confirmItem.cost}</span></div>
            <div style={{ display:'flex', gap:10 }}>
              <button className="btn-gold" style={{ flex:1, padding:'12px' }} onClick={()=>purchase(confirmItem)}>CONFIRM PURCHASE</button>
              <button className="btn-danger" onClick={()=>setConfirmItem(null)}>CANCEL</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


function ResetModal({ onConfirm, onCancel }) {
  const [phase, setPhase] = useState('warn'); // 'warn' | 'type' | 'final'
  const [typed, setTyped] = useState('');
  const CONFIRM_WORD = 'ARISE';

  const proceed = () => {
    if (phase === 'warn') { setPhase('type'); return; }
    if (phase === 'type' && typed === CONFIRM_WORD) { setPhase('final'); setTimeout(onConfirm, 2800); }
  };

  return (
    <div style={{
      position:'fixed', inset:0, background:'rgba(0,0,0,0.95)', zIndex:900,
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      backdropFilter:'blur(8px)', padding:24
    }}>
      {phase === 'warn' && (
        <div className="anim-slide-in" style={{ textAlign:'center', maxWidth:400 }}>
          <div style={{ fontSize:48, marginBottom:16 }}>⚠️</div>
          <div className="cinzel" style={{ fontSize:22, color:'var(--crimson)', marginBottom:16, letterSpacing:3 }}>RESET YOUR LIFE</div>
          <div style={{ fontSize:13, color:'var(--text-dim)', lineHeight:1.9, marginBottom:24 }}>
            This will permanently destroy all progress.<br/>
            Every level. Every XP. Every habit streak.<br/>
            Every journal entry. Every muscle trained.<br/><br/>
            <span style={{ color:'var(--crimson)' }}>The System remembers nothing.</span><br/>
            <span style={{ color:'#6a7a9a' }}>Are you certain you want to begin again?</span>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button className="btn-danger" style={{ flex:1, padding:'12px', fontSize:14 }} onClick={proceed}>CONTINUE →</button>
            <button className="btn-mana" style={{ flex:1, padding:'12px' }} onClick={onCancel}>RETREAT</button>
          </div>
        </div>
      )}

      {phase === 'type' && (
        <div className="anim-slide-in" style={{ textAlign:'center', maxWidth:400 }}>
          <div className="cinzel" style={{ fontSize:18, color:'var(--crimson)', marginBottom:24, letterSpacing:4 }}>FINAL CONFIRMATION</div>
          <div style={{ fontSize:13, color:'var(--text-dim)', marginBottom:8 }}>
            Type <span className="cinzel" style={{ color:'var(--crimson)', letterSpacing:4 }}>ARISE</span> to confirm your rebirth.
          </div>
          <input
            className="input-dark" autoFocus
            value={typed} onChange={e=>setTyped(e.target.value.toUpperCase())}
            placeholder="ARISE"
            style={{ textAlign:'center', fontSize:20, letterSpacing:8, marginBottom:20, fontFamily:'Cinzel,serif', color:'var(--crimson)', borderColor: typed===CONFIRM_WORD ? 'var(--crimson)' : 'var(--border)' }}
          />
          <div style={{ display:'flex', gap:10 }}>
            <button className="btn-danger" style={{ flex:1, padding:'12px', fontSize:14, opacity: typed===CONFIRM_WORD ? 1 : 0.4 }}
              onClick={proceed} disabled={typed!==CONFIRM_WORD}>
              RESET EVERYTHING
            </button>
            <button className="btn-mana" onClick={onCancel}>CANCEL</button>
          </div>
        </div>
      )}

      {phase === 'final' && (
        <div style={{ textAlign:'center' }}>
          <div className="cinzel anim-levelup" style={{
            fontSize:52, fontWeight:900, color:'var(--crimson)',
            textShadow:'0 0 30px var(--crimson), 0 0 60px var(--crimson)',
            marginBottom:20, letterSpacing:6
          }}>
            THE SLATE IS CLEAN.
          </div>
          <div className="cinzel" style={{ fontSize:16, color:'#6a7a9a', letterSpacing:4, animation:'breathe 1s ease-in-out infinite' }}>
            Reawakening...
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BOSS FIGHT SCREEN
// ─────────────────────────────────────────────────────────────────────────────
const BOSS_TEMPLATES = [
  { name:'The Procrastinator',  emoji:'🕰️', description:'Feeds on your wasted hours.',     difficulty:'E', baseHp:500,  xpReward:300,  color:'#6a7a9a' },
  { name:'Lord of Distraction', emoji:'📱', description:'Steals your focus every second.',   difficulty:'D', baseHp:1000, xpReward:600,  color:'#4CAF50' },
  { name:'The Comfort Zone',    emoji:'🛋️', description:'The most dangerous enemy of all.', difficulty:'C', baseHp:2000, xpReward:1200, color:'#4FC3F7' },
  { name:'Shadow of Doubt',     emoji:'🌑', description:'Lives in the back of your mind.',   difficulty:'B', baseHp:4000, xpReward:2500, color:'#9B59B6' },
  { name:'Fear of Failure',     emoji:'💀', description:'Has stopped more dreams than any.', difficulty:'A', baseHp:8000, xpReward:5000, color:'#F39C12' },
  { name:'The Old Self',        emoji:'🪞', description:'The hardest boss — your past.',     difficulty:'S', baseHp:15000,xpReward:10000,color:'#E74C3C' },
  { name:'Eternal Mediocrity',  emoji:'♾️', description:'The final demon. It never dies.',   difficulty:'MONARCH', baseHp:50000,xpReward:30000,color:'#FFD700' },
];

function BossScreen({ state, dispatch, addXP, showNotif }) {
  const [showCreate, setShowCreate] = useState(false);
  const [showFight, setShowFight] = useState(null);
  const [attackAnim, setAttackAnim] = useState(false);
  const [customBoss, setCustomBoss] = useState({ name:'', emoji:'👹', description:'', maxHp:1000, xpReward:500, color:'#E74C3C' });
  const bosses = state.bosses || [];

  const attackBoss = (boss) => {
    // Damage based on relevant stats
    const { stats } = state;
    const baseDmg = Math.floor((stats.strength + stats.discipline + stats.focus) * (Math.random() * 0.5 + 0.75));
    const isCrit = Math.random() < 0.15;
    const damage = isCrit ? baseDmg * 3 : baseDmg;

    setAttackAnim(true);
    setTimeout(() => setAttackAnim(false), 500);

    dispatch({ type:'ATTACK_BOSS', payload:{ id: boss.id, damage } });

    const newHp = Math.max(0, boss.currentHp - damage);
    if (newHp === 0 && !boss.defeated) {
      // Boss defeated!
      setTimeout(() => {
        addXP(boss.xpReward, 'boss');
        showNotif(`⚔️ BOSS DEFEATED! +${boss.xpReward} XP`);
        setShowFight(null);
      }, 600);
    } else {
      showNotif(isCrit ? `💥 CRITICAL! -${damage.toLocaleString()} HP` : `-${damage.toLocaleString()} HP`);
    }
  };

  const activeBosses = bosses.filter(b => !b.defeated);
  const defeatedBosses = bosses.filter(b => b.defeated);

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column' }}>
      <div style={{ padding:'12px 16px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
          <div className="cinzel" style={{ fontSize:18, color:'var(--crimson)', letterSpacing:3 }}>⚔️ BOSS ARENA</div>
          <button className="btn-danger" style={{ fontSize:10, padding:'5px 12px' }} onClick={()=>setShowCreate(true)}>+ SUMMON BOSS</button>
        </div>
        <div style={{ fontSize:11, color:'var(--text-dim)' }}>Defeat your inner enemies. Each boss represents a real obstacle.</div>
      </div>

      <div className="scrollable" style={{ flex:1, padding:'0 16px 16px' }}>
        {/* Boss Templates */}
        {activeBosses.length === 0 && (
          <>
            <div className="cinzel" style={{ fontSize:11, color:'var(--text-dim)', letterSpacing:2, marginBottom:12 }}>SPAWN A BOSS TO FIGHT</div>
            {BOSS_TEMPLATES.map((t,i) => (
              <div key={i} className="panel" style={{ padding:14, marginBottom:8, borderColor:`${t.color}33`, cursor:'pointer' }}
                onClick={()=>{ dispatch({ type:'ADD_BOSS', payload:{ name:t.name, emoji:t.emoji, description:t.description, maxHp:t.baseHp, xpReward:t.xpReward, color:t.color, difficulty:t.difficulty } }); showNotif(`⚠️ ${t.name.toUpperCase()} HAS APPEARED`); }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <span style={{ fontSize:28 }}>{t.emoji}</span>
                  <div style={{ flex:1 }}>
                    <div className="cinzel" style={{ fontSize:13, color:t.color }}>{t.name}</div>
                    <div style={{ fontSize:11, color:'var(--text-dim)' }}>{t.description}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:10, color:t.color }}>{t.difficulty}-RANK</div>
                    <div style={{ fontSize:10, color:'var(--gold)' }}>+{t.xpReward.toLocaleString()} XP</div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Active Bosses */}
        {activeBosses.map(boss => {
          const hpPct = (boss.currentHp / boss.maxHp) * 100;
          const hpColor = hpPct > 60 ? '#2ECC71' : hpPct > 30 ? '#F39C12' : '#E74C3C';
          return (
            <div key={boss.id} className="panel" style={{ padding:16, marginBottom:12, borderColor:`${boss.color}55`, boxShadow:`0 0 20px ${boss.color}22` }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
                <div className="boss-anim" style={{ fontSize:44, lineHeight:1 }}>{boss.emoji}</div>
                <div style={{ flex:1 }}>
                  <div className="cinzel" style={{ fontSize:15, color:boss.color, marginBottom:2 }}>{boss.name}</div>
                  <div style={{ fontSize:11, color:'var(--text-dim)', marginBottom:8 }}>{boss.description}</div>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'var(--text-dim)', marginBottom:4 }}>
                    <span>HP</span>
                    <span style={{ color:hpColor }}>{boss.currentHp.toLocaleString()} / {boss.maxHp.toLocaleString()}</span>
                  </div>
                  <div style={{ height:10, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:5, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${hpPct}%`, background:`linear-gradient(90deg, ${hpColor}88, ${hpColor})`, borderRadius:5, transition:'width 0.5s ease-out', boxShadow:`0 0 8px ${hpColor}` }}/>
                  </div>
                </div>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button className="btn-danger" style={{ flex:1, padding:'10px', fontSize:13 }} onClick={()=>attackBoss(boss)}>
                  ⚔️ ATTACK
                </button>
                <button onClick={()=>{ dispatch({ type:'DELETE_BOSS', payload:boss.id }); }} style={{ background:'none', border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, color:'var(--text-dim)', fontSize:11, padding:'8px 12px', cursor:'pointer' }}>
                  FLEE
                </button>
              </div>
            </div>
          );
        })}

        {/* Defeated Bosses */}
        {defeatedBosses.length > 0 && (
          <>
            <div className="cinzel" style={{ fontSize:11, color:'var(--text-dim)', letterSpacing:2, margin:'16px 0 8px' }}>DEFEATED ✓</div>
            {defeatedBosses.map(boss => (
              <div key={boss.id} className="panel" style={{ padding:12, marginBottom:8, opacity:0.5, borderColor:'rgba(255,255,255,0.05)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ fontSize:24, filter:'grayscale(1)' }}>{boss.emoji}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, color:'var(--text-dim)', textDecoration:'line-through' }}>{boss.name}</div>
                  </div>
                  <span style={{ fontSize:11, color:'#2ECC71' }}>SLAIN ✓</span>
                  <button onClick={()=>dispatch({ type:'DELETE_BOSS', payload:boss.id })} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-dim)', padding:4 }}><X size={12}/></button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Create Custom Boss */}
      {showCreate && (
        <div className="modal-overlay" onClick={()=>setShowCreate(false)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="cinzel" style={{ color:'var(--crimson)', fontSize:16, marginBottom:16 }}>SUMMON CUSTOM BOSS</div>
            {[
              {k:'name', label:'Boss Name', ph:'My Bad Habit...'},
              {k:'emoji', label:'Boss Icon (emoji)', ph:'👹'},
              {k:'description', label:'What does it represent?', ph:'The enemy that holds me back...'},
            ].map(f=>(
              <div key={f.k} style={{ marginBottom:12 }}>
                <label style={{ fontSize:11, color:'var(--text-dim)', display:'block', marginBottom:6 }}>{f.label}</label>
                <input className="input-dark" value={customBoss[f.k]} onChange={e=>setCustomBoss(p=>({...p,[f.k]:e.target.value}))} placeholder={f.ph}/>
              </div>
            ))}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
              <div>
                <label style={{ fontSize:11, color:'var(--text-dim)', display:'block', marginBottom:6 }}>MAX HP</label>
                <input className="input-dark" type="number" value={customBoss.maxHp} onChange={e=>setCustomBoss(p=>({...p,maxHp:+e.target.value}))} style={{ padding:'8px' }}/>
              </div>
              <div>
                <label style={{ fontSize:11, color:'var(--text-dim)', display:'block', marginBottom:6 }}>XP REWARD</label>
                <input className="input-dark" type="number" value={customBoss.xpReward} onChange={e=>setCustomBoss(p=>({...p,xpReward:+e.target.value}))} style={{ padding:'8px' }}/>
              </div>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button className="btn-danger" style={{ flex:1 }} onClick={()=>{
                if(!customBoss.name) return;
                dispatch({ type:'ADD_BOSS', payload:{ ...customBoss, difficulty:'CUSTOM' } });
                setShowCreate(false);
                showNotif(`⚠️ ${customBoss.name.toUpperCase()} HAS APPEARED`);
              }}>SUMMON</button>
              <button className="btn-mana" onClick={()=>setShowCreate(false)}>CANCEL</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RANK CARD — Social Sharing
// ─────────────────────────────────────────────────────────────────────────────
function RankCardModal({ state, onClose }) {
  const canvasRef = useRef(null);
  const { hunter, stats } = state;
  const rankColor = RANK_COLORS[hunter.rank] || '#4FC3F7';
  const isMonarch = hunter.rank === 'MONARCH';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = 600, H = 320;
    canvas.width = W; canvas.height = H;

    // Background
    ctx.fillStyle = '#050508';
    ctx.fillRect(0, 0, W, H);

    // Gradient overlay
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, `${rankColor}22`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Border
    ctx.strokeStyle = rankColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, W-2, H-2);

    // Inner glow border
    ctx.strokeStyle = `${rankColor}44`;
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, W-8, H-8);

    // RANK big text
    ctx.font = 'bold 120px Georgia, serif';
    ctx.fillStyle = `${rankColor}18`;
    ctx.textAlign = 'right';
    ctx.fillText(isMonarch ? '♛' : hunter.rank, W - 30, H - 20);

    // Hunter name
    ctx.font = 'bold 36px Georgia, serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.fillText(hunter.name, 32, 56);

    // Title
    ctx.font = '16px Georgia, serif';
    ctx.fillStyle = rankColor;
    ctx.fillText((hunter.equippedTitle || hunter.title).toUpperCase(), 32, 84);

    // Class line
    ctx.font = '13px Courier New, monospace';
    ctx.fillStyle = '#6a7a9a';
    ctx.fillText(`${(hunter.class||'hunter').toUpperCase()} CLASS  ·  ${isMonarch ? '♛ MONARCH' : hunter.rank + '-RANK'}`, 32, 108);

    // Divider
    ctx.strokeStyle = `${rankColor}44`;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(32, 122); ctx.lineTo(W-32, 122); ctx.stroke();

    // Level + XP
    ctx.font = 'bold 56px Georgia, serif';
    ctx.fillStyle = '#4FC3F7';
    ctx.textAlign = 'left';
    ctx.fillText(`Lv. ${hunter.level}`, 32, 188);

    // Stats row
    const statList = [
      ['STR', stats.strength, '#E74C3C'],
      ['INT', stats.intelligence, '#4FC3F7'],
      ['DIS', stats.discipline, '#9B59B6'],
      ['VIT', stats.vitality, '#2ECC71'],
      ['FOC', stats.focus, '#F39C12'],
      ['CHA', stats.charisma, '#FF69B4'],
    ];
    ctx.font = 'bold 13px Courier New, monospace';
    ctx.textAlign = 'left';
    statList.forEach(([label, val, color], i) => {
      const x = 32 + i * 92;
      ctx.fillStyle = color;
      ctx.fillText(`${label} ${val}`, x, 220);
    });

    // XP bar
    const barW = W - 64;
    const xpPct = hunter.xpToNextLevel > 0 ? Math.min(1, hunter.totalXP / hunter.xpToNextLevel) : 0;
    ctx.fillStyle = 'rgba(79,195,247,0.1)';
    ctx.fillRect(32, 240, barW, 10);
    const barGrad = ctx.createLinearGradient(32, 0, 32 + barW * xpPct, 0);
    barGrad.addColorStop(0, '#1565C0');
    barGrad.addColorStop(1, '#4FC3F7');
    ctx.fillStyle = barGrad;
    ctx.fillRect(32, 240, barW * xpPct, 10);

    ctx.font = '11px Courier New, monospace';
    ctx.fillStyle = '#6a7a9a';
    ctx.textAlign = 'left';
    ctx.fillText(`${hunter.totalXP.toLocaleString()} / ${hunter.xpToNextLevel.toLocaleString()} XP`, 32, 268);

    // Footer
    ctx.font = '11px Georgia, serif';
    ctx.fillStyle = `${rankColor}88`;
    ctx.textAlign = 'right';
    ctx.fillText('ARISE — SHADOW SYSTEM', W - 32, 300);

  }, []);

  const share = async () => {
    const canvas = canvasRef.current;
    const blob = await new Promise(res => canvas.toBlob(res, 'image/png'));
    const file = new File([blob], 'arise-rank-card.png', { type:'image/png' });
    if (navigator.share && navigator.canShare({ files:[file] })) {
      await navigator.share({ title:`${hunter.name} — ${hunter.rank}-RANK`, files:[file] });
    } else {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'arise-rank-card.png';
      document.body.appendChild(a); a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box rank-card-reveal" onClick={e=>e.stopPropagation()} style={{ maxWidth:640, textAlign:'center' }}>
        <div className="cinzel" style={{ color:'var(--gold)', fontSize:16, marginBottom:16, letterSpacing:3 }}>YOUR RANK CARD</div>
        <canvas ref={canvasRef} style={{ width:'100%', borderRadius:8, border:`1px solid ${RANK_COLORS[hunter.rank]}44` }}/>
        <div style={{ display:'flex', gap:10, marginTop:16 }}>
          <button className="btn-gold" style={{ flex:1, padding:'12px' }} onClick={share}>
            📤 SHARE / DOWNLOAD
          </button>
          <button className="btn-mana" onClick={onClose}>CLOSE</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WORKOUT ASSISTANT
// ─────────────────────────────────────────────────────────────────────────────
const WORKOUT_LIBRARY = {
  chest: ['Bench Press', 'Incline Dumbbell Press', 'Cable Flyes', 'Push-Ups', 'Chest Dips', 'Pec Deck Machine', 'Decline Bench Press'],
  frontDelts: ['Front Raises', 'Overhead Press', 'Arnold Press', 'Cable Front Raise', 'Landmine Press'],
  sideDelts: ['Lateral Raises', 'Cable Lateral Raise', 'Upright Row', 'Machine Lateral Raise', 'Dumbbell Shoulder Press'],
  rearDelts: ['Reverse Pec Deck', 'Face Pulls', 'Bent-Over Lateral Raise', 'Band Pull-Aparts', 'Seated Cable Row (wide grip)'],
  biceps: ['Barbell Curl', 'Hammer Curl', 'Incline Dumbbell Curl', 'Cable Curl', 'Concentration Curl', 'Preacher Curl'],
  triceps: ['Skull Crushers', 'Tricep Pushdowns', 'Overhead Tricep Extension', 'Close-Grip Bench', 'Tricep Dips', 'Diamond Push-Ups'],
  forearms: ['Wrist Curls', 'Reverse Curls', 'Dead Hangs', 'Farmer Carries', 'Plate Pinches'],
  traps: ['Shrugs', 'Rack Pulls', 'Face Pulls', 'Upright Rows', 'Snatch-Grip Deadlift'],
  lats: ['Pull-Ups', 'Lat Pulldown', 'Seated Cable Row', 'Single-Arm Dumbbell Row', 'T-Bar Row', 'Straight-Arm Pulldown'],
  rhomboids: ['Bent-Over Row', 'Seated Cable Row', 'Face Pulls', 'Band Pull-Aparts', 'Chest-Supported Row'],
  abs: ['Crunch', 'Hanging Leg Raises', 'Cable Crunch', 'Ab Wheel Rollout', 'Plank', 'Dragon Flag', 'Decline Crunch'],
  obliques: ['Russian Twists', 'Side Plank', 'Wood Chops', 'Bicycle Crunch', 'Cable Side Bend'],
  lowerBack: ['Deadlift', 'Good Mornings', 'Hyperextensions', 'Romanian Deadlift', 'Bird Dog'],
  quads: ['Squat', 'Leg Press', 'Leg Extension', 'Hack Squat', 'Bulgarian Split Squat', 'Walking Lunges'],
  hamstrings: ['Romanian Deadlift', 'Leg Curl', 'Stiff-Leg Deadlift', 'Nordic Curl', 'Glute-Ham Raise'],
  glutes: ['Hip Thrust', 'Glute Kickback', 'Sumo Deadlift', 'Step-Ups', 'Cable Pull-Through', 'Donkey Kicks'],
  calves: ['Standing Calf Raise', 'Seated Calf Raise', 'Donkey Calf Raise', 'Jump Rope', 'Single-Leg Calf Raise'],
  hipFlexors: ['Hip Flexor Stretch', 'Mountain Climbers', 'Hanging Knee Raises', 'Cable Hip Flexion', 'Psoas March'],
};

const WORKOUT_TIPS = {
  chest: 'Focus on full range of motion. Squeeze at the top. Keep shoulder blades retracted.',
  frontDelts: 'Avoid swinging. Go slow on the way down. Don\'t go above shoulder height.',
  sideDelts: 'Slight bend in elbows. Lead with elbows, not hands. Control the negative.',
  rearDelts: 'High reps work best. Face pulls = shoulder health. Never skip these.',
  biceps: 'Supinate at the top. Don\'t use momentum. Full stretch at the bottom.',
  triceps: 'Triceps are 2/3 of arm size. Lockout matters. Keep elbows tucked.',
  forearms: 'Often undertrained. Grip strength carries over to every pull exercise.',
  traps: 'Full shrug up AND hold. Dead hangs also build grip and decompress spine.',
  lats: 'Think "pull elbows to hips". Arch slightly. Full stretch at the top.',
  rhomboids: 'Key for posture. Squeeze shoulder blades together hard at the peak.',
  abs: 'Abs are built in the kitchen too. Brace hard. Control the movement.',
  obliques: 'Don\'t neglect these — they protect your spine and build the V-taper.',
  lowerBack: 'Never round under load. Hinge from hips. Deadlift = king of all exercises.',
  quads: 'Knees over toes is fine. Full depth squats. Don\'t skip leg day.',
  hamstrings: 'Most injuries happen here. Never skip. Romanian DL = best bang for buck.',
  glutes: 'Largest muscle in body. Hip thrusts with heavy weight. Drive through heels.',
  calves: 'Full stretch matters more than load. Slow negatives. High frequency works.',
  hipFlexors: 'Sitting weakens these. Stretch daily. Tight hip flexors = back pain.',
};

function WorkoutAssistant({ muscleName, muscleData, onClose, onLogWorkout }) {
  const [selectedEx, setSelectedEx] = useState('');
  const [sets, setSets] = useState(4);
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState('');
  const exercises = WORKOUT_LIBRARY[muscleName] || [];
  const tip = WORKOUT_TIPS[muscleName] || '';
  const MUSCLE_NAMES = {
    chest:'Chest', frontDelts:'Front Delts', sideDelts:'Side Delts', biceps:'Biceps',
    triceps:'Triceps', abs:'Abs', obliques:'Obliques', quads:'Quads', calves:'Calves', forearms:'Forearms',
    traps:'Traps', rearDelts:'Rear Delts', lats:'Lats', rhomboids:'Rhomboids',
    lowerBack:'Lower Back', glutes:'Glutes', hamstrings:'Hamstrings', hipFlexors:'Hip Flexors'
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e=>e.stopPropagation()} style={{ maxWidth:460 }}>
        <div className="cinzel" style={{ color:'var(--mana)', fontSize:16, marginBottom:4 }}>💪 WORKOUT ASSISTANT</div>
        <div style={{ fontSize:12, color:'var(--gold)', marginBottom:16 }}>{MUSCLE_NAMES[muscleName]} — Lv.{muscleData?.level||0} | {muscleData?.trained||0} sessions</div>

        {/* Pro Tip */}
        <div className="panel" style={{ padding:12, marginBottom:16, borderColor:'rgba(155,89,182,0.3)' }}>
          <div style={{ fontSize:10, color:'var(--violet)', letterSpacing:2, marginBottom:4 }}>💡 SYSTEM TIP</div>
          <div style={{ fontSize:12, color:'var(--text)', lineHeight:1.6 }}>{tip}</div>
        </div>

        {/* Exercise Picker */}
        <div style={{ marginBottom:12 }}>
          <label style={{ fontSize:11, color:'var(--text-dim)', display:'block', marginBottom:8 }}>SELECT EXERCISE</label>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
            {exercises.map(ex => (
              <button key={ex} onClick={()=>setSelectedEx(ex)} style={{
                padding:'6px 10px', fontSize:11, borderRadius:6, cursor:'pointer',
                border: selectedEx===ex ? '1px solid var(--mana)' : '1px solid var(--border)',
                background: selectedEx===ex ? 'rgba(79,195,247,0.15)' : 'rgba(10,10,20,0.6)',
                color: selectedEx===ex ? 'var(--mana)' : 'var(--text-dim)',
                transition:'all 0.15s'
              }}>{ex}</button>
            ))}
          </div>
        </div>

        {/* Sets / Reps / Weight */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:16 }}>
          {[{label:'SETS', val:sets, set:setSets},{label:'REPS', val:reps, set:setReps},{label:'KG (opt)', val:weight, set:setWeight}].map(f=>(
            <div key={f.label}>
              <label style={{ fontSize:10, color:'var(--text-dim)', display:'block', marginBottom:4 }}>{f.label}</label>
              <input className="input-dark" type="number" value={f.val} onChange={e=>f.set(e.target.value)} style={{ padding:'8px 10px' }}/>
            </div>
          ))}
        </div>

        <div style={{ display:'flex', gap:8 }}>
          <button className="btn-gold" style={{ flex:1 }} onClick={()=>{
            if(!selectedEx) return;
            onLogWorkout({ exercise:selectedEx, sets:+sets, reps:+reps, weight:weight||'' });
          }}>⚡ LOG WORKOUT</button>
          <button className="btn-mana" onClick={onClose}>BACK</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS SCREEN — Theme, Notifications, Export, Data
// ─────────────────────────────────────────────────────────────────────────────
function SettingsScreen({ state, dispatch, showNotif }) {
  const [notifTime, setNotifTime] = useState(state.notifications?.time || '08:00');

  const exportData = () => {
    const json = JSON.stringify(state, null, 2);
    const blob = new Blob([json], { type:'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ARISE_backup_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotif('💾 DATA EXPORTED');
  };

  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        dispatch({ type:'LOAD_STATE', payload:data });
        showNotif('✅ DATA IMPORTED');
      } catch(err) {
        showNotif('❌ INVALID FILE');
      }
    };
    reader.readAsText(file);
  };

  const requestNotifications = async () => {
    if (!('Notification' in window)) {
      showNotif('❌ NOT SUPPORTED'); return;
    }
    const perm = await Notification.requestPermission();
    dispatch({ type:'SET_NOTIFICATIONS', payload:{ permission: perm, enabled: perm === 'granted' } });
    if (perm === 'granted') showNotif('🔔 NOTIFICATIONS ENABLED');
    else showNotif('❌ PERMISSION DENIED');
  };

  const toggleTheme = () => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    dispatch({ type:'SET_THEME', payload: newTheme });
    document.body.className = newTheme === 'light' ? 'light-theme' : '';
  };

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column' }}>
      <div style={{ padding:'12px 16px' }}>
        <div className="cinzel" style={{ fontSize:18, color:'var(--mana)', letterSpacing:3, marginBottom:4 }}>SYSTEM SETTINGS</div>
      </div>

      <div className="scrollable" style={{ flex:1, padding:'0 16px 24px' }}>

        {/* Theme */}
        <div className="panel" style={{ padding:16, marginBottom:12 }}>
          <div className="cinzel" style={{ fontSize:11, color:'var(--text-dim)', letterSpacing:3, marginBottom:12 }}>🎨 APPEARANCE</div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ fontSize:13, color:'var(--text)' }}>{state.theme === 'dark' ? '🌑 Dark Mode' : '☀️ Light Mode'}</div>
              <div style={{ fontSize:11, color:'var(--text-dim)' }}>Switch between Shadow and Light realm</div>
            </div>
            <button onClick={toggleTheme} style={{
              padding:'8px 16px', borderRadius:20, cursor:'pointer', fontSize:12,
              border: `1px solid ${state.theme==='dark' ? 'var(--mana)' : 'var(--gold)'}`,
              background: state.theme==='dark' ? 'rgba(79,195,247,0.15)' : 'rgba(243,156,18,0.15)',
              color: state.theme==='dark' ? 'var(--mana)' : 'var(--gold)',
              fontFamily:'Cinzel,serif'
            }}>
              {state.theme === 'dark' ? 'GO LIGHT ☀️' : 'GO DARK 🌑'}
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="panel" style={{ padding:16, marginBottom:12 }}>
          <div className="cinzel" style={{ fontSize:11, color:'var(--text-dim)', letterSpacing:3, marginBottom:12 }}>🔔 NOTIFICATIONS</div>
          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:13, color:'var(--text)', marginBottom:4 }}>Daily Quest Reminder</div>
            <div style={{ fontSize:11, color:'var(--text-dim)', marginBottom:12 }}>
              Status: <span style={{ color: state.notifications?.enabled ? '#2ECC71' : 'var(--crimson)' }}>
                {state.notifications?.enabled ? '● ACTIVE' : '● OFF'}
              </span>
            </div>
            {!state.notifications?.enabled && (
              <button className="btn-mana" style={{ width:'100%', marginBottom:10 }} onClick={requestNotifications}>
                ENABLE NOTIFICATIONS
              </button>
            )}
            {state.notifications?.enabled && (
              <>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'var(--text-dim)', marginBottom:6 }}>
                  <span>Reminder Time</span>
                  <span style={{ color:'var(--mana)' }}>{notifTime}</span>
                </div>
                <input type="time" value={notifTime}
                  onChange={e=>{ setNotifTime(e.target.value); dispatch({ type:'SET_NOTIFICATIONS', payload:{ time:e.target.value } }); }}
                  style={{ background:'rgba(5,5,15,0.8)', border:'1px solid var(--border)', color:'var(--text)', borderRadius:6, padding:'8px 12px', width:'100%', fontSize:14 }}/>
                <div style={{ fontSize:11, color:'var(--text-dim)', marginTop:8 }}>
                  You'll receive a daily reminder to complete your quests at this time.
                </div>
                <button style={{ marginTop:10, background:'none', border:'1px solid var(--crimson)', borderRadius:6, color:'var(--crimson)', fontSize:11, padding:'6px 12px', cursor:'pointer' }}
                  onClick={()=>dispatch({ type:'SET_NOTIFICATIONS', payload:{ enabled:false } })}>
                  DISABLE
                </button>
              </>
            )}
          </div>
        </div>

        {/* Data Export/Import */}
        <div className="panel" style={{ padding:16, marginBottom:12 }}>
          <div className="cinzel" style={{ fontSize:11, color:'var(--text-dim)', letterSpacing:3, marginBottom:12 }}>💾 DATA MANAGEMENT</div>

          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:13, color:'var(--text)', marginBottom:4 }}>Export Backup</div>
            <div style={{ fontSize:11, color:'var(--text-dim)', marginBottom:10 }}>Download all your progress as a JSON file. Keep it safe.</div>
            <button className="btn-mana" style={{ width:'100%' }} onClick={exportData}>
              📤 EXPORT ALL DATA
            </button>
          </div>

          <div style={{ borderTop:'1px solid var(--border)', paddingTop:12 }}>
            <div style={{ fontSize:13, color:'var(--text)', marginBottom:4 }}>Import Backup</div>
            <div style={{ fontSize:11, color:'var(--text-dim)', marginBottom:10 }}>Restore from a previous backup file. ⚠️ This overwrites current data.</div>
            <label style={{
              display:'block', width:'100%', padding:'8px 16px', textAlign:'center',
              background:'rgba(155,89,182,0.15)', border:'1px solid var(--violet)',
              borderRadius:6, color:'var(--violet)', fontSize:12, cursor:'pointer',
              fontFamily:'Cinzel,serif', letterSpacing:1
            }}>
              📥 IMPORT BACKUP
              <input type="file" accept=".json" onChange={importData} style={{ display:'none' }}/>
            </label>
          </div>
        </div>

        {/* App Info */}
        <div className="panel" style={{ padding:16, textAlign:'center' }}>
          <div className="cinzel" style={{ fontSize:18, color:'var(--mana)', letterSpacing:4, marginBottom:4 }}>ARISE</div>
          <div style={{ fontSize:11, color:'var(--text-dim)', letterSpacing:2 }}>SHADOW SYSTEM v2.0</div>
          <div style={{ fontSize:11, color:'var(--text-dim)', marginTop:8, lineHeight:1.6 }}>
            Hunter: <span style={{ color:'var(--text)' }}>{state.hunter.name}</span><br/>
            Days Active: <span style={{ color:'var(--mana)' }}>{state.hunter.createdAt ? Math.floor((Date.now()-state.hunter.createdAt)/86400000) : 0}</span><br/>
            Journal Entries: <span style={{ color:'var(--violet)' }}>{state.journal?.length || 0}</span>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COLLECTION SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function CollectionScreen({ state, dispatch }) {
  const collection = state.collection || [];
  const [filter, setFilter] = useState('all');

  const FILTERS = [
    { k:'all', l:'All' },
    { k:'purchase', l:'Purchased' },
    { k:'quest_reward', l:'Quest Rewards' },
  ];

  const filtered = filter === 'all' ? collection : collection.filter(i => i.source === filter);
  const titles = collection.filter(i => i.type === 'Title' || i.category === 'Titles');
  const equippedTitle = state.hunter.equippedTitle;

  const TYPE_COLORS = {
    Title: '#F39C12', Badge: '#9B59B6', StatBoost: '#E74C3C',
    XPBoost: '#4FC3F7', Boosts: '#4FC3F7', real: '#2ECC71', virtual: '#4FC3F7'
  };

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column' }}>
      <div style={{ padding:'12px 16px' }}>
        <div className="cinzel" style={{ fontSize:18, color:'var(--gold)', letterSpacing:3, marginBottom:4 }}>COLLECTION</div>
        <div style={{ fontSize:11, color:'var(--text-dim)', marginBottom:12 }}>All items, titles, and rewards you've earned.</div>

        {/* Equipped Title Banner */}
        {equippedTitle && (
          <div style={{ padding:'10px 14px', marginBottom:12, background:'rgba(243,156,18,0.08)', border:'1px solid rgba(243,156,18,0.3)', borderRadius:8, display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontSize:18 }}>♛</span>
            <div>
              <div style={{ fontSize:10, color:'var(--text-dim)', letterSpacing:2 }}>ACTIVE TITLE</div>
              <div className="cinzel" style={{ fontSize:14, color:'var(--gold)' }}>{equippedTitle}</div>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div style={{ display:'flex', gap:6 }}>
          {FILTERS.map(f=>(
            <button key={f.k} onClick={()=>setFilter(f.k)} style={{
              flex:1, padding:'6px 4px', fontSize:10, borderRadius:6, cursor:'pointer',
              border: filter===f.k ? '1px solid var(--gold)' : '1px solid var(--border)',
              background: filter===f.k ? 'rgba(243,156,18,0.15)' : 'transparent',
              color: filter===f.k ? 'var(--gold)' : 'var(--text-dim)', fontFamily:'Cinzel,serif'
            }}>{f.l}</button>
          ))}
        </div>
      </div>

      <div className="scrollable" style={{ flex:1, padding:'0 16px 24px' }}>
        {/* Stats row */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:16 }}>
          {[
            { l:'TOTAL', v:collection.length, c:'var(--gold)' },
            { l:'TITLES', v:titles.length, c:'#F39C12' },
            { l:'REWARDS', v:collection.filter(i=>i.source==='quest_reward').length, c:'#2ECC71' },
          ].map(s=>(
            <div key={s.l} className="panel" style={{ padding:'10px 8px', textAlign:'center' }}>
              <div className="cinzel" style={{ fontSize:20, color:s.c }}>{s.v}</div>
              <div style={{ fontSize:9, color:'var(--text-dim)', letterSpacing:2 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign:'center', padding:40, color:'var(--text-dim)' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>📦</div>
            <div className="cinzel" style={{ fontSize:14, marginBottom:8 }}>EMPTY</div>
            <div style={{ fontSize:12, lineHeight:1.6 }}>Purchase items from the Reward Vault or complete quests with linked rewards to fill your collection.</div>
          </div>
        )}

        {filtered.map((item, idx) => {
          const isTitle = item.type === 'Title' || item.category === 'Titles';
          const isEquipped = isTitle && equippedTitle === item.name;
          const sourceColor = item.source === 'quest_reward' ? '#2ECC71' : 'var(--gold)';
          const sourceLabel = item.source === 'quest_reward' ? `⚔️ ${item.questName || 'Quest Reward'}` : '🪙 Purchased';
          const itemColor = TYPE_COLORS[item.type] || TYPE_COLORS[item.category] || 'var(--mana)';

          return (
            <div key={idx} className="panel" style={{
              padding:14, marginBottom:10,
              borderColor: isEquipped ? 'rgba(243,156,18,0.5)' : `${itemColor}33`,
              boxShadow: isEquipped ? '0 0 16px rgba(243,156,18,0.2)' : 'none'
            }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ fontSize:28, width:40, textAlign:'center' }}>{item.icon || item.emoji || '✦'}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap', marginBottom:2 }}>
                    <span className="cinzel" style={{ fontSize:13, color: isEquipped ? 'var(--gold)' : itemColor }}>{item.name}</span>
                    {isEquipped && <span style={{ fontSize:9, color:'var(--gold)', border:'1px solid var(--gold)', padding:'1px 5px', borderRadius:3 }}>ACTIVE</span>}
                  </div>
                  {item.desc && <div style={{ fontSize:11, color:'var(--text-dim)', marginBottom:4 }}>{item.desc}</div>}
                  <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                    <span style={{ fontSize:10, color:sourceColor }}>{sourceLabel}</span>
                    {item.acquiredAt && <span style={{ fontSize:10, color:'var(--text-dim)' }}>· {new Date(item.acquiredAt).toLocaleDateString()}</span>}
                  </div>
                </div>
                {/* Equip title button */}
                {isTitle && !isEquipped && (
                  <button className="btn-gold" style={{ fontSize:10, padding:'5px 10px' }}
                    onClick={()=>dispatch({ type:'EQUIP_REWARD', payload:{ type:'Title', value:item.name } })}>
                    EQUIP
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ANTI-TODO SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function AntiTodoScreen({ state, dispatch, addXP, showNotif }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ name:'', reason:'', category:'habits', severity:'medium' });
  const antiTodo = state.antiTodo || [];

  const CATEGORIES = [
    { k:'habits', l:'Bad Habits', icon:'🚫', color:'#E74C3C' },
    { k:'time', l:'Time Wasters', icon:'⏰', color:'#F39C12' },
    { k:'food', l:'Food/Drink', icon:'🍔', color:'#9B59B6' },
    { k:'mental', l:'Mental Traps', icon:'🧠', color:'#4FC3F7' },
    { k:'social', l:'Social Traps', icon:'📱', color:'#2ECC71' },
    { k:'custom', l:'Custom', icon:'⚡', color:'#FF69B4' },
  ];

  const SEVERITY = [
    { k:'low', l:'Low', color:'#2ECC71', xp:25 },
    { k:'medium', l:'Medium', color:'#F39C12', xp:50 },
    { k:'high', l:'High', color:'#E74C3C', xp:100 },
  ];

  const kept = (item) => {
    dispatch({ type:'KEEP_ANTI_TODO', payload: item.id });
    const sev = SEVERITY.find(s=>s.k===item.severity) || SEVERITY[1];
    addXP(sev.xp, 'antitodo');
    showNotif(`💪 RESISTED! +${sev.xp} XP`);
  };

  const broke = (item) => {
    dispatch({ type:'BREAK_ANTI_TODO', payload: item.id });
    showNotif(`💔 RESISTANCE BROKEN`);
  };

  const catOf = (k) => CATEGORIES.find(c=>c.k===k) || CATEGORIES[5];
  const sevOf = (k) => SEVERITY.find(s=>s.k===k) || SEVERITY[1];

  const sorted = [...antiTodo].sort((a,b) => {
    const order = { high:0, medium:1, low:2 };
    return (order[a.severity]||1) - (order[b.severity]||1);
  });

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column' }}>
      <div style={{ padding:'12px 16px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
          <div className="cinzel" style={{ fontSize:18, color:'var(--crimson)', letterSpacing:3 }}>ANTI-TODO</div>
          <button className="btn-danger" style={{ fontSize:10, padding:'5px 12px' }} onClick={()=>setShowAdd(true)}>+ ADD</button>
        </div>
        <div style={{ fontSize:11, color:'var(--text-dim)', marginBottom:8, lineHeight:1.6 }}>
          Things you must <span style={{ color:'var(--crimson)' }}>NOT</span> do. Each time you resist, earn XP. Each time you break — the System judges you.
        </div>
        {antiTodo.length > 0 && (
          <div style={{ display:'flex', gap:8 }}>
            {[
              { l:'RESISTED', v:antiTodo.reduce((s,a)=>(s+(a.streak||0)),0), c:'#2ECC71' },
              { l:'BROKEN', v:antiTodo.reduce((s,a)=>(s+(a.breakCount||0)),0), c:'var(--crimson)' },
              { l:'RATIO', v: antiTodo.reduce((s,a)=>(s+(a.streak||0)),0) + antiTodo.reduce((s,a)=>(s+(a.breakCount||0)),0) === 0 ? '-' :
                Math.round(antiTodo.reduce((s,a)=>(s+(a.streak||0)),0) / (antiTodo.reduce((s,a)=>(s+(a.streak||0)),0) + antiTodo.reduce((s,a)=>(s+(a.breakCount||0)),0)) * 100) + '%',
                c:'var(--mana)' },
            ].map(s=>(
              <div key={s.l} className="panel" style={{ flex:1, padding:'8px 6px', textAlign:'center' }}>
                <div className="cinzel" style={{ fontSize:18, color:s.c }}>{s.v}</div>
                <div style={{ fontSize:9, color:'var(--text-dim)', letterSpacing:1 }}>{s.l}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="scrollable" style={{ flex:1, padding:'0 16px 24px' }}>
        {sorted.length === 0 && (
          <div style={{ textAlign:'center', padding:40, color:'var(--text-dim)' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🚫</div>
            <div className="cinzel" style={{ fontSize:14, marginBottom:8 }}>NO FORBIDDEN ACTIONS</div>
            <div style={{ fontSize:12, lineHeight:1.6 }}>
              Add things you're trying to stop doing.<br/>
              Every day you resist earns you XP.<br/>
              This is how you defeat your demons.
            </div>
          </div>
        )}

        {sorted.map(item => {
          const cat = catOf(item.category);
          const sev = sevOf(item.severity);
          const streak = item.streak || 0;
          const breaks = item.breakCount || 0;

          return (
            <div key={item.id} className="panel" style={{
              padding:16, marginBottom:12,
              borderColor: `${sev.color}44`,
              boxShadow: streak > 0 ? `0 0 12px ${sev.color}22` : 'none'
            }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom:12 }}>
                <span style={{ fontSize:24 }}>{cat.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:2, flexWrap:'wrap' }}>
                    <span className="cinzel" style={{ fontSize:14, color:sev.color }}>{item.name}</span>
                    <span style={{ fontSize:9, color:sev.color, border:`1px solid ${sev.color}55`, padding:'1px 5px', borderRadius:3 }}>{sev.l.toUpperCase()}</span>
                  </div>
                  {item.reason && <div style={{ fontSize:11, color:'var(--text-dim)', lineHeight:1.5 }}>{item.reason}</div>}
                  <div style={{ display:'flex', gap:12, marginTop:6, fontSize:11 }}>
                    <span style={{ color:'#2ECC71' }}>✓ {streak} resisted</span>
                    <span style={{ color:'var(--crimson)' }}>✗ {breaks} broken</span>
                    <span style={{ color:'var(--gold)' }}>+{sev.xp} XP/resist</span>
                  </div>
                </div>
                <button onClick={()=>dispatch({ type:'DELETE_ANTI_TODO', payload:item.id })} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-dim)', opacity:0.5, padding:4 }}>
                  <X size={14}/>
                </button>
              </div>

              {/* Streak bar */}
              {(streak + breaks) > 0 && (
                <div style={{ marginBottom:12 }}>
                  <div style={{ height:6, background:'rgba(255,255,255,0.05)', borderRadius:3, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${streak/(streak+breaks)*100}%`, background:'linear-gradient(90deg, #1a7a30, #2ECC71)', borderRadius:3, transition:'width 0.5s' }}/>
                  </div>
                </div>
              )}

              <div style={{ display:'flex', gap:8 }}>
                <button onClick={()=>kept(item)} style={{
                  flex:2, padding:'10px', borderRadius:6, cursor:'pointer', fontSize:12,
                  background:'rgba(46,204,113,0.15)', border:'1px solid rgba(46,204,113,0.5)',
                  color:'#2ECC71', fontFamily:'Cinzel,serif', letterSpacing:1
                }}>💪 I RESISTED</button>
                <button onClick={()=>broke(item)} style={{
                  flex:1, padding:'10px', borderRadius:6, cursor:'pointer', fontSize:11,
                  background:'rgba(231,76,60,0.1)', border:'1px solid rgba(231,76,60,0.3)',
                  color:'var(--crimson)', fontFamily:'Courier New,monospace'
                }}>💔 I BROKE</button>
              </div>
            </div>
          );
        })}
      </div>

      {showAdd && (
        <div className="modal-overlay" onClick={()=>setShowAdd(false)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="cinzel" style={{ color:'var(--crimson)', fontSize:16, marginBottom:16 }}>ADD FORBIDDEN ACTION</div>
            <div style={{ marginBottom:12 }}>
              <label style={{ display:'block', fontSize:11, color:'var(--text-dim)', marginBottom:6 }}>WHAT TO AVOID</label>
              <input className="input-dark" value={newItem.name} onChange={e=>setNewItem(p=>({...p,name:e.target.value}))} placeholder="Checking Instagram after 10pm..."/>
            </div>
            <div style={{ marginBottom:12 }}>
              <label style={{ display:'block', fontSize:11, color:'var(--text-dim)', marginBottom:6 }}>WHY IT'S FORBIDDEN (optional)</label>
              <input className="input-dark" value={newItem.reason} onChange={e=>setNewItem(p=>({...p,reason:e.target.value}))} placeholder="Destroys sleep quality..."/>
            </div>
            <div style={{ marginBottom:12 }}>
              <label style={{ display:'block', fontSize:11, color:'var(--text-dim)', marginBottom:8 }}>CATEGORY</label>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {CATEGORIES.map(c=>(
                  <button key={c.k} onClick={()=>setNewItem(p=>({...p,category:c.k}))} style={{
                    padding:'5px 10px', fontSize:11, borderRadius:6, cursor:'pointer',
                    border: newItem.category===c.k ? `1px solid ${c.color}` : '1px solid var(--border)',
                    background: newItem.category===c.k ? `${c.color}22` : 'transparent',
                    color: newItem.category===c.k ? c.color : 'var(--text-dim)'
                  }}>{c.icon} {c.l}</button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={{ display:'block', fontSize:11, color:'var(--text-dim)', marginBottom:8 }}>SEVERITY & XP FOR RESISTING</label>
              <div style={{ display:'flex', gap:8 }}>
                {SEVERITY.map(s=>(
                  <button key={s.k} onClick={()=>setNewItem(p=>({...p,severity:s.k}))} style={{
                    flex:1, padding:'8px', borderRadius:6, cursor:'pointer', fontSize:11,
                    border: newItem.severity===s.k ? `1px solid ${s.color}` : '1px solid var(--border)',
                    background: newItem.severity===s.k ? `${s.color}22` : 'transparent',
                    color: newItem.severity===s.k ? s.color : 'var(--text-dim)'
                  }}>{s.l}<br/><span style={{ fontSize:10 }}>+{s.xp} XP</span></button>
                ))}
              </div>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button className="btn-danger" style={{ flex:1 }} onClick={()=>{
                if(!newItem.name) return;
                dispatch({ type:'ADD_ANTI_TODO', payload:{ ...newItem } });
                setNewItem({ name:'', reason:'', category:'habits', severity:'medium' });
                setShowAdd(false);
                showNotif('🚫 FORBIDDEN ACTION ADDED');
              }}>ADD TO ANTI-TODO</button>
              <button className="btn-mana" onClick={()=>setShowAdd(false)}>CANCEL</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────────────────────────────────────
const NAV_TABS = [
  { id:'status',     label:'STATUS',     icon: Home },
  { id:'quests',     label:'QUESTS',     icon: Sword },
  { id:'body',       label:'BODY',       icon: Dumbbell },
  { id:'mind',       label:'MIND',       icon: Brain },
  { id:'habits',     label:'HABITS',     icon: Flame },
  { id:'routine',    label:'ROUTINE',    icon: Clock },
  { id:'screen',     label:'SCREEN',     icon: Smartphone },
  { id:'journal',    label:'JOURNAL',    icon: ScrollText },
  { id:'rewards',    label:'REWARDS',    icon: Star },
  { id:'boss',       label:'BOSS',       icon: Zap },
  { id:'collection', label:'COLLECT',    icon: Trophy },
  { id:'antitodo',   label:'ANTI-TODO',  icon: AlertTriangle },
  { id:'settings',   label:'SETTINGS',   icon: Shield },
];

// ─────────────────────────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [state, dispatch] = useReducer(reducer, null, buildInitialState);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState('status');
  const [floats, setFloats] = useState([]);
  const [levelUpData, setLevelUpData] = useState(null);
  const [notif, setNotif] = useState(null);
  const [showReset, setShowReset] = useState(false);
  const [showRankCard, setShowRankCard] = useState(false);
  const notifTimer = useRef(null);

  // Load state on mount
  useEffect(() => {
    loadState().then(saved => {
      if (saved) {
        dispatch({ type:'LOAD_STATE', payload:saved });
        // Restore theme
        if (saved.theme === 'light') document.body.className = 'light-theme';
      }
      setLoaded(true);
    });
  }, []);

  // Auto-save
  useEffect(() => {
    if (loaded) saveState(state);
  }, [state, loaded]);

  // Apply theme changes
  useEffect(() => {
    document.body.className = state.theme === 'light' ? 'light-theme' : '';
  }, [state.theme]);

  // Daily reset check
  useEffect(() => {
    dispatch({ type:'RESET_DAILY' });
  }, []);

  // Schedule notification
  useEffect(() => {
    if (!state.notifications?.enabled || !state.notifications?.time) return;
    const scheduleNotif = () => {
      const [h, m] = state.notifications.time.split(':').map(Number);
      const now = new Date();
      const target = new Date();
      target.setHours(h, m, 0, 0);
      if (target <= now) target.setDate(target.getDate() + 1);
      const delay = target - now;
      return setTimeout(() => {
        if (Notification.permission === 'granted') {
          new Notification('⚔️ ARISE — Daily Quests Await', {
            body: `${state.hunter.name}, your gates are open. Complete your daily quests.`,
            icon: '/icon.png',
            badge: '/icon.png',
          });
        }
      }, delay);
    };
    const t = scheduleNotif();
    return () => clearTimeout(t);
  }, [state.notifications?.enabled, state.notifications?.time]);

  const addXP = useCallback((amount, source) => {
    dispatch({ type:'GAIN_XP', payload: amount });
    const id = Date.now() + Math.random();
    const x = Math.random() * 200 + 80;
    const y = Math.random() * 200 + 150;
    setFloats(f => [...f, { id, amount, x, y }]);
    setTimeout(() => setFloats(f => f.filter(fl => fl.id !== id)), 1600);
  }, []);

  // Detect level up
  useEffect(() => {
    if (state._leveled) setLevelUpData(state._leveled);
  }, [state._leveled]);

  const showNotif = useCallback((msg) => {
    setNotif(msg);
    clearTimeout(notifTimer.current);
    notifTimer.current = setTimeout(() => setNotif(null), 2000);
  }, []);

  const handleReset = async () => {
    dispatch({ type:'RESET_ALL' });
    try { await clearState(); } catch(e) {}
    document.body.className = '';
    setShowReset(false);
  };

  if (!loaded) {
    return (
      <div style={{ position:'fixed', inset:0, background:'#000', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div className="cinzel" style={{ color:'var(--mana)', letterSpacing:6, animation:'breathe 1.5s ease-in-out infinite' }}>LOADING...</div>
      </div>
    );
  }

  if (!state.onboarded) {
    return (
      <>
        <style>{STYLES}</style>
        <Onboarding onComplete={(data) => dispatch({ type:'COMPLETE_ONBOARDING', payload:data })}/>
      </>
    );
  }

  const screenProps = { state, dispatch, addXP, showNotif };

  return (
    <>
      <style>{STYLES}</style>

      <div style={{ position:'fixed', inset:0, display:'flex', flexDirection:'column', background:'var(--bg)', overflow:'hidden' }}>
        {/* Ambient background */}
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:0 }}>
          <div style={{ position:'absolute', top:'-20%', left:'20%', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle, rgba(79,195,247,0.04), transparent 70%)', filter:'blur(40px)' }}/>
          <div style={{ position:'absolute', bottom:'-10%', right:'10%', width:250, height:250, borderRadius:'50%', background:'radial-gradient(circle, rgba(155,89,182,0.04), transparent 70%)', filter:'blur(40px)' }}/>
        </div>

        {/* Top Bar */}
        <div style={{
          display:'flex', justifyContent:'space-between', alignItems:'center',
          padding:'6px 14px', background:'rgba(5,5,12,0.9)', borderBottom:'1px solid rgba(79,195,247,0.08)',
          zIndex:10, flexShrink:0
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:5, cursor:'pointer' }} onClick={()=>setTab('rewards')}>
            <span style={{ fontSize:13 }}>🪙</span>
            <span className="cinzel" style={{ fontSize:12, color:'var(--gold)' }}>{(state.hunter.coins||0).toLocaleString()}</span>
            <span style={{ fontSize:9, color:'var(--text-dim)', letterSpacing:1 }}>COINS</span>
          </div>
          {/* Rank card share button */}
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <button onClick={()=>setShowRankCard(true)} style={{
              background:'none', border:'1px solid rgba(243,156,18,0.3)', borderRadius:5,
              color:'rgba(243,156,18,0.7)', fontSize:9, padding:'4px 8px', cursor:'pointer',
              fontFamily:'Cinzel,serif', letterSpacing:1
            }}>🃏 CARD</button>
            <span className="cinzel" style={{ fontSize:11, color:'var(--text-dim)', letterSpacing:2 }}>
              {state.hunter.name} · Lv.{state.hunter.level}
            </span>
          </div>
          <button onClick={()=>setShowReset(true)} style={{
            background:'none', border:'1px solid rgba(231,76,60,0.25)', borderRadius:5,
            color:'rgba(231,76,60,0.6)', fontSize:9, padding:'4px 8px', cursor:'pointer',
            fontFamily:'Cinzel,serif', letterSpacing:1, transition:'all 0.2s'
          }}
            onMouseEnter={e=>{e.target.style.borderColor='var(--crimson)';e.target.style.color='var(--crimson)';}}
            onMouseLeave={e=>{e.target.style.borderColor='rgba(231,76,60,0.25)';e.target.style.color='rgba(231,76,60,0.6)';}}>
            ↺ RESET
          </button>
        </div>

        {/* Content */}
        <div style={{ flex:1, overflow:'hidden', position:'relative', zIndex:1 }}>
          {tab==='status'   && <StatusScreen {...screenProps}/>}
          {tab==='quests'   && <QuestsScreen {...screenProps}/>}
          {tab==='body'     && <BodyScreen {...screenProps}/>}
          {tab==='mind'     && <MindScreen {...screenProps}/>}
          {tab==='habits'   && <HabitsScreen {...screenProps}/>}
          {tab==='routine'  && <RoutineScreen {...screenProps}/>}
          {tab==='screen'   && <ScreenTimeScreen {...screenProps}/>}
          {tab==='journal'  && <JournalScreen {...screenProps}/>}
          {tab==='rewards'    && <RewardsScreen {...screenProps}/>}
          {tab==='boss'       && <BossScreen {...screenProps}/>}
          {tab==='collection' && <CollectionScreen {...screenProps}/>}
          {tab==='antitodo'   && <AntiTodoScreen {...screenProps}/>}
          {tab==='settings'   && <SettingsScreen {...screenProps}/>}
        </div>

        {/* Bottom Nav */}
        <div style={{
          display:'flex', background:'rgba(5,5,12,0.97)', borderTop:'1px solid var(--border)',
          backdropFilter:'blur(10px)', zIndex:10, flexShrink:0, overflowX:'auto'
        }}>
          {NAV_TABS.map(t => {
            const Icon = t.icon;
            return (
              <div key={t.id} className={`nav-tab ${tab===t.id?'active':''}`} onClick={()=>setTab(t.id)}
                style={{ minWidth: 52 }}>
                <Icon size={15}/>
                <span style={{ fontFamily:'Cinzel,serif', letterSpacing:0.5, fontSize:7 }}>{t.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* XP Floats */}
      <XPFloat floats={floats}/>

      {/* Notif */}
      {notif && <div className="quest-cleared-overlay">{notif}</div>}

      {/* Level Up */}
      {levelUpData && <LevelUpOverlay data={levelUpData} onClose={()=>setLevelUpData(null)}/>}

      {/* Reset Modal */}
      {showReset && <ResetModal onConfirm={handleReset} onCancel={()=>setShowReset(false)}/>}

      {/* Rank Card */}
      {showRankCard && <RankCardModal state={state} onClose={()=>setShowRankCard(false)}/>}
    </>
  );
}
