"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// ─── SVG Icons (Pixel Art Style) ───────────────────────────────────────

const IconAttack = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="5" y="0" width="4" height="8" fill="#ef4444"/>
    <rect x="2" y="7" width="10" height="2" fill="#ef4444"/>
    <rect x="6" y="9" width="2" height="5" fill="#ef4444"/>
  </svg>
);

const IconDefense = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="3" y="2" width="8" height="10" fill="#3b82f6"/>
    <rect x="4" y="3" width="6" height="8" fill="none" stroke="#60a5fa" strokeWidth="1"/>
    <line x1="7" y1="5" x2="7" y2="10" stroke="#60a5fa" strokeWidth="1"/>
  </svg>
);

const IconHP = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 2 L10 5 L10 10 Q10 12 8 12 L6 12 Q4 12 4 10 L4 5 L7 2" fill="#ec4899" stroke="#f472b6" strokeWidth="1"/>
  </svg>
);

const IconLightning = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <polygon points="6,1 8,5 5,5 8,13 3,7 6,7" fill="#fbbf24"/>
  </svg>
);

const IconExplosion = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="4" y="4" width="6" height="6" fill="#dc2626"/>
    <rect x="3" y="3" width="2" height="2" fill="#f87171"/>
    <rect x="9" y="3" width="2" height="2" fill="#f87171"/>
    <rect x="3" y="9" width="2" height="2" fill="#f87171"/>
    <rect x="9" y="9" width="2" height="2" fill="#f87171"/>
  </svg>
);

const IconGold = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="5" fill="#fbbf24"/>
    <circle cx="7" cy="7" r="3" fill="#fcd34d"/>
    <rect x="6" y="4" width="2" height="6" fill="#fbbf24"/>
  </svg>
);

const IconInventory = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="2" y="4" width="10" height="8" fill="#6366f1" stroke="#818cf8" strokeWidth="1"/>
    <rect x="3" y="2" width="8" height="3" fill="#818cf8"/>
    <rect x="4" y="6" width="3" height="3" fill="#34d399"/>
    <rect x="8" y="6" width="3" height="3" fill="#34d399"/>
  </svg>
);

const IconInfo = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="6" fill="none" stroke="#3b82f6" strokeWidth="1"/>
    <rect x="6" y="3" width="2" height="2" fill="#3b82f6"/>
    <rect x="6" y="6" width="2" height="4" fill="#3b82f6"/>
  </svg>
);

const IconReset = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 7 Q2 3 6 3 Q10 3 11 6" fill="none" stroke="#f87171" strokeWidth="1.5"/>
    <polygon points="11,5 13,6 11,8" fill="#f87171"/>
  </svg>
);

const IconLevel = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <polygon points="7,2 3,10 11,10" fill="#4ade80"/>
  </svg>
);

const IconRebirth = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <polygon points="7,2 10,6 8,6 8,10 6,10 6,6 4,6" fill="#fbbf24"/>
  </svg>
);

// ─── Types ───────────────────────────────────────────────────────────
type Rarity = "common" | "rare" | "epic" | "legendary";

interface Item {
  id: string;
  name: string;
  emoji: string;
  rarity: Rarity;
  slot: "weapon" | "armor" | "accessory";
  atk: number;
  def: number;
  hp: number;
}

interface Skill {
  id: string;
  name: string;
  emoji: string;
  damage: number;
  cooldown: number;
  lastUsed: number;
  unlockLevel: number;
  description: string;
}

interface DroppedItem {
  id: number;
  emoji: string;
  x: number;
  y: number;
  rarity: Rarity;
}

interface DamageText {
  id: number;
  value: number;
  x: number;
  y: number;
  isCrit: boolean;
}

interface Explosion {
  id: number;
  x: number;
  y: number;
}

interface Monster {
  name: string;
  emoji: string;
  baseHp: number;
  baseAtk: number;
  expReward: number;
  goldReward: number;
  type: "slime" | "bat" | "goblin" | "ogre";
}

interface GameState {
  exp: number;
  level: number;
  gold: number;
  autoExp: number;
  clickExp: number;
  rebirths: number;
  rebirthBonus: number;
  started: boolean;
  // Boss
  isBossFight: boolean;
  bossHp: number;
  bossMaxHp: number;
  bossLevel: number;
  // Monster
  isMonsterFight: boolean;
  monsterHp: number;
  monsterMaxHp: number;
  monsterType: Monster | null;
  monstersDefeated: number;
  // Stats
  baseAtk: number;
  baseDef: number;
  baseHp: number;
  maxHp: number;
  currentHp: number;
  // Equipment
  equippedWeapon: Item | null;
  equippedArmor: Item | null;
  equippedAccessory: Item | null;
  // Inventory
  inventory: Item[];
  // Skills
  skills: Skill[];
  // Chest
  pendingChest: Item | null;
  // Auto attack
  autoAttackEnabled: boolean;
  // Fever effects
  doubleAttackActive: boolean;
  doubleAttackEndTime: number;
  autoFeverActive: boolean;
  autoFeverEndTime: number;
  // Upgrade counts
  atkUpgradeCount: number;
  autoUpgradeCount: number;
}

// ─── Constants ───────────────────────────────────────────────────────
const STORAGE_KEY = "capybara-pixel-rpg-v3";
const EXP_PER_LEVEL = 100;
const BOSS_INTERVAL = 10;
const REBIRTH_LEVEL = 30;
const REBIRTH_BONUS = 0.15;

const RARITY_COLORS: Record<Rarity, string> = {
  common: "#9ca3af",
  rare: "#3b82f6",
  epic: "#a855f7",
  legendary: "#fbbf24",
};

const RARITY_BG: Record<Rarity, string> = {
  common: "border-gray-500 bg-gray-900/80",
  rare: "border-blue-500 bg-blue-900/50",
  epic: "border-purple-500 bg-purple-900/50",
  legendary: "border-yellow-500 bg-yellow-900/50",
};

const RARITY_NAMES: Record<Rarity, string> = {
  common: "일반",
  rare: "레어",
  epic: "에픽",
  legendary: "전설",
};

const DROP_EMOJIS = ["◯", "💎", "🧪", "⭐", "🔮", "📦"];

const ALL_ITEMS: Omit<Item, "id">[] = [
  // Weapons
  { name: "나무 검", emoji: "▲", rarity: "common", slot: "weapon", atk: 3, def: 0, hp: 0 },
  { name: "돌 도끼", emoji: "🪓", rarity: "common", slot: "weapon", atk: 5, def: 0, hp: 0 },
  { name: "강철 검", emoji: "🗡️", rarity: "rare", slot: "weapon", atk: 12, def: 0, hp: 0 },
  { name: "마법 지팡이", emoji: "🪄", rarity: "rare", slot: "weapon", atk: 15, def: 0, hp: 5 },
  { name: "용의 검", emoji: "▲", rarity: "epic", slot: "weapon", atk: 30, def: 5, hp: 0 },
  { name: "천둥 망치", emoji: "🔨", rarity: "epic", slot: "weapon", atk: 35, def: 0, hp: 10 },
  { name: "전설의 엑스칼리버", emoji: "▲", rarity: "legendary", slot: "weapon", atk: 60, def: 10, hp: 20 },
  { name: "신의 창", emoji: "🔱", rarity: "legendary", slot: "weapon", atk: 75, def: 5, hp: 15 },
  // Armor
  { name: "가죽 갑옷", emoji: "■", rarity: "common", slot: "armor", atk: 0, def: 3, hp: 5 },
  { name: "사슬 갑옷", emoji: "■", rarity: "rare", slot: "armor", atk: 0, def: 10, hp: 15 },
  { name: "미스릴 갑옷", emoji: "■", rarity: "epic", slot: "armor", atk: 5, def: 25, hp: 30 },
  { name: "드래곤 아머", emoji: "■", rarity: "legendary", slot: "armor", atk: 10, def: 50, hp: 50 },
  // Accessories
  { name: "구리 반지", emoji: "💍", rarity: "common", slot: "accessory", atk: 1, def: 1, hp: 3 },
  { name: "마력 목걸이", emoji: "📿", rarity: "rare", slot: "accessory", atk: 5, def: 3, hp: 10 },
  { name: "용의 눈", emoji: "👁️", rarity: "epic", slot: "accessory", atk: 15, def: 10, hp: 20 },
  { name: "신의 왕관", emoji: "👑", rarity: "legendary", slot: "accessory", atk: 25, def: 20, hp: 40 },
];

