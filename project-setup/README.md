# Project Setup

## 專案介紹

`project-setup` 資料夾包含 Docker Compose 配置文件，用於快速設置和運行 PostgreSQL、MongoDB 和 Redis 服務。這些服務可以用於測試和開發環境中。資料夾內還包含一個 JavaScript 檔案，用於啟動 Express 伺服器。

## 使用說明

### 啟動 Docker 服務
1. 確保已安裝 Docker 和 Docker Compose。
2. 在 `project-setup` 資料夾內執行以下指令以啟動服務：

    ```bash
    docker-compose up -d
    ```

    此指令會在背景中啟動 PostgreSQL、MongoDB 和 Redis 服務。

### 停止並移除 Docker 服務
1. 若要停止並移除正在運行的 Docker 容器，執行以下指令：

    ```bash
    docker-compose down
    ```

    此指令會停止並移除所有由 Docker Compose 啟動的容器，但不會刪除資料卷。

### 使用 Express 伺服器

1. 確保 Node.js 和 npm 已安裝。
2. 在 `project-setup` 資料夾內執行以下指令以啟動 Express 伺服器：
    ```bash
    node express.js
    ```
