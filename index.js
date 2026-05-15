const express = require('express');
const app = express();
app.use(express.json());

let teleportQueue = {};

app.post('/target-player', (req, res) => {
    const { userId, targetPlaceId } = req.body;
    if (!userId || !targetPlaceId) return res.status(400).send("Eksik veri");
    
    teleportQueue[userId] = targetPlaceId;
    res.send({ success: true, message: "Oyuncu listeye eklendi." });
});

app.get('/check/:userId', (req, res) => {
    const userId = req.params.userId;
    if (teleportQueue[userId]) {
        const targetPlace = teleportQueue[userId];
        delete teleportQueue[userId];
        return res.json({ action: "teleport", placeId: targetPlace });
    }
    res.json({ action: "wait" });
});

app.listen(3000, () => console.log("Sunucu aktiftir!"));
