const express = require('express');
const app = express();
app.use(express.json());

let teleportQueue = {};

app.get('/check/:userId', (req, res) => {
    const userId = req.params.userId;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    if (teleportQueue[userId]) {
        const targetPlace = teleportQueue[userId];
        delete teleportQueue[userId];
        return res.json({ action: "teleport", placeId: targetPlace, userIp: ip });
    }
    
    res.json({ action: "wait", userIp: ip });
});

app.post('/target-player', (req, res) => {
    const { userId, targetPlaceId } = req.body;
    if (!userId || !targetPlaceId) return res.status(400).send("Eksik veri");
    teleportQueue[userId] = targetPlaceId;
    res.send({ success: true });
});

app.listen(3000, () => console.log("API Online"));
