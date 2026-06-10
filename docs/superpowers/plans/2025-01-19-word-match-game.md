# 幼儿英语单词图片匹配游戏 — 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个纯静态的幼儿英语单词-图片匹配网页游戏，含同页单词库管理面板。

**Architecture:** 单个 `index.html` 文件（内嵌 CSS + JS）+ 一个 `words.json` 种子数据文件。游戏从单词库随机抽 4 个单词，卡片式布局展示，点击单词再点击图片匹配，即时反馈对错，全部完成后庆祝动画。管理面板支持增删单词，变更持久化到 localStorage 并支持导出 JSON。

**Tech Stack:** 纯 HTML5 + CSS3 + 原生 JavaScript（ES6+），零依赖，无构建工具。

---

## 文件结构

```
happy_learning/
├── index.html          # 创建 — 游戏 + 管理面板（全部内容）
├── words.json          # 创建 — 种子单词库
└── img/                # 已有 — 30 张图片
```

---

### Task 1: 创建种子单词库 `words.json`

**Files:**
- Create: `words.json`

> 基于 `img/` 目录下已有图片，文件名去 `.png` 后首字母大写作为 word。

- [ ] **Step 1: 写入 words.json**

```json
[
  { "word": "Alligator", "image": "img/alligator.png" },
  { "word": "Ant", "image": "img/ant.png" },
  { "word": "Apple", "image": "img/apple.png" },
  { "word": "Ax", "image": "img/ax.png" },
  { "word": "Banana", "image": "img/banana.png" },
  { "word": "Bear", "image": "img/bear.png" },
  { "word": "Bed", "image": "img/bed.png" },
  { "word": "Bird", "image": "img/bird.png" },
  { "word": "Boy", "image": "img/boy.png" },
  { "word": "Bunny", "image": "img/bunny.png" },
  { "word": "Car", "image": "img/car.png" },
  { "word": "Cat", "image": "img/cat.png" },
  { "word": "Chicken", "image": "img/chicken.png" },
  { "word": "Computer", "image": "img/computer.png" },
  { "word": "Cow", "image": "img/cow.png" },
  { "word": "Cup", "image": "img/cup.png" },
  { "word": "Deer", "image": "img/deer.png" },
  { "word": "Dog", "image": "img/dog.png" },
  { "word": "Duck", "image": "img/duck.png" },
  { "word": "Fox", "image": "img/fox.png" },
  { "word": "Girl", "image": "img/girl.png" },
  { "word": "Goat", "image": "img/goat.png" },
  { "word": "Goldfish", "image": "img/goldfish.png" },
  { "word": "Hamster", "image": "img/hamster.png" },
  { "word": "Horse", "image": "img/horse.png" },
  { "word": "Mouse", "image": "img/mouse.png" },
  { "word": "Pig", "image": "img/pig.png" },
  { "word": "Sheep", "image": "img/sheep.png" },
  { "word": "Turtle", "image": "img/turtle.png" }
]
```

> 注意：排除 `animals.png`（它不是单个单词，是分类图）。

- [ ] **Step 2: 验证 JSON 格式**

Run: `python3 -m json.tool words.json > /dev/null && echo "Valid JSON"`

---

### Task 2: 创建 `index.html` — HTML 骨架与 CSS 样式

**Files:**
- Create: `index.html`

- [ ] **Step 1: 写入完整的 HTML/CSS 骨架**

内容包括：
- DOCTYPE + meta viewport
- 全部 CSS 样式（变量、布局、卡片、动画、管理面板、响应式）
- HTML 结构（标题栏、游戏区、庆祝层、管理面板）
- 空的 `<script>` 占位（Task 3 填充）

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>🎈 幼儿英语单词匹配游戏</title>
<style>
/* ===== CSS 变量 ===== */
:root {
  --orange: #FF9800;
  --orange-light: #FFF3E0;
  --green: #4CAF50;
  --green-light: #E8F5E9;
  --red: #F44336;
  --red-light: #FFEBEE;
  --bg: #FFF9F0;
  --card-shadow: 0 4px 12px rgba(0,0,0,0.10);
  --card-radius: 16px;
}

/* ===== 基础样式 ===== */
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: 'Segoe UI', 'PingFang SC', 'Noto Sans SC', system-ui, sans-serif;
  background: var(--bg);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 16px;
}
.container {
  max-width: 720px;
  width: 100%;
  margin: 0 auto;
}

