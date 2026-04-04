import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axiosInstance";

import {
  Box,
  Typography,
  Button
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

/* ── THEME TOKENS ── */
const T = {
  black: "#080808",
  surface: "#111111",
  card: "#141414",
  border: "#1e1e1e",
  gold: "#E9B949",
  goldHov: "#f5c84e",
  red: "#D0312D",
  text: "#e2e2e2",
  muted: "#666666",
  green: "#4ade80",
};

const SYNE = "'Syne', sans-serif";
const DM = "'DM Sans', sans-serif";

/* ---------- STATUS FLOW ---------- */
const STATUS_FLOW = [
  "CONFIRMED",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

/* ---------- STEP ICON ---------- */
function AnimatedStepIcon({ active, completed }) {
  return (
    <Box
      sx={{
        width: 34,
        height: 34,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14,
        fontWeight: "bold",
        color: completed ? "#000" : active ? "#000" : T.muted,
        backgroundColor: completed || active ? T.gold : T.border,
        transform: active ? "scale(1.2)" : "scale(1)",
        transition: "all .3s",
        boxShadow: active
          ? "0 0 20px rgba(233,185,73,.5)"
          : completed
          ? "0 4px 12px rgba(233,185,73,.25)"
          : "none",
      }}
    >
      {completed ? <CheckIcon sx={{ fontSize: 18 }} /> : null}
    </Box>
  );
}

/* ---------- CONNECTOR ---------- */
function AnimatedConnector({ completed }) {
  return (
    <Box
      sx={{
        flex: 1,
        height: 3,
        mx: 1,
        bgcolor: completed ? T.gold : T.border,
        transition: "all .4s"
      }}
    />
  );
}

/* ---------- MAIN ---------- */
export default function OrderDetails() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const loadOrder = async () => {
      const res = await API.get(`/orders/${orderNumber}`);

      let items = [];
      if (res.data.itemsJson) {
        try {
          items =
            typeof res.data.itemsJson === "string"
              ? JSON.parse(res.data.itemsJson)
              : res.data.itemsJson;
        } catch {
          items = [];
        }
      }

      setOrder({ ...res.data, items });
    };

    loadOrder();
  }, [orderNumber]);

  if (!order)
    return (
      <Typography sx={{ p: 3, color: T.muted }}>
        Loading...
      </Typography>
    );

  const activeStep = STATUS_FLOW.includes(order.orderStatus)
    ? STATUS_FLOW.indexOf(order.orderStatus)
    : -1;

  const canCancel =
    order.orderStatus === "CONFIRMED" ||
    order.orderStatus === "PACKED";

  const canReturn = order.orderStatus === "DELIVERED";

  const handleCancel = async () => {
    await API.put(`/orders/${order.id}/cancel`);
    window.location.reload();
  };

  const handleReturn = async () => {
    await API.put(`/orders/${order.id}/return`);
    window.location.reload();
  };

  const downloadInvoice = async () => {
    const res = await API.get(`/orders/${order.id}/invoice`, {
      responseType: "blob",
    });

    const blob = new Blob([res.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice_${order.id}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{
      minHeight: "100vh",
      bgcolor: T.black,
      color: T.text,
      fontFamily: DM,
      px: 2,
      py: 4
    }}>

      {/* HEADER */}
      <Typography sx={{
        fontFamily: SYNE,
        fontSize: 24,
        fontWeight: 800
      }}>
        Order <Box component="span" sx={{ color: T.gold }}>
          #{order.orderNumber}
        </Box>
      </Typography>

      <Typography sx={{ color: T.muted, mb: 3 }}>
        Placed on {new Date(order.createdAt).toLocaleString()}
      </Typography>

      {/* TRACKING */}
      {activeStep >= 0 && (
        <Box sx={{
          p: 3,
          mb: 4,
          bgcolor: T.card,
          border: `1px solid ${T.border}`,
          borderRadius: "12px"
        }}>
          <Box display="flex" alignItems="center">
            {STATUS_FLOW.map((label, index) => (
              <Box key={label} display="flex" alignItems="center" flex={1}>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <AnimatedStepIcon
                    active={index === activeStep}
                    completed={index < activeStep || order.orderStatus === "DELIVERED"}
                  />
                  <Typography sx={{
                    mt: 1,
                    fontSize: 11,
                    fontFamily: SYNE,
                    color: index <= activeStep ? T.gold : T.muted,
                    textAlign: "center"
                  }}>
                    {label.replaceAll("_", " ")}
                  </Typography>
                </Box>

                {index < STATUS_FLOW.length - 1 && (
                  <AnimatedConnector completed={index < activeStep} />
                )}
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* ITEMS */}
      <Box sx={{
        bgcolor: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: "12px",
        overflow: "hidden"
      }}>
        {order.items.map((item, index) => (
          <Box
            key={item.id}
            sx={{
              display: "flex",
              gap: 2,
              p: 2,
              borderBottom:
                index !== order.items.length - 1
                  ? `1px solid ${T.border}`
                  : "none"
            }}
          >
            <Box
              component="img"
              src={item.productImage || "/placeholder.png"}
              sx={{
                width: 100,
                height: 100,
                objectFit: "cover",
                borderRadius: "8px",
                bgcolor: T.surface,
                border: `1px solid ${T.border}`
              }}
            />

            <Box flex={1}>
              <Typography sx={{
                fontFamily: SYNE,
                fontSize: 14,
                fontWeight: 700
              }}>
                {item.productName}
              </Typography>

              <Typography sx={{ fontSize: 12, color: T.muted }}>
                Quantity: {item.quantity}
              </Typography>

              <Typography sx={{
                fontSize: 13,
                color: T.gold,
                fontWeight: 600
              }}>
                ₹{item.price}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* ACTIONS */}
      <Box mt={3} display="flex" gap={2} flexWrap="wrap">

        {canCancel && (
          <Button
            onClick={handleCancel}
            sx={{
              border: `1.5px solid rgba(208,49,45,.2)`,
              color: T.red,
              bgcolor: "rgba(208,49,45,.05)",
              borderRadius: "8px",
              fontFamily: SYNE,
              fontWeight: 700,
              textTransform: "uppercase",
              "&:hover": {
                bgcolor: "rgba(208,49,45,.1)"
              }
            }}
          >
            Cancel Order
          </Button>
        )}

        {canReturn && (
          <Button
            onClick={handleReturn}
            sx={{
              border: `1.5px solid ${T.border}`,
              color: T.text,
              borderRadius: "8px",
              fontFamily: SYNE,
              fontWeight: 700,
              textTransform: "uppercase",
              "&:hover": {
                borderColor: T.gold,
                color: T.gold,
                bgcolor: "rgba(233,185,73,.05)"
              }
            }}
          >
            Return Order
          </Button>
        )}

        <Button
          onClick={downloadInvoice}
          sx={{
            bgcolor: T.gold,
            color: "#000",
            borderRadius: "8px",
            fontFamily: SYNE,
            fontWeight: 700,
            textTransform: "uppercase",
            "&:hover": {
              bgcolor: T.goldHov,
              transform: "translateY(-2px)",
              boxShadow: "0 8px 28px rgba(233,185,73,.35)"
            }
          }}
        >
          Download Invoice
        </Button>

      </Box>
    </Box>
  );
}