import React, { useState } from 'react';
import { X, Globe, Flag, MapPin, Briefcase, Heart, Flame, Newspaper, Upload, Loader2 } from 'lucide-react';
import { createCircle } from '../../services/circlesApi';

interface CreateCircleModalProps {
  onClose: () => void;
  onCreated: () => void;
}

const CreateCircleModal: React.FC<CreateCircleModalProps> = ({ onClose, onCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    intention: '',
    scope: 'global',
    category: 'profession',
    image_url: '',
    country: '',
    city: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const scopes = [
    { id: 'local', label: 'Local', icon: MapPin, description: 'City or region specific' },
    { id: 'national', label: 'National', icon: Flag, description: 'Country-wide community' },
    { id: 'global', label: 'Global', icon: Globe, description: 'Worldwide community' },
  ];

  const categories = [
    { id: 'profession', label: 'Profession', icon: Briefcase },
    { id: 'interest', label: 'Interest', icon: Heart },
    { id: 'living', label: 'Living Topics', icon: Flame },
    { id: 'news', label: 'News & Events', icon: Newspaper },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Circle name is required');
      return;
    }
    if (!formData.intention.trim()) {
      setError('Circle intention is required');
      return;
    }

    setLoading(true);
    try {
      await createCircle({
        name: formData.name,
        description: formData.description || formData.intention,
        intention: formData.intention,
        scope: formData.scope,
        category: formData.category,
        image_url: formData.image_url || undefined,
        country: formData.scope !== 'global' ? formData.country : undefined,
        city: formData.scope === 'local' ? formData.city : undefined,
      });
      onCreated();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create circle');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Create a Circle</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Circle Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Circle Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Art Directors India"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Intention (One-liner) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Circle Intention * <span className="text-gray-400 font-normal">(one-liner)</span>
            </label>
            <input
              type="text"
              value={formData.intention}
              onChange={(e) => setFormData({ ...formData, intention: e.target.value })}
              placeholder="e.g., Connect and inspire Art Directors"
              maxLength={100}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tell people what this circle is about..."
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          {/* Scope Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Scope *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {scopes.map((scope) => {
                const Icon = scope.icon;
                const isSelected = formData.scope === scope.id;
                return (
                  <button
                    key={scope.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, scope: scope.id })}
                    className={`p-3 rounded-xl border-2 transition-all text-center ${
                      isSelected
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mx-auto mb-1 ${isSelected ? 'text-purple-600' : 'text-gray-500'}`} />
                    <div className={`text-sm font-medium ${isSelected ? 'text-purple-600' : 'text-gray-700'}`}>
                      {scope.label}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{scope.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location fields for local/national */}
          {formData.scope !== 'global' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="e.g., India"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              {formData.scope === 'local' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g., Mumbai"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              )}
            </div>
          )}

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = formData.category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.id })}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
                      isSelected
                        ? 'border-purple-500 bg-purple-50 text-purple-600'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Circle Image URL <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Upload className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Preview */}
          {formData.image_url && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <img
                src={formData.image_url}
                alt="Preview"
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
              <span className="text-sm text-gray-600">Image preview</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Circle'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCircleModal;
