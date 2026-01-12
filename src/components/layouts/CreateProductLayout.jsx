import React, { useState } from "react";
import SidebarSteps from "./SidebarSteps";
import SelectCategoryStep from "../Products/SelectCategoryStep";
import SelectBrandStep from "../Products/SelectBrandStep";
import ProductInfoStep from "../Products/ProductInfoStep";
import AttributeStep from "../Products/AttributeStep";
import VariantStep from "../Products/VariantStep";

export default function CreateProductLayout() {
  const [activeStep, setActiveStep] = useState(0);

  const [categoryData, setCategoryData] = useState(null);
  const [brandData, setBrandData] = useState(null);
  const [productData, setProductData] = useState(null);
  const [attributesData, setAttributesData] = useState([]);
  const [variantsData, setVariantsData] = useState([]);

  // =======================
  // Render the current step
  // =======================
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

      default:
        // =======================
        // Summary Step
        // =======================
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
              {attributesData.length > 0 ? (
                attributesData.map((attr) => (
                  <div key={attr.id} className="mb-2">
                    <p className="text-yellow-400 font-semibold">{attr.name}</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {attr.values.map((v) => (
                        <span
                          key={v.id}
                          className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm"
                        >
                          {v.value}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No attributes added</p>
              )}
            </div>

            {/* Variants */}
            <div className="bg-gray-900 p-6 rounded-2xl shadow-xl">
              <h4 className="text-white font-semibold mb-2">Variants:</h4>
              {variantsData.length > 0 ? (
                <table className="w-full text-left border border-gray-700 rounded-xl overflow-hidden">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-4 py-2 text-gray-300">SKU</th>
                      <th className="px-4 py-2 text-gray-300">Price</th>
                      <th className="px-4 py-2 text-gray-300">Stock</th>
                      <th className="px-4 py-2 text-gray-300">Attributes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variantsData.map((v, idx) => (
                      <tr key={idx} className="border-t border-gray-700">
                        <td className="px-4 py-2 text-white">{v.sku}</td>
                        <td className="px-4 py-2 text-white">{v.price}</td>
                        <td className="px-4 py-2 text-white">{v.stock}</td>
                        <td className="px-4 py-2 text-gray-300">
                          {Object.entries(v.attributes).map(([attrId, valId], i) => (
                            <span key={i}>
                              Attr {attrId}: Value {valId}
                              {i < Object.entries(v.attributes).length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-400">No variants added</p>
              )}
            </div>

            {/* Final Confirm */}
            <button
              onClick={() => alert("All data ready to submit to backend")}
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-12 py-4 rounded-xl font-bold transition-all hover:scale-105 shadow-xl"
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
