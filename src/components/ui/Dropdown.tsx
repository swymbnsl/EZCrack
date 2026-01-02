import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { useRef, useState } from "react"
import { useClickOutside } from "@/hooks/useClickOutside"
import { useTheme } from "@/contexts/ThemeContext"
import { lightTheme, darkTheme, commonColors } from "@/constants/colors"

interface DropdownProps {
  options: string[]
  value: string
  onChange: (value: string) => void
  placeholder: string
}

export const Dropdown = ({
  options,
  value,
  onChange,
  placeholder,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const isLight = theme === "light"
  const colors = isLight ? lightTheme : darkTheme
  const shadowColor = isLight
    ? commonColors.shadowLight
    : commonColors.shadowDark

  useClickOutside(dropdownRef as React.RefObject<HTMLElement>, () =>
    setIsOpen(false)
  )

  const handleToggle = () => setIsOpen(!isOpen)

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={placeholder}
        className="w-full p-3 sm:p-5 text-left rounded-none border-4 flex items-center justify-between text-base sm:text-lg font-medium"
        style={{
          backgroundColor: colors.backgroundCard,
          borderColor: colors.border,
          boxShadow: `8px 8px 0px 0px ${shadowColor}`,
        }}
        whileTap={{
          boxShadow: `2px 2px 0px ${shadowColor}`,
          transform: "translateX(2px) translateY(2px)",
        }}
        transition={{ duration: 0.2 }}
      >
        <span style={{ color: !value ? colors.textMuted : colors.text }}>
          {value || placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ color: colors.text }}
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
          className="absolute z-10 w-full mt-2 sm:mt-3 border-4 max-h-52 sm:max-h-60 overflow-y-auto overflow-x-hidden scrollbar-thin"
          style={{
            backgroundColor: colors.backgroundCard,
            borderColor: colors.border,
            boxShadow: `4px 4px 0px 0px ${shadowColor}`,
            scrollbarWidth: "thin",
            scrollbarColor: `${colors.accent} ${colors.backgroundCard}`,
          }}
        >
          {options.map((option) => (
            <li key={option}>
              <motion.button
                onClick={() => {
                  onChange(option)
                  setIsOpen(false)
                }}
                className="w-full p-3 sm:p-4 text-left border-b-2 last:border-b-0 text-sm sm:text-base font-medium"
                style={{
                  borderColor: isLight ? colors.border : `${colors.border}80`,
                  color: colors.text,
                }}
                whileHover={{
                  backgroundColor: isLight ? colors.secondary : colors.primary,
                  color: colors.textOnPrimary,
                  x: 3,
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
  )
}
