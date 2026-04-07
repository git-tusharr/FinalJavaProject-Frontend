import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  Box, Typography, Button, Grid, Card,
  CardContent, CardActionArea, Chip,
} from "@mui/material";
import ShoppingBagIcon   from "@mui/icons-material/ShoppingBag";
import LocalOfferIcon    from "@mui/icons-material/LocalOffer";
import ArrowForwardIcon  from "@mui/icons-material/ArrowForward";
import BoltIcon          from "@mui/icons-material/Bolt";
import PhoneAndroidIcon  from "@mui/icons-material/PhoneAndroid";
import HeadphonesIcon    from "@mui/icons-material/Headphones";
import CheckroomIcon     from "@mui/icons-material/Checkroom";
import WeekendIcon       from "@mui/icons-material/Weekend";
import SportsIcon        from "@mui/icons-material/Sports";
import MenuBookIcon      from "@mui/icons-material/MenuBook";

/* ══════════════════════════════════════════
   BRAND TOKENS
══════════════════════════════════════════ */
const T = {
  black:   "#080808",
  surface: "#111111",
  card:    "#141414",
  border:  "#1e1e1e",
  gold:    "#E9B949",
  goldHov: "#f5c84e",
  goldDim: "rgba(233,185,73,.08)",
  red:     "#D0312D",
  redDim:  "rgba(208,49,45,.12)",
  text:    "#e2e2e2",
  muted:   "#555555",
  green:   "#4ade80",
};
const SYNE = "'Syne', sans-serif";
const DM   = "'DM Sans', sans-serif";

/* ══════════════════════════════════════════
   STATIC DATA
══════════════════════════════════════════ */
const CATEGORIES = [
  { name: "Mobiles",     icon: <PhoneAndroidIcon sx={{ fontSize: 22 }} />, count: "240+" },
  { name: "Electronics", icon: <HeadphonesIcon   sx={{ fontSize: 22 }} />, count: "180+" },
  { name: "Fashion",     icon: <CheckroomIcon    sx={{ fontSize: 22 }} />, count: "320+" },
  { name: "Home",        icon: <WeekendIcon      sx={{ fontSize: 22 }} />, count: "150+" },
  { name: "Sports",      icon: <SportsIcon       sx={{ fontSize: 22 }} />, count: "90+"  },
  { name: "Books",       icon: <MenuBookIcon     sx={{ fontSize: 22 }} />, count: "200+" },
];

const PRODUCTS = [
  { id: 1, name: "Wireless Earbuds Pro",   price: 999,  mrp: 1999, pct: 50, tag: "HOT"  },
  { id: 2, name: "Smart Watch Series X",   price: 2499, mrp: 4999, pct: 50, tag: "NEW"  },
  { id: 3, name: "Running Shoes Ultra",    price: 1299, mrp: 2499, pct: 48, tag: null   },
  { id: 4, name: "Portable Power Bank",    price: 599,  mrp: 1299, pct: 54, tag: "DEAL" },
  { id: 5, name: "Mechanical Keyboard",    price: 1799, mrp: 3499, pct: 49, tag: null   },
  { id: 6, name: "Backpack Compact 30L",   price: 899,  mrp: 1799, pct: 50, tag: "NEW"  },
  { id: 7, name: "Desk LED Lamp",          price: 449,  mrp: 899,  pct: 50, tag: null   },
  { id: 8, name: "Bluetooth Speaker Mini", price: 799,  mrp: 1599, pct: 50, tag: "HOT"  },
];

const STATS = [
  { num: "50K+",   lbl: "Happy Customers" },
  { num: "10K+",   lbl: "Products Listed" },
  { num: "Rs.999", lbl: "Deals From"      },
  { num: "24hr",   lbl: "Fast Delivery"   },
];

const TICKER_ITEMS = [
  "Flash Sale — 60% OFF on Electronics",
  "New Arrivals: Smart Gadgets",
  "Free Shipping on orders above Rs.499",
  "Limited: Power Banks at Rs.599",
  "Rated #1 Deals Platform in India",
  "10,000+ Products. One Store.",
];

