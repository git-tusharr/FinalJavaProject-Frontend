import React, { useState } from "react";

// IMPORT STEPS (can be empty for now)
const CategoryBrandStep = ({ onNext }) => (
  <button onClick={onNext}>Next</button>
);

export default function CreateProductLayout() {
  const [activeStep, setActiveStep] = useState(0);

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return <CategoryBrandStep onNext={() => setActiveStep(1)} />;

      default:
        return <div>Step coming soon...</div>;
    }
  };

  return (
    <div style={{ display: "flex", padding: "20px" }}>
      {/* LEFT SIDEBAR */}
      <div style={{ width: "250px", borderRight: "1px solid #ddd" }}>
        <h3>Create Product</h3>
        <p>Step {activeStep + 1}</p>
      </div>

      {/* RIGHT CONTENT */}
      <div style={{ flex: 1, padding: "20px" }}>
        {renderStep()}
      </div>
    </div>
  );
}
