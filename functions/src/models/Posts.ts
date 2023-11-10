import { ObjectId } from "mongodb";

export default interface Posts {
    posts: Post[]
}

export interface Post {
    _id?: ObjectId,
    author: string,
    title: string,
    content: string,
    timestamp: string
    image: Image
}

export interface Image {
    filename: string,
    type: string
}

export interface Categories {
    categories: Category[]
}

export interface Category {
    name: string
}