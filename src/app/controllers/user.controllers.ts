import { Request, Response } from "express";
import {
  findUser,
  findUsersCount,
  processingUserList,
} from "../repositories/users.repository";
import {
  loginUser,
  registerUser,
  removeMe,
  changePassword,
  paginate,
  verifyAccount,
  getUserList,
} from "../../services/user.service";
import { IVerificationCode } from "../interfaces/user.interface";
import { sendVerifyEmail } from "../../services/email.service";

export const registationController = async (req: Request, res: Response) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  const candidate = await findUser({ email: userEmail });
  if (candidate) {
    return res
      .status(400)
      .json({ message: "user with this  email already exist" });
  }
  const userSuccessToken = await registerUser(userPassword, userEmail);
  if (userSuccessToken) {
    sendVerifyEmail(userSuccessToken, userEmail);
    res.status(200).json({ message: "registrated" });
  } else {
    res.status(400).json({ message: "error" });
  }
};

export const loginController = async (req: Request, res: Response) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  const token = await loginUser(userPassword, userEmail);
  if (token) {
    return res.status(200).json({ accessToken: token });
  }
  res.status(401).json({ message: "unauthorized" });
};

export const deleteAccountContoller = async (req: Request, res: Response) => {
  const user = req.user;
  const userEmail = user?.email;
  const result = await removeMe(userEmail);
  if (result) {
    res.status(200).json({ message: "successfully deleted" });
  } else {
    res.status(400).json({ message: "smth went wrong and data wasnt deleted" });
  }
};

export const changePasswordController = async (req: Request, res: Response) => {
  const userEmail = req.user?.email;
  const oldPassword = req.body.password;
  const newPassword = req.body.newPassword;
  const isUpdated = await changePassword(userEmail, oldPassword, newPassword);
  if (isUpdated) {
    res.status(200).json({ message: "password changed" });
  } else {
    res
      .status(400)
      .json({ message: "smth went wrong and password wanst changed" });
  }
};

export const getUsersList = async (req: Request, res: Response) => {
  const page: number = req.body?.page;
  const perPage: number = req.body?.perPage;
  const processUserList = await getUserList(page, perPage);
  res.status(200).json({
    users: processUserList,
    currentPage: page,
    itemsPerPage: perPage,
  });
};

export const verifyController = async (
  req: Request<IVerificationCode>,
  res: Response
) => {
  const codeFromParams = req.params?.verificationCode;
  if (await verifyAccount(codeFromParams)) {
    res.status(200).json({ message: "verified" });
  } else {
    res.status(400).json({ message: "invalid code" });
  }
};

export const verificationPage = async (
  req: Request<IVerificationCode>,
  res: Response
) => {
  const codeFromParams = req.params?.verificationCode;
  try {
    res.status(200).json({ verificationCode: codeFromParams }); //send code to front
  } catch (error) {
    res.status(400);
  }
};
