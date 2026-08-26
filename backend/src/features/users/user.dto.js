/**
 * Shapes a Mongoose User document into a safe, client-facing object.
 */
export const toUserDTO = (user) => {
  if (!user) return null;
  const plain = typeof user.toObject === 'function' ? user.toObject() : user;

  return {
    id: plain._id?.toString() ?? plain.id,
    name: plain.name,
    email: plain.email,
    avatar: plain.avatar ?? null,
    role: plain.role,
    authProvider: plain.authProvider,
    isVerified: plain.isVerified,
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt,
  };
};

export const toUserListDTO = (users = []) => users.map(toUserDTO);

export default { toUserDTO, toUserListDTO };