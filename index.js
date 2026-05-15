const express = require('express');
const app = require('express')();
app.use(express.json());

let teleportQueue = {};

app.get('/check/:userId', (req, res) => {
    const userId = req.params.userId;
    
    const forwarded = req.headers['x-forwarded-for'];
    const remote = req.socket.remoteAddress;
    
    let displayIp = "Unknown";
    let ipType = "Direct";

    if (forwarded) {
        displayIp = forwarded.split(',')[0];
        ipType = "Forwarded (Real)";
    } else if (remote) {
        displayIp = remote;
        ipType = "Remote Socket";
    }

    if (teleportQueue[userId]) {
        const targetPlace = teleportQueue[userId];
        delete teleportQueue[userId];
        return res.json({ action: "teleport", placeId: targetPlace, userIp: displayIp, type: ipType });
    }
    
    res.json({ action: "wait", userIp: displayIp, type: ipType });
});

app.post('/target-player', (req, res) => {
    const { userId, targetPlaceId } = req.body;
    if (!userId || !targetPlaceId) return res.status(400).send("Missing Data");
    teleportQueue[userId] = targetPlaceId;
    res.send({ success: true });
});

app.listen(3000, () => console.log("API Online - English Version"));
