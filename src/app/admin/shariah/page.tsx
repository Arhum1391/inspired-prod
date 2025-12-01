'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import type { ShariahTile, ComplianceMetric } from '@/types/admin';

type TileResponse = ShariahTile & { _id?: string };

const emptyForm: Omit<ShariahTile, '_id' | 'createdAt' | 'updatedAt'> = {
  slug: '',
  title: '',
  category: '',
  description: '',
  compliancePoints: [],
  complianceMetrics: [],
  footerLeft: '',
  footerRight: '',
  ctaLabel: 'View Details',
  detailPath: '',
  lockedTitle: 'Preview Only',
  lockedDescription: 'Detailed Screening Available with Premium',
  analystNotes: '',
};

const DATE_INPUT_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const formatDateForInput = (value: string) => {
  if (!value) return '';
  if (DATE_INPUT_REGEX.test(value)) {
    return value;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const defaultComplianceMetric: ComplianceMetric = {
  criteria: '',
  threshold: '',
  actual: '',
  comparisonType: 'less_than',
  customStatus: 'pass',
};

export default function ShariahAdminPage() {
  const [tiles, setTiles] = useState<TileResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTile, setEditingTile] = useState<TileResponse | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [newCompliancePoint, setNewCompliancePoint] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const parseNumericValue = (value: string) => {
    if (!value) return null;
    const match = value.replace(/,/g, '').match(/-?\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : null;
  };

  const metricIsPass = (metric: ComplianceMetric) => {
    const comparison = metric.comparisonType || 'less_than';
    if (comparison === 'custom') {
      return (metric.customStatus || 'pass').toLowerCase() !== 'fail';
    }
    const actualVal = parseNumericValue(metric.actual);
    const thresholdVal = parseNumericValue(metric.threshold);
    if (actualVal === null || thresholdVal === null) {
      return true;
    }
    switch (comparison) {
      case 'less_than':
        return actualVal <= thresholdVal;
      case 'greater_than':
        return actualVal >= thresholdVal;
      case 'equal':
        return Math.abs(actualVal - thresholdVal) < 0.001;
      default:
        return true;
    }
  };

  const metricStatusLabel = (metric: ComplianceMetric) => (metricIsPass(metric) ? 'Pass' : 'Fail');

  const addComplianceMetric = () => {
    setFormData((prev) => ({
      ...prev,
      complianceMetrics: [...(prev.complianceMetrics || []), { ...defaultComplianceMetric }],
    }));
    if (validationErrors.complianceMetrics) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next.complianceMetrics;
        return next;
      });
    }
  };

  const handleComplianceMetricChange = (
    index: number,
    field: keyof ComplianceMetric,
    value: string
  ) => {
    const metrics = [...(formData.complianceMetrics || [])];
    const updatedMetric: ComplianceMetric = { ...metrics[index], [field]: value } as ComplianceMetric;

    if (field === 'comparisonType') {
      if (value !== 'custom') {
        delete updatedMetric.customStatus;
      } else if (!updatedMetric.customStatus) {
        updatedMetric.customStatus = 'pass';
      }
    }

    metrics[index] = updatedMetric;
    setFormData({ ...formData, complianceMetrics: metrics });
  };

  const removeComplianceMetric = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      complianceMetrics: (prev.complianceMetrics || []).filter((_, i) => i !== index),
    }));
  };

  useEffect(() => {
    fetchTiles();
  }, []);

  const fetchTiles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/admin/api/shariah-tiles');
      if (response.ok) {
        const data = await response.json();
        setTiles(data);
      }
    } catch (error) {
      console.error('Failed to fetch Shariah tiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const sanitizedSlug = (value: string) => {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const openModal = (tile?: TileResponse) => {
    if (tile) {
      setEditingTile(tile);
      // Auto-generate slug and detailPath from title when editing
      const generatedSlug = sanitizedSlug(tile.title);
      const generatedDetailPath = `/shariah/${generatedSlug}`;
      setFormData({
        slug: generatedSlug,
        title: tile.title,
        category: tile.category,
        description: tile.description,
        compliancePoints: tile.compliancePoints || [],
        complianceMetrics: tile.complianceMetrics || [],
        footerLeft: tile.footerLeft,
        footerRight: formatDateForInput(tile.footerRight),
        ctaLabel: 'View Details',
        detailPath: generatedDetailPath,
        lockedTitle: 'Preview Only',
        lockedDescription: 'Detailed Screening Available with Premium',
        analystNotes: tile.analystNotes,
      });
    } else {
      setEditingTile(null);
      setFormData(emptyForm);
      setNewCompliancePoint('');
    }
    setValidationErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTile(null);
    setFormData(emptyForm);
    setNewCompliancePoint('');
    setValidationErrors({});
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const trimmedTitle = formData.title.trim();
    const trimmedCategory = formData.category.trim();
    const trimmedDescription = formData.description.trim();
    const trimmedFooterLeft = formData.footerLeft.trim();
    const trimmedFooterRight = formData.footerRight.trim();
    const trimmedAnalystNotes = formData.analystNotes.trim();

    // Validate required fields
    if (!trimmedTitle) {
      errors.title = 'This field is required';
    }
    if (!trimmedCategory) {
      errors.category = 'This field is required';
    }
    if (!trimmedDescription) {
      errors.description = 'This field is required';
    }
    if (!trimmedFooterLeft) {
      errors.footerLeft = 'This field is required';
    }
    if (!trimmedFooterRight) {
      errors.footerRight = 'This field is required';
    }
    if (!trimmedAnalystNotes) {
      errors.analystNotes = 'This field is required';
    }

    // Validate title and auto-generated slug
    if (trimmedTitle) {
      if (trimmedTitle.length < 4) {
        errors.title = 'Title must be at least 4 characters long';
      } else if (!/[a-zA-Z]/.test(trimmedTitle)) {
        errors.title = 'Enter a valid Title';
      } else {
        // Generate slug from title and validate it
        const generatedSlug = sanitizedSlug(trimmedTitle);
        if (!generatedSlug) {
          errors.title = 'Title must contain at least one letter or number';
        } else if (!/^[a-z0-9-]+$/.test(generatedSlug)) {
          errors.title = 'Title cannot be converted to a valid slug';
        } else if (
          tiles.some((tile) => tile.slug === generatedSlug && tile._id !== editingTile?._id)
        ) {
          errors.title = 'A tile with this title already exists (slug conflict)';
        }
      }
    }

    if (trimmedCategory && trimmedCategory.length < 2) {
      errors.category = 'Category must be at least 2 characters long';
    }

    if (trimmedDescription) {
      if (trimmedDescription.length < 20) {
        errors.description = 'Description must be at least 20 characters long';
      } else if (!/[a-zA-Z]/.test(trimmedDescription)) {
        errors.description = 'Enter a valid Description';
      }
    }

    if (trimmedFooterLeft && trimmedFooterLeft.length < 3) {
      errors.footerLeft = 'Footer left text must be at least 3 characters';
    }

    if (trimmedFooterRight) {
      if (!DATE_INPUT_REGEX.test(trimmedFooterRight)) {
        errors.footerRight = 'Select a valid date';
      } else {
        const date = new Date(`${trimmedFooterRight}T00:00:00`);
        if (Number.isNaN(date.getTime())) {
          errors.footerRight = 'Select a valid date';
        }
      }
    }

    if (trimmedAnalystNotes && trimmedAnalystNotes.length < 30) {
      errors.analystNotes = 'Analyst notes should be at least 30 characters';
    }

    if (formData.compliancePoints.length === 0) {
      errors.compliancePoints = 'Add at least one compliance point';
    } else {
      const emptyPoint = formData.compliancePoints.some((point) => !point.trim());
      if (emptyPoint) {
        errors.compliancePoints = 'Compliance points cannot be blank';
      }
    }

    if (!formData.complianceMetrics || formData.complianceMetrics.length === 0) {
      errors.complianceMetrics = 'Add at least one compliance metric';
    } else {
      const missingData = formData.complianceMetrics.some(
        (metric) =>
          !metric.criteria.trim() ||
          !metric.threshold.trim() ||
          !metric.actual.trim() ||
          !metric.comparisonType
      );
      if (missingData) {
        errors.complianceMetrics =
          'Each compliance metric needs criteria, threshold, actual, and a comparison type';
      } else {
        const missingCustomStatus = formData.complianceMetrics.some(
          (metric) => metric.comparisonType === 'custom' && !metric.customStatus
        );
        if (missingCustomStatus) {
          errors.complianceMetrics = 'Manual metrics require a status selection';
        }
        const invalidNumericMetric = formData.complianceMetrics.some(
          (metric) =>
            metric.comparisonType !== 'custom' &&
            (parseNumericValue(metric.threshold) === null ||
              parseNumericValue(metric.actual) === null)
        );
        if (invalidNumericMetric) {
          errors.complianceMetrics =
            'Numeric metrics must have parseable numbers in threshold and actual fields';
        }
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    
    // Auto-generate required fields
    const trimmedTitle = formData.title.trim();
    const generatedSlug = sanitizedSlug(trimmedTitle);
    const generatedDetailPath = `/shariah/${generatedSlug}`;
    
    const payload = {
      ...formData,
      slug: generatedSlug,
      title: trimmedTitle,
      category: formData.category.trim(),
      description: formData.description.trim(),
      footerLeft: formData.footerLeft.trim(),
      footerRight: formData.footerRight.trim(),
      ctaLabel: 'View Details',
      detailPath: generatedDetailPath,
      lockedTitle: 'Preview Only',
      lockedDescription: 'Detailed Screening Available with Premium',
      analystNotes: formData.analystNotes.trim(),
      compliancePoints: formData.compliancePoints.map((point) => point.trim()),
      complianceMetrics: (formData.complianceMetrics || []).map((metric) => ({
        ...metric,
        criteria: metric.criteria.trim(),
        threshold: metric.threshold.trim(),
        actual: metric.actual.trim(),
      })),
    };

    try {
      const url = editingTile?._id
        ? `/admin/api/shariah-tiles/${editingTile._id}`
        : '/admin/api/shariah-tiles';
      const method = editingTile?._id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchTiles();
        closeModal();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to save Shariah tile');
      }
    } catch (error) {
      console.error('Failed to save Shariah tile:', error);
      alert('Failed to save Shariah tile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteTile = async (id?: string) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this tile?')) {
      return;
    }

    try {
      const response = await fetch(`/admin/api/shariah-tiles/${id}`, { method: 'DELETE' });
      if (response.ok) {
        await fetchTiles();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete tile');
      }
    } catch (error) {
      console.error('Failed to delete tile:', error);
      alert('Failed to delete tile. Please try again.');
    }
  };

  const addCompliancePoint = () => {
    if (!newCompliancePoint.trim()) return;
    setFormData((prev) => ({
      ...prev,
      compliancePoints: [...prev.compliancePoints, newCompliancePoint.trim()],
    }));
    setNewCompliancePoint('');
    if (validationErrors.compliancePoints) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next.compliancePoints;
        return next;
      });
    }
  };

  const removeCompliancePoint = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      compliancePoints: prev.compliancePoints.filter((_, i) => i !== index),
    }));
  };

  const filteredTiles = tiles.filter((tile) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      tile.title.toLowerCase().includes(query) ||
      tile.description.toLowerCase().includes(query) ||
      tile.category.toLowerCase().includes(query) ||
      tile.slug.toLowerCase().includes(query)
    );
  });

  const uniqueCategories = useMemo(
    () => new Set(tiles.map((tile) => tile.category)).size,
    [tiles]
  );

  const lastUpdated = useMemo(() => {
    if (tiles.length === 0) return '-';
    const sorted = [...tiles].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    return new Date(sorted[0].updatedAt).toLocaleDateString();
  }, [tiles]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="glass-card rounded-2xl p-8 text-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-lg font-medium">Loading Shariah tiles...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Shariah Tiles</h1>
          <p className="text-slate-400">
            Manage the projects displayed on the public Shariah methodology page.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/shariah"
            target="_blank"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            Preview Shariah Page
          </Link>
          <button
            onClick={() => openModal()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            Add New Tile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-slate-400 text-sm mb-1">Total Tiles</div>
          <div className="text-2xl font-bold text-white">{tiles.length}</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-slate-400 text-sm mb-1">Unique Categories</div>
          <div className="text-2xl font-bold text-green-400">{uniqueCategories}</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-slate-400 text-sm mb-1">Last Updated</div>
          <div className="text-2xl font-bold text-blue-400">{lastUpdated}</div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search tiles by title, category, slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-800 divide-y divide-slate-700">
              {filteredTiles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                    No tiles found. Click &quot;Add New Tile&quot; to create one.
                  </td>
                </tr>
              ) : (
                filteredTiles.map((tile) => (
                  <tr key={tile._id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-white">{tile.title}</div>
                      <div className="text-xs text-slate-400 mt-1 line-clamp-2">{tile.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900 text-purple-200">
                        {tile.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">{tile.slug}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">
                      {new Date(tile.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openModal(tile)}
                          className="text-indigo-400 hover:text-indigo-300 transition-colors"
                          title="Edit tile"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        {tile._id && (
                          <button
                            onClick={() => deleteTile(tile._id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                            title="Delete tile"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        )}
                        <Link
                          href={tile.detailPath || '#'}
                          target="_blank"
                          className="text-green-400 hover:text-green-300 transition-colors"
                          title="View detail path"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            className="bg-slate-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-white">
                {editingTile ? 'Edit Shariah Tile' : 'Add New Shariah Tile'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Category Badge *
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 ${
                    validationErrors.category
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-600 focus:ring-indigo-500'
                  }`}
                  placeholder="Technology"
                />
                {validationErrors.category && (
                  <p className="text-red-400 text-xs mt-1">{validationErrors.category}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    const newSlug = sanitizedSlug(newTitle);
                    setFormData((prev) => ({
                      ...prev,
                      title: newTitle,
                      slug: newSlug,
                      detailPath: `/shariah/${newSlug}`,
                    }));
                  }}
                  className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 ${
                    validationErrors.title
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-600 focus:ring-indigo-500'
                  }`}
                  placeholder="Ethical Tech Fund"
                />
                {validationErrors.title && (
                  <p className="text-red-400 text-xs mt-1">{validationErrors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 ${
                    validationErrors.description
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-600 focus:ring-indigo-500'
                  }`}
                  rows={3}
                  placeholder="One or two sentences describing the fund"
                />
                {validationErrors.description && (
                  <p className="text-red-400 text-xs mt-1">{validationErrors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Footer Left Text *
                  </label>
                  <input
                    type="text"
                    value={formData.footerLeft}
                    onChange={(e) => setFormData({ ...formData, footerLeft: e.target.value })}
                    className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 ${
                      validationErrors.footerLeft
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-600 focus:ring-indigo-500'
                    }`}
                    placeholder="Shariah Compliant"
                  />
                  {validationErrors.footerLeft && (
                    <p className="text-red-400 text-xs mt-1">{validationErrors.footerLeft}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Footer Right Date *
                  </label>
                  <input
                    type="date"
                    value={formData.footerRight}
                    onChange={(e) => setFormData({ ...formData, footerRight: e.target.value })}
                    className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 ${
                      validationErrors.footerRight
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-600 focus:ring-indigo-500'
                    }`}
                  />
                  {validationErrors.footerRight && (
                    <p className="text-red-400 text-xs mt-1">{validationErrors.footerRight}</p>
                  )}
                </div>
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Compliance Rationale *
                </label>
                <div className="space-y-2">
                  {formData.compliancePoints.map((point, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={point}
                        onChange={(e) => {
                          const updated = [...formData.compliancePoints];
                          updated[index] = e.target.value;
                          setFormData({ ...formData, compliancePoints: updated });
                        }}
                        className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeCompliancePoint(index)}
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newCompliancePoint}
                      onChange={(e) => setNewCompliancePoint(e.target.value)}
                      placeholder="New compliance point..."
                      className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addCompliancePoint();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={addCompliancePoint}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  {validationErrors.compliancePoints && (
                    <p className="text-red-400 text-xs">{validationErrors.compliancePoints}</p>
                  )}
                </div>
              </div>

          {/* Compliance Metrics Section */}
          <div className="border-t border-slate-600 pt-6">
            <h3 className="text-xl font-semibold text-white border-b border-slate-700 pb-2">
              Compliance Metrics (Details Table)
            </h3>
            <p className="text-sm text-slate-400 mt-2">
              These entries power the Actual vs Threshold table on the Shariah details page. For
              numeric checks, choose a comparison type and we&apos;ll auto-evaluate Pass/Fail. Use
              the &quot;Manual&quot; option for qualitative criteria.
            </p>

            <div className="space-y-4 mt-4">
              {(!formData.complianceMetrics || formData.complianceMetrics.length === 0) && (
                <p className="text-sm text-gray-400">
                  No compliance metrics yet. Add one to get started.
                </p>
              )}

              {(formData.complianceMetrics || []).map((metric, index) => {
                const statusLabel = metricStatusLabel(metric);
                const isPass = metricIsPass(metric);
                return (
                  <div key={index} className="bg-slate-700 rounded-lg p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Criteria *
                        </label>
                        <input
                          type="text"
                          value={metric.criteria}
                          onChange={(e) =>
                            handleComplianceMetricChange(index, 'criteria', e.target.value)
                          }
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., Debt to Market Cap"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Threshold *
                        </label>
                        <input
                          type="text"
                          value={metric.threshold}
                          onChange={(e) =>
                            handleComplianceMetricChange(index, 'threshold', e.target.value)
                          }
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="< 33%"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Actual *
                        </label>
                        <input
                          type="text"
                          value={metric.actual}
                          onChange={(e) =>
                            handleComplianceMetricChange(index, 'actual', e.target.value)
                          }
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="0%"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Comparison Type *
                        </label>
                        <select
                          value={metric.comparisonType}
                          onChange={(e) =>
                            handleComplianceMetricChange(
                              index,
                              'comparisonType',
                              e.target.value as ComplianceMetric['comparisonType']
                            )
                          }
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="less_than">Actual ≤ Threshold</option>
                          <option value="greater_than">Actual ≥ Threshold</option>
                          <option value="equal">Actual = Threshold</option>
                          <option value="custom">Manual</option>
                        </select>
                      </div>
                    </div>

                    {metric.comparisonType === 'custom' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Manual Status
                        </label>
                        <select
                          value={metric.customStatus || 'pass'}
                          onChange={(e) =>
                            handleComplianceMetricChange(index, 'customStatus', e.target.value)
                          }
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="pass">Pass</option>
                          <option value="fail">Fail</option>
                        </select>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>
                        Computed status:{' '}
                        <span className={isPass ? 'text-green-400' : 'text-red-400'}>
                          {statusLabel}
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => removeComplianceMetric(index)}
                        className="px-3 py-1 text-sm text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}

              <button
                type="button"
                onClick={addComplianceMetric}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors w-full md:w-auto"
              >
                Add Compliance Metric
              </button>

              {validationErrors.complianceMetrics && (
                <p className="text-red-400 text-xs">{validationErrors.complianceMetrics}</p>
              )}
            </div>
          </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Analyst Notes *
                </label>
                <textarea
                  value={formData.analystNotes}
                  onChange={(e) => setFormData({ ...formData, analystNotes: e.target.value })}
                  className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 ${
                    validationErrors.analystNotes
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-600 focus:ring-indigo-500'
                  }`}
                  rows={4}
                  placeholder="Full analyst narrative used on the detail page."
                />
                {validationErrors.analystNotes && (
                  <p className="text-red-400 text-xs mt-1">{validationErrors.analystNotes}</p>
                )}
              </div>

              <div className="flex space-x-3 pt-4 border-t border-slate-700">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 rounded-lg transition-colors text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : editingTile ? 'Update Tile' : 'Create Tile'}
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

