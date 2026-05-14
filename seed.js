const mongoose = require('mongoose');
const Level = require('./models/level.js');

mongoose.connect('mongodb://127.0.0.1:27017/kroma')
    .then(async () => {
        console.log("Connected to MongoDB");
        
        await Level.deleteMany({}); // Clear existing levels

        const levels = [
            {
                title: "Hola HTML",
                description: "Benvingut al primer nivell! En aquest exercici has de crear un encapçalament <h1> que digui 'Hola Món!'.",
                initialCode: "<!-- Escriu el teu codi aquí -->\n",
                solutionCode: "<h1>Hola Món!</h1>",
                language: "html",
                order: 1
            }
        ];

        await Level.insertMany(levels);
        console.log("Levels seeded successfully");
        process.exit();
    })
    .catch(err => {
        console.error("Connection error", err);
    });
