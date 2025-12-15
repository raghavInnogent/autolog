import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { vehiclesAPI } from '../services/api';
import EditProfileModal from '../components/EditProfileModal';
import '../styles/pages/ProfilePage.css';
import { FaCar, FaEnvelope, FaPhone, FaUserCircle, FaEdit, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [displayUser, setDisplayUser] = useState(null);

  useEffect(() => {
    if (user) {
      setDisplayUser(user);
    }
  }, [user]);

  const handleUpdateProfile = async (updatedData) => {
    console.log("Updating profile with data:", updatedData);

    // Update local state to reflect changes immediately
    setDisplayUser(prev => ({
      ...prev,
      name: updatedData.name,
      email: updatedData.email,
      contactNo: updatedData.contactNo,
      image: updatedData.file ? URL.createObjectURL(updatedData.file) : prev.image
    }));

    alert("Profile updated successfully! (Backend integration pending)");
  };

  if (!displayUser) return <div className="loading-state">Loading...</div>;

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE': return 'status-active';
      case 'INACTIVE': return 'status-inactive';
      default: return 'status-pending';
    }
  };

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
              <FaEdit /> Edit Profile
            </button>

            <div className="profile-avatar-container">
              {displayUser.image ? (
                <img src={displayUser.image} alt="Profile" className="profile-avatar" />
              ) : (
                <div className="profile-avatar profile-avatar-placeholder">
                  {displayUser.name ? displayUser.name.charAt(0).toUpperCase() : <FaUserCircle />}
                </div>
              )}
            </div>

            <div className="profile-name-section">
              <h1 className="profile-name">{displayUser.name || 'User Name'}</h1>
              {displayUser.role && (
                <span className="role-badge">{displayUser.role}</span>
              )}
            </div>

            {displayUser.status && (
              <div className={`status-badge ${getStatusColor(displayUser.status)}`}>
                {displayUser.status === 'ACTIVE' ? <FaCheckCircle /> : <FaTimesCircle />}
                {displayUser.status}
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="profile-stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <FaCar />
              </div>
              <div className="stat-info">
                <h3>Total Vehicles</h3>
                <p>{displayUser.totalVehicleCount || 0}</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="profile-details-section">
            <h2 className="section-title">Contact Information</h2>
            <div className="details-grid">

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
                  <label>Contact Number</label>
                  <span>{displayUser.contactNo || 'No contact number'}</span>
                </div>
              </div>

            </div>
          </div>

          {/* Vehicles Section */}
          {displayUser.vehicles && displayUser.vehicles.length > 0 && (
            <div className="profile-vehicles-section">
              <h2 className="section-title">My Vehicles</h2>
              <div className="vehicles-grid">
                {displayUser.vehicles.map((vehicle, index) => (
                  <div key={index} className="vehicle-summary-card">
                    <div className="vehicle-card-icon">
                      <FaCar />
                    </div>
                    <div className="vehicle-card-info">
                      <h3>{vehicle.vehicleName || vehicle.model || 'Vehicle'}</h3>
                      <p className="vehicle-reg">{vehicle.registrationNumber || 'N/A'}</p>
                      {vehicle.model && <p className="vehicle-model">{vehicle.model}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
