import userRepository from './user.repository.js';
import { toUserDTO, toUserListDTO } from './user.dto.js';
import { ApiError } from '../../common/utils/ApiError.js';
import { httpStatusCodes } from '../../common/constants/httpStatusCodes.js';
import { messages } from '../../common/constants/messages.js';

class UserService {
  async getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) throw new ApiError(httpStatusCodes.NOT_FOUND, messages.USER.NOT_FOUND);
    return toUserDTO(user);
  }

  async listUsers({ page = 1, limit = 10, search = '' } = {}) {
    const filter = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      userRepository.findAll({ filter, skip, limit }),
      userRepository.count(filter),
    ]);

    return {
      users: toUserListDTO(users),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async updateUser(id, updateData) {
    const user = await userRepository.updateById(id, updateData);
    if (!user) throw new ApiError(httpStatusCodes.NOT_FOUND, messages.USER.NOT_FOUND);
    return toUserDTO(user);
  }

  async deleteUser(id) {
    const user = await userRepository.deleteById(id);
    if (!user) throw new ApiError(httpStatusCodes.NOT_FOUND, messages.USER.NOT_FOUND);
    return toUserDTO(user);
  }
}

export const userService = new UserService();

export default userService;
