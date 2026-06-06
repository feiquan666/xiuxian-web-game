import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PACK_ROOT = join(__dirname, '..');
const GENERATED_AT = '2026-06-06';

const palette = {
  ink: '#17241f',
  muted: '#65706b',
  paper: '#fffefa',
  mist: '#eaf2ee',
  jade: '#2f735f',
  pine: '#264f46',
  amber: '#b9872c',
  cinnabar: '#9a3f3f',
  indigo: '#4f587a',
  blue: '#375e91',
  gold: '#d5a84b',
  violet: '#5c517f',
  herb: '#79a86d',
  dark: '#222737',
};

const categoryFolders = {
  actions: 'icons/actions',
  resources: 'icons/resources',
  items: 'icons/items',
  realms: 'icons/realms',
  'npc-badges': 'icons/npc-badges',
  'status-effects': 'icons/status-effects',
};

const actions = [
  icon('cultivate', '修炼', 'actions', 'meditate', 'jade', '修炼按钮图标，表现运转周天和灵气入体。'),
  icon('seclusion', '闭关', 'actions', 'cave', 'pine', '闭关按钮图标，表现洞府封关和静修。'),
  icon('travel', '外出历练', 'actions', 'path', 'amber', '外出历练按钮图标，表现山路远行和机缘。'),
  icon('explore-secret-realm', '探索秘境', 'actions', 'gate', 'indigo', '探索秘境按钮图标，表现秘境石门和未知风险。'),
  icon('breakthrough', '突破境界', 'actions', 'breakthrough', 'gold', '突破境界按钮图标，表现灵光破障。'),
  icon('refine-pill', '炼丹', 'actions', 'cauldron', 'amber', '炼丹按钮图标，表现丹炉和炉火。'),
  icon('heal', '疗伤', 'actions', 'heal', 'jade', '疗伤按钮图标，表现温养经脉。'),
  icon('suppress-heart-demon', '压制心魔', 'actions', 'suppress', 'cinnabar', '压制心魔按钮图标，表现镇压魔念。'),
  icon('buy-pill', '购买丹药', 'actions', 'market', 'blue', '购买丹药按钮图标，表现坊市交易。'),
];

const resources = [
  icon('cultivation', '修为', 'resources', 'spiral', 'jade', '修为资源图标，表现灵气周天循环。'),
  icon('spirit-stones', '灵石', 'resources', 'stones', 'jade', '灵石资源图标，表现晶石灵光。'),
  icon('life-span', '寿元', 'resources', 'life-wheel', 'gold', '寿元属性图标，表现命轮和寿元气。'),
  icon('combat-power', '战力', 'resources', 'blade', 'cinnabar', '战力属性图标，表现锋芒和威压。'),
  icon('luck', '气运', 'resources', 'cloud-star', 'amber', '气运属性图标，表现云纹和星点。'),
  icon('comprehension', '悟性', 'resources', 'mind-light', 'indigo', '悟性属性图标，表现心灯开悟。'),
  icon('aptitude', '根骨', 'resources', 'root-bone', 'pine', '根骨属性图标，表现灵根和骨纹。'),
  icon('dao-heart', '道心', 'resources', 'dao-heart', 'jade', '道心属性图标，表现心印稳固。'),
  icon('heart-demon', '心魔', 'resources', 'demon', 'cinnabar', '心魔状态图标，表现魔影和反噬。'),
  icon('injury', '伤势', 'resources', 'crack', 'cinnabar', '伤势状态图标，表现裂纹和血色。'),
  icon('reputation', '声望', 'resources', 'seal', 'amber', '声望属性图标，表现名帖和印记。'),
  icon('insight', '意境', 'resources', 'moon-water', 'indigo', '意境资源图标，表现月影入水。'),
  icon('law', '法则', 'resources', 'law-lines', 'blue', '法则资源图标，表现规则线和天地纹。'),
  icon('origin', '本源', 'resources', 'origin-orb', 'gold', '本源资源图标，表现本源光轮。'),
  icon('tribulation-resistance', '天劫抗性', 'resources', 'shield-lightning', 'blue', '天劫抗性图标，表现护阵挡雷。'),
  icon('alchemy', '炼丹', 'resources', 'cauldron', 'amber', '炼丹属性图标，表现丹炉熟练度。'),
  icon('artifact', '法宝', 'resources', 'artifact', 'violet', '法宝属性图标，表现护身古器。'),
  icon('technique', '功法', 'resources', 'scroll', 'indigo', '功法属性图标，表现卷轴和道纹。'),
  icon('sect-contribution', '宗门贡献', 'resources', 'sect-token', 'pine', '宗门贡献图标，表现宗门令牌。'),
];

const items = [
  icon('qi-pill', '聚气丹', 'items', 'pill', 'jade', '丹药图标，聚拢灵气辅助修行。'),
  icon('healing-pill', '疗伤丹', 'items', 'pill', 'jade', '丹药图标，温养经脉缓解伤势。'),
  icon('cleansing-pill', '清心丹', 'items', 'pill', 'indigo', '丹药图标，清心压念削去心魔。'),
  icon('breakthrough-pill', '破境丹', 'items', 'pill', 'amber', '丹药图标，短时提高突破把握。'),
  icon('life-span-pill', '寿元丹', 'items', 'life-pill', 'gold', '珍稀丹药图标，中后期补寿元。'),
  icon('array-flag', '阵旗', 'items', 'flag', 'indigo', '法宝图标，布阵避开部分劫锋。'),
  icon('thunder-talisman', '雷劫符', 'items', 'talisman', 'blue', '法宝图标，引雷入阵换取抗劫之力。'),
  icon('jade-guard', '护身玉简', 'items', 'jade-guard', 'jade', '法宝图标，危急时护住根基。'),
  icon('ancient-fragment', '古宝残片', 'items', 'artifact-fragment', 'amber', '法宝图标，残破古宝仍有灵压。'),
  icon('spirit-herb', '灵草', 'items', 'herb', 'jade', '材料图标，炼丹常用灵材。'),
  icon('spirit-ore', '灵矿', 'items', 'ore', 'blue', '材料图标，炼器与阵旗材料。'),
  icon('law-shard', '规则残片', 'items', 'shard', 'blue', '材料图标，隐有天地规则回声。'),
  icon('origin-shard', '本源碎片', 'items', 'origin-shard', 'gold', '材料图标，本源之力凝成微光。'),
  icon('incense', '香火', 'items', 'incense', 'amber', '材料图标，信念杂音与愿力并存。'),
  icon('heaven-defying-shadow', '天逆珠碎影', 'items', 'shadow-orb', 'cinnabar', '特殊图标，似能逆转一线命数。'),
  icon('cave-token', '洞府令', 'items', 'sect-token', 'pine', '特殊图标，可换一处短暂清修之地。'),
  icon('soul-lamp', '命魂灯', 'items', 'lamp', 'gold', '特殊图标，灯火不灭，道心不散。'),
  icon('remnant-scroll', '残卷', 'items', 'scroll', 'indigo', '特殊图标，半页残卷藏着入道门径。'),
];

