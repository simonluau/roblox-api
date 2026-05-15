const express = require('express');
const app = express();
app.use(express.json());

let users = {};

app.get('/check/:userId', (req, res) => {
    const userId = req.params.userId;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    if (!users[userId]) {
        users[userId] = { startTime: Date.now(), status: "Active", targetPlace: null };
    }

    users[userId].lastSeen = Date.now();
    users[userId].status = "Active";

    if (users[userId].targetPlace) {
        const placeId = users[userId].targetPlace;
        users[userId].targetPlace = null;
        return res.json({ action: "teleport", placeId: placeId, userIp: ip });
    }
    
    res.json({ action: "wait", userIp: ip });
});

app.post('/target-player', (req, res) => {
    const { userId, targetPlaceId } = req.body;
    if (users[userId]) {
        users[userId].targetPlace = targetPlaceId;
        res.send({ success: true });
    } else {
        res.status(404).send("User Not Found");
    }
});

setInterval(() => {
    const now = Date.now();
    for (let id in users) {
        if (now - users[id].lastSeen > 10000) { users[id].status = "Leaved"; }
    }
}, 5000);

app.listen(3000, () => console.log("Anarchy API Online"));
