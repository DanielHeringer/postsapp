"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.databaseProviders = [
    {
        provide: 'DATABASE_CONNECTION',
        useFactory: () => mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-qdo0g.gcp.mongodb.net/${process.env.MONGO_DB}`, { useUnifiedTopology: true, useNewUrlParser: true }),
    },
];
//# sourceMappingURL=database.providers.js.map