const realms = [
  realm('ningqi', '凝气', 'early', 'jade', '凝气境界图标，洞府清修，灵光初聚。'),
  realm('foundation-building', '筑基', 'foundation', 'pine', '筑基境界图标，根基成台，灵气沉稳。'),
  realm('core-formation', '结丹', 'core', 'gold', '结丹境界图标，金丹光晕护体。'),
  realm('nascent-soul', '元婴', 'nascent', 'amber', '元婴境界图标，元婴虚影初成。'),
  realm('spirit-transformation', '化神', 'spirit', 'indigo', '化神境界图标，红尘意境入心。'),
  realm('infant-transformation', '婴变', 'spirit', 'violet', '婴变境界图标，元神肉身互相牵引。'),
  realm('ask-ding', '问鼎', 'gate', 'blue', '问鼎境界图标，问天门影压心。'),
  realm('yin-xu', '阴虚', 'void', 'indigo', '阴虚境界图标，虚实转换。'),
  realm('yang-shi', '阳实', 'sun', 'amber', '阳实境界图标，元力炼实。'),
  realm('peek-nirvana', '窥涅', 'law', 'blue', '窥涅境界图标，初窥法则缝隙。'),
  realm('clean-nirvana', '净涅', 'law', 'jade', '净涅境界图标，领域逐渐清明。'),
  realm('shatter-nirvana', '碎涅', 'shatter', 'cinnabar', '碎涅境界图标，碎法重组，本源萌发。'),
  realm('five-declines', '天人五衰', 'decline', 'cinnabar', '天人五衰图标，命轮裂纹和衰气缠身。'),
  realm('empty-nirvana', '空涅', 'origin', 'gold', '空涅境界图标，本源证道。'),
  realm('empty-spirit', '空灵', 'inner-world', 'jade', '空灵境界图标，内天地初开。'),
  realm('empty-mystic', '空玄', 'mystic', 'indigo', '空玄境界图标，玄劫压顶。'),
  realm('empty-calamity', '空劫', 'calamity', 'blue', '空劫境界图标，大道压制如海。'),
  realm('half-step-heaven-trampling', '半步踏天', 'bridge', 'violet', '半步踏天境界图标，九桥问心证道。'),
  realm('heaven-trampling', '踏天', 'heaven', 'gold', '踏天境界图标，踏天问道，轮回外见真我。'),
];

const npcBadges = [
  badge('root-test', '灵根测试', 'root', 'jade', '奇遇徽章，宗门灵盘照骨测灵根。'),
  badge('cave-contest', '洞府争夺', 'cave', 'pine', '奇遇徽章，山腰洞府争夺。'),
  badge('core-thunder-tribulation', '金丹雷劫', 'lightning', 'blue', '奇遇徽章，金丹雷劫垂落。'),
  badge('nascent-soul-out-of-body', '元婴出窍', 'soul', 'amber', '奇遇徽章，元婴离体遇神识窥探。'),
  badge('red-dust-heart-refinement', '红尘炼心', 'red-dust', 'cinnabar', '奇遇徽章，一城灯火炼心。'),
  badge('primordial-spirit-transformation', '元神蜕变', 'spirit', 'violet', '奇遇徽章，元神蜕变。'),
  badge('ask-ding-heaven-gate', '问鼎天门', 'gate', 'blue', '奇遇徽章，虚空天门问己问天。'),
  badge('void-real-transition', '虚实转换', 'void', 'indigo', '奇遇徽章，虚与实互相映照。'),
  badge('origin-threshold', '本源门槛', 'origin', 'gold', '奇遇徽章，本源门槛低鸣。'),
  badge('first-glimpse-of-law', '法则初窥', 'law', 'blue', '奇遇徽章，第一次看见规则缝隙。'),
  badge('domain-purification', '领域净化', 'domain', 'jade', '奇遇徽章，法则洗净领域浑浊。'),
  badge('origin-seed', '本源种子', 'seed', 'gold', '奇遇徽章，规则碎后凝成本源微光。'),
  badge('encounter-five-declines', '天人五衰', 'decline', 'cinnabar', '奇遇徽章，衰气从命轮落下。'),
  badge('mystic-tribulation', '玄劫压顶', 'lightning', 'indigo', '奇遇徽章，外劫内劫魂劫轮转。'),
  badge('heaven-bridge', '踏天桥', 'bridge', 'violet', '奇遇徽章，九座桥浮在轮回尽头。'),
  badge('senior-discourse', '前辈论道', 'discourse', 'pine', 'NPC 羁绊徽章，抽象表现雨中论道。'),
  badge('pill-cultivator-gift', '丹修赠药', 'pill-gift', 'amber', 'NPC 羁绊徽章，抽象表现丹香赠药。'),
  badge('causal-chess-game', '棋局因果', 'chess', 'indigo', 'NPC 羁绊徽章，抽象表现棋盘因果。'),
];

const statusEffects = [
  effect('breakthrough-success', '突破成功', 'success', 'jade', '状态符号，突破成功反馈。'),
  effect('special-breakthrough', '特殊突破', 'special', 'gold', '状态符号，特殊突破反馈。'),
  effect('breakthrough-failure', '突破失败', 'failure', 'indigo', '状态符号，突破失败反馈。'),
  effect('severe-backlash', '严重反噬', 'backlash', 'cinnabar', '状态符号，严重反噬反馈。'),
  effect('heavenly-tribulation', '天劫', 'lightning', 'blue', '状态符号，天劫降临。'),
  effect('heart-demon-effect', '心魔', 'demon', 'cinnabar', '状态符号，心魔侵扰。'),
  effect('injury-effect', '伤势', 'crack', 'cinnabar', '状态符号，伤势积累。'),
  effect('healing-effect', '疗伤', 'heal', 'jade', '状态符号，疗伤恢复。'),
  effect('cleansing-mind', '清心', 'cleanse', 'indigo', '状态符号，清心压念。'),
  effect('tribulation-resistance-effect', '抗劫', 'shield-lightning', 'blue', '状态符号，抗劫护持。'),
  effect('law-resonance', '法则共鸣', 'law-lines', 'blue', '状态符号，法则共鸣。'),
  effect('origin-awakening', '本源觉醒', 'origin-orb', 'gold', '状态符号，本源觉醒。'),
];

const backgrounds = [
  background('cave-cultivation', '洞府清修背景', '洞府清修场景背景，适合修炼页或首页氛围。'),
  background('secret-realm-exploration', '秘境探索背景', '秘境探索场景背景，适合奇遇和探索氛围。'),
  background('thunder-tribulation-sky', '雷劫天幕背景', '雷劫天幕场景背景，适合突破和天劫氛围。'),
  background('heaven-trampling-nine-bridge', '踏天九桥背景', '踏天九桥场景背景，适合后期境界和终局氛围。'),
];

const iconAssets = [...actions, ...resources, ...items, ...realms, ...npcBadges, ...statusEffects];
const allAssets = [...iconAssets, ...backgrounds];

