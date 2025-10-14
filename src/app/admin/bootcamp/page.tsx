'use client';

import { useState, useEffect } from 'react';
import { Bootcamp, TeamMember } from '@/types/admin';

export default function BootcampPage() {
  const [bootcamps, setBootcamps] = useState<Bootcamp[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBootcamp, setEditingBootcamp] = useState<Bootcamp | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    price: '',
    duration: '',
    format: 'Online' as 'Online' | 'In-Person' | 'Hybrid',
    mentors: [] as string[],
    registrationStartDate: '',
    registrationEndDate: '',
    tags: [] as string[],
    gradientPosition: {
      left: '399px',
      top: '-326px',
      rotation: '90deg'
    },
    isActive: true,
  });
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    fetchBootcamps();
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('/admin/api/team');
      if (response.ok) {
        const data = await response.json();
        setTeamMembers(data);
      }
    } catch (error) {
      console.error('Failed to fetch team members:', error);
    }
  };

  const fetchBootcamps = async () => {
    try {
      const response = await fetch('/admin/api/bootcamp');
      if (response.ok) {
        const data = await response.json();
        setBootcamps(data);
      }
    } catch (error) {
      console.error('Failed to fetch bootcamps:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const bootcampData = {
        ...formData,
        mentors: formData.mentors,
        tags: formData.tags,
        registrationStartDate: new Date(formData.registrationStartDate),
        registrationEndDate: new Date(formData.registrationEndDate),
      };

      if (editingBootcamp) {
        // Update existing bootcamp
        console.log('Updating bootcamp with ID:', editingBootcamp._id);
        console.log('Update data:', bootcampData);
        
        const response = await fetch(`/admin/api/bootcamp/${editingBootcamp._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bootcampData),
        });

        console.log('Update response status:', response.status);
        
        if (response.ok) {
          const result = await response.json();
          console.log('Update successful:', result);
          await fetchBootcamps();
          closeModal();
        } else {
          const errorData = await response.json();
          console.error('Update failed:', errorData);
          alert(`Failed to update bootcamp: ${errorData.error || 'Unknown error'}`);
        }
      } else {
        // Create new bootcamp
        console.log('Creating new bootcamp with data:', bootcampData);
        
        const response = await fetch('/admin/api/bootcamp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bootcampData),
        });

        console.log('Create response status:', response.status);
        
        if (response.ok) {
          const result = await response.json();
          console.log('Create successful:', result);
          await fetchBootcamps();
          closeModal();
        } else {
          const errorData = await response.json();
          console.error('Create failed:', errorData);
          alert(`Failed to create bootcamp: ${errorData.error || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('Failed to save bootcamp:', error);
      alert(`Failed to save bootcamp: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Utility function to safely convert date to YYYY-MM-DD format
  const formatDateForInput = (date: Date | string): string => {
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      return dateObj.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date:', error);
      return new Date().toISOString().split('T')[0]; // fallback to today
    }
  };

  const handleEdit = (bootcamp: Bootcamp) => {
    setEditingBootcamp(bootcamp);
    
    setFormData({
      id: bootcamp.id,
      title: bootcamp.title,
      description: bootcamp.description,
      price: bootcamp.price,
      duration: bootcamp.duration,
      format: bootcamp.format,
      mentors: bootcamp.mentors,
      registrationStartDate: formatDateForInput(bootcamp.registrationStartDate),
      registrationEndDate: formatDateForInput(bootcamp.registrationEndDate),
      tags: bootcamp.tags,
      gradientPosition: bootcamp.gradientPosition,
      isActive: bootcamp.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this bootcamp?')) {
      try {
        const response = await fetch(`/admin/api/bootcamp/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchBootcamps();
        }
      } catch (error) {
        console.error('Failed to delete bootcamp:', error);
      }
    }
  };

  const populateSampleData = async () => {
    try {
      const response = await fetch('/admin/api/bootcamp/populate', {
        method: 'POST',
      });

      if (response.ok) {
        await fetchBootcamps();
      }
    } catch (error) {
      console.error('Failed to populate sample data:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      title: '',
      description: '',
      price: '',
      duration: '',
      format: 'Online',
      mentors: [],
      registrationStartDate: '',
      registrationEndDate: '',
      tags: [],
      gradientPosition: {
        left: '399px',
        top: '-326px',
        rotation: '90deg'
      },
      isActive: true,
    });
    setNewTag('');
  };

  const openModal = () => {
    setEditingBootcamp(null);
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBootcamp(null);
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

  const addMentor = (teamMemberId: string) => {
    const teamMember = teamMembers.find(member => member.id === teamMemberId);
    if (teamMember) {
      const mentorString = `${teamMember.name} - ${teamMember.role}`;
      if (!formData.mentors.includes(mentorString)) {
        setFormData({
          ...formData,
          mentors: [...formData.mentors, mentorString]
        });
      }
    }
  };

  const removeMentor = (index: number) => {
    setFormData({
      ...formData,
      mentors: formData.mentors.filter((_, i) => i !== index)
    });
  };

  // Get available team members (not already selected as mentors)
  const getAvailableTeamMembers = () => {
    const selectedMentorNames = formData.mentors.map(mentor => mentor.split(' - ')[0]);
    return teamMembers.filter(member => !selectedMentorNames.includes(member.name));
  };

  // Get unique mentors across all bootcamps
  const getUniqueMentorsCount = () => {
    const allMentorNames = bootcamps.flatMap(bootcamp => 
      bootcamp.mentors.map(mentor => mentor.split(' - ')[0])
    );
    const uniqueMentorNames = [...new Set(allMentorNames)];
    return uniqueMentorNames.length;
  };

  // Get total mentor assignments across all bootcamps
  const getTotalMentorAssignments = () => {
    return bootcamps.reduce((acc, bootcamp) => acc + bootcamp.mentors.length, 0);
  };

  const addTag = () => {
    if (newTag.trim()) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index)
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading bootcamps...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Bootcamp Management</h1>
          <p className="text-gray-400 mt-2">Manage your bootcamp programs and courses</p>
        </div>
        <div className="flex gap-3">
          {bootcamps.length === 0 && (
            <button
              onClick={populateSampleData}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Populate Sample Data
            </button>
          )}
          <button
            onClick={openModal}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Add New Bootcamp
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-slate-700">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-white">{bootcamps.length}</p>
              <p className="text-slate-400 text-sm">Total Bootcamps</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-sm">Active programs</span>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-slate-700">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-white">{bootcamps.filter(b => b.isActive).length}</p>
              <p className="text-slate-400 text-sm">Active Bootcamps</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-sm">Currently available</span>
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-slate-700">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-white">{getUniqueMentorsCount()}</p>
              <p className="text-slate-400 text-sm">Unique Mentors</p>
              <p className="text-xs text-slate-500 mt-1">
                from {teamMembers.length} team members
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-sm">
              {getTotalMentorAssignments()} total assignments
            </span>
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Bootcamps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bootcamps.map((bootcamp) => (
          <div
            key={bootcamp._id}
            className="bg-slate-800 rounded-xl p-6 border border-slate-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">{bootcamp.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-indigo-400 text-sm">{bootcamp.price}</span>
                  <span className="text-gray-400 text-sm">•</span>
                  <span className="text-gray-400 text-sm">{bootcamp.duration}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(bootcamp)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(bootcamp._id!)}
                  className="text-red-400 hover:text-red-300"
                >
                  🗑️
                </button>
              </div>
            </div>
            
            <p className="text-gray-300 text-sm mb-3 line-clamp-3">
              {bootcamp.description.length > 100 
                ? `${bootcamp.description.substring(0, 100)}...` 
                : bootcamp.description}
            </p>
            
            <div className="space-y-2">
              <div>
                <h4 className="text-sm font-medium text-white">Mentors:</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {bootcamp.mentors.slice(0, 2).map((mentor, index) => (
                    <span key={index} className="text-xs text-gray-400">
                      {mentor.split(' - ')[0]}
                    </span>
                  ))}
                  {bootcamp.mentors.length > 2 && (
                    <span className="text-xs text-gray-500">+{bootcamp.mentors.length - 2} more</span>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                {bootcamp.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="border border-indigo-500 bg-indigo-500/20 rounded-full px-2 py-1 text-xs text-indigo-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="text-xs text-gray-500">
                <p>Registration: {new Date(bootcamp.registrationStartDate).toLocaleDateString()} - {new Date(bootcamp.registrationEndDate).toLocaleDateString()}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`w-2 h-2 rounded-full ${bootcamp.isActive ? 'bg-green-400' : 'bg-red-400'}`}></span>
                  <span>{bootcamp.isActive ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {bootcamps.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎓</div>
          <h3 className="text-xl font-semibold text-white mb-2">No bootcamps yet</h3>
          <p className="text-gray-400 mb-6">Create your first bootcamp program or populate with sample data</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={populateSampleData}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Populate Sample Data
            </button>
            <button
              onClick={openModal}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Create Bootcamp
            </button>
          </div>
        </div>
      )}

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
              {editingBootcamp ? 'Edit Bootcamp' : 'Create New Bootcamp'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    ID
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    placeholder="crypto-trading"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Price
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="30 BNB"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="6 Weeks"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Format
                  </label>
                  <select
                    value={formData.format}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value as 'Online' | 'In-Person' | 'Hybrid' })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Online">Online</option>
                    <option value="In-Person">In-Person</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Mentors
                </label>
                
                {/* Team Member Dropdown */}
                <div className="mb-3">
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value) {
                        addMentor(e.target.value);
                        e.target.value = ''; // Reset selection
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select a team member to add as mentor...</option>
                    {getAvailableTeamMembers().map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name} - {member.role}
                      </option>
                    ))}
                  </select>
                  {getAvailableTeamMembers().length === 0 && formData.mentors.length > 0 && (
                    <p className="text-xs text-gray-400 mt-1">All team members are already selected as mentors</p>
                  )}
                </div>

                {/* Selected Mentors */}
                <div className="space-y-2">
                  <p className="text-xs text-gray-400">Selected Mentors:</p>
                  {formData.mentors.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No mentors selected</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {formData.mentors.map((mentor, index) => {
                        const mentorName = mentor.split(' - ')[0];
                        const teamMember = teamMembers.find(member => member.name === mentorName);
                        return (
                          <span
                            key={index}
                            className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm group relative"
                            title={teamMember ? teamMember.about : undefined}
                          >
                            {mentor}
                            <button
                              type="button"
                              onClick={() => removeMentor(index)}
                              className="text-red-300 hover:text-red-200 ml-1"
                            >
                              ×
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Team Members Info */}
                <div className="mt-2 text-xs text-gray-400">
                  {teamMembers.length === 0 ? (
                    <p className="text-yellow-400">
                      ⚠️ No team members found. Please add team members first in the Team section.
                    </p>
                  ) : (
                    <p>
                      {getAvailableTeamMembers().length} of {teamMembers.length} team members available for selection
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag"
                    className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-1 bg-indigo-600 text-white px-2 py-1 rounded text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Registration Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.registrationStartDate}
                    onChange={(e) => setFormData({ ...formData, registrationStartDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Registration End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.registrationEndDate}
                    onChange={(e) => setFormData({ ...formData, registrationEndDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 bg-slate-700 border-slate-600 rounded focus:ring-indigo-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-300">
                  Active
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white py-2 rounded-lg transition-colors"
                >
                  {submitting ? 'Saving...' : (editingBootcamp ? 'Update' : 'Create') + ' Bootcamp'}
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
