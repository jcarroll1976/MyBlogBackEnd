import express from "express";
import { getClient } from "../db";
import { ObjectId } from "mongodb";
import Post from "../models/Posts";

const postRouter = express.Router();

const errorResponse = (error: any, res: any) => {
   console.error("FAIL", error);
   res.status(500).json({ message: "Internal Server Error" });
};


// get all Posts
postRouter.get("/posts", async (req, res) => {
 try {
   const client = await getClient();
   const cursor = client.db().collection<Post>("posts").find();
   const results = await cursor.toArray();
   res.status(200).json(results);
 } catch (err) {
   errorResponse(err, res);
 }
});

// get Post by ID
postRouter.get("/posts/:id", async (req, res) => {
 try {
   const _id: ObjectId = new ObjectId(req.params.id);
   const client = await getClient();
   const post = await client.db().collection<Post>("posts")
       .findOne({ _id });
   if (post) {
     res.status(200).json(post);
   } else {
     res.status(404).json({message: "Not Found"});
   }
 } catch (err) {
    errorResponse(err, res);
 }
});

// create new Post
postRouter.post("/posts", async (req, res) => {
 try {
   const post: Post = req.body;
   const client = await getClient();
   await client.db()
       .collection<Post>("posts")
       .insertOne(post);
   res.status(201).json(post);
 } catch (err) {
    errorResponse(err, res);
  }
});

// delete Post by ID
postRouter.delete("/posts/:id", async (req, res) => {
 try {
   const _id: ObjectId = new ObjectId(req.params.id);
   const client = await getClient();
   const result = await client.db().collection<Post>("posts")
       .deleteOne({ _id });
   if (result.deletedCount) {
     res.sendStatus(204);
   } else {
     res.status(404).json({message: "Not Found"});
   }
 } catch (err) {
    errorResponse(err, res);
 }
});

// replace / update Post by ID
postRouter.put("/posts/:id", async (req, res) => {
 try {
   const _id: ObjectId = new ObjectId(req.params.id);
   const updatedPost: Post = req.body;
   delete updatedPost._id; // remove _id from body so we only have one.
   const client = await getClient();
   const result = await client.db().collection<Post>("posts")
       .replaceOne({ _id }, updatedPost);
   if (result.modifiedCount) {
     updatedPost._id = _id;
     res.status(200).json(updatedPost);
   } else {
     res.status(404).json({ message: "Not Found" });
   }
 } catch (err) {
    errorResponse(err, res);
  }
});

//handling query params
postRouter.get("/posts", async (req, res) => {
 try {
   const title: string | null = (req.query.title as string) || null;
   const author: string | null = req.query.author as string || null;
   const category: string | null = req.query.category as string || null;

    const query: any = {};

    if (title) {
      query.title = title;
    }

    if (author) {
      query.author = author;
    }

    if (category) {
      query.category = category;
    }

    const client = await getClient();
    const cursor = client.db().collection<Post>("posts").find(query);
    const results = await cursor.toArray();
    res.status(200).json(results);
  } catch (err) {
    errorResponse(err, res);
  }
});

// Get all posts in a specific category
postRouter.get("/posts/category/:category", async (req,res) => {
  try {
    const category: string = req.params.category;

    const client = await getClient();
    const posts = await client.db().collection<Post>('posts').find({ category }).toArray();

    res.status(200).json(posts);
  } catch (err) {
    errorResponse(err, res);
  }
});

export default postRouter;