if (iconAssets.length !== 95) {
  throw new Error(`Expected 95 icon assets, got ${iconAssets.length}`);
}
if (allAssets.length !== 99) {
  throw new Error(`Expected 99 visual assets, got ${allAssets.length}`);
}

function icon(id, zh, category, motif, tone, usage) {
  return {
    id,
    zh,
    category,
    motif,
    tone,
    usage,
    path: `${categoryFolders[category]}/${id}.svg`,
    width: 128,
    height: 128,
  };
}

function realm(id, zh, variant, tone, usage) {
  return {
    ...icon(id, zh, 'realms', 'realm', tone, usage),
    variant,
  };
}

function badge(id, zh, variant, tone, usage) {
  return {
    ...icon(id, zh, 'npc-badges', 'badge', tone, usage),
    variant,
  };
}

function effect(id, zh, variant, tone, usage) {
  return {
    ...icon(id, zh, 'status-effects', 'effect', tone, usage),
    variant,
  };
}

function background(id, zh, usage) {
  return {
    id,
    zh,
    category: 'backgrounds',
    motif: 'background',
    tone: 'jade',
    usage,
    path: `backgrounds/${id}.svg`,
    width: 1200,
    height: 520,
  };
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

async function writePackFile(relativePath, contents) {
  const target = join(PACK_ROOT, relativePath);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, contents);
}

function toneColor(asset) {
  return ({
    jade: palette.jade,
    amber: palette.amber,
    cinnabar: palette.cinnabar,
    indigo: palette.indigo,
    blue: palette.blue,
    gold: palette.gold,
    violet: palette.violet,
    pine: palette.pine,
  })[asset.tone] ?? palette.jade;
}

function iconSvg(asset, body) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(asset.zh)}</title>
  <desc id="desc">${escapeXml(asset.usage)}</desc>
  <defs>
    <radialGradient id="paperGlow" cx="50%" cy="42%" r="62%">
      <stop offset="0" stop-color="${palette.paper}" stop-opacity="0.96"/>
      <stop offset="1" stop-color="${toneColor(asset)}" stop-opacity="0.18"/>
    </radialGradient>
  </defs>
  <circle cx="64" cy="64" r="56" fill="url(#paperGlow)" opacity="0.95"/>
  <circle cx="64" cy="64" r="50" fill="none" stroke="${palette.ink}" stroke-opacity="0.16" stroke-width="2"/>
${indent(body)}
</svg>
`;
}

function backgroundSvg(asset, body) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 520" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(asset.zh)}</title>
  <desc id="desc">${escapeXml(asset.usage)}</desc>
  <rect width="1200" height="520" fill="${palette.mist}"/>
${indent(body)}
</svg>
`;
}

function renderIcon(asset) {
  return iconSvg(asset, renderMotif(asset));
}

function renderMotif(asset) {
  switch (asset.motif) {
    case 'life-pill':
      return lifePillMotif(asset);
    case 'pill':
      return pillMotif(asset);
    case 'flag':
      return flagMotif(asset);
    case 'talisman':
      return talismanMotif(asset);
    case 'shard':
    case 'origin-shard':
      return shardMotif(asset);
    case 'realm':
      return realmMotif(asset);
    case 'badge':
      return badgeMotif(asset);
    case 'effect':
      return effectMotif(asset);
    case 'meditate':
      return meditateMotif(asset);
    case 'cave':
      return caveMotif(asset);
    case 'path':
      return pathMotif(asset);
    case 'gate':
      return gateMotif(asset);
    case 'breakthrough':
      return breakthroughMotif(asset);
    case 'cauldron':
      return cauldronMotif(asset);
    case 'heal':
      return healMotif(asset);
    case 'suppress':
      return suppressMotif(asset);
    case 'market':
      return marketMotif(asset);
    case 'stones':
      return stonesMotif(asset);
    case 'life-wheel':
      return lifeWheelMotif(asset);
    case 'blade':
      return bladeMotif(asset);
    case 'cloud-star':
      return cloudStarMotif(asset);
    case 'mind-light':
      return mindLightMotif(asset);
    case 'root-bone':
      return rootBoneMotif(asset);
    case 'dao-heart':
      return daoHeartMotif(asset);
    case 'demon':
      return demonMotif(asset);
    case 'crack':
      return crackMotif(asset);
    case 'seal':
      return sealMotif(asset);
    case 'moon-water':
      return moonWaterMotif(asset);
    case 'law-lines':
      return lawLinesMotif(asset);
    case 'origin-orb':
      return originOrbMotif(asset);
    case 'shield-lightning':
      return shieldLightningMotif(asset);
    case 'artifact':
      return artifactMotif(asset);
    case 'scroll':
      return scrollMotif(asset);
    case 'sect-token':
      return sectTokenMotif(asset);
    case 'jade-guard':
      return jadeGuardMotif(asset);
    case 'artifact-fragment':
      return artifactFragmentMotif(asset);
    case 'herb':
      return herbMotif(asset);
    case 'ore':
      return oreMotif(asset);
    case 'incense':
      return incenseMotif(asset);
    case 'shadow-orb':
      return shadowOrbMotif(asset);
    case 'lamp':
      return lampMotif(asset);
    case 'spiral':
    default:
      return genericMotif(asset);
  }
}

function genericMotif(asset) {
  const tone = toneColor(asset);
  return `
<path d="M64 22c20 15 30 30 30 45 0 19-14 34-30 39-16-5-30-20-30-39 0-15 10-30 30-45Z" fill="${tone}" opacity="0.86"/>
<path d="M43 72c15-16 31-19 48-10M46 85c13 8 28 10 44 0" fill="none" stroke="${palette.paper}" stroke-width="5" stroke-linecap="round" opacity="0.82"/>
<circle cx="64" cy="58" r="8" fill="${palette.gold}" opacity="0.72"/>
`;
}

function pillMotif(asset) {
  const tone = toneColor(asset);
  const accent = asset.id === 'breakthrough-pill' ? palette.gold : asset.id === 'cleansing-pill' ? palette.indigo : palette.jade;
  return `
<ellipse cx="64" cy="68" rx="28" ry="24" fill="${tone}" opacity="0.9"/>
<path d="M40 66c13 9 35 10 49 0" fill="none" stroke="${palette.paper}" stroke-width="5" stroke-linecap="round" opacity="0.68"/>
<path d="M53 49c9-10 21-10 30 0" fill="none" stroke="${accent}" stroke-width="5" stroke-linecap="round" opacity="0.72"/>
<circle cx="77" cy="59" r="5" fill="${palette.paper}" opacity="0.62"/>
<path d="M35 38c-9 11-9 21 0 30M93 38c9 11 9 21 0 30" fill="none" stroke="${accent}" stroke-width="4" stroke-linecap="round" opacity="0.34"/>
`;
}

