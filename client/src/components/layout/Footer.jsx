import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";

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
    { icon: <FaTwitter className="w-4 h-4" />, href: "#", label: "Twitter" },
    { icon: <FaLinkedin className="w-4 h-4" />, href: "#", label: "LinkedIn" },
    { icon: <FaGithub className="w-4 h-4" />, href: "#", label: "GitHub" },
  ];

  return (
    <footer className="mt-auto border-t border-[color:var(--line)] bg-[color:var(--surface-soft)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-10">
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center text-white font-extrabold">
                F
              </div>
              <span className="text-xl font-extrabold text-[color:var(--text-1)] tracking-tight">
                Freelance<span className="text-[color:var(--accent)]">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-[color:var(--text-2)] max-w-sm leading-relaxed">
              Premium freelance marketplace for high-impact teams and world-class independent talent.
            </p>

            <form className="mt-6 p-2 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-card)] flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[color:var(--surface-soft)] border border-[color:var(--line)] flex items-center justify-center text-[color:var(--text-2)]">
                <HiOutlineMail className="w-5 h-5" />
              </div>
              <input
                type="email"
                placeholder="Get product and marketplace updates"
                className="flex-1 bg-transparent outline-none text-sm text-[color:var(--text-1)] placeholder:text-[color:var(--text-muted)]"
              />
              <button className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white brand-gradient hover:brightness-110 transition-all">
                Subscribe
              </button>
            </form>

            <div className="mt-5 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg border border-[color:var(--line)] bg-[color:var(--surface-card)] text-[color:var(--text-2)] hover:text-[color:var(--accent)] hover:border-[color:var(--accent)] transition-all flex items-center justify-center"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title} className="lg:col-span-1">
              <h4 className="text-xs uppercase tracking-[0.16em] font-semibold text-[color:var(--text-muted)] mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-sm text-[color:var(--text-2)] hover:text-[color:var(--accent)] transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-[color:var(--line)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-[color:var(--text-muted)]">
            © {new Date().getFullYear()} FreelanceHub. Built for modern builders.
          </p>
          <div className="flex items-center gap-5 text-xs text-[color:var(--text-muted)]">
            <Link to="/terms" className="hover:text-[color:var(--text-1)] transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-[color:var(--text-1)] transition-colors">Privacy</Link>
            <Link to="/cookies" className="hover:text-[color:var(--text-1)] transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
