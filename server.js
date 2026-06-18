const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

app.use(express.json());
app.use(express.static(path.join(__dirname, './')));
app.use(cors({ origin: "*" })); 

app.use((req, res, next) => {
    res.setHeader("X-Frame-Options", "ALLOWALL");
    res.setHeader("Content-Security-Policy", "frame-ancestors *; default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob:; style-src * 'unsafe-inline'; font-src * data:;");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

const MAIN_SITE_URL = "https://betlover247.onrender.com"; 
const SPORTS_API_KEY = "ee4cc3794da394250376716b0791fe7e"; 

let bet365ActiveFeeds = [];
let sportsBetHistoryDb = [];

async function fetchFreeAndDynamicSportsDataFeed() {
    let freshFeeds = [];

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

                let dynamicOdds = {
                    fullTimeResult: { home: parseFloat(oddsHome), draw: parseFloat(oddsDraw), away: parseFloat(oddsAway) },
                    matchWinner2Way: { home: parseFloat(oddsHome), away: parseFloat(oddsAway) },
                    matchWinner3Way: { home: parseFloat(oddsHome), draw: parseFloat(oddsDraw), away: parseFloat(oddsAway) },
                    doubleChance: { homeDraw: parseFloat((1.15).toFixed(2)), awayDraw: parseFloat((1.25).toFixed(2)) }
                };

                freshFeeds.push({
                    matchId: "real_" + f.fixture.id,
                    sport: "football",
                    country: f.league.country || "International",
                    league: f.league.name || "Live Cup",
                    teamHome: f.teams.home.name,
                    teamAway: f.teams.away.name,
                    scoreHome: String(homeGoals),
                    scoreAway: String(awayGoals),
                    matchTime: f.fixture.status.elapsed ? f.fixture.status.elapsed + "'" : "LIVE",
                    matchFormat: "live",
                    odds: dynamicOdds,
                    status: "LIVE"
                });
            });
        }
    } catch (err) {
        console.log("Football Free API Key Call Over. Organic 3-Game high-speed injector running smooth.");
    }

    try {
        const leaguesPool = ["ICC Men's World Cup [ODI]", "UEFA Champions League", "Wimbledon Men Singles", "IPL T20 Power [T20]", "La Liga Live"];
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

            let baseHome = (1.50 + (Math.random() * 0.35)).toFixed(2);
            let baseAway = (1.70 + (Math.random() * 0.35)).toFixed(2);
            let baseDraw = (3.40 + (Math.random() * 0.35)).toFixed(2);

            let matchTimeStr = liveElapsed + "'";
            let scoreHomeStr = "0";
            let scoreAwayStr = "0";

            if (t.s === "cricket") {
                scoreHomeStr = (165 + Math.floor(Math.random() * 30)) + "/" + (3 + Math.floor(Math.random() * 3));
                scoreAwayStr = "Yet to Bat";
                matchTimeStr = "Overs: " + (16 + Math.floor(Math.random() * 3)) + "." + Math.floor(Math.random() * 6);
            } else if (t.s === "football") {
                scoreHomeStr = String(Math.floor(Math.random() * 3));
                scoreAwayStr = String(Math.floor(Math.random() * 2));
            } else if (t.s === "tennis") {
                scoreHomeStr = JSON.stringify({ set: 1, game: 4, point: "30" });
                scoreAwayStr = JSON.stringify({ set: 0, game: 2, point: "40" });
                matchTimeStr = "Set 2";
            }

            let dynamicOdds = {
                fullTimeResult: { home: parseFloat(baseHome), draw: parseFloat(baseDraw), away: parseFloat(baseAway) },
                matchWinner2Way: { home: parseFloat(baseHome), away: parseFloat(baseAway) },
                matchWinner3Way: { home: parseFloat(baseHome), draw: parseFloat(baseDraw), away: parseFloat(baseAway) },
                doubleChance: {
                    homeDraw: parseFloat((1.25 + (Math.random() * 0.1)).toFixed(2)),
                    awayDraw: parseFloat((1.35 + (Math.random() * 0.1)).toFixed(2))
                },
                toWinSet: { home: parseFloat(baseHome), away: parseFloat(baseAway) },
                currentSetWinner: { home: parseFloat(baseHome), away: parseFloat(baseAway) },
                nextGameWinner: { home: parseFloat(baseHome), away: parseFloat(baseAway) },
                nextOverRunsTeam1_2: { over: 1.85, under: 1.85 },
                nextOverRunOddEven: { odd: 1.90, even: 1.90 },
                nextOverTeamsWicket: { yes: 3.50, no: 1.25 },
                team1Total50OversRuns: { over: 1.83, under: 1.83 },
                runsIn1st10Overs: { over: 1.83, under: 1.83 }
            };

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
                odds: dynamicOdds,
                status: "LIVE"
            });
        }
    } catch (e) { 
        console.error("3-Game RNG Sync Delay Handled"); 
    }

    bet365ActiveFeeds = freshFeeds;
    io.emit("bet365LiveOddsUpdate", bet365ActiveFeeds);
}

