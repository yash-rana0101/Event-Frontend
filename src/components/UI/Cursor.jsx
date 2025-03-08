import React, { useState, useEffect } from "react";
import gsap from "gsap";
import cursor from "../../assets/cursor/cursor.svg";
import hoverCursor from "../../assets/cursor/hover-cursor.svg";
import textCursor from "../../assets/cursor/text-cursor.svg";

const CustomCursor = () => {
  const [cursorType, setCursorType] = useState("default");

  useEffect(() => {
    const moveCursor = (e) => {
      gsap.to(".custom-cursor", {
        x: e.clientX,
        y: e.clientY,
        duration: 0.2,
        ease: "power2.out",
      });
    };

    const handleMouseOver = (e) => {
      // Check if the element or its parents have specific properties
      const target = e.target;

      if (target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.classList.contains('clickable') ||
        target.closest('.clickable')) {
        setCursorType("hover");
      } else if (
        target.tagName.toLowerCase() === 'input' ||
        target.tagName.toLowerCase() === 'textarea' ||
        target.isContentEditable
      ) {
        setCursorType("text");
      } else {
        setCursorType("default");
      }
    };

    document.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  const getCursorImage = () => {
    switch (cursorType) {
      case "hover":
        return hoverCursor;
      case "text":
        return textCursor;
      default:
        return cursor;
    }
  };

  const getCursorSize = () => {
    switch (cursorType) {
      case "hover":
        return "w-6 h-6";
      case "text":
        return "w-6 h-12";
      default:
        return "w-6 h-6";
    }
  };

  return (
    <div
      className="custom-cursor fixed pointer-events-none z-[9999]"
      style={{ transform: "translate(-50%, -50%)" }}
    >
      <img
        src={getCursorImage()}
        alt={`${cursorType} Cursor`}
        className={`${getCursorSize()} transition-all duration-150`}
      />
    </div>
  );
};

export default CustomCursor;