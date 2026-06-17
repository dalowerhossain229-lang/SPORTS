const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);

// 🎯 [মেগা সকেট প্রোটোকল বর্ম - Bet365 সিঙ্ক]
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
const SPORTS_API_KEY = "179f884145mshbf03d6d5ba4b423p17e29bjsn0fb74542d9df"; 

// 📥 মেমোরি লকিং কন্টেইনারস: ৫টি খেলার অল-মার্কেট লাইভ ফিড এবং ডেডিকেটেড স্পোর্টস বেট হিস্টোরি লোকাল ডাটাবেজ ভাই ভাই!
let bet365ActiveFeeds = [];
let sportsBetHistoryDb = [];

// 🎰 [🔒 ওস্তাদ! খাতার ৪টি পাতার নকশা অনুযায়ী সম্পূর্ণ ডাইনামিক লাইভ ওডস জেনারেটর কিংস ইঞ্জিন 🔒]
async function fetchFreeAndDynamicSportsDataFeed() {
    let freshFeeds = [];

    // 🛫 কিলার ট্রিক ১: থার্ড-পার্টি ফ্রি এপিআই থেকে ফুটবল ডাটা এক্সট্র্যাক্ট করার গেটওয়ে চেইন
    try {
        const response = await axios.get('https://api-sports.io', {
            headers: { 'x-rapidapi-key': SPORTS_API_KEY, 'x-rapidapi-host': 'v3.football.api-sports.io' },
            timeout: 8000
        });

        if (response.data && response.data.response && response.data.response.length > 0) {
            response.data.response.slice(0, 10).forEach(f => {
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
                        fullTimeResult: { home: parseFloat(oddsHome), draw: parseFloat(oddsDraw), away: parseFloat(oddsAway) },
                        doubleChance: { homeDraw: parseFloat((oddsHome * 0.75).toFixed(2)), awayDraw: parseFloat((oddsAway * 0.75).toFixed(2)) },
                        matchGoal: { line1_5: { over: 1.90, under: 1.90 } },
                        matchCorners: {
                            line6: { over: 1.65, exactly: 6.50, under: 2.20 },
                            line7: { over: 1.85, exactly: 7.00, under: 1.95 },
                            line8: { over: 2.10, exactly: 7.50, under: 1.72 },
                            line9: { over: 2.45, exactly: 8.00, under: 1.50 }
                        },
                        numberOfCards: { over1_5: 1.80, under1_5: 1.95 }
                    },
                    status: "LIVE"
                });
            });
        }
    } catch (err) {
        console.log("ℹ️ Football API Free Limit Restrained. Organic high-speed injector running smooth.");
    }

    // 🛫 কিলার ট্রিক ২: খাতার অবিকল ডাইনামিক ৫-স্তর ক্রিকেট ও ফুটবলের অল-মার্কেট ইনজেক্টর বর্ম
    try {
        const leaguesPool = ["ICC World Cup Live", "UEFA Champions League", "Wimbledon Men Singles", "NBA Basketball Pro", "FIVB Volleyball", "IPL T20 Power"];
        const countriesPool = ["Bangladesh", "Europe", "United Kingdom", "United States", "Japan", "India"];
        
        const teamsPool = [
            { h: "Bangladesh", a: "India", s: "cricket", f: "odi" },
            { h: "Real Madrid", a: "Barcelona", s: "football", f: "" },
            { h: "N. Djokovic", a: "C. Alcaraz", s: "tennis", f: "" },
            { h: "LA Lakers", a: "GS Warriors", s: "basketball", f: "" },
            { h: "Japan Live", a: "Brazil Volley", s: "volleyball", f: "" },
            { h: "KKR Kings", a: "MI Indians", s: "cricket", f: "t20" }
        ];

        for (let i = 0; i < teamsPool.length; i++) {
            let t = teamsPool[i];
            let homeScore = Math.floor(Math.random() * 4);
            let awayScore = Math.floor(Math.random() * 3);
            let liveElapsed = 15 + Math.floor(Math.random() * 70);

            let baseHome = (1.50 + (awayScore * 0.4) - (homeScore * 0.2)).toFixed(2);
            let baseAway = (1.70 + (homeScore * 0.4) - (awayScore * 0.2)).toFixed(2);
            let baseDraw = (3.25 + (Math.abs(homeScore - awayScore) * 0.4)).toFixed(2);

            if (baseHome < 1.05) baseHome = "1.05";
            if (baseAway < 1.05) baseAway = "1.05";

            let matchTimeStr = `${liveElapsed}'`;
            let oddsStructure = {};

            if (t.s === "cricket") {
                homeScore = 245 + Math.floor(Math.random() * 40);
                awayScore = 3 + Math.floor(Math.random() * 4);
                matchTimeStr = `Overs: ${35 + Math.floor(Math.random() * 4)}.${Math.floor(Math.random() * 6)}`;
                oddsStructure = {
                    matchWinner2Way: { home: parseFloat(baseHome), away: parseFloat(baseAway) },
                    nextOverRuns: { over9_5: 1.85, under9_5: 1.85 },
                    nextOverOddEven: { odd: 1.90, even: 1.90 },
                    nextOverWicket: { yes: 3.50, no: 1.25 },
                    team1_50OversRuns: { line321_5: { over: 1.83, under: 1.83 } },
                    runsIn1st10Overs: { line30: { over: 1.83, under: 1.83 } }
                };
            } else if (t.s === "football") {
                oddsStructure = {
                    fullTimeResult: { home: parseFloat(baseHome), draw: parseFloat(baseDraw), away: parseFloat(baseAway) },
                    doubleChance: { homeDraw: parseFloat((baseHome * 0.75).toFixed(2)), awayDraw: parseFloat((baseAway * 0.75).toFixed(2)) },
                    matchGoal: { line1_5: { over: 1.90, under: 1.90 } },
                    matchCorners: {
                        line6: { over: 1.65, exactly: 6.50, under: 2.20 },
                        line7: { over: 1.85, exactly: 7.00, under: 1.95 },
                        line8: { over: 2.10, exactly: 7.50, under: 1.72 },
                        line9: { over: 2.45, exactly: 8.00, under: 1.50 }
                    },
                    numberOfCards: { over1_5: 1.80, under1_5: 1.95 }
                };
            } else {
                oddsStructure = {
                    fullTimeResult: { home: parseFloat(baseHome), draw: parseFloat(baseDraw), away: parseFloat(baseAway) },
                    matchWinner2Way: { home: parseFloat(baseHome), away: parseFloat(baseAway) }
                };
            }

            freshFeeds.push({
                matchId: "dynamic_" + (3000 + i),
                sport: t.s,
                country: countriesPool[i],
                league: leaguesPool[i],
                matchFormat: t.f || "", 
                teamHome: t.h,
                teamAway: t.a,
                scoreHome: homeScore,
                scoreAway: awayScore,
                matchTime: matchTimeStr,
                odds: oddsStructure,
                status: "LIVE"
            });
        }
    } catch (e) { console.error("RNG Sync Error Handled"); }

    bet365ActiveFeeds = freshFeeds;
    io.emit("bet365LiveOddsUpdate", bet365ActiveFeeds);
    console.log(`📊 [Bet365 Master-Engine]: ${bet365ActiveFeeds.length}টি লাইভ ম্যাচ ও অল-মার্কেট সিঙ্কড অন ফায়ার!`);
}

// ⏱️ ফ্রি কী বাঁচানোর মেগা টাইমিং—প্রতি ১৫ মিনিটে (৯০০০০০ মিলি-সেকেন্ড) এপিআই রিকল লক ভাই ভাই!
setInterval(fetchFreeAndDynamicSportsDataFeed, 900000);

// সার্ভার বুট হওয়ার সাথে সাথে কোনো ডিলে ছাড়া ওয়ান-শটে ওতো-ফায়ার লক!
setTimeout(() => {
    fetchFreeAndDynamicSportsDataFeed();
}, 100);

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
            let matchTitle = matchObj ? `${matchObj.teamHome} vs ${matchObj.teamAway}` : "Live Multi-Sports Match";
            
            let timestamp = new Date().toLocaleTimeString();
            sportsBetHistoryDb.unshift({
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

const PORT = process.env.PORT || 5005; 
server.listen(PORT, () => {
    console.log(`🎰 VIP Bet365 Multi-Sportsbook Engine Running on port 5005`);
});

