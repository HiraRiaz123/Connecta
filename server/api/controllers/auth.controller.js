import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import Joi from "joi";
import UserDTO from "../dto/UserDTO.js";
import JWTService from "../services/JWTService.js";
import RefreshToken from "../models/refreshToken.model.js";

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

export const userRegister = async (req, res, next) => {
  const userRegisterSchema = Joi.object({
    firstName: Joi.string().min(5).max(30).required(),
    lastName: Joi.string().max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(passwordPattern).required(),
    confirmPassword: Joi.ref("password"),
    gender: Joi.string().valid("MALE", "FEMALE", "OTHER").required(),
  });
  const { error } = userRegisterSchema.validate(req.body);
  if (error) {
    return next(error);
  }

  const { firstName, lastName, email, password, gender } = req.body;
  try {
    const emailInUse = await User.exists({ email });

    if (emailInUse) {
      const error = {
        status: 409,
        message: "Email already registered, use another email!",
      };
      return next(error);
    }
  } catch (error) {
    return next(error);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  let accessToken;
  let refreshToken;
  let user;
  try {
    const userToRegister = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      gender,
    });

    user = await userToRegister.save();
    accessToken = JWTService.signAccessToken({ _id: user._id }, "30m");
    refreshToken = JWTService.signRefreshToken({ _id: user._id }, "60m");
  } catch (error) {
    return next(error);
  }

  await JWTService.storeRefreshToken(refreshToken, user._id);
  res.cookie("accessToken", accessToken, {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  });
  res.cookie("refreshToken", refreshToken, {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  });

  const userDto = new UserDTO(user);
  return res.status(201).json({ user: userDto, auth: true });
};

export const userLogin = async (req, res, next) => {
  const userLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(passwordPattern),
  });

  const { error } = userLoginSchema.validate(req.body);
  if (error) {
    return next(error);
  }

  const { email, password } = req.body;
  let user;
  try {
    user = await User.findOne({ email: email });
    if (!user) {
      const error = {
        status: 404,
        message: "User not found",
      };
      return next(error);
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      const error = {
        status: 404,
        message: "User not found",
      };
      return next(error);
    }
  } catch (error) {
    return next(error);
  }

  const accessToken = JWTService.signAccessToken({ _id: user._id }, "30m");
  const refreshToken = JWTService.signRefreshToken({ _id: user._id }, "60m");
  try {
    await RefreshToken.updateOne(
      {
        _id: user._id,
      },
      { token: refreshToken },
      { upsert: true }
    );
  } catch (error) {
    return next(error);
  }

  res.cookie("accessToken", accessToken, {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  });
  res.cookie("refreshToken", refreshToken, {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  });

  const userDto = new UserDTO(user);
  return res.status(200).json({ user: userDto, auth: true });
};

export const userLogout = async (req, res, next) => {
  const { refreshToken } = req.cookies;
  try {
    await RefreshToken.deleteOne({ token: refreshToken });
  } catch (error) {
    return next(error);
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json({ user: null, auth: false });
};

export const refreshToken = async (req, res, next) => {
  const originalRefreshToken = req.cookies.refreshToken;
  let id;
  try {
    id = JWTService.verifyRefreshToken(originalRefreshToken)._id;
  } catch (error) {
    const newError = {
      status: 401,
      message: "Unauthorized",
    };
    return next(newError);
  }

  try {
    const match = RefreshToken.findOne({
      _id: id,
      token: originalRefreshToken,
    });

    if (!match) {
      const error = {
        status: 401,
        message: "Unauthorized",
      };
      return next(error);
    }
  } catch (error) {
    return next(error);
  }

  try {
    const accessToken = JWTService.signAccessToken({ _id: id }, "30m");
    const refreshToken = JWTService.signRefreshToken({ _id: id }, "60m");
    await RefreshToken.updateOne({ _id: id }, { token: refreshToken });

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
  } catch (error) {
    return next(error);
  }

  const user = await User.findOne({ _id: id });
  const userDto = new UserDTO(user);

  return res.status(200).json({ user: userDto, auth: true });
};
