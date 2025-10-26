import { Db } from 'mongodb';
export declare const connectMongoDB: () => Promise<Db>;
export declare const query: (text: string, params?: any[]) => Promise<import("pg").QueryResult<any>>;
export declare const getMongoDB: () => Promise<Db>;
export declare const closeDatabaseConnections: () => Promise<void>;
//# sourceMappingURL=database.d.ts.map