const DEFAULT_SKILLS: Skill[] = [
  { id: "double_attack", name: "공격력 2배", emoji: "✦", damage: 0, cooldown: 60000, lastUsed: 0, unlockLevel: 1, description: "다음 공격의 공격력이 2배가 된다" },
  { id: "auto_fever", name: "번개 광풍", emoji: "★", damage: 0, cooldown: 60000, lastUsed: 0, unlockLevel: 1, description: "0.05초마다 자동으로 공격 (3초간)" },
];

const BOSS_EMOJIS = ["👹", "🐉", "💀", "👿", "🦇", "🕷️", "🐍", "👾"];
const BOSS_NAMES = ["고블린 킹", "드래곤", "해골 기사", "데몬 로드", "뱀파이어", "거대 거미", "나가", "외계 침략자"];

const MONSTERS: Monster[] = [
  { name: "슬라임", emoji: "💧", baseHp: 20, baseAtk: 2, expReward: 8, goldReward: 2, type: "slime" },
  { name: "박쥐", emoji: "🦇", baseHp: 30, baseAtk: 4, expReward: 12, goldReward: 3, type: "bat" },
  { name: "고블린", emoji: "👹", baseHp: 60, baseAtk: 8, expReward: 25, goldReward: 8, type: "goblin" },
  { name: "오우거", emoji: "💪", baseHp: 80, baseAtk: 10, expReward: 35, goldReward: 12, type: "ogre" },
];

function getMonsterForLevel(level: number): Monster {
  const tierIndex = Math.min(Math.floor(level / 5), MONSTERS.length - 1);
  // Pick a random monster up to the current tier
  const available = MONSTERS.slice(0, tierIndex + 1);
  // Higher chance for higher-tier monsters
  const weights = available.map((_, i) => i + 1);
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let roll = Math.random() * totalWeight;
  for (let i = weights.length - 1; i >= 0; i--) {
    roll -= weights[i];
    if (roll <= 0) return available[i];
  }
  return available[available.length - 1];
}

function getMonsterHp(monster: Monster, level: number): number {
  return Math.floor(monster.baseHp * (1 + (level - 1) * 0.3));
}

function spawnMonster(level: number): { monster: Monster; hp: number } {
  const monster = getMonsterForLevel(level);
  const hp = getMonsterHp(monster, level);
  return { monster, hp };
}

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

function getDefaultState(): GameState {
  const initialMonster = MONSTERS[0];
  const initialHp = getMonsterHp(initialMonster, 1);
  return {
    exp: 0,
    level: 1,
    gold: 0,
    autoExp: 0.5,
    clickExp: 5,
    rebirths: 0,
    rebirthBonus: 1.0,
    started: false,
    isBossFight: false,
    bossHp: 100,
    bossMaxHp: 100,
    bossLevel: 1,
    isMonsterFight: true,
    monsterHp: initialHp,
    monsterMaxHp: initialHp,
    monsterType: initialMonster,
    monstersDefeated: 0,
    baseAtk: 5,
    baseDef: 2,
    baseHp: 50,
    maxHp: 50,
    currentHp: 50,
    equippedWeapon: null,
    equippedArmor: null,
    equippedAccessory: null,
    inventory: [],
    skills: DEFAULT_SKILLS.map((s) => ({ ...s })),
    pendingChest: null,
    autoAttackEnabled: true,
    doubleAttackActive: false,
    doubleAttackEndTime: 0,
    autoFeverActive: false,
    autoFeverEndTime: 0,
    atkUpgradeCount: 0,
    autoUpgradeCount: 0,
  };
}

function loadState(): GameState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Merge with defaults for new fields
    return { ...getDefaultState(), ...parsed };
  } catch {
    return null;
  }
}

