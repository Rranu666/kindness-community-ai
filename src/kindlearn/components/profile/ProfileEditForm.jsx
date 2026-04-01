import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { authApi } from '@/kindlearn/api/auth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Upload, X } from 'lucide-react';

export default function ProfileEditForm({ user, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    avatar: user.avatar || '',
    bio: user.bio || '',
    location: user.location || '',
    website: user.website || '',
    twitter: user.twitter || '',
    facebook: user.facebook || '',
    instagram: user.instagram || '',
    linkedin: user.linkedin || '',
    github: user.github || '',
    phone: user.phone || '',
    learning_goals: user.learning_goals || '',
  });

  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(user.avatar || '');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const result = await authApi.uploadFile(file);
      setFormData((prev) => ({ ...prev, avatar: result.file_url }));
      setPreviewUrl(result.file_url);
    } catch (error) {
      console.error('Failed to upload photo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Filter out empty fields
      const cleanData = Object.entries(formData).reduce((acc, [key, value]) => {
        if (value) acc[key] = value;
        return acc;
      }, {});

      await onSave(cleanData);
    } finally {
      setLoading(false);
    }
  };

  const socialFields = [
    { name: 'twitter', label: 'Twitter/X Handle', placeholder: '@yourhandle' },
    { name: 'instagram', label: 'Instagram Handle', placeholder: '@yourprofile' },
    { name: 'facebook', label: 'Facebook URL', placeholder: 'facebook.com/yourprofile' },
    { name: 'linkedin', label: 'LinkedIn URL', placeholder: 'linkedin.com/in/yourprofile' },
    { name: 'github', label: 'GitHub Username', placeholder: 'yourusername' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Photo upload */}
      <Card className="p-8">
        <p className="text-sm font-semibold text-muted-foreground mb-4">Profile Photo</p>
        <div className="flex items-center gap-6">
          <div className="relative">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-24 h-24 rounded-full object-cover shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                <span className="text-3xl font-bold text-white">{user.full_name?.charAt(0) || '?'}</span>
              </div>
            )}
            {previewUrl && (
              <button
                type="button"
                onClick={() => {
                  setPreviewUrl('');
                  setFormData((prev) => ({ ...prev, avatar: '' }));
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600"
                aria-label="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex-1">
            <label className="relative inline-flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-primary/30 rounded-xl cursor-pointer hover:border-primary/60 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={loading}
                className="hidden"
                aria-label="Upload profile photo"
              />
              <div className="text-center">
                <Upload className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-sm font-semibold">Upload Photo</p>
                <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
              </div>
            </label>
          </div>
        </div>
      </Card>

      {/* Basic info */}
      <Card className="p-6 space-y-4">
        <p className="text-sm font-semibold text-muted-foreground">Basic Information</p>
        <div>
          <label className="text-sm font-semibold text-foreground block mb-1">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself..."
            className="w-full px-3 py-2 rounded-lg border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            rows="3"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground block mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="City, Country"
            className="w-full px-3 py-2 rounded-lg border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground block mb-1">Learning Goals</label>
          <textarea
            name="learning_goals"
            value={formData.learning_goals}
            onChange={handleChange}
            placeholder="What are your learning goals?"
            className="w-full px-3 py-2 rounded-lg border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            rows="2"
          />
        </div>
      </Card>

      {/* Contact info */}
      <Card className="p-6 space-y-4">
        <p className="text-sm font-semibold text-muted-foreground">Contact & Web</p>
        <div>
          <label className="text-sm font-semibold text-foreground block mb-1">Website</label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://yourwebsite.com"
            className="w-full px-3 py-2 rounded-lg border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground block mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
            className="w-full px-3 py-2 rounded-lg border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </Card>

      {/* Social links */}
      <Card className="p-6 space-y-4">
        <p className="text-sm font-semibold text-muted-foreground">Social Media</p>
        <div className="grid grid-cols-2 gap-4">
          {socialFields.map((field) => (
            <div key={field.name}>
              <label className="text-sm font-semibold text-foreground block mb-1">{field.label}</label>
              <input
                type="text"
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="w-full px-3 py-2 rounded-lg border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}