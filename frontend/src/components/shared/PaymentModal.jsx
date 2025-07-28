import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, QrCode, Info, AlertCircle, CheckCircle } from 'lucide-react';
import Scanner from '../../assets/scanner.jpg';
import { AuthContext } from '../../context/AuthContext';

const PaymentModal = ({ isOpen, onClose, showPaymentForm = false }) => {
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [showForm, setShowForm] = useState(false);
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
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/payments`, {
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

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        setSubmitStatus('error');
        return;
      }

      if (response.ok) {
        setSubmitStatus('success');
        setTimeout(() => {
          onClose();
          setShowForm(false);
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
        console.error('Payment submission error:', data?.error || 'Unknown error');
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
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto my-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-darkGreen p-6 text-white rounded-t-2xl">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {showForm ? 'Submit Payment Details' : 'Payment Details'}
              </h2>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="text-2xl" />
              </button>
            </div>
            <p className="text-gold/90 mt-2">Registration Fee: ₹500</p>
          </div>

          {showForm ? (
            /* Payment Form */
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
                    className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Payment'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Back to Payment Info
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Payment Information Display */
            <>
              {/* Payment Method Tabs */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={() => setPaymentMethod('UPI')}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center ${
                      paymentMethod === 'UPI'
                        ? 'bg-primary text-black shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <QrCode className={`mr-2 ${paymentMethod === 'UPI' ? 'text-black' : 'text-gray-600'}`} />
                    UPI Payment
                  </button>
                  <button
                    onClick={() => setPaymentMethod('Bank Transfer')}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center ${
                      paymentMethod === 'Bank Transfer'
                        ? 'bg-primary text-black shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <CreditCard className={`mr-2 ${paymentMethod === 'Bank Transfer' ? 'text-black' : 'text-gray-600'}`} />
                    Bank Transfer
                  </button>
                </div>
              </div>

              {/* Payment Content */}
              <div className="p-6">
                {paymentMethod === 'UPI' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* QR Code Section */}
                    <div>
                      <h3 className="flex items-center font-bold text-gray-700 mb-4">
                        <QrCode className="mr-2 text-gold" />
                        Scan QR Code
                      </h3>
                      <div className="bg-white p-6 rounded-xl shadow-sm border border-gold/20 flex justify-center">
                        <div className="bg-gray-100 border-2 border-dashed rounded-xl w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center">
                          <img src={Scanner} alt="QR Code" className="w-48 h-48 sm:w-64 sm:h-64 object-cover rounded-xl" />
                        </div>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div>
                      <h3 className="font-bold text-gray-700 mb-4">How to Pay via UPI</h3>
                      <ol className="list-decimal pl-5 space-y-3 text-gray-600">
                        <li>Open your UPI app (Google Pay, PhonePe, Paytm, etc.)</li>
                        <li>Select "Scan QR Code" option</li>
                        <li>Scan the QR code shown here</li>
                        <li>Enter amount (₹500) and complete payment</li>
                        <li>Save the transaction receipt for reference</li>
                      </ol>
                      
                      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-sm text-yellow-700 flex items-start">
                          <Info className="mr-2 mt-0.5 flex-shrink-0" />
                          After payment, please submit your payment details using the form below
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="flex items-center font-bold text-gray-700 mb-4">
                      <CreditCard className="mr-2 text-gold" />
                      Bank Transfer Details
                    </h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                      <div className="bg-white p-6 rounded-xl shadow-sm border border-gold/20">
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-500">Bank Name</p>
                            <p className="font-medium">Bank of India</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Account Name</p>
                            <p className="font-medium">Agarwal Matrimonial Services</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Account Number</p>
                            <p className="font-mono font-medium">6549-1011-000-3443</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-6 rounded-xl shadow-sm border border-gold/20">
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-500">IFSC Code</p>
                            <p className="font-mono font-medium">BKID0006549</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Branch</p>
                            <p className="font-medium">Kotkapura, Faridkot</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Account Type</p>
                            <p className="font-medium">Current Account</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-700 flex items-start">
                        <Info className="mr-2 mt-0.5 flex-shrink-0" />
                        After transferring, please submit your payment details using the form below
                      </p>
                    </div>
                  </div>
                )}

                {/* Submit Payment Details Button */}
                <div className="mt-8 text-center">
                  <button
                    onClick={() => setShowForm(true)}
                    className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-lg font-medium"
                  >
                    Submit Payment Details
                  </button>
                  <p className="text-sm text-gray-600 mt-3">
                    Click above to submit your payment transaction details
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-600 text-center sm:text-left">
                Need help? Contact us at aggarwalmatrimonialkkp@gmail.com
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentModal; 