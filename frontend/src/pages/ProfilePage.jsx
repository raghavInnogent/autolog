import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { vehiclesAPI } from '../services/api';
import EditProfileModal from '../components/EditProfileModal';
import './ProfilePage.css';
import Footer from '../components/Footer';
import { FaCar, FaEnvelope, FaPhone, FaMapMarkerAlt, FaUserEdit, FaCamera } from 'react-icons/fa';

export default function ProfilePage() {
  const { user } = useAuth(); // Assuming useAuth provides the current user
  const [vehicles, setVehicles] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Local state to show immediate updates before a real backend refresh might happen
  // In a real app, useAuth or a global context would handle the update
  const [displayUser, setDisplayUser] = useState(null);

  useEffect(() => {
    if (user) {
      setDisplayUser(user);
    }
  }, [user]);

  useEffect(() => {
    vehiclesAPI.getAll()
      .then(res => setVehicles(res.data || []))
      .catch((err) => console.error("Failed to fetch vehicles", err));
  }, []);

  const handleUpdateProfile = async (updatedData) => {
    console.log("Updating profile with data:", updatedData);

    // Simulate API call
    // const response = await usersAPI.updateProfile(updatedData);

    // Update local state to reflect changes immediately for the demo
    setDisplayUser(prev => ({
      ...prev,
      name: updatedData.name,
      email: updatedData.email,
      phoneNumber: updatedData.phoneNumber,
      // creating a fake URL for the file if present, just for preview
      profilePhoto: updatedData.file ? URL.createObjectURL(updatedData.file) : prev.profilePhoto
    }));

    alert("Profile updated successfully! (Backend integration pending)");
  };

  if (!displayUser) return <div className="loading-state">Loading...</div>;

  return (
    <div className="profile-page-container">
      {/* Hero Section */}
      <div className="profile-hero"></div>

      <div className="profile-content-wrapper">
        <div className="profile-main-card">

          {/* Header */}
          <div className="profile-header-section">
            <button
              className="edit-profile-btn"
              onClick={() => setIsEditModalOpen(true)}
            >
              <FaUserEdit /> Edit Profile
            </button>

            <div className="profile-avatar-container">
              {displayUser.profilePhoto ? (
                <img src={displayUser.profilePhoto} alt="Profile" className="profile-avatar" />
              ) : (
                <div className="profile-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: '#94a3b8' }}>
                  {displayUser.name ? displayUser.name.charAt(0).toUpperCase() : <FaCamera />}
                </div>
              )}
            </div>

            <h1 className="profile-name">{displayUser.name || 'User Name'}</h1>
            <p className="profile-role">Vehicle Owner</p>
          </div>

          {/* Stats Grid */}
          <div className="profile-stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <FaCar />
              </div>
              <div className="stat-info">
                <h3>Total Vehicles</h3>
                <p>{vehicles.length}</p>
              </div>
            </div>
            {/* Add more stats if needed, e.g. Total Services */}
          </div>

          {/* Details Section */}
          <div className="profile-details-section">
            <div className="details-grid">

              <div className="detail-group">
                <h3>Contact Information</h3>

                <div className="detail-item">
                  <div className="detail-icon"><FaEnvelope /></div>
                  <div className="detail-content">
                    <label>Email Address</label>
                    <span>{displayUser.email || 'No email provided'}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon"><FaPhone /></div>
                  <div className="detail-content">
                    <label>Phone Number</label>
                    <span>{displayUser.phoneNumber || 'No phone number'}</span>
                  </div>
                </div>
              </div>

              <div className="detail-group">
                <div className="detail-item">
                  <div className="detail-icon"><FaMapMarkerAlt /></div>
                  <div className="detail-content">
                    <label>Location</label>
                    <span>{displayUser.city || 'Not specified'}</span>
                    {/* Assuming city might be in user object or added later */}
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userData={displayUser}
        onSave={handleUpdateProfile}
      />
    </div>
  );
}
