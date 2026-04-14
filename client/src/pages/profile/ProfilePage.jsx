import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FiEdit3, FiMapPin, FiCalendar, FiMail, FiStar,
  FiCamera, FiCheck, FiX, FiBriefcase, FiGlobe
} from 'react-icons/fi';
import { HiOutlineAcademicCap, HiOutlineSparkles } from 'react-icons/hi2';
import userService from '../../services/userService';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editData, setEditData] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await userService.getMyProfile();
      setUser(response.data.user);
      setEditData({
        name: response.data.user.name || '',
        username: response.data.user.username || '',
        title: response.data.user.title || '',
        bio: response.data.user.bio || '',
        currentRole: response.data.user.currentRole || 'client',
        location: {
          country: response.data.user.location?.country || '',
          city: response.data.user.location?.city || '',
        },
        freelancerProfile: {
          skills: response.data.user.freelancerProfile?.skills || [],
          languages: response.data.user.freelancerProfile?.languages || [],
        },
      });
    } catch (error) {
      toast.error('Failed to load profile');
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };


  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;


    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      const response = await userService.uploadAvatar(file);
      setUser(prev => ({ ...prev, avatar: response.data.avatar }));

      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      storedUser.avatar = response.data.avatar;
      localStorage.setItem('user', JSON.stringify(storedUser));

      toast.success('Avatar updated! 📸');
    } catch (error) {
      toast.error('Failed to upload avatar');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await userService.updateProfile(editData);
      setUser(response.data.user);
      setIsEditing(false);

      localStorage.setItem('user', JSON.stringify(response.data.user));

      toast.success('Profile updated! ✨');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
    }
  };


  const handleChange = (field, value) => {
    setEditData(prev => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return {
          ...prev,
          [parent]: { ...prev[parent], [child]: value }
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleSkillAdd = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      const skill = e.target.value.trim().toLowerCase();
      const currentSkills = editData.freelancerProfile?.skills || [];

      if (currentSkills.length >= 15) {
        toast.error('Maximum 15 skills allowed');
        return;
      }

      if (currentSkills.includes(skill)) {
        toast.error('Skill already added');
        return;
      }

      setEditData(prev => ({
        ...prev,
        freelancerProfile: {
          ...prev.freelancerProfile,
          skills: [...currentSkills, skill]
        }
      }));
      e.target.value = '';
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setEditData(prev => ({
      ...prev,
      freelancerProfile: {
        ...prev.freelancerProfile,
        skills: prev.freelancerProfile.skills.filter(s => s !== skillToRemove)
      }
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[color:var(--bg)] py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ===== PROFILE HEADER CARD ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-3xl shadow-xl overflow-hidden mb-6"
        >
          {/* Banner */}
          <div className="h-40 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-10" />

            {/* Edit button */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="absolute top-4 right-4 px-4 py-2 bg-black/20 backdrop-blur-sm text-white text-sm font-medium rounded-xl hover:bg-black/30 transition-all duration-300 flex items-center gap-2"
            >
              {isEditing ? (
                <>
                  <FiX className="w-4 h-4" />
                  Cancel
                </>
              ) : (
                <>
                  <FiEdit3 className="w-4 h-4" />
                  Edit Profile
                </>
              )}
            </button>
          </div>

          {/* Profile Info */}
          <div className="px-8 pb-8 -mt-16 relative">
            {/* Avatar */}
            <div className="relative inline-block mb-4">
              <div className="w-32 h-32 rounded-2xl border-4 border-[color:var(--surface)] shadow-xl overflow-hidden bg-[color:var(--bg-soft)]">
                {user.avatar?.url ? (
                  <img
                    src={user.avatar.url}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full brand-gradient flex items-center justify-center text-white text-4xl font-bold">
                    {user.name?.charAt(0)?.toUpperCase()}
                  </div>
                )}

                {/* Upload overlay */}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
                    <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {/* Camera button */}
              {isEditing && (
                <label className="absolute bottom-1 right-1 w-10 h-10 bg-[rgb(var(--accent-rgb))] rounded-xl flex items-center justify-center text-white cursor-pointer hover:opacity-90 transition-opacity shadow-lg">
                  <FiCamera className="w-5 h-5" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Name & Title */}
            {isEditing ? (
              <div className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-semibold text-[color:var(--text-3)] uppercase tracking-wider mb-1.5">Name</label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="ui-input w-full px-4 py-2.5 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[color:var(--text-3)] uppercase tracking-wider mb-1.5">Username</label>
                  <input
                    type="text"
                    value={editData.username}
                    onChange={(e) => handleChange('username', e.target.value)}
                    className="ui-input w-full px-4 py-2.5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[color:var(--text-3)] uppercase tracking-wider mb-1.5">Professional Title</label>
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="e.g., Full Stack Developer"
                    className="ui-input w-full px-4 py-2.5"
                  />
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-extrabold text-[color:var(--text-1)]">{user.name}</h1>
                <p className="text-[color:var(--text-2)] text-sm">@{user.username}</p>
                {user.title && (
                  <p className="text-[color:var(--text-2)] font-medium mt-1 flex items-center gap-2">
                    <FiBriefcase className="w-4 h-4 text-[color:var(--text-muted)]" />
                    {user.title}
                  </p>
                )}
              </>
            )}

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-[color:var(--text-2)]">
              {user.location?.country && (
                <span className="flex items-center gap-1.5">
                  <FiMapPin className="w-4 h-4" />
                  {user.location.city && `${user.location.city}, `}{user.location.country}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <FiCalendar className="w-4 h-4" />
                Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-1.5">
                <FiMail className="w-4 h-4" />
                {user.email}
                {user.isEmailVerified && (
                  <FiCheck className="w-4 h-4 text-green-500" />
                )}
              </span>
            </div>

            {/* Role badge */}
            <div className="flex items-center gap-2 mt-4">
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                user.currentRole === 'freelancer'
                  ? 'bg-[rgba(var(--accent-rgb),0.12)] text-green-600 border border-[rgba(var(--accent-rgb),0.28)]'
                  : 'bg-[rgba(var(--accent-2-rgb),0.14)] text-blue-500 border border-[rgba(var(--accent-2-rgb),0.28)]'
              }`}>
                {user.currentRole === 'freelancer' ? '💼 Freelancer' : '👤 Client'}
              </span>
              {user.freelancerProfile?.level && user.currentRole === 'freelancer' && (
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[rgba(var(--warn-rgb),0.13)] text-amber-500 border border-[rgba(var(--warn-rgb),0.28)]">
                  <HiOutlineSparkles className="w-3 h-3 inline mr-1" />
                  {user.freelancerProfile.level.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* ===== DETAILS SECTION ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Bio & Skills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Bio */}
            <div className="ui-card p-6">
              <h3 className="text-lg font-bold text-[color:var(--text-1)] mb-4 flex items-center gap-2">
                <FiEdit3 className="w-5 h-5 text-[color:var(--text-muted)]" />
                About Me
              </h3>
              {isEditing ? (
                <textarea
                  value={editData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  placeholder="Tell clients about yourself, your experience, and what makes you unique..."
                  rows={5}
                  maxLength={1000}
                  className="ui-input w-full px-4 py-3 resize-none"
                />
              ) : (
                <p className="text-[color:var(--text-2)] leading-relaxed">
                  {user.bio || 'No bio added yet. Click "Edit Profile" to add one!'}
                </p>
              )}
            </div>

            {/* Skills */}
            <div className="ui-card p-6">
              <h3 className="text-lg font-bold text-[color:var(--text-1)] mb-4 flex items-center gap-2">
                <HiOutlineAcademicCap className="w-5 h-5 text-[color:var(--text-muted)]" />
                Skills
              </h3>
              {isEditing ? (
                <div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(editData.freelancerProfile?.skills || []).map(skill => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[rgba(var(--accent-rgb),0.12)] text-[rgb(var(--accent-rgb))] text-sm font-medium rounded-lg border border-[rgba(var(--accent-rgb),0.26)]"
                      >
                        {skill}
                        <button
                          onClick={() => handleSkillRemove(skill)}
                          className="text-[rgb(var(--accent-rgb))] hover:text-red-500 transition-colors"
                        >
                          <FiX className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Type a skill and press Enter..."
                    onKeyDown={handleSkillAdd}
                    className="ui-input w-full px-4 py-2.5 text-sm"
                  />
                  <p className="text-xs text-[color:var(--text-3)] mt-1.5">Press Enter to add. Max 15 skills.</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {user.freelancerProfile?.skills?.length > 0 ? (
                    user.freelancerProfile.skills.map(skill => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 bg-[color:var(--bg-soft)] text-[color:var(--text-2)] text-sm font-medium rounded-lg border border-[color:var(--line)]"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-[color:var(--text-muted)] text-sm">No skills added yet.</p>
                  )}
                </div>
              )}
            </div>

            {/* Location (Edit mode) */}
            {isEditing && (
              <div className="ui-card p-6">
                <h3 className="text-lg font-bold text-[color:var(--text-1)] mb-4 flex items-center gap-2">
                  <FiMapPin className="w-5 h-5 text-[color:var(--text-muted)]" />
                  Location
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[color:var(--text-3)] uppercase tracking-wider mb-1.5">Country</label>
                    <input
                      type="text"
                      value={editData.location?.country || ''}
                      onChange={(e) => handleChange('location.country', e.target.value)}
                      placeholder="e.g., Pakistan"
                      className="ui-input w-full px-4 py-2.5"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[color:var(--text-3)] uppercase tracking-wider mb-1.5">City</label>
                    <input
                      type="text"
                      value={editData.location?.city || ''}
                      onChange={(e) => handleChange('location.city', e.target.value)}
                      placeholder="e.g., Lahore"
                      className="ui-input w-full px-4 py-2.5"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Role Switching (Edit mode) */}
            {isEditing && (
              <div className="ui-card p-6">
                <h3 className="text-lg font-bold text-[color:var(--text-1)] mb-4 flex items-center gap-2">
                  <FiGlobe className="w-5 h-5 text-[color:var(--text-muted)]" />
                  Current Role
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {['client', 'freelancer'].map(role => (
                    <button
                      key={role}
                      onClick={() => handleChange('currentRole', role)}
                      className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                        editData.currentRole === role
                          ? 'border-green-500 bg-[rgba(var(--accent-rgb),0.1)]'
                          : 'border-[color:var(--line)] hover:border-[color:var(--line-strong)]'
                      }`}
                    >
                      <span className="text-2xl mb-2 block">{role === 'client' ? '👤' : '💼'}</span>
                      <p className="font-bold text-[color:var(--text-1)] capitalize">{role}</p>
                      <p className="text-xs text-[color:var(--text-3)] mt-0.5">
                        {role === 'client' ? 'Hire freelancers' : 'Offer services'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Right Column - Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Stats Card */}
            <div className="ui-card p-6">
              <h3 className="text-lg font-bold text-[color:var(--text-1)] mb-4">Stats</h3>
              <div className="space-y-4">
                {[
                  { label: 'Rating', value: user.freelancerProfile?.averageRating?.toFixed(1) || '0.0', icon: <FiStar className="w-4 h-4 text-amber-500" /> },
                  { label: 'Reviews', value: user.freelancerProfile?.totalReviews || 0, icon: '💬' },
                  { label: 'Completed', value: user.freelancerProfile?.completedOrders || 0, icon: '✅' },
                  { label: 'Earnings', value: `$${user.freelancerProfile?.totalEarnings || 0}`, icon: '💰' },
                ].map(stat => (
                  <div key={stat.label} className="flex items-center justify-between py-2 border-b border-[color:var(--line)] last:border-0">
                    <span className="text-[color:var(--text-2)] text-sm flex items-center gap-2">
                      <span className="text-base">{stat.icon}</span>
                      {stat.label}
                    </span>
                    <span className="font-bold text-[color:var(--text-1)]">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Status */}
            <div className="ui-card p-6">
              <h3 className="text-lg font-bold text-[color:var(--text-1)] mb-4">Verification</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[color:var(--text-2)] text-sm">Email</span>
                  {user.isEmailVerified ? (
                    <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                      <FiCheck className="w-4 h-4" /> Verified
                    </span>
                  ) : (
                    <span className="text-amber-600 text-sm font-medium">Pending</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[color:var(--text-2)] text-sm">Phone</span>
                  <span className="text-[color:var(--text-muted)] text-sm">Not added</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[color:var(--text-2)] text-sm">ID</span>
                  <span className="text-[color:var(--text-muted)] text-sm">Not verified</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ===== SAVE BUTTON (Edit mode) ===== */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <button
              onClick={handleSave}
              className="ui-btn-primary px-8 py-3.5 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-2"
            >
              <FiCheck className="w-5 h-5" />
              Save Changes
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;