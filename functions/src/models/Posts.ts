import { ObjectId } from "mongodb";

export default interface Posts {
    posts: Post[]
}

export interface Post {
    _id?: ObjectId,
    author: string,
    title: string,
    text: string,
    timestamp: string
}

export interface Categories {
    categories: Category[]
}

export interface Category {
    name: string
}