/* ===== 标题栏 ===== */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  flex-wrap: wrap;
  gap: 12px;
}
.header h1 { font-size: 28px; color: #333; }
.btn-manage {
  padding: 10px 20px;
  border: 2px solid var(--orange);
  background: white;
  color: var(--orange);
  border-radius: 24px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.2s;
}
.btn-manage:hover { background: var(--orange); color: white; }

/* ===== 游戏区 ===== */
.game-area {
  display: flex;
  flex-direction: column;
  gap: 28px;
}
.card-row {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

/* ===== 卡片基础 ===== */
.card {
  border-radius: var(--card-radius);
  box-shadow: var(--card-shadow);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s, background 0.2s;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}
.card:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.14); }

/* ===== 单词卡片 ===== */
.word-card {
  background: white;
  border: 3px solid var(--orange);
  width: 140px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  font-weight: 700;
  color: #333;
}
.word-card.selected {
  border-color: #E65100;
  background: var(--orange-light);
  transform: scale(1.06);
  box-shadow: 0 6px 18px rgba(255,152,0,0.30);
}
.word-card.matched {
  border-color: var(--green);
  background: var(--green-light);
  cursor: default;
  pointer-events: none;
}
.word-card.matched::after {
  content: ' ✓';
  color: var(--green);
  font-size: 22px;
}
.word-card.matched:hover { transform: none; box-shadow: var(--card-shadow); }

/* ===== 图片卡片 ===== */
.image-card {
  background: white;
  border: 3px solid #E0E0E0;
  width: 140px;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 8px;
}
.image-card img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  pointer-events: none;
}
.image-card.matched {
  border-color: var(--green);
  background: var(--green-light);
  cursor: default;
  pointer-events: none;
}
.image-card.matched::after {
  content: '✓';
  position: absolute;
  font-size: 28px;
  color: var(--green);
  font-weight: bold;
}
.image-card.wrong {
  animation: shake 0.4s ease;
  border-color: var(--red) !important;
  background: var(--red-light) !important;
}

/* 图片占位（加载失败） */
.image-card .placeholder {
  font-size: 14px;
  color: #999;
  text-align: center;
}

/* ===== 抖动动画 ===== */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-6px); }
  80% { transform: translateX(6px); }
}

