import React, { useState, useEffect } from 'react';
import '../styles/components/EditProfileModal.css';
import { FaUserCircle, FaTimes } from 'react-icons/fa';

const EditProfileModal = ({ isOpen, onClose, userData, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contactNo: '',
    });
    const [profileImage, setProfileImage] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (userData) {
            setFormData({
                name: userData.name || '',
                email: userData.email || '',
                contactNo: userData.contactNo || '',
            });
            setPhotoPreview(userData.image || null);
        }
    }, [userData, isOpen]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            const reader = new FileReader();
            reader.onload = (e) => setPhotoPreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const updatedData = {
                ...formData,
                file: profileImage
            };

            await onSave(updatedData);
            onClose();
        } catch (error) {
            console.error("Failed to save profile", error);
            alert("Failed to save profile");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="edit-modal-overlay" onClick={onClose}>
            <div className="edit-modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="edit-modal-header">
                    <h2>Edit Profile</h2>
                    <button className="edit-modal-close-btn" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="edit-modal-body">
                        {/* Image Upload */}
                        <div className="edit-image-upload-wrapper">
                            <div className="edit-image-preview-box">
                                {photoPreview ? (
                                    <img src={photoPreview} alt="Profile Preview" />
                                ) : (
                                    <div className="edit-img-placeholder">
                                        <FaUserCircle />
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                id="editProfilePhotoInput"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="editProfilePhotoInput" className="edit-upload-label">
                                Change Photo
                            </label>
                        </div>

                        {/* Form Fields */}
                        <div className="edit-form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter your full name"
                                required
                            />
                        </div>

                        <div className="edit-form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="your.email@example.com"
                                required
                            />
                        </div>

                        <div className="edit-form-group">
                            <label>Contact Number</label>
                            <input
                                type="tel"
                                name="contactNo"
                                value={formData.contactNo}
                                onChange={handleInputChange}
                                placeholder="+1 234 567 8900"
                            />
                        </div>
                    </div>

                    <div className="edit-modal-footer">
                        <button type="button" className="edit-btn-cancel" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="edit-btn-save" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;
