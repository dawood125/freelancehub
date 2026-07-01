import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight, FiSearch, FiShield, FiZap } from "react-icons/fi";
import { HiOutlineChatBubbleLeftRight, HiOutlineSparkles } from "react-icons/hi2";
import { FaCode, FaPaintBrush, FaBullhorn, FaPenNib, FaVideo, FaMusic } from "react-icons/fa";
import Hero3D from "../../components/hero3d/Hero3D";

const categories = [
  { icon: <FaCode />, name: "Programming & Tech", gigs: "2,500+ services" },
  { icon: <FaPaintBrush />, name: "Graphics & Design", gigs: "1,800+ services" },
  { icon: <FaBullhorn />, name: "Digital Marketing", gigs: "1,200+ services" },
  { icon: <FaPenNib />, name: "Writing & Translation", gigs: "900+ services" },
  { icon: <FaVideo />, name: "Video & Animation", gigs: "700+ services" },
  { icon: <FaMusic />, name: "Music & Audio", gigs: "500+ services" },
];

const metrics = [
  { label: "Active Freelancers", value: "10K+" },
  { label: "Projects Delivered", value: "50K+" },
  { label: "Client Satisfaction", value: "99%" },
  { label: "Average Rating", value: "4.9" },
];

const features = [
  {
    icon: <FiShield className="w-5 h-5" />,
    title: "Protected Payments",
    desc: "Secure checkout and protected order flow with clear milestones.",
  },
  {
    icon: <HiOutlineChatBubbleLeftRight className="w-5 h-5" />,
    title: "Real Collaboration",
    desc: "Fast communication loops between clients and freelancers.",
  },
  {
    icon: <FiZap className="w-5 h-5" />,
    title: "Smart Discovery",
    desc: "Find the right expert quickly using focused search and filters.",
  },
  {
    icon: <HiOutlineSparkles className="w-5 h-5" />,
    title: "Premium Talent",
    desc: "Work with specialists who care about quality and delivery.",
  },
];

/* ----------------------------------------------------------------
   Animation variants — used to "assemble" the hero content on load
   ---------------------------------------------------------------- */
const heroContainerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 30, rotateX: -25, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const sectionFadeUp = {
  hidden: { opacity: 0, y: 60 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardHover = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -8,
    scale: 1.02,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const HomePage = () => {
  return (
    <div className="overflow-hidden">
      {/* ============= 3D HERO SECTION ============= */}
      <section className="relative min-h-[92vh] flex items-center">
        {/* 3D animated background */}
        <Hero3D />

        {/* Soft gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[color:var(--bg-1)]/30 to-[color:var(--bg-1)] pointer-events-none" />

        <motion.div
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-24 md:py-28 z-10"
          variants={heroContainerVariants}
          initial="hidden"
          animate="show"
          style={{ perspective: 1000 }}
        >
          {/* Badge pill */}
          <motion.div
            variants={heroItemVariants}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[color:var(--line)] bg-[color:var(--surface-card)]/70 backdrop-blur-md mb-8"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[color:var(--accent)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[color:var(--accent)]" />
            </span>
            <span className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-muted)] font-semibold">
              Premium freelance marketplace
            </span>
          </motion.div>

          {/* Big heading — word-by-word stagger */}
          <motion.h1
            variants={heroItemVariants}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.06] tracking-tight text-[color:var(--text-1)] max-w-4xl"
          >
            <motion.span
              className="inline-block"
              initial={{ opacity: 0, x: -40, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Build faster{" "}
            </motion.span>
            <br className="hidden sm:block" />
            <motion.span
              className="inline-block"
              initial={{ opacity: 0, x: 40, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              with{" "}
              <span className="text-gradient bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
                premium talent
              </span>
            </motion.span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={heroItemVariants}
            className="mt-6 text-base sm:text-lg text-[color:var(--text-2)] max-w-2xl leading-relaxed"
          >
            FreelanceHub connects ambitious teams with high-performing freelancers for design,
            development, marketing, and more.
          </motion.p>

          {/* Search bar with focus glow */}
          <motion.form
            variants={heroItemVariants}
            className="mt-9 max-w-3xl"
            onSubmit={(e) => e.preventDefault()}
          >
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileFocusWithin={{
                boxShadow: "0 0 0 4px rgba(167, 139, 250, 0.18)",
              }}
              transition={{ duration: 0.25 }}
              className="glass-card rounded-2xl p-2.5 flex flex-col sm:flex-row gap-2.5"
            >
              <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[color:var(--surface-soft)] border border-[color:var(--line)] flex-1">
                <FiSearch className="w-5 h-5 text-[color:var(--text-muted)]" />
                <input
                  type="text"
                  placeholder="Search services like UI design, React app, SEO..."
                  className="bg-transparent w-full outline-none text-[color:var(--text-1)] placeholder:text-[color:var(--text-muted)]"
                />
              </div>
              <Link
                to="/gigs"
                className="ui-btn-primary px-6 py-3.5 text-sm inline-flex items-center justify-center gap-2"
              >
                Search Services
                <FiArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.form>

          {/* Metrics with staggered reveal */}
          <motion.div
            variants={heroItemVariants}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10"
          >
            {metrics.map((item, idx) => (
              <motion.div
                key={item.label}
                initial="rest"
                whileHover="hover"
                animate="rest"
                variants={cardHover}
                custom={idx}
                transition={{ delay: 0.1 * idx }}
                className="ui-card p-4 rounded-2xl cursor-default backdrop-blur-sm"
              >
                <p className="text-xl sm:text-2xl font-extrabold text-[color:var(--text-1)]">
                  {item.value}
                </p>
                <p className="text-xs mt-1.5 text-[color:var(--text-muted)] uppercase tracking-[0.1em]">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ============= CATEGORIES ============= */}
      <motion.section
        className="py-18 md:py-24"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionFadeUp}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--text-1)]">
                Explore Categories
              </h2>
              <p className="text-[color:var(--text-2)] mt-2">
                Find specialists across the most in-demand services.
              </p>
            </div>
            <Link
              to="/gigs"
              className="text-sm font-semibold text-[color:var(--accent)] hover:opacity-85 inline-flex items-center gap-1.5"
            >
              View all services
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                  variants={cardHover}
                  className="h-full"
                >
                  <Link
                    to={`/gigs?search=${encodeURIComponent(category.name)}`}
                    className="ui-card rounded-2xl p-5 block transition-shadow hover:shadow-[0_16px_40px_rgba(139,92,246,0.18)] h-full"
                  >
                    <div className="w-12 h-12 rounded-xl brand-gradient text-white flex items-center justify-center text-lg mb-4">
                      {category.icon}
                    </div>
                    <h3 className="font-bold text-[color:var(--text-1)]">{category.name}</h3>
                    <p className="text-sm text-[color:var(--text-2)] mt-1.5">{category.gigs}</p>
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ============= FEATURES ============= */}
      <motion.section
        className="py-18 md:py-24"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionFadeUp}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="ui-card rounded-3xl p-6 sm:p-8 lg:p-10">
            <div className="max-w-3xl mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--text-1)]">
                Why teams choose FreelanceHub
              </h2>
              <p className="text-[color:var(--text-2)] mt-3">
                Practical collaboration tools, secure transactions, and premium talent quality.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, idx) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl p-5 border border-[color:var(--line)] bg-[color:var(--surface-soft)] hover:border-[color:var(--accent)] transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-[color:var(--surface-card)] border border-[color:var(--line)] text-[color:var(--accent)] flex items-center justify-center mb-3">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-[color:var(--text-1)]">{feature.title}</h3>
                  <p className="text-sm text-[color:var(--text-2)] mt-2 leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ============= CTA ============= */}
      <motion.section
        className="py-16 md:py-20"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionFadeUp}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="ui-card rounded-3xl p-8 sm:p-10 lg:p-14 relative overflow-hidden">
            <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-[26rem] h-[26rem] rounded-full blur-[110px] bg-[rgba(var(--accent-rgb),0.14)]" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[color:var(--text-1)] tracking-tight">
                Start your next project with confidence
              </h2>
              <p className="text-[color:var(--text-2)] mt-4 max-w-2xl mx-auto">
                Hire top talent or launch your freelance service with a modern marketplace built for quality.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/gigs"
                  className="ui-btn-primary px-7 py-3.5 text-sm inline-flex items-center justify-center gap-2"
                >
                  Hire Talent
                  <FiArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/create-gig"
                  className="ui-btn-secondary px-7 py-3.5 text-sm inline-flex items-center justify-center gap-2"
                >
                  Become a Seller
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;
