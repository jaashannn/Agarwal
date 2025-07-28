import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crop, RotateCw } from 'lucide-react';

const ImageCropper = ({ isOpen, onClose, image, onCrop }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 200, height: 200 });
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const handleCrop = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw cropped image
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.drawImage(
      imageRef.current,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      -crop.width / 2,
      -crop.height / 2,
      crop.width,
      crop.height
    );
    ctx.restore();
    
    // Convert to blob and call onCrop
    canvas.toBlob((blob) => {
      const croppedFile = new File([blob], image.name, { type: image.type });
      onCrop(croppedFile);
      onClose();
    }, image.type);
  };

  const handleImageLoad = (e) => {
    const img = e.target;
    const canvas = canvasRef.current;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    
    // Set initial crop to center
    setCrop({
      x: img.naturalWidth / 4,
      y: img.naturalHeight / 4,
      width: img.naturalWidth / 2,
      height: img.naturalHeight / 2
    });
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
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-darkGreen p-6 text-white rounded-t-2xl">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Crop Image</h2>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="text-2xl" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Image Preview */}
              <div className="flex-1">
                <div className="relative border-2 border-dashed border-gold rounded-xl p-4 bg-gray-50">
                  <img
                    ref={imageRef}
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="max-w-full h-auto"
                    onLoad={handleImageLoad}
                    style={{ transform: `rotate(${rotation}deg)` }}
                  />
                  {/* Crop overlay */}
                  <div
                    className="absolute border-2 border-white shadow-lg"
                    style={{
                      left: crop.x,
                      top: crop.y,
                      width: crop.width,
                      height: crop.height
                    }}
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="lg:w-80 space-y-6">
                <div>
                  <h3 className="font-bold text-gray-700 mb-4">Crop Controls</h3>
                  
                  {/* Rotation */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rotation
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setRotation(prev => prev - 90)}
                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                      >
                        <RotateCw className="w-5 h-5" />
                      </button>
                      <span className="text-sm text-gray-600">{rotation}°</span>
                      <button
                        onClick={() => setRotation(prev => prev + 90)}
                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                      >
                        <RotateCw className="w-5 h-5 transform scale-x-[-1]" />
                      </button>
                    </div>
                  </div>

                  {/* Crop Size */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Crop Size
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-gray-500">Width</label>
                        <input
                          type="range"
                          min="50"
                          max="400"
                          value={crop.width}
                          onChange={(e) => setCrop(prev => ({ ...prev, width: parseInt(e.target.value) }))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500">Height</label>
                        <input
                          type="range"
                          min="50"
                          max="400"
                          value={crop.height}
                          onChange={(e) => setCrop(prev => ({ ...prev, height: parseInt(e.target.value) }))}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Crop Position */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Position
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-gray-500">X</label>
                        <input
                          type="range"
                          min="0"
                          max="300"
                          value={crop.x}
                          onChange={(e) => setCrop(prev => ({ ...prev, x: parseInt(e.target.value) }))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500">Y</label>
                        <input
                          type="range"
                          min="0"
                          max="300"
                          value={crop.y}
                          onChange={(e) => setCrop(prev => ({ ...prev, y: parseInt(e.target.value) }))}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={handleCrop}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center"
                  >
                    <Crop className="mr-2" />
                    Apply Crop
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            {/* Hidden canvas for processing */}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageCropper; 