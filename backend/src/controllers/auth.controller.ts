import { Request, Response } from "express";
import UserModel from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !password || !email) return res.status(400).json({ message: 'All fields are required', isRegistered: false });

    const existingUser = await UserModel.findOne({ $or: [{ username }, { email }] });
    if (existingUser) return res.status(400).json({ message: "User already exists. Try logging in instead.", isRegistered: false });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new UserModel({ username, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username
      },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: '1d'}
    );

    res.status(201).json({ 
      message: 'User has been registered successfully', 
      isRegistered: true,
      token
    });
    
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      success: false,
      error
    })
  }
}

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) return res.status(400).json({ message: 'Both username and password are required for login' });

    const user = await UserModel.findOne({ username });
    if (!user) return res.status(401).json({ 
        message: "Invalid username or password.",
        isRegistered: false
      });

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) return res.status(401).json({ 
        message: "Invalid username or password.",
        isRegistered: false
      });


    const token = jwt.sign(
      {
        id: user._id,
        username: user.username
      },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: '1d'}
    );

    res.status(200).json({
      message: 'User logged in successfully!',
      isRegistered: true,
      token
    });

  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      success: false,
      error
    });
  }
}

