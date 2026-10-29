import type { User } from "./user.types";

export type CommentCreator = Pick<User, "_id" | "name" | "username" | "photo">

export type Comment = {
    _id: string;
    content: string | null;
    image: string | null;
    commentCreator: CommentCreator;
};


export type Post = {
    _id: string;
    body: string;
    image?: string;
    privacy: string;
    user: Pick<User, "_id" | "name" | "username" | "photo">;
    sharedPost: any;
    likes: any[];
    createdAt: string;
    commentsCount: number;
    topComment: Comment;
    sharesCount: number;
    likesCount: number;
    isShare: boolean;
    id: string;
    bookmarked: boolean;
};