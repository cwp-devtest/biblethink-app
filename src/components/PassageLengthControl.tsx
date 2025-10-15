import { BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export type PassageLength = 3 | 5 | 10 | 15;

interface PassageLengthControlProps {
  value?: PassageLength;
  onChange?: (length: PassageLength) => void;
}

const PassageLengthControl = ({ value, onChange }: PassageLengthControlProps) => {
  const [passageLength, setPassageLength] = useState<PassageLength>(10);

  useEffect(() => {
    // Load from localStorage or use prop
    const stored = localStorage.getItem("passageLength");
    const initialLength = value || (stored ? parseInt(stored) as PassageLength : 10);
    setPassageLength(initialLength);
  }, [value]);

  const handleLengthChange = (length: PassageLength) => {
    setPassageLength(length);
    localStorage.setItem("passageLength", length.toString());
    if (onChange) {
      onChange(length);
    }
  };

  const lengthLabels: Record<PassageLength, string> = {
    3: "3 verses (Quick)",
    5: "5 verses (Light)",
    10: "10 verses (Standard)",
    15: "15 verses (Deep)",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-secondary w-12 h-12 rounded-full"
          title="Change passage length"
        >
          <BookOpen className="w-6 h-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {([3, 5, 10, 15] as PassageLength[]).map((length) => (
          <DropdownMenuItem
            key={length}
            onClick={() => handleLengthChange(length)}
            className={passageLength === length ? "bg-secondary" : ""}
          >
            <span className={passageLength === length ? "font-semibold" : ""}>
              {lengthLabels[length]}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PassageLengthControl;
export { PassageLengthControl };
