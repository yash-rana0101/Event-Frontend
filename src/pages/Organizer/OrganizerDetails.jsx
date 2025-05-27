/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import axios from 'axios';
import { safelyParseToken } from '../../utils/persistFix';
import { toast } from 'react-toastify';
import { useLoader } from '../../context/LoaderContext';
import { Plus, X, Twitter, Linkedin, Globe, Instagram, Facebook } from 'lucide-react';
import { setProfileComplete } from '../../redux/user/organizer';

const OrganizerDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token, profileComplete } = useSelector((state) => state.organizer);
  const { setIsLoading } = useLoader();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    bio: '',
    phone: '',
    website: '',
    location: '',
    expertise: [],
    socials: [],
    certifications: [],
    testimonials: [],
    isPrivate: false,
  });

  const [currentExpertise, setCurrentExpertise] = useState('');
  const [currentCertification, setCurrentCertification] = useState('');
  const [currentSocial, setCurrentSocial] = useState('');
  const [socialPlatform, setSocialPlatform] = useState('other');

  useEffect(() => {
    setIsLoading(loading || submitting);
    return () => setIsLoading(false);
  }, [loading, submitting, setIsLoading]);

  const getOrganizerId = () => {
    if (!user) return null;

    if (typeof user === 'string') {
      try {
        const parsed = JSON.parse(user);
        return parsed?._id || parsed?.id || parsed?._doc?._id;
      } catch (e) {
        console.error('Error parsing organizer data:', e);
        return null;
      }
    }

    return user?._id || user?.id || user?._doc?._id;
  };

  const organizerId = getOrganizerId();

  // Check if profile is already complete and redirect to dashboard
  useEffect(() => {
    if (profileComplete && organizerId) {
      toast.info('Your profile is already complete.');
      navigate('/organizer/dashboard');
    }
  }, [profileComplete, organizerId, navigate]);

  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addExpertise = () => {
    if (!currentExpertise.trim()) return;

    setFormData(prev => ({
      ...prev,
      expertise: [...prev.expertise, currentExpertise.trim()]
    }));
    setCurrentExpertise('');
  };

  const removeExpertise = (index) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.filter((_, i) => i !== index)
    }));
  };

  const addCertification = () => {
    if (!currentCertification.trim()) return;

    setFormData(prev => ({
      ...prev,
      certifications: [...prev.certifications, currentCertification.trim()]
    }));
    setCurrentCertification('');
  };

  const removeCertification = (index) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const addSocial = () => {
    if (!currentSocial.trim()) return;

    let socialUrl = currentSocial.trim();
    if (!socialUrl.startsWith('http://') && !socialUrl.startsWith('https://')) {
      socialUrl = 'https://' + socialUrl;
    }

    setFormData(prev => ({
      ...prev,
      socials: [...prev.socials, socialUrl]
    }));
    setCurrentSocial('');
    setSocialPlatform('other');
  };

  const removeSocial = (index) => {
    setFormData(prev => ({
      ...prev,
      socials: prev.socials.filter((_, i) => i !== index)
    }));
  };

  const handleTestimonialChange = (index, field, value) => {
    const updatedTestimonials = [...formData.testimonials];

    if (!updatedTestimonials[index]) {
      updatedTestimonials[index] = { name: '', position: '', comment: '', rating: 5 };
    }

    updatedTestimonials[index][field] = field === 'rating' ? parseInt(value) : value;

    setFormData(prev => ({ ...prev, testimonials: updatedTestimonials }));
  };

  const addTestimonial = () => {
    setFormData(prev => ({
      ...prev,
      testimonials: [...prev.testimonials, { name: '', position: '', comment: '', rating: 5 }]
    }));
  };

  const removeTestimonial = (index) => {
    const updatedTestimonials = [...formData.testimonials];
    updatedTestimonials.splice(index, 1);
    setFormData(prev => ({ ...prev, testimonials: updatedTestimonials }));
  };

  const getSocialIcon = (platform) => {
    switch (platform) {
      case 'twitter': return <Twitter size={18} />;
      case 'linkedin': return <Linkedin size={18} />;
      case 'instagram': return <Instagram size={18} />;
      case 'facebook': return <Facebook size={18} />;
      default: return <Globe size={18} />;
    }
  };

  const detectPlatform = (url) => {
    if (url.includes('twitter') || url.includes('x.com')) return 'twitter';
    if (url.includes('linkedin')) return 'linkedin';
    if (url.includes('instagram')) return 'instagram';
    if (url.includes('facebook')) return 'facebook';
    return 'other';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validate required fields
      if (!formData.bio || !formData.phone || !formData.location) {
        toast.error('Please fill in all required fields');
        setSubmitting(false);
        return;
      }

      const apiUrl = import.meta.env.VITE_API_URL;
      const cleanToken = safelyParseToken(token);

      if (!cleanToken || !organizerId) {
        toast.error('Authentication failed. Please log in again.');
        setSubmitting(false);
        return;
      }

      const response = await axios.post(
        `${apiUrl}/organizer/${organizerId}/details`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${cleanToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        // Mark profile as complete in Redux store
        dispatch(setProfileComplete(true));

        toast.success('Profile details saved successfully!');
        navigate('/organizer/dashboard');
      } else {
        throw new Error(response.data.message || 'Failed to save profile details');
      }
    } catch (error) {
      console.error('Error saving profile details:', error);
      toast.error(error.response?.data?.message || 'Failed to save profile details');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        <div className="w-12 h-12 border-4 border-t-cyan-500 border-cyan-500/30 rounded-full animate-spin"></div>
        <span className="ml-3">Loading your profile...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2 text-center">Complete Your Organizer Profile</h1>
          <p className="text-gray-400 text-center mb-8">
            Fill in the details below so event attendees can learn more about you and your events.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          onSubmit={handleSubmit}
          className="bg-gray-900 rounded-lg p-6 border border-gray-800"
        >
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Position/Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              placeholder="Your job title or position"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Bio/Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              required
              rows={4}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              placeholder="Tell attendees about yourself"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                placeholder="Your contact number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              placeholder="City, Country"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Areas of Expertise
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={currentExpertise}
                onChange={(e) => setCurrentExpertise(e.target.value)}
                className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                placeholder="Add an area of expertise"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExpertise())}
              />
              <button
                type="button"
                onClick={addExpertise}
                className="px-3 py-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-600 transition-colors flex items-center"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.expertise.map((item, index) => (
                <div key={index} className="flex items-center bg-cyan-900/30 px-3 py-1 rounded-full">
                  <span className="text-cyan-100 mr-2">{item}</span>
                  <button
                    type="button"
                    onClick={() => removeExpertise(index)}
                    className="text-cyan-300 hover:text-red-400 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {formData.expertise.length === 0 && (
                <span className="text-gray-500 text-sm italic">No expertise areas added yet</span>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Certifications
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={currentCertification}
                onChange={(e) => setCurrentCertification(e.target.value)}
                className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                placeholder="Add a certification"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
              />
              <button
                type="button"
                onClick={addCertification}
                className="px-3 py-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-600 transition-colors flex items-center"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.certifications.map((item, index) => (
                <div key={index} className="flex items-center bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
                  <span className="text-gray-200 mr-2">{item}</span>
                  <button
                    type="button"
                    onClick={() => removeCertification(index)}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {formData.certifications.length === 0 && (
                <span className="text-gray-500 text-sm italic">No certifications added yet</span>
              )}
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Social Media Links
            </label>

            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-4">
              <div className="flex flex-col sm:flex-row gap-3 mb-3">
                <div className="sm:w-1/4">
                  <select
                    value={socialPlatform}
                    onChange={(e) => setSocialPlatform(e.target.value)}
                    className="w-full p-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="twitter">Twitter/X</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={currentSocial}
                    onChange={(e) => setCurrentSocial(e.target.value)}
                    className="flex-1 p-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                    placeholder="https://platform.com/username"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSocial())}
                  />
                  <button
                    type="button"
                    onClick={addSocial}
                    className="px-3 py-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-600 transition-colors flex items-center"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                {formData.socials.map((url, index) => {
                  const platform = detectPlatform(url);
                  return (
                    <div
                      key={index}
                      className="group flex items-center bg-gray-900 pl-2 pr-3 py-1.5 rounded-full hover:bg-gray-700 transition-colors"
                    >
                      <span className="flex items-center text-cyan-400 mr-2">
                        {getSocialIcon(platform)}
                      </span>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 mr-2 group-hover:text-white transition-colors"
                      >
                        {url.replace(/(https?:\/\/)?(www\.)?/i, '').substring(0, 20)}
                        {url.replace(/(https?:\/\/)?(www\.)?/i, '').length > 20 ? '...' : ''}
                      </a>
                      <button
                        type="button"
                        onClick={() => removeSocial(index)}
                        className="text-gray-500 hover:text-red-400 transition-colors ml-1"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  );
                })}
                {formData.socials.length === 0 && (
                  <span className="text-gray-500 text-sm italic">No social links added yet</span>
                )}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-200 mb-3">Testimonials</h3>
            <p className="text-gray-400 text-sm mb-4">Add testimonials from clients or colleagues</p>

            {formData.testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg mb-4 border border-gray-700">
                <div className="flex justify-between mb-2">
                  <h4 className="font-medium">Testimonial #{index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeTestimonial(index)}
                    className="text-red-400 hover:text-red-500"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Name</label>
                    <input
                      type="text"
                      value={testimonial.name || ''}
                      onChange={(e) => handleTestimonialChange(index, 'name', e.target.value)}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                      placeholder="Client name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Position</label>
                    <input
                      type="text"
                      value={testimonial.position || ''}
                      onChange={(e) => handleTestimonialChange(index, 'position', e.target.value)}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                      placeholder="Client position"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs text-gray-400 mb-1">Comment</label>
                  <textarea
                    value={testimonial.comment || ''}
                    onChange={(e) => handleTestimonialChange(index, 'comment', e.target.value)}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                    rows={2}
                    placeholder="Their testimonial comment"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Rating (1-5)</label>
                  <select
                    value={testimonial.rating || 5}
                    onChange={(e) => handleTestimonialChange(index, 'rating', e.target.value)}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Fair</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addTestimonial}
              className="px-4 py-2 border border-cyan-500 text-cyan-500 rounded-lg hover:bg-cyan-500 hover:text-black transition-colors"
            >
              + Add Testimonial
            </button>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className={`px-6 py-3 rounded-xl bg-gradient-to-r bg-cyan-400 text-black font-medium transition-colors cursor-pointer flex items-center space-x-2 hover:bg-black hover:text-cyan-400 hover:border hover:border-cyan-400
          ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save & Continue'
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default OrganizerDetails;