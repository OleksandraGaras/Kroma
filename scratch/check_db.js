const mongoose = require('mongoose');
const Level = require('../models/level.js');

mongoose.connect('mongodb://127.0.0.1:27017/kroma')
    .then(async () => {
        const total = await Level.countDocuments({});
        const challenges = await Level.countDocuments({ isChallenge: true });
        const standard = await Level.countDocuments({ isChallenge: false });
        console.log(`TOTAL LEVELS IN DB: ${total}`);
        console.log(`STANDARD LEVELS: ${standard}`);
        console.log(`CHALLENGE LEVELS: ${challenges}`);
        
        const challengeList = await Level.find({ isChallenge: true }).select('title order difficulty');
        console.log("CHALLENGES LIST:", challengeList);
        
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
