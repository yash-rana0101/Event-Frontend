/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { X, Upload, AlertCircle } from 'lucide-react';

const EventImagesUpload = ({ formData, updateFormData, errors, handleImagesChange }) => {
  const [previewUrl, setPreviewUrl] = React.useState('');

  React.useEffect(() => {
    // Set preview URL if image already exists in formData
    if (formData.image && typeof formData.image === 'string') {
      setPreviewUrl(formData.image);
    }
  }, [formData.image]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create a preview for the image file
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Update formData with the selected file
    updateFormData({ image: file });
  };

  const removeImage = () => {
    // Clear preview
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl); // Clean up the URL object if it's a blob URL
    }
    setPreviewUrl('');

    // Clear image from formData
    updateFormData({ image: '' });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants} className="mb-6">
        <h2 className="text-2xl font-bold text-cyan-400 mb-1">
          Event Image
        </h2>
        <p className="text-gray-400 text-sm">
          Upload an image for your event. This will be displayed as the event cover image.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Upload Image
        </label>

        <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-cyan-500 transition-colors">
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="event-image"
            accept="image/*"
          />
          <label
            htmlFor="event-image"
            className="cursor-pointer flex flex-col items-center justify-center"
          >
            <Upload className="h-10 w-10 text-gray-400 mb-2" />
            <span className="text-gray-300 font-medium">Click to select image</span>
            <span className="text-gray-500 text-sm mt-1">PNG, JPG, GIF up to 5MB</span>
          </label>
        </div>

        {errors.image && (
          <div className="mt-2 flex items-center text-red-500">
            <AlertCircle size={16} className="mr-1" />
            <span>{errors.image}</span>
          </div>
        )}
      </motion.div>

      {/* Image Preview */}
      {previewUrl && (
        <motion.div variants={itemVariants} className="mt-6">
          <h3 className="text-lg text-cyan-400 mb-3">Event Cover Image</h3>
          <div className="relative group w-full max-w-md">
            <img
              src={previewUrl}
              alt="Event cover"
              className="w-full h-auto rounded-lg object-cover"
              onError={(e) => {
                e.target.src = 'https://placehold.co/600x400?text=Image+Error';
              }}
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="mt-6">
        <p className="text-gray-400 text-sm">
          <strong>Note:</strong> We recommend using high-quality landscape orientation images (1200×600px).
        </p>
      </motion.div>
    </motion.div>
  );
};

export default EventImagesUpload;
