import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPhone, faMapMarkerAlt, faGlobe, faChartLine, faEdit, faSave, faTimes, faCamera } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../axiosInstance';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get('/auth/profile/');
      setProfile(response.data);
      setFormData({
        first_name: response.data.user.first_name || '',
        last_name: response.data.user.last_name || '',
        email: response.data.user.email || '',
        phone_number: response.data.phone_number || '',
        date_of_birth: response.data.date_of_birth || '',
        bio: response.data.bio || '',
        location: response.data.location || '',
        website: response.data.website || '',
        investment_experience: response.data.investment_experience || 'beginner',
        risk_tolerance: response.data.risk_tolerance || 'moderate'
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get('/auth/profile/stats/');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
      setFormData(prev => ({
        ...prev,
        avatar: file
      }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formDataToSend = new FormData();
      
      // Add text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'avatar' && formData[key] !== '') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Add avatar if it exists
      if (formData.avatar instanceof File) {
        formDataToSend.append('avatar', formData.avatar);
      }

      const response = await axiosInstance.put('/auth/profile/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setProfile(response.data.profile);
      setEditing(false);
      setPreviewImage(null);
      await fetchStats(); // Refresh stats
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setPreviewImage(null);
    // Reset form data
    if (profile) {
      setFormData({
        first_name: profile.user.first_name || '',
        last_name: profile.user.last_name || '',
        email: profile.user.email || '',
        phone_number: profile.phone_number || '',
        date_of_birth: profile.date_of_birth || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || '',
        investment_experience: profile.investment_experience || 'beginner',
        risk_tolerance: profile.risk_tolerance || 'moderate'
      });
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-info" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">Error loading profile</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Profile Completion Card */}
        <div className="col-md-4 mb-4">
          <div className="card bg-dark text-light">
            <div className="card-body">
              <h5 className="card-title">
                <FontAwesomeIcon icon={faChartLine} className="me-2" />
                Profile Completion
              </h5>
              <div className="progress mb-3" style={{ height: '10px' }}>
                <div 
                  className="progress-bar bg-info" 
                  role="progressbar" 
                  style={{ width: `${stats.completion_percentage || 0}%` }}
                ></div>
              </div>
              <p className="mb-1">{stats.completion_percentage || 0}% Complete</p>
              <small className="text-muted">
                {stats.completed_fields || 0} of {stats.total_fields || 8} fields completed
              </small>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="col-md-8">
          <div className="card bg-dark text-light">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="mb-0">
                <FontAwesomeIcon icon={faUser} className="me-2" />
                User Profile
              </h4>
              {!editing ? (
                <button 
                  className="btn btn-info btn-sm" 
                  onClick={() => setEditing(true)}
                >
                  <FontAwesomeIcon icon={faEdit} className="me-1" />
                  Edit Profile
                </button>
              ) : (
                <div>
                  <button 
                    className="btn btn-success btn-sm me-2" 
                    onClick={handleSave}
                    disabled={saving}
                  >
                    <FontAwesomeIcon icon={faSave} className="me-1" />
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button 
                    className="btn btn-secondary btn-sm" 
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    <FontAwesomeIcon icon={faTimes} className="me-1" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
            <div className="card-body">
              <div className="row">
                {/* Avatar Section */}
                <div className="col-md-4 text-center mb-4">
                  <div className="position-relative">
                    {previewImage ? (
                      <img 
                        src={previewImage} 
                        alt="Avatar Preview" 
                        className="rounded-circle"
                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                      />
                    ) : profile.avatar ? (
                      <img 
                        src={profile.avatar} 
                        alt="Avatar" 
                        className="rounded-circle"
                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div 
                        className="rounded-circle bg-secondary d-flex align-items-center justify-content-center"
                        style={{ width: '150px', height: '150px', margin: '0 auto' }}
                      >
                        <FontAwesomeIcon icon={faUser} size="3x" />
                      </div>
                    )}
                    {editing && (
                      <div className="mt-2">
                        <label className="btn btn-outline-info btn-sm">
                          <FontAwesomeIcon icon={faCamera} className="me-1" />
                          Change Photo
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Profile Information */}
                <div className="col-md-8">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">First Name</label>
                      {editing ? (
                        <input
                          type="text"
                          className="form-control"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <p className="form-control-plaintext text-light">
                          {profile.user.first_name || 'Not specified'}
                        </p>
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Last Name</label>
                      {editing ? (
                        <input
                          type="text"
                          className="form-control"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <p className="form-control-plaintext text-light">
                          {profile.user.last_name || 'Not specified'}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        <FontAwesomeIcon icon={faUser} className="me-1" />
                        Username
                      </label>
                      <p className="form-control-plaintext text-light">
                        {profile.user.username}
                      </p>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email</label>
                      {editing ? (
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <p className="form-control-plaintext text-light">
                          {profile.user.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        <FontAwesomeIcon icon={faPhone} className="me-1" />
                        Phone Number
                      </label>
                      {editing ? (
                        <input
                          type="tel"
                          className="form-control"
                          name="phone_number"
                          value={formData.phone_number}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <p className="form-control-plaintext text-light">
                          {profile.phone_number || 'Not specified'}
                        </p>
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Date of Birth</label>
                      {editing ? (
                        <input
                          type="date"
                          className="form-control"
                          name="date_of_birth"
                          value={formData.date_of_birth}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <p className="form-control-plaintext text-light">
                          {profile.date_of_birth || 'Not specified'}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="me-1" />
                        Location
                      </label>
                      {editing ? (
                        <input
                          type="text"
                          className="form-control"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <p className="form-control-plaintext text-light">
                          {profile.location || 'Not specified'}
                        </p>
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        <FontAwesomeIcon icon={faGlobe} className="me-1" />
                        Website
                      </label>
                      {editing ? (
                        <input
                          type="url"
                          className="form-control"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <p className="form-control-plaintext text-light">
                          {profile.website ? (
                            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-info">
                              {profile.website}
                            </a>
                          ) : 'Not specified'}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Bio</label>
                    {editing ? (
                      <textarea
                        className="form-control"
                        name="bio"
                        rows="3"
                        value={formData.bio}
                        onChange={handleInputChange}
                        maxLength="500"
                      />
                    ) : (
                      <p className="form-control-plaintext text-light">
                        {profile.bio || 'No bio provided'}
                      </p>
                    )}
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Investment Experience</label>
                      {editing ? (
                        <select
                          className="form-select"
                          name="investment_experience"
                          value={formData.investment_experience}
                          onChange={handleInputChange}
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                          <option value="expert">Expert</option>
                        </select>
                      ) : (
                        <p className="form-control-plaintext text-light">
                          {profile.investment_experience.charAt(0).toUpperCase() + profile.investment_experience.slice(1)}
                        </p>
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Risk Tolerance</label>
                      {editing ? (
                        <select
                          className="form-select"
                          name="risk_tolerance"
                          value={formData.risk_tolerance}
                          onChange={handleInputChange}
                        >
                          <option value="conservative">Conservative</option>
                          <option value="moderate">Moderate</option>
                          <option value="aggressive">Aggressive</option>
                        </select>
                      ) : (
                        <p className="form-control-plaintext text-light">
                          {profile.risk_tolerance.charAt(0).toUpperCase() + profile.risk_tolerance.slice(1)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;