function lifePillMotif(asset) {
  const tone = toneColor(asset);
  return `
<circle cx="64" cy="64" r="33" fill="none" stroke="${tone}" stroke-width="5" opacity="0.88"/>
<path d="M64 27a37 37 0 0 1 36 42M64 101a37 37 0 0 1-36-42" fill="none" stroke="${palette.jade}" stroke-width="5" stroke-linecap="round" opacity="0.56"/>
<ellipse cx="64" cy="68" rx="24" ry="20" fill="${palette.jade}" opacity="0.92"/>
<path d="M52 67c8 6 16 7 25 0" fill="none" stroke="${palette.paper}" stroke-width="5" stroke-linecap="round" opacity="0.76"/>
<path d="M31 78c12-7 21-7 33 1 13 9 24 9 35-1" fill="none" stroke="${palette.gold}" stroke-width="4" stroke-linecap="round" opacity="0.82"/>
<path d="M64 36v18M64 82v16M36 64h17M75 64h17" stroke="${tone}" stroke-width="4" stroke-linecap="round" opacity="0.72"/>
`;
}

function flagMotif(asset) {
  const tone = toneColor(asset);
  return `
<path d="M44 100V27" stroke="${palette.ink}" stroke-width="5" stroke-linecap="round" opacity="0.62"/>
<path d="M48 31c16-9 30 8 45-1v43c-15 9-29-8-45 1Z" fill="${tone}" opacity="0.86"/>
<path d="M55 43h23M55 55h18M55 67h25" stroke="${palette.paper}" stroke-width="4" stroke-linecap="round" opacity="0.74"/>
<circle cx="44" cy="27" r="6" fill="${palette.gold}" opacity="0.82"/>
`;
}

function talismanMotif(asset) {
  const tone = toneColor(asset);
  return `
<path d="M45 24h38l8 12v68H37V36Z" fill="${palette.paper}" stroke="${tone}" stroke-width="5" stroke-linejoin="round"/>
<path d="M47 42h34M48 55c15 5 18 11 10 20 13-5 22-1 23 12" fill="none" stroke="${palette.cinnabar}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M68 25v18" stroke="${tone}" stroke-width="5" stroke-linecap="round"/>
<path d="m77 74-10 10h12l-12 17" fill="none" stroke="${palette.blue}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
`;
}

function shardMotif(asset) {
  const tone = toneColor(asset);
  return `
<polygon points="65,24 93,54 77,104 43,95 35,52" fill="${tone}" opacity="0.86"/>
<path d="M65 24 58 69l19 35M35 52l23 17 35-15" fill="none" stroke="${palette.paper}" stroke-width="4" stroke-linecap="round" opacity="0.58"/>
<circle cx="66" cy="68" r="8" fill="${asset.id.includes('origin') ? palette.gold : palette.mist}" opacity="0.72"/>
`;
}

function meditateMotif(asset) {
  const tone = toneColor(asset);
  return `
<circle cx="64" cy="43" r="12" fill="${palette.paper}" stroke="${tone}" stroke-width="5"/>
<path d="M44 86c8-22 32-22 40 0" fill="${tone}" opacity="0.86"/>
<path d="M31 89c15 13 51 13 66 0" fill="none" stroke="${palette.ink}" stroke-width="5" stroke-linecap="round" opacity="0.45"/>
<path d="M36 63c-7-14 0-29 13-35M92 63c7-14 0-29-13-35" fill="none" stroke="${tone}" stroke-width="4" stroke-linecap="round" opacity="0.42"/>
`;
}

function caveMotif(asset) {
  const tone = toneColor(asset);
  return `
<path d="M26 99c7-38 21-62 38-62s31 24 38 62Z" fill="${tone}" opacity="0.82"/>
<path d="M49 99V75c0-10 6-18 15-18s15 8 15 18v24Z" fill="${palette.dark}" opacity="0.62"/>
<path d="M38 53c14-16 38-16 52 0" fill="none" stroke="${palette.paper}" stroke-width="5" stroke-linecap="round" opacity="0.58"/>
<circle cx="64" cy="72" r="8" fill="${palette.gold}" opacity="0.76"/>
`;
}

function pathMotif(asset) {
  const tone = toneColor(asset);
  return `
<path d="M29 102c19-18 23-33 18-48 24 11 39 27 48 48Z" fill="${tone}" opacity="0.8"/>
<path d="M58 100c-4-18 2-35 20-50" fill="none" stroke="${palette.paper}" stroke-width="6" stroke-linecap="round" opacity="0.72"/>
<path d="M35 48c14-16 30-21 50-15" fill="none" stroke="${palette.ink}" stroke-width="4" stroke-linecap="round" opacity="0.34"/>
<circle cx="88" cy="39" r="7" fill="${palette.gold}" opacity="0.8"/>
`;
}

function gateMotif(asset) {
  const tone = toneColor(asset);
  return `
<path d="M37 100V38h54v62" fill="none" stroke="${tone}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M29 38h70M42 53h44" stroke="${palette.ink}" stroke-width="5" stroke-linecap="round" opacity="0.38"/>
<path d="M50 100c3-21 8-34 14-42 6 8 11 21 14 42Z" fill="${palette.dark}" opacity="0.58"/>
<circle cx="64" cy="67" r="9" fill="${palette.gold}" opacity="0.72"/>
`;
}

function breakthroughMotif(asset) {
  const tone = toneColor(asset);
  return `
<path d="M64 23 78 57h31L83 76l10 31-29-20-29 20 10-31-26-19h31Z" fill="${tone}" opacity="0.88"/>
<path d="M45 75c12 8 26 8 38 0" fill="none" stroke="${palette.paper}" stroke-width="5" stroke-linecap="round" opacity="0.72"/>
<path d="M64 20v-9M30 34l-7-7M98 34l7-7" stroke="${tone}" stroke-width="4" stroke-linecap="round" opacity="0.55"/>
`;
}

function cauldronMotif(asset) {
  const tone = toneColor(asset);
  return `
<path d="M37 56h54l-8 36H45Z" fill="${tone}" opacity="0.88"/>
<path d="M43 56c4-10 38-10 42 0" fill="none" stroke="${palette.ink}" stroke-width="5" stroke-linecap="round" opacity="0.52"/>
<path d="M47 93h34M51 101h26" stroke="${palette.ink}" stroke-width="5" stroke-linecap="round" opacity="0.4"/>
<path d="M52 43c-8-12 7-16 0-28M67 43c-8-12 7-16 0-28M82 43c-8-12 7-16 0-28" fill="none" stroke="${palette.gold}" stroke-width="4" stroke-linecap="round" opacity="0.72"/>
`;
}

function healMotif(asset) {
  const tone = toneColor(asset);
  return `
<path d="M64 102C33 79 26 56 42 42c9-8 20-5 22 6 2-11 13-14 22-6 16 14 9 37-22 60Z" fill="${tone}" opacity="0.88"/>
<path d="M64 54v28M50 68h28" stroke="${palette.paper}" stroke-width="7" stroke-linecap="round" opacity="0.78"/>
<path d="M34 87c14 8 46 9 60 0" fill="none" stroke="${palette.gold}" stroke-width="4" stroke-linecap="round" opacity="0.48"/>
`;
}

