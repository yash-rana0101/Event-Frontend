import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, MapPin, Camera } from 'lucide-react';

const ProfileEditor = ({ user }) => {
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedLocation, setEditedLocation] = useState(user?.location || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate(`/user/${user.id}`);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      // Replace with your actual API call
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editedName,
          location: editedLocation
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      navigate(`/user/${user.id}`);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Could not save profile changes');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative bg-black text-white rounded-xl overflow-hidden">
      {/* Background with gradient effect */}
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-r from-cyan-500/30 to-black"></div>

      <div className="relative pt-6 px-4 md:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Edit Profile</h1>
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 px-4 py-2 bg-black/70 backdrop-blur-sm text-red-500 border border-red-500 rounded-lg hover:bg-red-500 hover:text-black transition font-medium"
              disabled={saving}
            >
              <X size={16} /> Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-4 py-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 transition font-medium"
              disabled={saving}
            >
              <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-500 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8 pt-10">
          {/* Avatar editor */}
          <div className="relative mb-4 md:mb-0">
            <div className="group relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-300 blur-sm opacity-70 group-hover:opacity-100 group-hover:animate-pulse transition"></div>

              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-cyan-500 to-black flex items-center justify-center text-black text-3xl font-bold border-2 border-black relative z-10">
                {editedName?.split(' ').map(n => n[0]).join('') || '?'}
              </div>

              <button className="absolute bottom-0 right-0 bg-black text-cyan-500 rounded-full p-2 shadow-lg border border-cyan-500 hover:bg-cyan-500 hover:text-black transition z-10">
                <Camera size={14} />
              </button>
            </div>
          </div>

          {/* Edit form */}
          <div className="flex-1 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm text-gray-400 mb-1">Display Name</label>
              <input
                id="name"
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 w-full max-w-sm focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm text-gray-400 mb-1">Location</label>
              <div className="flex items-center">
                <MapPin size={16} className="mr-1 text-cyan-500" />
                <input
                  id="location"
                  type="text"
                  value={editedLocation}
                  onChange={(e) => setEditedLocation(e.target.value)}
                  placeholder="Add your location"
                  className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 w-full max-w-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom decorative element */}
        <div className="h-1 w-full bg-gradient-to-r from-cyan-500 to-transparent mt-6"></div>
      </div>
    </div>
  );
};

export default ProfileEditor;
