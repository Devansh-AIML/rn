import jwt from 'jsonwebtoken';
import User from '../models/user.Model.js';

const authenticate = async (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded._id);
      next();
    } catch (err) {
        console.log(err);
      res.status(401).json({ error: 'Invalid token' });
    }
  };
  
  export default authenticate;