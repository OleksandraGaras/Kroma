const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/kroma')
    .then(async () => {
        console.log("Connected to MongoDB");
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Collections:", collections.map(c => c.name));
        
        const Level = mongoose.model('Level', new mongoose.Schema({}, { strict: false }));
        
        try {
            const indexes = await Level.collection.indexes();
            console.log("Indexes on levels collection before drop:", indexes);
            
            // Check if order_1 unique index exists, and drop it
            const hasOrderIndex = indexes.some(idx => idx.name === 'order_1');
            if (hasOrderIndex) {
                console.log("Dropping unique index order_1...");
                await Level.collection.dropIndex('order_1');
                console.log("Dropped index order_1 successfully!");
            } else {
                console.log("No order_1 index found.");
            }
        } catch (err) {
            console.error("Error with indexes:", err);
        }
        
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
