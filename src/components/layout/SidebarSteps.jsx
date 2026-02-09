import { List, ListItemButton, ListItemText } from "@mui/material";

const steps = [
  "Category ",
  "Brand",
  "Product Information",
  "Attributes",
  "Variants",
  "Pricing",
  "Features",
  "Product Specifications",
  "From the Manufacturer",
  "Variant Image Upload",
  "imageupload",
   "additionalInfo",
  "videos",
];

export default function SidebarSteps({ activeStep, setActiveStep }) {
  return (
    <List sx={{ width: 260, height: "100vh", borderRight: "1px solid #ddd" }}>
      {steps.map((step, index) => (
        <ListItemButton
          key={step}
          selected={activeStep === index}
          onClick={() => setActiveStep(index)}
        >
          <ListItemText primary={step} />
        </ListItemButton>
      ))}
    </List>
  );
}
