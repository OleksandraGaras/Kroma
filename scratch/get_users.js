const mongoose = require('mongoose');
const User = require('../models/users.js');

mongoose.connect('mongodb://127.0.0.1:27017/kroma')
    .then(async () => {
        const users = await User.find({}).select('username email password points nivel');
        console.log("USERS LIST:", users);
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
