import Payment from '../models/Payment.js';
import User from '../models/User.js';
import Profile from '../models/Profile.js';

// Create a new payment
export const createPayment = async (req, res) => {
  try {
    const { paymentMethod, utrNumber, upiId, amount, paymentDate, remarks } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!paymentMethod || !utrNumber || !amount || !paymentDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if UPI ID is provided for UPI payments
    if (paymentMethod === 'UPI' && !upiId) {
      return res.status(400).json({ error: 'UPI ID is required for UPI payments' });
    }

    // Check if UTR number already exists
    const existingPayment = await Payment.findOne({ utrNumber });
    if (existingPayment) {
      return res.status(400).json({ error: 'UTR number already exists' });
    }

    // Create new payment
    const payment = new Payment({
      user: userId,
      paymentMethod,
      utrNumber,
      upiId: paymentMethod === 'UPI' ? upiId : undefined,
      amount,
      paymentDate: new Date(paymentDate),
      remarks,
      status: 'Pending'
    });

    await payment.save();

    res.status(201).json({
      message: 'Payment submitted successfully',
      payment: {
        id: payment._id,
        paymentMethod: payment.paymentMethod,
        utrNumber: payment.utrNumber,
        amount: payment.amount,
        status: payment.status,
        createdAt: payment.createdAt
      }
    });
  } catch (error) {
    console.error('Error in createPayment:', error);
    res.status(500).json({ error: 'An error occurred while creating payment' });
  }
};

// Get all payments (admin only)
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('user', 'name email mobile')
      .sort({ createdAt: -1 });

    res.status(200).json(payments);
  } catch (error) {
    console.error('Error in getAllPayments:', error);
    res.status(500).json({ error: 'An error occurred while fetching payments' });
  }
};

// Get user's payments
export const getUserPayments = async (req, res) => {
  try {
    const userId = req.user._id;
    const payments = await Payment.find({ user: userId })
      .sort({ createdAt: -1 });

    res.status(200).json(payments);
  } catch (error) {
    console.error('Error in getUserPayments:', error);
    res.status(500).json({ error: 'An error occurred while fetching payments' });
  }
};

// Get a single payment by ID
export const getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('user', 'name email mobile');

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Check if user is authorized to view this payment
    if (req.user.role !== 'admin' && payment.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to view this payment' });
    }

    res.status(200).json(payment);
  } catch (error) {
    console.error('Error in getPayment:', error);
    res.status(500).json({ error: 'An error occurred while fetching payment' });
  }
};

// Update payment status (admin only)
export const updatePaymentStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const paymentId = req.params.id;

    if (!status || !['Pending', 'Verified', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    payment.status = status;
    if (remarks) {
      payment.remarks = remarks;
    }

    // If payment is verified, update user's profile and user payment status
    if (status === 'Verified') {
      const profile = await Profile.findOne({ user: payment.user });
      if (profile) {
        profile.isPaymentDone = true;
        await profile.save();
      }
      
      // Update user's payment status
      await User.findByIdAndUpdate(payment.user, { isPaymentDone: true });
    } else if (status === 'Rejected') {
      // If payment is rejected, update user's payment status to false
      await User.findByIdAndUpdate(payment.user, { isPaymentDone: false });
    }

    await payment.save();

    res.status(200).json({
      message: 'Payment status updated successfully',
      payment: {
        id: payment._id,
        status: payment.status,
        remarks: payment.remarks,
        updatedAt: payment.updatedAt
      }
    });
  } catch (error) {
    console.error('Error in updatePaymentStatus:', error);
    res.status(500).json({ error: 'An error occurred while updating payment status' });
  }
};

// Delete payment (admin only)
export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    await Payment.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Payment deleted successfully' });
  } catch (error) {
    console.error('Error in deletePayment:', error);
    res.status(500).json({ error: 'An error occurred while deleting payment' });
  }
}; 