/* ===== 状态栏 ===== */
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  font-size: 16px;
  color: #666;
}
.error-count { color: var(--red); font-weight: 600; }
.btn-play-again {
  padding: 10px 24px;
  background: var(--orange);
  color: white;
  border: none;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-play-again:hover { background: #F57C00; }

/* ===== 庆祝遮罩 ===== */
.celebration-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.50);
  z-index: 100;
  justify-content: center;
  align-items: center;
}
.celebration-overlay.show { display: flex; }
.celebration-box {
  background: white;
  border-radius: 24px;
  padding: 40px 48px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0,0,0,0.20);
  animation: popIn 0.4s ease;
  max-width: 400px;
  width: 90%;
}
@keyframes popIn {
  0% { transform: scale(0.5); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
.celebration-box .emoji { font-size: 64px; }
.celebration-box h2 { font-size: 28px; color: #333; margin: 12px 0; }
.celebration-box .errors { font-size: 16px; color: #999; margin-bottom: 20px; }

/* ===== 撒花 ===== */
.confetti-container {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 101;
  overflow: hidden;
}
.confetti {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 3px;
  animation: confetti-fall linear forwards;
}
@keyframes confetti-fall {
  0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
  100% { transform: translateY(105vh) rotate(720deg); opacity: 0; }
}

/* ===== 管理面板 ===== */
.manage-panel {
  display: none;
  margin-top: 32px;
  background: white;
  border-radius: 16px;
  box-shadow: var(--card-shadow);
  padding: 24px;
}
.manage-panel.show { display: block; }
.manage-panel h3 { font-size: 20px; margin-bottom: 16px; color: #333; }

.add-form {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
  align-items: flex-end;
}
.add-form input,
.add-form select {
  padding: 10px 14px;
  border: 2px solid #E0E0E0;
  border-radius: 10px;
  font-size: 15px;
  font-family: inherit;
}
.add-form input:focus,
.add-form select:focus { outline: none; border-color: var(--orange); }
.add-form input[type="text"] { flex: 1; min-width: 120px; }
.add-form input[type="file"] { display: none; }
.btn-upload {
  padding: 10px 16px;
  background: #F5F5F5;
  border: 2px dashed #CCC;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  transition: all 0.2s;
}
.btn-upload:hover { border-color: var(--orange); color: var(--orange); }
.btn-add {
  padding: 10px 20px;
  background: var(--orange);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}
.btn-add:hover { background: #F57C00; }

.word-list { border-top: 1px solid #EEE; padding-top: 12px; }
.word-list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 8px;
  border-bottom: 1px solid #F5F5F5;
  font-size: 16px;
}
.word-list-item .thumb {
  width: 48px; height: 48px;
  border-radius: 8px;
  object-fit: contain;
  background: #F5F5F5;
  border: 1px solid #EEE;
}
.word-list-item .word-text { flex: 1; font-weight: 600; }
.word-list-item .word-count { color: #999; font-size: 14px; }
.btn-delete {
  padding: 6px 14px;
  background: none;
  border: 1px solid var(--red);
  color: var(--red);
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}
.btn-delete:hover { background: var(--red); color: white; }

.manage-actions {
  margin-top: 16px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.btn-export {
  padding: 10px 20px;
  background: white;
  border: 2px solid #333;
  color: #333;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
}
.btn-export:hover { background: #333; color: white; }

.hint {
  font-size: 13px;
  color: #999;
  margin-top: 12px;
}

/* ===== 单词不足提示 ===== */
.empty-state {
  display: none;
  text-align: center;
  padding: 48px 24px;
  color: #999;
}
.empty-state.show { display: block; }
.empty-state .emoji { font-size: 48px; }
.empty-state p { font-size: 18px; margin: 12px 0; }

/* ===== 响应式 ===== */
@media (max-width: 640px) {
  .header h1 { font-size: 22px; }
  .word-card, .image-card { width: 120px; }
  .word-card { height: 68px; font-size: 22px; }
  .image-card { height: 120px; }
  .card-row { gap: 10px; }
  .celebration-box { padding: 28px 24px; }
}
@media (max-width: 400px) {
  .word-card, .image-card { width: 100px; }
  .word-card { height: 56px; font-size: 18px; }
  .image-card { height: 100px; }
  .card-row { gap: 8px; }
}
</style>
</head>
<body>

<div class="container">
  <!-- 标题栏 -->
  <div class="header">
    <h1>🎈 幼儿英语单词匹配游戏</h1>
    <button class="btn-manage" id="btnManage">📝 管理单词库</button>
  </div>

  <!-- 空单词库提示 -->
  <div class="empty-state" id="emptyState">
    <div class="emoji">📚</div>
    <p>单词库至少需要 4 个单词才能开始游戏哦～</p>
    <button class="btn-manage" onclick="toggleManagePanel()">去添加单词</button>
  </div>

  <!-- 游戏区 -->
  <div class="game-area" id="gameArea">
    <div class="card-row" id="wordRow"></div>
    <div class="card-row" id="imageRow"></div>
    <div class="status-bar">
      <span>错误：<span class="error-count" id="errorCount">0</span> 次</span>
      <button class="btn-play-again" id="btnPlayAgain">🔄 再来一局</button>
    </div>
  </div>

  <!-- 管理面板 -->
  <div class="manage-panel" id="managePanel">
    <h3>📝 单词库管理</h3>
    <div class="add-form">
      <input type="text" id="newWord" placeholder="输入英文单词，如 Elephant" maxlength="30">
      <select id="existingImage" style="min-width:140px">
        <option value="">选择已有图片</option>
      </select>
      <input type="file" id="imageUpload" accept="image/*">
      <label class="btn-upload" for="imageUpload">📷 上传新图片</label>
      <button class="btn-add" id="btnAdd">+ 添加</button>
    </div>
    <div class="word-list" id="wordList"></div>
    <div class="manage-actions">
      <button class="btn-export" id="btnExport">💾 导出单词库 (JSON)</button>
    </div>
    <p class="hint">💡 添加的单词会自动保存到浏览器本地存储。上传的图片会转为 Base64 存储，无需服务器。</p>
  </div>
</div>

<!-- 庆祝遮罩 -->
<div class="celebration-overlay" id="celebrationOverlay">
  <div class="celebration-box">
    <div class="emoji">🎉</div>
    <h2>太棒了！全部正确！</h2>
    <p class="errors" id="celebrationErrors"></p>
    <button class="btn-play-again" id="btnCelebratePlayAgain">🔄 再来一局</button>
  </div>
</div>

<!-- 撒花容器 -->
<div class="confetti-container" id="confettiContainer"></div>

<script>
// JS 逻辑在 Task 3 中填充
</script>

</body>
</html>
```

---

### Task 3: 填充 JavaScript — 单词库管理与核心游戏逻辑

**Files:**
- Modify: `index.html` — 替换空的 `<script>...</script>` 为完整 JS

- [ ] **Step 1: 写入完整 JavaScript 代码**

```javascript
// ==================== 单词库管理 ====================

const STORAGE_KEY = 'wordMatchGame_words';
const MIN_WORDS = 4;

// 加载单词库：优先 localStorage，回退到 words.json
let wordBank = [];

function loadWordBank() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      wordBank = JSON.parse(stored);
      if (wordBank.length >= MIN_WORDS) return;
    } catch (e) { /* ignore */ }
  }
  // 从 words.json 加载种子数据
  fetch('words.json')
    .then(r => r.json())
    .then(data => {
      wordBank = data;
      saveWordBank();
      initApp();
    })
    .catch(() => {
      // 如果 words.json 也加载失败，用 localStorage 的数据（哪怕不足）
      initApp();
    });
}

function saveWordBank() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wordBank));
}

// ==================== 图片上传处理 ====================

function handleImageUpload(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('请选择图片文件'));
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('读取失败'));
    reader.readAsDataURL(file);
  });
}

