# 🎬 Reels / Shorts Downloader — by OM
## Working link : [reels-downloader](https://reels-downloader-sepia.vercel.app/)

A full-stack MERN web application to download **YouTube Shorts** and **Instagram Reels** as MP4 video or MP3 audio, with thumbnail preview, dynamic quality selection, and download analytics.

> Made by [OM](https://instagram.com/omkedare.dev)

---

## 📁 Project Structure

```
reels-downloader/
├── backend/                     # Node.js + Express API
│   ├── models/
│   │   └── DownloadLog.js       # MongoDB schema for download logs
│   ├── routes/
│   │   ├── info.js              # POST /api/info — fetch video metadata
│   │   ├── download.js          # POST /api/download — stream file
│   │   └── analytics.js        # GET /api/analytics — stats & logs
│   ├── utils/
│   │   ├── validateUrl.js       # URL safety validator
│   │   └── ytdlp.js             # yt-dlp wrapper
│   ├── .env.example
│   ├── package.json
│   └── server.js                # App entry point
│
├── frontend/                    # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/
│   │   │   ├── DownloaderCard.jsx   # Main UI card
│   │   │   ├── VideoPreview.jsx     # Thumbnail + meta display
│   │   │   ├── SkeletonPreview.jsx  # Loading skeleton
│   │   │   └── ProgressBar.jsx      # Download progress
│   │   ├── hooks/
│   │   │   ├── useVideoInfo.js      # Info fetch hook
│   │   │   └── useDownload.js       # Download trigger hook
│   │   ├── utils/
│   │   │   └── api.js               # Axios instance
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── index.html               # SEO meta tags
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
├── package.json                 # Root scripts for running both
└── README.md
```

---

## ⚙️ Prerequisites

Make sure these are installed:

- **Node.js** v18+
- **MongoDB** (local or Atlas URI)
- **yt-dlp** — [Install guide](https://github.com/yt-dlp/yt-dlp#installation)
- **ffmpeg** — Required for merging video/audio

```bash
# Install yt-dlp (macOS/Linux)
pip install yt-dlp
# or
brew install yt-dlp

# Install ffmpeg
brew install ffmpeg          # macOS
sudo apt install ffmpeg      # Ubuntu/Debian
```

---

## 🚀 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/reels-downloader.git
cd reels-downloader
```

### 2. Install all dependencies

```bash
npm run install:all
```

Or manually:

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3. Set up environment variables

**Backend:**
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/reels-downloader
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=50
```

**Frontend:**
```bash
cp frontend/.env.example frontend/.env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

> **Note:** In development, the Vite proxy in `vite.config.js` automatically forwards `/api` requests to the backend on port 5000, so `VITE_API_URL` can be left as `/api` for local dev.

### 4. Start development servers

```bash
# Run both frontend and backend simultaneously
npm run dev
```

Or separately:
```bash
npm run dev:backend    # Starts backend on http://localhost:5000
npm run dev:frontend   # Starts frontend on http://localhost:5173
```

---

## 📡 API Reference

### `POST /api/info`
Fetch video metadata and available formats.

**Request body:**
```json
{ "url": "https://www.youtube.com/shorts/..." }
```

**Response:**
```json
{
  "success": true,
  "data": {
    "title": "Video Title",
    "thumbnail": "https://...",
    "duration": 30,
    "uploader": "Channel Name",
    "platform": "Youtube",
    "formats": [
      { "formatId": "137", "label": "1080p", "height": 1080 },
      { "formatId": "22", "label": "720p", "height": 720 }
    ]
  }
}
```

---

### `POST /api/download`
Download the video/audio file (streamed directly).

**Request body:**
```json
{
  "url": "https://www.youtube.com/shorts/...",
  "format": "mp4",
  "quality": "720p",
  "title": "My Video"
}
```

**Response:** Binary file stream with `Content-Disposition: attachment`

---

### `GET /api/analytics`
Returns aggregate download stats.

### `GET /api/analytics/admin?page=1&limit=20`
Returns paginated download logs.

### `GET /api/health`
Health check endpoint.

---

## 🏗️ Production Deployment

### Backend (e.g., Railway, Render, VPS)
```bash
cd backend
npm start
```
Set environment variables in your host's dashboard.

### Frontend (e.g., Vercel, Netlify)
```bash
cd frontend
npm run build
# Deploy the dist/ folder
```

Update `VITE_API_URL` in the frontend env to point to your production backend URL.

---

## 🔒 Security Features

- URL whitelist: only YouTube and Instagram domains allowed
- Rate limiting: 20 info requests/min, 10 downloads/min per IP
- No permanent file storage: files are streamed and deleted immediately
- CORS configured to only allow the frontend origin

---

## 📊 MongoDB Collections

### `downloadlogs`
| Field | Type | Description |
|-------|------|-------------|
| url | String | Original video URL |
| platform | String | youtube / instagram |
| format | String | mp4 / mp3 |
| quality | String | e.g. 720p |
| title | String | Video title |
| success | Boolean | Whether download succeeded |
| errorMessage | String | Error if failed |
| createdAt | Date | Auto timestamp |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Downloader | yt-dlp, ffmpeg |
| Fonts | Syne (display), DM Sans (body) |

---

*All rights reserved · Made by OM ·(https://instagram.com/omkedare.dev)*
