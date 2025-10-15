import { ArrowLeft, ChevronLeft, ChevronRight, Save, Check, Shuffle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { bibleService, BiblePassage } from "@/services/bibleService";
import { usePassage } from "@/contexts/PassageContext";
import { useAuth } from "@/contexts/AuthContext";
import { 
  markPassageAsRead, 
  getPassageNotes, 
  updatePassageNotes,
  isPassageRead 
} from "@/services/firebaseStorageService";
import { useToast } from "@/hooks/use-toast";
import ThemeToggle from "@/components/ThemeToggle";
import FontSizeControl, { FontSize } from "@/components/FontSizeControl";

const PassageReader = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const passageRef = searchParams.get("ref") || "Genesis 1:1-5";
  const mode = searchParams.get("mode") || "specific";
  const passageLength = parseInt(searchParams.get("length") || "10");
  const [translation, setTranslation] = useState("ASV");
  const [notes, setNotes] = useState("");
  const [passage, setPassage] = useState<BiblePassage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [wasReadBefore, setWasReadBefore] = useState(false);
  const [checkingReadStatus, setCheckingReadStatus] = useState(true);
  const [fontSize, setFontSize] = useState<FontSize>("medium");
  
  const { setCurrentPassage } = usePassage();
  const { user } = useAuth();
  const { toast } = useToast();

  // Load font size preference
  useEffect(() => {
    const stored = localStorage.getItem("fontSize") as FontSize;
    if (stored) {
      setFontSize(stored);
    }
  }, []);

  useEffect(() => {
    loadPassage();
  }, [passageRef, searchParams.toString()]);

  // Check read status and load notes AFTER passage loads
  useEffect(() => {
    const checkAndSave = async () => {
      if (user && passage) {
        setCheckingReadStatus(true);
        try {
          console.log('Checking read status for:', passage.reference);
          
          // Check if ALREADY read BEFORE this session
          const alreadyRead = await isPassageRead(user.uid, passage.reference);
          console.log('Was read before?', alreadyRead);
          
          setWasReadBefore(alreadyRead);
          
          // Load existing notes if any
          const existingNotes = await getPassageNotes(user.uid, passage.reference);
          setNotes(existingNotes);
          
          // Mark as read (will update progress only if new)
          if (!alreadyRead) {
            console.log('Marking as read for first time');
            await markPassageAsRead(user.uid, passage.reference);
          } else {
            console.log('Already read, not marking again');
          }
        } catch (error) {
          console.error('Error checking read status:', error);
        } finally {
          setCheckingReadStatus(false);
        }
      }
    };
    
    if (passage) {
      checkAndSave();
    }
  }, [user, passage?.reference]); // Only re-run when passage reference changes

  const loadPassage = async () => {
    setLoading(true);
    setError(null);
    setCheckingReadStatus(true);
    setWasReadBefore(false); // Reset status when loading new passage
    
    try {
      console.log('Loading passage:', { passageRef, mode });
      let fetchedPassage: BiblePassage | null = null;

      if (mode === "random" || passageRef === "random") {
        console.log('Getting random passage with length:', passageLength);
        fetchedPassage = await bibleService.getRandomPassage(passageLength);
      } else if (mode === "mood") {
        console.log('Getting mood passage:', passageRef, 'with length:', passageLength);
        // For mood passages, parse the reference and extend to desired length
        const parsed = bibleService.parseReference(passageRef);
        if (parsed) {
          // Create new reference with the desired length
          const newRef = `${parsed.book} ${parsed.chapter}:${parsed.startVerse}-${parsed.startVerse + passageLength - 1}`;
          console.log('Extended mood reference:', newRef);
          fetchedPassage = await bibleService.getPassage(newRef);
        } else {
          // Fallback to original reference if parsing fails
          fetchedPassage = await bibleService.getPassage(passageRef);
        }
      } else {
        console.log('Getting specific passage:', passageRef);
        fetchedPassage = await bibleService.getPassage(passageRef);
      }

      if (fetchedPassage) {
        console.log('Passage loaded successfully:', fetchedPassage.reference);
        setPassage(fetchedPassage);
        setCurrentPassage(fetchedPassage);
      } else {
        console.error('Passage returned null');
        setError("Could not load passage. Please try again.");
        setCurrentPassage(null);
      }
    } catch (err) {
      console.error("Error loading passage:", err);
      setError("Failed to load Bible passage. Please check your connection.");
      setCurrentPassage(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!user || !passage) return;
    
    setIsSaving(true);
    try {
      await updatePassageNotes(user.uid, passage.reference, notes);
      toast({
        title: "Notes saved!",
        description: "Your reflection has been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving notes:', error);
      toast({
        title: "Error",
        description: "Failed to save notes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAnotherRandom = () => {
    console.log('Navigating to another random passage');
    const timestamp = Date.now();
    // Use current passage length or get from localStorage
    const currentLength = passageLength || parseInt(localStorage.getItem("passageLength") || "10");
    navigate(`/passage?ref=random&mode=random&length=${currentLength}&t=${timestamp}`);
  };

  const handlePreviousPassage = () => {
    if (!passage) return;
    
    // For now, we'll implement a simple previous chapter navigation
    // You can enhance this later to go to previous verses
    const ref = passage.reference;
    const match = ref.match(/^(\w+)\s+(\d+)/);
    
    if (match) {
      const book = match[1];
      const chapter = parseInt(match[2]);
      
      if (chapter > 1) {
        // Go to previous chapter
        const newRef = `${book} ${chapter - 1}:1-5`;
        navigate(`/passage?ref=${encodeURIComponent(newRef)}&t=${Date.now()}`);
      } else {
        // At chapter 1, could go to previous book but that's complex
        toast({
          title: "Start of book",
          description: "This is the first chapter of " + book,
        });
      }
    }
  };

  const handleNextPassage = () => {
    if (!passage) return;
    
    // Simple next chapter navigation
    const ref = passage.reference;
    const match = ref.match(/^(\w+)\s+(\d+)/);
    
    if (match) {
      const book = match[1];
      const chapter = parseInt(match[2]);
      
      // Go to next chapter (we'll add validation later)
      const newRef = `${book} ${chapter + 1}:1-5`;
      navigate(`/passage?ref=${encodeURIComponent(newRef)}&t=${Date.now()}`);
    }
  };

  useEffect(() => {
    return () => {
      setCurrentPassage(null);
    };
  }, []);

  const reflectionPrompts = [
    { 
      id: "1", 
      title: "What does this passage reveal about God's character?",
      description: "Consider the attributes and nature of God shown in this text."
    },
    { 
      id: "2", 
      title: "How can you apply this to your life today?",
      description: "Think about practical ways this passage speaks to your current situation."
    },
    { 
      id: "3", 
      title: "What questions does this raise for you?",
      description: "Explore areas of curiosity or uncertainty that emerge from this reading."
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading passage...</p>
        </div>
      </div>
    );
  }

  if (error || !passage) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <p className="text-destructive mb-4">{error || "Passage not found"}</p>
          <Button onClick={() => navigate("/")}>Return Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
                className="hover:bg-secondary w-12 h-12"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <ThemeToggle />
              <FontSizeControl value={fontSize} onChange={setFontSize} />
            </div>
            
            <div className="flex-1 text-center">
              <h2 className="font-display font-semibold text-lg">
                {passage.reference}
              </h2>
              {!checkingReadStatus && (
                <div className="flex items-center justify-center gap-3 mt-1">
                  <div className={`flex items-center gap-1.5 text-xs ${!wasReadBefore ? 'text-green-600 font-medium' : 'text-muted-foreground'}`}>
                    {!wasReadBefore && <Check className="w-4 h-4" />}
                    First time reading
                  </div>
                  <span className="text-muted-foreground">•</span>
                  <div className={`flex items-center gap-1.5 text-xs ${wasReadBefore ? 'text-green-600 font-medium' : 'text-muted-foreground'}`}>
                    {wasReadBefore && <Check className="w-4 h-4" />}
                    Read before
                  </div>
                </div>
              )}
              {checkingReadStatus && (
                <p className="text-xs text-muted-foreground mt-1">Checking status...</p>
              )}
            </div>
            
            <Select value={translation} onValueChange={setTranslation}>
              <SelectTrigger className="w-24 border-none shadow-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ASV">ASV</SelectItem>
                <SelectItem value="KJV">KJV</SelectItem>
                <SelectItem value="NIV">NIV</SelectItem>
                <SelectItem value="ESV">ESV</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </header>

        {/* Bible Text */}
        <main className="px-6 py-8">
          <div className="space-y-6 mb-12">
            {passage.verses.map((verse) => (
              <div key={verse.number} className="flex gap-4 group">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 
                               text-primary text-sm font-semibold flex items-center 
                               justify-center">
                  {verse.number}
                </span>
                <p className={`font-serif leading-relaxed text-foreground pt-0.5 ${
                  fontSize === 'small' ? 'text-base' :
                  fontSize === 'medium' ? 'text-lg' :
                  fontSize === 'large' ? 'text-xl' :
                  'text-2xl'
                }`}>
                  {verse.text}
                </p>
              </div>
            ))}
          </div>

          {/* Reflection Section */}
          <section className="bg-gradient-to-br from-secondary/50 to-secondary/30 
                             rounded-2xl p-6 shadow-card mb-8">
            <h3 className="text-2xl font-display font-semibold text-primary mb-1 
                          flex items-center gap-2">
              <span>💭</span> Reflect on this
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Take a moment to think deeply about what you've read
            </p>

            <Accordion type="single" collapsible className="space-y-3">
              {reflectionPrompts.map((prompt) => (
                <AccordionItem 
                  key={prompt.id} 
                  value={prompt.id}
                  className="bg-background rounded-xl border border-border overflow-hidden"
                >
                  <AccordionTrigger className="px-4 py-3 hover:no-underline 
                                               hover:bg-secondary/50 transition-colors">
                    <span className="text-left font-medium">{prompt.title}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-3">
                    <p className="text-sm text-muted-foreground mb-3">
                      {prompt.description}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Personal Notes
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write your thoughts, prayers, or insights..."
                className="min-h-32 resize-none"
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground">
                  {notes.length} characters
                </p>
                <Button 
                  size="sm" 
                  onClick={handleSaveNotes}
                  disabled={isSaving}
                  className="gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? "Saving..." : "Save Notes"}
                </Button>
              </div>
            </div>
          </section>

          {/* Navigation */}
          <div className="space-y-3">
            {/* Chapter Navigation */}
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handlePreviousPassage}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous Chapter
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleNextPassage}
              >
                Next Chapter
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            
            {/* Random Passage Button */}
            <Button
              variant="default"
              className="w-full"
              onClick={handleAnotherRandom}
            >
              <Shuffle className="w-4 h-4 mr-2" />
              Random Passage
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PassageReader;
