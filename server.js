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
app.use(cors({ origin: "*" }));

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

// 📥 মেমোরি কন্টেইনার: মাল্টি-স্পোর্টস ডাটা ফিড এবং আলাদা স্পোর্টস বেট হিস্টোরি ডাটাবেজ
let bet365ActiveFeeds = [];
let sportsBetHistoryDb = []; // 👈 ওস্তাদ! স্পোর্টসের জন্য আলাদা সম্পূর্ণ কাস্টম ডেডিকেটেড হিস্টোরি ট্র্যাকার!

// 🎰 [🔒 Bet365 মাল্টি-স্পোর্টস ও মাল্টি-মার্কেট সিমুলেশন জেনারেটর ইঞ্জিন লক 🔒]
function generateBet365MultiSportsOrganicFeeds() {
    const sportsConfig = {
        football: {
            leagues: ["English Premier League", "UEFA Champions League", "Spanish La Liga"],
            teams: [ {h: "Man City", a: "Liverpool"}, {h: "Real Madrid", a: "Barcelona"}, {h: "Chelsea", a: "Arsenal"} ],
            markets: ["Match Winner (1X2)", "Total Goals (Over/Under 2.5)", "Both Teams To Score"]
        },
        cricket: {
            leagues: ["ICC World Cup Live", "Indian Premier League", "Bangladesh Premier League"],
            teams: [ {h: "Bangladesh", a: "India"}, {h: "Australia", a: "England"}, {h: "Pakistan", a: "Sri Lanka"} ],
            markets: ["Match Winner", "First Over Runs (Over/Under 5.5)", "Team to Win the Toss"]
        },
        tennis: {
            leagues: ["Wimbledon Grand Slam", "US Open Tennis Live", "French Open"],
            teams: [ {h: "Carlos Alcaraz", a: "Novak Djokovic"}, {h: "Jannik Sinner", a: "Daniil Medvedev"} ],
            markets: ["Match Winner (To Win)", "First Set Winner", "Total Games (Over/Under 21.5)"]
        },
        basketball: {
            leagues: ["NBA Basketball Live", "EuroLeague Premium", "FIBA World Cup"],
            teams: [ {h: "LA Lakers", a: "Golden State Warriors"}, {h: "Boston Celtics", a: "Miami Heat"} ],
            markets: ["Moneyline (Winner)", "Total Points (Over/Under 210.5)", "Point Handicap (-4.5 / +4.5)"]
        }
    };

    let freshFeeds = [];
    let idCounter = 1000;

    Object.keys(sportsConfig).forEach(sportKey => {
        const config = sportsConfig[sportKey];
        
        config.teams.forEach((team, idx) => {
            idCounter++;
            let league = config.leagues[idx % config.leagues.length];
            
            // স্পোর্টস অনুযায়ী ডাইনামিক লাইভ স্কোর মেকার সিঙ্ক ভাই ভাই
            let scoreHome = Math.floor(Math.random() * 4);
            let scoreAway = Math.floor(Math.random() * 3);
            let matchTime = "Live";

            if (sportKey === "football") {
                matchTime = (20 + Math.floor(Math.random() * 65)) + "'";
            } else if (sportKey === "cricket") {
                scoreHome = (120 + Math.floor(Math.random() * 80)) + "/" + Math.floor(Math.random() * 6);
                scoreAway = (90 + Math.floor(Math.random() * 60)) + "/" + Math.floor(Math.random() * 5);
                matchTime = "Overs: " + (10 + Math.floor(Math.random() * 9)) + "." + Math.floor(Math.random() * 6);
            } else if (sportKey === "tennis") {
                scoreHome = Math.floor(Math.random() * 2);
                scoreAway = Math.floor(Math.random() * 2);
                matchTime = "Set: 3 | Points: " + (Math.floor(Math.random() * 40)) + "-" + (Math.floor(Math.random() * 40));
            } else if (sportKey === "basketball") {
                scoreHome = 80 + Math.floor(Math.random() * 35);
                scoreAway = 75 + Math.floor(Math.random() * 35);
                matchTime = "Q4 - 3.45'";
            }

            // Bet365 স্টাইলে মাল্টি-মার্কেট জেনারেশন লুপ সিঙ্ক ভাই ভাই!
            let marketsData = [];
            config.markets.forEach((marketName, mIdx) => {
                let options = [];
                if (marketName.includes("1X2") || marketName.includes("Draw")) {
                    options = [
                        { name: "Home (1)", odds: parseFloat((1.4 + Math.random() * 1.5).toFixed(2)) },
                        { name: "Draw (X)", odds: parseFloat((2.8 + Math.random() * 1.8).toFixed(2)) },
                        { name: "Away (2)", odds: parseFloat((1.6 + Math.random() * 1.6).toFixed(2)) }
                    ];
                } else if (marketName.includes("Over/Under")) {
                    options = [
                        { name: "Over", odds: parseFloat((1.7 + Math.random() * 0.5).toFixed(2)) },
                        { name: "Under", odds: parseFloat((1.6 + Math.random() * 0.6).toFixed(2)) }
                    ];
                } else if (marketName.includes("Winner") || marketName.includes("Toss")) {
                    options = [
                        { name: team.h, odds: parseFloat((1.5 + Math.random() * 1.2).toFixed(2)) },
                        { name: team.a, odds: parseFloat((1.6 + Math.random() * 1.3).toFixed(2)) }
                    ];
                } else {
                    options = [
                        { name: "Yes", odds: parseFloat((1.6 + Math.random() * 0.4).toFixed(2)) },
                        { name: "No", odds: parseFloat((1.8 + Math.random() * 0.5).toFixed(2)) }
                    ];
                }

                marketsData.push({ marketName, options });
            });

            freshFeeds.push({
                matchId: sportKey[0] + "_" + idCounter,
                sport: sportKey,
                league: league,
                teamHome: team.h,
                teamAway: team.a,
                scoreHome: scoreHome,
                scoreAway: scoreAway,
                matchTime: matchTime,
                markets: marketsData,
                status: "LIVE"
            });
        });
    });

    bet365ActiveFeeds = freshFeeds;
    io.emit("bet365LiveOddsUpdate", bet365ActiveFeeds);
}

