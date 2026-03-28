import { useNavigate } from "react-router-dom";
import {
  Box, Typography, Button, Grid, Card,
  CardContent, CardActionArea, Chip,
} from "@mui/material";
import ShoppingBagIcon   from "@mui/icons-material/ShoppingBag";
import LocalOfferIcon    from "@mui/icons-material/LocalOffer";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LockIcon          from "@mui/icons-material/Lock";
import ReplayIcon        from "@mui/icons-material/Replay";
import EmojiEventsIcon   from "@mui/icons-material/EmojiEvents";

/* ── brand tokens ── */
const T = {
  black:   "#080808",
  surface: "#111111",
  card:    "#141414",
  border:  "#1e1e1e",
  gold:    "#E9B949",
  goldHov: "#f5c84e",
  red:     "#D0312D",
  text:    "#e2e2e2",
  muted:   "#666666",
  green:   "#4ade80",
};

const SYNE = "'Syne', sans-serif";
const DM   = "'DM Sans', sans-serif";

/* ─── data ────────────────────────────────────────────────────────────────── */
const CATEGORIES = [
  { name: "Mobiles",     icon: "📱", count: "240+ deals" },
  { name: "Electronics", icon: "🎧", count: "180+ deals" },
  { name: "Fashion",     icon: "👗", count: "320+ deals" },
  { name: "Home",        icon: "🏠", count: "150+ deals" },
  { name: "Sports",      icon: "⚽", count: "90+ deals"  },
  { name: "Books",       icon: "📚", count: "200+ deals" },
];

const PRODUCTS = [
  { id: 1, name: "Wireless Earbuds Pro",    price: 999,  mrp: 1999, discount: "50% OFF", emoji: "🎧", tag: "HOT"  },
  { id: 2, name: "Smart Watch Series X",    price: 2499, mrp: 4999, discount: "50% OFF", emoji: "⌚", tag: "NEW"  },
  { id: 3, name: "Running Shoes Ultra",     price: 1299, mrp: 2499, discount: "48% OFF", emoji: "👟", tag: null   },
  { id: 4, name: "Portable Power Bank",     price: 599,  mrp: 1299, discount: "54% OFF", emoji: "🔋", tag: "DEAL" },
  { id: 5, name: "Mechanical Keyboard",     price: 1799, mrp: 3499, discount: "49% OFF", emoji: "⌨️", tag: null   },
  { id: 6, name: "Backpack Compact 30L",    price: 899,  mrp: 1799, discount: "50% OFF", emoji: "🎒", tag: "NEW"  },
  { id: 7, name: "Desk LED Lamp",           price: 449,  mrp: 899,  discount: "50% OFF", emoji: "💡", tag: null   },
  { id: 8, name: "Bluetooth Speaker Mini",  price: 799,  mrp: 1599, discount: "50% OFF", emoji: "🔊", tag: "HOT"  },
];

const STATS = [
  { num: "50K+", lbl: "Happy Customers" },
  { num: "10K+", lbl: "Products Listed"  },
  { num: "₹999", lbl: "Deals From"       },
  { num: "24hr", lbl: "Fast Delivery"    },
];

const FEATURES = [
  { icon: <LocalShippingIcon />, title: "Free Delivery",   desc: "On all orders above ₹499"           },
  { icon: <LockIcon />,          title: "Secure Payments", desc: "100% safe & encrypted checkout"     },
  { icon: <ReplayIcon />,        title: "Easy Returns",    desc: "7-day hassle-free return policy"    },
  { icon: <EmojiEventsIcon />,   title: "Best Prices",     desc: "Price-match guarantee on all items" },
];

/* ─── shared sx helpers ───────────────────────────────────────────────────── */
const cardHover = {
  transition: "border-color .2s, transform .2s, box-shadow .2s",
  "&:hover": {
    borderColor: "rgba(233,185,73,.4)",
    transform: "translateY(-4px)",
    boxShadow: "0 12px 32px rgba(0,0,0,.5)",
  },
};

