import User from '../models/User.js';

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password -resetOTP -resetOTPExpiry')
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    res.status(500).json({ error: 'An error occurred while fetching users' });
  }
};

// Update user payment status (admin only)
export const updateUserPaymentStatus = async (req, res) => {
  try {
    const { isPaymentDone } = req.body;
    const userId = req.params.id;

    if (typeof isPaymentDone !== 'boolean') {
      return res.status(400).json({ error: 'isPaymentDone must be a boolean' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { isPaymentDone },
      { new: true }
    ).select('-password -resetOTP -resetOTPExpiry');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      message: 'User payment status updated successfully',
      user
    });
  } catch (error) {
    console.error('Error in updateUserPaymentStatus:', error);
    res.status(500).json({ error: 'An error occurred while updating user payment status' });
  }
}; 