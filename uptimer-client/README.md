# Uptimer Client

## 專案介紹

`uptimer-client` 是 `uptimer-server` 對應的前端用戶端應用，使用 Next.js 框架建構，並整合了 GraphQL 與各種前端技術，提供用戶直覺且功能強大的服務狀態監控平台。此專案支援實時數據展示、視覺化圖表、Email 通知等功能，旨在提供用戶一站式的監控體驗。

專案內建支援多種工具如 Tailwind CSS 進行快速的 UI 開發，並利用 Apollo Client 與 GraphQL 進行資料的高效同步處理，確保前端數據的即時性與準確性。此外，`uptimer-client` 採用了現代化的開發流程，包括代碼格式化、linting、版本控制的最佳實踐，確保專案代碼質量。

## 安裝

請確保您已經安裝了 Node.js，然後使用以下指令來安裝專案所需的依賴：

```bash
npm install
```

## 使用說明

### 啟動專案

- **開發環境**
  ```bash
  npm run dev
  ```
- **建置專案**
  ```bash
  npm run build
  ```
- **啟動生產環境**
  ```bash
  npm start
  ```

## 開發依賴及設定

### Husky 與 Lint-Staged

專案使用 Husky 進行 Git hooks 設定，並使用 Lint-Staged 來在提交前自動執行代碼檢查和格式化，確保代碼品質。

- **Husky 設定**: 預先安裝 Git hooks 並執行 `lint-staged`。
- **Lint-Staged 設定**: 在提交前自動修正符合設定的文件格式。

### 主要依賴

- **@apollo/client**: 用於 GraphQL 的前端客戶端。
- **dayjs**: 用於處理日期和時間的輕量級函式庫。
- **chart.js & react-chartjs-2**: 用於生成視覺化圖表的強大工具。
- **firebase**: 用於通知和實時資料同步等功能。
- **next**: 使用 Next.js 建構的 React 應用框架，支援 SSR 和靜態站點生成。
- **react-toastify**: 用於顯示友好通知的 React 組件。
- **tailwindcss**: 用於快速樣式設計的 CSS 框架。
- **zod**: 用於資料驗證的 TypeScript 首選工具。

### 開發依賴

- **typescript**: TypeScript 編譯器，用於靜態類型檢查。
- **eslint**: 用於檢查和維持代碼風格。
- **husky**: 用於 Git hooks 的管理。
- **prettier**: 用於代碼格式化的工具，確保代碼一致性。
