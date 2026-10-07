# Emberfall

十個種族、八個職業的地牢冒險，支援繁體中文與 English。

五條交織主線共有二十章、六十個主要選擇與五種終局。種族、職業、證據、承諾與角色信任會改變對話、調查方式、支援和後續事件。劇情角色與記憶遺物出現在指定樓層入口附近。

## 遊玩

開啟 `index.html`，或在專案目錄執行 `python -m http.server 8000`，再瀏覽 `http://localhost:8000`。部署 GitHub Pages 時請保留所有 HTML、CSS 與 JS 檔案的相對位置。

- `wasd`／方向鍵：移動；`e`：互動。
- `n`：與附近劇情角色對話；`b`：交織主線日誌。
- `v`：種族篇章；`k`：遠征指揮；`h`：完整操作說明。
- 閱讀和追問不消耗回合。調查、承諾與終局選擇消耗一回合；介面顯示條件與實際資源成本。
- 未取得證據時仍有一般解法。主線選擇不能重選，後續補給與追兵不會重複觸發。
- 第 24 層守衛倒下後，在餘燼之心選擇終局，完成該路線戰鬥，再回到心前確認結局。

## 檔案

| 檔案 | 用途 |
| --- | --- |
| `index.html` / `styles.css` | 介面與樣式 |
| `game.js` | 地圖、戰鬥、種族、職業與遠征系統 |
| `startup.js` | 操作綁定、語言與介面啟動 |
| `narrative-data.js` | 主線章節、對話、選擇與效果 |
| `narrative-identities.js` | 種族／職業調查、態度與組合互動 |
| `narrative-engine.js` | 對話狀態、證據、後果、終局及存檔驗證 |
| `narrative-epilogues.js` | 世界結局與角色後日談 |

這些是依序載入的普通腳本，不需要編譯或遊戲伺服器。舊存檔會補上劇情資料；朋友挑戰碼使用 EF6，避免把不同地圖版本視為相同挑戰。

## 驗證

使用 Node.js 24 執行 `npm test`。包含既有功能回歸、六十種合法搭配、每章調查與選擇、跨主線條件、五種終局、存檔和翻譯檢查。GitHub Actions 會在 push／PR 執行這組測試。

瀏覽器測試另需 Playwright：先執行 `npm install --no-save playwright` 和 `npx playwright install chromium`，再執行 `npm run test:browser`。也可用 `CHROMIUM_PATH=/path/to/chromium npm run test:browser` 指定已安裝的 Chromium。測試對話、語言往返、手機寬度、終局和存檔恢复。
