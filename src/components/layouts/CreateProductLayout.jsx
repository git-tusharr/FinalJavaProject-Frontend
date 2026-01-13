import React, { useState } from "react";
import SidebarSteps from "./SidebarSteps";
import SelectCategoryStep from "../Products/SelectCategoryStep";
import SelectBrandStep from "../Products/SelectBrandStep";
import ProductInfoStep from "../Products/ProductInfoStep";
import AttributeStep from "../Products/AttributeStep";
import VariantStep from "../Products/VariantStep";
import VariantPricingStep from "../Products/VariantPricingStep";
import ProductFeatureStep from "../Products/ProductFeatureStep";
import ProductSpecificationStep from "../Products/ProductSpecificationStep";
import ManufacturerInfoStep from "../Products/ManufacturerInfoStep"; // ✅ NEW

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
  const [manufacturerInfo, setManufacturerInfo] = useState(""); // ✅ NEW

  // ======================= RENDER CURRENT STEP =======================
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
            onConfirm={(attributes) => {
              setAttributesData(attributes);
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
              setManufacturerInfo(content);
              setActiveStep(9);
            }}
          />
        );

      // ======================= SUMMARY STEP =======================
      default:
        return (
          <div className="max-w-5xl mx-auto space-y-6">
            <h3 className="text-yellow-400 text-3xl font-bold mb-6">
              Product Summary
            </h3>

            {/* Category */}
            <div className="bg-gray-900 p-6 rounded-2xl shadow-xl">
              <h4 className="text-white font-semibold mb-2">Category:</h4>
              <p className="text-gray-300">
                {categoryData?.breadcrumb?.map((c) => c.name).join(" › ")}
              </p>
            </div>

            {/* Brand */}
            <div className="bg-gray-900 p-6 rounded-2xl shadow-xl">
              <h4 className="text-white font-semibold mb-2">Brand:</h4>
              <p className="text-gray-300">{brandData?.name}</p>
            </div>

            {/* Product Info */}
            <div className="bg-gray-900 p-6 rounded-2xl shadow-xl">
              <h4 className="text-white font-semibold mb-2">Product Info:</h4>
              <pre className="text-gray-300">
                {JSON.stringify(productData, null, 2)}
              </pre>
            </div>

            {/* Attributes */}
            <div className="bg-gray-900 p-6 rounded-2xl shadow-xl">
              <h4 className="text-white font-semibold mb-2">Attributes:</h4>
              {attributesData.map((attr) => (
                <div key={attr.id}>
                  <p className="text-yellow-400 font-semibold">{attr.name}</p>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {attr.values.map((v) => (
                      <span
                        key={v.id}
                        className="bg-gray-800 px-3 py-1 rounded-full text-white text-sm"
                      >
                        {v.value}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Variants */}
            <div className="bg-gray-900 p-6 rounded-2xl shadow-xl">
              <h4 className="text-white font-semibold mb-2">Variants:</h4>
              {variantsData.map((v, idx) => (
                <div key={idx} className="text-gray-300">
                  SKU: {v.sku} | Stock: {v.stock}
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div className="bg-gray-900 p-6 rounded-2xl shadow-xl">
              <h4 className="text-white font-semibold mb-2">Pricing:</h4>
              <pre className="text-gray-300">
                {JSON.stringify(pricingData, null, 2)}
              </pre>
            </div>

            {/* Features */}
            <div className="bg-gray-900 p-6 rounded-2xl shadow-xl">
              <h4 className="text-white font-semibold mb-2">Features:</h4>
              {featuresData.length > 0 ? (
                <ul className="text-gray-300 list-disc list-inside">
                  {featuresData.map((f, idx) => (
                    <li key={idx}>{f}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No features added</p>
              )}
            </div>

            {/* Specifications */}
            <div className="bg-gray-900 p-6 rounded-2xl shadow-xl">
              <h4 className="text-white font-semibold mb-2">Specifications:</h4>
              {specificationsData.length > 0 ? (
                <ul className="text-gray-300 list-disc list-inside">
                  {specificationsData.map((s, idx) => (
                    <li key={idx}>
                      {s.specKey}: {s.specValue}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No specifications added</p>
              )}
            </div>

            {/* Manufacturer Info */}
            <div className="bg-gray-900 p-6 rounded-2xl shadow-xl">
              <h4 className="text-white font-semibold mb-2">Manufacturer Info:</h4>
              <p className="text-gray-300">
                {manufacturerInfo || "No manufacturer info added"}
              </p>
            </div>

            {/* Final Confirm */}
            <button
              onClick={() => alert("All data ready to submit to backend")}
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-12 py-4 rounded-xl font-bold shadow-xl"
            >
              Final Confirm
            </button>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen">
      <SidebarSteps activeStep={activeStep} />
      <div className="flex-1 p-8">{renderStep()}</div>
    </div>
  );
}
