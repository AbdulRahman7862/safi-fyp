import jwt from 'jsonwebtoken';
import User from '../model/user_model.js';

const authenticateUser = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Access Denied: No Token Provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;  
        next();
    } catch (error) {
        console.error('Authentication Error:', error.message);
        res.status(401).json({ message: 'Invalid Token' });
    }
};

export default authenticateUser;
