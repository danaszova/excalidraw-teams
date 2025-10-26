"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDatabaseConnections = exports.getMongoDB = exports.query = exports.connectMongoDB = void 0;
const pg_1 = require("pg");
const mongodb_1 = require("mongodb");
// PostgreSQL connection
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});
// Test PostgreSQL connection
pool.on('connect', () => {
    console.log('📊 Connected to PostgreSQL database');
});
pool.on('error', (err) => {
    console.error('❌ PostgreSQL connection error:', err);
});
// MongoDB connection
let mongoDb = null;
let mongoClient = null;
const connectMongoDB = async () => {
    if (mongoDb) {
        return mongoDb;
    }
    try {
        const mongoUrl = process.env.MONGODB_URL || 'mongodb://mongo:27017/excalidraw';
        mongoClient = new mongodb_1.MongoClient(mongoUrl);
        await mongoClient.connect();
        mongoDb = mongoClient.db();
        console.log('📊 Connected to MongoDB database');
        return mongoDb;
    }
    catch (error) {
        console.error('❌ MongoDB connection error:', error);
        throw error;
    }
};
exports.connectMongoDB = connectMongoDB;
// PostgreSQL query helper
const query = async (text, params) => {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('🔍 Executed query', { text, duration, rows: res.rowCount });
        return res;
    }
    catch (error) {
        console.error('❌ Database query error:', error);
        throw error;
    }
};
exports.query = query;
// MongoDB getter
const getMongoDB = async () => {
    if (!mongoDb) {
        return await (0, exports.connectMongoDB)();
    }
    return mongoDb;
};
exports.getMongoDB = getMongoDB;
// Graceful shutdown
const closeDatabaseConnections = async () => {
    console.log('🔄 Closing database connections...');
    try {
        await pool.end();
        console.log('✅ PostgreSQL connection closed');
    }
    catch (error) {
        console.error('❌ Error closing PostgreSQL:', error);
    }
    try {
        if (mongoClient) {
            await mongoClient.close();
            console.log('✅ MongoDB connection closed');
        }
    }
    catch (error) {
        console.error('❌ Error closing MongoDB:', error);
    }
};
exports.closeDatabaseConnections = closeDatabaseConnections;
// Handle process termination
process.on('SIGINT', exports.closeDatabaseConnections);
process.on('SIGTERM', exports.closeDatabaseConnections);
//# sourceMappingURL=database.js.map