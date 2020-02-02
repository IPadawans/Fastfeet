import User from '../models/User';

export default async (req, res, next) => {
  const { userId } = req;

  const user = await User.findByPk(userId);

  if (user.administrator) {
    return next();
  }

  return res.status(401).json({ error: 'User is not an admnistrator' });
};
