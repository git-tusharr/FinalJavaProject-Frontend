import { Box, Paper } from "@mui/material";
import { useState } from "react";
import SidebarSteps from "./SidebarSteps";
import CategoryBrandStep from "../../pages/admin/products/CategoryBrandStep";
import BrandStep from "../../pages/admin/products/BrandStep";
import ProductInfoStep from "../../pages/admin/products/ProductInfoStep";
import AttributeSelectionStep from "../../pages/admin/products/AttributeSelectionStep";
import VariantStep from "../../pages/admin/products/VariantStep";
import ImageUploadStep from "../../pages/admin/products/ImageUploadStep";
import VariantImageUploadStep from
  "../../pages/admin/products/VariantImageUploadStep";
  import VariantPricingStep from
  "../../pages/admin/products/VariantPricingStep";
import ProductSpecificationStep from
  "../../pages/admin/products/ProductSpecificationStep";
import ProductFeatureStep from "../../pages/admin/products/ProductFeatureStep";

import ProductManufacturerInfoStep from "../../pages/admin/products/ProductManufacturerInfoStep";
import ProductAdditionalInfoStep from "../../pages/admin/products/ProductAdditionalInfoStep";
import ProductVideoStep from "../../pages/admin/products/ProductVideoStep";

export default function CreateProductLayout() {
  const [activeStep, setActiveStep] = useState(0);
const renderStep = () => {
  switch (activeStep) {

    case 0:
      return <CategoryBrandStep onNext={() => setActiveStep(1)} />;

    case 1:
      return <BrandStep onNext={() => setActiveStep(2)} />;

    case 2:
      return <ProductInfoStep onNext={() => setActiveStep(3)} />;

    case 3:
      return <AttributeSelectionStep onNext={() => setActiveStep(4)} />;

    case 4:
      return <VariantStep onNext={() => setActiveStep(5)} />;

    case 5:
      return <VariantPricingStep onNext={() => setActiveStep(6)} />;

  case 6:
        return <ProductFeatureStep onNext={() => setActiveStep(7)} />;

    case 7:
      return <ProductSpecificationStep onNext={() => setActiveStep(8)} />;

       case 8:
      return <ProductManufacturerInfoStep onNext={() => setActiveStep(9)} />;

    case 9:
      return <VariantImageUploadStep onNext={() => setActiveStep(10)} />;

    case 10:
      return <ImageUploadStep onNext={() => setActiveStep(11)} />;


      case 11:
  return <ProductAdditionalInfoStep onNext={() => setActiveStep(12)} />;

case 12:
  return <ProductVideoStep onNext={() => setActiveStep(13)} />;

    default:
      return <div>Step coming soon...</div>;
  }
};

  
  return (
    <Box sx={{ display: "flex" }}>
      <SidebarSteps activeStep={activeStep} setActiveStep={setActiveStep} />
      <Box sx={{ flex: 1, p: 4 }}>
        <Paper sx={{ p: 3, minHeight: "80vh" }}>
          {renderStep()}
        </Paper>
      </Box>
    </Box>
  );
}