function suppressMotif(asset) {
  const tone = toneColor(asset);
  return `
<path d="M64 29c19 11 29 26 29 42 0 19-12 32-29 38-17-6-29-19-29-38 0-16 10-31 29-42Z" fill="${tone}" opacity="0.82"/>
<path d="M47 67c9-11 25-11 34 0M51 82c8 6 18 6 26 0" fill="none" stroke="${palette.dark}" stroke-width="5" stroke-linecap="round" opacity="0.62"/>
<path d="M35 35 93 93M93 35 35 93" stroke="${palette.gold}" stroke-width="5" stroke-linecap="round" opacity="0.74"/>
`;
}

function marketMotif(asset) {
  const tone = toneColor(asset);
  return `
<path d="M34 53h60l-5 47H39Z" fill="${tone}" opacity="0.84"/>
<path d="M28 53 38 32h52l10 21Z" fill="${palette.paper}" stroke="${tone}" stroke-width="5" stroke-linejoin="round"/>
<path d="M44 32v21M64 32v21M84 32v21" stroke="${tone}" stroke-width="4" opacity="0.65"/>
<circle cx="64" cy="78" r="13" fill="${palette.gold}" opacity="0.8"/>
<path d="M55 78h18" stroke="${palette.paper}" stroke-width="4" stroke-linecap="round"/>
`;
}

function stonesMotif(asset) {
  const tone = toneColor(asset);
  return `
<polygon points="39,49 58,37 73,53 63,78 42,75" fill="${tone}" opacity="0.84"/>
<polygon points="65,58 86,47 98,67 86,91 63,82" fill="${palette.blue}" opacity="0.72"/>
<path d="M48 51 58 37l15 16M75 61l11-14 12 20" fill="none" stroke="${palette.paper}" stroke-width="3" opacity="0.62"/>
<circle cx="63" cy="65" r="6" fill="${palette.paper}" opacity="0.48"/>
`;
}

function lifeWheelMotif(asset) {
  const tone = toneColor(asset);
  return `
<circle cx="64" cy="64" r="32" fill="none" stroke="${tone}" stroke-width="6" opacity="0.86"/>
<circle cx="64" cy="64" r="13" fill="${palette.jade}" opacity="0.76"/>
<path d="M64 30v19M64 79v19M30 64h19M79 64h19M40 40l13 13M75 75l13 13M88 40 75 53M53 75 40 88" stroke="${palette.gold}" stroke-width="4" stroke-linecap="round" opacity="0.72"/>
`;
}

function bladeMotif(asset) {
  const tone = toneColor(asset);
  return `
<path d="M86 25c-4 31-18 54-47 70 13-29 35-48 47-70Z" fill="${tone}" opacity="0.9"/>
<path d="M45 91 34 102M38 84l16 16" stroke="${palette.ink}" stroke-width="6" stroke-linecap="round" opacity="0.56"/>
<path d="M61 61c9-8 16-18 21-31" fill="none" stroke="${palette.paper}" stroke-width="4" stroke-linecap="round" opacity="0.58"/>
`;
}

function cloudStarMotif(asset) {
  const tone = toneColor(asset);
  return `
<path d="M36 78c-14-10-5-31 12-28 6-17 32-17 38 0 17-3 26 18 12 28Z" fill="${tone}" opacity="0.78"/>
<path d="M42 82c14 8 31 9 48 0" fill="none" stroke="${palette.paper}" stroke-width="5" stroke-linecap="round" opacity="0.6"/>
<path d="m74 30 5 10 11 2-8 8 2 12-10-6-10 6 2-12-8-8 11-2Z" fill="${palette.gold}" opacity="0.84"/>
`;
}

function mindLightMotif(asset) {
  const tone = toneColor(asset);
  return `
<path d="M43 71c-1-21 10-38 27-38 14 0 25 11 25 25 0 13-8 23-22 27v15H55V84c-8-2-11-7-12-13Z" fill="${tone}" opacity="0.84"/>
<path d="M56 59c6-9 18-9 24 0M47 103h34" fill="none" stroke="${palette.paper}" stroke-width="5" stroke-linecap="round" opacity="0.68"/>
<circle cx="64" cy="57" r="8" fill="${palette.gold}" opacity="0.75"/>
`;
}

function rootBoneMotif(asset) {
  const tone = toneColor(asset);
  return `
<path d="M64 28v57M64 55c-13-4-23-12-30-25M64 63c14-1 25-8 34-21M64 83c-11 2-19 9-25 22M64 83c11 2 19 9 25 22" fill="none" stroke="${tone}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" opacity="0.82"/>
<path d="M50 98h28" stroke="${palette.paper}" stroke-width="5" stroke-linecap="round" opacity="0.68"/>
<circle cx="64" cy="28" r="8" fill="${palette.gold}" opacity="0.72"/>
`;
}

function daoHeartMotif(asset) {
  const tone = toneColor(asset);
  return `
<path d="M64 101C35 80 28 57 43 43c9-8 19-4 21 6 2-10 12-14 21-6 15 14 8 37-21 58Z" fill="${tone}" opacity="0.88"/>
<circle cx="64" cy="66" r="17" fill="none" stroke="${palette.paper}" stroke-width="5" opacity="0.66"/>
<path d="M53 66h22M64 55v22" stroke="${palette.gold}" stroke-width="4" stroke-linecap="round" opacity="0.78"/>
`;
}

function demonMotif(asset) {
  const tone = toneColor(asset);
  return `
<path d="M64 25c21 10 32 25 32 45 0 22-14 34-32 39-18-5-32-17-32-39 0-20 11-35 32-45Z" fill="${tone}" opacity="0.84"/>
<path d="M44 47c-9-10-11-19-7-28M84 47c9-10 11-19 7-28" fill="none" stroke="${palette.dark}" stroke-width="5" stroke-linecap="round"/>
<path d="M49 67c7-6 14-6 21 0M58 86c5 4 8 4 12 0" fill="none" stroke="${palette.paper}" stroke-width="5" stroke-linecap="round" opacity="0.72"/>
`;
}

function crackMotif(asset) {
  const tone = toneColor(asset);
  return `
<path d="M36 97 63 27l29 70Z" fill="${tone}" opacity="0.82"/>
<path d="M65 31 57 55l12 8-15 31M44 82h39" fill="none" stroke="${palette.dark}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity="0.68"/>
<path d="M35 101c16 7 42 7 58 0" stroke="${palette.paper}" stroke-width="4" stroke-linecap="round" opacity="0.52"/>
`;
}

function sealMotif(asset) {
  const tone = toneColor(asset);
  return `
<path d="M42 29h44v56H42Z" fill="${tone}" opacity="0.86"/>
<path d="M35 88h58v15H35Z" fill="${palette.ink}" opacity="0.45"/>
<path d="M53 43h22M53 57h22M53 71h17" stroke="${palette.paper}" stroke-width="5" stroke-linecap="round" opacity="0.72"/>
<circle cx="84" cy="87" r="10" fill="${palette.gold}" opacity="0.74"/>
`;
}

