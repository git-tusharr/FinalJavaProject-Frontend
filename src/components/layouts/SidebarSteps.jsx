import React from "react";

const steps = [
  "Category",
  "Brand",
  "Product Information",
  "Attributes",
  "Variants",
  "Variant Pricing",
  "Product Features",
  "Product Specification",
  "Manufacturer Info",
  "Variant Images",
  "Product Images"
];

export default function SidebarSteps({ activeStep }) {
  return (
    <aside className="w-72 min-h-screen bg-black border-r border-red-600/30 px-6 py-8 flex flex-col">

      {/* TITLE */}
      <h3 className="text-2xl font-extrabold text-yellow-400 mb-8 tracking-wide">
        Create Product
      </h3>

      {/* STEPS */}
      <ul className="space-y-3 flex-1">
        {steps.map((step, index) => {
          const isActive = activeStep === index;
          const isCompleted = activeStep > index;

          return (
            <li
              key={index}
              className={`
                flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer
                ${isActive ? "bg-red-600 text-white shadow-lg scale-105" : ""}
                ${isCompleted && !isActive ? "bg-gray-900 text-gray-300 hover:bg-gray-800" : ""}
                ${!isActive && !isCompleted ? "text-gray-500 hover:bg-gray-900" : ""}
              `}
            >
              {/* STEP CIRCLE */}
              <div
                className={`
                  w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm
                  transition-all duration-200
                  ${isActive ? "bg-yellow-400 text-black scale-110" : ""}
                  ${isCompleted && !isActive ? "bg-green-500 text-black" : ""}
                  ${!isActive && !isCompleted ? "bg-gray-700 text-gray-300" : ""}
                `}
              >
                {isCompleted ? "✓" : index + 1}
              </div>

              {/* STEP NAME */}
              <span
                className={`
                  text-sm font-semibold tracking-wide transition-colors duration-200
                  ${isActive ? "text-white" : isCompleted ? "text-gray-300" : "text-gray-500"}
                `}
              >
                {step}
              </span>
            </li>
          );
        })}
      </ul>

      {/* FOOTER / OPTIONAL */}
      <div className="mt-auto text-gray-600 text-xs text-center">
        Step {activeStep + 1} of {steps.length}
      </div>
    </aside>
  );
}
