import { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Camera, Save } from 'lucide-react';

export default function TeamDirectory() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ about: '', department: '' });
  const [selectedImage, setSelectedImage] = useState(null);
  const [teamMemberProfile, setTeamMemberProfile] = useState(null);
  const imageInputRef = useRef(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
    };
    fetchUser();
  }, []);

  const { data: teamMembers = [] } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: () => base44.entities.TeamMember.list(),
    initialData: [],
  });

  const { data: myProfile } = useQuery({
    queryKey: ['myProfile', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const members = await base44.entities.TeamMember.filter({ email: user.email });
      return members.length > 0 ? members[0] : null;
    },
    enabled: !!user?.email,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      if (myProfile?.id) {
        return base44.entities.TeamMember.update(myProfile.id, data);
      } else {
        return base44.entities.TeamMember.create({
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          ...data,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      setEditMode(false);
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async (file) => {
      const uploadedFile = await base44.integrations.Core.UploadFile({ file });
      return uploadedFile.file_url;
    },
    onSuccess: (imageUrl) => {
      updateProfileMutation.mutate({
        about: formData.about,
        department: formData.department,
        profile_image_url: imageUrl,
      });
    },
  });

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleSaveProfile = () => {
    if (selectedImage) {
      uploadImageMutation.mutate(selectedImage);
    } else {
      updateProfileMutation.mutate({
        about: formData.about,
        department: formData.department,
      });
    }
  };

  useEffect(() => {
    if (myProfile) {
      setFormData({
        about: myProfile.about || '',
        department: myProfile.department || '',
      });
    }
  }, [myProfile]);

  return (
    <div className="space-y-8">
      {/* My Profile Section */}
      {user && (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700 shadow-lg">
          <h1 className="text-3xl font-bold text-white mb-8">My Profile</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Image */}
            <div className="flex flex-col items-center">
              <div className="relative mb-6 group">
                <img
                  src={myProfile?.profile_image_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                  alt={user.full_name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                />
                {editMode && (
                  <button
                    onClick={() => imageInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full transition-all shadow-lg"
                  >
                    <Camera size={20} />
                  </button>
                )}
              </div>
              <input
                ref={imageInputRef}
                type="file"
                onChange={handleImageSelect}
                className="hidden"
                accept="image/*"
              />
              <h2 className="text-2xl font-bold text-white text-center">{user.full_name}</h2>
              <p className="text-slate-400 text-sm mt-1">{user.email}</p>
              <span className="mt-4 px-4 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium capitalize">
                {user.role}
              </span>
            </div>

            {/* Profile Info */}
            <div className="md:col-span-2 space-y-6">
              {editMode ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">About You (1-2 lines)</label>
                    <textarea
                      value={formData.about}
                      onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                      placeholder="Tell your team a bit about yourself..."
                      maxLength={200}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all h-20 resize-none"
                    />
                    <p className="text-xs text-slate-500 mt-1">{formData.about.length}/200</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Department</label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      placeholder="e.g., Engineering, Design, Marketing"
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSaveProfile}
                      disabled={updateProfileMutation.isPending || uploadImageMutation.isPending}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 disabled:opacity-50 text-white py-2 rounded-lg font-medium transition-all duration-200"
                    >
                      <Save size={18} /> Save Profile
                    </button>
                    <button
                      onClick={() => {
                        setEditMode(false);
                        setSelectedImage(null);
                      }}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg font-medium transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">About</p>
                    <p className="text-white text-lg leading-relaxed">
                      {myProfile?.about || 'No bio added yet'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Department</p>
                    <p className="text-white text-lg">{myProfile?.department || 'Not specified'}</p>
                  </div>
                  <button
                    onClick={() => setEditMode(true)}
                    className="bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
                  >
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Team Members Directory */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-white">Team Members</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all shadow-lg group"
            >
              <div className="flex flex-col items-center text-center">
                <img
                  src={member.profile_image_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.email}`}
                  alt={member.full_name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 shadow-lg mb-4 group-hover:scale-105 transition-transform"
                />
                <h3 className="text-lg font-bold text-white mb-1">{member.full_name}</h3>
                <p className="text-slate-400 text-sm mb-3">{member.email}</p>
                {member.department && (
                  <p className="text-slate-300 text-sm mb-3">{member.department}</p>
                )}
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium capitalize mb-3">
                  {member.role}
                </span>
                {member.about && (
                  <p className="text-slate-400 text-sm italic mt-2">{member.about}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}