function moonWaterMotif(asset) {
  const tone = toneColor(asset);
  return `
<path d="M74 29c-20 5-30 26-19 43 6 9 17 14 29 12-8 8-20 12-33 8-20-6-29-30-17-48 9-14 25-21 40-15Z" fill="${tone}" opacity="0.84"/>
<path d="M32 88c13-7 25-7 36 0s22 7 33 0M39 101c10-4 20-4 30 0s20 4 30 0" fill="none" stroke="${palette.blue}" stroke-width="4" stroke-linecap="round" opacity="0.62"/>
`;
}

function lawLinesMotif(asset) {
  const tone = toneColor(asset);
  return `
<circle cx="64" cy="64" r="33" fill="none" stroke="${tone}" stroke-width="5" opacity="0.78"/>
<path d="M64 31v66M31 64h66M41 41l46 46M87 41 41 87" stroke="${tone}" stroke-width="4" stroke-linecap="round" opacity="0.58"/>
<circle cx="64" cy="64" r="8" fill="${palette.gold}" opacity="0.82"/>
`;
}

function originOrbMotif(asset) {
  const tone = toneColor(asset);
  return `
<circle cx="64" cy="64" r="24" fill="${tone}" opacity="0.88"/>
<circle cx="64" cy="64" r="41" fill="none" stroke="${tone}" stroke-width="4" opacity="0.36"/>
<path d="M31 64c11-17 55-17 66 0M64 31c17 11 17 55 0 66" fill="none" stroke="${palette.paper}" stroke-width="4" stroke-linecap="round" opacity="0.58"/>
<circle cx="74" cy="54" r="6" fill="${palette.paper}" opacity="0.65"/>
`;
}

function shieldLightningMotif(asset) {
  const tone = toneColor(asset);
  return `
<path d="M64 26 94 39v25c0 23-12 37-30 45-18-8-30-22-30-45V39Z" fill="${tone}" opacity="0.84"/>
<path d="m69 42-17 26h15l-9 27 22-34H65Z" fill="${palette.gold}" opacity="0.86"/>
<path d="M45 45v20c0 13 5 23 16 30" fill="none" stroke="${palette.paper}" stroke-width="4" stroke-linecap="round" opacity="0.54"/>
`;
}

function artifactMotif(asset) {
  const tone = toneColor(asset);
  return `
<path d="M64 25 88 45 80 92H48l-8-47Z" fill="${tone}" opacity="0.84"/>
<path d="M52 52h24M55 70h18M64 25v67" stroke="${palette.paper}" stroke-width="4" stroke-linecap="round" opacity="0.62"/>
<circle cx="64" cy="62" r="8" fill="${palette.gold}" opacity="0.74"/>
`;
}

function scrollMotif(asset) {
  const tone = toneColor(asset);
  return `
<path d="M39 33h50v62H39Z" fill="${palette.paper}" stroke="${tone}" stroke-width="5" stroke-linejoin="round"/>
<path d="M39 33c-13 0-13 18 0 18M89 77c13 0 13 18 0 18" fill="none" stroke="${tone}" stroke-width="5" stroke-linecap="round"/>
<path d="M51 51h27M51 65h22M51 79h26" stroke="${palette.ink}" stroke-width="4" stroke-linecap="round" opacity="0.45"/>
`;
}

function sectTokenMotif(asset) {
  const tone = toneColor(asset);
  return `
<path d="M64 25 94 48 83 97H45L34 48Z" fill="${tone}" opacity="0.86"/>
<path d="M51 51h26M48 66h32M55 81h18" stroke="${palette.paper}" stroke-width="5" stroke-linecap="round" opacity="0.68"/>
<circle cx="64" cy="48" r="7" fill="${palette.gold}" opacity="0.76"/>
`;
}

function jadeGuardMotif(asset) {
  const tone = toneColor(asset);
  return `
<path d="M64 25c19 8 29 22 29 43 0 20-11 33-29 40-18-7-29-20-29-40 0-21 10-35 29-43Z" fill="${tone}" opacity="0.82"/>
<path d="M64 42 79 64 64 87 49 64Z" fill="${palette.paper}" opacity="0.7"/>
<path d="M47 49c-7 15-4 33 17 47" fill="none" stroke="${palette.gold}" stroke-width="4" stroke-linecap="round" opacity="0.68"/>
`;
}

function artifactFragmentMotif(asset) {
  const tone = toneColor(asset);
  return `
<path d="M41 38 74 24 90 54 75 101 42 87Z" fill="${tone}" opacity="0.84"/>
<path d="M50 42 71 35M48 67l31-12M52 86l20-8" stroke="${palette.paper}" stroke-width="4" stroke-linecap="round" opacity="0.58"/>
<path d="M74 24 67 62l8 39" fill="none" stroke="${palette.ink}" stroke-width="4" stroke-linecap="round" opacity="0.34"/>
`;
}

function herbMotif(asset) {
  const tone = toneColor(asset);
  return `
<path d="M64 99V43" stroke="${tone}" stroke-width="7" stroke-linecap="round"/>
<path d="M64 67c-23-1-34-11-36-29 22-2 34 9 36 29ZM64 61c23-1 34-11 36-29-22-2-34 9-36 29ZM64 85c-17-1-26-8-29-22 18-2 28 6 29 22ZM64 80c17-1 26-8 29-22-18-2-28 6-29 22Z" fill="${tone}" opacity="0.78"/>
<circle cx="64" cy="41" r="7" fill="${palette.gold}" opacity="0.72"/>
`;
}

function oreMotif(asset) {
  const tone = toneColor(asset);
  return `
<polygon points="43,50 63,34 86,43 96,70 76,97 46,91 32,67" fill="${tone}" opacity="0.84"/>
<path d="M43 50 63 67l23-24M63 67l13 30M63 67 46 91" fill="none" stroke="${palette.paper}" stroke-width="4" opacity="0.56"/>
<circle cx="68" cy="62" r="7" fill="${palette.jade}" opacity="0.72"/>
`;
}

function incenseMotif(asset) {
  const tone = toneColor(asset);
  return `
<path d="M45 100h38l-6-18H51Z" fill="${tone}" opacity="0.82"/>
<path d="M54 81h20" stroke="${palette.ink}" stroke-width="5" stroke-linecap="round" opacity="0.42"/>
<path d="M54 72V34M64 72V28M74 72V38" stroke="${palette.cinnabar}" stroke-width="4" stroke-linecap="round" opacity="0.78"/>
<path d="M49 31c-9-12 8-17 0-28M65 25c-9-12 8-17 0-28M78 35c-7-10 6-14 0-23" fill="none" stroke="${palette.gold}" stroke-width="3" stroke-linecap="round" opacity="0.62"/>
`;
}

