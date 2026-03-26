import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Search, Mail, Phone, MapPin } from 'lucide-react';

export default function TeamDirectoryView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);

  const { data: teamMembers = [] } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: () => base44.entities.TeamMember.list(),
    initialData: [],
  });

  const filteredMembers = teamMembers.filter((member) =>
    member.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (member.department && member.department.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const groupedByDepartment = filteredMembers.reduce((acc, member) => {
    const dept = member.department || 'Other';
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(member);
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-3 gap-6 h-[calc(100vh-120px)]">
      {/* Members List */}
      <div className="col-span-2 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, email, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Members Grid */}
        <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-180px)]">
          {Object.entries(groupedByDepartment).map(([dept, members]) => (
            <div key={dept} className="space-y-3">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider px-2">{dept}</h3>
              <div className="grid grid-cols-1 gap-3">
                {members.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => setSelectedMember(member)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedMember?.id === member.id
                        ? 'bg-gradient-to-r from-blue-500/20 to-pink-500/20 border-blue-500'
                        : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex gap-3 items-start">
                      {member.profile_image_url ? (
                        <img
                          src={member.profile_image_url}
                          alt={member.full_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-pink-400 flex items-center justify-center text-white font-bold">
                          {member.full_name.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-white">{member.full_name}</p>
                        <p className="text-xs text-slate-400">{member.email}</p>
                        {member.department && (
                          <div className="mt-2">
                            <span className="inline-block bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-blue-300 text-xs px-2 py-1 rounded-full border border-blue-500/30">
                              {member.department}
                            </span>
                          </div>
                        )}
                      </div>
                      {member.is_active && (
                        <span className="text-xs bg-green-500/30 text-green-300 px-2 py-1 rounded">Online</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Member Details */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 shadow-lg p-6">
        {selectedMember ? (
          <div className="space-y-6">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              {selectedMember.profile_image_url ? (
                <img
                  src={selectedMember.profile_image_url}
                  alt={selectedMember.full_name}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-pink-400 flex items-center justify-center text-white text-4xl font-bold">
                  {selectedMember.full_name.charAt(0)}
                </div>
              )}
              <h2 className="text-xl font-bold text-white mt-4 text-center">{selectedMember.full_name}</h2>
              {selectedMember.is_active && (
                <span className="text-xs bg-green-500/30 text-green-300 px-3 py-1 rounded-full mt-2">🟢 Online</span>
              )}
            </div>

            {/* Info */}
            <div className="space-y-4 border-t border-slate-700 pt-6">
              {selectedMember.role && (
                <div className="space-y-1">
                  <p className="text-xs text-slate-400 uppercase font-semibold">Role</p>
                  <p className="text-white capitalize">{selectedMember.role.replace('_', ' ')}</p>
                </div>
              )}

              {selectedMember.department && (
                <div className="space-y-1">
                  <p className="text-xs text-slate-400 uppercase font-semibold">Department</p>
                  <p className="text-white">{selectedMember.department}</p>
                </div>
              )}

              <div className="space-y-1">
                <p className="text-xs text-slate-400 uppercase font-semibold">Email</p>
                <div className="flex items-center gap-2 text-white break-all">
                  <Mail size={16} className="text-blue-400 flex-shrink-0" />
                  <span>{selectedMember.email}</span>
                </div>
              </div>

              {selectedMember.about && (
                <div className="space-y-1">
                  <p className="text-xs text-slate-400 uppercase font-semibold">About</p>
                  <p className="text-slate-300 text-sm">{selectedMember.about}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-2 border-t border-slate-700 pt-6">
              <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 rounded-lg font-medium transition-all">
                Send Message
              </button>
              <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg font-medium transition-all">
                View Profile
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400">
            <p className="text-center">Select a team member to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}