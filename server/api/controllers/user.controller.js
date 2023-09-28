import Joi from "joi";
import fs from "fs";
import User from "../models/user.model.js";
import UserDetailsDTO from "../dto/UserDetailsDTO.js";
import { BACKEND_SERVER_PATH } from "../../dependencies/config.js";

const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

export const getUser = async (req, res, next) => {
  const getByIdSchema = Joi.object({
    id: Joi.string().regex(mongodbIdPattern).required(),
  });

  const { error } = getByIdSchema.validate(req.params);
  if (error) {
    return next(error);
  }

  let user;
  const { id } = req.params;
  try {
    user = await User.findById({ _id: id });
    if (!user) {
      const error = {
        status: 404,
        message: "User not found",
      };
      return next(error);
    }
  } catch (error) {
    return next(error);
  }

  const userDto = new UserDetailsDTO(user);
  return res.status(200).json({ user: userDto });
};

export const getAllUsers = async (req, res, next) => {
  try {
    let users = await User.find();
    if (!users) {
      const error = {
        status: 404,
        message: "Users not found",
      };
      return next(error);
    } else {
      const usersDto = users.map((user) => new UserDetailsDTO(user));
      res.status(200).json({ users: usersDto });
    }
  } catch (error) {
    return next(error);
  }
};

export const updateUser = async (req, res, next) => {
  const updateUserSchema = Joi.object({
    userId: Joi.string().regex(mongodbIdPattern).required(),
    firstName: Joi.string().min(3).max(30).required(),
    lastName: Joi.string().max(30).required(),
    gender: Joi.string().valid("MALE", "FEMALE", "OTHER").required(),
    profilePicture: Joi.string(),
    coverPicture: Joi.string(),
    phoneNumber: Joi.string().regex(/^\d{10}$/),
    livesIn: Joi.string(),
    studyAt: Joi.string(),
    worksAt: Joi.string(),
    relationship: Joi.string(),
    country: Joi.string(),
  });

  const { error } = updateUserSchema.validate(req.body);
  if (error) {
    return next(error);
  }

  const {
    userId,
    firstName,
    lastName,
    gender,
    profilePicture,
    coverPicture,
    phoneNumber,
    livesIn,
    studyAt,
    worksAt,
    relationship,
    country,
  } = req.body;
  let userToUpdate;
  try {
    userToUpdate = await User.findOne({ _id: userId });
    if (!userToUpdate) {
      const error = {
        status: 404,
        message: "User not found",
      };
      return next(error);
    }
  } catch (error) {
    return next(error);
  }
  const updatedUserData = {
    firstName,
    lastName,
    gender,
    phoneNumber,
    livesIn,
    studyAt,
    worksAt,
    relationship,
    country,
  };

  if (profilePicture) {
    if (userToUpdate.profilePicturePath) {
      const previousProfilePicture = userToUpdate.profilePicturePath
        .split("/")
        .at(-1);
      fs.unlinkSync(`storage/${previousProfilePicture}`);
    }
    const buffer = Buffer.from(
      profilePicture.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
      "base64"
    );
    const profilePath = `${Date.now()}-${userId}.png`;
    try {
      fs.writeFileSync(`storage/${profilePath}`, buffer);
      updatedUserData.profilePicturePath = `${BACKEND_SERVER_PATH}/storage/${profilePath}`;
    } catch (error) {
      return next(error);
    }
  }
  if (coverPicture) {
    if (userToUpdate.coverPicturePath) {
      const previousCoverPicture = userToUpdate.coverPicturePath
        .split("/")
        .at(-1);
      fs.unlinkSync(`storage/${previousCoverPicture}`);
    }
    const buffer = Buffer.from(
      coverPicture.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
      "base64"
    );
    const coverPath = `${Date.now()}-${userId}.png`;
    try { 
      fs.writeFileSync(`storage/${coverPath}`, buffer);
    } catch (error) {
      return next(error);
    }
    updatedUserData.coverPicturePath = `${BACKEND_SERVER_PATH}/storage/${coverPath}`;
  }
  try {
    await User.updateOne({ _id: userId }, updatedUserData);
    return res.status(200).json({ message: "User updated!" });
  } catch (error) {
    return next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  const deleteUserSchema = Joi.object({
    id: Joi.string().regex(mongodbIdPattern).required(),
  });

  const { error } = deleteUserSchema.validate(req.params);

  if (error) {
    return next(error);
  }
  const { id } = req.params;
  const userToDelete = await User.findById(id);
  if (!userToDelete) {
    const error = {
      status: 404,
      message: "User not found",
    };
    return next(error);
  }
  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return next(error);
  }
};

