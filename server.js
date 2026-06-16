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

// 📥 মেমোরি কন্টেইনার: কাস্টম আনলিমিটেড লাইভ ওডস মেমোরি সিঙ্ক
let bet365ActiveFeeds = [];

// 🎰 [🔒 ওস্তাদ! থার্ড-পার্টির খতরনাক ৪MD এরর জ্যাম চিরতরে উপড়ে ফেলে ২৪ ঘণ্টা আনলিমিটেড লাইভ ম্যাচ চালু রাখার কিংস ইঞ্জিন 🔒]
// এর ফলে থার্ড-পার্টির লিমিট শেষ হলেও কোনো বাটন জ্যাম ছাড়া র্যান্ডম ইন্টারন্যাশন্যাল ওডস বোর্ডে বন্যা বইবে ওস্তাদ!
function generateBet365DynamicOrganicFeeds() {
    const leaguesPool = ["UEFA Champions League", "English Premier League", "Spanish La Liga", "Italian Serie A", "German Bundesliga", "ICC World Cup Live"];
    const teamsPool = [
        { h: "Real Madrid", a: "Barcelona" },
        { h: "Man City", a: "Liverpool" },
        { h: "Arsenal", a: "Chelsea" },
        { h: "Bayern Munich", a: "Dortmund" },
        { h: "Juventus", a: "AC Milan" },
        { h: "Bangladesh", a: "India" }
    ];

    let freshFeeds = [];

    for (let i = 0; i < 6; i++) {
        let league = leaguesPool[i % leaguesPool.length];
        let teams = teamsPool[i % teamsPool.length];
        
        // র্যান্ডম লাইভ গোল জেনারেটর মেকানিজম ভাই ভাই
        let homeGoals = Math.floor(Math.random() * 4);
        let awayGoals = Math.floor(Math.random() * 3);
        let liveElapsed = 15 + Math.floor(Math.random() * 70);

        // 🎰 [Bet365 গাণিতিক অডস অ্যালগরিদম]: গোল ডিফেন্সের ওপর ভিত্তি করে ডাইনামিক ১X২ অডস জেনারেটর ট্র্যাকার ভাই ভাই!
        let oddsHome = (1.4 + (awayGoals * 0.7) - (homeGoals * 0.2)).toFixed(2);
        let oddsAway = (1.6 + (homeGoals * 0.7) - (awayGoals * 0.2)).toFixed(2);
        let oddsDraw = (2.90 + (Math.abs(homeGoals - awayGoals) * 0.4)).toFixed(2);

        if (oddsHome < 1.05) oddsHome = 1.05;
        if (oddsAway < 1.05) oddsAway = 1.05;

        freshFeeds.push({
            matchId: "live_" + (1000 + i),
            sport: teams.h === "Bangladesh" ? "cricket" : "football",
            league: league,
            teamHome: teams.h,
            teamAway: teams.a,
            scoreHome: homeGoals,
            scoreAway: awayGoals,
            matchTime: teams.h === "Bangladesh" ? `Overs: ${homeGoals}.${awayGoals}` : `${liveElapsed}'`,
            odds: { home: parseFloat(oddsHome), draw: parseFloat(oddsDraw), away: parseFloat(oddsAway) },
            status: "LIVE"
        });
    }

    bet365ActiveFeeds = freshFeeds;
    io.emit("bet365LiveOddsUpdate", bet365ActiveFeeds);
    console.log(`📊 [Bet365 Feed Engine]: ${bet365ActiveFeeds.length}টি লাইভ ম্যাচ ফিড সফলভাবে সিঙ্কড অন ফায়ার!`);
}

// ওস্তাদ! প্রতি ১৫ সেকেন্ড পর পর ব্যাকগ্রাউন্ডে আনলিমিটেড ডাইনামিক লাইভ অডস রিলোড হবেই ভাই ভাই!
setInterval(generateBet365DynamicOrganicFeeds, 15000);
setTimeout(generateBet365DynamicOrganicFeeds, 1000); // সার্ভার বুট হওয়ার ১ সেকেন্ডের মাথায় ফায়ার লক!

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
    const { userId, matchId, selection, odds, amount, wallet } = req.body;
    const reqAmount = parseFloat(amount);
    const targetWallet = wallet || "main";

    if (!userId || !matchId || reqAmount < 10) {
        return res.json({ success: false, message: "❌ Invalid Bet! Minimum bet amount BDT 10" });
    }

    try {
        // 🎯 [উইঙ্গো ৩১১ নম্বর লাইনের ফর্মুলা]: সরাসরি আপনার পিএইচপি গেটওয়েতে হিট করে ওয়ালেট থেকে বাজি ধরা টাকা কাটা হচ্ছে ভাই ভাই
        const response = await axios.post(MAIN_SITE_URL + '/api_callback.php', { 
            action: "bet", 
            username: userId, 
            amount: reqAmount, 
            wallet: targetWallet,
            game: "money-coming" // 👈 আপনার রেন্ডার হোস্টিং সার্ভারের জেনুইন অফিশিয়াল নাম লক ওস্তাদ!
        }, { timeout: 30000 });

        if (response.data && response.data.status === "ok") {
            console.log(`🎲 [Bet Placed Success]: User ${userId} placed BDT ${reqAmount} on Match ${matchId} (${selection})`);
            io.emit("balanceUpdate", { username: userId, balance: response.data.balance });
            
            return res.json({ 
                success: true, 
                balance: response.data.balance, 
                message: "🎯 Bet accepted! Good Luck." 
            });
        } else {
            return res.json({ success: false, message: response.data.message || "❌ Bet Declined by Database!" });
        }
    } catch (e) {
        return res.json({ success: false, message: "⚠️ Connection Timeout! Try again." });
    }
});

app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'index.html')); });

io.on('connection', (socket) => {
    socket.emit("bet365LiveOddsUpdate", bet365ActiveFeeds);
    console.log("🎮 Player attached to VIP Bet365 Live Sportsbook Stream!");
});

// 🌐 [🔒 রেন্ডার ও টার্মাক্স সেশন অন-ফায়ার রাখতে ৫০০৫ পোর্ট কড়া কিংস বর্ম লক ফায়ার 🔒]
const PORT = process.env.PORT || 5005; 
server.listen(PORT, () => {
    console.log(`🎰 VIP Bet365 Live Sportsbook Engine Running on port 5005`);
});
