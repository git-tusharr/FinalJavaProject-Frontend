import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarSteps from "./SidebarSteps";

// Steps
import SelectCategoryStep from "../Products/SelectCategoryStep";
import SelectBrandStep from "../Products/SelectBrandStep";
import ProductInfoStep from "../Products/ProductInfoStep";
import AttributeStep from "../Products/AttributeStep";
import VariantStep from "../Products/VariantStep";
import VariantPricingStep from "../Products/VariantPricingStep";
import ProductFeatureStep from "../Products/ProductFeatureStep";
import ProductSpecificationStep from "../Products/ProductSpecificationStep";
import ManufacturerInfoStep from "../Products/ManufacturerInfoStep";
import VariantImageStep from "../Products/VariantImageStep";
import ProductImageStep from "../Products/ProductImageStep";

export default function CreateProductLayout() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  // ======================= STATE =======================
  const [categoryData, setCategoryData] = useState(null);
  const [brandData, setBrandData] = useState(null);
  const [productData, setProductData] = useState(null);
  const [attributesData, setAttributesData] = useState([]);
  const [variantsData, setVariantsData] = useState([]);
  const [pricingData, setPricingData] = useState({});
  const [featuresData, setFeaturesData] = useState([]);
  const [specificationsData, setSpecificationsData] = useState([]);
  const [manufacturerData, setManufacturerData] = useState("");
  const [variantImagesData, setVariantImagesData] = useState([]);
  const [productImagesData, setProductImagesData] = useState([]);

  /* =======================
     RESET FOR NEW PRODUCT
  ======================== */
  const resetFlow = () => {
    setActiveStep(0);
    setCategoryData(null);
    setBrandData(null);
    setProductData(null);
    setAttributesData([]);
    setVariantsData([]);
    setPricingData({});
    setFeaturesData([]);
    setSpecificationsData([]);
    setManufacturerData("");
    setVariantImagesData([]);
    setProductImagesData([]);
  };

  /* =======================
     STEP RENDER
  ======================== */
  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return <SelectCategoryStep onConfirm={(d) => { setCategoryData(d); setActiveStep(1); }} />;

      case 1:
        return <SelectBrandStep onConfirm={(d) => { setBrandData(d); setActiveStep(2); }} />;

      case 2:
        return (
          <ProductInfoStep
            categoryData={categoryData}
            brandData={brandData}
            onConfirm={(d) => { setProductData(d); setActiveStep(3); }}
          />
        );

      case 3:
        return <AttributeStep onConfirm={(d) => { setAttributesData(d); setActiveStep(4); }} />;

      case 4:
        return (
          <VariantStep
            productData={productData}
            attributesData={attributesData}
            onConfirm={(d) => { setVariantsData(d); setActiveStep(5); }}
          />
        );

      case 5:
        return (
          <VariantPricingStep
            variants={variantsData}
            onConfirm={(d) => { setPricingData(d); setActiveStep(6); }}
          />
        );

      case 6:
        return (
          <ProductFeatureStep
            productData={productData}
            onConfirm={(d) => { setFeaturesData(d); setActiveStep(7); }}
          />
        );

      case 7:
        return (
          <ProductSpecificationStep
            productData={productData}
            onConfirm={(d) => { setSpecificationsData(d); setActiveStep(8); }}
          />
        );

      case 8:
        return (
          <ManufacturerInfoStep
            productData={productData}
            onConfirm={(d) => { setManufacturerData(d); setActiveStep(9); }}
          />
        );

      case 9:
        return (
          <VariantImageStep
            productData={productData}
            variants={variantsData}
            onConfirm={(d) => { setVariantImagesData(d); setActiveStep(10); }}
          />
        );

      case 10:
        return (
          <ProductImageStep
            productData={productData}
            onConfirm={(d) => { setProductImagesData(d); setActiveStep(11); }}
          />
        );

      /* =======================
         SUMMARY
      ======================== */
      default:
        return (
          <div className="max-w-6xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-yellow-400">
              Product Created Successfully 🎉
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SummaryCard title="Category">
                {categoryData?.breadcrumb?.map((c) => c.name).join(" › ")}
              </SummaryCard>

              <SummaryCard title="Brand">{brandData?.name}</SummaryCard>

              <SummaryCard title="Product">
                <p className="font-semibold">{productData?.name}</p>
                <p className="text-sm text-gray-400">{productData?.description}</p>
              </SummaryCard>

              <SummaryCard title="Variants">
                {variantsData.map((v) => (
                  <div key={v.id}>
                    SKU: <b>{v.sku}</b> · Stock: {v.stock}
                  </div>
                ))}
              </SummaryCard>

              <SummaryCard title="Features">
                <ul className="list-disc ml-4">
                  {featuresData.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </SummaryCard>

              <SummaryCard title="Specifications">
                {specificationsData.map((s, i) => (
                  <div key={i}>{s.specKey}: {s.specValue}</div>
                ))}
              </SummaryCard>

              <SummaryCard title="Manufacturer Info">
                {manufacturerData}
              </SummaryCard>

              <SummaryCard title="Images">
                <span className="text-green-400 font-semibold">
                  ✔ Product & Variant Images Uploaded
                </span>
              </SummaryCard>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-wrap gap-4 justify-end pt-6">
              <button
                onClick={resetFlow}
                className="bg-gray-700 hover:bg-gray-600 px-8 py-3 rounded-xl font-bold"
              >
                ➕ Add Another Product
              </button>

              <button
                onClick={() => navigate("/")}
                className="bg-gray-700 hover:bg-gray-600 px-8 py-3 rounded-xl font-bold"
              >
                🏠 Go to Home
              </button>

              <button
                onClick={() => alert("Product Published")}
                className="bg-yellow-400 hover:bg-yellow-500 px-10 py-3 rounded-xl font-bold text-black"
              >
                🚀 Publish Product
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen">
      <SidebarSteps activeStep={activeStep} onStepClick={setActiveStep} />
      <div className="flex-1 p-8">{renderStep()}</div>
    </div>
  );
}

/* =======================
   SUMMARY CARD
======================= */
function SummaryCard({ title, children }) {
  return (
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
      <h4 className="text-white font-semibold mb-2">{title}</h4>
      <div className="text-gray-300 text-sm space-y-1">
        {children}
      </div>
    </div>
  );
}
