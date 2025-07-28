import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle, CreditCard, QrCode } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const PaymentDetailsForm = ({ isOpen, onClose, onSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [formData, setFormData] = useState({
    utrNumber: '',
    upiId: '',
    amount: 500,
    paymentDate: new Date().toISOString().split('T')[0],
    remarks: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const { user } = useContext(AuthContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          paymentMethod,
          amount: Number(formData.amount)
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setTimeout(() => {
          onClose();
          if (onSuccess) onSuccess();
          setFormData({
            utrNumber: '',
            upiId: '',
            amount: 500,
            paymentDate: new Date().toISOString().split('T')[0],
            remarks: ''
          });
        }, 2000);
      } else {
        setSubmitStatus('error');
        console.error('Payment submission error:', data.error);
      }
    } catch (error) {
      setSubmitStatus('error');
      console.error('Payment submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-darkGreen p-6 text-black rounded-t-2xl">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-center text-black">Submit Payment Details</h2>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="text-2xl" />
              </button>
            </div>
            <p className="text-gold/90 mt-2">Registration Fee: ₹500</p>
          </div>

          {/* Form */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Payment Method Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method *
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="UPI"
                      checked={paymentMethod === 'UPI'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-2"
                    />
                    <QrCode className="mr-2 text-gold" />
                    UPI Payment
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Bank Transfer"
                      checked={paymentMethod === 'Bank Transfer'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-2"
                    />
                    <CreditCard className="mr-2 text-gold" />
                    Bank Transfer
                  </label>
                </div>
              </div>

              {/* UTR Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  UTR Number *
                </label>
                <input
                  type="text"
                  name="utrNumber"
                  value={formData.utrNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter UTR Number"
                  required
                />
              </div>

              {/* UPI ID (only for UPI payments) */}
              {paymentMethod === 'UPI' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    UPI ID *
                  </label>
                  <input
                    type="text"
                    name="upiId"
                    value={formData.upiId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter UPI ID"
                    required
                  />
                </div>
              )}

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₹) *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              {/* Payment Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Date *
                </label>
                <input
                  type="date"
                  name="paymentDate"
                  value={formData.paymentDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remarks (Optional)
                </label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Any additional notes..."
                  maxLength="500"
                />
              </div>

              {/* Submit Status */}
              {submitStatus && (
                <div className={`p-4 rounded-lg flex items-center ${
                  submitStatus === 'success' 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {submitStatus === 'success' ? (
                    <CheckCircle className="mr-2" />
                  ) : (
                    <AlertCircle className="mr-2" />
                  )}
                  {submitStatus === 'success' 
                    ? 'Payment submitted successfully!' 
                    : 'Error submitting payment. Please try again.'}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colorsdisabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Payment'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentDetailsForm; 