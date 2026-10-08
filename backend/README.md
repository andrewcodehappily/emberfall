# Emberfall 遊玩後台

遊戲留在 GitHub Pages。Cloudflare Worker 接收心跳；D1 儲存最近 30 天的遊玩場次。管理員頁在 Worker 網址的 `/admin`。**合併 PR 不會自動部署後台，也不會開始統計。**

## 首次部署

需要你自己的 Cloudflare 帳號以及 Node.js。終端機進入 `backend`：

```sh
npx wrangler login
npx wrangler d1 create emberfall-stats
```

把輸出的 database_id 填入 `wrangler.jsonc`。然後執行：

```sh
npx wrangler d1 migrations apply emberfall-stats --remote
npx wrangler secret put ADMIN_TOKEN
npx wrangler deploy
```

`ADMIN_TOKEN` 請用密碼管理器產生至少 32 字元的隨機密鑰；不可放進 JS、GitHub 或聊天訊息。登入後台時輸入此密鑰。密鑰只存在記憶體，重新整理需重新登入。更換密鑰可撤銷舊密鑰。

在遊戲根目錄的 `analytics-config.js`，把空字串改成部署輸出的 `https://emberfall-stats.你的子網域.workers.dev`，不要加 `/admin` 或尾端斜線。提交後讓 GitHub Pages 更新。開遊戲、閱讀啟動說明、開始一局，再到 Worker 網址的 `/admin` 登入。

換遊戲網域時，同時修改 `GAME_ORIGIN`（只有協定和主機，不包含 `/emberfall/`），重新部署。後台和 IP API 不開放跨站讀取；遊戲端只可寫入事件。

## 統計定義

- 玩家＝匿名瀏覽器裝置，不是姓名。多分頁會產生多場次，但相同裝置只算一個玩家。共享 IP 不會合併玩家。
- 只有開始遊戲才記錄；停在首頁不記錄。每次開啟頁面顯示一次中英文說明，列出 IP、遊玩時間與活動狀態、30 天保存期，以及不同意時關閉遊戲的方式。不提供遊戲內統計開關，也不等待確認按鈕。舊版統計開關偏好不再使用。
- 心跳每 20 秒；最後 60 秒內有心跳、可見且最近 2 分鐘有操作才顯示在線。
- IP 從 Cloudflare 的請求標頭取得，不信任玩家在 JSON 傳的 IP。IP 可能是 VPN、代理或學校公用 IP，不能用來識別某位朋友。
- 開始、最後活動、正常離開時間都使用伺服器時間。突然斷線或關機不能知道精確離開時間，畫面明確標示最後心跳。
- 活躍時長排除背景與閒置；單次心跳最多增加 30 秒，避免斷線後補算數小時。一般最多漏記約 20 秒。
- 每天清除超過 30 天未活動的資料。登入密鑰不可分享給玩家。
- 這不是反作弊系統；客戶端事件和匿名 ID 可被偽造。來源檢查、大小上限、每 IP 每分鐘最多 60 次開局限制防止常見濫用，不能取代完整 DDoS 防護。

## 本機驗證

根目錄 `node tests/analytics.cjs` 使用真實 SQLite 驗證 API。`node tests/browser-analytics.cjs` 驗證啟動說明、自動收集和管理頁。也可在 backend 執行 `npx wrangler d1 migrations apply emberfall-stats --local`，在未提交的 `.dev.vars` 設定 ADMIN_TOKEN，然後 `npx wrangler dev`。本機測試需將 GAME_ORIGIN 改為你的本機遊戲來源。
