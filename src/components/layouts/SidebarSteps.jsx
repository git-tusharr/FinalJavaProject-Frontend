import React from "react";
import {
  DragDropContext,
  Droppable,
  Draggable
} from "@hello-pangea/dnd";

const initialSteps = [
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

export default function SidebarSteps({
  activeStep,
  onStepClick,
  steps = initialSteps,
  setSteps // pass setSteps from parent if you want reorder persisted
}) {
  const onDragEnd = (result) => {
    if (!result.destination || !setSteps) return;

    const items = Array.from(steps);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);

    setSteps(items);
  };

  return (
    <aside className="w-72 min-h-screen bg-black border-r border-red-600/30 px-6 py-8 flex flex-col">
      {/* TITLE */}
      <h3 className="text-2xl font-extrabold text-yellow-400 mb-8 tracking-wide">
        Create Product
      </h3>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="sidebar-steps" direction="vertical">
          {(provided) => (
            <ul
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-3 flex-1"
            >
              {steps.map((step, index) => {
                const isActive = activeStep === index;
                const isCompleted = activeStep > index;

                return (
                  <Draggable
                    key={step}
                    draggableId={step}
                    index={index}
                  >
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={() =>
                          onStepClick && onStepClick(index)
                        }
                        className={`
                          flex items-center gap-4 px-4 py-3 rounded-xl
                          transition-all duration-200 cursor-pointer
                          select-none
                          ${isActive ? "bg-red-600 text-white shadow-lg scale-[1.03]" : ""}
                          ${isCompleted && !isActive ? "bg-gray-900 text-gray-300 hover:bg-gray-800" : ""}
                          ${!isActive && !isCompleted ? "text-gray-500 hover:bg-gray-900" : ""}
                        `}
                      >
                        {/* STEP CIRCLE */}
                        <div
                          className={`
                            w-8 h-8 flex items-center justify-center rounded-full
                            font-bold text-sm
                            ${isActive ? "bg-yellow-400 text-black" : ""}
                            ${isCompleted && !isActive ? "bg-green-500 text-black" : ""}
                            ${!isActive && !isCompleted ? "bg-gray-700 text-gray-300" : ""}
                          `}
                        >
                          {isCompleted ? "✓" : index + 1}
                        </div>

                        {/* STEP NAME */}
                        <span className="text-sm font-semibold tracking-wide">
                          {step}
                        </span>
                      </li>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

      {/* FOOTER */}
      <div className="mt-auto text-gray-600 text-xs text-center">
        Step {activeStep + 1} of {steps.length}
      </div>
    </aside>
  );
}