// ওস্তাদ! প্রতি ১৫ সেকেন্ডে ব্যাকগ্রাউন্ডে আনলিমিটেড ডাইনামিক লাইভ অডস রিলোড হবেই ভাই ভাই!
setInterval(generateBet365DynamicOrganicFeeds, 15000);

// 🚀 [🔒 মেগা কিলার ফিক্স—সার্ভার বুট হওয়ার ১ মিলি-সেকেন্ডের মাথায় ওয়ান-শটে কোনো ডিলে ছাড়া সাথে সাথে ডাটা ফিড চালু করার কিংস চাবি লক 🔒]
setTimeout(() => {
    generateBet365DynamicOrganicFeeds();
}, 100);

// 💰 ১. লাইভ অ্যাকাউন্ট ব্যালেন্স নিয়ে আসার ডেডিকেটেড গেটওয়ে (রেনবো গেমের অবিকল ট্রিক ভাই ভাই!)
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

// 🛫 ২. Bet365 মাল্টি-মার্কেট বাজি ধরার এবং ৩১১ নম্বর লাইনের ওরিজিনাল পিএইচপি ওয়ালেট থেকে টাকা কাটার কোর এপিআই রাউট
app.post('/api/jili-bet', async (req, res) => {
    const { userId, matchId, sport, marketName, selection, odds, amount, wallet, matchTitle } = req.body;
    const reqAmount = parseFloat(amount);
    const targetWallet = wallet || "main";

    if (!userId || !matchId || reqAmount < 10) {
        return res.json({ success: false, message: "❌ Invalid Bet! Minimum bet amount BDT 10" });
    }

    try {
        const response = await axios.post(MAIN_SITE_URL + '/api_callback.php', { 
            action: "bet", username: userId, amount: reqAmount, wallet: targetWallet, game: "money-coming"
        }, { timeout: 30000 });

        if (response.data && response.data.status === "ok") {
            
            // 📊 [🔒 ওস্তাদ! স্পোর্টসের জন্য আলাদা হিস্টোরি ডাটাবেজে বাজি সফলভাবে লক করার মেগা কিংস চাবি 🔒]
            let betId = "STK" + Math.floor(100000 + Math.random() * 900000);
            let timestamp = new Date().toLocaleString("bn-BD", { timeZone: "Asia/Dhaka" });
            
            let newSportsBetLog = {
                betId,
                userId,
                matchTitle,
                sport: sport.toUpperCase(),
                marketName,
                selection,
                odds: parseFloat(odds).toFixed(2),
                stake: reqAmount,
                potentialPayout: Math.round(reqAmount * odds),
                time: timestamp,
                status: "RUNNING" // 👈 ডিফল্ট রানিং থাকবে, রেজাল্ট পরে সিঙ্ক হবে ভাই
            };
            
            sportsBetHistoryDb.unshift(newSportsBetLog); // নতুন বাজি হিস্টোরির একদম ওপরে পুশ ভাই ভাই!

            io.emit("balanceUpdate", { username: userId, balance: response.data.balance });
            
            return res.json({ 
                success: true, 
                balance: response.data.balance, 
                message: `🎯 Bet accepted! ID: ${betId}` 
            });
            } else {
        // ওস্তাদ! ডাটাবেজ থেকে বাজি রিজেক্ট বা ডিক্লাইন্ড হলে প্লেয়ারকে তাজা রেসপন্স পাস ভাই ভাই!
        let latestBal = (response.data && response.data.balance !== undefined) ? response.data.balance : 0;
        return res.json({ success: false, balance: latestBal, message: "❌ Bet Declined by Database!" });
    }

    } catch (e) {
        console.error("🚨 Bet365 Core Sportsbook Bet Engine Error:", e.message);
        return res.json({ success: false, message: "⚠️ Timeout! Please click place bet again." });
    }
});

// 📊 ৪. ফ্রন্টএন্ড এর জন্য আলাদা ডেডিকেটেড স্পোর্টস বেট হিস্টোরি রিডার গেটওয়ে (GET Route)
app.get('/api/sportsbook/bet-history', (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.json({ success: false, history: [] });
    
    // নির্দিষ্ট প্লেয়ারের ওরিজিনাল বাজি লগ ফিল্টারিং বর্ম লক ভাই ভাই!
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
