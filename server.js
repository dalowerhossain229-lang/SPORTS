const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);

// 🎯 [মেগা সকেট প্রোটোকল বর্ম - Bet365 রিয়েল-টাইম পুশ ইঞ্জিন]
const io = socketIo(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

app.use(express.json());
app.use(express.static(path.join(__dirname, './')));
app.use(cors({ origin: "*" })); 

// 🎰 [🔒 ওস্তাদ! আপনার রেনবো গেমের অবিকল লাক্সারি আইফ্রেম ক্যাসিনো সিএসপি হেডার বর্ম লক 🔒]
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

// 🔑 [🔒 সচল এপিআই চাবিকাঠি এবং টাইমআউট বুস্টার টাইট লক 🔒]
const SPORTS_API_KEY = "ee4cc3794da394250376716b0791fe7e"; 

// 📥 মেমোরি লকিং কন্টেইনারস: ৩টি খেলার অল-মার্কেট লাইভ ফিড এবং ডেডিকেটেড স্পোর্টস বেট হিস্টোরি লোকাল ডাটাবেজ ভাই ভাই!
let bet365ActiveFeeds = [];
let sportsBetHistoryDb = [];

// 🎰 [🔒 ওস্তাদ! খাতার পৃষ্ঠা ১ অনুযায়ী ৩টি খেলার (ক্রিকেট, ফুটবল, টেনিস) ৩-ওয়ে বেটিং ও অডস ফ্ল্যাকচুয়েশন মেগা ইঞ্জিন 🔒]
async function fetchFreeAndDynamicSportsDataFeed() {
    let freshFeeds = [];

    // 🛫 কিলার ট্রিক ১: থার্ড-পার্টি ফ্রি এপিআই থেকে ফুটবল ডাটা এক্সট্র্যাক্ট করার গেটওয়ে চেইন
    try {
        const response = await axios.get('https://api-sports.io', {
            headers: { 'x-rapidapi-key': SPORTS_API_KEY, 'x-rapidapi-host': 'v3.football.api-sports.io' },
            timeout: 8000
        });

        if (response.data && response.data.response && response.data.response.length > 0) {
            response.data.response.slice(0, 8).forEach(f => {
                let homeGoals = parseInt(f.goals.home) || 0;
                let awayGoals = parseInt(f.goals.away) || 0;
                
                let oddsHome = (1.45 + (awayGoals * 0.6) - (homeGoals * 0.2)).toFixed(2);
                let oddsAway = (1.65 + (homeGoals * 0.6) - (awayGoals * 0.2)).toFixed(2);
                let oddsDraw = (3.10 + (Math.abs(homeGoals - awayGoals) * 0.4)).toFixed(2);

                if (oddsHome < 1.05) oddsHome = "1.05";
                if (oddsAway < 1.05) oddsAway = "1.05";

                freshFeeds.push({
                    matchId: "real_" + f.fixture.id,
                    sport: "football",
                    country: f.league.country || "International",
                    league: f.league.name || "Live Cup",
                    teamHome: f.teams.home.name,
                    teamAway: f.teams.away.name,
                    scoreHome: homeGoals,
                    scoreAway: awayGoals,
                    matchTime: f.fixture.status.elapsed ? f.fixture.status.elapsed + "'" : "LIVE",
                    odds: {
                        matchWinner: { home: parseFloat(oddsHome), draw: parseFloat(oddsDraw), away: parseFloat(oddsAway) }
                    },
                    status: "LIVE"
                });
            });
        }
    } catch (err) {
        console.log("ℹ️ Football Free API Key Call Over. Organic 3-Game high-speed injector running smooth.");
    }

    // 🛫 কিলার ট্রিক ২: খাতার অবিকল ৩টি গেমের (ক্রিকেট, ফুটবল, টেনিস) ডাইনামিক ৩-ওয়ে ইনজেক্টর বর্ম
    try {
        const leaguesPool = ["ICC Men's World Cup", "UEFA Champions League", "Wimbledon Men Singles", "IPL T20 Power", "La Liga Live"];
        const countriesPool = ["Bangladesh", "Europe", "United Kingdom", "India", "Spain"];
        
        const teamsPool = [
            { h: "Bangladesh", a: "India", s: "cricket", f: "odi" },      
            { h: "Real Madrid", a: "Barcelona", s: "football", f: "" },       
            { h: "N. Djokovic", a: "C. Alcaraz", s: "tennis", f: "" },  
            { h: "KKR Kings", a: "MI Indians", s: "cricket", f: "t20" }, 
            { h: "Man City", a: "Arsenal", s: "football", f: "" }
        ];

        for (let i = 0; i < teamsPool.length; i++) {
            let t = teamsPool[i];
            let liveElapsed = 15 + Math.floor(Math.random() * 70);

            let baseHome = (1.50 + (Math.random() * 0.5)).toFixed(2);
            let baseAway = (1.70 + (Math.random() * 0.5)).toFixed(2);
            let baseDraw = (3.40 + (Math.random() * 0.5)).toFixed(2);

            let matchTimeStr = `${liveElapsed}'`;
            let scoreHomeStr = "0";
            let scoreAwayStr = "0";

            if (t.s === "cricket") {
                scoreHomeStr = `${165 + Math.floor(Math.random() * 30)}/${3 + Math.floor(Math.random() * 3)}`;
                scoreAwayStr = "Yet to Bat";
                matchTimeStr = `Overs: ${16 + Math.floor(Math.random() * 3)}.${Math.floor(Math.random() * 6)}`;
            } else if (t.s === "football") {
                scoreHomeStr = Math.floor(Math.random() * 3);
                scoreAwayStr = Math.floor(Math.random() * 2);
            } else if (t.s === "tennis") {
                scoreHomeStr = `Set:1 (40)`;
                scoreAwayStr = `Set:0 (15)`;
                matchTimeStr = `Set 2`;
            }

            freshFeeds.push({
                matchId: "dynamic_" + (3000 + i),
                sport: t.s,
                country: countriesPool[i],
                league: leaguesPool[i],
                matchFormat: t.f || "", 
                teamHome: t.h,
                teamAway: t.a,
                scoreHome: scoreHomeStr,
                scoreAway: scoreAwayStr,
                matchTime: matchTimeStr,
                odds: {
                    matchWinner: { home: parseFloat(baseHome), draw: t.s === "football" ? parseFloat(baseDraw) : 0, away: parseFloat(baseAway) }
                },
                status: "LIVE"
            });
        }
    } catch (e) { console.error("3-Game RNG Sync Delay Handled"); }

    bet365ActiveFeeds = freshFeeds;
    io.emit("bet365LiveOddsUpdate", bet365ActiveFeeds);
    console.log(`📊 [Bet365 3-Game Engine]: ${bet365ActiveFeeds.length}টি লাইভ ম্যাচ (ক্রিকেট/ফুটবল/টেনিস) সফলভাবে সিঙ্কড অন ফায়ার!`);
}

// ⏱️ ফ্রি কী বাঁচানোর মেগা টাইমিং—প্রতি ১৫ মিনিটে (৯০০০০০ মিলি-সেকেন্ড) এপিআই রিকল লক ভাই ভাই!
setInterval(fetchFreeAndDynamicSportsDataFeed, 900000);

// সার্ভার বুট হওয়ার সাথে সাথে কোনো ডিলে ছাড়া ওয়ান-শটে ওতো-ফায়ার লক!
setTimeout(() => {
    fetchFreeAndDynamicSportsDataFeed();
}, 100);

// 💰 ১. লাইভ অ্যাকাউন্ট ব্যালেন্স নিয়ে আসার ডেডিকেটেড গেটওয়ে
app.get('/api/rainbow-balance', async (req, res) => {
    const { userId, wallet } = req.query;
    const targetWallet = wallet || "main";
    try {
        const response = await axios.post(`${MAIN_SITE_URL}/api_callback.php`, {
            action: "bet", username: userId, amount: 0, wallet: targetWallet, game: "money-coming"
        }, { timeout: 30000 });

        if (response.data && response.data.status === "ok" && response.data.balance !== undefined) {
            return res.json({ success: true, balance: response.data.balance });
        }
        return res.json({ success: false, balance: 0 });
    } catch (e) { return res.json({ success: false, balance: 0 }); }
});

// 🛫 ২. Bet365 বাজি ধরার এবং ৩১১ নম্বর লাইনের ওরিজিনাল পিএইচপি ওয়ালেট গেটওয়ে থেকে টাকা কাটার কোর এপিআই রাউট
app.post('/api/jili-bet', async (req, res) => {
    const { userId, matchId, marketName, selection, odds, amount, wallet } = req.body;
    const reqAmount = parseFloat(amount);
    const targetWallet = wallet || "main";

    if (!userId || !matchId || reqAmount < 10) {
        return res.json({ success: false, message: "❌ Invalid Bet! Minimum bet amount BDT 10" });
    }

    try {
        const balResponse = await axios.post(`${MAIN_SITE_URL}/api_callback.php`, {
            action: "bet", username: userId, amount: 0, wallet: targetWallet, game: "money-coming"
        }, { timeout: 30000 });
        
        let currentDbBalance = balResponse.data && balResponse.data.balance !== undefined ? parseFloat(balResponse.data.balance) : 0;
        if (currentDbBalance < reqAmount) {
            return res.json({ success: false, balance: currentDbBalance, message: "❌ Insufficient Balance! Please Recharge BDT." });
        }

        const response = await axios.post(MAIN_SITE_URL + '/api_callback.php', { 
            action: "bet", username: userId, amount: reqAmount, wallet: targetWallet, game: "money-coming"
        }, { timeout: 30000 });

        if (response.data && response.data.status === "ok") {
            let matchObj = bet365ActiveFeeds.find(m => m.matchId === matchId);
            let matchTitle = matchObj ? `${matchObj.teamHome} vs ${matchObj.teamAway}` : "Live Sports Match";
            let ticketId = "TK_" + Date.now() + Math.floor(Math.random() * 100);
            
            let timestamp = new Date().toLocaleTimeString();
            sportsBetHistoryDb.unshift({
                ticketId: ticketId,
                userId: userId, matchId: matchId, matchTitle: matchTitle,
                marketName: marketName || "Match Winner", selection: selection,
                odds: parseFloat(odds) || 1.85, stake: reqAmount,
                potentialPayout: reqAmount * (parseFloat(odds) || 1.85), time: timestamp, status: "RUNNING"
            });

                        io.emit("balanceUpdate", { username: userId, balance: response.data.balance });
            return res.json({ success: true, balance: response.data.balance, message: "🎯 Bet accepted! Good Luck." });
        } else {
            return res.json({ success: false, balance: currentDbBalance, message: "❌ Bet Declined by Database!" });
        }
    } catch (e) {
        return res.json({ success: false, message: "⚠️ Connection Timeout! Click PLACE BET again." });
    }
});

// 💰 ৩. Bet365 অবিকল লাইভ ক্যাশআউট (Cash Out) এবং ৩১১ নম্বর পিএইচপি ওয়ালেটে টাকা রিফান্ড ব্যাক করার কোর এপিআই রাউট
app.post('/api/sportsbook/cashout', async (req, res) => {
    const { userId, betTicketId, cashoutAmount, wallet } = req.body;
    const returnAmount = parseFloat(cashoutAmount);
    const targetWallet = wallet || "main";

    if (!userId || !betTicketId || returnAmount <= 0) {
        return res.json({ success: false, message: "❌ Invalid Cashout Request!" });
    }

    try {
        let betIndex = sportsBetHistoryDb.findIndex(b => b.ticketId === betTicketId && b.userId === userId && b.status === "RUNNING");
        
        if (betIndex === -1) {
            return res.json({ success: false, message: "❌ Ticket already settled or expired!" });
        }

        const response = await axios.post(MAIN_SITE_URL + '/api_callback.php', { 
            action: "settle", 
            username: userId, 
            amount: returnAmount, 
            wallet: targetWallet,
            game: "money-coming"
        }, { timeout: 30000 });

        if (response.data && response.data.status === "ok") {
            sportsBetHistoryDb[betIndex].status = "CASHOUT";
            sportsBetHistoryDb[betIndex].potentialPayout = returnAmount;

            console.log(`💰 [Cashout Success]: User ${userId} cashed out BDT ${returnAmount} on Ticket ${betTicketId}`);
            io.emit("balanceUpdate", { username: userId, balance: response.data.balance });
            
            return res.json({ 
                success: true, 
                balance: response.data.balance, 
                message: `✅ BDT ${returnAmount.toFixed(2)} Cashout Success! Wallet updated.` 
            });
        } else {
            return res.json({ success: false, message: "❌ Cashout Declined by Core Database!" });
        }
    } catch (e) {
        console.error("Core Cashout Sync Error:", e.message);
        return res.json({ success: false, message: "⚠️ Timeout! Try again." });
    }
});

// 📊 ৪. স্পোর্টস বেট হিস্টোরি রিডার গেটওয়ে
app.get('/api/sportsbook/bet-history', (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.json({ success: false, history: [] });
    let userHistory = sportsBetHistoryDb.filter(b => b.userId === userId);
    return res.json({ success: true, history: userHistory });
});

app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'index.html')); });

io.on('connection', (socket) => {
    socket.emit("bet365LiveOddsUpdate", bet365ActiveFeeds);
});

// 🌐 [🔒 রেন্ডার ও টার্মাক্স সেশন অন-ফায়ার রাখতে ৫০০৫ পোর্ট কড়া কিংস বর্ম লক ফায়ার 🔒]
const PORT = process.env.PORT || 5005; 
server.listen(PORT, () => {
    console.log(`🎰 VIP Bet365 Multi-Sportsbook Engine Running on port 5005`);
});