export const followUser = async (req, res, next) => {
  const followUserSchema = Joi.object({
    id: Joi.string().regex(mongodbIdPattern).required(),
  });

  const { error } = followUserSchema.validate(req.params);

  if (error) {
    return next(error);
  }
  const { id } = req.params;
  const { currentUserId } = req.body;
  if (currentUserId === id) {
    const error = {
      status: 403,
      message: "Action forbidden",
    };
    return next(error);
  } else {
    try {
      const followUser = await User.findById(id);
      const followingUser = await User.findById(currentUserId);
      if (!followUser.followers.includes(currentUserId)) {
        await followUser.updateOne({ $push: { followers: currentUserId } });
        await followingUser.updateOne({ $push: { following: id } });
        res.status(200).json({ message: "User Followed!" });
      } else {
        res.status(403).json({ message: "User is already followed by you" });
      }
    } catch (error) {
      return next(error);
    }
  }
};

export const unFollowUser = async (req, res, next) => {
  const followUserSchema = Joi.object({
    id: Joi.string().regex(mongodbIdPattern).required(),
  });

  const { error } = followUserSchema.validate(req.params);

  if (error) {
    return next(error);
  }
  const { id } = req.params;
  const { currentUserId } = req.body;
  if (currentUserId === id) {
    const error = {
      status: 403,
      message: "Action forbidden",
    };
    return next(error);
  } else {
    try {
      const followUser = await User.findById(id);
      const followingUser = await User.findById(currentUserId);
      if (followUser.followers.includes(currentUserId)) {
        await followUser.updateOne({ $pull: { followers: currentUserId } });
        await followingUser.updateOne({ $pull: { following: id } });
        res.status(200).json({ message: "User Un-followed!" });
      } else {
        res.status(403).json({ message: "User is not followed by you" });
      }
    } catch (error) {
      return next(error);
    }
  }
};

export const searchUser = async (req, res, next) => {
  let firstName = String(req.query.firstName);
  let lastName = String(req.query.lastName);
  try {
    const users = await User.find({
      $or: [
        { firstName: { $regex: new RegExp(firstName, "i") } },
        { lastName: { $regex: new RegExp(lastName, "i") } },
      ],
    }).limit(10);
    console.log(users.length);
    if (!users || users.length === 0) {
      const error = {
        status: 404,
        message: "Users not found",
      };
      return next(error);
    } else {
      const usersDto = users.map((user) => new UserDetailsDTO(user));
      res.status(200).json({ users: usersDto });
    }
  } catch (error) {
    return next(error);
  }
};

export const suggestionsUser = async (req, res, next) => {
  const currentUser = req.user;
  try {
    const connectedUsers = await User.find({
      $or: [{ followers: currentUser._id }, { following: currentUser._id }],
    });

    if (!connectedUsers || connectedUsers.length === 0) {
      const error = {
        status: 404,
        message: "No connected users found",
      };
      return next(error);
    }
    const followersOfCurrentUser = connectedUsers.filter((user) =>
      user.following.includes(currentUser._id)
    );

    const followersOfConnectedUsers = [];
    const followingOfConnectedUsers = [];

    for (const connectedUser of connectedUsers) {
      const followers = await User.find({ following: connectedUser._id });
      const following = await User.find({ followers: connectedUser._id });
      followersOfConnectedUsers.push(followers);
      followingOfConnectedUsers.push(following);
    }
    const suggestedUsers = [
      ...followersOfCurrentUser,
      ...followersOfConnectedUsers.flat(),
      ...followingOfConnectedUsers.flat(),
    ];
    const suggestedUsersDto = suggestedUsers.map(
      (user) => new UserDetailsDTO(user)
    );
    return res.status(200).json({ suggestedUsersDto });
  } catch (error) {
    return next(error);
  }
};
