import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FiArrowLeft,
  FiCalendar,
  FiCheck,
  FiGlobe,
  FiMail,
  FiMapPin,
  FiStar,
  FiUser,
} from 'react-icons/fi';
import { HiOutlineAcademicCap, HiOutlineSparkles } from 'react-icons/hi2';
import userService from '../../services/userService';
import useAuthStore from '../../store/useAuthStore';

const PublicProfilePage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();

  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      if (!username) {
        setError('Profile not found');
        setIsLoading(false);
        return;
      }

      try {
        const response = await userService.getPublicProfile(username);
        setProfile(response.data.user);
      } catch (fetchError) {
        const message = fetchError.response?.data?.message || 'Profile not found';
        setError(message);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [username]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-(--bg) px-4">
        <div className="glass-card rounded-2xl px-6 py-5 flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-[rgba(var(--accent-rgb),0.25)] border-t-[rgb(var(--accent-rgb))] animate-spin" />
          <p className="text-sm font-medium text-(--text-2)">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-(--bg) px-4 py-12">
        <div className="glass-card w-full max-w-xl rounded-3xl p-8 sm:p-10 text-center">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center brand-gradient text-white">
            <FiUser className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-(--text-1) mb-2">Profile unavailable</h1>
          <p className="text-(--text-2) mb-6">{error || 'We could not load this profile.'}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="ui-btn-secondary px-5 py-3 rounded-xl font-semibold"
            >
              Go Back
            </button>
            <Link
              to="/gigs"
              className="ui-btn-primary px-5 py-3 rounded-xl font-semibold text-white text-center"
            >
              Browse Gigs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.username?.toLowerCase() === profile.username?.toLowerCase();
  const skillCount = profile.freelancerProfile?.skills?.length || 0;
  const isFreelancer = profile.currentRole === 'freelancer';

  return (
    <div className="min-h-screen bg-(--bg) py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/gigs"
          className="inline-flex items-center gap-2 text-sm text-(--text-2) hover:text-(--accent) transition-colors mb-6"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to marketplace
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="glass-card rounded-3xl shadow-xl overflow-hidden"
        >
          <div className="h-44 bg-linear-to-r from-green-500 via-emerald-500 to-teal-500 relative">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.45),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.2),transparent_28%)]" />
          </div>

          <div className="px-6 sm:px-8 pb-8 -mt-16 relative">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="flex flex-col sm:flex-row sm:items-end gap-5">
                <div className="w-32 h-32 rounded-3xl border-4 border-(--surface) shadow-xl overflow-hidden bg-(--bg-soft)">
                  {profile.avatar?.url ? (
                    <img
                      src={profile.avatar.url}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full brand-gradient flex items-center justify-center text-white text-4xl font-bold">
                      {profile.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                </div>

                <div className="pb-1">
                  <p className="text-(--text-3) text-sm mb-1">@{profile.username}</p>
                  <h1 className="text-3xl font-extrabold text-(--text-1)">{profile.name}</h1>
                  <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-(--text-2)">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(var(--accent-rgb),0.12)] text-[rgb(var(--accent-rgb))] border border-[rgba(var(--accent-rgb),0.22)] font-semibold">
                      {isFreelancer ? '💼 Freelancer' : '👤 Client'}
                    </span>
                    {profile.freelancerProfile?.level && isFreelancer && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[rgba(var(--warn-rgb),0.12)] text-amber-600 border border-[rgba(var(--warn-rgb),0.24)] font-semibold">
                        <HiOutlineSparkles className="w-3.5 h-3.5" />
                        {profile.freelancerProfile.level.replace('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())}
                      </span>
                    )}
                    {profile.isEmailVerified && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[rgba(var(--accent-rgb),0.1)] text-green-600 border border-[rgba(var(--accent-rgb),0.2)] font-semibold">
                        <FiCheck className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {isOwnProfile ? (
                  <Link
                    to="/profile"
                    className="ui-btn-primary px-5 py-3 rounded-xl text-white font-semibold"
                  >
                    Edit Profile
                  </Link>
                ) : (
                  <Link
                    to="/messages"
                    className="ui-btn-primary px-5 py-3 rounded-xl text-white font-semibold"
                  >
                    Open Messages
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 sm:px-8 pb-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="ui-card p-6">
                <h2 className="text-lg font-bold text-(--text-1) mb-3">About</h2>
                <p className="text-(--text-2) leading-relaxed">
                  {profile.bio || 'This user has not added a bio yet.'}
                </p>
              </div>

              <div className="ui-card p-6">
                <h2 className="text-lg font-bold text-(--text-1) mb-4 flex items-center gap-2">
                  <HiOutlineAcademicCap className="w-5 h-5 text-(--text-muted)" />
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skillCount > 0 ? (
                    profile.freelancerProfile.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 bg-(--bg-soft) text-(--text-2) text-sm font-medium rounded-lg border border-(--line)"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-(--text-muted) text-sm">No skills listed yet.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="ui-card p-6">
                <h2 className="text-lg font-bold text-(--text-1) mb-4">Overview</h2>
                <div className="space-y-4 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-(--text-2) flex items-center gap-2">
                      <FiStar className="w-4 h-4 text-amber-500" /> Rating
                    </span>
                    <span className="font-bold text-(--text-1)">
                      {profile.freelancerProfile?.averageRating?.toFixed(1) || '0.0'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-(--text-2)">Reviews</span>
                    <span className="font-bold text-(--text-1)">{profile.freelancerProfile?.totalReviews || 0}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-(--text-2)">Completed</span>
                    <span className="font-bold text-(--text-1)">{profile.freelancerProfile?.completedOrders || 0}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-(--text-2)">Earnings</span>
                    <span className="font-bold text-(--text-1)">
                      ${profile.freelancerProfile?.totalEarnings || 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="ui-card p-6">
                <h2 className="text-lg font-bold text-(--text-1) mb-4">Profile Details</h2>
                <div className="space-y-3 text-sm">
                  {profile.location?.country && (
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-(--text-2) flex items-center gap-2">
                        <FiMapPin className="w-4 h-4" /> Location
                      </span>
                      <span className="font-medium text-(--text-1) text-right">
                        {profile.location.city ? `${profile.location.city}, ` : ''}{profile.location.country}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-(--text-2) flex items-center gap-2">
                      <FiMail className="w-4 h-4" /> Email
                    </span>
                    <span className="font-medium text-(--text-1) text-right break-all">
                      {profile.email || 'Hidden'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-(--text-2) flex items-center gap-2">
                      <FiCalendar className="w-4 h-4" /> Joined
                    </span>
                    <span className="font-medium text-(--text-1) text-right">
                      {profile.createdAt
                        ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                        : 'Unknown'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-(--text-2) flex items-center gap-2">
                      <FiGlobe className="w-4 h-4" /> Role
                    </span>
                    <span className="font-medium text-(--text-1) text-right capitalize">
                      {profile.currentRole}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PublicProfilePage;