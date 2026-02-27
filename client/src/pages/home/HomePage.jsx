import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiSearch, FiArrowRight } from 'react-icons/fi';
import { 
  HiOutlineShieldCheck, 
  HiOutlineChatBubbleLeftRight, 
  HiOutlineCreditCard, 
  HiOutlineStar 
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

const HeroSection = () => {
  const popularSearches = ['Web Development', 'Logo Design', 'SEO', 'Mobile App', 'Video Editing'];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/5 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.1)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
            #1 Freelance Marketplace Platform
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
        >
          Find the perfect
          <span className="block mt-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
              freelance services
            </span>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10"
        >
          Connect with talented freelancers, get quality work done, 
          and grow your business with secure payments and real-time collaboration.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="relative flex items-center bg-white rounded-2xl shadow-2xl shadow-green-500/10 p-2">
            <FiSearch className="absolute left-6 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder='Try "Logo Design", "Web Development"...'
              className="w-full pl-14 pr-4 py-4 text-gray-800 bg-transparent outline-none text-lg placeholder:text-gray-400"
            />
            <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-green-500/30 transform hover:scale-[1.02] transition-all duration-300">
              Search
            </button>
          </div>
        </motion.div>

       
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <span className="text-gray-500 text-sm">Popular:</span>
          {popularSearches.map((search) => (
            <Link
              key={search}
              to={`/gigs?search=${search}`}
              className="px-4 py-1.5 text-sm text-gray-400 border border-gray-700 rounded-full hover:border-green-500 hover:text-green-400 transition-all duration-300"
            >
              {search}
            </Link>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-8 sm:gap-16 mt-16"
        >
          {[
            { number: '10K+', label: 'Active Freelancers' },
            { number: '50K+', label: 'Projects Completed' },
            { number: '4.9', label: 'Average Rating' },
            { number: '99%', label: 'Client Satisfaction' }
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white">{stat.number}</div>
              <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent" />
    </section>
  );
};


const TrustedBySection = () => {
  const companies = ['Google', 'Microsoft', 'Netflix', 'Spotify', 'Airbnb', 'Uber'];

  return (
    <section className="py-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-gray-400 text-sm font-medium mb-8 tracking-wider uppercase">
          Trusted by teams at
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-16">
          {companies.map((company) => (
            <motion.span
              key={company}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold text-gray-300 hover:text-gray-400 transition-colors duration-300 cursor-default"
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
    { icon: <FaCode />, name: 'Programming & Tech', gigs: '2,500+', color: 'from-blue-500 to-blue-600' },
    { icon: <FaPaintBrush />, name: 'Graphics & Design', gigs: '1,800+', color: 'from-pink-500 to-rose-600' },
    { icon: <FaBullhorn />, name: 'Digital Marketing', gigs: '1,200+', color: 'from-purple-500 to-purple-600' },
    { icon: <FaPen />, name: 'Writing & Translation', gigs: '900+', color: 'from-amber-500 to-orange-600' },
    { icon: <FaVideo />, name: 'Video & Animation', gigs: '700+', color: 'from-red-500 to-red-600' },
    { icon: <FaMusic />, name: 'Music & Audio', gigs: '500+', color: 'from-teal-500 to-teal-600' },
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Explore Popular Categories
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Find the right service for your needs from our wide range of categories
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={`/gigs?category=${category.name}`}
                className="group block bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-100 hover:border-green-200 transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white text-2xl mb-4 group-hover:scale-110 transition-transform duration-500`}>
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-gray-500 text-sm flex items-center">
                  {category.gigs} services available
                  <FiArrowRight className="ml-2 w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </p>
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
      color: 'from-green-500 to-emerald-600'
    },
    {
      step: '02',
      title: 'Place Your Order',
      description: 'Choose a package, submit your requirements, and pay securely through our escrow payment system.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      step: '03',
      title: 'Get Quality Work',
      description: 'Receive your deliverables on time. Request revisions if needed. Release payment when satisfied.',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-green-500 font-semibold text-sm tracking-wider uppercase">
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4">
            How FreelanceHub Works
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Get your project done in three simple steps
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-green-200 via-blue-200 to-purple-200" />

          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative text-center"
            >
              {/* Step Number Circle */}
              <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
                {item.step}
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-500 leading-relaxed max-w-sm mx-auto">
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
      icon: <HiOutlineShieldCheck className="w-7 h-7" />,
      title: 'Secure Payments',
      description: 'Your money is held safely in escrow until you approve the delivered work. 100% payment protection.'
    },
    {
      icon: <HiOutlineChatBubbleLeftRight className="w-7 h-7" />,
      title: 'Real-time Chat',
      description: 'Communicate directly with freelancers through our built-in messaging system. Share files and discuss projects.'
    },
    {
      icon: <HiOutlineCreditCard className="w-7 h-7" />,
      title: 'Flexible Pricing',
      description: 'Choose from multiple packages to fit your budget. Basic, Standard, and Premium options available.'
    },
    {
      icon: <HiOutlineStar className="w-7 h-7" />,
      title: 'Verified Reviews',
      description: 'Read honest reviews from real clients. Our rating system helps you find the best freelancers.'
    }
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-green-500 font-semibold text-sm tracking-wider uppercase">
              Why Choose Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-6">
              Everything you need for 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600"> successful projects</span>
            </h2>
            <p className="text-gray-500 text-lg mb-10">
              FreelanceHub provides all the tools and features you need to hire freelancers and manage projects effectively.
            </p>

            {/* Feature List */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-4 group cursor-default"
                >
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-500 group-hover:text-white transition-all duration-300">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Decorative Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Background decorative elements */}
              <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl" />
              <div className="absolute -bottom-4 -left-4 w-full h-full bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-3xl" />

              {/* Main card */}
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold">
                    A
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Ali Ahmed</h4>
                    <p className="text-gray-500 text-sm">Full Stack Developer</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <HiOutlineStar key={star} className="w-4 h-4 text-amber-400 fill-amber-400" />
                      ))}
                      <span className="text-gray-500 text-xs ml-1">5.0 (128)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="h-3 bg-gray-100 rounded-full w-full" />
                  <div className="h-3 bg-gray-100 rounded-full w-4/5" />
                  <div className="h-3 bg-gray-100 rounded-full w-3/5" />
                </div>

                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                  <span className="text-2xl font-bold text-gray-900">$50<span className="text-sm text-gray-500 font-normal">/project</span></span>
                  <button className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300">
                    Hire Now
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};


const CTASection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 px-8 py-16 sm:px-16 sm:py-20 text-center"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to get started?
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
              Join thousands of freelancers and clients who are already using FreelanceHub to grow their business.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-full hover:shadow-xl hover:shadow-green-500/30 transform hover:scale-105 transition-all duration-300 text-lg"
              >
                Get Started — It&apos;s Free
              </Link>
              <Link
                to="/gigs"
                className="px-8 py-4 border-2 border-gray-600 text-gray-300 font-semibold rounded-full hover:border-green-500 hover:text-green-400 transition-all duration-300 text-lg"
              >
                Browse Services
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HomePage;