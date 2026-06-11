/** 卡通简笔画风格 SVG 图标集 */

interface IconProps {
  size?: number;
  className?: string;
}

// ──── 气球（标题）────
export function BalloonIcon({ size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <ellipse cx="13" cy="13" rx="9" ry="11" fill="#FF8A80" stroke="#2C3E50" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8 10 C5 6, 7 2, 13 3" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <path d="M13 24 L10 30" stroke="#2C3E50" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16 24 L19 30" stroke="#2C3E50" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="14" cy="30" r="1.5" fill="#2C3E50" />
    </svg>
  );
}

// ──── 管理（齿轮 + 铅笔）────
export function SettingsIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="5" fill="none" stroke="#2C3E50" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="3 2" />
      <circle cx="12" cy="12" r="2" fill="#B39DDB" stroke="#2C3E50" strokeWidth="1.5" />
      <path d="M12 5 L12 2" stroke="#2C3E50" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 19 L12 22" stroke="#2C3E50" strokeWidth="2" strokeLinecap="round" />
      <path d="M5 12 L2 12" stroke="#2C3E50" strokeWidth="2" strokeLinecap="round" />
      <path d="M19 12 L22 12" stroke="#2C3E50" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ──── 配对卡片 ────
export function MatchIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="5" width="8" height="6" rx="2" fill="#FF8A80" stroke="#2C3E50" strokeWidth="1.6" />
      <text x="6" y="9.5" fontSize="5" fontWeight="bold" fill="#2C3E50" textAnchor="middle">cat</text>
      <rect x="14" y="13" width="8" height="6" rx="2" fill="#81C784" stroke="#2C3E50" strokeWidth="1.6" />
      <path d="M11 10 L13 14" stroke="#2C3E50" strokeWidth="1.5" strokeDasharray="2 2" />
    </svg>
  );
}

// ──── 看词选图（眼睛 + 图片）────
export function ImagePickIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="1" y="6" width="15" height="13" rx="2" fill="#FFCC80" stroke="#2C3E50" strokeWidth="1.6" />
      <circle cx="8" cy="11" r="2" fill="#FF8A80" stroke="#2C3E50" strokeWidth="1.2" />
      <path d="M1 16 L6 13 L10 16 L15 12 L16 14" fill="none" stroke="#2C3E50" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="19" cy="10" r="4" fill="white" stroke="#2C3E50" strokeWidth="1.6" />
      <circle cx="19" cy="10" r="1.5" fill="#2C3E50" />
    </svg>
  );
}

// ──── 看图选词（写字手）────
export function WordPickIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="1" y="6" width="15" height="13" rx="2" fill="#B39DDB" stroke="#2C3E50" strokeWidth="1.6" />
      <circle cx="7" cy="11" r="2" fill="#FF8A80" stroke="#2C3E50" strokeWidth="1.2" />
      <path d="M1 16 L6 13 L10 16 L15 12 L16 14" fill="none" stroke="#2C3E50" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 20 L20 8 L22 9 L19 21 Z" fill="#FFD93D" stroke="#2C3E50" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

// ──── 刷新 ────
export function RefreshIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M14 4 A7 7 0 0 0 6 6 A7 7 0 0 0 5 13"
        fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M5 13 L2 12 M5 13 L4 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ──── 关闭 ✕ ────
export function CloseIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <path d="M4 4 L14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M14 4 L4 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ──── 书本（空状态）────
export function BookIcon({ size = 56 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      <path d="M8 10 L28 6 L48 10 L48 46 L28 42 L8 46 Z"
        fill="#FFCC80" stroke="#2C3E50" strokeWidth="2" strokeLinejoin="round" />
      <path d="M28 6 L28 42" stroke="#2C3E50" strokeWidth="2" />
      <line x1="16" y1="18" x2="24" y2="17" stroke="#2C3E50" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="24" x2="24" y2="23" stroke="#2C3E50" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="32" y1="17" x2="40" y2="18" stroke="#2C3E50" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="32" y1="23" x2="40" y2="24" stroke="#2C3E50" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ──── 上传 ────
export function UploadIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M10 14 L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 8 L10 4 L14 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3" y="14" width="14" height="4" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

// ──── 导出 / 下载 ────
export function ExportIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M10 4 L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 10 L10 14 L14 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3" y="14" width="14" height="4" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

// ──── 星星（庆祝）────
export function StarIcon({ size = 72 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none">
      <path d="M36 6 L42 28 L66 28 L46 40 L52 62 L36 48 L20 62 L26 40 L6 28 L30 28 Z"
        fill="#FFD93D" stroke="#2C3E50" strokeWidth="2.2" strokeLinejoin="round" />
      <circle cx="36" cy="34" r="3" fill="#2C3E50" />
      <circle cx="36" cy="34" r="1" fill="white" />
      <path d="M32 38 Q36 44 40 38" fill="none" stroke="#2C3E50" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ──── 加号 ────
export function PlusIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <path d="M9 3 L9 15" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M3 9 L15 9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

// ──── 勾选 ✓ ────
export function CheckIcon({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <path d="M4 11 L9 17 L18 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ──── 错误 ✕ 图标 ────
export function CrossIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M5 5 L15 15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M15 5 L5 15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
