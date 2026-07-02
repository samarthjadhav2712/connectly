const CACHE_PREFIX = "connectly-avatar:";

const AVATAR_COLORS = [
  "2563eb",
  "0f766e",
  "7c3aed",
  "ea580c",
  "dc2626",
  "0891b2",
  "15803d",
  "b45309",
];

const isBrowser = typeof window !== "undefined";

const readCache = (cacheKey) => {
  if (!isBrowser) return null;

  try {
    return window.localStorage.getItem(`${CACHE_PREFIX}${cacheKey}`);
  } catch {
    return null;
  }
};

const writeCache = (cacheKey, value) => {
  if (!isBrowser || !value) return;

  try {
    window.localStorage.setItem(`${CACHE_PREFIX}${cacheKey}`, value);
  } catch {
    // ignore storage quota / privacy mode issues
  }
};

const buildCacheKey = (user) => {
  if (!user) return "guest";
  // Always use _id if available - it's the most reliable identifier
  return user._id || user.email || user.fullName || "user";
};

const hashSeed = (seedValue) => {
  let hash = 0;

  for (const char of String(seedValue || "user")) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }

  return hash;
};

const getInitials = (labelValue) => {
  const name = String(labelValue || "User").trim();

  if (!name) return "U";

  const parts = name.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] || "U";
  const second = parts.length > 1 ? parts[parts.length - 1]?.[0] : parts[0]?.[1];

  return `${first}${second || ""}`.toUpperCase().slice(0, 2);
};

export const createAvatarDataUri = (seedValue, labelValue) => {
  const seed = String(seedValue || "user");
  const label = getInitials(labelValue || seed);
  const color = AVATAR_COLORS[hashSeed(seed) % AVATAR_COLORS.length];
  const accent = AVATAR_COLORS[hashSeed(`${seed}-accent`) % AVATAR_COLORS.length];

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-label="${label}">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#${color}" />
          <stop offset="100%" stop-color="#${accent}" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="60" fill="url(#bg)" />
      <circle cx="60" cy="46" r="20" fill="rgba(255,255,255,0.18)" />
      <path d="M28 102c5-20 20-30 32-30s27 10 32 30" fill="rgba(255,255,255,0.18)" />
      <text x="50%" y="63%" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="36" font-weight="700" fill="#ffffff" letter-spacing="1">${label}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.trim())}`;
};

export const getAvatarSrc = (user) => {
  const cacheKey = buildCacheKey(user);
  const cachedSrc = readCache(cacheKey);

  if (cachedSrc) {
    return cachedSrc;
  }

  if (user?.profilePic && user.profilePic.startsWith("data:image/")) {
    writeCache(cacheKey, user.profilePic);
    return user.profilePic;
  }

  const generatedSrc = createAvatarDataUri(cacheKey, user?.fullName || user?.email || "User");
  writeCache(cacheKey, generatedSrc);
  return generatedSrc;
};

export const cacheAvatarSrc = (user, src) => {
  if (!src) return;

  const cacheKey = buildCacheKey(user);
  writeCache(cacheKey, src);
};