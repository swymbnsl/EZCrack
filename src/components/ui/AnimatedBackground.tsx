"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { usePathname } from "next/navigation";

export const AnimatedBackground = () => {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const pathname = usePathname();
  const [hoveredShape, setHoveredShape] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Show the animated background on the homepage and notice page
  const showOnPages = pathname === "/" || pathname === "/home" || pathname === "/notice";
  
  // If not on allowed pages, don't render anything
  if (!showOnPages) return null;
  
  // Define shapes with their properties, fewer for mobile
  const shapes = [
    // First shape - top left
    { 
      top: "10%", 
      left: "20%", 
      size: isMobile ? "w-16 h-16" : "w-24 h-24", 
      color: isLight ? "bg-[#FF7B54]" : "bg-[#FF6B6B]", 
      rotate: "rotate-12",
      mobileHide: false
    },
    // Second shape - top right
    { 
      top: "35%", 
      right: "15%", 
      size: isMobile ? "w-20 h-20" : "w-32 h-32", 
      color: isLight ? "bg-[#FFB26B]" : "bg-[#4ECDC4]", 
      rotate: "-rotate-6",
      mobileHide: false
    },
    // Third shape - bottom left
    { 
      bottom: "20%", 
      left: "30%", 
      size: isMobile ? "w-24 h-24" : "w-40 h-40", 
      color: isLight ? "bg-[#76ABAE]" : "bg-[#FFE66D]", 
      rotate: "rotate-45",
      mobileHide: false
    },
    // Fourth shape - bottom right
    { 
      bottom: "15%", 
      right: "15%", 
      size: isMobile ? "w-20 h-20" : "w-28 h-28", 
      color: isLight ? "bg-[#424C4D]" : "bg-[#FF9F1C]", 
      rotate: "-rotate-12",
      mobileHide: false
    },
    // Fifth shape - mid left (hide on mobile)
    { 
      top: "60%", 
      left: "10%", 
      size: "w-20 h-20", 
      color: isLight ? "bg-[#424C4D]" : "bg-[#7A9E7E]", 
      rotate: "rotate-20",
      mobileHide: true
    },
    // Sixth shape - mid right (hide on mobile)
    { 
      top: "15%", 
      right: "30%", 
      size: "w-16 h-16", 
      color: isLight ? "bg-[#FFD56B]" : "bg-[#F38181]", 
      rotate: "rotate-30",
      mobileHide: true
    },
  ];
  
  // Filter shapes for mobile
  const displayShapes = isMobile 
    ? shapes.filter(shape => !shape.mobileHide)
    : shapes;
  
  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className={`absolute inset-0 ${isLight ? "bg-[#FFFFFA]" : "bg-[#121212]"}`}>
        {/* Interactive shapes */}
        {displayShapes.map((shape, index) => (
          <motion.div
            key={index}
            className={`absolute ${shape.size} ${shape.color} transform ${shape.rotate} 
              border-2 sm:border-4 ${isLight ? "border-black" : "border-white"} cursor-pointer`}
            style={{
              top: shape.top || "auto",
              left: shape.left || "auto", 
              right: shape.right || "auto",
              bottom: shape.bottom || "auto",
              zIndex: hoveredShape === index ? 10 : 1,
              opacity: isMobile ? 0.85 : 1 // Slightly transparent on mobile
            }}
            initial={{ 
              boxShadow: isLight 
                ? "3px 3px 0px rgba(0,0,0,1)" 
                : "3px 3px 0px rgba(255,255,255,0.8)" 
            }}
            animate={{ 
              y: isMobile ? [0, -5, 0] : [0, -10, 0], // Smaller movement on mobile
              boxShadow: hoveredShape === index
                ? isLight 
                  ? "6px 6px 0px rgba(0,0,0,1)" 
                  : "6px 6px 0px rgba(255,255,255,0.8)"
                : isLight 
                  ? "3px 3px 0px rgba(0,0,0,1)" 
                  : "3px 3px 0px rgba(255,255,255,0.8)"
            }}
            transition={{ 
              y: { 
                repeat: Infinity, 
                repeatType: "mirror", 
                duration: 3 + index, // Faster on mobile
                ease: "easeInOut" 
              },
              boxShadow: { duration: 0.2 }
            }}
            onMouseEnter={() => setHoveredShape(index)}
            onMouseLeave={() => setHoveredShape(null)}
            whileHover={{ 
              scale: 1.05, 
              rotate: shape.rotate.includes('-') ? "-8deg" : "8deg",
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            whileTap={{ 
              scale: 0.95, 
              rotate: "0deg",
              transition: { duration: 0.2 }
            }}
          />
        ))}
        
        {/* Grid overlay */}
        <div 
          className={`absolute inset-0 ${
            isLight 
              ? "bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"
              : "bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"
          }`}
        ></div>
      </div>
    </div>
  );
};
