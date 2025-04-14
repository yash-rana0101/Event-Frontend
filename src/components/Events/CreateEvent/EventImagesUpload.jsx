/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image, X, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { safelyParseToken } from '../../../utils/persistFix';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const EventImagesUpload = ({ formData, updateFormData, errors }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const organizerToken = useSelector(state => state.organizer?.token);
  const [localError, setLocalError] = useState(null);
  
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

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setLocalError(null);
    const updatedImages = [...formData.images];

    try {
      // Get token and parse it if it's a JSON string
      let rawToken = organizerToken || localStorage.getItem('organizer_token');
      const token = safelyParseToken(rawToken);

      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file size and type
        if (file.size > 5 * 1024 * 1024) { // 5MB
          toast.warning(`File ${file.name} is too large (max 5MB)`);
          continue;
        }

        if (!file.type.startsWith('image/')) {
          toast.warning(`File ${file.name} is not an image`);
          continue;
        }

        // For now, just use fake upload to get file URLs - in a real implementation, replace this
        // with server upload and get the URL back
        
        // Create a temporary preview URL
        const previewUrl = URL.createObjectURL(file);
        updatedImages.push(previewUrl);
        
        // Increment progress
        setUploadProgress((i + 1) / files.length * 100);
        
        // NOTE: In a real implementation, you would upload the file to your server here
        // and get back a URL to use. For this example, we're just using the object URL.
      }

      // Update form data with the new images
      updateFormData({ images: updatedImages });
      toast.success('Images added successfully!');

    } catch (error) {
      console.error("File upload error:", error);
      setLocalError(error.message || 'Failed to upload files');
      toast.error('Failed to upload images');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removeImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    updateFormData({ images: updatedImages });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="mb-6">
        <motion.h2 variants={itemVariants} className="text-2xl font-bold text-cyan-400 mb-1">
          Event Images
        </motion.h2>
        <motion.p variants={itemVariants} className="text-gray-400 text-sm">
          Upload images for your event. The first image will be used as the cover.
        </motion.p>
      </div>

      {localError && (
        <motion.div variants={itemVariants} className="mb-6 bg-red-900/30 border border-red-500/50 text-red-200 p-4 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{localError}</p>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="mb-6">
        <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
          <div className="flex flex-col items-center justify-center">
            <Upload className="h-12 w-12 text-cyan-500 mb-4" />
            <p className="text-gray-300 mb-4">Drag & drop images here or click to browse</p>
            <input
              type="file"
              id="eventImages"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
            <label
              htmlFor="eventImages"
              className={`
                px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-medium rounded-lg cursor-pointer
                flex items-center transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading... {uploadProgress.toFixed(0)}%
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5 mr-2" />
                  Choose Images
                </>
              )}
            </label>
            <p className="text-gray-500 text-sm mt-3">
              Supported formats: JPG, PNG, GIF. Max size: 5MB per file.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Image Preview Grid */}
      {formData.images.length > 0 && (
        <motion.div variants={itemVariants} className="mt-6">
          <h3 className="text-md font-medium text-gray-300 mb-3">Selected Images</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {formData.images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-800 border border-gray-700">
                  <img
                    src={image}
                    alt={`Event preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
                {index === 0 && (
                  <span className="absolute top-2 left-2 bg-cyan-500 text-black text-xs px-2 py-1 rounded-md">
                    Cover
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EventImagesUpload;