// ==================== 游戏状态 ====================

let gameState = {
  roundWords: [],        // [{word, image, index}] 本局 4 个单词（index 为在 wordBank 中的原始索引）
  wordOrder: [],         // 单词卡片显示顺序（0-3 的排列）
  imageOrder: [],        // 图片卡片显示顺序（0-3 的排列）
  selectedWordSlot: null, // 当前选中单词在 wordOrder 中的位置（0-3）
  matchedSlots: new Set(), // 已配对的 slot（0-3）
  errorCount: 0,
  locked: false          // 动画进行中，禁止点击
};

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ==================== 渲染 ====================

function startGame() {
  // 检查单词库是否充足
  if (wordBank.length < MIN_WORDS) {
    document.getElementById('gameArea').style.display = 'none';
    document.getElementById('emptyState').classList.add('show');
    return;
  }
  document.getElementById('gameArea').style.display = '';
  document.getElementById('emptyState').classList.remove('show');

  // 随机选 4 个单词
  const indices = shuffleArray([...Array(wordBank.length).keys()]).slice(0, MIN_WORDS);
  gameState = {
    roundWords: indices.map((idx, i) => ({ ...wordBank[idx], origIdx: idx, slot: i })),
    wordOrder: shuffleArray([0, 1, 2, 3]),
    imageOrder: shuffleArray([0, 1, 2, 3]),
    selectedWordSlot: null,
    matchedSlots: new Set(),
    errorCount: 0,
    locked: false
  };

  renderCards();
  updateErrorCount();
  hideCelebration();
}

function renderCards() {
  const wordRow = document.getElementById('wordRow');
  const imageRow = document.getElementById('imageRow');

  wordRow.innerHTML = '';
  imageRow.innerHTML = '';

  gameState.wordOrder.forEach((slot, displayPos) => {
    const w = gameState.roundWords[slot];
    const card = document.createElement('div');
    card.className = 'card word-card';
    card.textContent = w.word;
    card.dataset.displayPos = displayPos;
    card.dataset.slot = slot;

    if (gameState.matchedSlots.has(slot)) {
      card.classList.add('matched');
    } else if (gameState.selectedWordSlot === slot) {
      card.classList.add('selected');
    }

    card.addEventListener('click', () => onWordClick(slot, displayPos));
    wordRow.appendChild(card);
  });

  gameState.imageOrder.forEach((slot, displayPos) => {
    const w = gameState.roundWords[slot];
    const card = document.createElement('div');
    card.className = 'card image-card';
    card.dataset.displayPos = displayPos;
    card.dataset.slot = slot;

    if (gameState.matchedSlots.has(slot)) {
      card.classList.add('matched');
    }

    const img = document.createElement('img');
    img.src = w.image;
    img.alt = w.word;
    img.onerror = () => {
      img.style.display = 'none';
      const ph = document.createElement('span');
      ph.className = 'placeholder';
      ph.textContent = w.word;
      card.appendChild(ph);
    };
    card.appendChild(img);

    card.addEventListener('click', () => onImageClick(slot, card));
    imageRow.appendChild(card);
  });
}

function getWordCardBySlot(slot) {
  return document.querySelector(`.word-card[data-slot="${slot}"]`);
}

