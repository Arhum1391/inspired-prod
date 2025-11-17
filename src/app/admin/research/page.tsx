'use client';

import { useState, useEffect } from 'react';
import type { ResearchReport } from '@/data/researchReports';
import Link from 'next/link';

interface ContentSection {
  heading: string;
  body: string[];
}

export default function ResearchAdminPage() {
  const [reports, setReports] = useState<(ResearchReport & { _id?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingReport, setEditingReport] = useState<(ResearchReport & { _id?: string }) | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<ResearchReport>({
    slug: '',
    title: '',
    description: '',
    date: '',
    readTime: '',
    category: '',
    shariahCompliant: false,
    summaryPoints: [],
    pdfUrl: '',
    content: []
  });
  const [newSummaryPoint, setNewSummaryPoint] = useState('');
  const [newContentSection, setNewContentSection] = useState<ContentSection>({ heading: '', body: [] });
  const [newContentParagraph, setNewContentParagraph] = useState('');
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const importDummyData = async () => {
    if (!confirm('This will import all dummy research reports from the data file. Reports with existing slugs will be skipped. Continue?')) {
      return;
    }

    setImporting(true);

    try {
      const response = await fetch('/admin/api/research/populate', {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Import completed!\n- Inserted: ${data.insertedCount}\n- Skipped (already exist): ${data.skipped}\n- Total: ${data.total}`);
        await fetchReports();
      } else {
        const errorData = await response.json();
        alert(`Failed to import: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to import dummy data:', error);
      alert('Failed to import dummy data. Please try again.');
    } finally {
      setImporting(false);
    }
  };

  const fetchReports = async () => {
    try {
      const response = await fetch('/admin/api/research');
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      }
    } catch (error) {
      console.error('Failed to fetch research reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (report?: ResearchReport & { _id?: string }) => {
    if (report) {
      setEditingReport(report);
      setFormData({
        slug: report.slug,
        title: report.title,
        description: report.description,
        date: report.date,
        readTime: report.readTime,
        category: report.category,
        shariahCompliant: report.shariahCompliant,
        summaryPoints: report.summaryPoints || [],
        pdfUrl: report.pdfUrl || '',
        content: report.content || []
      });
    } else {
      setEditingReport(null);
      setFormData({
        slug: '',
        title: '',
        description: '',
        date: '',
        readTime: '',
        category: '',
        shariahCompliant: false,
        summaryPoints: [],
        pdfUrl: '',
        content: []
      });
    }
    setValidationErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingReport(null);
    setNewSummaryPoint('');
    setNewContentSection({ heading: '', body: [] });
    setNewContentParagraph('');
  };

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.slug.trim()) {
      errors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug.trim())) {
      errors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!formData.date.trim()) {
      errors.date = 'Date is required';
    }
    
    if (!formData.readTime.trim()) {
      errors.readTime = 'Read time is required';
    }
    
    if (!formData.category.trim()) {
      errors.category = 'Category is required';
    }
    
    if (formData.summaryPoints.length === 0) {
      errors.summaryPoints = 'At least one summary point is required';
    }
    
    if (formData.content.length === 0) {
      errors.content = 'At least one content section is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const url = editingReport?._id 
        ? `/admin/api/research/${editingReport._id}`
        : '/admin/api/research';
      
      const method = editingReport?._id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(editingReport ? 'Research report updated successfully!' : 'Research report created successfully!');
        await fetchReports();
        closeModal();
      } else {
        const errorData = await response.json();
        alert(`Failed to ${editingReport ? 'update' : 'create'}: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to save research report:', error);
      alert('Failed to save research report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteReport = async (id: string) => {
    if (!confirm('Are you sure you want to delete this research report?')) {
      return;
    }

    try {
      const response = await fetch(`/admin/api/research/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Research report deleted successfully!');
        await fetchReports();
      } else {
        const errorData = await response.json();
        alert(`Failed to delete: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to delete research report:', error);
      alert('Failed to delete research report. Please try again.');
    }
  };

  const addSummaryPoint = () => {
    if (newSummaryPoint.trim()) {
      setFormData({
        ...formData,
        summaryPoints: [...formData.summaryPoints, newSummaryPoint.trim()]
      });
      setNewSummaryPoint('');
    }
  };

  const removeSummaryPoint = (index: number) => {
    setFormData({
      ...formData,
      summaryPoints: formData.summaryPoints.filter((_, i) => i !== index)
    });
  };

  const addContentParagraph = () => {
    if (newContentParagraph.trim()) {
      setNewContentSection({
        ...newContentSection,
        body: [...newContentSection.body, newContentParagraph.trim()]
      });
      setNewContentParagraph('');
    }
  };

  const addContentSection = () => {
    if (newContentSection.heading.trim() && newContentSection.body.length > 0) {
      setFormData({
        ...formData,
        content: [...formData.content, { ...newContentSection }]
      });
      setNewContentSection({ heading: '', body: [] });
    }
  };

  const removeContentSection = (index: number) => {
    setFormData({
      ...formData,
      content: formData.content.filter((_, i) => i !== index)
    });
  };

  const updateContentSection = (index: number, field: 'heading' | 'body', value: string | string[]) => {
    const updatedContent = [...formData.content];
    updatedContent[index] = { ...updatedContent[index], [field]: value };
    setFormData({ ...formData, content: updatedContent });
  };

  const addParagraphToSection = (sectionIndex: number, paragraph: string) => {
    if (paragraph.trim()) {
      const updatedContent = [...formData.content];
      updatedContent[sectionIndex].body = [...updatedContent[sectionIndex].body, paragraph.trim()];
      setFormData({ ...formData, content: updatedContent });
    }
  };

  const removeParagraphFromSection = (sectionIndex: number, paragraphIndex: number) => {
    const updatedContent = [...formData.content];
    updatedContent[sectionIndex].body = updatedContent[sectionIndex].body.filter((_, i) => i !== paragraphIndex);
    setFormData({ ...formData, content: updatedContent });
  };

  const filteredReports = reports.filter(report => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      report.title.toLowerCase().includes(query) ||
      report.description.toLowerCase().includes(query) ||
      report.category.toLowerCase().includes(query) ||
      report.slug.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="glass-card rounded-2xl p-8 text-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-lg font-medium">Loading research reports...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Research Reports</h1>
          <p className="text-slate-400">Manage research reports and their content</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={importDummyData}
            disabled={importing}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            {importing ? 'Importing...' : 'Import Dummy Data'}
          </button>
          <button
            onClick={() => openModal()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Research
          </button>
          <Link
            href="/research"
            target="_blank"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View Public Page
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-slate-400 text-sm mb-1">Total Reports</div>
          <div className="text-2xl font-bold text-white">{reports.length}</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-slate-400 text-sm mb-1">Shariah Compliant</div>
          <div className="text-2xl font-bold text-green-400">
            {reports.filter(r => r.shariahCompliant).length}
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-slate-400 text-sm mb-1">Categories</div>
          <div className="text-2xl font-bold text-purple-400">
            {new Set(reports.map(r => r.category)).size}
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="text-slate-400 text-sm mb-1">With PDFs</div>
          <div className="text-2xl font-bold text-blue-400">
            {reports.filter(r => r.pdfUrl).length}
          </div>
        </div>
      </div>

      {/* Search */}
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
            placeholder="Search reports by title, description, category, or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Reports Table */}
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
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Shariah
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-800 divide-y divide-slate-700">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                    No reports found. Click "Add New Research" to create one.
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report.slug} className="hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-white">{report.title}</div>
                      <div className="text-xs text-slate-400 mt-1">{report.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900 text-purple-200">
                        {report.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">
                      {report.date}
                    </td>
                    <td className="px-6 py-4">
                      {report.shariahCompliant ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-200">
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                          No
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openModal(report)}
                          className="text-indigo-400 hover:text-indigo-300 transition-colors"
                          title="Edit report"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        {report._id && (
                          <button
                            onClick={() => deleteReport(report._id!)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                            title="Delete report"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                        <Link
                          href={`/research/${report.slug}`}
                          target="_blank"
                          className="text-purple-400 hover:text-purple-300 transition-colors"
                          title="View report"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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

      {/* Add/Edit Modal */}
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
                {editingReport ? 'Edit Research Report' : 'Add New Research Report'}
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
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white border-b border-slate-700 pb-2">
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Slug * (URL-friendly identifier)
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 ${
                        validationErrors.slug 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-slate-600 focus:ring-indigo-500'
                      }`}
                      placeholder="market-outlook-q2-2025"
                    />
                    {validationErrors.slug && (
                      <p className="text-red-400 text-xs mt-1">{validationErrors.slug}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Category *
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
                      placeholder="Market Analysis"
                    />
                    {validationErrors.category && (
                      <p className="text-red-400 text-xs mt-1">{validationErrors.category}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 ${
                      validationErrors.title 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-slate-600 focus:ring-indigo-500'
                    }`}
                    placeholder="Market Outlook Q2 2025"
                  />
                  {validationErrors.title && (
                    <p className="text-red-400 text-xs mt-1">{validationErrors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 ${
                      validationErrors.description 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-slate-600 focus:ring-indigo-500'
                    }`}
                    placeholder="A comprehensive analysis of current market conditions..."
                  />
                  {validationErrors.description && (
                    <p className="text-red-400 text-xs mt-1">{validationErrors.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Date *
                    </label>
                    <input
                      type="text"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 ${
                        validationErrors.date 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-slate-600 focus:ring-indigo-500'
                      }`}
                      placeholder="April 15, 2025"
                    />
                    {validationErrors.date && (
                      <p className="text-red-400 text-xs mt-1">{validationErrors.date}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Read Time *
                    </label>
                    <input
                      type="text"
                      value={formData.readTime}
                      onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                      className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 ${
                        validationErrors.readTime 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-slate-600 focus:ring-indigo-500'
                      }`}
                      placeholder="12 min read"
                    />
                    {validationErrors.readTime && (
                      <p className="text-red-400 text-xs mt-1">{validationErrors.readTime}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      PDF URL (optional)
                    </label>
                    <input
                      type="text"
                      value={formData.pdfUrl}
                      onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="/downloads/report.pdf"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="shariahCompliant"
                    checked={formData.shariahCompliant}
                    onChange={(e) => setFormData({ ...formData, shariahCompliant: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 bg-slate-700 border-slate-600 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="shariahCompliant" className="ml-2 text-sm font-medium text-gray-300">
                    Shariah Compliant
                  </label>
                </div>
              </div>

              {/* Summary Points */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white border-b border-slate-700 pb-2">
                  Summary Points *
                </h3>
                <div className="space-y-2">
                  {formData.summaryPoints.map((point, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={point}
                        onChange={(e) => {
                          const updated = [...formData.summaryPoints];
                          updated[index] = e.target.value;
                          setFormData({ ...formData, summaryPoints: updated });
                        }}
                        className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeSummaryPoint(index)}
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newSummaryPoint}
                      onChange={(e) => setNewSummaryPoint(e.target.value)}
                      placeholder="New summary point..."
                      className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSummaryPoint();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={addSummaryPoint}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  {validationErrors.summaryPoints && (
                    <p className="text-red-400 text-xs">{validationErrors.summaryPoints}</p>
                  )}
                </div>
              </div>

              {/* Content Sections */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white border-b border-slate-700 pb-2">
                  Content Sections *
                </h3>
                
                {/* Existing Content Sections */}
                <div className="space-y-4">
                  {formData.content.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="bg-slate-700 p-4 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-300">Section {sectionIndex + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeContentSection(sectionIndex)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                        >
                          Remove Section
                        </button>
                      </div>
                      <input
                        type="text"
                        value={section.heading}
                        onChange={(e) => updateContentSection(sectionIndex, 'heading', e.target.value)}
                        placeholder="Section heading..."
                        className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <div className="space-y-2">
                        {section.body.map((paragraph, paraIndex) => (
                          <div key={paraIndex} className="flex items-start gap-2">
                            <textarea
                              value={paragraph}
                              onChange={(e) => {
                                const updated = [...formData.content];
                                updated[sectionIndex].body = updated[sectionIndex].body.map((p, i) => i === paraIndex ? e.target.value : p);
                                setFormData({ ...formData, content: updated });
                              }}
                              rows={2}
                              className="flex-1 px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                              type="button"
                              onClick={() => removeParagraphFromSection(sectionIndex, paraIndex)}
                              className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition-colors mt-1"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <div className="flex items-start gap-2">
                          <textarea
                            value={newContentParagraph}
                            onChange={(e) => setNewContentParagraph(e.target.value)}
                            placeholder="New paragraph for this section..."
                            rows={2}
                            className="flex-1 px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                                e.preventDefault();
                                addParagraphToSection(sectionIndex, newContentParagraph);
                                setNewContentParagraph('');
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              addParagraphToSection(sectionIndex, newContentParagraph);
                              setNewContentParagraph('');
                            }}
                            className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
                          >
                            Add Para
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* New Content Section */}
                <div className="bg-slate-700 p-4 rounded-lg space-y-3 border-2 border-dashed border-slate-600">
                  <h4 className="text-sm font-medium text-gray-300">New Content Section</h4>
                  <input
                    type="text"
                    value={newContentSection.heading}
                    onChange={(e) => setNewContentSection({ ...newContentSection, heading: e.target.value })}
                    placeholder="Section heading..."
                    className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="space-y-2">
                    {newContentSection.body.map((paragraph, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <textarea
                          value={paragraph}
                          readOnly
                          rows={2}
                          className="flex-1 px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setNewContentSection({
                              ...newContentSection,
                              body: newContentSection.body.filter((_, i) => i !== index)
                            });
                          }}
                          className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition-colors mt-1"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <div className="flex items-start gap-2">
                      <textarea
                        value={newContentParagraph}
                        onChange={(e) => setNewContentParagraph(e.target.value)}
                        placeholder="Add paragraph to new section... (Press Ctrl+Enter to add)"
                        rows={2}
                        className="flex-1 px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                            e.preventDefault();
                            addContentParagraph();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={addContentParagraph}
                        className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
                      >
                        Add Para
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addContentSection}
                    className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                  >
                    Add Content Section
                  </button>
                </div>
                {validationErrors.content && (
                  <p className="text-red-400 text-xs">{validationErrors.content}</p>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex space-x-3 pt-4 border-t border-slate-700">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 rounded-lg transition-colors text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : (editingReport ? 'Update Report' : 'Create Report')}
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
