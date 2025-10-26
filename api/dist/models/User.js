"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("../config/database");
class UserModel {
    static async create(userData) {
        const { name, email, password } = userData;
        // Hash password
        const password_hash = await bcryptjs_1.default.hash(password, 12);
        const result = await (0, database_1.query)(`INSERT INTO users (name, email, password_hash) 
       VALUES ($1, $2, $3) 
       RETURNING id, name, email, created_at, updated_at`, [name, email, password_hash]);
        return result.rows[0];
    }
    static async findByEmail(email) {
        const result = await (0, database_1.query)('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0] || null;
    }
    static async findById(id) {
        const result = await (0, database_1.query)('SELECT id, name, email, created_at, updated_at FROM users WHERE id = $1', [id]);
        return result.rows[0] || null;
    }
    static async verifyPassword(plainPassword, hashedPassword) {
        return bcryptjs_1.default.compare(plainPassword, hashedPassword);
    }
    static async updateProfile(id, updates) {
        const setClause = Object.keys(updates)
            .map((key, index) => `${key} = $${index + 2}`)
            .join(', ');
        const values = [id, ...Object.values(updates)];
        const result = await (0, database_1.query)(`UPDATE users 
       SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1 
       RETURNING id, name, email, created_at, updated_at`, values);
        return result.rows[0];
    }
    static async changePassword(id, newPassword) {
        const password_hash = await bcryptjs_1.default.hash(newPassword, 12);
        await (0, database_1.query)('UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [password_hash, id]);
    }
}
exports.UserModel = UserModel;
//# sourceMappingURL=User.js.map