function getImageCardBySlot(slot) {
  return document.querySelector(`.image-card[data-slot="${slot}"]`);
}

// ==================== 交互 ====================

function onWordClick(slot, displayPos) {
  if (gameState.locked) return;
  if (gameState.matchedSlots.has(slot)) return;

  // 点击同一个：取消选中
  if (gameState.selectedWordSlot === slot) {
    gameState.selectedWordSlot = null;
  } else {
    gameState.selectedWordSlot = slot;
  }
  renderCards();
}

function onImageClick(slot, card) {
  if (gameState.locked) return;
  if (gameState.matchedSlots.has(slot)) return;
  if (gameState.selectedWordSlot === null) return; // 还没选单词

  gameState.locked = true;

  if (gameState.selectedWordSlot === slot) {
    // 正确！
    gameState.matchedSlots.add(slot);
    gameState.selectedWordSlot = null;
    renderCards();
    gameState.locked = false;

    // 检查是否全部完成
    if (gameState.matchedSlots.size === MIN_WORDS) {
      setTimeout(showCelebration, 300);
    }
  } else {
    // 错误！
    gameState.errorCount++;
    updateErrorCount();
    card.classList.add('wrong');
    const wordCard = getWordCardBySlot(gameState.selectedWordSlot);
    if (wordCard) wordCard.classList.add('wrong');

    gameState.selectedWordSlot = null;

    setTimeout(() => {
      renderCards();
      gameState.locked = false;
    }, 450);
  }
}

function updateErrorCount() {
  document.getElementById('errorCount').textContent = gameState.errorCount;
}

// ==================== 庆祝 ====================

function showCelebration() {
  const overlay = document.getElementById('celebrationOverlay');
  overlay.classList.add('show');
  document.getElementById('celebrationErrors').textContent =
    gameState.errorCount === 0
      ? '零失误，完美！⭐'
      : `共错 ${gameState.errorCount} 次，继续加油哦～`;
  spawnConfetti();
}

function hideCelebration() {
  document.getElementById('celebrationOverlay').classList.remove('show');
  document.getElementById('confettiContainer').innerHTML = '';
}

function spawnConfetti() {
  const container = document.getElementById('confettiContainer');
  container.innerHTML = '';
  const colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF8C00', '#E040FB', '#00BCD4', '#FF4081'];

  for (let i = 0; i < 60; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDuration = (Math.random() * 2 + 2.5) + 's';
    confetti.style.animationDelay = Math.random() * 1.5 + 's';
    confetti.style.width = (Math.random() * 10 + 8) + 'px';
    confetti.style.height = (Math.random() * 10 + 8) + 'px';
    container.appendChild(confetti);
  }

  // 3.5s 后清理
  setTimeout(() => { container.innerHTML = ''; }, 4000);
}

// ==================== 管理面板 ====================

function toggleManagePanel() {
  const panel = document.getElementById('managePanel');
  panel.classList.toggle('show');
  if (panel.classList.contains('show')) {
    renderWordList();
    populateImageSelect();
  }
}

function renderWordList() {
  const list = document.getElementById('wordList');
  list.innerHTML = wordBank.map((w, i) => `
    <div class="word-list-item">
      <img class="thumb" src="${escapeHtml(w.image)}" alt="${escapeHtml(w.word)}" onerror="this.style.display='none'">
      <span class="word-text">${escapeHtml(w.word)}</span>
      <button class="btn-delete" data-index="${i}">删除</button>
    </div>
  `).join('');

  // 绑定删除事件
  list.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => deleteWord(parseInt(btn.dataset.index)));
  });
}

function populateImageSelect() {
  const select = document.getElementById('existingImage');
  select.innerHTML = '<option value="">选择已有图片</option>' +
    wordBank.map(w => `<option value="${escapeHtml(w.image)}">${escapeHtml(w.word)} — ${escapeHtml(w.image)}</option>`).join('');
}

async function addWord() {
  const wordInput = document.getElementById('newWord');
  const selectEl = document.getElementById('existingImage');
  const fileInput = document.getElementById('imageUpload');
  const word = wordInput.value.trim();

  if (!word) { alert('请输入单词'); return; }
  if (wordBank.some(w => w.word.toLowerCase() === word.toLowerCase())) {
    alert('该单词已存在');
    return;
  }

  let image = selectEl.value;

  // 上传新图片优先
  if (fileInput.files.length > 0) {
    try {
      image = await handleImageUpload(fileInput.files[0]);
    } catch (e) {
      alert(e.message);
      return;
    }
  }

  if (!image) {
    alert('请选择已有图片或上传新图片');
    return;
  }

  wordBank.push({ word: formatWord(word), image });
  saveWordBank();

  // 清空表单
  wordInput.value = '';
  selectEl.value = '';
  fileInput.value = '';

  renderWordList();
  populateImageSelect();
  startGame(); // 刷新游戏
}

