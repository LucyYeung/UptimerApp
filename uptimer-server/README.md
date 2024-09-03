# Uptime Server

## 專案介紹

`uptimer-server` 是一個先進的 Uptime 監控系統，專為確保網站、API 和服務的高可用性而設計。透過實時監控、靈活的警報通知和多元化的監控類型，系統將幫助用戶提前發現潛在問題，防止意外中斷，提升應用程式的可靠性。

此系統支援多種監控類型，包括 HTTP/HTTPS、TCP、MongoDB、Redis 以及 SSL/TLS 憑證狀態，滿足各類服務的監控需求。憑藉易於整合的 API 介面和自定義監控設置，使用者能夠根據實際需求調整監控頻率、閾值及類型等參數，確保全面掌握服務狀態。

`uptimer-server` 的特色還包括多元登入選項（如一般帳號、Facebook、Google 登入），大幅提升了使用便利性。除了基本的日誌管理外，系統還提供了詳細的日誌記錄與圖表功能，讓開發者輕鬆追蹤並解決問題。

專案採用 Node.js、TypeScript、GraphQL 等技術，結合高效能的資料庫如 MongoDB 和 Redis，用於服務的 ping 狀態檢測，以確保系統的穩定性和擴展性。

## 安裝

使用以下指令來安裝專案所需的依賴：

```bash
npm install
```

## 使用說明

### 啟動專案

- **啟動生產環境**
  ```bash
  npm start
  ```

  此指令會執行 `node ./build/src/index.js | pino-pretty -c`，啟動構建後的程式並使用 `pino-pretty` 美化log。

- **開發環境**
  ```bash
  npm run dev
  ```

  此指令會使用 `nodemon` 啟動 TypeScript 原始碼並支援路徑別名的解析，並使用 `pino-pretty` 美化 log。

- **建置專案**
  ```bash
  npm run build
  ```

  此指令會使用 TypeScript 編譯專案，並處理路徑別名及 `assets/` 複製。

## 主要依賴

- **@apollo/server**: 用於 GraphQL 伺服器的 Apollo Server。
- **express**: 快速、靈活的 Node.js Web 框架。
- **mongodb**: 用於服務 ping 狀態的 MongoDB 驅動。
- **redis**: 用於服務 ping 狀態的 Redis 驅動。
- **pg**: 用於與 PostgreSQL 互動的 Node.js 驅動。
- **sequelize**: 基於 Promise 的 Node.js ORM，用於 MySQL、PostgreSQL、SQLite 及 SQL Server。
- **graphql**: 用於建立 GraphQL API 的核心庫。
- **jsonwebtoken**: 用於 JSON Web Token 生成和驗證。
- **nodemailer**: 用於發送電子郵件的 Node.js 模組。
- **croner**: 用於定時任務的 Node.js 模組。
- **typescript**: TypeScript 編譯器。
- **pino & pino-pretty**: 高效能的 Node.js 日誌工具及美化器。

## 開發依賴

- **ts-node**: 在 Node.js 中執行 TypeScript 。
- **prettier**: 用於代碼格式化的工具。
- **@types**: TypeScript 對應的型別定義文件包。
