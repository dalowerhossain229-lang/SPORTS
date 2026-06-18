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
const SPORTS_API_KEY = "49ff265bf6b12a875a6c0bbfd87dfdce"; 

let bet365ActiveFeeds = [];
let sportsBetHistoryDb = [];

async function fetchFreeAndDynamicSportsDataFeed() {
    let freshFeeds = [];

    try {
        const response = await axios.get('https://api-sports.io', {
            headers: { 
                'x-rapidapi-key': SPORTS_API_KEY, 
                'x-rapidapi-host': 'v3.football.api-sports.io' 
            },
            timeout: 10000
        });

        if (response.data && response.data.response && response.data.response.length > 0) {
            response.data.response.slice(0, 10).forEach(f => {
                let goalsObj = f.goals || { home: 0, away: 0 };
                let homeGoals = goalsObj.home !== null ? parseInt(goalsObj.home) : 0;
                let awayGoals = goalsObj.away !== null ? parseInt(goalsObj.away) : 0;
                
                let oddsHome = (1.45 + (awayGoals * 0.5) - (homeGoals * 0.2)).toFixed(2);
                let oddsAway = (1.65 + (homeGoals * 0.5) - (awayGoals * 0.2)).toFixed(2);
                let oddsDraw = (3.20 + (Math.abs(homeGoals - awayGoals) * 0.4)).toFixed(2);

                if (parseFloat(oddsHome) < 1.05) oddsHome = "1.05";
                if (parseFloat(oddsAway) < 1.05) oddsAway = "1.05";

                freshFeeds.push({
                    matchId: "foot_api_" + f.fixture.id,
                    sport: "football",
                    country: f.league.country || "International",
                    league: f.league.name || "Live Match",
                    teamHome: f.teams.home.name,
                    teamAway: f.teams.away.name,
                    scoreHome: String(homeGoals),
                    scoreAway: String(awayGoals),
                    matchTime: f.fixture.status.elapsed ? f.fixture.status.elapsed + "'" : "LIVE",
                    matchFormat: "live",
                    odds: {
                        fullTimeResult: { home: parseFloat(oddsHome), draw: parseFloat(oddsDraw), away: parseFloat(oddsAway) },
                        matchWinner2Way: { home: parseFloat(oddsHome), away: parseFloat(oddsAway) },
                        matchWinner3Way: { home: parseFloat(oddsHome), draw: parseFloat(oddsDraw), away: parseFloat(oddsAway) },
                        doubleChance: { homeDraw: 1.18, awayDraw: 1.28 },
                        toWinSet: { home: parseFloat(oddsHome), away: parseFloat(oddsAway) },
                        currentSetWinner: { home: parseFloat(oddsHome), away: parseFloat(oddsAway) },
                        nextGameWinner: { home: parseFloat(oddsHome), away: parseFloat(oddsAway) },
                        nextOverRunsTeam1_2: { over: 1.85, under: 1.85 },
                        nextOverRunOddEven: { odd: 1.90, even: 1.90 },
                        nextOverTeamsWicket: { yes: 3.50, no: 1.25 },
                        team1Total50OversRuns: { over: 1.83, under: 1.83 },
                        runsIn1st10Overs: { over: 1.83, under: 1.83 }
                    },
                    status: "LIVE"
                });
            });
        }
    } catch (err) {
        console.log("External API stream suspended or rate limited.");
    }

    if (freshFeeds.length === 0) {
        try {
            const fallbackMatrix = [
                { id: "local_crick_t20", sport: "cricket", league: "IPL T20 Power", country: "India", format: "t20", teamH: "KKR Kings", teamA: "MI Indians", scoreH: "178/3", scoreA: "Yet to Bat", timer: "Overs: 16.5" },
                { id: "local_crick_odi", sport: "cricket", league: "ICC Men World Cup", country: "Bangladesh", format: "odi", teamH: "Bangladesh", teamA: "India", scoreH: "242/5", scoreA: "Yet to Bat", timer: "Overs: 44.2" },
                { id: "local_crick_test", sport: "cricket", league: "International Test Cup", country: "England", format: "test", teamH: "England", teamA: "Australia", scoreH: "312/6", scoreA: "285/10", timer: "Day 3 - Session 2" },
                { id: "local_crick_t10", sport: "cricket", league: "Asia T10 Blast", country: "Pakistan", format: "t10", teamH: "Lahore Lions", teamA: "Karachi Jets", scoreH: "94/2", scoreA: "Yet to Bat", timer: "Overs: 7.4" },
                { id: "local_foot_01", sport: "football", league: "UEFA Champions League", country: "Europe", format: "live", teamH: "Real Madrid", teamA: "Barcelona", scoreH: "2", scoreA: "1", timer: "68'" },
                { id: "local_ten_01", sport: "tennis", league: "Wimbledon Men Singles", country: "United Kingdom", format: "live", teamH: "Novak Djokovic", teamA: "Carlos Alcaraz", scoreH: JSON.stringify({ set: 1, game: 4, point: "30" }), scoreA: JSON.stringify({ set: 0, game: 2, point: "40" }), timer: "Set 2" }
            ];

            fallbackMatrix.forEach((m) => {
                let fluctuation = (Math.random() * 0.2 - 0.1);
                let dOdds = {
                    fullTimeResult: { home: parseFloat((1.85 + fluctuation).toFixed(2)), draw: parseFloat((3.40 + fluctuation).toFixed(2)), away: parseFloat((2.10 + fluctuation).toFixed(2)) },
                    matchWinner2Way: { home: parseFloat((1.85 + fluctuation).toFixed(2)), away: parseFloat((1.85 - fluctuation).toFixed(2)) },
                    matchWinner3Way: { home: parseFloat((2.10 + fluctuation).toFixed(2)), draw: parseFloat((3.50 + fluctuation).toFixed(2)), away: parseFloat((2.20 - fluctuation).toFixed(2)) },
                    doubleChance: { homeDraw: parseFloat((1.22 + fluctuation * 0.1).toFixed(2)), awayDraw: parseFloat((1.32 - fluctuation * 0.1).toFixed(2)) },
                    toWinSet: { home: parseFloat((1.85 + fluctuation).toFixed(2)), away: parseFloat((1.85 - fluctuation).toFixed(2)) },
                    currentSetWinner: { home: parseFloat((1.85 + fluctuation).toFixed(2)), away: parseFloat((1.85 - fluctuation).toFixed(2)) },
                    nextGameWinner: { home: parseFloat((1.85 + fluctuation).toFixed(2)), away: parseFloat((1.85 - fluctuation).toFixed(2)) },
                    nextOverRunsTeam1_2: { over: parseFloat((1.85 + fluctuation * 0.05).toFixed(2)), under: parseFloat((1.85 - fluctuation * 0.05).toFixed(2)) },
                    nextOverRunOddEven: { odd: 1.90, even: 1.90 },
                    nextOverTeamsWicket: { yes: 3.50, no: 1.25 },
                    team1Total50OversRuns: { over: 1.83, under: 1.83 },
                    runsIn1st10Overs: { over: 1.83, under: 1.83 }
                };

                freshFeeds.push({
                    matchId: m.id,
                    sport: m.sport,
                    country: m.country,
                    league: m.league,
                    matchFormat: m.format,
                    teamHome: m.teamH,
                    teamAway: m.teamA,
                    scoreHome: m.scoreH,
                    scoreAway: m.scoreA,
                    matchTime: m.timer,
                    odds: dOdds,
                    status: "LIVE"
                });
            });
        } catch (e) {
            console.error("Local array matrix builder error handled safely.");
        }
    }

    bet365ActiveFeeds = freshFeeds;
    io.emit("bet365LiveOddsUpdate", bet365ActiveFeeds);
}

// Fixed interval cycle execution to save API requests quota limit
setInterval(fetchFreeAndDynamicSportsDataFeed, 60000);

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

