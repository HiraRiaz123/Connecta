import UserModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// register new user
export const userRegister = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    age,
    phoneNumber,
    status,
    gender,
  } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  const newUser = new UserModel({
    firstName,
    lastName,
    email,
    password: hashPassword,
    age,
    phoneNumber,
    status,
    gender,
  });
  try {
    const user = await newUser.save();
    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
    res.status(200).json({ user, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email: email });
    if (user) {
      const validity = await bcrypt.compare(password, user.password);
      if (!validity) {
        res.status(400).json("Credentials do not match");
      } else {
        const token = jwt.sign(
          { email: user.email, id: user._id },
          process.env.JWT_KEY,
          { expiresIn: "1h" }
        );
        res.status(200).json({ user, token });
      }
    } else {
      res.status(404).json("User does not exists");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
