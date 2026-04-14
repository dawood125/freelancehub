import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight, FiSearch, FiShield, FiZap } from "react-icons/fi";
import { HiOutlineChatBubbleLeftRight, HiOutlineSparkles } from "react-icons/hi2";
import { FaCode, FaPaintBrush, FaBullhorn, FaPenNib, FaVideo, FaMusic } from "react-icons/fa";

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

const HomePage = () => {
  return (
    <div className="overflow-hidden">
      <section className="relative min-h-[92vh] flex items-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-20 w-[40rem] h-[40rem] rounded-full blur-[110px] bg-[rgba(var(--accent-rgb),0.16)]" />
          <div className="absolute top-10 right-0 w-[34rem] h-[34rem] rounded-full blur-[120px] bg-[rgba(var(--accent-2-rgb),0.18)]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[52rem] h-[20rem] rounded-full blur-[120px] bg-[rgba(var(--ok-rgb),0.12)]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-24 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[color:var(--line)] bg-[color:var(--surface-card)] mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[color:var(--accent)] animate-pulse" />
            <span className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-muted)] font-semibold">
              Premium freelance marketplace
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.06] tracking-tight text-[color:var(--text-1)] max-w-4xl"
          >
            Build faster with
            <span className="text-gradient"> premium freelance talent</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="mt-6 text-base sm:text-lg text-[color:var(--text-2)] max-w-2xl leading-relaxed"
          >
            FreelanceHub connects ambitious teams with high-performing freelancers for design,
            development, marketing, and more.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="mt-9 max-w-3xl"
          >
            <div className="glass-card rounded-2xl p-2.5 flex flex-col sm:flex-row gap-2.5">
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
            </div>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10"
          >
            {metrics.map((item) => (
              <div key={item.label} className="ui-card p-4 rounded-2xl">
                <p className="text-xl sm:text-2xl font-extrabold text-[color:var(--text-1)]">{item.value}</p>
                <p className="text-xs mt-1.5 text-[color:var(--text-muted)] uppercase tracking-[0.1em]">
                  {item.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-18 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--text-1)]">Explore Categories</h2>
              <p className="text-[color:var(--text-2)] mt-2">Find specialists across the most in-demand services.</p>
            </div>
            <Link to="/gigs" className="text-sm font-semibold text-[color:var(--accent)] hover:opacity-85 inline-flex items-center gap-1.5">
              View all services
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
              >
                <Link
                  to={`/gigs?search=${encodeURIComponent(category.name)}`}
                  className="ui-card rounded-2xl p-5 block hover:-translate-y-1 hover:shadow-[0_16px_26px_rgba(15,23,42,0.12)] transition-all"
                >
                  <div className="w-12 h-12 rounded-xl brand-gradient text-white flex items-center justify-center text-lg mb-4">
                    {category.icon}
                  </div>
                  <h3 className="font-bold text-[color:var(--text-1)]">{category.name}</h3>
                  <p className="text-sm text-[color:var(--text-2)] mt-1.5">{category.gigs}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-18 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="ui-card rounded-3xl p-6 sm:p-8 lg:p-10">
            <div className="max-w-3xl mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--text-1)]">Why teams choose FreelanceHub</h2>
              <p className="text-[color:var(--text-2)] mt-3">
                Practical collaboration tools, secure transactions, and premium talent quality.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl p-5 border border-[color:var(--line)] bg-[color:var(--surface-soft)]"
                >
                  <div className="w-10 h-10 rounded-xl bg-[color:var(--surface-card)] border border-[color:var(--line)] text-[color:var(--accent)] flex items-center justify-center mb-3">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-[color:var(--text-1)]">{feature.title}</h3>
                  <p className="text-sm text-[color:var(--text-2)] mt-2 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
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
                <Link to="/gigs" className="ui-btn-primary px-7 py-3.5 text-sm inline-flex items-center justify-center gap-2">
                  Hire Talent
                  <FiArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/create-gig" className="ui-btn-secondary px-7 py-3.5 text-sm inline-flex items-center justify-center gap-2">
                  Become a Seller
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