function saveState(state: GameState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getTotalAtk(state: GameState): number {
  let atk = state.baseAtk;
  if (state.equippedWeapon) atk += state.equippedWeapon.atk;
  if (state.equippedArmor) atk += state.equippedArmor.atk;
  if (state.equippedAccessory) atk += state.equippedAccessory.atk;
  return Math.floor(atk * state.rebirthBonus);
}

function getTotalDef(state: GameState): number {
  let def = state.baseDef;
  if (state.equippedWeapon) def += state.equippedWeapon.def;
  if (state.equippedArmor) def += state.equippedArmor.def;
  if (state.equippedAccessory) def += state.equippedAccessory.def;
  return Math.floor(def * state.rebirthBonus);
}

function getTotalHp(state: GameState): number {
  let hp = state.baseHp;
  if (state.equippedWeapon) hp += state.equippedWeapon.hp;
  if (state.equippedArmor) hp += state.equippedArmor.hp;
  if (state.equippedAccessory) hp += state.equippedAccessory.hp;
  return Math.floor(hp * state.rebirthBonus);
}

function isDoubleAttackActive(state: GameState): boolean {
  return state.doubleAttackActive && Date.now() < state.doubleAttackEndTime;
}

// 업그레이드 비용 계산 (지수 증가: 10 * 1.5^count)
function getUpgradeCost(upgradeCount: number): number {
  return Math.floor(10 * Math.pow(1.5, upgradeCount));
}

function rollRarity(level: number): Rarity {
  const r = Math.random() * 100;
  const legendaryChance = Math.min(2 + level * 0.3, 10);
  const epicChance = Math.min(5 + level * 0.5, 20);
  const rareChance = Math.min(15 + level * 0.8, 40);
  if (r < legendaryChance) return "legendary";
  if (r < legendaryChance + epicChance) return "epic";
  if (r < legendaryChance + epicChance + rareChance) return "rare";
  return "common";
}

function generateItem(level: number): Item {
  const rarity = rollRarity(level);
  const candidates = ALL_ITEMS.filter((i) => i.rarity === rarity);
  const template = candidates[Math.floor(Math.random() * candidates.length)];
  const mult = 1 + (level - 1) * 0.1;
  return {
    ...template,
    id: generateId(),
    atk: Math.floor(template.atk * mult),
    def: Math.floor(template.def * mult),
    hp: Math.floor(template.hp * mult),
  };
}

// ─── SVG Pixel Art Components ────────────────────────────────────────

interface CapybaraAnimState {
  state: "idle" | "attack" | "jump" | "hit" | "victory" | "breathing";
  frameIndex: number;
}

function PixelCapybara({ size = 80, isAttacking = false, animState = { state: "idle", frameIndex: 0 } }: { size?: number; isAttacking?: boolean; animState?: CapybaraAnimState }) {
  const imgRef = useRef<HTMLImageElement>(null);

  // Idle 프레임 이미지 경로
  const idleFrames = [
    "/indie-games/capybara-idle-1.png",
    "/indie-games/capybara-idle-2.png",
    "/indie-games/capybara-idle-3.png",
    "/indie-games/capybara-idle-4.png",
  ];

  // 현재 상태에 따른 이미지 경로 결정
  let imagePath = "/indie-games/capybara-idle-1.png";  // 기본값
  
  if (animState.state === "attack") {
    // 공격: 펀치만
    imagePath = "/indie-games/capybara-attack-2.png";
  } else if (animState.state === "idle") {
    // 대기: 호흡 4프레임
    imagePath = idleFrames[animState.frameIndex % idleFrames.length];
  }

  return (
    <img
      ref={imgRef}
      src={imagePath}
      style={{
        width: size,
        height: size,
        imageRendering: "pixelated",
        display: "block",
      }}
      alt="capybara"
    />
  );
}

function PixelBoss({ bossIndex, size = 80 }: { bossIndex: number; size?: number }) {
  return (
    <img
      src="/indie-games/boss-demon.png"
      style={{
        width: size,
        height: size,
        imageRendering: "pixelated",
        display: "block",
      }}
      alt="boss"
    />
  );
}

function PixelMonster({ type, size = 64 }: { type: string; size?: number }) {
  const monsterImages: Record<string, string> = {
    slime: "/indie-games/monster-slime.png",
    bat: "/indie-games/monster-bat.png",
    goblin: "/indie-games/monster-goblin.png",
    ogre: "/indie-games/monster-ogre.png",
  };

  const imagePath = monsterImages[type] || monsterImages.slime;

  return (
    <img
      src={imagePath}
      style={{
        width: size,
        height: size,
        imageRendering: "pixelated",
        display: "block",
      }}
      alt={type}
    />
  );
}

// ─── Main Component ──────────────────────────────────────────────────

export default function Home() {
  const [state, setState] = useState<GameState>(getDefaultState);
  const [mounted, setMounted] = useState(false);
  const [damageTexts, setDamageTexts] = useState<DamageText[]>([]);
  const [droppedItems, setDroppedItems] = useState<DroppedItem[]>([]);
  const [explosions, setExplosions] = useState<Explosion[]>([]);
  const [isAttacking, setIsAttacking] = useState(false);
  const [isHoldingAttack, setIsHoldingAttack] = useState(false);
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [bossHurt, setBossHurt] = useState(false);
  const [bossEntering, setBossEntering] = useState(false);
  const [monsterHurt, setMonsterHurt] = useState(false);
  const [monsterDying, setMonsterDying] = useState(false);
  const prevBossFight = useRef(false);
  const [showChest, setShowChest] = useState(false);
  const [chestOpening, setChestOpening] = useState(false);
  const [chestItem, setChestItem] = useState<Item | null>(null);
  const [activeTab, setActiveTab] = useState<"battle" | "inventory" | "info">("battle");
  const [skillCooldowns, setSkillCooldowns] = useState<Record<string, number>>({});
  const [animFrameIndex, setAnimFrameIndex] = useState(0);
  const [capybaraAnimState, setCapybaraAnimState] = useState<CapybaraAnimState>({ state: "idle", frameIndex: 0 });
  const popIdRef = useRef(0);
  const battleAreaRef = useRef<HTMLDivElement>(null);

  // Load
  useEffect(() => {
    const saved = loadState();
    if (saved && saved.started) {
      setState({ ...saved, currentHp: Math.min(saved.currentHp, getTotalHp(saved)) });
    }
    setMounted(true);
  }, []);

  // Cleanup hold attack interval on unmount
  useEffect(() => {
    return () => {
      if (holdIntervalRef.current) {
        clearInterval(holdIntervalRef.current);
      }
    };
  }, []);

  // Double attack effect timer
  useEffect(() => {
    if (!state.doubleAttackActive) return;
    
    const now = Date.now();
    if (now >= state.doubleAttackEndTime) {
      setState(prev => ({ ...prev, doubleAttackActive: false }));
      return;
    }

    const remainingTime = state.doubleAttackEndTime - now;
    const timer = setTimeout(() => {
      setState(prev => ({ ...prev, doubleAttackActive: false }));
    }, remainingTime);

    return () => clearTimeout(timer);
  }, [state.doubleAttackActive, state.doubleAttackEndTime]);

  // Save
  useEffect(() => {
    if (mounted && state.started) saveState(state);
  }, [state, mounted]);

  // Cooldown ticker
  useEffect(() => {
    if (!state.started) return;
    const interval = setInterval(() => {
      const now = Date.now();
      const cds: Record<string, number> = {};
      for (const skill of state.skills) {
        const elapsed = now - skill.lastUsed;
        const remaining = Math.max(0, skill.cooldown - elapsed);
        cds[skill.id] = remaining;
      }
      setSkillCooldowns(cds);
    }, 100);
    return () => clearInterval(interval);
  }, [state.started, state.skills]);

  // Animation frame update
  useEffect(() => {
    if (!state.started) return;
    const interval = setInterval(() => {
      setAnimFrameIndex(prev => prev + 1);
      
      // 상태에 따라 애니메이션 결정
      let newState: CapybaraAnimState = { state: "idle", frameIndex: 0 };
      
      if (isAttacking && (state.isBossFight || state.isMonsterFight)) {
        newState = { state: "attack", frameIndex: 0 };
      } else if (state.isBossFight || state.isMonsterFight) {
        // Idle 호흡 애니메이션
        newState = { state: "idle", frameIndex: (animFrameIndex % 4) };
      }
      
      setCapybaraAnimState(newState);
    }, 100); // 100ms마다 프레임 변경
    return () => clearInterval(interval);
  }, [state.started, isAttacking, state.isBossFight, state.isMonsterFight, animFrameIndex]);

  // Auto-fever (번개 광풍) - 50ms마다 자동 공격
  useEffect(() => {
    if (!state.autoFeverActive || !state.started) return;
    
    const now = Date.now();
    if (now >= state.autoFeverEndTime) {
      setState(prev => ({ ...prev, autoFeverActive: false }));
      return;
    }

    const interval = setInterval(() => {
      setIsAttacking(true);
      setTimeout(() => setIsAttacking(false), 80);

      setState((prev) => {
        const now = Date.now();
        if (now >= prev.autoFeverEndTime) {
          return { ...prev, autoFeverActive: false };
        }

        // 번개 광풍 공격 (최종 데미지, 공격력 2배 스킬 적용)
        const atk = getTotalAtk(prev);
        let dmg = Math.max(1, Math.floor(atk));
        if (isDoubleAttackActive(prev)) {
          dmg *= 2;
        }

        if (prev.isBossFight) {
          const newBossHp = prev.bossHp - dmg;
          spawnDamageText(dmg, false);
          if (newBossHp <= 0) {
            const reward = Math.floor(50 * prev.bossLevel * prev.rebirthBonus);
            const item = generateItem(prev.level);
            return {
              ...prev,
              isBossFight: false,
              gold: prev.gold + reward,
              pendingChest: item,
              autoFeverActive: false,
            };
          }
          return { ...prev, bossHp: newBossHp };
        }

        if (prev.isMonsterFight && prev.monsterType) {
          const newMonsterHp = prev.monsterHp - dmg;
          spawnDamageText(dmg, false);
          if (newMonsterHp <= 0) {
            const monster = prev.monsterType;
            const expGain = Math.floor(monster.expReward * prev.rebirthBonus * (1 + (prev.level - 1) * 0.1));
            const goldGain = Math.floor(monster.goldReward * prev.rebirthBonus * (1 + (prev.level - 1) * 0.05));
            const next = spawnMonster(prev.level);
            let newExp = prev.exp + expGain;
            let newLevel = prev.level;
            let gold = prev.gold + goldGain;
            while (newExp >= EXP_PER_LEVEL) {
              newExp -= EXP_PER_LEVEL;
              newLevel += 1;
              gold += Math.floor(5 + newLevel * 2);
            }
            if (newLevel !== prev.level && newLevel % BOSS_INTERVAL === 0) {
              const bossLv = Math.floor(newLevel / BOSS_INTERVAL);
              const bossMaxHp = Math.floor(100 * Math.pow(1.8, bossLv));
              return {
                ...prev,
                exp: newExp,
                level: newLevel,
                gold,
                isBossFight: true,
                bossHp: bossMaxHp,
                bossMaxHp,
                bossLevel: bossLv,
                isMonsterFight: false,
                monsterType: null,
                monstersDefeated: prev.monstersDefeated + 1,
                autoFeverActive: false,
              };
            }
            return {
              ...prev,
              exp: newExp,
              level: newLevel,
              gold,
              isMonsterFight: true,
              monsterHp: next.hp,
              monsterMaxHp: next.hp,
              monsterType: next.monster,
              monstersDefeated: prev.monstersDefeated + 1,
            };
          }
          return { ...prev, monsterHp: newMonsterHp };
        }

        return prev;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [state.autoFeverActive, state.autoFeverEndTime, state.started]);

  // Auto EXP & auto attack
  useEffect(() => {
    if (!state.started) return;
    
    const interval = setInterval(() => {
      // Trigger attack animation
      setIsAttacking(true);
      setTimeout(() => setIsAttacking(false), 100);

      setState((prev) => {
        if (prev.isBossFight) {
          if (!prev.autoAttackEnabled) return prev;
          const atk = getTotalAtk(prev);
          let dmg = Math.max(1, atk);
          if (isDoubleAttackActive(prev)) {
            dmg *= 2;
          }
          const newBossHp = prev.bossHp - dmg;

          if (newBossHp <= 0) {
            const reward = Math.floor(50 * prev.bossLevel * prev.rebirthBonus);
            const item = generateItem(prev.level);
            return {
              ...prev,
              isBossFight: false,
              gold: prev.gold + reward,
              pendingChest: item,
            };
          }
          return { ...prev, bossHp: newBossHp };
        }

        // Auto attack monster
        if (prev.isMonsterFight && prev.monsterType && prev.autoAttackEnabled) {
          const atk = getTotalAtk(prev);
          let dmg = Math.max(1, atk);
          if (isDoubleAttackActive(prev)) {
            dmg *= 2;
          }
          const newMonsterHp = prev.monsterHp - dmg;

          if (newMonsterHp <= 0) {
            const monster = prev.monsterType;
            const expGain = Math.floor(monster.expReward * prev.rebirthBonus * (1 + (prev.level - 1) * 0.1));
            const goldGain = Math.floor(monster.goldReward * prev.rebirthBonus * (1 + (prev.level - 1) * 0.05));
            const next = spawnMonster(prev.level);

            let newExp = prev.exp + expGain;
            let newLevel = prev.level;
            let gold = prev.gold + goldGain;

            while (newExp >= EXP_PER_LEVEL) {
              newExp -= EXP_PER_LEVEL;
              newLevel += 1;
              gold += Math.floor(5 + newLevel * 2);
            }

            if (newLevel !== prev.level && newLevel % BOSS_INTERVAL === 0) {
              const bossLv = Math.floor(newLevel / BOSS_INTERVAL);
              const bossMaxHp = Math.floor(100 * Math.pow(1.8, bossLv));
              return {
                ...prev, exp: newExp, level: newLevel, gold,
                isBossFight: true, bossHp: bossMaxHp, bossMaxHp, bossLevel: bossLv,
                isMonsterFight: false, monsterType: null, monstersDefeated: prev.monstersDefeated + 1,
              };
            }

            return {
              ...prev, exp: newExp, level: newLevel, gold,
              isMonsterFight: true, monsterHp: next.hp, monsterMaxHp: next.hp,
              monsterType: next.monster, monstersDefeated: prev.monstersDefeated + 1,
            };
          }
          
          // Monster counter attack
          const def = getTotalDef(prev);
          const monsterAtk = Math.floor(prev.monsterType.baseAtk * (1 + (prev.level - 1) * 0.1));
          const playerDmg = Math.max(1, monsterAtk - def);
          const newPlayerHp = prev.currentHp - playerDmg;

          // Player dies → respawn
          if (newPlayerHp <= 0) {
            const next = spawnMonster(prev.level);
            return {
              ...prev,
              currentHp: prev.maxHp,
              isMonsterFight: true,
              monsterHp: next.hp,
              monsterMaxHp: next.hp,
              monsterType: next.monster,
            };
          }

          return { ...prev, monsterHp: newMonsterHp, currentHp: newPlayerHp };
        }

        // Normal auto exp (no monster)
        let newExp = prev.exp + prev.autoExp * prev.rebirthBonus;
        let newLevel = prev.level;
        let gold = prev.gold;

        while (newExp >= EXP_PER_LEVEL) {
          newExp -= EXP_PER_LEVEL;
          newLevel += 1;
          gold += Math.floor(5 + newLevel * 2);
        }

        if (newLevel !== prev.level && newLevel % BOSS_INTERVAL === 0) {
          const bossLv = Math.floor(newLevel / BOSS_INTERVAL);
          const bossMaxHp = Math.floor(100 * Math.pow(1.8, bossLv));
          return {
            ...prev, exp: newExp, level: newLevel, gold,
            isBossFight: true, bossHp: bossMaxHp, bossMaxHp, bossLevel: bossLv,
            isMonsterFight: false, monsterType: null,
          };
        }

        // Spawn monster if none active and not boss level
        if (!prev.isMonsterFight && !prev.isBossFight) {
          const next = spawnMonster(newLevel);
          return {
            ...prev, exp: newExp, level: newLevel, gold,
            isMonsterFight: true, monsterHp: next.hp, monsterMaxHp: next.hp, monsterType: next.monster,
          };
        }

        return { ...prev, exp: newExp, level: newLevel, gold };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [state.started]);

  // Boss entrance animation trigger
  useEffect(() => {
    if (state.isBossFight && !prevBossFight.current) {
      setBossEntering(true);
      setTimeout(() => setBossEntering(false), 2000);
    }
    prevBossFight.current = state.isBossFight;
  }, [state.isBossFight]);

  // Show chest when pending
  useEffect(() => {
    if (state.pendingChest && !showChest) {
      setShowChest(true);
      setChestItem(null);
      setChestOpening(false);
    }
  }, [state.pendingChest, showChest]);

  const spawnDamageText = (value: number, isCrit: boolean) => {
    const id = popIdRef.current++;
    const area = battleAreaRef.current;
    const cx = area ? area.offsetWidth / 2 : 150;
    const cy = area ? area.offsetHeight / 2 : 80;
    const x = cx + (Math.random() - 0.5) * 60;
    const y = cy + (Math.random() - 0.5) * 40;
    setDamageTexts((prev) => [...prev, { id, value, x, y, isCrit }]);
    setTimeout(() => setDamageTexts((prev) => prev.filter((d) => d.id !== id)), 1000);
  };

  const spawnDrop = () => {
    const id = popIdRef.current++;
    const emoji = DROP_EMOJIS[Math.floor(Math.random() * DROP_EMOJIS.length)];
    const area = battleAreaRef.current;
    const w = area ? area.offsetWidth : 300;
    const x = Math.random() * (w - 40) + 20;
    const y = Math.random() * 60 + 40;
    const rarities: Rarity[] = ["common", "common", "common", "rare", "rare", "epic"];
    const rarity = rarities[Math.floor(Math.random() * rarities.length)];
    setDroppedItems((prev) => [...prev, { id, emoji, x, y, rarity }]);
    setTimeout(() => setDroppedItems((prev) => prev.filter((d) => d.id !== id)), 1500);
  };

  const spawnExplosion = (x: number, y: number) => {
    const id = popIdRef.current++;
    setExplosions((prev) => [...prev, { id, x, y }]);
    setTimeout(() => setExplosions((prev) => prev.filter((e) => e.id !== id)), 600);
  };

  const handleClick = useCallback(
    (event: React.PointerEvent | React.MouseEvent) => {
      if (!state.started) return;
      event.preventDefault();

      const atk = getTotalAtk(state);
      const isCrit = Math.random() < 0.15;
      let dmg = isCrit ? atk * 2 : atk;
      
      // 공격력 2배 스킬 적용 (10초 동안 모든 공격이 2배)
      if (isDoubleAttackActive(state)) {
        dmg *= 2;
      }

      setIsAttacking(true);
      setTimeout(() => setIsAttacking(false), 100);

      if (state.isBossFight) {
        setBossHurt(true);
        setTimeout(() => setBossHurt(false), 100);
        spawnDamageText(dmg, isCrit);

        if (isCrit) {
          const rect = battleAreaRef.current?.getBoundingClientRect();
          if (rect) {
            spawnExplosion(event.clientX - rect.left, event.clientY - rect.top);
          }
        }

        setState((prev) => {
          const newBossHp = prev.bossHp - dmg;
          if (newBossHp <= 0) {
            const reward = Math.floor(50 * prev.bossLevel * prev.rebirthBonus);
            const item = generateItem(prev.level);
            spawnExplosion(150, 80);
            return {
              ...prev,
              isBossFight: false,
              gold: prev.gold + reward,
              pendingChest: item,
            };
          }
          return { ...prev, bossHp: newBossHp };
        });
      } else if (state.isMonsterFight && state.monsterType) {
        // Attack monster
        setMonsterHurt(true);
        setTimeout(() => setMonsterHurt(false), 100);
        spawnDamageText(dmg, isCrit);

        if (isCrit) {
          const rect = battleAreaRef.current?.getBoundingClientRect();
          if (rect) {
            spawnExplosion(event.clientX - rect.left, event.clientY - rect.top);
          }
        }

        if (Math.random() < 0.2) spawnDrop();

        setState((prev) => {
          if (!prev.monsterType) return prev;
          const newMonsterHp = prev.monsterHp - dmg;

          if (newMonsterHp <= 0) {
            const monster = prev.monsterType;
            const expGain = Math.floor(monster.expReward * prev.rebirthBonus * (1 + (prev.level - 1) * 0.1));
            const goldGain = Math.floor(monster.goldReward * prev.rebirthBonus * (1 + (prev.level - 1) * 0.05));
            const next = spawnMonster(prev.level);

            let newExp = prev.exp + expGain;
            let newLevel = prev.level;
            let gold = prev.gold + goldGain;

            while (newExp >= EXP_PER_LEVEL) {
              newExp -= EXP_PER_LEVEL;
              newLevel += 1;
              gold += Math.floor(5 + newLevel * 2);
            }

            if (newLevel !== prev.level && newLevel % BOSS_INTERVAL === 0) {
              const bossLv = Math.floor(newLevel / BOSS_INTERVAL);
              const bossMaxHp = Math.floor(100 * Math.pow(1.8, bossLv));
              return {
                ...prev, exp: newExp, level: newLevel, gold,
                isBossFight: true, bossHp: bossMaxHp, bossMaxHp, bossLevel: bossLv,
                isMonsterFight: false, monsterType: null, monstersDefeated: prev.monstersDefeated + 1,
              };
            }

            return {
              ...prev, exp: newExp, level: newLevel, gold,
              isMonsterFight: true, monsterHp: next.hp, monsterMaxHp: next.hp,
              monsterType: next.monster, monstersDefeated: prev.monstersDefeated + 1,
            };
          }

          return { ...prev, monsterHp: newMonsterHp };
        });
      } else {
        const clickValue = Math.floor(state.clickExp * state.rebirthBonus);
        spawnDamageText(clickValue, isCrit);

        if (Math.random() < 0.3) spawnDrop();

        setState((prev) => {
          let newExp = prev.exp + clickValue;
          let newLevel = prev.level;
          let gold = prev.gold + Math.floor(Math.random() * 3);

          while (newExp >= EXP_PER_LEVEL) {
            newExp -= EXP_PER_LEVEL;
            newLevel += 1;
            gold += Math.floor(5 + newLevel * 2);
          }

          if (newLevel !== prev.level && newLevel % BOSS_INTERVAL === 0) {
            const bossLv = Math.floor(newLevel / BOSS_INTERVAL);
            const bossMaxHp = Math.floor(100 * Math.pow(1.8, bossLv));
            return {
              ...prev,
              exp: newExp,
              level: newLevel,
              gold,
              isBossFight: true,
              bossHp: bossMaxHp,
              bossMaxHp,
              bossLevel: bossLv,
            };
          }

          return { ...prev, exp: newExp, level: newLevel, gold };
        });
      }
    },
    [state]
  );

  const useSkill = useCallback(
    (skillId: string) => {
      const now = Date.now();
      const skill = state.skills.find((s) => s.id === skillId);
      if (!skill || skill.unlockLevel > state.level) return;
      if (now - skill.lastUsed < skill.cooldown) return;
      if (!state.isBossFight && !state.isMonsterFight) return;

      setState((prev) => {
        const newSkills = prev.skills.map((s) =>
          s.id === skillId ? { ...s, lastUsed: now } : s
        );

        if (skillId === "double_attack") {
          // 공격력 2배: 10초 동안 모든 공격이 2배
          return {
            ...prev,
            skills: newSkills,
            doubleAttackActive: true,
            doubleAttackEndTime: now + 10000,
          };
        } else if (skillId === "auto_fever") {
          // 번개 광풍: 10초 동안 자동 공격
          return {
            ...prev,
            skills: newSkills,
            autoFeverActive: true,
            autoFeverEndTime: now + 10000,
          };
        }

        return { ...prev, skills: newSkills };
      });
    },
    [state]
  );

  const equipItem = (item: Item) => {
    try {
      if (!item || !item.slot) return;
      setState((prev) => {
        const slotKey = item.slot === "weapon" ? "equippedWeapon" : item.slot === "armor" ? "equippedArmor" : "equippedAccessory";
        const currentEquipped = prev[slotKey];
        let newInventory = prev.inventory.filter((i) => i.id !== item.id);
        if (currentEquipped) newInventory = [...newInventory, currentEquipped];
        const newState = { ...prev, [slotKey]: item, inventory: newInventory };
        newState.maxHp = getTotalHp(newState);
        newState.currentHp = Math.min(prev.currentHp, newState.maxHp);
        return newState;
      });
    } catch (e) {
      console.error("아이템 장착 오류:", e);
    }
  };

  const sellItem = (item: Item) => {
    const prices: Record<Rarity, number> = { common: 5, rare: 20, epic: 80, legendary: 300 };
    setState((prev) => ({
      ...prev,
      inventory: prev.inventory.filter((i) => i.id !== item.id),
      gold: prev.gold + prices[item.rarity],
    }));
  };

  const generateHoldHandler = (fn: () => void) => {
    return {
      onPointerDown: () => {
        fn();
        setIsHoldingAttack(true);
        if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
        holdIntervalRef.current = setInterval(() => {
          fn();
        }, 20);
      },
      onPointerUp: () => {
        setIsHoldingAttack(false);
        if (holdIntervalRef.current) {
          clearInterval(holdIntervalRef.current);
          holdIntervalRef.current = null;
        }
      },
      onPointerLeave: () => {
        setIsHoldingAttack(false);
        if (holdIntervalRef.current) {
          clearInterval(holdIntervalRef.current);
          holdIntervalRef.current = null;
        }
      },
    };
  };

  const upgradeClick = () => {
    const cost = getUpgradeCost(state.atkUpgradeCount);
    if (state.gold < cost) return;
    setState((prev) => {
      if (prev.gold < cost) return prev;
      return {
        ...prev,
        gold: prev.gold - cost,
        clickExp: prev.clickExp + 3,
        atkUpgradeCount: prev.atkUpgradeCount + 1,
      };
    });
  };

  const upgradeAuto = () => {
    const cost = getUpgradeCost(state.autoUpgradeCount);
    if (state.gold < cost) return;
    setState((prev) => {
      if (prev.gold < cost) return prev;
      return {
        ...prev,
        gold: prev.gold - cost,
        autoExp: prev.autoExp + 0.3,
        autoUpgradeCount: prev.autoUpgradeCount + 1,
      };
    });
  };

  const upgradeAtk = () => {
    if (state.gold < 30) return;
    setState((prev) => {
      if (prev.gold < 30) return prev;
      return { ...prev, gold: prev.gold - 30, baseAtk: prev.baseAtk + 2 };
    });
  };

  const upgradeDef = () => {
    if (state.gold < 30) return;
    setState((prev) => {
      if (prev.gold < 30) return prev;
      return { ...prev, gold: prev.gold - 30, baseDef: prev.baseDef + 2 };
    });
  };

  const upgradeHpStat = () => {
    if (state.gold < 40) return;
    setState((prev) => {
      if (prev.gold < 40) return prev;
      const newBaseHp = prev.baseHp + 10;
      const ns = { ...prev, gold: prev.gold - 40, baseHp: newBaseHp };
      ns.maxHp = getTotalHp(ns);
      ns.currentHp = ns.maxHp;
      return ns;
    });
  };

  const openChest = () => {
    if (!state.pendingChest) return;
    setChestOpening(true);
    setTimeout(() => {
      setChestItem(state.pendingChest);
      setState((prev) => ({
        ...prev,
        inventory: [...prev.inventory, prev.pendingChest!],
        pendingChest: null,
      }));
    }, 800);
  };

  const closeChest = () => {
    setShowChest(false);
    setChestItem(null);
    setChestOpening(false);
  };

  const rebirth = () => {
    if (state.level < REBIRTH_LEVEL) return;
    const next = spawnMonster(1);
    setState((prev) => ({
      ...getDefaultState(),
      started: true,
      rebirths: prev.rebirths + 1,
      rebirthBonus: prev.rebirthBonus + REBIRTH_BONUS,
      gold: Math.floor(prev.gold * 0.5) + prev.level * 50,
      skills: DEFAULT_SKILLS.map((s) => ({ ...s })),
      isMonsterFight: true,
      monsterHp: next.hp,
      monsterMaxHp: next.hp,
      monsterType: next.monster,
    }));
  };

  const startGame = () => setState({ ...getDefaultState(), started: true });
  const resetGame = () => { localStorage.removeItem(STORAGE_KEY); setState(getDefaultState()); };

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center pixel-grid" style={{ background: "#1a1a2e" }}>
        <p style={{ fontFamily: "'Press Start 2P', monospace", color: "#6b7280", fontSize: 12 }}>LOADING...</p>
      </div>
    );
  }

  // ─── Start Screen ─────────────────────────────────────────────────
  if (!state.started) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8 select-none pixel-grid" style={{ background: "#1a1a2e" }}>
        <div>
          <PixelCapybara size={128} />
        </div>
        <h1 className="text-center" style={{ fontSize: 16, color: "#fbbf24", textShadow: "2px 2px 0 #92400e" }}>
          카피바라 방치형 RPG
        </h1>
        <p className="text-center" style={{ fontSize: 8, color: "#9ca3af", maxWidth: 280 }}>
          도트 아트 세계에서 카피바라와 함께<br />모험을 떠나세요!
        </p>
        <button
          onClick={startGame}
          className="pixel-border cursor-pointer"
          style={{
            background: "linear-gradient(180deg, #22c55e, #15803d)",
            color: "#fff",
            border: "3px solid #166534",
            padding: "12px 32px",
            fontSize: 11,
          }}
        >
          ▶ GAME START
        </button>
      </div>
    );
  }

  // ─── Game Screen ──────────────────────────────────────────────────
  const totalAtk = getTotalAtk(state);
  const totalDef = getTotalDef(state);
  const totalHp = getTotalHp(state);
  const bossIdx = (state.bossLevel - 1) % BOSS_EMOJIS.length;

  return (
    <div className="flex h-screen flex-col items-center p-4 select-none pixel-grid" style={{ background: "#1a1a2e", overflow: "hidden" }}>
      {/* Header & Ad */}
      <div className="w-full max-w-md flex-shrink-0">
        <div className="flex items-center justify-between mb-3 px-2">
          <span style={{ fontSize: 11, color: "#fbbf24" }}>
            ▲ 카피바라 RPG
          </span>
          <span style={{ fontSize: 10, color: "#fbbf24" }}>
            ◯ {state.gold}
          </span>
        </div>

        {/* Ad Banner */}
        <div className="pixel-border p-3 mb-3 text-center" style={{ background: "linear-gradient(180deg, #4f46e5, #2563eb)", borderColor: "#60a5fa" }}>
          <div style={{ fontSize: 10, color: "#fef3c7", fontWeight: "bold" }}>🎮 다음 게임 준비중...</div>
          <div style={{ fontSize: 8, color: "#e0e7ff", marginTop: 3 }}>슬라임 클리커 | 타워 디펜스 | 자동 거래소</div>
        </div>

        {/* Stats Bar */}
        <div
          className="pixel-border mb-3 p-3 flex-shrink-0 w-full max-w-md"
          style={{ background: "#0f172a", borderColor: "#334155" }}
        >
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <div style={{ fontSize: 13, color: "#4ade80", fontWeight: "bold" }}>Lv.{state.level}</div>
              <div style={{ fontSize: 9, color: "#6b7280" }}>레벨</div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: "#f87171", fontWeight: "bold" }}>▲{totalAtk}</div>
              <div style={{ fontSize: 9, color: "#6b7280" }}>공격</div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: "#60a5fa", fontWeight: "bold" }}>■{totalDef}</div>
              <div style={{ fontSize: 9, color: "#6b7280" }}>방어</div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: "#f472b6", fontWeight: "bold" }}>●{totalHp}</div>
              <div style={{ fontSize: 9, color: "#6b7280" }}>체력</div>
            </div>
          </div>
        </div>

        {/* EXP Bar */}
        <div className="mb-3 flex-shrink-0 w-full max-w-md">
          <div className="flex justify-between" style={{ fontSize: 8, color: "#9ca3af", marginBottom: 3 }}>
            <span>EXP</span>
            <span>{Math.floor(state.exp)}/{EXP_PER_LEVEL}</span>
          </div>
          <div className="pixel-bar" style={{ height: 10, background: "#1e293b" }}>
            <div
              style={{
                height: "100%",
                width: `${(state.exp / EXP_PER_LEVEL) * 100}%`,
                background: "linear-gradient(90deg, #22c55e, #3b82f6)",
                transition: "width 0.3s",
              }}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 w-full max-w-md flex-shrink-0 mt-2" style={{ order: 1000 }}>
          {(["battle", "inventory", "info"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="pixel-border-sm flex-1 py-2 cursor-pointer"
              style={{
                background: activeTab === tab ? "#334155" : "#0f172a",
                borderColor: activeTab === tab ? "#60a5fa" : "#1e293b",
                color: activeTab === tab ? "#fff" : "#6b7280",
                fontSize: 9,
              }}
            >
              {tab === "battle" ? "▲전투" : tab === "inventory" ? "◻인벤" : "◈정보"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden w-full max-w-md flex flex-col" style={{ order: 2 }}>
        {/* ─── Battle Tab ───────────────────────────────────── */}
        {activeTab === "battle" && (
          <div className="h-full overflow-hidden flex flex-col">
            {/* Battle Area */}
            <div
              ref={battleAreaRef}
              onPointerDown={bossEntering ? undefined : (e) => handleClick(e as any)}
              className="pixel-border relative overflow-hidden cursor-pointer mb-2 flex-1"
              style={{
                backgroundImage: "url('/indie-games/bg-castle.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderColor: state.isBossFight ? "#dc2626" : state.isMonsterFight ? "#22c55e" : "#334155",
                animation: bossEntering ? "boss-entrance-shake 0.4s ease-in-out 1s 3" : undefined,
                minHeight: "200px",
              }}
            >
              {/* Red flash overlay during boss entrance */}
              {bossEntering && (
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "radial-gradient(circle, rgba(220,38,38,0.3), transparent)",
                  animation: "boss-entrance-flash 2s ease-out forwards",
                  zIndex: 30,
                  pointerEvents: "none",
                }} />
              )}

              {/* Capybara */}
              <div
                style={{
                  position: "absolute",
                  bottom: 10,
                  left: 40,
                  animation: isAttacking
                    ? ((state.isBossFight || state.isMonsterFight) ? "capy-slash 0.4s ease-out" : "pixel-attack 0.3s ease-out")
                    : undefined,
                }}
              >
                <PixelCapybara size={66} isAttacking={isAttacking} animState={capybaraAnimState} />
              </div>

              {/* Boss or Monster */}
              {state.isBossFight ? (
                <div
                  className={bossEntering ? "" : "boss-clickable"}
                  onClick={(e) => {
                    if (bossEntering) return;
                    e.stopPropagation();
                    handleClick(e);
                  }}
                  style={{
                    position: "absolute",
                    bottom: 10,
                    right: 30,
                    animation: bossEntering
                      ? "boss-entrance 1s cubic-bezier(0.22, 1, 0.36, 1) forwards"
                      : bossHurt
                        ? "boss-hit-shake 0.35s ease-out"
                        : undefined,
                    transformOrigin: "bottom center",
                    zIndex: 10,
                  }}
                >
                  <PixelBoss bossIndex={bossIdx} size={122} />
                  {/* Dust effect during entrance */}
                  {bossEntering && (
                    <div style={{
                      position: "absolute",
                      bottom: -4,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 60,
                      height: 12,
                      borderRadius: "50%",
                      background: "radial-gradient(ellipse, rgba(200,180,150,0.6), transparent)",
                      animation: "boss-dust 0.6s ease-out infinite",
                    }} />
                  )}
                </div>
              ) : state.isMonsterFight && state.monsterType ? (
                <div
                  className="monster-clickable"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick(e);
                  }}
                  style={{
                    position: "absolute",
                    bottom: 10,
                    right: 40,
                    animation: monsterDying
                      ? "monster-death 0.6s ease-out forwards"
                      : monsterHurt
                        ? "boss-hit-shake 0.35s ease-out"
                        : undefined,
                    transformOrigin: "bottom center",
                    zIndex: 10,
                  }}
                >
                  <PixelMonster type={state.monsterType.type} size={95} />
                </div>
              ) : (
                <div
                  style={{
                    position: "absolute",
                    bottom: 14,
                    right: 50,
                    fontSize: 40,
                  }}
                >
                  🌿
                </div>
              )}

              {/* Damage Texts */}
              {damageTexts.map((d) => (
                <div
                  key={d.id}
                  style={{
                    position: "absolute",
                    left: d.x,
                    top: d.y,
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: d.isCrit ? 14 : 10,
                    color: d.isCrit ? "#fbbf24" : "#fff",
                    textShadow: d.isCrit ? "0 0 8px #f59e0b" : "1px 1px 0 #000",
                    animation: "pixel-float-up 1s ease-out forwards",
                    pointerEvents: "none",
                    zIndex: 20,
                  }}
                >
                  {d.isCrit ? "✦" : ""}{d.value}
                </div>
              ))}

              {/* Item Drops */}
              {droppedItems.map((d) => (
                <div
                  key={d.id}
                  style={{
                    position: "absolute",
                    left: d.x,
                    top: d.y,
                    fontSize: 18,
                    animation: "pixel-drop 1.5s ease-out forwards",
                    pointerEvents: "none",
                    zIndex: 15,
                    filter: d.rarity === "epic" ? "drop-shadow(0 0 4px #a855f7)" : d.rarity === "rare" ? "drop-shadow(0 0 3px #3b82f6)" : "none",
                  }}
                >
                  {d.emoji}
                </div>
              ))}

              {/* Explosions */}
              {explosions.map((e) => (
                <div
                  key={e.id}
                  style={{
                    position: "absolute",
                    left: e.x - 20,
                    top: e.y - 20,
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, #fbbf24, #f97316, transparent)",
                    animation: "pixel-explode 0.6s ease-out forwards",
                    pointerEvents: "none",
                    zIndex: 25,
                  }}
                />
              ))}

              {/* Boss label */}
              {state.isBossFight && (
                <div
                  style={{
                    position: "absolute",
                    top: 8,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 8,
                    color: "#f87171",
                    animation: "pixel-blink 1s infinite",
                  }}
                >
                  ⚠ BOSS: {BOSS_NAMES[bossIdx]} Lv.{state.bossLevel}
                </div>
              )}

              {/* Monster label */}
              {!state.isBossFight && state.isMonsterFight && state.monsterType && (
                <div
                  style={{
                    position: "absolute",
                    top: 8,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 7,
                    color: "#4ade80",
                  }}
                >
                  {state.monsterType.emoji} {state.monsterType.name}
                  <span style={{ color: "#ef4444", marginLeft: 8 }}>▲{Math.floor(state.monsterType.baseAtk * (1 + (state.level - 1) * 0.1))}</span>
                  <span style={{ color: "#6b7280", marginLeft: 8 }}>처치: {state.monstersDefeated}</span>
                </div>
              )}
            </div>

            {/* Boss HP Bar */}
            {state.isBossFight && (
              <div className="mb-2">
                <div className="flex justify-between" style={{ fontSize: 6, color: "#f87171", marginBottom: 2 }}>
                  <span>{BOSS_EMOJIS[bossIdx]} {BOSS_NAMES[bossIdx]}</span>
                  <span>{Math.max(0, state.bossHp)}/{state.bossMaxHp}</span>
                </div>
                <div className="pixel-bar" style={{ height: 6, background: "#1e293b" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.max(0, (state.bossHp / state.bossMaxHp) * 100)}%`,
                      background: "linear-gradient(90deg, #dc2626, #f97316)",
                      transition: "width 0.2s",
                    }}
                  />
                </div>
              </div>
            )}

            {/* Monster HP Bar */}
            {!state.isBossFight && state.isMonsterFight && state.monsterType && (
              <div className="mb-2">
                <div className="flex justify-between" style={{ fontSize: 6, color: "#4ade80", marginBottom: 2 }}>
                  <span>{state.monsterType.emoji} {state.monsterType.name}</span>
                  <span>{Math.max(0, state.monsterHp)}/{state.monsterMaxHp}</span>
                </div>
                <div className="pixel-bar" style={{ height: 6, background: "#1e293b" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.max(0, (state.monsterHp / state.monsterMaxHp) * 100)}%`,
                      background: state.monsterHp / state.monsterMaxHp > 0.5
                        ? "linear-gradient(90deg, #22c55e, #4ade80)"
                        : state.monsterHp / state.monsterMaxHp > 0.25
                          ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
                          : "linear-gradient(90deg, #dc2626, #f87171)",
                      transition: "width 0.2s",
                    }}
                  />
                </div>
              </div>
            )}

            {/* Attack Button */}
            {(state.isBossFight || state.isMonsterFight) && (
              <button
                onPointerDown={!bossEntering ? (e) => handleClick(e as any) : undefined}
                disabled={bossEntering}
                className="pixel-border w-full mb-2 flex-shrink-0"
                style={{
                  background: state.isBossFight
                    ? "linear-gradient(180deg, #dc2626, #991b1b)"
                    : "linear-gradient(180deg, #2563eb, #1d4ed8)",
                  borderColor: state.isBossFight ? "#f87171" : "#3b82f6",
                  padding: "14px 10px",
                  fontSize: 13,
                  color: "#fff",
                  textShadow: "1px 1px 0 #000",
                  letterSpacing: 2,
                  cursor: bossEntering ? "not-allowed" : "pointer",
                  opacity: bossEntering ? 0.6 : 1,
                  transition: "opacity 0.1s ease",
                }}
              >
                ▲ 공격 <span style={{ fontSize: 10, color: state.isBossFight ? "#fca5a5" : "#93c5fd" }}>({state.baseAtk} × {state.rebirthBonus.toFixed(2)} = {getTotalAtk(state)} DMG)</span>
              </button>
            )}

            {/* Skills (in battle) */}
            {(state.isBossFight || state.isMonsterFight) && (
              <div className="grid grid-cols-2 gap-2 mb-2 flex-shrink-0">
                {state.skills.map((skill) => {
                  const unlocked = state.level >= skill.unlockLevel;
                  const cd = skillCooldowns[skill.id] || 0;
                  const ready = cd === 0 && unlocked;
                  const cdPercent = unlocked ? (cd / skill.cooldown) * 100 : 100;

                  return (
                    <button
                      key={skill.id}
                      onClick={() => useSkill(skill.id)}
                      disabled={!ready}
                      className="pixel-border-sm relative overflow-hidden cursor-pointer"
                      style={{
                        background: ready ? "#1e3a5f" : "#0f172a",
                        borderColor: ready ? "#3b82f6" : "#1e293b",
                        padding: "12px 6px",
                        fontSize: 10,
                        color: ready ? "#fff" : "#4b5563",
                        opacity: unlocked ? 1 : 0.4,
                      }}
                    >
                      {/* Cooldown overlay */}
                      {cd > 0 && unlocked && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: `${cdPercent}%`,
                            background: "rgba(0,0,0,0.6)",
                            transition: "height 0.1s",
                          }}
                        />
                      )}
                      <div style={{ position: "relative", zIndex: 1 }}>
                        <div style={{ fontSize: 18 }}>{skill.emoji}</div>
                        <div>{skill.name}</div>
                        {!unlocked && <div style={{ fontSize: 6, color: "#6b7280" }}>Lv.{skill.unlockLevel}</div>}
                        {cd > 0 && unlocked && <div style={{ fontSize: 6, color: "#f87171" }}>{(cd / 1000).toFixed(1)}s</div>}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Upgrades */}
            <div className="grid grid-cols-3 gap-1 mb-2 flex-shrink-0">
              {(() => {
                const atkCost = getUpgradeCost(state.atkUpgradeCount);
                return (
                  <button {...generateHoldHandler(upgradeClick)} disabled={state.gold < atkCost}
                    className="pixel-border-sm cursor-pointer disabled:opacity-40"
                    style={{ background: "#1e293b", borderColor: "#3b82f6", padding: "9px 5px", fontSize: 9, color: "#93c5fd" }}>
                    ▲클릭+3<br /><span style={{ color: "#fbbf24" }}>◯{atkCost}</span>
                  </button>
                );
              })()}
              {(() => {
                const autoCost = getUpgradeCost(state.autoUpgradeCount);
                return (
                  <button {...generateHoldHandler(upgradeAuto)} disabled={state.gold < autoCost}
                    className="pixel-border-sm cursor-pointer disabled:opacity-40"
                    style={{ background: "#1e293b", borderColor: "#8b5cf6", padding: "9px 5px", fontSize: 9, color: "#c4b5fd" }}>
                    ⏱자동+0.3<br /><span style={{ color: "#fbbf24" }}>◯{autoCost}</span>
                  </button>
                );
              })()}
              <button {...generateHoldHandler(upgradeAtk)} disabled={state.gold < 30}
                className="pixel-border-sm cursor-pointer disabled:opacity-40"
                style={{ background: "#1e293b", borderColor: "#ef4444", padding: "9px 5px", fontSize: 9, color: "#fca5a5" }}>
                ▲공격+2<br /><span style={{ color: "#fbbf24" }}>◯30</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2 flex-shrink-0">
              <button {...generateHoldHandler(upgradeDef)} disabled={state.gold < 30}
                className="pixel-border-sm cursor-pointer disabled:opacity-40"
                style={{ background: "#1e293b", borderColor: "#3b82f6", padding: "9px 5px", fontSize: 9, color: "#93c5fd" }}>
                ■방어+2 <span style={{ color: "#fbbf24" }}>◯30</span>
              </button>
              <button {...generateHoldHandler(upgradeHpStat)} disabled={state.gold < 40}
                className="pixel-border-sm cursor-pointer disabled:opacity-40"
                style={{ background: "#1e293b", borderColor: "#ec4899", padding: "9px 5px", fontSize: 9, color: "#f9a8d4" }}>
                ●체력+10 <span style={{ color: "#fbbf24" }}>◯40</span>
              </button>
            </div>

          </div>
        )}

        {/* ─── Inventory Tab ────────────────────────────────── */}
        {activeTab === "inventory" && (
          <div className="h-full flex flex-col">
            {/* Equipment Slots */}
            <div className="pixel-border p-2 mb-2 flex-shrink-0" style={{ background: "#0f172a", borderColor: "#334155" }}>
              <div style={{ fontSize: 8, color: "#fbbf24", marginBottom: 4 }}>▲ 장비</div>
              <div className="grid grid-cols-3 gap-2">
                {(["weapon", "armor", "accessory"] as const).map((slot) => {
                  const slotKey = slot === "weapon" ? "equippedWeapon" : slot === "armor" ? "equippedArmor" : "equippedAccessory";
                  const item = state[slotKey];
                  const slotName = slot === "weapon" ? "무기" : slot === "armor" ? "방어구" : "장신구";
                  return (
                    <div
                      key={slot}
                      className={`pixel-border-sm p-1 text-center ${item ? RARITY_BG[item.rarity] : "border-gray-700 bg-gray-900/50"}`}
                      style={{
                        animation: item?.rarity === "legendary" ? "rarity-glow-legendary 2s infinite" : item?.rarity === "epic" ? "rarity-glow-epic 2s infinite" : "none",
                      }}
                    >
                      <div style={{ fontSize: 20 }}>{item ? item.emoji : "—"}</div>
                      <div style={{ fontSize: 6, color: item ? RARITY_COLORS[item.rarity] : "#4b5563" }}>
                        {item ? item.name : slotName}
                      </div>
                      {item && (
                        <div style={{ fontSize: 6, color: "#9ca3af", marginTop: 2 }}>
                          {item.atk > 0 && <span style={{ color: "#f87171" }}>▲{item.atk} </span>}
                          {item.def > 0 && <span style={{ color: "#60a5fa" }}>■{item.def} </span>}
                          {item.hp > 0 && <span style={{ color: "#f472b6" }}>●{item.hp}</span>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Inventory */}
            <div className="pixel-border p-2 flex-1 overflow-y-auto flex flex-col" style={{ background: "#0f172a", borderColor: "#334155" }}>
              <div className="flex justify-between mb-2 flex-shrink-0">
                <span style={{ fontSize: 9, color: "#fbbf24" }}>◻ 인벤토리 ({state.inventory.length})</span>
              </div>
              <div className="w-full">
              {state.inventory.length === 0 ? (
                <div className="text-center py-4" style={{ fontSize: 7, color: "#4b5563" }}>
                  아이템이 없습니다
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {state.inventory.map((item) => {
                    if (!item || !item.rarity) return null;
                    return (
                    <div
                      key={item.id}
                      className={`pixel-border p-4 text-center ${RARITY_BG[item.rarity] || "bg-gray-800"}`}
                      style={{
                        animation: item.rarity === "legendary" ? "rarity-glow-legendary 1.5s infinite" : item.rarity === "epic" ? "rarity-glow-epic 1.5s infinite" : "none",
                        boxShadow: item.rarity === "legendary" ? "0 0 10px rgba(255, 215, 0, 0.5)" : item.rarity === "epic" ? "0 0 8px rgba(168, 85, 247, 0.4)" : "none",
                      }}
                    >
                      <div style={{ fontSize: 40, marginBottom: 6 }}>{item.emoji || "?"}</div>
                      <div style={{ fontSize: 12, color: RARITY_COLORS[item.rarity] || "#fff", wordBreak: "break-all", marginBottom: 4, fontWeight: "bold" }}>
                        {item.name || "Unknown"}
                      </div>
                      <div style={{ fontSize: 10, color: "#9ca3af", marginBottom: 8 }}>
                        [{RARITY_NAMES[item.rarity] || "?"}]
                      </div>
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => equipItem(item)}
                          className="cursor-pointer flex-1 pixel-border-sm"
                          style={{ fontSize: 11, color: "#4ade80", background: "rgba(34,197,94,0.3)", padding: "8px 6px", borderColor: "#4ade80", fontWeight: "bold" }}
                        >
                          장착
                        </button>
                        <button
                          onClick={() => sellItem(item)}
                          className="cursor-pointer flex-1 pixel-border-sm"
                          style={{ fontSize: 11, color: "#fbbf24", background: "rgba(251,191,36,0.3)", padding: "8px 6px", borderColor: "#fbbf24", fontWeight: "bold" }}
                        >
                          판매
                        </button>
                      </div>
                    </div>
                    );
                  })}
                </div>
              )}
              </div>
            </div>
          </div>
        )}

        {/* ─── Info Tab ───────────────────────────────────── */}
        {activeTab === "info" && (
          <div className="h-full overflow-hidden flex flex-col">
            {/* Level & Rebirth Info */}
            <div className="pixel-border p-2 mb-2" style={{ background: "#0f172a", borderColor: "#334155" }}>
              <div style={{ fontSize: 10, color: "#4ade80", marginBottom: 4 }}>⬆ 레벨 정보</div>
              <div style={{ fontSize: 10, color: "#fff", marginBottom: 2 }}>
                현재: <span style={{ color: "#4ade80" }}>{state.level}</span> 
              </div>
              <div style={{ fontSize: 9, color: "#9ca3af" }}>
                배율 x{state.rebirthBonus.toFixed(2)} | 환생 {state.rebirths}회
              </div>
            </div>

            {/* Rebirth Button */}
            {state.level >= REBIRTH_LEVEL && (
              <button
                onClick={rebirth}
                className="pixel-border w-full cursor-pointer mb-2"
                style={{
                  background: "linear-gradient(180deg, #f59e0b, #dc2626)",
                  borderColor: "#fbbf24",
                  padding: "8px",
                  fontSize: 10,
                  color: "#fff",
                  animation: "pixel-blink 2s infinite",
                }}
              >
                ★ 환생 +{(REBIRTH_BONUS * 100).toFixed(0)}% ★
              </button>
            )}

            {/* Stat info */}
            <div className="pixel-border p-2 mb-2" style={{ background: "#0f172a", borderColor: "#334155" }}>
              <div style={{ fontSize: 10, color: "#fbbf24", marginBottom: 2 }}>📊 정보</div>
              <div className="grid grid-cols-2 gap-2" style={{ fontSize: 8 }}>
                <div style={{ color: "#f87171" }}>기본 공격력: {state.baseAtk}</div>
                <div style={{ color: "#60a5fa" }}>기본 방어력: {state.baseDef}</div>
                <div style={{ color: "#f472b6" }}>기본 체력: {state.baseHp}</div>
                <div style={{ color: "#fbbf24" }}>환생 배율: x{state.rebirthBonus.toFixed(2)}</div>
                <div style={{ color: "#4ade80" }}>클릭 EXP: {state.clickExp}</div>
                <div style={{ color: "#c4b5fd" }}>자동 EXP: +{(state.autoExp * state.rebirthBonus).toFixed(1)}/초</div>
                <div style={{ color: "#f87171" }}>총 공격력: {totalAtk}</div>
                <div style={{ color: "#60a5fa" }}>총 방어력: {totalDef}</div>
              </div>
            </div>

            {/* Reset button */}
            <div className="text-center">
              <button
                onClick={resetGame}
                className="pixel-border w-full cursor-pointer"
                style={{ 
                  fontSize: 9, 
                  color: "#ef4444", 
                  background: "#1e293b",
                  borderColor: "#7f1d1d",
                  padding: "8px",
                  marginTop: "0"
                }}
              >
                ◉ 게임 리셋
              </button>
            </div>
          </div>
        )}
        </div>
      </div>

      {/* ─── Chest Modal ──────────────────────────────────── */}
      {showChest && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
          onClick={chestItem ? closeChest : undefined}
        >
          <div
            className="pixel-border text-center p-6"
            style={{
              background: "#1a1a2e",
              borderColor: chestItem ? RARITY_COLORS[chestItem.rarity] : "#fbbf24",
              minWidth: 250,
              animation: chestOpening && !chestItem ? "chest-open 0.8s ease-out" : "pixel-slide-in 0.3s ease-out",
            }}
          >
            {!chestItem ? (
              <>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
                <div style={{ fontSize: 10, color: "#fbbf24", marginBottom: 12 }}>보스 클리어!</div>
                <button
                  onClick={openChest}
                  className="pixel-border cursor-pointer"
                  style={{
                    background: "linear-gradient(180deg, #f59e0b, #d97706)",
                    borderColor: "#b45309",
                    padding: "8px 24px",
                    fontSize: 9,
                    color: "#fff",
                  }}
                >
                  ▶ 상자 열기
                </button>
              </>
            ) : (
              <>
                <div
                  style={{
                    fontSize: 56,
                    marginBottom: 8,
                    animation: "pixel-slide-in 0.5s ease-out",
                  }}
                >
                  {chestItem.emoji}
                </div>
                <div style={{ fontSize: 10, color: RARITY_COLORS[chestItem.rarity], marginBottom: 4, textShadow: `0 0 8px ${RARITY_COLORS[chestItem.rarity]}` }}>
                  [{RARITY_NAMES[chestItem.rarity]}]
                </div>
                <div style={{ fontSize: 11, color: "#fff", marginBottom: 8 }}>
                  {chestItem.name}
                </div>
                <div style={{ fontSize: 7, color: "#9ca3af", marginBottom: 12 }}>
                  {chestItem.atk > 0 && <span style={{ color: "#f87171" }}>▲공격+{chestItem.atk} </span>}
                  {chestItem.def > 0 && <span style={{ color: "#60a5fa" }}>■방어+{chestItem.def} </span>}
                  {chestItem.hp > 0 && <span style={{ color: "#f472b6" }}>●체력+{chestItem.hp} </span>}
                </div>
                <div style={{ fontSize: 7, color: "#6b7280" }}>
                  탭하여 닫기
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
