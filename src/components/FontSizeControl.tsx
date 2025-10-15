import { Type } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export type FontSize = "small" | "medium" | "large" | "extra-large";

interface FontSizeControlProps {
  value?: FontSize;
  onChange?: (size: FontSize) => void;
}

const FontSizeControl = ({ value, onChange }: FontSizeControlProps) => {
  const [fontSize, setFontSize] = useState<FontSize>("medium");

  useEffect(() => {
    // Load from localStorage or use prop
    const stored = localStorage.getItem("fontSize") as FontSize;
    const initialSize = value || stored || "medium";
    setFontSize(initialSize);
  }, [value]);

  const handleSizeChange = (size: FontSize) => {
    setFontSize(size);
    localStorage.setItem("fontSize", size);
    if (onChange) {
      onChange(size);
    }
  };

  const sizeLabels = {
    small: "Small",
    medium: "Medium",
    large: "Large",
    "extra-large": "Extra Large",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-secondary w-12 h-12 rounded-full"
          title="Change font size"
        >
          <Type className="w-6 h-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.keys(sizeLabels) as FontSize[]).map((size) => (
          <DropdownMenuItem
            key={size}
            onClick={() => handleSizeChange(size)}
            className={fontSize === size ? "bg-secondary" : ""}
          >
            <span className={fontSize === size ? "font-semibold" : ""}>
              {sizeLabels[size]}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FontSizeControl;
export { FontSizeControl };