export default function Home() {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: T.black, minHeight: "100vh", fontFamily: DM, color: T.text }}>

      {/* ── HERO ── */}
      <Box sx={{
        position: "relative", overflow: "hidden",
        bgcolor: T.surface, borderBottom: `1px solid ${T.border}`,
        py: { xs: 7, md: 10 }, px: 3, textAlign: "center",
        "&::before": {
          content: '""', position: "absolute",
          top: -80, left: -80, width: 380, height: 380,
          background: "radial-gradient(circle, rgba(233,185,73,.12) 0%, transparent 70%)",
          pointerEvents: "none",
        },
        "&::after": {
          content: '""', position: "absolute",
          bottom: -60, right: -60, width: 320, height: 320,
          background: "radial-gradient(circle, rgba(208,49,45,.1) 0%, transparent 70%)",
          pointerEvents: "none",
        },
      }}>
        <Box sx={{ position: "relative", zIndex: 1, maxWidth: 680, mx: "auto" }}>

          {/* badge */}
          <Box sx={{
            display: "inline-flex", alignItems: "center", gap: 0.8,
            bgcolor: "rgba(208,49,45,.15)", border: "1px solid rgba(208,49,45,.35)",
            borderRadius: "20px", px: 2, py: "5px", mb: 3,
          }}>
            <LocalOfferIcon sx={{ fontSize: 13, color: T.red }} />
            <Typography sx={{
              fontFamily: SYNE, fontSize: 11, fontWeight: 700,
              letterSpacing: "1.4px", color: T.red, textTransform: "uppercase",
            }}>
              Today's Steals
            </Typography>
          </Box>

          <Typography component="h1" sx={{
            fontFamily: SYNE, fontWeight: 800, color: "#fff", lineHeight: 1.1,
            fontSize: { xs: "32px", sm: "44px", md: "56px" }, mb: 2,
          }}>
            India's Best Deals,{" "}
            <Box component="span" sx={{ color: T.gold }}>Stolen Fresh Daily</Box>
          </Typography>

          <Typography sx={{ fontSize: 16, color: T.muted, mb: 4.5, lineHeight: 1.7 }}>
            Unbeatable prices on electronics, fashion, home &amp; more —<br />
            new steals added every single day.
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", gap: 1.5, flexWrap: "wrap" }}>
            <Button
              onClick={() => navigate("/products")}
              startIcon={<ShoppingBagIcon />}
              sx={{
                bgcolor: T.gold, color: "#000",
                fontFamily: SYNE, fontSize: 13, fontWeight: 700,
                letterSpacing: ".8px", textTransform: "uppercase",
                borderRadius: "8px", px: 3.5, py: 1.5,
                boxShadow: "0 4px 20px rgba(233,185,73,.25)",
                "&:hover": { bgcolor: T.goldHov, transform: "translateY(-2px)", boxShadow: "0 8px 28px rgba(233,185,73,.35)" },
                transition: "all .2s",
              }}>
              Shop Now
            </Button>
            <Button
              onClick={() => navigate("/products")}
              sx={{
                color: T.text, fontFamily: DM, fontSize: 13, fontWeight: 600,
                textTransform: "none", borderRadius: "8px", px: 3, py: 1.5,
                border: `1.5px solid ${T.border}`,
                "&:hover": { borderColor: T.gold, color: T.gold },
                transition: "all .2s",
              }}>
              Browse All Deals
            </Button>
          </Box>
        </Box>
      </Box>

      {/* ── STATS BAR ── */}
      <Box sx={{
        display: "flex", overflowX: "auto",
        borderBottom: `1px solid ${T.border}`, bgcolor: T.surface,
      }}>
        {STATS.map((s, i) => (
          <Box key={s.lbl} sx={{
            flex: 1, minWidth: 130, py: 2.5, px: 3, textAlign: "center",
            borderRight: i < STATS.length - 1 ? `1px solid ${T.border}` : "none",
          }}>
            <Typography sx={{ fontFamily: SYNE, fontSize: 22, fontWeight: 800, color: T.gold, lineHeight: 1, mb: 0.5 }}>
              {s.num}
            </Typography>
            <Typography sx={{ fontSize: 11, fontWeight: 500, color: T.muted, letterSpacing: ".6px", textTransform: "uppercase" }}>
              {s.lbl}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* ── CATEGORIES ── */}
      <Box sx={{ maxWidth: 1400, mx: "auto", px: { xs: 2, md: 3 }, py: { xs: 5, md: 6 } }}>
        <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", mb: 3.5, flexWrap: "wrap", gap: 1 }}>
          <Typography sx={{ fontFamily: SYNE, fontSize: 22, fontWeight: 800, color: "#fff" }}>
            Shop by <Box component="span" sx={{ color: T.gold }}>Category</Box>
          </Typography>
          <Button onClick={() => navigate("/products")} sx={{
            color: T.muted, fontSize: 12, fontWeight: 600, textTransform: "uppercase",
            letterSpacing: ".5px", "&:hover": { color: T.gold }, minWidth: 0,
          }}>
            View All →
          </Button>
        </Box>

        <Grid container spacing={1.8}>
          {CATEGORIES.map((cat) => (
            <Grid item xs={6} sm={4} md={2} key={cat.name}>
              <Card onClick={() => navigate("/products")} sx={{
                bgcolor: T.card, border: `1px solid ${T.border}`,
                borderRadius: "10px", cursor: "pointer", ...cardHover,
                "&:hover": { ...cardHover["&:hover"], bgcolor: "rgba(233,185,73,.05)" },
              }}>
                <CardActionArea sx={{ p: 2.5, display: "flex", flexDirection: "column", alignItems: "center", gap: 1.2 }}>
                  <Box sx={{
                    width: 48, height: 48, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22,
                    bgcolor: "rgba(233,185,73,.1)",
                    border: "1px solid rgba(233,185,73,.2)",
                  }}>
                    {cat.icon}
                  </Box>
                  <Typography sx={{ fontFamily: SYNE, fontSize: 13, fontWeight: 700, color: T.text }}>
                    {cat.name}
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: T.muted, fontWeight: 500 }}>
                    {cat.count}
                  </Typography>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ── DEALS GRID ── */}
      <Box sx={{ maxWidth: 1400, mx: "auto", px: { xs: 2, md: 3 }, pb: { xs: 5, md: 6 } }}>
        <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", mb: 3.5, flexWrap: "wrap", gap: 1 }}>
          <Typography sx={{ fontFamily: SYNE, fontSize: 22, fontWeight: 800, color: "#fff" }}>
            🔥 Deals <Box component="span" sx={{ color: T.gold }}>For You</Box>
          </Typography>
          <Button onClick={() => navigate("/products")} sx={{
            color: T.muted, fontSize: 12, fontWeight: 600, textTransform: "uppercase",
            letterSpacing: ".5px", "&:hover": { color: T.gold }, minWidth: 0,
          }}>
            See All Deals →
          </Button>
        </Box>

        <Grid container spacing={2}>
          {PRODUCTS.map((p) => (
            <Grid item xs={6} sm={4} md={3} key={p.id}>
              <Card onClick={() => navigate(`/product/${p.id}`)} sx={{
                bgcolor: T.card, border: `1px solid ${T.border}`,
                borderRadius: "12px", cursor: "pointer",
                height: "100%", display: "flex", flexDirection: "column",
                ...cardHover,
              }}>
                {/* image area */}
                <Box sx={{
                  height: { xs: 150, md: 180 },
                  background: "linear-gradient(135deg, #181818 0%, #1c1c1c 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 42, position: "relative",
                }}>
                  {p.tag && (
                    <Chip label={p.tag} size="small" sx={{
                      position: "absolute", top: 10, left: 10,
                      bgcolor: T.red, color: "#fff",
                      fontFamily: SYNE, fontSize: 10, fontWeight: 700,
                      letterSpacing: ".8px", height: 22, borderRadius: "4px",
                    }} />
                  )}
                  {p.emoji}
                </Box>

                <CardContent sx={{ p: "14px 16px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 0.8 }}>
                  <Typography sx={{ fontFamily: DM, fontSize: 14, fontWeight: 600, color: T.text, lineHeight: 1.4 }}>
                    {p.name}
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: T.muted, fontWeight: 500 }}>
                    Free delivery · In stock
                  </Typography>

                  {/* price row */}
                  <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mt: "auto", pt: 1.5, flexWrap: "wrap" }}>
                    <Typography sx={{ fontFamily: SYNE, fontSize: 18, fontWeight: 800, color: T.gold }}>
                      ₹{p.price.toLocaleString("en-IN")}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: T.muted, textDecoration: "line-through" }}>
                      ₹{p.mrp.toLocaleString("en-IN")}
                    </Typography>
                    <Typography sx={{ fontSize: 11, fontWeight: 700, color: T.green, ml: "auto" }}>
                      {p.discount}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ── PROMO BANNER ── */}
      <Box sx={{ maxWidth: 1400, mx: "auto", px: { xs: 2, md: 3 }, pb: { xs: 5, md: 6 } }}>
        <Box sx={{
          background: "linear-gradient(120deg, #1a0f0e 0%, #120a0a 100%)",
          border: "1px solid rgba(208,49,45,.25)",
          borderRadius: "14px", p: { xs: "28px 22px", md: "40px 36px" },
          display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 3, flexWrap: "wrap",
          position: "relative", overflow: "hidden",
          "&::before": {
            content: '""', position: "absolute",
            right: -40, top: -40, width: 220, height: 220,
            background: "radial-gradient(circle, rgba(208,49,45,.15) 0%, transparent 70%)",
            pointerEvents: "none",
          },
        }}>
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Box sx={{
              display: "inline-block", bgcolor: T.red, color: "#fff",
              fontFamily: SYNE, fontSize: 10, fontWeight: 700,
              letterSpacing: "1.4px", px: 1.5, py: "4px",
              borderRadius: "4px", textTransform: "uppercase", mb: 1.5,
            }}>
              Limited Time
            </Box>
            <Typography sx={{ fontFamily: SYNE, fontWeight: 800, color: "#fff", lineHeight: 1.2, mb: 1,
              fontSize: { xs: "20px", md: "28px" } }}>
              Steal More,{" "}
              <Box component="span" sx={{ color: T.gold }}>Save More</Box>
            </Typography>
            <Typography sx={{ fontSize: 14, color: T.muted, maxWidth: 340, lineHeight: 1.6 }}>
              Sign up today and get exclusive early access to flash sales before anyone else.
            </Typography>
          </Box>
          <Button
            onClick={() => navigate("/register")}
            sx={{
              position: "relative", zIndex: 1,
              bgcolor: T.gold, color: "#000",
              fontFamily: SYNE, fontSize: 13, fontWeight: 700,
              letterSpacing: ".8px", textTransform: "uppercase",
              borderRadius: "8px", px: 3.5, py: 1.5, flexShrink: 0,
              "&:hover": { bgcolor: T.goldHov, transform: "translateY(-2px)" },
              transition: "all .2s",
            }}>
            Create Free Account
          </Button>
        </Box>
      </Box>

      {/* ── FEATURES ── */}
      <Box sx={{
        maxWidth: 1400, mx: "auto", px: { xs: 2, md: 3 }, pb: { xs: 6, md: 8 },
        borderTop: `1px solid ${T.border}`, pt: { xs: 5, md: 6 },
      }}>
        <Grid container spacing={1.8}>
          {FEATURES.map((f) => (
            <Grid item xs={6} md={3} key={f.title}>
              <Box sx={{
                display: "flex", alignItems: "flex-start", gap: 1.5,
                p: 2.5, bgcolor: T.card,
                border: `1px solid ${T.border}`, borderRadius: "10px",
              }}>
                <Box sx={{ color: T.gold, flexShrink: 0, mt: "2px", fontSize: 22 }}>
                  {f.icon}
                </Box>
                <Box>
                  <Typography sx={{ fontFamily: SYNE, fontSize: 13, fontWeight: 700, color: T.text, mb: 0.4 }}>
                    {f.title}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}>
                    {f.desc}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

    </Box>
  );
}