setInterval(fetchFreeAndDynamicSportsDataFeed, 4000);

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
    } catch (e) { 
        return res.json({ success: false, balance: 0 }); 
    }
});

app.post('/api/jili-bet', async (req, res) => {
    const { userId, matchId, marketName, selection, odds, amount, wallet } = req.body;
    const reqAmount = parseFloat(amount);
    const targetWallet = wallet || "main";

    if (!userId || !matchId || reqAmount < 10) {
        return res.json({ success: false, message: "Invalid Bet! Minimum bet amount BDT 10" });
    }

    try {
        const balResponse = await axios.post(`${MAIN_SITE_URL}/api_callback.php`, {
            action: "bet", username: userId, amount: 0, wallet: targetWallet, game: "money-coming"
        }, { timeout: 30000 });
        
        let currentDbBalance = balResponse.data && balResponse.data.balance !== undefined ? parseFloat(balResponse.data.balance) : 0;
        if (currentDbBalance < reqAmount) {
            return res.json({ success: false, balance: currentDbBalance, message: "Insufficient Balance! Please Recharge BDT." });
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
            return res.json({ success: true, balance: response.data.balance, message: "Bet accepted! Good Luck." });
        } else {
            return res.json({ success: false, balance: currentDbBalance, message: "Bet Declined by Database!" });
        }
    } catch (e) {
        return res.json({ success: false, message: "Connection Timeout! Click PLACE BET again." });
    }
});

app.post('/api/sportsbook/cashout', async (req, res) => {
    const { userId, betTicketId, cashoutAmount, wallet } = req.body;
    const returnAmount = parseFloat(cashoutAmount);
    const targetWallet = wallet || "main";

    if (!userId || !betTicketId || returnAmount <= 0) {
        return res.json({ success: false, message: "Invalid Cashout Request!" });
    }

    try {
        let betIndex = sportsBetHistoryDb.findIndex(b => b.ticketId === betTicketId && b.userId === userId && b.status === "RUNNING");
        
        if (betIndex === -1) {
            return res.json({ success: false, message: "Ticket already settled or expired!" });
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

            console.log(`Cashout Success: User ${userId} cashed out BDT ${returnAmount} on Ticket ${betTicketId}`);
            io.emit("balanceUpdate", { username: userId, balance: response.data.balance });
            
            return res.json({ 
                success: true, 
                balance: response.data.balance, 
                message: `BDT ${returnAmount.toFixed(2)} Cashout Success! Wallet updated.` 
            });
        } else {
            return res.json({ success: false, message: "Cashout Declined by Core Database!" });
        }
    } catch (e) {
        console.error("Core Cashout Sync Error:", e.message);
        return res.json({ success: false, message: "Timeout! Try again." });
    }
});

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
});

const PORT = process.env.PORT || 5005; 
server.listen(PORT, () => {
    console.log(`VIP Bet365 Multi-Sportsbook Engine Running on port ${PORT}`);
});

        
