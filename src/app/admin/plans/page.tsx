'use client';

import { useState, useEffect } from 'react';

interface Plan {
  _id: string;
  planId: string;
  name: string;
  description: string;
  priceAmount: number;
  priceDisplay: string;
  priceAccent: string;
  billingNote?: string;
  billingInterval: string;
  stripePriceId: string;
  isPopular: boolean;
  isFree: boolean;
  isActive: boolean;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    features: [] as string[],
    isFree: false,
    isActive: true,
  });
  const [newFeature, setNewFeature] = useState('');
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/admin/api/plans');
      if (response.ok) {
        const data = await response.json();
        // Ensure isFree is properly set (handle cases where it might be undefined)
        const plansWithDefaults = (data.plans || []).map((plan: Plan) => ({
          ...plan,
          isFree: plan.isFree === true || plan.isFree === 'true',
          isActive: plan.isActive !== false,
        }));
        setPlans(plansWithDefaults);
      }
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    // Ensure boolean values are properly converted
    const isFreeValue = plan.isFree === true || plan.isFree === 'true' || plan.isFree === 1;
    const isActiveValue = plan.isActive !== false && plan.isActive !== 'false' && plan.isActive !== 0;
    
    setFormData({
      name: plan.name,
      features: [...plan.features],
      isFree: isFreeValue,
      isActive: isActiveValue,
    });
    setNewFeature('');
    setValidationErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPlan(null);
    setFormData({
      name: '',
      features: [],
      isFree: false,
      isActive: true,
    });
    setNewFeature('');
    setValidationErrors({});
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()],
      });
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (formData.features.length === 0) {
      errors.features = 'At least one feature is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!editingPlan) return;

    setSubmitting(true);
    setValidationErrors({});

    try {
      console.log('Updating plan:', editingPlan._id, formData);
      
      const response = await fetch(`/admin/api/plans/${editingPlan._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response received. Status:', response.status);
        console.error('Response text (first 500 chars):', text.substring(0, 500));
        setValidationErrors({ 
          submit: `Server error: ${response.status === 404 ? 'Route not found. Please restart the dev server.' : 'Invalid response format'}` 
        });
        return;
      }

      const data = await response.json();

      if (response.ok) {
        await fetchPlans();
        handleCloseModal();
      } else {
        setValidationErrors({ submit: data.error || 'Failed to update plan' });
      }
    } catch (error) {
      console.error('Error updating plan:', error);
      setValidationErrors({ submit: 'Failed to update plan. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="glass-card rounded-2xl p-8 text-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-lg font-medium">Loading plans...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Plans Management</h1>
          <p className="text-slate-400 mt-2">Manage subscription plans and pricing</p>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className={`flex flex-col h-full bg-slate-800 rounded-xl p-6 border ${
              plan.isActive ? 'border-slate-700' : 'border-slate-600 opacity-60'
            }`}
          >
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                  <p className="text-slate-400 text-sm mt-1">{plan.description}</p>
                </div>
                {!plan.isActive && (
                  <span className="px-2 py-1 text-xs bg-slate-700 text-slate-300 rounded">
                    Hidden
                  </span>
                )}
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-2xl font-bold"
                    style={{ color: plan.priceAccent }}
                  >
                    {plan.isFree ? 'FREE' : plan.priceDisplay}
                  </span>
                  {plan.isFree && plan.priceAmount > 0 && (
                    <span
                      className="text-lg line-through opacity-50"
                      style={{ color: plan.priceAccent }}
                    >
                      {plan.priceDisplay}
                    </span>
                  )}
                </div>
                {plan.billingNote && (
                  <p className="text-slate-400 text-sm">{plan.billingNote}</p>
                )}
              </div>

              <div className="mb-4">
                <p className="text-slate-400 text-sm mb-2">Features:</p>
                <ul className="space-y-1">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="text-white text-sm flex items-start">
                      <span className="mr-2">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-2 mb-4">
                {plan.isPopular && (
                  <span className="px-2 py-1 text-xs bg-purple-600 text-white rounded">
                    Popular
                  </span>
                )}
                {plan.isFree && (
                  <span className="px-2 py-1 text-xs bg-green-600 text-white rounded">
                    Free
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => handleEdit(plan)}
              className="mt-auto w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              Edit Plan
            </button>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {showModal && editingPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Edit Plan: {editingPlan.name}</h2>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Plan Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Plan Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (validationErrors.name) {
                      setValidationErrors({ ...validationErrors, name: '' });
                    }
                  }}
                  className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 ${
                    validationErrors.name
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-600 focus:ring-indigo-500'
                  }`}
                />
                {validationErrors.name && (
                  <p className="text-red-400 text-xs mt-1">{validationErrors.name}</p>
                )}
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Features *
                </label>
                <div className="space-y-2 mb-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => {
                          const newFeatures = [...formData.features];
                          newFeatures[index] = e.target.value;
                          setFormData({ ...formData, features: newFeatures });
                        }}
                        className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(index)}
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    placeholder="Add new feature"
                    className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </div>
                {validationErrors.features && (
                  <p className="text-red-400 text-xs mt-1">{validationErrors.features}</p>
                )}
              </div>

              {/* Toggles */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-white">Free Plan</label>
                    <p className="text-xs text-slate-400">Make this plan free (no charge)</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFree}
                      onChange={(e) => setFormData({ ...formData, isFree: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-white">Show on Website</label>
                    <p className="text-xs text-slate-400">Hide plan from pricing page</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>

              {/* Read-only fields */}
              <div className="border-t border-slate-700 pt-4">
                <h3 className="text-sm font-medium text-gray-300 mb-3">Read-only Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Price:</span>
                    <span className="text-white ml-2">{editingPlan.priceDisplay}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Billing Interval:</span>
                    <span className="text-white ml-2">{editingPlan.billingInterval}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Plan ID:</span>
                    <span className="text-white ml-2">{editingPlan.planId}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Stripe Price ID:</span>
                    <span className="text-white ml-2 text-xs">{editingPlan.stripePriceId || 'Not set'}</span>
                  </div>
                </div>
              </div>

              {/* Submit Error */}
              {validationErrors.submit && (
                <div className="bg-red-900/30 border border-red-500 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{validationErrors.submit}</p>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 rounded-lg transition-colors text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Updating...' : 'Update Plan'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
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

