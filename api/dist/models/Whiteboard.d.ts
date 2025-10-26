export interface Whiteboard {
    id: number;
    title: string;
    scene_id: string;
    owner_id: number;
    is_public: boolean;
    created_at: Date;
    updated_at: Date;
}
export interface CreateWhiteboardData {
    title: string;
    owner_id: number;
    scene_data?: any;
    is_public?: boolean;
}
export interface WhiteboardResponse {
    id: number;
    title: string;
    scene_id: string;
    owner_id: number;
    is_public: boolean;
    created_at: Date;
    updated_at: Date;
}
export interface WhiteboardWithScene extends WhiteboardResponse {
    scene_data?: any;
}
export declare class WhiteboardModel {
    static create(data: CreateWhiteboardData): Promise<WhiteboardResponse>;
    static findByOwner(owner_id: number): Promise<WhiteboardResponse[]>;
    static findById(id: number, include_scene?: boolean): Promise<WhiteboardWithScene | null>;
    static updateScene(scene_id: string, scene_data: any): Promise<void>;
    static update(id: number, updates: Partial<Pick<Whiteboard, 'title' | 'is_public'>>): Promise<WhiteboardResponse>;
    static delete(id: number, owner_id: number): Promise<boolean>;
    static checkAccess(id: number, user_id: number): Promise<boolean>;
}
//# sourceMappingURL=Whiteboard.d.ts.map