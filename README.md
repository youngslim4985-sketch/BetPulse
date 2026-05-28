
# BetPulse ⚡

**The Pulse of the Sharp Market**

Real-time Momentum Edge Scores, live scores, line movement intelligence, and sharp money insights for **NFL, NBA, MLB, NCAA & Soccer**.

---

## 🎯 Overview

BetPulse is an advanced sports betting intelligence platform that combines real-time data, momentum analysis, and AI-powered insights to help bettors identify high-edge opportunities across major sports leagues.

It delivers **Momentum Edge Scores**, sharp money tracking, line movement analysis, and contextual performance metrics — giving users a data-driven edge in the betting market.

---

## ✨ Key Features

- **Real-time Momentum Edge Scoring** — Quantifies team/player momentum and betting value
- **Sharp Money Intelligence** — Tracks where professional money is moving
- **Live Scores & Line Movement** — Monitors odds changes across sportsbooks
- **AI-Powered Insights** — Powered by Gemini for natural language analysis and reasoning
- **Multi-Sport Support** — NFL, NBA, MLB, NCAA Football/Basketball, and Soccer
- **Player Props Edge Analysis** — Identifies value in player performance markets
- **Modern React + TypeScript UI** — Clean, responsive interface

---

## 🛠 Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + TypeScript
- **AI**: Google Gemini
- **Styling**: CSS (with modern design)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/youngslim4985-sketch/BetPulse.git
   cd BetPulse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Add your Gemini API key in `.env.local`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
BetPulse/
├── src/                    # React frontend
│   ├── components/         # Reusable UI components
│   ├── App.tsx
│   └── types.ts
├── services/               # Core business logic
│   ├── momentumEdgeScore.ts
│   ├── sharpMoney.ts
│   ├── edgeFactor.ts
│   ├── geminiService.ts
│   ├── insightEngine.ts
│   └── ...
├── scripts/                # Utility scripts
├── public/                 # Static assets
├── index.html
├── server.ts               # Backend server (if applicable)
├── vite.config.ts
└── package.json
```

---

## 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## 📊 How It Works

BetPulse ingests live sports data and applies multiple edge factors:
- Recent performance & momentum
- Market line movement
- Sharp vs. public betting splits
- Situational analysis (rest, travel, motivation, etc.)
- AI contextual reasoning

These factors are combined into a **Momentum Edge Score** that highlights the strongest betting opportunities in real time.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## 📄 License

This project is for educational and personal use. See `LICENSE` for details (if added).

---

## ⚠️ Disclaimer

This tool is for informational and entertainment purposes only. Betting involves risk. Always gamble responsibly.

---

**Made with ❤️ for sharp bettors**

