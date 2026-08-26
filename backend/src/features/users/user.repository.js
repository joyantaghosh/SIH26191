import { User } from './user.model.js';

/**
 * Data access layer for the User collection.
 * Keeps Mongoose specific queries out of the service layer.
 */
class UserRepository {
  create(data) {
    return User.create(data);
  }

  findById(id) {
    return User.findById(id);
  }

  findByIdWithPassword(id) {
    return User.findById(id).select('+password +refreshToken');
  }

  findByEmail(email) {
    return User.findOne({ email: email?.toLowerCase() });
  }

  findByEmailWithPassword(email) {
    return User.findOne({ email: email?.toLowerCase() }).select('+password +refreshToken');
  }

  findByGoogleId(googleId) {
    return User.findOne({ googleId });
  }

  findAll({ filter = {}, skip = 0, limit = 10, sort = '-createdAt' } = {}) {
    return User.find(filter).sort(sort).skip(skip).limit(limit);
  }

  count(filter = {}) {
    return User.countDocuments(filter);
  }

  updateById(id, update) {
    return User.findByIdAndUpdate(id, update, { new: true, runValidators: true });
  }

  deleteById(id) {
    return User.findByIdAndDelete(id);
  }

  setRefreshToken(id, refreshToken) {
    return User.findByIdAndUpdate(id, { refreshToken }, { new: true });
  }
}

export const userRepository = new UserRepository();

export default userRepository;
