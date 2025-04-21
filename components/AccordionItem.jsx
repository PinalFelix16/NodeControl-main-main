import React, { useState } from "react";

const AccordionItem = ({ children, title }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full text-left py-4 px-6 bg-gray-100 hover:bg-gray-200 focus:outline-none"
        onClick={toggleAccordion}
      >
        {title}
      </button>
      <div
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{ maxHeight: `${isOpen ? "100vh" : "0"}` }}
      >
        <div style={{ padding: "1rem", backgroundColor: "#d4d4d8" }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AccordionItem;
