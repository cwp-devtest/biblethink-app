import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { getAllMoods, getRandomPassageForMood } from "@/data/moodPassages";

interface MoodSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MoodSelector = ({ open, onOpenChange }: MoodSelectorProps) => {
  const navigate = useNavigate();
  const moods = getAllMoods();

  const handleMoodSelect = (moodId: string) => {
    const passage = getRandomPassageForMood(moodId);
    
    if (!passage) {
      console.error('No passage found for mood:', moodId);
      return;
    }

    // Get passage length from localStorage (default: 10)
    const passageLength = localStorage.getItem("passageLength") || "10";

    onOpenChange(false);
    setTimeout(() => {
      // Navigate with passage length parameter
      navigate(`/passage?ref=${encodeURIComponent(passage)}&mode=mood&length=${passageLength}`);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display text-center mb-2">
            How are you feeling today?
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Select your mood to find passages that speak to your heart
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 mt-4">
          {moods.map((mood) => (
            <button
              key={mood.id}
              onClick={() => handleMoodSelect(mood.id)}
              className="flex flex-col items-center justify-center gap-2 p-6 
                         rounded-xl bg-gradient-to-br from-secondary to-secondary/50
                         hover:from-accent/10 hover:to-accent/5
                         transition-all duration-300 hover:-translate-y-1 
                         hover:shadow-card-hover active:scale-95
                         group"
            >
              <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                {mood.emoji}
              </span>
              <span className="font-medium text-foreground text-center">
                {mood.name}
              </span>
              <span className="text-xs text-muted-foreground text-center line-clamp-2">
                {mood.description}
              </span>
            </button>
          ))}
        </div>
        <div className="mt-4 text-xs text-center text-muted-foreground">
          Each mood has 10+ carefully selected passages
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MoodSelector;
