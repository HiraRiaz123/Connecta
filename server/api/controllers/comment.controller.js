import Joi from "joi";
import Comment from "../models/comment.model.js";
import CommentDTO from "../dto/CommentDTO.js";

const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

export const createComment = async (req, res, next) => {
  const createCommentSchema = Joi.object({
    content: Joi.string().required(),
    user: Joi.string().regex(mongodbIdPattern).required(),
    post: Joi.string().regex(mongodbIdPattern).required(),
  });

  const { error } = createCommentSchema.validate(req.body);
  if (error) {
    return next(error);
  }

  const { content, user, post } = req.body;
  try {
    const newComment = new Comment({
      content,
      user,
      post,
    });
    await newComment.save();
    return res.status(201).json({ comment: "Comment created" });
  } catch (error) {
    return next(error);
  }
};

export const getComment = async (req, res, next) => {
  const getByIdSchema = Joi.object({
    id: Joi.string().regex(mongodbIdPattern).required(),
  });

  const { error } = getByIdSchema.validate(req.params);
  if (error) {
    return next(error);
  }

  const { id } = req.params;
  try {
    let comments = await Comment.find({ post: id }).populate(["user", "post"]);
    let commentsDto = [];
    for (let comment of comments) {
      const dto = new CommentDTO(comment);
      commentsDto.push(dto);
    }
    return res.status(200).json({ data: commentsDto });
  } catch (error) {
    return next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  const deleteCommentSchema = Joi.object({
    id: Joi.string().regex(mongodbIdPattern).required(),
  });

  const { error } = deleteCommentSchema.validate(req.params);
  if (error) {
    return next(error);
  }

  const { id } = req.params;
  console.log(id);
  const commentToDelete = await Comment.findById(id);
  if (!commentToDelete) {
    const error = {
      status: 404,
      message: "Comment not found",
    };
    return next(error);
  }
  try {
    await Comment.findByIdAndDelete(id);
    res.status(200).json({ comment: "Comment deleted successfully" });
  } catch (error) {
    return next(error);
  }
};
