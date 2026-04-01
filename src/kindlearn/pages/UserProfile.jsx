import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authApi } from '@/kindlearn/api/auth';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import ProfileEditForm from '@/kindlearn/components/profile/ProfileEditForm';

export default function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const currentUser = await authApi.me();
      setUser(currentUser);
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
    setLoading(false);
  };

  const handleProfileUpdate = async (updatedData) => {
    try {
      await authApi.updateMe(updatedData);
      setUser((prev) => ({ ...prev, ...updatedData }));
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Unable to load profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/kindlearn/dashboard')} aria-label="Back">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-extrabold">Profile Settings</h1>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} className="gap-2">
              <Upload className="w-4 h-4" /> Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 px-4 py-8">
        <div className="container mx-auto max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {isEditing ? (
              <ProfileEditForm
                user={user}
                onSave={handleProfileUpdate}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <ProfileView user={user} />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function ProfileView({ user }) {
  const socialLinks = [
    { key: 'twitter', label: 'Twitter', icon: '𝕏' },
    { key: 'instagram', label: 'Instagram', icon: '📷' },
    { key: 'facebook', label: 'Facebook', icon: '👍' },
    { key: 'linkedin', label: 'LinkedIn', icon: '💼' },
    { key: 'github', label: 'GitHub', icon: '🐙' },
  ];

  return (
    <div className="space-y-6">
      {/* Profile header */}
      <div className="bg-card rounded-3xl border p-8 text-center">
        <div className="relative inline-block mb-4">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.full_name}
              className="w-24 h-24 rounded-full object-cover shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <span className="text-3xl font-bold text-white">{user.full_name?.charAt(0) || '?'}</span>
            </div>
          )}
        </div>
        <h2 className="text-3xl font-extrabold text-foreground mb-1">{user.full_name}</h2>
        <p className="text-muted-foreground mb-4">{user.email}</p>
        {user.location && <p className="text-sm text-muted-foreground">📍 {user.location}</p>}
      </div>

      {/* Bio */}
      {user.bio && (
        <div className="bg-card rounded-2xl border p-6">
          <p className="text-sm text-muted-foreground mb-2">About</p>
          <p className="text-foreground leading-relaxed">{user.bio}</p>
        </div>
      )}

      {/* Learning goals */}
      {user.learning_goals && (
        <div className="bg-card rounded-2xl border p-6">
          <p className="text-sm text-muted-foreground mb-2">Learning Goals</p>
          <p className="text-foreground leading-relaxed">{user.learning_goals}</p>
        </div>
      )}

      {/* Social links */}
      <div className="bg-card rounded-2xl border p-6">
        <p className="text-sm text-muted-foreground mb-4 font-semibold">Social & Web</p>
        <div className="space-y-3">
          {user.website && (
            <a
              href={user.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <span className="text-xl">🌐</span>
              <div>
                <p className="font-semibold text-sm">Website</p>
                <p className="text-xs text-muted-foreground truncate">{user.website}</p>
              </div>
            </a>
          )}
          {user.phone && (
            <a
              href={`tel:${user.phone}`}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <span className="text-xl">📞</span>
              <div>
                <p className="font-semibold text-sm">Phone</p>
                <p className="text-xs text-muted-foreground">{user.phone}</p>
              </div>
            </a>
          )}
          {socialLinks.map((social) => {
            const value = user[social.key];
            if (!value) return null;
            const url = social.key === 'twitter'
              ? `https://twitter.com/${value.replace('@', '')}`
              : social.key === 'instagram'
              ? `https://instagram.com/${value.replace('@', '')}`
              : social.key === 'github'
              ? `https://github.com/${value}`
              : value;

            return (
              <a
                key={social.key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <span className="text-xl">{social.icon}</span>
                <div>
                  <p className="font-semibold text-sm">{social.label}</p>
                  <p className="text-xs text-muted-foreground truncate">{value}</p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}