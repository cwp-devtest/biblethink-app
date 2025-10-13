import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface MoodSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MoodSelector = ({ open, onOpenChange }: MoodSelectorProps) => {
  const navigate = useNavigate();

  const moods = [
    { emoji: "😌", label: "Anxious", passage: "Philippians 4:6-7" },
    { emoji: "🙏", label: "Grateful", passage: "Psalm 100" },
    { emoji: "😢", label: "Sad", passage: "Psalm 34:18" },
    { emoji: "🤔", label: "Confused", passage: "Proverbs 3:5-6" },
    { emoji: "😊", label: "Joyful", passage: "Psalm 118:24" },
    { emoji: "😠", label: "Frustrated", passage: "James 1:19-20" }
  ];

  const handleMoodSelect = (passage: string) => {
    onOpenChange(false);
    setTimeout(() => {
      navigate(`/passage?ref=${encodeURIComponent(passage)}&mode=mood`);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display text-center mb-4">
            How are you feeling today?
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          {moods.map((mood) => (
            <button
              key={mood.label}
              onClick={() => handleMoodSelect(mood.passage)}
              className="flex flex-col items-center justify-center gap-2 p-6 
                         rounded-xl bg-gradient-to-br from-secondary to-secondary/50
                         hover:from-accent/10 hover:to-accent/5
                         transition-all duration-300 hover:-translate-y-1 
                         hover:shadow-card-hover active:scale-95"
            >
              <span className="text-4xl">{mood.emoji}</span>
              <span className="font-medium text-foreground">{mood.label}</span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MoodSelector;
