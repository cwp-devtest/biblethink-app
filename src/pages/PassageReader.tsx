import { ArrowLeft, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const PassageReader = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const passageRef = searchParams.get("ref") || "Genesis 1:1-5";
  const mode = searchParams.get("mode") || "random";
  const [translation, setTranslation] = useState("ASV");
  const [notes, setNotes] = useState("");

  // Sample passage data
  const passage = {
    reference: passageRef,
    verses: [
      { number: 1, text: "In the beginning God created the heavens and the earth." },
      { number: 2, text: "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters." },
      { number: 3, text: "And God said, Let there be light: and there was light." },
      { number: 4, text: "And God saw the light, that it was good: and God divided the light from the darkness." },
      { number: 5, text: "And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day." }
    ]
  };

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

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="hover:bg-secondary"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <h2 className="font-display font-semibold text-lg text-center flex-1">
              {passage.reference}
            </h2>
            
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
                <p className="font-serif text-lg leading-relaxed text-foreground pt-0.5">
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
              <p className="text-xs text-muted-foreground mt-2">
                {notes.length} characters
              </p>
            </div>
          </section>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate(`/passage?ref=previous&mode=${mode}`)}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button
              variant="default"
              className="flex-1"
              onClick={() => navigate(`/passage?ref=next&mode=${mode}`)}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PassageReader;
