import Joi from "joi";
import Chat from "../models/chat.model.js";
import ChatDTO from "../dto/chatDTO.js";

const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

export const createChat = async (req, res, next) => {
  const createChatSchema = Joi.object({
    senderId: Joi.string().regex(mongodbIdPattern).required(),
    receiverId: Joi.string().regex(mongodbIdPattern).required(),
  });

  const { error } = createChatSchema.validate(req.body);
  if (error) {
    return next(error);
  }
  
  const { senderId, receiverId } = req.body;
  const newChat = new Chat({
    members: [senderId, receiverId],
  });

  try {
    const chat = await newChat.save();
    const chatDto = new ChatDTO(chat);
    return res.status(200).json({ chat: chatDto });
  } catch (error) {
    return next(error);
  }
};

export const userChats = async (req, res, next) => {
  const userChatSchema = Joi.object({
    userId: Joi.string().regex(mongodbIdPattern).required(),
  });

  const { error } = userChatSchema.validate(req.params);
  if (error) {
    return next(error);
  }

  const { userId } = req.params;
  try {
    const chats = await Chat.find({
      members: { $in: [userId] },
    });

    let chatDto = [];
    for (let chat of chats) {
      const dto = new ChatDTO(chat);
      chatDto.push(dto);
    }

    return res.status(200).json({ chat: chatDto });
  } catch (error) {
    return next(error);
  }
};

export const findChat = async (req, res, next) => {
  const findChatSchema = Joi.object({
    firstId: Joi.string().regex(mongodbIdPattern).required(),
    secondId: Joi.string().regex(mongodbIdPattern).required(),
  });

  const { error } = findChatSchema.validate(req.params);
  if (error) {
    return next(error);
  }

  const { firstId, secondId } = req.params;
  try {
    const chat = await Chat.findOne({
      members: { $all: [firstId, secondId] },
    });
    if (!chat) {
      const error = {
        status: 404,
        message: "Chat not found",
      };
      return next(error);
    } else {
      const chatDto = new ChatDTO(chat);
      return res.status(200).json({ chat: chatDto });
    }
  } catch (error) {
    return next(error);
  }
};