function shadowOrbMotif(asset) {
  const tone = toneColor(asset);
  return `
<circle cx="64" cy="64" r="28" fill="${palette.dark}" opacity="0.9"/>
<path d="M39 64c12-18 38-23 56-5-9 23-35 31-56 5Z" fill="${tone}" opacity="0.62"/>
<circle cx="72" cy="55" r="8" fill="${palette.gold}" opacity="0.76"/>
<path d="M34 95c19-10 41-10 60 0" fill="none" stroke="${palette.cinnabar}" stroke-width="4" stroke-linecap="round" opacity="0.56"/>
`;
}

function lampMotif(asset) {
  const tone = toneColor(asset);
  return `
<path d="M46 99h36l-5-32H51Z" fill="${tone}" opacity="0.84"/>
<path d="M42 67h44M49 99h30" stroke="${palette.ink}" stroke-width="5" stroke-linecap="round" opacity="0.44"/>
<path d="M64 25c14 13 15 30 0 41-15-11-14-28 0-41Z" fill="${palette.gold}" opacity="0.86"/>
<path d="M64 36c5 7 5 14 0 19" fill="none" stroke="${palette.paper}" stroke-width="4" stroke-linecap="round" opacity="0.65"/>
`;
}

function realmMotif(asset) {
  const tone = toneColor(asset);
  const variant = asset.variant;
  const bridge = variant === 'bridge' || variant === 'heaven';
  const decline = variant === 'decline';
  const law = ['law', 'origin', 'inner-world', 'mystic', 'calamity', 'shatter'].includes(variant);
  return `
<circle cx="64" cy="61" r="${bridge ? 37 : 32}" fill="none" stroke="${tone}" stroke-width="${decline ? 5 : 4}" opacity="0.76"/>
<path d="M49 95V68c0-10 6-18 15-18s15 8 15 18v27Z" fill="${tone}" opacity="0.78"/>
<circle cx="64" cy="43" r="10" fill="${palette.paper}" stroke="${tone}" stroke-width="4"/>
${variant === 'core' || variant === 'nascent' ? `<circle cx="64" cy="72" r="11" fill="${palette.gold}" opacity="0.85"/>` : ''}
${variant === 'spirit' || variant === 'gate' ? `<path d="M34 79c18-14 42-14 60 0M47 34h34" fill="none" stroke="${palette.indigo}" stroke-width="4" stroke-linecap="round" opacity="0.58"/>` : ''}
${law ? `<path d="M31 61h66M64 28v66M41 38l46 46" stroke="${palette.gold}" stroke-width="3" stroke-linecap="round" opacity="0.42"/>` : ''}
${decline ? `<path d="M42 37 57 62l-9 28M84 39 69 64l9 27" fill="none" stroke="${palette.cinnabar}" stroke-width="4" stroke-linecap="round" opacity="0.64"/>` : ''}
${bridge ? `<path d="M25 100c22-31 56-31 78 0M34 88c18-19 42-19 60 0" fill="none" stroke="${palette.ink}" stroke-width="4" stroke-linecap="round" opacity="0.44"/>` : ''}
`;
}

function badgeMotif(asset) {
  const tone = toneColor(asset);
  const variant = asset.variant ?? 'seal';
  const center = ({
    root: rootBoneMotif,
    cave: caveMotif,
    lightning: shieldLightningMotif,
    soul: originOrbMotif,
    'red-dust': cloudStarMotif,
    spirit: mindLightMotif,
    gate: gateMotif,
    void: moonWaterMotif,
    origin: originOrbMotif,
    law: lawLinesMotif,
    domain: lawLinesMotif,
    seed: herbMotif,
    decline: crackMotif,
    bridge: pathMotif,
    discourse: daoHeartMotif,
    'pill-gift': pillMotif,
    chess: sealMotif,
  })[variant] ?? sealMotif;
  return `
<path d="M64 18 96 36v56l-32 18-32-18V36Z" fill="${tone}" opacity="0.18" stroke="${tone}" stroke-width="4"/>
${center({ ...asset, motif: variant, tone: asset.tone })}
`;
}

function effectMotif(asset) {
  const variant = asset.variant ?? 'success';
  const map = {
    success: breakthroughMotif,
    special: originOrbMotif,
    failure: crackMotif,
    backlash: suppressMotif,
    lightning: shieldLightningMotif,
    demon: demonMotif,
    crack: crackMotif,
    heal: healMotif,
    cleanse: mindLightMotif,
    'shield-lightning': shieldLightningMotif,
    'law-lines': lawLinesMotif,
    'origin-orb': originOrbMotif,
  };
  return (map[variant] ?? genericMotif)(asset);
}

