import userService from './user.service.js';
import { asyncHandler } from '../../common/utils/asyncHandler.js';
import { ApiResponse } from '../../common/utils/ApiResponse.js';
import { httpStatusCodes } from '../../common/constants/httpStatusCodes.js';
import { messages } from '../../common/constants/messages.js';

export const getMe = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.user.id);
  res.status(httpStatusCodes.OK).json(new ApiResponse(httpStatusCodes.OK, user, messages.USER.FETCHED));
});

export const updateMe = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.user.id, req.body);
  res.status(httpStatusCodes.OK).json(new ApiResponse(httpStatusCodes.OK, user, messages.USER.UPDATED));
});

export const getUsers = asyncHandler(async (req, res) => {
  const result = await userService.listUsers(req.query);
  res.status(httpStatusCodes.OK).json(new ApiResponse(httpStatusCodes.OK, result, messages.USER.FETCHED));
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.status(httpStatusCodes.OK).json(new ApiResponse(httpStatusCodes.OK, user, messages.USER.FETCHED));
});

export const updateUserById = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  res.status(httpStatusCodes.OK).json(new ApiResponse(httpStatusCodes.OK, user, messages.USER.UPDATED));
});

export const deleteUserById = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id);
  res.status(httpStatusCodes.OK).json(new ApiResponse(httpStatusCodes.OK, null, messages.USER.DELETED));
});

export default { getMe, updateMe, getUsers, getUserById, updateUserById, deleteUserById };
