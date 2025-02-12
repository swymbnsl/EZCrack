import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useRef, useState } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";

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

  useClickOutside(dropdownRef as React.RefObject<HTMLElement>, () =>
    setIsOpen(false)
  );

  const handleToggle = () => setIsOpen(!isOpen);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={placeholder}
        className="w-full p-5 text-left rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-lg flex items-center justify-between hover:bg-gray-800/70 transition-all text-lg"
      >
        <span className={`${!value && "text-gray-500"}`}>
          {value || placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </button>

      {isOpen && (
        <motion.ul
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute z-10 w-full mt-2 rounded-2xl bg-gray-800/90 backdrop-blur-sm border border-gray-700 shadow-xl max-h-60 overflow-auto no-scrollbar"
        >
          {options.map((option) => (
            <li key={option}>
              <button
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className="w-full p-4 text-left hover:bg-gray-700/50 transition-colors text-gray-300 hover:text-white"
              >
                {option}
              </button>
            </li>
          ))}
        </motion.ul>
      )}
    </div>
  );
};
