import { Link, useNavigate } from "react-router-dom";
import LocalOfferIcon      from "@mui/icons-material/LocalOffer";
import ShoppingBagIcon     from "@mui/icons-material/ShoppingBag";
import ReceiptLongIcon     from "@mui/icons-material/ReceiptLong";
import PersonOutlineIcon   from "@mui/icons-material/PersonOutline";
import LockIcon            from "@mui/icons-material/Lock";
import ReplayIcon          from "@mui/icons-material/Replay";
import LocalShippingIcon   from "@mui/icons-material/LocalShipping";
import HeadsetMicIcon      from "@mui/icons-material/HeadsetMic";
import InstagramIcon       from "@mui/icons-material/Instagram";
import TwitterIcon         from "@mui/icons-material/Twitter";
import FacebookIcon        from "@mui/icons-material/Facebook";
import YouTubeIcon         from "@mui/icons-material/YouTube";
import logo from "../assets/logo.png";

/* ─── Global styles ───────────────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

  .sd-footer {
    background: #080808;
    border-top: 1px solid #1e1e1e;
    font-family: 'DM Sans', sans-serif;
    color: #e2e2e2;
  }

  /* ── trust bar ── */
  .sd-trust-bar {
    border-bottom: 1px solid #1e1e1e;
    background: #111111;
  }
  .sd-trust-inner {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 24px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    divide: none;
  }
  .sd-trust-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 22px 20px;
    border-right: 1px solid #1e1e1e;
    transition: background .2s;
  }
  .sd-trust-item:last-child { border-right: none; }
  .sd-trust-item:hover { background: rgba(233,185,73,.04); }
  .sd-trust-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: rgba(233,185,73,.08);
    border: 1px solid rgba(233,185,73,.15);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #E9B949;
    flex-shrink: 0;
  }
  .sd-trust-title {
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: #e2e2e2;
    margin-bottom: 2px;
  }
  .sd-trust-desc {
    font-size: 11px;
    color: #666666;
    line-height: 1.4;
  }

  /* ── main footer grid ── */
  .sd-footer-main {
    max-width: 1400px;
    margin: 0 auto;
    padding: 56px 24px 40px;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 48px;
  }

  /* brand column */
  .sd-footer-brand-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    margin-bottom: 16px;
  }
  .sd-footer-logo {
    width: 38px;
    height: 38px;
    object-fit: contain;
    filter: drop-shadow(0 0 6px rgba(233,185,73,.25));
    transition: filter .3s;
  }
  .sd-footer-brand-logo:hover .sd-footer-logo {
    filter: drop-shadow(0 0 12px rgba(233,185,73,.5));
  }
  .sd-footer-brand-name {
    font-family: 'Syne', sans-serif;
    font-size: 20px;
    font-weight: 800;
    color: #ffffff;
  }
  .sd-footer-brand-name em {
    color: #E9B949;
    font-style: normal;
  }
  .sd-footer-tagline {
    font-size: 13px;
    color: #666666;
    line-height: 1.7;
    margin-bottom: 20px;
    max-width: 280px;
  }

  /* newsletter */
  .sd-newsletter {
    display: flex;
    background: #141414;
    border: 1.5px solid #1e1e1e;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 24px;
    transition: border-color .2s;
  }
  .sd-newsletter:focus-within { border-color: #E9B949; }
  .sd-newsletter input {
    flex: 1;
    min-width: 0;
    background: transparent;
    border: none;
    outline: none;
    padding: 11px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: #e2e2e2;
  }
  .sd-newsletter input::placeholder { color: #666666; }
  .sd-newsletter button {
    background: #E9B949;
    border: none;
    padding: 11px 16px;
    font-family: 'Syne', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    color: #000;
    text-transform: uppercase;
    cursor: pointer;
    transition: background .2s;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .sd-newsletter button:hover { background: #f5c84e; }

  /* socials */
  .sd-socials {
    display: flex;
    gap: 8px;
  }
  .sd-social-btn {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    border: 1px solid #1e1e1e;
    background: #141414;
    color: #666666;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    transition: border-color .2s, color .2s, background .2s, transform .15s;
  }
  .sd-social-btn:hover {
    border-color: #E9B949;
    color: #E9B949;
    background: rgba(233,185,73,.08);
    transform: translateY(-2px);
  }

  /* link columns */
  .sd-footer-col-title {
    font-family: 'Syne', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.6px;
    text-transform: uppercase;
    color: #E9B949;
    margin-bottom: 18px;
  }
  .sd-footer-links {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .sd-footer-links a {
    font-size: 13px;
    color: #666666;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: color .2s, padding-left .2s;
  }
  .sd-footer-links a:hover {
    color: #e2e2e2;
    padding-left: 4px;
  }
  .sd-footer-links a::before {
    content: "▸";
    font-size: 10px;
    color: #1e1e1e;
    transition: color .2s;
    flex-shrink: 0;
  }
  .sd-footer-links a:hover::before { color: #E9B949; }

  /* ── bottom bar ── */
  .sd-footer-bottom {
    border-top: 1px solid #1e1e1e;
  }
  .sd-footer-bottom-inner {
    max-width: 1400px;
    margin: 0 auto;
    padding: 18px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }
  .sd-footer-copy {
    font-size: 12px;
    color: #666666;
  }
  .sd-footer-copy strong { color: #E9B949; font-weight: 600; }
  .sd-footer-legal {
    display: flex;
    gap: 20px;
  }
  .sd-footer-legal a {
    font-size: 12px;
    color: #666666;
    text-decoration: none;
    transition: color .2s;
  }
  .sd-footer-legal a:hover { color: #e2e2e2; }

  /* ── promo strip ── */
  .sd-footer-strip {
    background: #D0312D;
    text-align: center;
    padding: 7px 16px;
    font-family: 'Syne', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.6px;
    color: #fff;
    text-transform: uppercase;
  }

  /* ── Responsive ── */
  @media (max-width: 960px) {
    .sd-trust-inner {
      grid-template-columns: repeat(2, 1fr);
    }
    .sd-trust-item:nth-child(2) { border-right: none; }
    .sd-trust-item:nth-child(3) { border-right: 1px solid #1e1e1e; border-top: 1px solid #1e1e1e; }
    .sd-trust-item:nth-child(4) { border-right: none; border-top: 1px solid #1e1e1e; }

    .sd-footer-main {
      grid-template-columns: 1fr 1fr;
      gap: 36px;
      padding: 40px 24px 32px;
    }
    .sd-footer-brand-col { grid-column: 1 / -1; }
  }

  @media (max-width: 600px) {
    .sd-trust-inner { grid-template-columns: 1fr; }
    .sd-trust-item { border-right: none !important; border-top: 1px solid #1e1e1e; }
    .sd-trust-item:first-child { border-top: none; }

    .sd-footer-main {
      grid-template-columns: 1fr;
      gap: 28px;
      padding: 32px 20px 24px;
    }
    .sd-footer-brand-col { grid-column: auto; }
    .sd-footer-bottom-inner { flex-direction: column; text-align: center; }
    .sd-footer-legal { justify-content: center; }
    .sd-toolbar { padding: 0 14px; }
  }
`;

function StyleTag() {
  return <style dangerouslySetInnerHTML={{ __html: CSS }} />;
}

const TRUST = [
  {
    icon: <LocalShippingIcon style={{ fontSize: 20 }} />,
    title: "Free Delivery",
    desc: "On all orders above ₹499",
  },
  {
    icon: <LockIcon style={{ fontSize: 20 }} />,
    title: "Secure Payments",
    desc: "100% safe & encrypted checkout",
  },
  {
    icon: <ReplayIcon style={{ fontSize: 20 }} />,
    title: "Easy Returns",
    desc: "7-day hassle-free return policy",
  },
  {
    icon: <HeadsetMicIcon style={{ fontSize: 20 }} />,
    title: "24/7 Support",
    desc: "We're always here to help you",
  },
];

const LINKS = {
  Shop: [
    { label: "All Products",    to: "/products"  },
    { label: "Today's Deals",   to: "/products"  },
    { label: "New Arrivals",    to: "/products"  },
    { label: "Electronics",     to: "/products"  },
    { label: "Fashion",         to: "/products"  },
    { label: "Home & Kitchen",  to: "/products"  },
  ],
  Account: [
    { label: "Sign In",         to: "/login"     },
    { label: "Register",        to: "/register"  },
    { label: "My Orders",       to: "/orders/my" },
    { label: "My Cart",         to: "/cart"      },
    { label: "Wishlist",        to: "/"          },
  ],
  Help: [
    { label: "FAQs",            to: "/" },
    { label: "Shipping Policy", to: "/" },
    { label: "Return Policy",   to: "/" },
    { label: "Track Order",     to: "/" },
    { label: "Contact Us",      to: "/" },
  ],
};

const SOCIALS = [
  { icon: <InstagramIcon style={{ fontSize: 18 }} />, href: "#", label: "Instagram" },
  { icon: <TwitterIcon   style={{ fontSize: 18 }} />, href: "#", label: "Twitter"   },
  { icon: <FacebookIcon  style={{ fontSize: 18 }} />, href: "#", label: "Facebook"  },
  { icon: <YouTubeIcon   style={{ fontSize: 18 }} />, href: "#", label: "YouTube"   },
];

export default function Footer() {
  const navigate = useNavigate();

  const handleNewsletter = (e) => {
    e.preventDefault();
    const input = e.target.querySelector("input");
    if (input.value.trim()) {
      alert("Thanks for subscribing!");
      input.value = "";
    }
  };

  return (
    <>
      <StyleTag />

      <footer className="sd-footer">

        {/* ── Trust bar ── */}
        <div className="sd-trust-bar">
          <div className="sd-trust-inner">
            {TRUST.map((t) => (
              <div className="sd-trust-item" key={t.title}>
                <div className="sd-trust-icon">{t.icon}</div>
                <div>
                  <div className="sd-trust-title">{t.title}</div>
                  <div className="sd-trust-desc">{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Main grid ── */}
        <div className="sd-footer-main">

          {/* Brand column */}
          <div className="sd-footer-brand-col">
            <Link to="/" className="sd-footer-brand-logo">
              <img src={logo} alt="StealDeals" className="sd-footer-logo" />
              <span className="sd-footer-brand-name">
                Steal<em>Deals</em>
              </span>
            </Link>

            <p className="sd-footer-tagline">
              India's sharpest deals marketplace — unbeatable prices on
              electronics, fashion, home &amp; more. New steals added every day.
            </p>

            {/* Newsletter */}
            <form className="sd-newsletter" onSubmit={handleNewsletter}>
              <input type="email" placeholder="Get deals in your inbox…" />
              <button type="submit">Subscribe</button>
            </form>

            {/* Socials */}
            <div className="sd-socials">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="sd-social-btn"
                  aria-label={s.label}
                  target="_blank"
                  rel="noreferrer"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([heading, links]) => (
            <div key={heading}>
              <div className="sd-footer-col-title">{heading}</div>
              <ul className="sd-footer-links">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Promo strip ── */}
        <div className="sd-footer-strip">
          🔥&nbsp; Steal the deal — new offers dropped every single day!
        </div>

        {/* ── Bottom bar ── */}
        <div className="sd-footer-bottom">
          <div className="sd-footer-bottom-inner">
            <p className="sd-footer-copy">
              © {new Date().getFullYear()} <strong>StealDeals</strong>. All rights reserved.
              Made with ❤️ in India.
            </p>
            <nav className="sd-footer-legal">
              <Link to="/">Privacy Policy</Link>
              <Link to="/">Terms of Use</Link>
              <Link to="/">Cookie Policy</Link>
            </nav>
          </div>
        </div>

      </footer>
    </>
  );
}