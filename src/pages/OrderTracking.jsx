import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axiosInstance";

// MUI
import {
  Box,
  Typography,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";


// ---------- STATUS FLOW ----------
const STATUS_FLOW = [
  "CONFIRMED",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
 
];



// ---------- CUSTOM ANIMATED STEP ICON ----------
function AnimatedStepIcon(props) {
  const { active, completed, index } = props;



  return (
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14,
        fontWeight: "bold",
        color: completed ? "#fff" : active ? "#fff" : "#999",
        backgroundColor: completed || active ? "#2e7d32" : "#e0e0e0",
        transform: active ? "scale(1.3)" : "scale(1)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: active
          ? "0 0 20px rgba(46,125,50,0.5), 0 4px 12px rgba(0,0,0,0.15)"
          : completed
          ? "0 2px 8px rgba(46,125,50,0.3)"
          : "none",
        animation: active ? "pulse 2s ease-in-out infinite" : completed ? `popIn 0.4s ease-out ${index * 0.8}s backwards` : "none",
        "@keyframes pulse": {
          "0%, 100%": {
            transform: "scale(1.3)",
            boxShadow: "0 0 20px rgba(46,125,50,0.5), 0 4px 12px rgba(0,0,0,0.15)"
          },
          "50%": {
            transform: "scale(1.4)",
            boxShadow: "0 0 30px rgba(46,125,50,0.7), 0 6px 16px rgba(0,0,0,0.2)"
          }
        },
        "@keyframes popIn": {
          "0%": {
            transform: "scale(0)",
            opacity: 0
          },
          "50%": {
            transform: "scale(1.2)"
          },
          "100%": {
            transform: "scale(1)",
            opacity: 1
          }
        }
      }}
    >
      {completed ? <CheckIcon sx={{ fontSize: 18 }} /> : null}
    </Box>
  );
}

// ---------- ANIMATED CONNECTOR ----------
function AnimatedConnector({ index, completed }) {
  return (
    <Box
      sx={{
        flex: 1,
        height: 3,
        backgroundColor: "#e0e0e0",
        position: "relative",
        overflow: "hidden",
        mx: 1
      }}
    >
      {completed && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            backgroundColor: "#2e7d32",
            animation: `expandLine 0.8s ease-out ${index * 0.8 + 0.3}s forwards`,
            width: 0,
            "@keyframes expandLine": {
              "0%": { width: "0%" },
              "100%": { width: "100%" }
            },
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "30px",
              height: "100%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)",
              animation: `shimmer 1.5s ease-in-out ${index * 0.8 + 1.1}s infinite`,
              "@keyframes shimmer": {
                "0%": { transform: "translateX(-30px)" },
                "100%": { transform: "translateX(calc(100% + 30px))" }
              }
            }
          }}
        />
      )}
    </Box>
  );
}

// ---------- MAIN COMPONENT ----------
export default function OrderDetails() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [animationKey, setAnimationKey] = useState(0);
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
      // Trigger animation on load
      setAnimationKey(prev => prev + 1);
    };

    loadOrder();
  }, [orderNumber]);

  if (!order) return <Typography p={3}>Loading...</Typography>;

  const activeStep = STATUS_FLOW.includes(order.orderStatus)
    ? STATUS_FLOW.indexOf(order.orderStatus)
    : -1;

  // Show active icon on current status, not one behind
  const displayActiveStep = activeStep;
  const isFinalDelivered = order.orderStatus === "DELIVERED";

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
  const res = await API.get(
    `/orders/${order.id}/invoice`,
    { responseType: "blob" }   // token auto-added by axios interceptor
  );

  const blob = new Blob([res.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `invoice_${order.id}.pdf`;
  a.click();
  window.URL.revokeObjectURL(url);
};


  return (
    <Box maxWidth="900px" mx="auto" p={3}>
      {/* HEADER */}
      <Typography variant="h5" fontWeight="bold">
        Order #{order.orderNumber}
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Placed on {new Date(order.createdAt).toLocaleString()}
      </Typography>

      {/* SPECIAL STATUS */}
      {activeStep === -1 && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: "#fdecea" }}>
          <Typography color="error">
            Order status: <b>{order.orderStatus}</b>
          </Typography>
        </Paper>
      )}

      {/* 🔥 ANIMATED AMAZON-STYLE TRACKING */}
      {activeStep >= 0 && (
        <Paper 
          key={animationKey}
          sx={{ 
            p: 3, 
            mb: 4,
            background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)"
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="space-between">
            {STATUS_FLOW.map((label, index) => (
              <Box key={label} display="flex" alignItems="center" flex={index === STATUS_FLOW.length - 1 ? "0" : "1"}>
                <Box display="flex" flexDirection="column" alignItems="center">
       <AnimatedStepIcon
  active={index === displayActiveStep && !isFinalDelivered}
  completed={index < displayActiveStep || (isFinalDelivered && index === displayActiveStep)}
  index={index}
/>

                  <Typography
                    sx={{
                      mt: 1.5,
                      fontSize: "0.75rem",
                      fontWeight: index <= displayActiveStep ? 600 : 400,
                      color: index <= displayActiveStep ? "#2e7d32" : "#999",
                      textAlign: "center",
                      maxWidth: "80px"
                    }}
                  >
                    {label.replaceAll("_", " ")}
                  </Typography>
                </Box>
                {index < STATUS_FLOW.length - 1 && (
                  <AnimatedConnector
                    index={index}
                    completed={index < displayActiveStep}
                  />
                )}
              </Box>
            ))}
          </Box>
        </Paper>
      )}

      {/* ORDER ITEMS */}
      <Paper variant="outlined">
        {order.items.length === 0 ? (
          <Typography p={3} color="text.secondary">
            No item details available
          </Typography>
        ) : (
          order.items.map(item => (
            <Box
              key={item.id}
              display="flex"
              gap={2}
              p={2}
              borderBottom="1px solid #eee"
            >
              <img
                src={item.productImage || "/placeholder.png"}
                alt={item.productName || "Product"}
                width={100}
                height={100}
                style={{ objectFit: "cover", borderRadius: 8 }}
              />

              <Box flex={1}>
                <Typography fontWeight="bold">
                  {item.productName || "Product"}
                </Typography>
                <Typography variant="body2">
                  Quantity: {item.quantity}
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  ₹{item.price}
                </Typography>
              </Box>
            </Box>
          ))
        )}
      </Paper>

      {/* ACTIONS */}
      <Box mt={3} display="flex" gap={2}>
        {canCancel && (
  <Button
    variant="outlined"
    color="error"
    onClick={handleCancel}
  >
    Cancel Order
  </Button>
)}

{canReturn && (
  <Button
    variant="outlined"
    color="primary"
    onClick={handleReturn}
  >
    Return Order
  </Button>
)}
<Button
  variant="contained"
  color="success"
  onClick={downloadInvoice}
>
  Download Invoice
</Button>

      </Box>
    </Box>
  );
}