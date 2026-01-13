import React, { useState } from "react";
import SidebarSteps from "./SidebarSteps";

// Step components
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
import ProductImageStep from "../Products/ProductImageStep"; // new working step

export default function CreateProductLayout() {
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

  // ======================= STEP RENDER =======================
  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <SelectCategoryStep
            onConfirm={(data) => {
              setCategoryData(data);
              setActiveStep(1);
            }}
          />
        );

      case 1:
        return (
          <SelectBrandStep
            onConfirm={(brand) => {
              setBrandData(brand);
              setActiveStep(2);
            }}
          />
        );

      case 2:
        return (
          <ProductInfoStep
            categoryData={categoryData}
            brandData={brandData}
            onConfirm={(product) => {
              setProductData(product);
              setActiveStep(3);
            }}
          />
        );

      case 3:
        return (
          <AttributeStep
            onConfirm={(attrs) => {
              setAttributesData(attrs);
              setActiveStep(4);
            }}
          />
        );

      case 4:
        return (
          <VariantStep
            productData={productData}
            attributesData={attributesData}
            onConfirm={(variants) => {
              setVariantsData(variants);
              setActiveStep(5);
            }}
          />
        );

      case 5:
        return (
          <VariantPricingStep
            variants={variantsData}
            onConfirm={(pricing) => {
              setPricingData(pricing);
              setActiveStep(6);
            }}
          />
        );

      case 6:
        return (
          <ProductFeatureStep
            productData={productData}
            onConfirm={(features) => {
              setFeaturesData(features);
              setActiveStep(7);
            }}
          />
        );

      case 7:
        return (
          <ProductSpecificationStep
            productData={productData}
            onConfirm={(specs) => {
              setSpecificationsData(specs);
              setActiveStep(8);
            }}
          />
        );

      case 8:
        return (
          <ManufacturerInfoStep
            productData={productData}
            onConfirm={(content) => {
              setManufacturerData(content);
              setActiveStep(9);
            }}
          />
        );

      // ======================= VARIANT IMAGE UPLOAD =======================
      case 9:
        return (
          <VariantImageStep
            productData={productData}
            variants={variantsData}
            onConfirm={(data) => {
              setVariantImagesData(data);
              setActiveStep(10);
            }}
          />
        );

      // ======================= PRODUCT IMAGE UPLOAD =======================
      case 10:
        return (
          <ProductImageStep
            productData={productData}
            onConfirm={(data) => {
              setProductImagesData(data);
              setActiveStep(11);
            }}
          />
        );

      // ======================= SUMMARY =======================
      default:
        return (
          <div className="max-w-5xl mx-auto space-y-6">
            <h3 className="text-yellow-400 text-3xl font-bold">
              Product Summary
            </h3>

            <SummaryBlock title="Category">
              {categoryData?.breadcrumb?.map((c) => c.name).join(" › ")}
            </SummaryBlock>

            <SummaryBlock title="Brand">{brandData?.name}</SummaryBlock>

            <SummaryBlock title="Product Info">
              <pre>{JSON.stringify(productData, null, 2)}</pre>
            </SummaryBlock>

            <SummaryBlock title="Attributes">
              {attributesData.map((a) => (
                <div key={a.id}>
                  <b>{a.name}</b>: {a.values.map((v) => v.value).join(", ")}
                </div>
              ))}
            </SummaryBlock>

            <SummaryBlock title="Variants">
              {variantsData.map((v, i) => (
                <div key={i}>
                  SKU: {v.sku} | Stock: {v.stock}
                </div>
              ))}
            </SummaryBlock>

            <SummaryBlock title="Pricing">
              <pre>{JSON.stringify(pricingData, null, 2)}</pre>
            </SummaryBlock>

            <SummaryBlock title="Features">
              <ul>
                {featuresData.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </SummaryBlock>

            <SummaryBlock title="Specifications">
              {specificationsData.map((s, i) => (
                <div key={i}>
                  {s.specKey}: {s.specValue}
                </div>
              ))}
            </SummaryBlock>

            <SummaryBlock title="Manufacturer Info">{manufacturerData}</SummaryBlock>

            <SummaryBlock title="Images">
              Variant Images Uploaded ✔ <br />
              Product Images Uploaded ✔
            </SummaryBlock>

            <button
              onClick={() => alert("READY TO PUBLISH PRODUCT")}
              className="bg-yellow-400 px-12 py-4 rounded-xl font-bold"
            >
              Final Confirm
            </button>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen relative">
      <SidebarSteps activeStep={activeStep} onStepClick={setActiveStep} />

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8 relative z-20 pointer-events-auto">{renderStep()}</div>
    </div>
  );
}

// ======================= HELPER =======================
function SummaryBlock({ title, children }) {
  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow">
      <h4 className="text-white font-semibold mb-2">{title}</h4>
      <div className="text-gray-300">{children}</div>
    </div>
  );
}
