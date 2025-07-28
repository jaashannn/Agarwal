import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  paymentMethod: { 
    type: String, 
    enum: ['UPI', 'Bank Transfer'], 
    required: true 
  },
  utrNumber: { 
    type: String, 
    required: true, 
    trim: true, 
    unique: true 
  },
  upiId: { 
    type: String, 
    trim: true, 
    required: function() { return this.paymentMethod === 'UPI'; } 
  },
  amount: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  paymentDate: { 
    type: Date, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Verified', 'Rejected'], 
    default: 'Pending' 
  },
  remarks: { 
    type: String, 
    trim: true, 
    maxlength: 500 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model('Payment', paymentSchema);