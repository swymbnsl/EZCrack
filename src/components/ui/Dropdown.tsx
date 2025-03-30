import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useRef, useState } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useTheme } from "@/contexts/ThemeContext";

interface DropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export const Dropdown = ({
  options,
  value,
  onChange,
  placeholder,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isLight = theme === "light";

  useClickOutside(dropdownRef as React.RefObject<HTMLElement>, () =>
    setIsOpen(false)
  );

  const handleToggle = () => setIsOpen(!isOpen);

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={placeholder}
        className={`w-full p-3 sm:p-5 text-left rounded-none 
          ${isLight 
            ? "bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" 
            : "bg-[#1E1E1E] border-4 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)] sm:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.8)]"
          } flex items-center justify-between text-base sm:text-lg font-medium`}
        whileHover={{ 
          boxShadow: isLight 
            ? "8px 8px 0px rgba(0,0,0,1)" 
            : "8px 8px 0px rgba(255,255,255,0.8)" 
        }}
        whileTap={{ 
          boxShadow: isLight 
            ? "2px 2px 0px rgba(0,0,0,1)" 
            : "2px 2px 0px rgba(255,255,255,0.8)",
          transform: "translateX(2px) translateY(2px)"
        }}
        transition={{ duration: 0.2 }}
      >
        <span className={`${!value ? (isLight ? "text-gray-500" : "text-gray-400") : (isLight ? "text-black" : "text-white")}`}>
          {value || placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className={isLight ? "text-black" : "text-white"}
        >
          <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
        </motion.div>
      </motion.button>

      {isOpen && (
        <motion.ul
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
          className={`absolute z-10 w-full mt-2 sm:mt-3 
            ${isLight 
              ? "bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]" 
              : "bg-[#1E1E1E] border-4 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)] sm:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.8)]"
            } max-h-52 sm:max-h-60 overflow-y-auto overflow-x-hidden scrollbar-thin`}
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: isLight 
              ? '#FF7B54 #ffffff' 
              : '#4ECDC4 #1E1E1E',
          }}
        >
          {options.map((option) => (
            <li key={option}>
              <motion.button
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`w-full p-3 sm:p-4 text-left 
                  ${isLight 
                    ? "border-b-2 border-black last:border-b-0 text-black" 
                    : "border-b-2 border-white/50 last:border-b-0 text-white"
                  } text-sm sm:text-base font-medium`}
                whileHover={{ 
                  backgroundColor: isLight ? "#FFD56B" : "#4ECDC4",
                  color: isLight ? "black" : "#121212",
                  x: 3 
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.1 }}
              >
                {option}
              </motion.button>
            </li>
          ))}
        </motion.ul>
      )}
    </div>
  );
};