/* ══════════════════════════════════════════
   GLOBAL KEYFRAME STYLES
══════════════════════════════════════════ */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulseRed {
    0%, 100% { box-shadow: 0 0 0 0 rgba(208,49,45,.4); }
    50%       { box-shadow: 0 0 0 7px rgba(208,49,45,0); }
  }
  @keyframes ticker {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  .hero-animate        { animation: fadeUp .7s ease both; }
  .hero-animate-delay1 { animation: fadeUp .7s .15s ease both; }
  .hero-animate-delay2 { animation: fadeUp .7s .30s ease both; }
  .hero-animate-delay3 { animation: fadeUp .7s .45s ease both; }

  .sd-card-hover {
    transition: border-color .25s, transform .25s, box-shadow .25s !important;
  }
  .sd-card-hover:hover {
    border-color: rgba(233,185,73,.45) !important;
    transform: translateY(-5px) !important;
    box-shadow: 0 16px 40px rgba(0,0,0,.6) !important;
  }

  .sd-ticker-track {
    display: flex;
    width: max-content;
    animation: ticker 30s linear infinite;
  }
  .sd-ticker-track:hover { animation-play-state: paused; }
`;

function GlobalStyles() {
  return <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />;
}

/* ══════════════════════════════════════════
   SCROLL-REVEAL HOOK
══════════════════════════════════════════ */
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ══════════════════════════════════════════
   SECTION HEADING
══════════════════════════════════════════ */
function SectionHeading({ white, gold, action, onAction }) {
  return (
    <Box sx={{
      display: "flex", alignItems: "center",
      justifyContent: "space-between", mb: 3.5, flexWrap: "wrap", gap: 1,
    }}>
      <Typography sx={{
        fontFamily: SYNE, fontSize: { xs: 20, md: 24 },
        fontWeight: 800, color: "#fff", lineHeight: 1,
      }}>
        {white}{" "}
        <Box component="span" sx={{ color: T.gold }}>{gold}</Box>
      </Typography>
      {action && (
        <Button
          endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
          onClick={onAction}
          sx={{
            color: T.muted, fontSize: 11, fontWeight: 700,
            textTransform: "uppercase", letterSpacing: ".8px",
            "&:hover": { color: T.gold },
            minWidth: 0, p: 0,
          }}
        >
          {action}
        </Button>
      )}
    </Box>
  );
}

/* ══════════════════════════════════════════
   TICKER
══════════════════════════════════════════ */
function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <Box sx={{
      bgcolor: T.gold, overflow: "hidden",
      py: "7px", borderBottom: `1px solid ${T.border}`,
    }}>
      <div className="sd-ticker-track">
        {items.map((item, i) => (
          <Box
            key={i}
            component="span"
            sx={{
              fontFamily: SYNE, fontSize: 11, fontWeight: 700,
              letterSpacing: "1.2px", textTransform: "uppercase",
              color: "#000", px: 4, whiteSpace: "nowrap",
              display: "inline-flex", alignItems: "center",
            }}
          >
            {item}
            <Box component="span" sx={{ opacity: .35, mx: 2, fontSize: 8 }}>◆</Box>
          </Box>
        ))}
      </div>
    </Box>
  );
}

/* ══════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════ */
export default function Home() {
  const navigate   = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const [catsRef,     catsVisible]     = useReveal();
  const [productsRef, productsVisible] = useReveal();
  const [promoRef,    promoVisible]    = useReveal();

  return (
    <Box sx={{ bgcolor: T.black, minHeight: "100vh", fontFamily: DM, color: T.text }}>
      <GlobalStyles />

      {/* ── TICKER ── */}
      <Ticker />

      {/* ── HERO ── */}
      <Box sx={{
        position: "relative", overflow: "hidden",
        bgcolor: T.surface, borderBottom: `1px solid ${T.border}`,
        py: { xs: 8, md: 12 }, px: 3, textAlign: "center",
        "&::before": {
          content: '""', position: "absolute",
          top: -120, left: "10%", width: 500, height: 500,
          background: "radial-gradient(circle, rgba(233,185,73,.1) 0%, transparent 65%)",
          pointerEvents: "none",
        },
        "&::after": {
          content: '""', position: "absolute",
          bottom: -80, right: "5%", width: 400, height: 400,
          background: "radial-gradient(circle, rgba(208,49,45,.09) 0%, transparent 65%)",
          pointerEvents: "none",
        },
      }}>
        <Box sx={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `repeating-linear-gradient(
            -55deg, transparent, transparent 60px,
            rgba(255,255,255,.012) 60px, rgba(255,255,255,.012) 61px
          )`,
        }} />

        <Box sx={{ position: "relative", zIndex: 1, maxWidth: 700, mx: "auto" }}>
          <Box className="hero-animate" sx={{
            display: "inline-flex", alignItems: "center", gap: 1,
            bgcolor: T.redDim, border: "1px solid rgba(208,49,45,.4)",
            borderRadius: "20px", px: 2.5, py: "6px", mb: 3.5,
          }}>
            <Box sx={{
              width: 7, height: 7, borderRadius: "50%",
              bgcolor: T.red, flexShrink: 0,
              animation: "pulseRed 1.8s infinite",
            }} />
            <LocalOfferIcon sx={{ fontSize: 12, color: T.red }} />
            <Typography sx={{
              fontFamily: SYNE, fontSize: 10, fontWeight: 700,
              letterSpacing: "1.6px", color: T.red, textTransform: "uppercase",
            }}>
              Live Deals — Updated Daily
            </Typography>
          </Box>

          <Typography
            component="h1"
            className="hero-animate-delay1"
            sx={{
              fontFamily: SYNE, fontWeight: 800, color: "#fff",
              lineHeight: 1.08, mb: 2.5, letterSpacing: "-1px",
              fontSize: { xs: "34px", sm: "48px", md: "62px" },
            }}
          >
            India's Sharpest Deals,{" "}
            <Box component="span" sx={{ color: T.gold, textShadow: "0 0 40px rgba(233,185,73,.3)" }}>
              Stolen Fresh Daily
            </Box>
          </Typography>

          <Typography
            className="hero-animate-delay2"
            sx={{ fontSize: { xs: 14, md: 16 }, color: T.muted, mb: 5, lineHeight: 1.8 }}
          >
            Unbeatable prices on electronics, fashion, home &amp; more —{" "}
            new steals added every single day.
          </Typography>

          <Box className="hero-animate-delay3" sx={{ display: "flex", justifyContent: "center", gap: 1.5, flexWrap: "wrap" }}>
            <Button
              onClick={() => navigate("/products")}
              startIcon={<ShoppingBagIcon />}
              sx={{
                bgcolor: T.gold, color: "#000",
                fontFamily: SYNE, fontSize: 13, fontWeight: 700,
                letterSpacing: ".8px", textTransform: "uppercase",
                borderRadius: "8px", px: 4, py: 1.6,
                boxShadow: "0 4px 24px rgba(233,185,73,.3)",
                "&:hover": { bgcolor: T.goldHov, transform: "translateY(-2px)", boxShadow: "0 10px 32px rgba(233,185,73,.4)" },
                transition: "all .22s",
              }}
            >
              Shop Now
            </Button>
            <Button
              onClick={() => navigate("/products")}
              sx={{
                color: T.text, fontFamily: DM, fontSize: 13, fontWeight: 600,
                textTransform: "none", borderRadius: "8px", px: 3.5, py: 1.6,
                border: `1.5px solid ${T.border}`,
                "&:hover": { borderColor: T.gold, color: T.gold, bgcolor: T.goldDim },
                transition: "all .22s",
              }}
            >
              Browse All Deals
            </Button>
          </Box>
        </Box>
      </Box>

      {/* ── STATS BAR ── */}
      <Box sx={{
        display: "flex", overflowX: "auto",
        borderBottom: `1px solid ${T.border}`, bgcolor: "#0d0d0d",
        scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" },
      }}>
        {STATS.map((s, i) => (
          <Box
            key={s.lbl}
            sx={{
              flex: 1, minWidth: 130, py: 3, px: 3, textAlign: "center",
              borderRight: i < STATS.length - 1 ? `1px solid ${T.border}` : "none",
              transition: "background .2s",
              "&:hover": { bgcolor: T.goldDim },
            }}
          >
            <Typography sx={{
              fontFamily: SYNE, fontSize: 26, fontWeight: 800,
              color: T.gold, lineHeight: 1, mb: 0.5,
            }}>
              {s.num}
            </Typography>
            <Typography sx={{
              fontSize: 10, fontWeight: 600, color: T.muted,
              letterSpacing: "1px", textTransform: "uppercase",
            }}>
              {s.lbl}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* ── CATEGORIES ── */}
      <Box
        ref={catsRef}
        sx={{
          maxWidth: 1400, mx: "auto",
          px: { xs: 2, md: 4 }, py: { xs: 6, md: 7 },
          opacity: catsVisible ? 1 : 0,
          transform: catsVisible ? "none" : "translateY(24px)",
          transition: "opacity .6s, transform .6s",
        }}
      >
        <SectionHeading white="Shop by" gold="Category" action="View All" onAction={() => navigate("/products")} />

        <Grid container spacing={1.5}>
          {CATEGORIES.map((cat, idx) => (
            <Grid item xs={6} sm={4} md={2} key={cat.name}>
              <Card
                onClick={() => navigate("/products")}
                className="sd-card-hover"
                sx={{
                  bgcolor: T.card, border: `1px solid ${T.border}`,
                  borderRadius: "12px", cursor: "pointer",
                  opacity: catsVisible ? 1 : 0,
                  transform: catsVisible ? "none" : "translateY(20px)",
                  transition: `opacity .5s ${idx * 0.07}s, transform .5s ${idx * 0.07}s`,
                }}
              >
                <CardActionArea sx={{
                  p: 3, display: "flex", flexDirection: "column",
                  alignItems: "center", gap: 1.5,
                }}>
                  <Box sx={{
                    width: 52, height: 52, borderRadius: "14px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    bgcolor: T.goldDim, border: "1px solid rgba(233,185,73,.18)",
                    color: T.gold,
                  }}>
                    {cat.icon}
                  </Box>
                  <Typography sx={{ fontFamily: SYNE, fontSize: 13, fontWeight: 700, color: T.text }}>
                    {cat.name}
                  </Typography>
                  <Box sx={{
                    bgcolor: T.redDim, border: "1px solid rgba(208,49,45,.2)",
                    borderRadius: "4px", px: 1, py: "2px",
                  }}>
                    <Typography sx={{ fontFamily: SYNE, fontSize: 10, fontWeight: 700, color: T.red, letterSpacing: ".6px" }}>
                      {cat.count} deals
                    </Typography>
                  </Box>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ── DEALS GRID ── */}
      <Box
        ref={productsRef}
        sx={{
          maxWidth: 1400, mx: "auto",
          px: { xs: 2, md: 4 }, pb: { xs: 6, md: 7 },
          opacity: productsVisible ? 1 : 0,
          transform: productsVisible ? "none" : "translateY(24px)",
          transition: "opacity .6s, transform .6s",
        }}
      >
        <SectionHeading white="Deals" gold="For You" action="See All" onAction={() => navigate("/products")} />

        <Grid container spacing={2}>
          {PRODUCTS.map((p, idx) => (
            <Grid item xs={6} sm={4} md={3} key={p.id}>
              <Card
                onClick={() => navigate(`/product/${p.id}`)}
                className="sd-card-hover"
                sx={{
                  bgcolor: T.card, border: `1px solid ${T.border}`,
                  borderRadius: "14px", cursor: "pointer",
                  height: "100%", display: "flex", flexDirection: "column",
                  overflow: "hidden",
                  opacity: productsVisible ? 1 : 0,
                  transform: productsVisible ? "none" : "translateY(20px)",
                  transition: `opacity .5s ${idx * 0.06}s, transform .5s ${idx * 0.06}s`,
                }}
              >
                {/* image placeholder */}
                <Box sx={{
                  height: { xs: 140, md: 175 },
                  background: "linear-gradient(145deg, #181818 0%, #1c1c1c 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative", borderBottom: `1px solid ${T.border}`,
                }}>
                  <Typography sx={{
                    fontFamily: SYNE, fontSize: 30, fontWeight: 800,
                    color: "rgba(233,185,73,.13)", letterSpacing: 3, userSelect: "none",
                  }}>
                    {p.name.split(" ").map(w => w[0]).join("").slice(0, 3)}
                  </Typography>

                  {p.tag && (
                    <Chip
                      label={p.tag}
                      size="small"
                      sx={{
                        position: "absolute", top: 10, left: 10,
                        bgcolor: p.tag === "NEW" ? "rgba(74,222,128,.15)" : T.red,
                        color: p.tag === "NEW" ? T.green : "#fff",
                        border: p.tag === "NEW" ? "1px solid rgba(74,222,128,.3)" : "none",
                        fontFamily: SYNE, fontSize: 9, fontWeight: 700,
                        letterSpacing: "1px", height: 20, borderRadius: "4px",
                        "& .MuiChip-label": { px: "6px" },
                      }}
                    />
                  )}

                  <Box sx={{
                    position: "absolute", top: 10, right: 10,
                    bgcolor: "rgba(74,222,128,.12)",
                    border: "1px solid rgba(74,222,128,.25)",
                    borderRadius: "4px", px: "6px", py: "2px",
                  }}>
                    <Typography sx={{ fontFamily: SYNE, fontSize: 10, fontWeight: 700, color: T.green }}>
                      {p.pct}% OFF
                    </Typography>
                  </Box>
                </Box>

                <CardContent sx={{ p: "14px 16px 18px", flex: 1, display: "flex", flexDirection: "column", gap: 0.7 }}>
                  <Typography sx={{ fontFamily: DM, fontSize: 14, fontWeight: 600, color: T.text, lineHeight: 1.4 }}>
                    {p.name}
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: T.muted }}>
                    Free delivery · In stock
                  </Typography>
                  <Box sx={{ mt: "auto", pt: 1.5, display: "flex", alignItems: "baseline", gap: 1, flexWrap: "wrap" }}>
                    <Typography sx={{ fontFamily: SYNE, fontSize: 20, fontWeight: 800, color: T.gold, lineHeight: 1 }}>
                      Rs.{p.price.toLocaleString("en-IN")}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: T.muted, textDecoration: "line-through" }}>
                      Rs.{p.mrp.toLocaleString("en-IN")}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ── PROMO BANNER — guests only ── */}
      {!isLoggedIn && (
        <Box sx={{ maxWidth: 1400, mx: "auto", px: { xs: 2, md: 4 }, pb: { xs: 6, md: 7 } }}>
          <Box
            ref={promoRef}
            sx={{
              background: "linear-gradient(125deg, #160c0b 0%, #0f0808 50%, #130909 100%)",
              border: "1px solid rgba(208,49,45,.2)",
              borderRadius: "16px",
              p: { xs: "32px 24px", md: "52px 48px" },
              display: "flex", alignItems: "center",
              justifyContent: "space-between", gap: 4, flexWrap: "wrap",
              position: "relative", overflow: "hidden",
              opacity: promoVisible ? 1 : 0,
              transform: promoVisible ? "none" : "translateY(24px)",
              transition: "opacity .7s, transform .7s",
              "&::before": {
                content: '""', position: "absolute",
                right: -60, top: -60, width: 280, height: 280,
                background: "radial-gradient(circle, rgba(208,49,45,.18) 0%, transparent 70%)",
                pointerEvents: "none",
              },
              "&::after": {
                content: '""', position: "absolute",
                left: -40, bottom: -40, width: 220, height: 220,
                background: "radial-gradient(circle, rgba(233,185,73,.07) 0%, transparent 70%)",
                pointerEvents: "none",
              },
            }}
          >
            <Box sx={{
              position: "absolute", inset: 0, pointerEvents: "none",
              backgroundImage: `repeating-linear-gradient(
                -45deg, transparent, transparent 40px,
                rgba(255,255,255,.015) 40px, rgba(255,255,255,.015) 41px
              )`,
            }} />

            <Box sx={{ position: "relative", zIndex: 1, maxWidth: 480 }}>
              <Box sx={{
                display: "inline-flex", alignItems: "center", gap: 0.8,
                bgcolor: T.redDim, border: "1px solid rgba(208,49,45,.35)",
                borderRadius: "4px", px: 1.5, py: "4px", mb: 2,
              }}>
                <BoltIcon sx={{ fontSize: 12, color: T.red }} />
                <Typography sx={{
                  fontFamily: SYNE, fontSize: 10, fontWeight: 700,
                  letterSpacing: "1.4px", color: T.red, textTransform: "uppercase",
                }}>
                  Limited Time Offer
                </Typography>
              </Box>

              <Typography sx={{
                fontFamily: SYNE, fontWeight: 800, color: "#fff",
                lineHeight: 1.15, mb: 1.5, letterSpacing: "-.5px",
                fontSize: { xs: "22px", md: "32px" },
              }}>
                Steal More,{" "}
                <Box component="span" sx={{ color: T.gold }}>Save More</Box>
              </Typography>

              <Typography sx={{ fontSize: 14, color: T.muted, lineHeight: 1.8 }}>
                Sign up today and get exclusive early access to flash sales
                before anyone else. No spam, only deals.
              </Typography>
            </Box>

            <Button
              onClick={() => navigate("/register")}
              endIcon={<ArrowForwardIcon />}
              sx={{
                position: "relative", zIndex: 1,
                bgcolor: T.gold, color: "#000",
                fontFamily: SYNE, fontSize: 13, fontWeight: 700,
                letterSpacing: ".8px", textTransform: "uppercase",
                borderRadius: "8px", px: 4, py: 1.8, flexShrink: 0,
                boxShadow: "0 4px 24px rgba(233,185,73,.25)",
                "&:hover": { bgcolor: T.goldHov, transform: "translateY(-2px)", boxShadow: "0 10px 32px rgba(233,185,73,.4)" },
                transition: "all .22s",
              }}
            >
              Create Free Account
            </Button>
          </Box>
        </Box>
      )}

    </Box>
  );
}