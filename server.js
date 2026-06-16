const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);

// 🎯 [উইনগো কালার ট্রেড সিঙ্ক - মেগা সকেট প্রোটোকল লক]
const io = socketIo(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

app.use(express.json());
app.use(express.static(path.join(__dirname, './')));
app.use(cors({ origin: "*" })); // গ্লোবাল সিআরএস ব্লকিং ট্র্যাপ ওয়ান-শটে ভ্যানিশ ভাই!

// 🎰 [🔒 ওস্তাদ! আপনার রেনবো মেগাওয়েজ গেমের অবিকল লাক্সারি আইফ্রেম ক্যাসিনো সিএসপি হেডার বর্ম লক 🔒]
app.use((req, res, next) => {
    res.setHeader("X-Frame-Options", "ALLOWALL");
    res.setHeader("Content-Security-Policy", "frame-ancestors *; default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob:; style-src * 'unsafe-inline'; font-src * data:;");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

// 🎰 [উইনগো কালার ট্রেড ওরিজিনাল ডোমেইন সিঙ্ক]
const MAIN_SITE_URL = "https://betlover247.onrender.com"; 

// 📥 মেমোরি লকিং কন্টেইনারস: লাইভ ম্যাচ ফিড এবং ডেডিকেটেড স্পোর্টস বেট হিস্টোরি লোকাল ডাটাবেজ ভাই ভাই!
let bet365ActiveFeeds = [];
let sportsBetHistoryDb = [];

// 🎰 [🔒 ওস্তাদ! ২৪ ঘণ্টা আনলিমিটেড ৫-স্তর মাল্টি-স্পোর্টস ডাইনামিক লাইভ ম্যাচ ও অডস জেনারেটর কিংস ইঞ্জিন 🔒]
function generateBet365DynamicOrganicFeeds() {
    try {
        const leaguesPool = [
            "UEFA Champions League", "English Premier League", "Spanish La Liga", 
            "ICC World Cup Live", "Wimbledon Men Singles", "NBA Live Championship"
        ];
        
        const teamsPool = [
            { h: "Real Madrid", a: "Barcelona", s: "football" },
            { h: "Man City", a: "Liverpool", s: "football" },
            { h: "Arsenal", a: "Chelsea", s: "football" },
            { h: "Bangladesh", a: "India", s: "cricket" },
            { h: "N. Djokovic", a: "C. Alcaraz", s: "tennis" },
            { h: "LA Lakers", a: "GS Warriors", s: "basketball" }
        ];

        let freshFeeds = [];

        for (let i = 0; i < teamsPool.length; i++) {
            let league = leaguesPool[i];
            let teams = teamsPool[i];
            
            // র্যান্ডম লাইভ স্কোর জেনারেটর মেকানিজম ভাই ভাই
            let homeGoals = Math.floor(Math.random() * 4);
            let awayGoals = Math.floor(Math.random() * 3);
            let liveElapsed = 15 + Math.floor(Math.random() * 70);

            // 🎰 [Bet365 গাণিতিক অডস অ্যালগরিদম]: দলের শক্তির ওপর ভিত্তি করে ডাইনামিক ১X২ ও হ্যান্ডিক্যাপ অডস জেনারেটর!
            let oddsHome = (1.45 + (awayGoals * 0.6) - (homeGoals * 0.2)).toFixed(2);
            let oddsAway = (1.65 + (homeGoals * 0.6) - (awayGoals * 0.2)).toFixed(2);
            let oddsDraw = (3.10 + (Math.abs(homeGoals - awayGoals) * 0.4)).toFixed(2);

            if (oddsHome < 1.05) oddsHome = "1.05";
            if (oddsAway < 1.05) oddsAway = "1.05";

            // স্পোর্টস টাইপ অনুযায়ী ডাইনামিক টাইম-টেবিল স্ট্রিং সিঙ্ক ভাই ভাই!
            let matchTimeStr = `${liveElapsed}'`;
            if (teams.s === "cricket") matchTimeStr = `Overs: ${homeGoals + 10}.${awayGoals + 1}`;
            if (teams.s === "tennis") matchTimeStr = `Set: ${homeGoals > awayGoals ? '2' : '1'}-${homeGoals > awayGoals ? '1' : '2'}`;
            if (teams.s === "basketball") matchTimeStr = `Qtr: 3rd (${liveElapsed - 30}s)`;

            freshFeeds.push({
                matchId: "live_" + (1000 + i),
                sport: teams.s,
                league: league,
                teamHome: teams.h,
                teamAway: teams.a,
                scoreHome: teams.s === "tennis" ? homeGoals : homeGoals,
                scoreAway: teams.s === "tennis" ? awayGoals : awayGoals,
                matchTime: matchTimeStr,
                odds: { home: parseFloat(oddsHome), draw: parseFloat(oddsDraw), away: parseFloat(oddsAway) },
                status: "LIVE"
            });
        }

        bet365ActiveFeeds = freshFeeds;
        io.emit("bet365LiveOddsUpdate", bet365ActiveFeeds);
        console.log(`📊 [Bet365 Feed Engine]: ${bet365ActiveFeeds.length}টি লাইভ ম্যাচ ফিড সফলভাবে সিঙ্কড অন ফায়ার!`);
    } catch (e) {
        console.error("RNG Feed Generation Inner Error:", e.message);
    }
}

// ওস্তাদ! প্রতি ১৫ সেকেন্ড পর পর ব্যাকগ্রাউন্ডে আনলিমিটেড মাল্টি-স্পোর্টস লাইভ অডস রিলোড হবেই ভাই ভাই!
setInterval(generateBet365DynamicOrganicFeeds, 15000);

// 🚀 [🔒 জিরো-ডিলে ফায়ারিং বুস্টার চাবি - সার্ভার বুট হওয়ার সাথে সাথে ওয়ান-শটে ডাটা ফিড সচল লক 🔒]
setTimeout(() => {
    generateBet365DynamicOrganicFeeds();
}, 200);

// 💰 ১. লাইভ অ্যাকাউন্ট ব্যালেন্স নিয়ে আসার ডেডিকেটেড গেটওয়ে (আপনার রেনবো গেমের অবিকল ট্রিক ভাই ভাই!)
app.get('/api/rainbow-balance', async (req, res) => {
    const { userId, wallet } = req.query;
    const targetWallet = wallet || "main";
    try {
        const response = await axios.post(`${MAIN_SITE_URL}/api_callback.php`, {
            action: "bet",
            username: userId,
            amount: 0,
            wallet: targetWallet,
            game: "money-coming"
        }, { timeout: 30000 });

        if (response.data && response.data.status === "ok" && response.data.balance !== undefined) {
            return res.json({ success: true, balance: response.data.balance });
        }
        return res.json({ success: false, balance: 0 });
    } catch (e) { 
        return res.json({ success: false, balance: 0 }); 
    }
});

// 🛫 ২. Bet365 স্টাইলে বাজি ধরার এবং ৩১১ নম্বর লাইনের ওরিজিনাল পিএইচপি ওয়ালেট গেটওয়ে থেকে টাকা কাটার কোর এপিআই রাউট (POST Route)
app.post('/api/jili-bet', async (req, res) => {
    const { userId, matchId, marketName, selection, odds, amount, wallet } = req.body;
    const reqAmount = parseFloat(amount);
    const targetWallet = wallet || "main";

    if (!userId || !matchId || reqAmount < 10) {
        return res.json({ success: false, message: "❌ Invalid Bet! Minimum bet amount BDT 10" });
    }

    try {
        // 🔒 [ব্যালেন্স যাচাই]: বাজি ধরার আগে প্লেয়ারের একাউন্টের রিয়েল টাকা নিশ্চিত করা ভাই ভাই
        const balResponse = await axios.post(`${MAIN_SITE_URL}/api_callback.php`, {
            action: "bet",
            username: userId,
            amount: 0,
            wallet: targetWallet,
            game: "money-coming"
        }, { timeout: 30000 });
        
        let currentDbBalance = 0;
        if (balResponse.data && balResponse.data.status === "ok" && balResponse.data.balance !== undefined) {
            currentDbBalance = parseFloat(balResponse.data.balance);
        } else {
            return res.json({ success: false, balance: 0, message: "❌ Database Sync Error! Try again." });
        }

        if (currentDbBalance < reqAmount) {
            return res.json({ success: false, balance: currentDbBalance, message: "❌ Insufficient Balance! Please Recharge BDT." });
        }

        // 🎯 [উইঙ্গো ৩১১ নম্বর লাইনের ফর্মুলা]: সরাসরি আপনার পিএইচপি গেটওয়েতে হিট করে ওয়ালেট থেকে বাজি ধরা টাকা কাটা হচ্ছে ভাই ভাই
        const response = await axios.post(MAIN_SITE_URL + '/api_callback.php', { 
            action: "bet", 
            username: userId, 
            amount: reqAmount, 
            wallet: targetWallet,
            game: "money-coming" // 👈 আপনার রেন্ডার হোস্ٹنگ সার্ভারের জেনুইন অফিশিয়াল নাম লক ওস্তাদ!
        }, { timeout: 30000 });

        if (response.data && response.data.status === "ok") {
            
            // মেইন মেমোরি লগে ম্যাচ টাইটেল খুঁজে বের করার অ্যালগরিদম সিঙ্ক
            let matchObj = bet365ActiveFeeds.find(m => m.matchId === matchId);
            let matchTitle = matchObj ? `${matchObj.teamHome} vs ${matchObj.teamAway}` : "Live Sports Match";
            
            // 📊 [🔒 আলাদা ডেডিকেটেড স্পোর্টস হিস্টোরি ডাটাবেজ পুশ বর্ম লক 🔒]
            let timestamp = new Date().toLocaleTimeString();
            sportsBetHistoryDb.unshift({
                userId: userId,
                matchId: matchId,
                matchTitle: matchTitle,
                marketName: marketName || "Full Time Result",
                selection: selection,
                odds: parseFloat(odds) || 1.85,
                stake: reqAmount,
                potentialPayout: reqAmount * (parseFloat(odds) || 1.85),
                time: timestamp,
                status: "RUNNING"
            });

            console.log(`🎲 [Sports Placed]: User ${userId} | Stake BDT ${reqAmount} on ${selection}`);
            io.emit("balanceUpdate", { username: userId, balance: response.data.balance });
            
            return res.json({ 
                success: true, 
                balance: response.data.balance, 
                message: "🎯 Bet accepted! Good Luck." 
            });
        } else {
            return res.json({ success: false, balance: currentDbBalance, message: response.data.message || "❌ Bet Declined by Database!" });
        }
    } catch (e) {
        console.error("Sports Payout Core Error:", e.message);
        return res.json({ success: false, message: "⚠️ Connection Timeout! Click PLACE BET again." });
    }
});

// 📊 ৩. ফ্রন্টএন্ড এর জন্য আলাদা ডেডিকেটেড স্পোর্টস বেট হিস্টোরি রিডার গেটওয়ে (GET Route)
app.get('/api/sportsbook/bet-history', (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.json({ success: false, history: [] });
    
    let userHistory = sportsBetHistoryDb.filter(b => b.userId === userId);
    return res.json({ success: true, history: userHistory });
});

app.get('/', (req, res) => { 
    res.sendFile(path.join(__dirname, 'index.html')); 
});

io.on('connection', (socket) => {
    socket.emit("bet365LiveOddsUpdate", bet365ActiveFeeds);
    console.log("🎮 Player attached to VIP Bet365 Multi-Sportsbook Engine!");
});

// 🌐 [🔒 রেন্ডার ও টার্মাক্স সেশন অন-ফায়ার রাখতে ৫০০৫ পোর্ট কড়া কিংস বর্ম লক ফায়ার 🔒]
const PORT = process.env.PORT || 5005; 
server.listen(PORT, () => {
    console.log(`🎰 VIP Bet365 Multi-Sportsbook Engine Running on port 5005`);
});
