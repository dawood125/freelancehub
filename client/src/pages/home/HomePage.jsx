import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiSearch, FiArrowRight, FiArrowUpRight } from 'react-icons/fi';
import {
  HiOutlineShieldCheck,
  HiOutlineChatBubbleLeftRight,
  HiOutlineCreditCard,
  HiOutlineStar,
} from 'react-icons/hi2';
import { FaCode, FaPaintBrush, FaBullhorn, FaPen, FaVideo, FaMusic } from 'react-icons/fa';

const HomePage = () => {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <TrustedBySection />
      <CategoriesSection />
      <HowItWorksSection />
      <FeaturesSection />
      <CTASection />
    </div>
  );
};

const FloatingElement = ({ children, delay = 0, duration = 3, y = 15 }) => (
  <motion.div
    animate={{
      y: [-y, y, -y],
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: 'easeInOut',
      delay,
    }}
  >
    {children}
  </motion.div>
);


const HeroSection = () => {
  const popularSearches = ['Web Development', 'Logo Design', 'SEO', 'Mobile App', 'Video Editing'];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#0a0f1c]" />

        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-green-500/15 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] translate-x-1/3" />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[120px] translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-green-500/5 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2" />

        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#0a0f1c] to-transparent" />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingElement delay={0} duration={4} y={20}>
          <div className="absolute top-32 right-[15%] hidden xl:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold">
                  ⭐
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">Top Rated</p>
                  <p className="text-gray-400 text-xs">4.9/5 Rating</p>
                </div>
              </div>
            </motion.div>
          </div>
        </FloatingElement>

        <FloatingElement delay={1} duration={5} y={15}>
          <div className="absolute top-30 left-[8%] hidden xl:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-lg">
                  💰
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">$2M+ Paid</p>
                  <p className="text-gray-400 text-xs">To freelancers</p>
                </div>
              </div>
            </motion.div>
          </div>
        </FloatingElement>

        <FloatingElement delay={2} duration={4.5} y={18}>
          <div className="absolute bottom-40 right-[10%] hidden xl:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-lg">
                  🚀
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">50K+ Projects</p>
                  <p className="text-gray-400 text-xs">Completed</p>
                </div>
              </div>
            </motion.div>
          </div>
        </FloatingElement>

        <FloatingElement delay={0.5} duration={6} y={30}>
          <div className="absolute top-40 left-[20%] w-3 h-3 rounded-full bg-green-400/30" />
        </FloatingElement>
        <FloatingElement delay={1.5} duration={5} y={25}>
          <div className="absolute top-60 right-[25%] w-2 h-2 rounded-full bg-emerald-400/40" />
        </FloatingElement>
        <FloatingElement delay={2.5} duration={7} y={20}>
          <div className="absolute bottom-60 left-[30%] w-4 h-4 rounded-full bg-teal-400/20" />
        </FloatingElement>

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/4 right-[20%] w-32 h-32 hidden lg:block"
        >
          <div className="w-full h-full rounded-full border border-dashed border-white/[0.06]" />
        </motion.div>

        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-1/4 left-[15%] w-48 h-48 hidden lg:block"
        >
          <div className="w-full h-full rounded-full border border-dashed border-white/[0.04]" />
        </motion.div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/[0.05] border border-white/[0.08] backdrop-blur-sm text-sm font-medium text-green-400">
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-green-400 rounded-full"
            />
            #1 Freelance Marketplace Platform
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl xl:text-[80px] font-extrabold text-white leading-[1.1] tracking-tight mb-8"
        >
          Find the perfect{' '}
          <br className="hidden sm:block" />
          <span className="relative">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400">
              freelance services
            </span>
            <motion.svg
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.8, ease: 'easeInOut' }}
              className="absolute -bottom-2 left-0 w-full"
              viewBox="0 0 400 12"
              fill="none"
            >
              <motion.path
                d="M2 8 C 50 2, 100 12, 150 6 S 250 2, 300 8 S 370 12, 398 4"
                stroke="url(#gradient)"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.8, ease: 'easeInOut' }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4ade80" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#34d399" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.6" />
                </linearGradient>
              </defs>
            </motion.svg>
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light"
        >
          Connect with talented freelancers, get quality work done, and grow your
          business with secure payments and real-time collaboration.
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="relative group">
            {/* Glow effect behind search bar */}
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative flex items-center bg-white/[0.07] backdrop-blur-xl border border-white/[0.1] rounded-2xl p-2 hover:border-white/[0.2] transition-all duration-500">
              <FiSearch className="absolute left-5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder='Try "Logo Design", "Web Development"...'
                className="w-full pl-13 pr-4 py-4 text-white bg-transparent outline-none text-base placeholder:text-gray-500 pl-14"
              />
              <button className="px-7 py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-green-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 whitespace-nowrap">
                Search
              </button>
            </div>
          </div>
        </motion.div>

        {/* Popular Searches */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-16"
        >
          <span className="text-gray-500 text-sm mr-1">Popular:</span>
          {popularSearches.map((search, index) => (
            <motion.div
              key={search}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.6 + index * 0.08 }}
            >
              <Link
                to={`/gigs?search=${search}`}
                className="px-4 py-1.5 text-sm text-gray-400 bg-white/[0.04] border border-white/[0.06] rounded-full hover:border-green-500/40 hover:text-green-400 hover:bg-green-500/5 transition-all duration-300"
              >
                {search}
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto"
        >
          {[
            { number: '10K+', label: 'Active Freelancers', icon: '👨‍💻' },
            { number: '50K+', label: 'Projects Completed', icon: '✅' },
            { number: '4.9', label: 'Average Rating', icon: '⭐' },
            { number: '99%', label: 'Satisfaction Rate', icon: '💚' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              className="relative group cursor-default"
            >
              <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-5 hover:bg-white/[0.06] hover:border-white/[0.1] transition-all duration-500">
                <span className="text-lg mb-2 block">{stat.icon}</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {stat.number}
                </div>
                <div className="text-gray-500 text-xs mt-1 font-medium">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom gradient fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-50 to-transparent" />
    </section>
  );
};


const TrustedBySection = () => {
  const companies = ['Google', 'Microsoft', 'Netflix', 'Spotify', 'Airbnb', 'Uber'];

  return (
    <section className="py-16 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-gray-400 text-xs font-semibold mb-10 tracking-[0.2em] uppercase"
        >
          Trusted by top companies worldwide
        </motion.p>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 sm:gap-x-16">
          {companies.map((company, index) => (
            <motion.span
              key={company}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="text-xl sm:text-2xl font-bold text-gray-300/70 hover:text-green-500/60 transition-all duration-500 cursor-default select-none"
            >
              {company}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
};

const CategoriesSection = () => {
  const categories = [
    { icon: <FaCode />, name: 'Programming & Tech', gigs: '2,500+', color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50', text: 'text-blue-600' },
    { icon: <FaPaintBrush />, name: 'Graphics & Design', gigs: '1,800+', color: 'from-pink-500 to-rose-600', bg: 'bg-pink-50', text: 'text-pink-600' },
    { icon: <FaBullhorn />, name: 'Digital Marketing', gigs: '1,200+', color: 'from-purple-500 to-violet-600', bg: 'bg-purple-50', text: 'text-purple-600' },
    { icon: <FaPen />, name: 'Writing & Translation', gigs: '900+', color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50', text: 'text-amber-600' },
    { icon: <FaVideo />, name: 'Video & Animation', gigs: '700+', color: 'from-red-500 to-rose-600', bg: 'bg-red-50', text: 'text-red-600' },
    { icon: <FaMusic />, name: 'Music & Audio', gigs: '500+', color: 'from-teal-500 to-cyan-600', bg: 'bg-teal-50', text: 'text-teal-600' },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-green-50 text-green-600 text-xs font-bold tracking-[0.15em] uppercase rounded-full mb-4">
            Categories
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-5">
            Explore Popular Categories
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto font-light">
            Find the right service for your needs from our wide range of professional categories
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <Link
                to={`/gigs?category=${category.name}`}
                className="group relative block bg-white rounded-2xl p-6 border border-gray-100 hover:border-transparent hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 hover:-translate-y-2"
              >
                {/* Hover gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} rounded-2xl opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />

                <div className="relative">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl ${category.bg} flex items-center justify-center ${category.text} text-xl mb-5 group-hover:scale-110 transition-transform duration-500`}>
                    {category.icon}
                  </div>

                  {/* Text */}
                  <h3 className="text-lg font-bold text-gray-900 mb-1.5 group-hover:text-gray-900 transition-colors">
                    {category.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-400 text-sm font-medium">
                      {category.gigs} services
                    </p>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-green-50 group-hover:text-green-600 text-gray-300 transition-all duration-300">
                      <FiArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorksSection = () => {
  const steps = [
    {
      step: '01',
      title: 'Search & Find',
      description: 'Browse thousands of services or search for exactly what you need. Filter by price, rating, and delivery time.',
      icon: '🔍',
      color: 'from-green-500 to-emerald-600',
    },
    {
      step: '02',
      title: 'Place Your Order',
      description: 'Choose a package, submit your requirements, and pay securely through our escrow payment system.',
      icon: '🛒',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      step: '03',
      title: 'Get Quality Work',
      description: 'Receive your deliverables on time. Request revisions if needed. Release payment when satisfied.',
      icon: '🎉',
      color: 'from-purple-500 to-violet-600',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-green-100/50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-emerald-100/50 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1.5 bg-green-50 text-green-600 text-xs font-bold tracking-[0.15em] uppercase rounded-full mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-5">
            How FreelanceHub Works
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto font-light">
            Get your project done in three simple steps
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-[2px]">
            <div className="w-full h-full bg-gradient-to-r from-green-200 via-blue-200 to-purple-200 rounded-full" />
          </div>

          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative text-center group"
            >
              {/* Circle */}
              <div className="relative mx-auto mb-8 w-32 h-32">
                {/* Outer ring - appears on hover */}
                <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 scale-90 group-hover:scale-100 transition-all duration-700`} />

                {/* Main circle */}
                <div className="absolute inset-3 rounded-full bg-white shadow-xl flex items-center justify-center group-hover:shadow-2xl transition-all duration-500">
                  <span className="text-4xl group-hover:scale-110 transition-transform duration-500">{item.icon}</span>
                </div>

                {/* Step number badge */}
                <div className={`absolute -top-1 -right-1 w-9 h-9 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white text-xs font-bold shadow-lg`}>
                  {item.step}
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-500 leading-relaxed max-w-xs mx-auto font-light">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: <HiOutlineShieldCheck className="w-6 h-6" />,
      title: 'Secure Payments',
      description: 'Your money is held safely in escrow until you approve the delivered work.',
      color: 'from-green-500 to-emerald-600',
      bg: 'bg-green-50',
      text: 'text-green-600',
    },
    {
      icon: <HiOutlineChatBubbleLeftRight className="w-6 h-6" />,
      title: 'Real-time Chat',
      description: 'Communicate directly with freelancers through our messaging system.',
      color: 'from-blue-500 to-indigo-600',
      bg: 'bg-blue-50',
      text: 'text-blue-600',
    },
    {
      icon: <HiOutlineCreditCard className="w-6 h-6" />,
      title: 'Flexible Pricing',
      description: 'Choose from Basic, Standard, and Premium packages to fit your budget.',
      color: 'from-purple-500 to-violet-600',
      bg: 'bg-purple-50',
      text: 'text-purple-600',
    },
    {
      icon: <HiOutlineStar className="w-6 h-6" />,
      title: 'Verified Reviews',
      description: 'Read honest reviews from real clients to find the best freelancers.',
      color: 'from-amber-500 to-orange-600',
      bg: 'bg-amber-50',
      text: 'text-amber-600',
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-50/50 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-green-50 text-green-600 text-xs font-bold tracking-[0.15em] uppercase rounded-full mb-4">
              Why Choose Us
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
              Everything you need for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">
                successful projects
              </span>
            </h2>
            <p className="text-gray-500 text-lg mb-12 font-light leading-relaxed">
              FreelanceHub provides all the tools and features you need to hire
              freelancers and manage projects effectively.
            </p>

            {/* Features */}
            <div className="space-y-5">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex gap-4 group cursor-default p-4 rounded-2xl hover:bg-gray-50 transition-all duration-300"
                >
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${feature.bg} ${feature.text} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed font-light">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Decorative Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            {/* Background decorations */}
            <div className="absolute -z-10 -top-6 -right-6 w-full h-full bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl" />
            <div className="absolute -z-10 -bottom-6 -left-6 w-full h-full bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl" />

            {/* Main card */}
            <FloatingElement delay={0} duration={5} y={10}>
              <div className="relative bg-white rounded-3xl shadow-2xl shadow-gray-200/50 p-8 border border-gray-100">
                {/* Profile */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-green-500/20">
                    A
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Ali Ahmed</h4>
                    <p className="text-gray-500 text-sm">Full Stack Developer</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="text-amber-400 text-sm">★</span>
                      ))}
                      <span className="text-gray-400 text-xs ml-1 font-medium">5.0 (128)</span>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {['React', 'Node.js', 'MongoDB', 'TypeScript'].map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-lg border border-gray-100">
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-xs font-medium mb-1">Starting at</p>
                      <span className="text-3xl font-extrabold text-gray-900">$50</span>
                    </div>
                    <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300">
                      Hire Now →
                    </button>
                  </div>
                </div>
              </div>
            </FloatingElement>

            {/* Small floating badge */}
            <FloatingElement delay={1.5} duration={4} y={12}>
              <div className="absolute -top-4 -left-8 bg-white rounded-2xl shadow-xl p-3 border border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎉</span>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Order Complete!</p>
                    <p className="text-[10px] text-gray-400">2 minutes ago</p>
                  </div>
                </div>
              </div>
            </FloatingElement>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2rem] bg-[#0a0f1c]"
        >
          {/* Background effects */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
            <div
              className="absolute inset-0 opacity-[0.15]"
              style={{
                backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)`,
                backgroundSize: '30px 30px',
              }}
            />
          </div>

          {/* Content */}
          <div className="relative px-8 py-20 sm:px-16 sm:py-24 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6"
            >
              Ready to get started?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-400 text-lg max-w-2xl mx-auto mb-10 font-light"
            >
              Join thousands of freelancers and clients who are already using
              FreelanceHub to grow their business.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to="/register"
                className="group px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-full hover:shadow-xl hover:shadow-green-500/25 hover:scale-105 active:scale-100 transition-all duration-300 text-base flex items-center gap-2"
              >
                Get Started — It&apos;s Free
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                to="/gigs"
                className="px-8 py-4 border border-gray-700 text-gray-300 font-semibold rounded-full hover:border-green-500/50 hover:text-green-400 hover:bg-green-500/5 transition-all duration-300 text-base"
              >
                Browse Services
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HomePage;