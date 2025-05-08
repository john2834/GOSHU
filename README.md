# ZTMY 福岡6日遊

[點此查看網站](https://john2834.github.io/GOSHU/)

這是一個為 2025 年 5 月的福岡旅程所設計的 **靜態行程展示網站**。  
採用 **JSON 載入行程資料、每日一頁切換、支援手機與電腦** 的簡化版設計，保留基本互動與動畫效果，風格為輕量化「神社朱印風」。

---

## ✅ 主要功能特性

| 功能 | 說明 |
|------|------|
| 📱 多裝置自適應 RWD | 手機與桌面皆能正常顯示 |
| 📖 一日一頁切換 | 每一日為一個獨立頁面，可按鈕或動畫切換 |
| 🌀 淡入淡出動畫 | 行程顯示採用滑入、漸現效果 |
| 🎴 日式風格設計 | 使用淡紫＋粉＋藍為基調，復古簡約 |
| ⌚ 顯示行程時間 | 若有 time 欄位則會列出時間 |
| 🗺️ 地圖連結 | 若有 map 欄位，顯示地圖按鈕 |
| 🗂️ 首頁快速選日 | 首頁提供每日選擇按鈕 |
| 💾 完全無資料庫 | 使用純 JSON (`ztmy_trip.json`) 載入行程資料 |

---

## 📂 專案結構

```
/ (根目錄)
├── index.html               # 主入口頁
├── ztmy_trip.json           # 行程資料
├── assets/
│   ├── css/
│   │   └── style.css        # 主樣式
│   ├── js/
│   │   ├── main.js          # 程式邏輯 (自動載入 JSON、切換頁面)
│   └── img/
│       └── paper_bg.png     # 背景圖（如有）
```

---

## 🚀 使用方式

### 一般使用者

1. 解壓縮整包 zip 檔案
2. 使用 [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) 開啟 `index.html`
3. 或使用 Python 啟動本地伺服器：

```bash
python -m http.server
```

然後開啟瀏覽器前往 `http://localhost:8000/`

---

## 🛠️ 自訂行程資料

### 修改行程
打開 `ztmy_trip.json`，可自由增刪每日或行程內容：

```json
{
  "date": "2025-5-09",
  "title": "第一天 台灣出發",
  "events": [
    {
      "time": "16:40",
      "desc": "桃園機場出發 → 福岡機場"
    },
    {
      "time": "22:00",
      "desc": "SUNNY 超市",
      "map": "https://maps.app.goo.gl/xxxxx"
    }
  ]
}
```

### 自動轉換工具
若你有 `.txt` 行程，可以使用 `convert_txt_to_json_v2.py` 自動產出 `ztmy_trip.json`

---

## 🧩 可擴充建議（未內建）
- 分享行程頁（產生分享網址）
- 加入照片區塊（上傳御朱印照片）
- 夜間模式切換
- 離線模式（PWA）

---

## 🧑‍💻 製作
若要進一步調整設計樣式、樣版、或轉為完整 Vue/Svelte SPA，請自行 fork 再擴充。