'use client';

import { useState, useEffect } from 'react';
import { TeamMember } from '@/types/admin';

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    name: '',
    role: '',
    about: '',
    bootcampAbout: '',
    calendar: '',
    image: '',
  });
  const [nextId, setNextId] = useState<number>(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('/admin/api/team');
      if (response.ok) {
        const data = await response.json();
        setTeamMembers(data);
        
        // Calculate next ID based on existing members
        const maxId = Math.max(...data.map((member: TeamMember) => member.id || 0), -1);
        setNextId(maxId + 1);
      }
    } catch (error) {
      console.error('Failed to fetch team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    } else {
      // Check for special characters (allow only letters, spaces, hyphens, and apostrophes)
      const namePattern = /^[a-zA-Z\s\-']+$/;
      if (!namePattern.test(formData.name.trim())) {
        errors.name = 'Name can only contain letters, spaces, hyphens, and apostrophes';
      }
    }
    
    // Role validation
    if (!formData.role.trim()) {
      errors.role = 'Role is required';
    } else if (formData.role.trim().length < 2) {
      errors.role = 'Role must be at least 2 characters long';
    }
    
    // About validation
    if (!formData.about.trim()) {
      errors.about = 'General about is required';
    } else if (formData.about.trim().length < 10) {
      errors.about = 'About must be at least 10 characters long';
    }
    
    // Calendar validation
    if (!formData.calendar.trim()) {
      errors.calendar = 'Calendar link is required';
    } else {
      // Basic URL validation
      const urlPattern = /^https?:\/\/.+/;
      if (!urlPattern.test(formData.calendar.trim())) {
        errors.calendar = 'Please enter a valid URL (starting with http:// or https://)';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      setSubmitting(false);
      return;
    }
    
    setSubmitting(true);
    
    try {
      let imageUrl = formData.image;
      
      // Handle image deletion (if imagePreview is empty but there was an original image)
      if (editingMember && !imagePreview && editingMember.image) {
        console.log('🗑️ Frontend: Image deleted, setting to empty string');
        imageUrl = '';
      }
      // Handle image upload if a new file is selected
      else if (imageFile) {
        console.log('📤 Frontend: Starting image upload:', imageFile.name, imageFile.size, imageFile.type);
        const formDataUpload = new FormData();
        formDataUpload.append('image', imageFile);
        
        const uploadResponse = await fetch('/admin/api/upload', {
          method: 'POST',
          body: formDataUpload,
        });
        
        console.log('📤 Frontend: Upload response status:', uploadResponse.status);
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          console.log('✅ Frontend: Upload successful:', uploadData.url);
          imageUrl = uploadData.url;
        } else {
          const errorData = await uploadResponse.json();
          console.error('❌ Frontend: Upload failed:', errorData);
          alert(`Failed to upload image: ${errorData.error || 'Unknown error'}`);
          return;
        }
      }
    
      const memberData = {
        ...formData,
        image: imageUrl,
      };

      // Remove ID field for updates to prevent API rejection
      if (editingMember) {
        delete memberData.id;
      }

      if (editingMember) {
        // Update existing member
        console.log('🔄 Updating team member:', memberData);
        const response = await fetch(`/admin/api/team/${editingMember._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(memberData),
        });

        if (response.ok) {
          console.log('✅ Team member updated successfully');
          await fetchTeamMembers();
          // Clear cache to force refresh on meetings page
          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.removeItem('teamData');
            sessionStorage.removeItem('lastTeamDataFetch');
          }
          closeModal();
        } else {
          const errorData = await response.json();
          console.error('❌ Failed to update team member:', errorData);
          alert(`Failed to update team member: ${errorData.error || 'Unknown error'}`);
        }
      } else {
        // Create new member
        const response = await fetch('/admin/api/team', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(memberData),
        });

        if (response.ok) {
          await fetchTeamMembers();
          // Clear cache to force refresh on meetings page
          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.removeItem('teamData');
            sessionStorage.removeItem('lastTeamDataFetch');
          }
          closeModal();
        }
      }
    } catch (error) {
      console.error('Failed to save team member:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      id: member.id,
      name: member.name,
      role: member.role,
      about: member.about,
      bootcampAbout: member.bootcampAbout || '',
      calendar: member.calendar,
      image: member.image || '',
    });
    setImagePreview(member.image || '');
    setImageFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this team member?')) {
      try {
        const response = await fetch(`/admin/api/team/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchTeamMembers();
          // Clear cache to force refresh on meetings page
          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.removeItem('teamData');
            sessionStorage.removeItem('lastTeamDataFetch');
          }
        }
      } catch (error) {
        console.error('Failed to delete team member:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id: 0,
      name: '',
      role: '',
      about: '',
      bootcampAbout: '',
      calendar: '',
      image: '',
    });
    setImageFile(null);
    setImagePreview('');
    setValidationErrors({});
  };

  const openModal = () => {
    setEditingMember(null);
    resetForm();
    // Set the next ID for new members (keep as number)
    setFormData(prev => ({ ...prev, id: nextId }));
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMember(null);
    resetForm();
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showModal) {
        closeModal();
      }
    };

    if (showModal) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading team members...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Team Management</h1>
          <p className="text-gray-400 mt-2">Manage your analyst team members</p>
        </div>
        <button
          onClick={openModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add New Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <div
            key={member._id}
            className="bg-slate-800 rounded-lg p-6 border border-slate-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center overflow-hidden">
                {member.image ? (
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                      if (nextElement) {
                        nextElement.style.display = 'flex';
                      }
                    }}
                  />
                ) : null}
                <span 
                  className="text-white font-bold text-lg"
                  style={{ display: member.image ? 'none' : 'flex' }}
                >
                  {member.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(member)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(member._id!)}
                  className="text-red-400 hover:text-red-300"
                >
                  🗑️
                </button>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white break-words">{member.name}</h3>
            <p className="text-indigo-400 text-sm break-words">{member.role}</p>
            
            <div className="mt-2 space-y-2">
              <div>
                <p className="text-xs text-gray-400 font-medium">General About:</p>
                <p className="text-gray-300 text-sm break-words whitespace-pre-line">
                  {member.about}
                </p>
              </div>
              
              {member.bootcampAbout && (
                <div>
                  <p className="text-xs text-gray-400 font-medium">Bootcamp About:</p>
                  <p className="text-gray-300 text-sm break-words whitespace-pre-line">
                    {member.bootcampAbout}
                  </p>
                </div>
              )}
            </div>
            
            <div className="mt-3">
              <p className="text-xs text-gray-500">ID: {member.id}</p>
              {member.calendar && (
                <p className="text-xs text-gray-500 mt-1 break-all">
                  Calendar: {member.calendar}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            // Close modal when clicking on backdrop
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <div 
            className="bg-slate-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="text-xl font-bold text-white mb-4 pr-8">
              {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
            </h2>
            <div className="mb-4 p-3 bg-slate-700 rounded-lg">
              <p className="text-sm text-gray-300">
                <span className="text-red-400">*</span> Required fields: Name, Role, General About, and Calendar Link
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Note: Name field only allows letters, spaces, hyphens, and apostrophes
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  ID {editingMember ? '(Read-only)' : '(Auto-generated)'}
                </label>
                <input
                  type="number"
                  required
                  value={formData.id}
                  readOnly
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-gray-300 cursor-not-allowed"
                  title={editingMember ? "ID cannot be changed for existing members" : "ID is automatically generated for new members"}
                />
                {!editingMember && (
                  <p className="text-xs text-gray-400 mt-1">
                    ID will be automatically assigned as {nextId}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    // Clear error when user starts typing
                    if (validationErrors.name) {
                      setValidationErrors({ ...validationErrors, name: '' });
                    }
                  }}
                  className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 ${
                    validationErrors.name 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-slate-600 focus:ring-indigo-500'
                  }`}
                  placeholder="Enter full name (letters, spaces, hyphens, apostrophes only)"
                />
                {validationErrors.name && (
                  <p className="text-red-400 text-xs mt-1">{validationErrors.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Role <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => {
                    setFormData({ ...formData, role: e.target.value });
                    // Clear error when user starts typing
                    if (validationErrors.role) {
                      setValidationErrors({ ...validationErrors, role: '' });
                    }
                  }}
                  placeholder="e.g., Senior Analyst, Trading Expert"
                  className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 ${
                    validationErrors.role 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-slate-600 focus:ring-indigo-500'
                  }`}
                />
                {validationErrors.role && (
                  <p className="text-red-400 text-xs mt-1">{validationErrors.role}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  About (General/Mentorship) <span className="text-red-400">*</span>
                </label>
                <textarea
                  required
                  value={formData.about}
                  onChange={(e) => {
                    setFormData({ ...formData, about: e.target.value });
                    // Clear error when user starts typing
                    if (validationErrors.about) {
                      setValidationErrors({ ...validationErrors, about: '' });
                    }
                  }}
                  rows={4}
                  placeholder="Description of expertise and experience for general mentorship flow"
                  className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 ${
                    validationErrors.about 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-slate-600 focus:ring-indigo-500'
                  }`}
                />
                {validationErrors.about && (
                  <p className="text-red-400 text-xs mt-1">{validationErrors.about}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  About (Bootcamp Specific)
                </label>
                <textarea
                  value={formData.bootcampAbout}
                  onChange={(e) => setFormData({ ...formData, bootcampAbout: e.target.value })}
                  rows={4}
                  placeholder="Specific description for bootcamp pages (optional - will fallback to general about if empty)"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-xs text-gray-400 mt-1">
                  This will be used specifically on bootcamp detail pages. If left empty, the general about will be used.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Calendar Link <span className="text-red-400">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={formData.calendar}
                  onChange={(e) => {
                    setFormData({ ...formData, calendar: e.target.value });
                    // Clear error when user starts typing
                    if (validationErrors.calendar) {
                      setValidationErrors({ ...validationErrors, calendar: '' });
                    }
                  }}
                  placeholder="https://calendly.com/username"
                  className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 ${
                    validationErrors.calendar 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-slate-600 focus:ring-indigo-500'
                  }`}
                />
                {validationErrors.calendar && (
                  <p className="text-red-400 text-xs mt-1">{validationErrors.calendar}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {imagePreview && (
                  <div className="mt-4 flex items-center gap-4">
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview('');
                          setImageFile(null);
                          setFormData(prev => ({ ...prev, image: '' }));
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                        title="Remove image"
                      >
                        ×
                      </button>
                    </div>
                    <div className="text-sm text-gray-400">
                      <p className="font-medium">Preview:</p>
                      <p className="text-xs">This is how the image will appear on the analyst selection page</p>
                    </div>
                  </div>
                )}
                {!imagePreview && editingMember && editingMember.image && (
                  <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                    <div className="flex items-center gap-2 text-red-400">
                      <span className="text-sm">🗑️</span>
                      <span className="text-sm font-medium">Image will be removed when you save</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white py-2 rounded-lg transition-colors"
                >
                  {submitting ? 'Saving...' : (editingMember ? 'Update' : 'Add') + ' Member'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
