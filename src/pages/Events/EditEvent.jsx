/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Users, Clock, Tag, Image, DollarSign, Calendar as CalendarIcon, Clock as ClockIcon, Save, Trash2, Plus, X, Info, ChevronDown, ArrowLeft, Trophy, Briefcase, AlertCircle } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DeletePopUp from "../../components/UI/DeletePopUp";
import { FaArrowLeft } from "react-icons/fa";
import Error from "../common/Error";
import EventSkeleton from "../../components/UI/Skeleton";

export default function EditEvent() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    tagline: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(),
    registrationDeadline: new Date(),
    location: {
      address: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
    },
    capacity: 0,
    isPaid: false,
    price: 0,
    currency: "USD",
    tags: [],
    timeline: [],
    prizes: [],
    faqs: [],
    sponsors: [],
    featured: false,
  });

  // New tag input
  const [newTag, setNewTag] = useState("");

  // Timeline item state
  const [newTimelineItem, setNewTimelineItem] = useState({
    time: "",
    event: ""
  });

  // Prize item state
  const [newPrize, setNewPrize] = useState({
    place: "",
    amount: "",
    description: ""
  });

  // FAQ item state
  const [newFaq, setNewFaq] = useState({
    question: "",
    answer: ""
  });

  // Sponsor item state
  const [newSponsor, setNewSponsor] = useState({
    name: "",
    logo: "",
    tier: "silver"
  });

  // Get user token from Redux
  const userToken = useSelector(state => state.auth?.token);
  const organizerToken = useSelector(state => state.organizer?.token);
  const organizer = useSelector(state => state.organizer?.user);

  // Use organizer token if auth token is null/undefined
  const authToken = userToken === "null" || !userToken ? organizerToken?.replace(/"/g, "") : userToken;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else if (type === "checkbox") {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle date changes
  const handleDateChange = (date, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: date
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // In a real implementation, you would upload the file to your server
      // and update the formData with the URL.
    }
  };

  // Add tag
  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }));
      setNewTag("");
    }
  };

  // Remove tag
  const removeTag = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, index) => index !== indexToRemove)
    }));
  };

  // Add timeline item
  const addTimelineItem = () => {
    if (newTimelineItem.time && newTimelineItem.event) {
      setFormData(prev => ({
        ...prev,
        timeline: [...prev.timeline, { ...newTimelineItem }]
      }));
      setNewTimelineItem({ time: "", event: "" });
    }
  };

  // Remove timeline item
  const removeTimelineItem = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      timeline: prev.timeline.filter((_, index) => index !== indexToRemove)
    }));
  };

  // Add prize
  const addPrize = () => {
    if (newPrize.place && newPrize.amount) {
      setFormData(prev => ({
        ...prev,
        prizes: [...prev.prizes, { ...newPrize }]
      }));
      setNewPrize({ place: "", amount: "", description: "" });
    }
  };

  // Remove prize
  const removePrize = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      prizes: prev.prizes.filter((_, index) => index !== indexToRemove)
    }));
  };

  // Add FAQ
  const addFaq = () => {
    if (newFaq.question && newFaq.answer) {
      setFormData(prev => ({
        ...prev,
        faqs: [...prev.faqs, { ...newFaq }]
      }));
      setNewFaq({ question: "", answer: "" });
    }
  };

  // Remove FAQ
  const removeFaq = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, index) => index !== indexToRemove)
    }));
  };

  // Add sponsor
  const addSponsor = () => {
    if (newSponsor.name && newSponsor.logo) {
      setFormData(prev => ({
        ...prev,
        sponsors: [...prev.sponsors, { ...newSponsor }]
      }));
      setNewSponsor({ name: "", logo: "", tier: "silver" });
    }
  };

  // Remove sponsor
  const removeSponsor = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      sponsors: prev.sponsors.filter((_, index) => index !== indexToRemove)
    }));
  };

  // Function to fetch event details
  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!eventId) {
        throw new Error("Event ID is missing.");
      }

      if (!authToken) {
        throw new Error("Authentication token is missing. Please login again.");
      }

      const apiUrl = import.meta.env.VITE_API_URL;

      // Make sure to include the token in the request
      const response = await axios.get(
        `${apiUrl}/events/${eventId}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      const eventData = response.data;
      setEvent(eventData);

      // Format the data for the form
      setFormData({
        title: eventData.title || "",
        tagline: eventData.tagline || "",
        description: eventData.description || "",
        startDate: eventData.startDate ? new Date(eventData.startDate) : new Date(),
        endDate: eventData.endDate ? new Date(eventData.endDate) : new Date(),
        registrationDeadline: eventData.registrationDeadline ? new Date(eventData.registrationDeadline) : new Date(),
        location: {
          address: eventData.location?.address || "",
          city: eventData.location?.city || "",
          state: eventData.location?.state || "",
          country: eventData.location?.country || "",
          zipCode: eventData.location?.zipCode || "",
        },
        capacity: eventData.capacity || 0,
        isPaid: eventData.isPaid || false,
        price: eventData.price || 0,
        currency: eventData.currency || "USD",
        tags: eventData.tags || [],
        timeline: eventData.timeline || [],
        prizes: eventData.prizes || [],
        faqs: eventData.faqs || [],
        sponsors: eventData.sponsors || [],
        featured: eventData.featured || false,
      });

      // Set image preview if available
      if (eventData.images && eventData.images.length > 0) {
        setImagePreview(eventData.images[0]);
      }

    } catch (err) {
      console.error("Error fetching event details:", err);
      const errorMessage = err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to load event details";

      // Handle unauthorized error specifically
      if (err.response?.status === 401) {
        setError("Your session has expired. Please login again.");
        toast.error("Authentication failed. Please login again.");
      } else {
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // Call fetchEventDetails when component mounts or eventId changes
  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      if (!authToken) {
        throw new Error("Authentication token is missing. Please login again.");
      }

      const apiUrl = import.meta.env.VITE_API_URL;

      // Make the update request with the correct token
      await axios.put(
        `${apiUrl}/events/${eventId}`,
        formData,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      toast.success("Event updated successfully!");
      navigate(`/event/${eventId}`);

    } catch (err) {
      console.error("Error updating event:", err);
      const errorMessage = err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to update event";

      // Handle unauthorized error specifically
      if (err.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle event deletion
  const handleDelete = () => {
    setShowDeletePopup(true);
  };

  // Function to actually delete the event after confirmation
  const deleteEvent = async () => {
    try {
      setIsDeleting(true);

      if (!authToken) {
        throw new Error("Authentication token is missing. Please login again.");
      }

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

      await axios.delete(
        `${apiUrl}/events/${eventId}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      toast.success("Event deleted successfully!");
      navigate(-1);

    } catch (err) {
      console.error("Error deleting event:", err);
      const errorMessage = err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to delete event";

      // Handle unauthorized error specifically
      if (err.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsDeleting(false);
      setShowDeletePopup(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <EventSkeleton type="list" />
    );
  }

  // Show error state
  if (error) {
    return (
      <Error message={error} onRetry={fetchEventDetails} />
    );
  }

  return (
    <div className="min-h-screen  text-white pb-16">
      {/* Delete Popup */}
      <DeletePopUp
        isOpen={showDeletePopup}
        onClose={() => setShowDeletePopup(false)}
        deleteProject={deleteEvent}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className=" border-b border-gray-700 py-6"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-4">
              <div className="flex items-start justify-start">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 rounded-full border border-cyan-500 text-cyan-500 hover:bg-cyan-900/30 transition-colors hover:cursor-pointer"
                >
                  <FaArrowLeft size={20} />
                </button>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Edit Event</h1>
                <p className="text-gray-400 mt-1">Manage all your events in one place</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center px-4 py-2 bg-red-600/20 text-red-500 hover:bg-red-600/30 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Trash2 size={18} className="mr-2" />
                {isDeleting ? "Deleting..." : "Delete Event"}
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center px-6 py-2 rounded-xl bg-gradient-to-r bg-cyan-400 text-black font-medium transition-colors cursor-pointer space-x-2 hover:bg-black hover:text-cyan-400 hover:border hover:border-cyan-400 disabled:opacity-50"
              >
                <Save size={18} className="mr-2" />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit}>
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto scrollbar-hide">
            <button
              type="button"
              onClick={() => setActiveTab("basic")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${activeTab === "basic"
                ? "bg-cyan-400 text-gray-900"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Basic Info
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("details")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${activeTab === "details"
                ? "bg-cyan-400 text-gray-900"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Details
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("timeline")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${activeTab === "timeline"
                ? "bg-cyan-400 text-gray-900"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Timeline
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("prizes")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${activeTab === "prizes"
                ? "bg-cyan-400 text-gray-900"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Prizes
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("sponsors")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${activeTab === "sponsors"
                ? "bg-cyan-400 text-gray-900"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Sponsors
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("faqs")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${activeTab === "faqs"
                ? "bg-cyan-400 text-gray-900"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              FAQs
            </button>
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Basic Info Tab */}
            {activeTab === "basic" && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                {/* Event Cover Image */}
                <motion.div variants={itemVariants} className="lg:col-span-1">
                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 h-full">
                    <h2 className="text-xl font-semibold mb-4">Cover Image</h2>

                    <div className="aspect-video bg-gray-700 rounded-lg overflow-hidden mb-4 relative">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Event Cover"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Image size={48} />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                      <label className="absolute bottom-4 left-0 right-0 mx-auto w-max cursor-pointer">
                        <span className="inline-block px-4 py-2 bg-cyan-400 text-gray-900 rounded-lg font-medium text-sm hover:bg-cyan-500 transition-colors">
                          {imagePreview ? "Change Image" : "Upload Image"}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>

                    <p className="text-sm text-gray-400">
                      Recommended size: 1200×600 pixels. Max file size: 5MB.
                    </p>
                  </div>
                </motion.div>

                {/* Event Basic Details */}
                <motion.div variants={itemVariants} className="lg:col-span-2">
                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h2 className="text-xl font-semibold mb-4">Event Information</h2>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-300 mb-2">
                          Event Title <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          required
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                          placeholder="Enter the event title"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 mb-2">
                          Tagline
                        </label>
                        <input
                          type="text"
                          name="tagline"
                          value={formData.tagline}
                          onChange={handleChange}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                          placeholder="A short catchy phrase for your event"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 mb-2">
                          Description <span className="text-red-400">*</span>
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          required
                          rows="6"
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                          placeholder="Describe your event in detail"
                        ></textarea>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="featured"
                          name="featured"
                          checked={formData.featured}
                          onChange={handleChange}
                          className="h-5 w-5 rounded border-gray-600 bg-gray-700 text-cyan-400 focus:ring-cyan-400"
                        />
                        <label htmlFor="featured" className="ml-2 block text-gray-300">
                          Feature this event (shows on homepage)
                        </label>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Tags */}
                <motion.div variants={itemVariants} className="lg:col-span-3">
                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h2 className="text-xl font-semibold mb-4">Event Tags</h2>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="group bg-gray-700 border border-gray-600 rounded-full px-3 py-1 text-sm flex items-center"
                        >
                          #{tag}
                          <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="ml-2 text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        className="flex-1 bg-gray-700 border border-gray-600 rounded-l-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                        placeholder="Add a tag (e.g. hackathon, workshop)"
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="bg-cyan-400 text-gray-900 rounded-r-lg px-4 py-2 font-medium hover:bg-cyan-500 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    <p className="mt-2 text-sm text-gray-400">
                      Tags help attendees find your event. Add relevant keywords.
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Details Tab */}
            {activeTab === "details" && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {/* Date & Time */}
                <motion.div variants={itemVariants}>
                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h2 className="text-xl font-semibold mb-4">Date & Time</h2>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-300 mb-2">
                          Start Date & Time <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <DatePicker
                            selected={formData.startDate}
                            onChange={(date) => handleDateChange(date, "startDate")}
                            showTimeSelect
                            dateFormat="MMMM d, yyyy h:mm aa"
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                          />
                          <CalendarIcon size={18} className="absolute right-4 top-3.5 text-gray-400" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-300 mb-2">
                          End Date & Time <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <DatePicker
                            selected={formData.endDate}
                            onChange={(date) => handleDateChange(date, "endDate")}
                            showTimeSelect
                            dateFormat="MMMM d, yyyy h:mm aa"
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                          />
                          <CalendarIcon size={18} className="absolute right-4 top-3.5 text-gray-400" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-300 mb-2">
                          Registration Deadline
                        </label>
                        <div className="relative">
                          <DatePicker
                            selected={formData.registrationDeadline}
                            onChange={(date) => handleDateChange(date, "registrationDeadline")}
                            showTimeSelect
                            dateFormat="MMMM d, yyyy h:mm aa"
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                          />
                          <ClockIcon size={18} className="absolute right-4 top-3.5 text-gray-400" />
                        </div>
                      </div>
                    </div>

                  </div>
                </motion.div>

                {/* Location */}
                <motion.div variants={itemVariants}>
                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h2 className="text-xl font-semibold mb-4">Location</h2>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-300 mb-2">
                          Address <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="location.address"
                          value={formData.location.address}
                          onChange={handleChange}
                          required
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                          placeholder="Street address or venue name"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-300 mb-2">
                            City <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            name="location.city"
                            value={formData.location.city}
                            onChange={handleChange}
                            required
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                            placeholder="City"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 mb-2">
                            State <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            name="location.state"
                            value={formData.location.state}
                            onChange={handleChange}
                            required
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                            placeholder="State/Province"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 mb-2">
                            Country <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            name="location.country"
                            value={formData.location.country}
                            onChange={handleChange}
                            required
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                            placeholder="Country"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 mb-2">
                            Zip Code <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            name="location.zipCode"
                            value={formData.location.zipCode}
                            onChange={handleChange}
                            required
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                            placeholder="Postal/Zip code"
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                </motion.div>

                {/* Capacity & Pricing */}
                <motion.div variants={itemVariants} className="lg:col-span-2">
                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h2 className="text-xl font-semibold mb-4">Capacity & Pricing</h2>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-300 mb-2">
                          Capacity (max attendees)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleChange}
                            min="0"
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                            placeholder="Maximum number of attendees"
                          />
                          <Users size={18} className="absolute right-4 top-3.5 text-gray-400" />
                        </div>
                        <p className="mt-1 text-sm text-gray-400">
                          Leave at 0 for unlimited capacity
                        </p>
                      </div>

                      <div className="flex items-center mb-4">
                        <input
                          type="checkbox"
                          id="isPaid"
                          name="isPaid"
                          checked={formData.isPaid}
                          onChange={handleChange}
                          className="h-5 w-5 rounded border-gray-600 bg-gray-700 text-cyan-400 focus:ring-cyan-400"
                        />
                        <label htmlFor="isPaid" className="ml-2 block text-gray-300">
                          This is a paid event
                        </label>
                      </div>

                      {formData.isPaid && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-300 mb-2">
                              Price <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required={formData.isPaid}
                                min="0"
                                step="0.01"
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 pl-8 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                                placeholder="0.00"
                              />
                              <DollarSign size={16} className="absolute left-3 top-4 text-gray-400" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-gray-300 mb-2">
                              Currency <span className="text-red-400">*</span>
                            </label>
                            <select
                              name="currency"
                              value={formData.currency}
                              onChange={handleChange}
                              required={formData.isPaid}
                              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                            >
                              <option value="USD">USD - US Dollar</option>
                              <option value="EUR">EUR - Euro</option>
                              <option value="GBP">GBP - British Pound</option>
                              <option value="CAD">CAD - Canadian Dollar</option>
                              <option value="AUD">AUD - Australian Dollar</option>
                              <option value="JPY">JPY - Japanese Yen</option>
                              <option value="INR">INR - Indian Rupee</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Timeline Tab */}
            {activeTab === "timeline" && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants} className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Event Timeline</h2>
                  <p className="text-gray-400 mb-6">
                    Add important milestones and activities that will take place during your event.
                  </p>

                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-1">
                        <label className="block text-gray-300 mb-2">
                          Time <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={newTimelineItem.time}
                          onChange={(e) => setNewTimelineItem({ ...newTimelineItem, time: e.target.value })}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                          placeholder="e.g. 9:00 AM"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-gray-300 mb-2">
                          Activity <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={newTimelineItem.event}
                          onChange={(e) => setNewTimelineItem({ ...newTimelineItem, event: e.target.value })}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                          placeholder="e.g. Registration & Check-in"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={addTimelineItem}
                        disabled={!newTimelineItem.time || !newTimelineItem.event}
                        className="inline-flex items-center px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-gray-900 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:pointer-events-none"
                      >
                        <Plus size={18} className="mr-2" />
                        Add to Timeline
                      </button>
                    </div>
                  </div>

                  {formData.timeline.length > 0 ? (
                    <div className="relative border-l-2 border-gray-700 pl-6 ml-3 space-y-6">
                      {formData.timeline.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="relative bg-gray-700 rounded-lg p-4 pr-12"
                        >
                          <div className="absolute w-3 h-3 bg-cyan-400 rounded-full left-[-2.35rem] top-5"></div>
                          <p className="font-semibold text-cyan-400">{item.time}</p>
                          <p className="text-white mt-1">{item.event}</p>
                          <button
                            type="button"
                            onClick={() => removeTimelineItem(index)}
                            className="absolute top-4 right-3 text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <X size={18} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border border-dashed border-gray-700 rounded-lg">
                      <Clock size={36} className="mx-auto text-gray-500 mb-3" />
                      <p className="text-gray-400">No timeline events added yet</p>
                      <p className="text-sm text-gray-500">Add activities to create your event schedule</p>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}

            {/* Prizes Tab */}
            {activeTab === "prizes" && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants} className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Event Prizes</h2>
                  <p className="text-gray-400 mb-6">
                    Add prizes and rewards for your event participants.
                  </p>

                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-gray-300 mb-2">
                          Place/Position <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={newPrize.place}
                          onChange={(e) => setNewPrize({ ...newPrize, place: e.target.value })}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                          placeholder="e.g. 1st Place, Runner-up"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">
                          Amount/Reward <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={newPrize.amount}
                          onChange={(e) => setNewPrize({ ...newPrize, amount: e.target.value })}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                          placeholder="e.g. $1000, Gaming PC"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">
                          Description
                        </label>
                        <input
                          type="text"
                          value={newPrize.description}
                          onChange={(e) => setNewPrize({ ...newPrize, description: e.target.value })}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                          placeholder="Additional details (optional)"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={addPrize}
                        disabled={!newPrize.place || !newPrize.amount}
                        className="inline-flex items-center px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-gray-900 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:pointer-events-none"
                      >
                        <Plus size={18} className="mr-2" />
                        Add Prize
                      </button>
                    </div>
                  </div>

                  {formData.prizes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {formData.prizes.map((prize, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative bg-gray-700 rounded-lg p-4 pr-10"
                        >
                          <div className="flex items-start mb-2">
                            <div className="w-10 h-10 flex items-center justify-center bg-yellow-400/20 text-yellow-400 rounded-full mr-3">
                              <Trophy size={18} />
                            </div>
                            <div>
                              <h3 className="font-medium text-white">{prize.place}</h3>
                              <p className="text-cyan-400 font-semibold">{prize.amount}</p>
                            </div>
                          </div>
                          {prize.description && (
                            <p className="text-sm text-gray-300 mt-2">{prize.description}</p>
                          )}
                          <button
                            type="button"
                            onClick={() => removePrize(index)}
                            className="absolute top-3 right-2 text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <X size={18} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border border-dashed border-gray-700 rounded-lg">
                      <Trophy size={36} className="mx-auto text-gray-500 mb-3" />
                      <p className="text-gray-400">No prizes added yet</p>
                      <p className="text-sm text-gray-500">Add prizes to motivate participants</p>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}

            {/* Sponsors Tab */}
            {activeTab === "sponsors" && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants} className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Event Sponsors</h2>
                  <p className="text-gray-400 mb-6">
                    Add companies or organizations that are sponsoring your event.
                  </p>

                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-gray-300 mb-2">
                          Sponsor Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={newSponsor.name}
                          onChange={(e) => setNewSponsor({ ...newSponsor, name: e.target.value })}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                          placeholder="Company/Organization name"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">
                          Logo URL <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={newSponsor.logo}
                          onChange={(e) => setNewSponsor({ ...newSponsor, logo: e.target.value })}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                          placeholder="https://example.com/logo.png"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">
                          Sponsor Tier
                        </label>
                        <select
                          value={newSponsor.tier}
                          onChange={(e) => setNewSponsor({ ...newSponsor, tier: e.target.value })}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                        >
                          <option value="platinum">Platinum</option>
                          <option value="gold">Gold</option>
                          <option value="silver">Silver</option>
                          <option value="bronze">Bronze</option>
                          <option value="partner">Partner</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={addSponsor}
                        disabled={!newSponsor.name || !newSponsor.logo}
                        className="inline-flex items-center px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-gray-900 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:pointer-events-none"
                      >
                        <Plus size={18} className="mr-2" />
                        Add Sponsor
                      </button>
                    </div>
                  </div>

                  {formData.sponsors.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {formData.sponsors.map((sponsor, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative bg-gray-700 rounded-lg p-4 overflow-hidden"
                        >
                          <div className={`absolute top-0 right-0 w-24 text-center text-xs font-semibold py-1 
                            ${sponsor.tier === 'platinum' ? 'bg-purple-400/20 text-purple-300' :
                              sponsor.tier === 'gold' ? 'bg-yellow-400/20 text-yellow-300' :
                                sponsor.tier === 'silver' ? 'bg-gray-400/20 text-gray-300' :
                                  sponsor.tier === 'bronze' ? 'bg-amber-700/20 text-amber-600' :
                                    'bg-blue-400/20 text-blue-300'}`
                          }>
                            {sponsor.tier.charAt(0).toUpperCase() + sponsor.tier.slice(1)}
                          </div>

                          <div className="h-16 w-full flex items-center justify-center mb-3 mt-1">
                            <img
                              src={sponsor.logo}
                              alt={`${sponsor.name} logo`}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>

                          <p className="text-center text-white font-medium truncate">{sponsor.name}</p>

                          <button
                            type="button"
                            onClick={() => removeSponsor(index)}
                            className="absolute bottom-3 right-3 bg-gray-800/50 rounded-full p-1 text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border border-dashed border-gray-700 rounded-lg">
                      <Briefcase size={36} className="mx-auto text-gray-500 mb-3" />
                      <p className="text-gray-400">No sponsors added yet</p>
                      <p className="text-sm text-gray-500">Add companies or organizations supporting your event</p>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}

            {/* FAQs Tab */}
            {activeTab === "faqs" && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants} className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
                  <p className="text-gray-400 mb-6">
                    Add common questions and answers about your event to help attendees.
                  </p>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-gray-300 mb-2">
                        Question <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={newFaq.question}
                        onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                        placeholder="e.g. What should I bring to the event?"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2">
                        Answer <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        value={newFaq.answer}
                        onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                        rows="3"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                        placeholder="Provide a clear and helpful answer"
                      ></textarea>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={addFaq}
                        disabled={!newFaq.question || !newFaq.answer}
                        className="inline-flex items-center px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-gray-900 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:pointer-events-none"
                      >
                        <Plus size={18} className="mr-2" />
                        Add FAQ
                      </button>
                    </div>
                  </div>

                  {formData.faqs.length > 0 ? (
                    <div className="space-y-4">
                      {formData.faqs.map((faq, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="relative bg-gray-700 rounded-lg p-4 pr-10"
                        >
                          <h3 className="text-white font-medium mb-2">{faq.question}</h3>
                          <p className="text-gray-300 text-sm">{faq.answer}</p>
                          <button
                            type="button"
                            onClick={() => removeFaq(index)}
                            className="absolute top-4 right-3 text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <X size={18} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border border-dashed border-gray-700 rounded-lg">
                      <Info size={36} className="mx-auto text-gray-500 mb-3" />
                      <p className="text-gray-400">No FAQs added yet</p>
                      <p className="text-sm text-gray-500">Add common questions to help your attendees</p>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </motion.div>

          {/* Form Actions */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-gray-300 font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-6 py-2 rounded-xl bg-gradient-to-r bg-cyan-400 text-black font-medium transition-colors cursor-pointer space-x-2 hover:bg-black hover:text-cyan-400 hover:border hover:border-cyan-400 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-900 mr-2"></span>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} className="inline-block mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