function deleteWord(index) {
  if (wordBank.length <= MIN_WORDS) {
    alert(`至少需要保留 ${MIN_WORDS} 个单词才能游戏`);
    return;
  }
  if (!confirm(`确定删除 "${wordBank[index].word}" 吗？`)) return;

  wordBank.splice(index, 1);
  saveWordBank();
  renderWordList();
  populateImageSelect();
  startGame();
}

function exportWords() {
  const blob = new Blob([JSON.stringify(wordBank, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'words.json';
  a.click();
  URL.revokeObjectURL(url);
}

function formatWord(s) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function escapeHtml(s) {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

// ==================== 初始化 ====================

function initApp() {
  bindEvents();
  startGame();
}

function bindEvents() {
  document.getElementById('btnManage').addEventListener('click', toggleManagePanel);
  document.getElementById('btnPlayAgain').addEventListener('click', startGame);
  document.getElementById('btnCelebratePlayAgain').addEventListener('click', () => {
    hideCelebration();
    startGame();
  });
  document.getElementById('btnAdd').addEventListener('click', addWord);
  document.getElementById('btnExport').addEventListener('click', exportWords);

  // 回车提交
  document.getElementById('newWord').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addWord();
  });
}

// 启动
loadWordBank();
```

- [ ] **Step 2: 验证 HTML 语法**

Run: `open index.html`（或直接在浏览器打开）检查：

- 单词卡片和图片卡片正常渲染
- 点击单词高亮，点击图片反馈
- 全部完成弹出庆祝
- 管理面板增删单词、导出 JSON

---

### Task 4: 验证与收尾

- [ ] **Step 1: 完整功能验证清单**

在浏览器中手动验证以下场景：

| # | 场景 | 预期 |
|---|------|------|
| 1 | 打开页面 | 显示 4 个单词卡片 + 4 个图片卡片，顺序各不同 |
| 2 | 点击单词再点击正确图片 | 两者变绿锁定，显示 ✓ |
| 3 | 点击单词再点击错误图片 | 图片闪红抖动，单词取消高亮，错误计数+1 |
| 4 | 点击已选中单词 | 取消选中 |
| 5 | 4 对全部正确 | 弹出庆祝动画 + 撒花 + 错误次数 |
| 6 | 点击"再来一局" | 新一局，卡片全部刷新 |
| 7 | 管理面板：添加单词+选择已有图片 | 单词库新增，游戏区刷新 |
| 8 | 管理面板：上传新图片 | Base64 图片存储到 localStorage |
| 9 | 管理面板：删除单词 | 单词库减少（≥4 个时允许删） |
| 10 | 管理面板：导出 JSON | 下载 words.json |
| 11 | 刷新页面 | 管理面板修改保留（localStorage） |
| 12 | 移动端浏览器 | 卡片自适应，2×2 排列 |

- [ ] **Step 2: 添加到 .gitignore**

确保 `.superpowers/` 被忽略：

```bash
echo ".superpowers/" >> .gitignore
```

- [ ] **Step 3: Commit 所有文件**

```bash
git add words.json index.html .gitignore
git commit -m "feat: 幼儿英语单词图片匹配游戏

- 卡片式布局，单词上图片下，随机排列
- 点击单词+图片匹配，即时正确/错误反馈
- 全部完成后庆祝动画+撒花效果
- 同页管理面板：增删单词、上传图片、导出JSON
- localStorage 持久化 + words.json 种子数据
- 响应式适配桌面/平板/手机"
```

---

## 自检清单

- [x] **Spec 覆盖**：布局 ✓、交互 ✓、结果 ✓、管理面板 ✓、边界情况 ✓、状态管理 ✓
- [x] **无占位符**：所有代码均为完整可运行代码，无 TBD/TODO
- [x] **类型一致性**：`gameState` 的字段名在全部函数中一致使用：`roundWords`, `wordOrder`, `imageOrder`, `selectedWordSlot`, `matchedSlots`, `errorCount`, `locked`
