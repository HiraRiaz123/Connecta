import Joi from "joi";
import fs from "fs";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Comment from "../models/comment.model.js";
import mongoose from "mongoose";
import PostDTO from "../dto/postDto.js";
import PostDetailsDTO from "../dto/PostDetailsDTO.js";
import { BACKEND_SERVER_PATH } from "../../dependencies/config.js";

const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

export const createPost = async (req, res, next) => {
  const createPostSchema = Joi.object({
    user: Joi.string().regex(mongodbIdPattern).required(),
    description: Joi.string().required(),
    file: Joi.string().required(),
  });

  const { error } = createPostSchema.validate(req.body);
  if (error) {
    return next(error);
  }

  const { description, user, file } = req.body;

  const buffer = Buffer.from(
    file.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
    "base64"
  );
  const filePath = `${Date.now()}-${user}.png`;
  try {
    fs.writeFileSync(`storage/${filePath}`, buffer);
  } catch (error) {
    return next(error);
  }

  let newPost;
  try {
    newPost = new Post({
      user,
      description,
      filePath: `${BACKEND_SERVER_PATH}/storage/${filePath}`,
    });
    await newPost.save();
  } catch (error) {
    return next(error);
  }

  const postDto = new PostDTO(newPost);
  return res.status(201).json({ post: postDto });
};

export const getPost = async (req, res, next) => {
  const getByIdSchema = Joi.object({
    id: Joi.string().regex(mongodbIdPattern).required(),
  });

  const { error } = getByIdSchema.validate(req.params);
  if (error) {
    return next(error);
  }

  let post;
  const { id } = req.params;
  try {
    post = await Post.findOne({ _id: id }).populate("user");
    if (!post) {
      const error = {
        status: 404,
        message: "Post not found",
      };
      return next(error);
    }
  } catch (error) {
    return next(error);
  }

  const postDto = new PostDetailsDTO(post);
  return res.status(200).json({ post: postDto });
};

export const updatePost = async (req, res, next) => {
  const updateBlogSchema = Joi.object({
    description: Joi.string().required(),
    user: Joi.string().regex(mongodbIdPattern).required(),
    postId: Joi.string().regex(mongodbIdPattern).required(),
    file: Joi.string(),
  });

  const { error } = updateBlogSchema.validate(req.body);
  if (error) {
    return next(error);
  }

  const { description, user, postId, file } = req.body;
  let postToUpdate;
  try {
    postToUpdate = await Post.findOne({ _id: postId, user: user });
    if (!postToUpdate) {
      const error = {
        status: 404,
        message: "Post not found",
      };
      return next(error);
    }
  } catch (error) {
    return next(error);
  }
  const updatedPostData = { description };
  if (file) {
    let previousfile = postToUpdate.filePath;
    previousfile = previousfile.split("/").at(-1);
    fs.unlinkSync(`storage/${previousfile}`);
    const buffer = Buffer.from(
      file.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
      "base64"
    );
    const filePath = `${Date.now()}-${user}.png`;
    let response;
    try {
      // response = await cloudinary.uploader.upload(file);
      fs.writeFileSync(`storage/${filePath}`, buffer);
    } catch (error) {
      return next(error);
    }
    updatedPostData.filePath = `${BACKEND_SERVER_PATH}/storage/${filePath}`;
  }
  try {
    await Post.updateOne({ _id: postId }, updatedPostData);
    return res.status(200).json({ message: "Post updated!" });
  } catch (error) {
    return next(error);
  }
};

export const deletePost = async (req, res, next) => {
  const deletePostSchema = Joi.object({
    id: Joi.string().regex(mongodbIdPattern).required(),
  });

  const { error } = deletePostSchema.validate(req.params);
  if (error) {
    return next(error);
  }

  const { id } = req.params;
  const postToDelete = await Post.findById(id);
  if (!postToDelete) {
    const error = {
      status: 404,
      message: "Post not found",
    };
    return next(error);
  }

  try {
    await Post.findByIdAndDelete({ _id: id });
    await Comment.deleteMany({ post: id });
    return res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    return next(error);
  }
};

export const likePost = async (req, res, next) => {
  const likePostSchema = Joi.object({
    id: Joi.string().regex(mongodbIdPattern).required(),
  });

  const { error } = likePostSchema.validate(req.params);
  if (error) {
    return next(error);
  }

  const { id } = req.params;
  const { user } = req.body;
  try {
    const post = await Post.findById(id);
    if (!post.likes.includes(user)) {
      await post.updateOne({ $push: { likes: user } });
      res.status(200).json({ message: "Post Liked!" });
    } else {
      await post.updateOne({ $pull: { likes: user } });
      res.status(200).json({ message: "Post Un-Liked!" });
    }
  } catch (error) {
    return next(error);
  }
};

export const getTimeLinePosts = async (req, res, next) => {
  const getTimeLinePostsSchema = Joi.object({
    id: Joi.string().regex(mongodbIdPattern).required(),
  });

  const { error } = getTimeLinePostsSchema.validate(req.params);
  if (error) {
    return next(error);
  }

  const { id } = req.params;
  try {
    const currentUserPosts = await Post.find({ user: id });
    const postsOfFollowingUsers = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "following",
          foreignField: "user",
          as: "postsOfFollowingUsers",
        },
      },
      {
        $project: {
          postsOfFollowingUsers: 1,
          _id: 0,
        },
      },
    ]);

    const timeLinePosts = currentUserPosts
      .concat(...(postsOfFollowingUsers[0]?.postsOfFollowingUsers || []))
      .sort((a, b) => {
        return b.createdAt - a.createdAt;
      });
    const timeLinePostsDto = [];
    for (let timeLinePost of timeLinePosts) {
      const dto = new PostDTO(timeLinePost);
      timeLinePostsDto.push(dto);
    }
    return res.status(200).json({ timeLinePosts: timeLinePostsDto });
  } catch (error) {
    return next(error);
  }
};

export const savePost = async (req, res, next) => {
  const savePostSchema = Joi.object({
    id: Joi.string().regex(mongodbIdPattern).required(),
  });

  const { error } = savePostSchema.validate(req.params);
  if (error) {
    return next(error);
  }

  const { id } = req.params;
  const { userId } = req.body;
  console.log(userId);
  try {
    const user = await User.findById(userId);
    if (!user.saved.includes(id)) {
      await user.updateOne({ $push: { saved: id } });
      res.status(200).json({ message: "Post Saved!" });
    } else {
      await user.updateOne({ $pull: { saved: id } });
      res.status(200).json({ message: "Post Un-Saved!" });
    }
  } catch (error) {
    return next(error);
  }
};

export const getSavedPosts = async (req, res, next) => {
  const { _id } = req.user;
  try {
    const user = await User.findById(_id);
    const savedPostIds = user.saved;
    const savedPosts = await Post.find({ _id: { $in: savedPostIds } }).populate(
      "user"
    );
    if (!savedPosts || savedPosts.length === 0) {
      const error = {
        status: 404,
        message: "No saved posts found",
      };
      return next(error);
    }
    const savedPostsDto = [];
    for (let savedPost of savedPosts) {
      const dto = new PostDetailsDTO(savedPost);
      savedPostsDto.push(dto);
    }
    return res.status(200).json({ savedPosts: savedPostsDto });
  } catch (error) {
    return next(error);
  }
};
