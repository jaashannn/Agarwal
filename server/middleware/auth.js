import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ message: 'No token provided' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY || 'your_jwt_secret')
    
    // Fetch the complete user object from database
    const user = await User.findById(decoded.id).populate('profile')
    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }
    
    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
}

export default authMiddleware