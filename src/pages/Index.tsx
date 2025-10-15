import { Shuffle, Eye, Heart, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProgress, getPassagesReadThisWeek, getUnreadPassagesCount, getRandomUnreadPassage } from "@/services/firebaseStorageService";
import ProgressHeader from "@/components/ProgressHeader";
import StudyCard from "@/components/StudyCard";
import SearchBar from "@/components/SearchBar";
import MoodSelector from "@/components/MoodSelector";
import ThemeToggle from "@/components/ThemeToggle";
import PassageLengthControl from "@/components/PassageLengthControl";

const Index = () => {
  const navigate = useNavigate();
  const [moodSelectorOpen, setMoodSelectorOpen] = useState(false);
  const { user, loading, signInAnonymously } = useAuth();
  
  // Real progress data from Firebase
  const [weeklyPassages, setWeeklyPassages] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  // Load real progress data
  useEffect(() => {
    let mounted = true; // Track if component is still mounted
    
    const loadProgress = async () => {
      if (!user) {
        setLoadingProgress(false);
        return;
      }

      setLoadingProgress(true);
      try {
        console.log('Loading progress for user:', user.uid);
        
        // Get progress from Firebase
        const progress = await getUserProgress(user.uid);
        const weeklyCount = await getPassagesReadThisWeek(user.uid);
        const unreadPassagesCount = await getUnreadPassagesCount(user.uid);
        
        console.log('Progress data:', { progress, weeklyCount, unreadPassagesCount });
        
        // Only update state if component is still mounted
        if (mounted) {
          if (progress) {
            setStreakDays(progress.currentStreak);
          } else {
            setStreakDays(0);
          }
          
          setWeeklyPassages(weeklyCount);
          setUnreadCount(unreadPassagesCount);
        }
      } catch (error) {
        console.error('Error loading progress:', error);
        if (mounted) {
          setWeeklyPassages(0);
          setStreakDays(0);
          setUnreadCount(0);
        }
      } finally {
        if (mounted) {
          setLoadingProgress(false);
        }
      }
    };

    if (user) {
      loadProgress();
    }
    
    // Cleanup function
    return () => {
      mounted = false;
    };
  }, [user]);

  const handleCardClick = async (mode: string) => {
    // Get passage length from localStorage (default: 10)
    const passageLength = localStorage.getItem("passageLength") || "10";
    
    if (mode === "Mood") {
      setMoodSelectorOpen(true);
    } else if (mode === "Random") {
      // Navigate with random ref and passage length - PassageReader will fetch random passage
      navigate(`/passage?ref=random&mode=random&length=${passageLength}&t=${Date.now()}`);
    } else if (mode === "Unseen") {
      // Get a random UNREAD passage
      if (!user) {
        console.error('No user logged in');
        return;
      }
      
      console.log('Getting random unread passage...');
      const unreadRef = await getRandomUnreadPassage(user.uid);
      
      if (unreadRef) {
        console.log('Navigating to unread passage:', unreadRef);
        navigate(`/passage?ref=${encodeURIComponent(unreadRef)}&mode=unseen&length=${passageLength}&t=${Date.now()}`);
      } else {
        console.error('Could not find unread passage, falling back to random');
        navigate(`/passage?ref=random&mode=unseen&length=${passageLength}&t=${Date.now()}`);
      }
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
      description: unreadCount > 0 
        ? `Explore new territory. ${unreadCount.toLocaleString()} passages waiting for you!`
        : "Explore new territory. Read passages you haven't encountered yet.",
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
      <div className="max-w-md mx-auto px-6 py-8 min-w-0"> {/* Added min-w-0 to prevent flex shrinking */}
        {/* Header */}
        <header className="relative text-center mb-8 pt-2">
          {/* Theme Toggle - Top Left */}
          <div className="absolute top-0 left-0 z-20">
            <ThemeToggle />
          </div>
          
          {/* Passage Length Control - Top Left, next to Theme Toggle */}
          <div className="absolute top-0 left-14 z-20">
            <PassageLengthControl />
          </div>
          
          {/* Profile Button - Top Right */}
          {user && (
            <button
              onClick={() => navigate('/profile')}
              className="absolute top-0 right-0 z-20 w-12 h-12 rounded-full bg-primary/10 
                        hover:bg-primary/20 transition-colors flex items-center justify-center
                        cursor-pointer"
            >
              <User className="w-6 h-6 text-primary" />
            </button>
          )}
          
          <h1 className="text-4xl font-display font-bold text-primary animate-float mb-2">
            BibleThink
          </h1>
          <p className="text-muted-foreground font-medium">
            Read. Reflect. Grow.
          </p>
          {user && !loadingProgress && (
            <p className="text-xs text-green-600 mt-2">
              ✅ {user.email || `User: ${user.uid.slice(0, 8)}...`}
            </p>
          )}
        </header>

        {/* Progress Section */}
        {loadingProgress ? (
          <div className="mb-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-xs text-muted-foreground mt-2">Loading your progress...</p>
          </div>
        ) : (
          <ProgressHeader 
            weeklyPassages={weeklyPassages}
            weeklyGoal={7}
            streakDays={streakDays}
          />
        )}

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