function renderBackground(asset) {
  if (asset.id === 'cave-cultivation') {
    return backgroundSvg(asset, `
<linearGradient id="caveSky" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${palette.paper}"/><stop offset="1" stop-color="${palette.mist}"/></linearGradient>
<rect width="1200" height="520" fill="url(#caveSky)"/>
<path d="M0 346 146 234l110 69 128-126 151 139 117-82 150 104 126-145 134 129 95-69 143 101v166H0Z" fill="${palette.jade}" opacity="0.18"/>
<path d="M0 418 170 300l116 85 114-131 156 155 135-117 171 122 111-96 117 77 110-124v249H0Z" fill="${palette.ink}" opacity="0.16"/>
<path d="M451 520c34-176 101-270 202-270s168 94 202 270Z" fill="${palette.pine}" opacity="0.55"/>
<path d="M565 520V398c0-57 39-96 88-96s88 39 88 96v122Z" fill="${palette.dark}" opacity="0.48"/>
<circle cx="653" cy="397" r="38" fill="${palette.gold}" opacity="0.33"/>
<path d="M0 430c209-54 415-53 616 4s395 56 584-7v93H0Z" fill="${palette.paper}" opacity="0.54"/>
`);
  }
  if (asset.id === 'secret-realm-exploration') {
    return backgroundSvg(asset, `
<rect width="1200" height="520" fill="${palette.mist}"/>
<path d="M0 345c151-58 309-62 474-12s328 42 489-22 237-49 237-49v258H0Z" fill="${palette.indigo}" opacity="0.16"/>
<path d="M425 520V160h350v360" fill="none" stroke="${palette.pine}" stroke-width="28" stroke-linecap="round"/>
<path d="M365 167h470" stroke="${palette.jade}" stroke-width="24" stroke-linecap="round" opacity="0.5"/>
<path d="M518 520c28-111 55-178 82-200 27 22 54 89 82 200Z" fill="${palette.dark}" opacity="0.32"/>
<path d="M176 212 230 172l39 59-62 31ZM927 174l72 23-18 75-72-22Z" fill="${palette.gold}" opacity="0.36"/>
<path d="M0 430c226-64 439-59 638 15 196 73 383 71 562-8v83H0Z" fill="${palette.paper}" opacity="0.62"/>
<path d="M520 260c41 24 119 24 160 0" fill="none" stroke="${palette.gold}" stroke-width="9" stroke-linecap="round" opacity="0.42"/>
`);
  }
  if (asset.id === 'thunder-tribulation-sky') {
    return backgroundSvg(asset, `
<rect width="1200" height="520" fill="${palette.indigo}" opacity="0.22"/>
<path d="M0 104c187-74 383-77 589-8 199 67 403 58 611-28v214H0Z" fill="${palette.dark}" opacity="0.46"/>
<path d="M0 190c192-52 381-50 568 8 217 67 428 62 632-16v179H0Z" fill="${palette.blue}" opacity="0.3"/>
<path d="m583 92-82 142h72l-96 181 187-225h-86l72-98Z" fill="${palette.gold}" opacity="0.78"/>
<path d="m842 138-45 89h42l-61 108 112-132h-50l39-65Z" fill="${palette.paper}" opacity="0.42"/>
<path d="M0 390 141 300l132 67 122-104 151 126 119-89 149 105 126-132 135 118 125-74v203H0Z" fill="${palette.ink}" opacity="0.28"/>
<path d="M0 455c216-38 416-32 600 18 194 53 394 50 600-8v55H0Z" fill="${palette.paper}" opacity="0.4"/>
`);
  }
  return backgroundSvg(asset, `
<rect width="1200" height="520" fill="${palette.mist}"/>
<circle cx="600" cy="210" r="156" fill="none" stroke="${palette.gold}" stroke-width="12" opacity="0.24"/>
<circle cx="600" cy="210" r="92" fill="none" stroke="${palette.indigo}" stroke-width="7" opacity="0.24"/>
<path d="M100 460c90-90 178-90 268 0M208 420c70-70 139-70 209 0M319 382c55-54 109-54 164 0M435 345c42-42 84-42 126 0M552 312c32-32 64-32 96 0M663 345c42-42 84-42 126 0M779 382c55-54 109-54 164 0M889 420c70-70 139-70 209 0M832 460c90-90 178-90 268 0" fill="none" stroke="${palette.pine}" stroke-width="10" stroke-linecap="round" opacity="0.42"/>
<path d="M0 355 156 275l130 64 117-93 150 101 132-84 154 103 116-88 245 109v133H0Z" fill="${palette.ink}" opacity="0.16"/>
<path d="M0 443c203-56 410-48 621 24 189 64 382 58 579-19v72H0Z" fill="${palette.paper}" opacity="0.55"/>
<path d="M600 88v244M478 210h244M514 124l172 172M686 124 514 296" stroke="${palette.gold}" stroke-width="5" stroke-linecap="round" opacity="0.18"/>
`);
}

function indent(value) {
  return value.trim().split('\n').map((line) => `  ${line}`).join('\n');
}

function stripXmlDeclaration(svg) {
  return svg
    .replace(/^<\?xml[^>]*>\s*/u, '')
    .replace(/<svg[^>]*>/u, '')
    .replace(/<\/svg>\s*$/u, '')
    .replace(/<title[^>]*>.*?<\/title>\s*/su, '')
    .replace(/<desc[^>]*>.*?<\/desc>\s*/su, '')
    .replace(/<defs>.*?<\/defs>\s*/su, '')
    .trim();
}

function manifestEntry(asset) {
  return {
    id: asset.id,
    name: asset.zh,
    category: asset.category,
    format: 'svg',
    width: asset.width,
    height: asset.height,
    path: asset.path,
    usage: asset.usage,
  };
}

async function writeManifest() {
  const manifest = {
    packId: 'xiuxian-pack-v1',
    style: 'ink-wash-flat-mobile',
    assetCount: allAssets.length,
    generatedAt: GENERATED_AT,
    assets: allAssets.map(manifestEntry),
  };
  await writePackFile('manifest.json', `${JSON.stringify(manifest, null, 2)}\n`);
}

async function writeSprite() {
  const symbols = iconAssets.map((asset) => {
    const body = stripXmlDeclaration(renderIcon(asset));
    return `  <symbol id="icon-${asset.id}" viewBox="0 0 128 128">\n${indent(body)}\n  </symbol>`;
  }).join('\n');
  const sprite = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" style="display:none">
${symbols}
</svg>
`;
  const spriteMap = iconAssets.map((asset) => ({
    id: `icon-${asset.id}`,
    assetId: asset.id,
    name: asset.zh,
    category: asset.category,
    path: asset.path,
    symbol: `#icon-${asset.id}`,
    usage: asset.usage,
  }));
  await writePackFile('sprites/icons-sprite.svg', sprite);
  await writePackFile('sprites/sprite-map.json', `${JSON.stringify(spriteMap, null, 2)}\n`);
}

async function writeReadme() {
  const categoryCounts = allAssets.reduce((result, asset) => {
    result[asset.category] = (result[asset.category] ?? 0) + 1;
    return result;
  }, {});
  const readme = `# Xiuxian Visual Asset Pack V1

Standalone generated assets for the xiuxian idle web game.

## Summary

- Style: ink-wash flat illustration with light mobile-game polish.
- Visual assets: ${allAssets.length}.
- Icon assets: ${iconAssets.length}.
- Background assets: ${backgrounds.length}.
- Source of truth: individual SVG files.
- Code impact: this pack does not modify game code.

## Categories

${Object.entries(categoryCounts).map(([category, count]) => `- ${category}: ${count}`).join('\n')}

## Directory Map

\`\`\`text
generated-assets/xiuxian-pack-v1/
  manifest.json
  README.md
  icons/
    actions/
    resources/
    items/
    realms/
    npc-badges/
    status-effects/
  backgrounds/
  sprites/
    icons-sprite.svg
    sprite-map.json
  tools/
    build-assets.mjs
\`\`\`

## Palette

- Ink: ${palette.ink}
- Paper: ${palette.paper}
- Jade: ${palette.jade}
- Pine: ${palette.pine}
- Amber: ${palette.amber}
- Cinnabar: ${palette.cinnabar}
- Indigo: ${palette.indigo}
- Mist: ${palette.mist}

## Preview

Open any SVG file directly in a browser, for example:

\`\`\`text
generated-assets/xiuxian-pack-v1/icons/items/life-span-pill.svg
\`\`\`

## Sprite Usage Later

\`sprites/icons-sprite.svg\` contains one symbol per icon. A future UI integration can inline the sprite and reference:

\`\`\`html
<svg aria-hidden="true">
  <use href="#icon-life-span-pill"></use>
</svg>
\`\`\`

\`sprites/sprite-map.json\` maps each symbol id to its category, source file, Chinese name, and suggested usage.

## Regeneration

Run:

\`\`\`bash
node generated-assets/xiuxian-pack-v1/tools/build-assets.mjs
\`\`\`
`;
  await writePackFile('README.md', readme);
}

async function main() {
  for (const asset of iconAssets) {
    await writePackFile(asset.path, renderIcon(asset));
  }
  for (const asset of backgrounds) {
    await writePackFile(asset.path, renderBackground(asset));
  }
  await writeManifest();
  await writeSprite();
  await writeReadme();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
