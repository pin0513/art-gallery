# LITING Art — 專案說明

## 品牌

**LITING Art**（立庭藝廊）

## 專案概述

線上藝廊展示平台。公開端展示藝術家與作品，管理端提供作品上傳、藝術家管理與白名單控制，需通過 Google OAuth 才能進入。

---

## 技術棧

| 層面 | 技術 |
|------|------|
| Framework | Next.js 16.1.6 (App Router) |
| UI | React 19 + Tailwind CSS 4 |
| 狀態管理 | Zustand 5 |
| 動畫 | Framer Motion 12 |
| 認證 | Firebase Auth (Google OAuth) |
| 資料庫 | Firestore |
| 圖片儲存 | Google Cloud Storage (作品) + Firebase Storage (頭像) |
| 語言 | TypeScript 5 |
| 套件管理 | pnpm |

---

## 目錄結構

```
src/
├── app/
│   ├── (admin)/admin/          # 受保護管理區域（白名單控管）
│   │   ├── artworks/           # 作品管理（CRUD）
│   │   ├── artist/             # 藝術家管理（CRUD）
│   │   ├── upload/             # 作品上傳（多尺寸）
│   │   └── whitelist/          # 管理員白名單
│   ├── (auth)/login/           # Google OAuth 登入
│   ├── (public)/               # 公開頁面
│   │   ├── gallery/[id]        # 藝廊 + 作品詳情
│   │   └── artist/[id]         # 藝術家列表 + 詳情
│   └── api/upload/             # GCS 上傳 API Route
├── components/
│   ├── gallery/                # ArtworkCard、ArtworkGrid
│   ├── home/                   # HeroSection、FeaturedArtworks、ArtistSpotlight
│   └── layout/                 # Navbar、Footer
├── lib/
│   ├── firebase.ts             # Firebase 初始化
│   ├── auth.ts                 # 認證函數
│   └── firestore/              # artworks / artists / whitelist CRUD
├── stores/authStore.ts         # Zustand 認證狀態
└── types/                      # artwork / artist / admin 型別定義
```

---

## 已完成功能

- ✅ 公開藝廊（作品列表、詳情頁、藝術家頁）
- ✅ Google OAuth 登入 + Zustand 狀態管理
- ✅ 管理儀表板（白名單保護）
- ✅ 作品上傳（Canvas 多尺寸：480px / 768px / 原始）→ GCS，WebP 格式
- ✅ 作品管理（編輯、刪除、標籤）
- ✅ 藝術家管理（頭像/封面上傳 → Firebase Storage）
- ✅ 管理員白名單（Firestore admins 集合）
- ✅ Firestore 安全規則（公開讀 / 認證寫）
- ✅ Docker 多階段構建 + Google Cloud Build + Cloud Run 部署
- ✅ 動態 SEO 元數據（og:image、twitter card、description）
- ✅ 自訂網域 https://liting-art.paulfun.net（Cloud Run domain mapping）
- ✅ Seed 作品 2 件（Luminous Oracle、Celestial Reverie）

---

## 待完成功能（TODO）

### 高優先

- [ ] **藝廊搜尋 / 篩選** — 依標籤、藝術家、年份篩選作品
- [ ] **分頁 / 無限滾動** — 目前一次載入全部作品，量大時需分頁

### 中優先

- [ ] **收藏功能** — 使用者可收藏作品（需登入）
- [ ] **用戶個人頁面** — 顯示收藏清單
- [ ] **管理端作品排序** — 拖拉調整精選作品順序

### 低優先

- [ ] **評論 / 留言** — 作品頁留言區
- [ ] **聯絡藝術家** — 詢問購買意願的表單
- [ ] **Google Analytics** — 流量分析
- [ ] **暗色模式** — next-themes 已安裝，尚未接線

---

## 開發指令

```bash
pnpm dev          # 開發伺服器 http://localhost:3000
pnpm build        # 生產建置
pnpm start        # 啟動生產伺服器
```

---

## 環境變數

參考 `.env.local.example`，必填項目：

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Google Cloud Storage
GCS_BUCKET_NAME=
GCS_PROJECT_ID=
GOOGLE_APPLICATION_CREDENTIALS=  # 服務帳號 JSON 路徑
NEXT_PUBLIC_GCS_PUBLIC_URL=       # CDN 公開網址前綴
```

---

## 部署

**平台**：Google Cloud Run（via Cloud Build）

- **正式網址**：https://liting-art.paulfun.net
- **Cloud Run URL**：https://art-gallery-7jry7awz3a-de.a.run.app
- **Region**：asia-east1
- **Project**：liting-art-gallery
- **DNS**：Cloudflare CNAME `liting-art` → `ghs.googlehosted.com`（DNS only，不開 Proxy）

```bash
# 手動觸發 Cloud Build
gcloud builds submit --config cloudbuild.yaml

# 或直接 Docker 建置測試
docker build -t art-gallery .
docker run -p 3000:3000 --env-file .env.local art-gallery
```

**CI/CD**：push to `main` → GitHub Actions → Cloud Build → Cloud Run 自動部署

---

## 重要提醒

- **禁止** 使用 `any`（Zero Any Policy）
- 圖片上傳須走 `/api/upload` API Route（GCS 服務帳號憑證在伺服器端）
- 管理員判斷依賴 Firestore `admins` 集合，新管理員須由現有管理員從 `/admin/whitelist` 添加
- Firestore 安全規則在 `firestore.rules`，本地修改後需 `firebase deploy --only firestore:rules`

---

**版本**：0.2.0
**建立日期**：2026-02-18
**最後更新**：2026-02-18
