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


// 🔑 [🔒 ওস্তাদ! থার্ড-পার্টি অফিশিয়াল ডাটা ফিড চাবিকাঠি এবং টাইমআউট বুস্টার টাইট লক 🔒]
const SPORTS_API_KEY = "179f884145mshbf03d6d5ba4b423p17e29bjsn0fb74542d9df"; // 👈 আপনার সচল খাঁটি ১ শতভাগ ওয়ার্কিং মেগা এপিআই কিংস চাবি লক ভাই ভাই!
const FOOTBALL_API_HOST = "v3.football.api-sports.io";


// 📥 মেমোরি কন্টেইনার: থার্ড-পার্টি থেকে আসা তাজা লাইভ ম্যাচের ক্যাশ মেমোরি সিঙ্ক
let bet365ActiveFeeds = [];

// ⏱️ [অটো-মেটেড লাইভ ডাটা ফিড লুপ]: প্রতি ১৫ সেকেন্ড পর পর থার্ড-পার্টি সার্ভার থেকে লাইভ ম্যাচের স্কোর ও অডস অটো-মেটিকভাবে স্ক্র্যাপ করার কিংস ইঞ্জিন!
async function fetchThirdPartyLiveSportsDataFeed() {
    try {
        // ওস্তাদ! আন্তর্জাতিক API-Football গেটওয়েতে হিট মেরে ফ্রেশ লাইভ ডাটা আনা হচ্ছে ভাই ভাই
        const footballRes = await axios.get(`https://${FOOTBALL_API_HOST}/fixtures?live=all`, {
            headers: { 'x-rapidapi-key': SPORTS_API_KEY, 'x-rapidapi-host': FOOTBALL_API_HOST },
            timeout: 10000
        });

        let freshFeeds = [];

        if (footballRes.data && footballRes.data.response) {
            footballRes.data.response.slice(0, 15).forEach(f => { // টপ ১৫টি লাইভ ম্যাচ ফিল্টারিং
                let homeGoals = parseInt(f.goals.home) || 0;
                let awayGoals = parseInt(f.goals.away) || 0;
                
                // 🎰 [Bet365 গাণিতিক অডস অ্যালগরিদম]: গোল ডিফেন্সের ওপর ভিত্তি করে ডাইনামিক ১X২ অডস জেনারেটর ট্র্যাকার ভাই ভাই!
                let oddsHome = (1.5 + (awayGoals * 0.8) - (homeGoals * 0.3)).toFixed(2);
                let oddsAway = (1.5 + (homeGoals * 0.8) - (awayGoals * 0.3)).toFixed(2);
                let oddsDraw = (3.10 + (Math.abs(homeGoals - awayGoals) * 0.5)).toFixed(2);

                if (oddsHome < 1.05) oddsHome = 1.05;
                if (oddsAway < 1.05) oddsAway = 1.05;

                freshFeeds.push({
                    matchId: "fb_" + f.fixture.id,
                    sport: "football",
                    league: f.league.name,
                    teamHome: f.teams.home.name,
                    teamAway: f.teams.away.name,
                    scoreHome: homeGoals,
                    scoreAway: awayGoals,
                    matchTime: f.fixture.status.elapsed + "'",
                    odds: { home: parseFloat(oddsHome), draw: parseFloat(oddsDraw), away: parseFloat(oddsAway) },
                    status: "LIVE"
                });
            });
        }

        // ওস্তাদ! মেমোরি ডাটা ফ্রেশ আপডেট করে সকেটের মাধ্যমে ১ সেকেন্ডে সব ইউজারের ব্রাউজারে লাইভ ওডস ফ্ল্যাশ করা হলো!
        bet365ActiveFeeds = freshFeeds;
        io.emit("bet365LiveOddsUpdate", bet365ActiveFeeds);
        console.log(`📊 [Bet365 Feed Engine]: ${bet365ActiveFeeds.length}টি লাইভ ম্যাচ ফিড সফলভাবে সিঙ্কড অন ফায়ার!`);

    } catch (err) {
        console.error("🚨 Third-Party Data Feed Server Timeout / Error:", err.message);
    }
}

// প্রতি ১৫ সেকেন্ডে ব্যাকগ্রাউন্ডে থার্ড-পার্টি ডাটা ফিড অটো-লোড লুপ সচল ভাই!
setInterval(fetchThirdPartyLiveSportsDataFeed, 15000);

// 💰 ১. লাইভ অ্যাকাউন্ট ব্যালেন্স নিয়ে আসার ডেডিকেটেড গেটওয়ে ( can't block! আপনার রেনবো গেমের অবিকল ট্রিক ভাই ভাই!)
app.get('/api/rainbow-balance', async (req, res) => {
    const { userId, wallet } = req.query;
    const targetWallet = wallet || "main";
    try {
        // ওস্তাদ! কিলার সিক্রেট—আপনার পিএইচপি ডাটাবেজ থেকে রিয়েল-টাইমে ওয়ালেট ব্যালেন্স এক টানে তুলে নিয়ে আসার ওরিজিনাল ফর্মুলা!
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
        console.error("Sportsbook Balance Fetch Core Database Error:", e.message);
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
            // বাজি ডাটাবেজে সফলভাবে কাটার পর ক্যাসিনো লগে বাজি রেজিস্টার লক ভাই ভাই!
            console.log(`🎲 [Bet Placed Success]: User ${userId} placed BDT ${reqAmount} on Match ${matchId} (${selection}) at Odds ${odds}`);

            // সকেটের মেইন পাইপলাইনে তাজা ব্যালেন্স ব্রডকাস্ট ফায়ার ভাই ভাই
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
        console.error("Bet365 Core Payout Database Connection Error:", e.message);
        return res.json({ success: false, message: "⚠️ Connection Timeout! Try again." });
    }
});

app.get('/', (req, res) => { 
    res.sendFile(path.join(__dirname, 'index.html')); 
});

io.on('connection', (socket) => {
    socket.emit("bet365LiveOddsUpdate", bet365ActiveFeeds);
    console.log("🎮 Player attached to VIP Bet365 Live Sportsbook Stream!");
});

// 🌐 [🔒 ওস্তাদ! রেন্ডার ও টার্মাক্স সেশন অন-ফায়ার রাখতে ৫০০৫ পোর্ট কড়া কিংস বর্ম লক ফায়ার 🔒]
const PORT = process.env.PORT || 5005; 
server.listen(PORT, () => {
    console.log(`🎰 VIP Bet365 Live Sportsbook Engine Running on port 5005`);
});
