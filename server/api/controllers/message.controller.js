import Joi from "joi";
import Message from "../models/message.model.js";
import MessageDTO from "../dto/messageDTO.js";

const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

export const createMessage = async (req, res, next) => {
  const createMessageSchema = Joi.object({
    chatId: Joi.string().regex(mongodbIdPattern).required(),
    senderId: Joi.string().regex(mongodbIdPattern).required(),
    text: Joi.string().required(),
  });

  const { error } = createMessageSchema.validate(req.body);
  if (error) {
    return next(error);
  }

  const { chatId, senderId, text } = req.body;
  const newMessage = new Message({
    chatId,
    senderId,
    text,
  });
  try {
    const message = await newMessage.save();
    const messageDto = new MessageDTO(message);
    return res.status(200).json({ message: messageDto });
  } catch (error) {
    return next(error);
  }
};

export const getMessages = async (req, res) => {
  const getMessageSchema = Joi.object({
    chatId: Joi.string().regex(mongodbIdPattern).required(),
  });

  const { error } = getMessageSchema.validate(req.params);
  if (error) {
    return next(error);
  }

  const { chatId } = req.params;
  try {
    const messages = await Message.find({ chatId });
    let messageDto = [];
    for (let message of messages) {
      const dto = new MessageDTO(message);
      messageDto.push(dto);
    }
    return res.status(200).json({ messages: messageDto });
  } catch (error) {
    return next(error);
  }
};

export const deleteMessage = async (req, res, next) => {
  const deleteMessageSchema = Joi.object({
    id: Joi.string().regex(mongodbIdPattern).required(),
  });

  const { error } = deleteMessageSchema.validate(req.params);

  if (error) {
    return next(error);
  }
  const { id } = req.params;
  const messageToDelete = await Message.findById(id);
  if (!messageToDelete) {
    const error = {
      status: 404,
      message: "Message not found",
    };
    return next(error);
  }
  try {
    await Message.findByIdAndDelete(id);
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    return next(error);
  }
};
