'use client';

import { useState, useEffect } from 'react';
import { ApiClient } from '../../apiClient/apiClient';

export default function CreateAd() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const apiClient = new ApiClient();
    if (!apiClient.isLoggedIn()) {
      window.location.href = '/unauthorized';
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price.trim()) newErrors.price = 'Price is required';
    else if (isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      newErrors.price = 'Please enter a valid price';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    if (validateForm()) {
      setLoading(true);
      try {
        const apiClient = new ApiClient();
        const response = await apiClient.addAd(formData.title, formData.description, formData.price);
        setSuccess(true);
        setFormData({ title: '', description: '', price: '' });
      } catch (err) {
        console.error('Error creating ad:', err.response || err); // Debug log
        setErrors({ 
          submit: err.response?.data?.message || 'Failed to create ad. Please try again.' 
        });
      }
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-purple-400 dark:text-purple mb-8">Create New Event</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
          <input 
            type="text" 
            id="title" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            className={`w-full px-4 py-2 rounded-lg border ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent`} 
            placeholder="Enter Event Title" 
          />
          {errors.title && (<p className="mt-1 text-sm text-red-500">{errors.title}</p>)}
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
          <textarea 
            id="description" 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            rows={4} 
            className={`w-full px-4 py-2 rounded-lg border ${errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent`} 
            placeholder="Enter Description (eg. Location, Time, and Event Type)" 
          />
          {errors.description && (<p className="mt-1 text-sm text-red-500">{errors.description}</p>)}
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price</label>
          <div className="relative">
            <span className="absolute left-4 top-2 text-gray-500 dark:text-gray-400">$</span>
            <input 
              type="text" 
              id="price" 
              name="price" 
              value={formData.price} 
              onChange={handleChange} 
              className={`w-full pl-8 pr-4 py-2 rounded-lg border ${errors.price ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent`} 
              placeholder="0.00" 
            />
          </div>
          {errors.price && (<p className="mt-1 text-sm text-red-500">{errors.price}</p>)}
        </div>
        {errors.submit && (<p className="text-red-500 text-sm">{errors.submit}</p>)}
        <button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-pink-700 transition-colors focus:outline-none focus:ring-2 focus:ring-white-500 focus:ring-offset-2 disabled:opacity-60"
        >
          {loading ? 'Creating...' : 'Create Advertisement'}
        </button>
        {success && (<p className="text-green-600 text-center mt-4">Ad created successfully!</p>)}
      </form>
    </div>
  );
}