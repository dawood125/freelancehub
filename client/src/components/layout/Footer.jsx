import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaTwitter, FaHeart } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { FiArrowRight } from "react-icons/fi";

const Footer = () => {
  const footerSections = [
    {
      title: "For Clients",
      links: [
        { name: "How to Hire", path: "/how-to-hire" },
        { name: "Find Freelancers", path: "/gigs" },
        { name: "Post a Project", path: "/post-project" },
        { name: "Payment Protection", path: "/payment-protection" },
      ],
    },
    {
      title: "For Freelancers",
      links: [
        { name: "How to Find Work", path: "/find-work" },
        { name: "Create a Gig", path: "/create-gig" },
        { name: "Pricing Guide", path: "/pricing-guide" },
        { name: "Community", path: "/community" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", path: "/about" },
        { name: "Careers", path: "/careers" },
        { name: "Blog", path: "/blog" },
        { name: "Contact", path: "/contact" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", path: "/help" },
        { name: "Trust & Safety", path: "/trust" },
        { name: "Terms of Service", path: "/terms" },
        { name: "Privacy Policy", path: "/privacy" },
      ],
    },
  ];

  const socialLinks = [
    { icon: <FaTwitter className="w-5 h-5" />, href: "#", label: "Twitter" },
    { icon: <FaLinkedin className="w-5 h-5" />, href: "#", label: "LinkedIn" },
    { icon: <FaGithub className="w-5 h-5" />, href: "#", label: "GitHub" },
  ];

  return (
    <footer className="relative bg-gray-950 text-gray-400 overflow-hidden mt-auto">
      {/* Top Decorative Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
      
      {/* Ambient Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] -z-10" />

      {/* 1. Newsletter Section */}
      <div className="border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="text-center lg:text-left space-y-2">
              <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Stay in the loop
              </h3>
              <p className="text-gray-500 max-w-md">
                Subscribe to our newsletter for the latest updates and exclusive offers.
              </p>
            </div>
            <div className="w-full max-w-md">
              <form className="flex flex-col sm:flex-row gap-3 p-1.5 bg-gray-900/50 rounded-2xl sm:rounded-full border border-gray-800 hover:border-gray-700 transition-all">
                <div className="flex items-center flex-1 px-4 py-2">
                  <HiOutlineMail className="w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full bg-transparent px-3 text-white placeholder:text-gray-600 outline-none text-sm"
                  />
                </div>
                <button className="px-8 py-3 bg-green-500 hover:bg-green-400 text-gray-950 text-sm font-bold rounded-xl sm:rounded-full transition-all active:scale-95 whitespace-nowrap">
                  Subscribe Now
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Links Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Changed grid-cols for better responsiveness */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-10">
          
          {/* Brand Column - Spans 2 on large screens */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <Link to="/" className="inline-flex items-center space-x-3 mb-6 group">
              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                <span className="text-gray-950 font-black text-xl">F</span>
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                Freelance<span className="text-green-500">Hub</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-sm">
              Connecting the world's best talent with the most ambitious projects. 
              Build your future, one gig at a time.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-2.5 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 hover:text-green-500 hover:border-green-500/50 transition-all"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {footerSections.map((section) => (
            <div key={section.title} className="col-span-1">
              <h4 className="text-white font-bold text-[13px] uppercase tracking-[0.15em] mb-6">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-sm hover:text-green-400 transition-colors inline-flex items-center group"
                    >
                      <span className="w-0 group-hover:w-1.5 h-1.5 bg-green-500 rounded-full transition-all duration-300 mr-0 group-hover:mr-2" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Bottom Bar */}
      <div className="border-t border-gray-900 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center md:items-start gap-1">
              <p className="text-sm">
                &copy; {new Date().getFullYear()} FreelanceHub Inc.
              </p>
              <p className="text-xs text-gray-600 flex items-center gap-1.5">
                Built with <FaHeart className="text-red-500/80 w-3" /> by 
                <span className="text-gray-400 font-medium">Dawood Ahmed</span>
              </p>
            </div>
            
            <div className="flex items-center gap-8 text-xs font-medium">
              <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link to="/cookies" className="hover:text-white transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
