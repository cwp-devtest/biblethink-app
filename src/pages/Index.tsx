import { Shuffle, Eye, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ProgressHeader from "@/components/ProgressHeader";
import StudyCard from "@/components/StudyCard";
import SearchBar from "@/components/SearchBar";
import MoodSelector from "@/components/MoodSelector";

const Index = () => {
  const navigate = useNavigate();
  const [moodSelectorOpen, setMoodSelectorOpen] = useState(false);

  const handleCardClick = (mode: string) => {
    if (mode === "Mood") {
      setMoodSelectorOpen(true);
    } else if (mode === "Random") {
      navigate("/passage?ref=Genesis 1:1-5&mode=random");
    } else if (mode === "Unseen") {
      navigate("/passage?ref=John 3:16&mode=unseen");
    }
  };

  const studyModes = [
    {
      title: "Random",
      description: "Discover unexpected wisdom. Let the Bible surprise you with a randomly selected passage.",
      icon: Shuffle,
      gradientClass: "bg-gradient-random",
      mode: "Random"
    },
    {
      title: "Unseen",
      description: "Explore new territory. Read passages you haven't encountered yet in your journey.",
      icon: Eye,
      gradientClass: "bg-gradient-unseen",
      mode: "Unseen"
    },
    {
      title: "Mood",
      description: "Find what speaks to you. Get passages that match how you're feeling today.",
      icon: Heart,
      gradientClass: "bg-gradient-mood",
      mode: "Mood"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-6 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold text-primary animate-float mb-2">
            BibleThink
          </h1>
          <p className="text-muted-foreground font-medium">
            Read. Reflect. Grow.
          </p>
        </header>

        {/* Progress Section */}
        <ProgressHeader 
          weeklyPassages={3}
          weeklyGoal={7}
          streakDays={5}
        />

        {/* Study Mode Cards */}
        <div className="space-y-4 mb-8">
          {studyModes.map((mode) => (
            <StudyCard
              key={mode.title}
              title={mode.title}
              description={mode.description}
              icon={mode.icon}
              gradientClass={mode.gradientClass}
              onClick={() => handleCardClick(mode.mode)}
            />
          ))}
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar />
        </div>

        {/* Footer */}
        <footer className="mt-4 text-center text-sm text-muted-foreground">
          <p>Building your daily Bible reading habit</p>
        </footer>
      </div>

      {/* Mood Selector Modal */}
      <MoodSelector open={moodSelectorOpen} onOpenChange={setMoodSelectorOpen} />
    </div>
  );
};

export default Index;
