import { ArrowLeft, BookOpen, FileText, LogOut, Trash2, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { 
  getReadPassages, 
  getUserProgress, 
  ReadPassage,
  updatePassageNotes 
} from "@/services/firebaseStorageService";
import { useToast } from "@/hooks/use-toast";
import ThemeToggle from "@/components/ThemeToggle";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  
  const [readPassages, setReadPassages] = useState<ReadPassage[]>([]);
  const [totalRead, setTotalRead] = useState(0);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Edit notes dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingPassage, setEditingPassage] = useState<ReadPassage | null>(null);
  const [editedNotes, setEditedNotes] = useState("");

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadUserData();
  }, [user, navigate]);

  const loadUserData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const passages = await getReadPassages(user.uid);
      const progress = await getUserProgress(user.uid);
      
      // Sort by most recent first
      const sortedPassages = passages.sort((a, b) => {
        const dateA = a.readAt?.toDate?.() || new Date(0);
        const dateB = b.readAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
      
      setReadPassages(sortedPassages);
      setTotalRead(progress?.totalPassagesRead || passages.length);
      setStreak(progress?.currentStreak || 0);
    } catch (error) {
      console.error('Error loading user data:', error);
      toast({
        title: "Error",
        description: "Failed to load your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      });
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditNotes = (passage: ReadPassage) => {
    setEditingPassage(passage);
    setEditedNotes(passage.notes || "");
    setEditDialogOpen(true);
  };

  const handleSaveNotes = async () => {
    if (!user || !editingPassage) return;
    
    try {
      await updatePassageNotes(user.uid, editingPassage.reference, editedNotes);
      
      // Update local state
      setReadPassages(passages => 
        passages.map(p => 
          p.reference === editingPassage.reference 
            ? { ...p, notes: editedNotes }
            : p
        )
      );
      
      toast({
        title: "Notes updated!",
        description: "Your reflection has been saved.",
      });
      
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Error saving notes:', error);
      toast({
        title: "Error",
        description: "Failed to save notes. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Unknown date";
    const date = timestamp.toDate?.() || new Date(timestamp);
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const passagesWithNotes = readPassages.filter(p => p.notes && p.notes.trim().length > 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
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
          </div>
          
          <h1 className="text-3xl font-display font-bold text-primary">
            Profile
          </h1>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            className="hover:bg-destructive/10 text-destructive w-12 h-12"
          >
            <LogOut className="w-6 h-6" />
          </Button>
        </header>

        {/* User Info Card */}
        <Card className="mb-6 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl">{user?.email?.[0].toUpperCase() || '👤'}</span>
              </div>
              <div>
                <div className="text-xl">{user?.email || 'Guest User'}</div>
                {user?.isAnonymous && (
                  <div className="text-xs text-muted-foreground">Anonymous Account</div>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-secondary/50 rounded-lg">
                <div className="text-3xl font-bold text-primary">{totalRead}</div>
                <div className="text-sm text-muted-foreground">Passages Read</div>
              </div>
              <div className="text-center p-4 bg-secondary/50 rounded-lg">
                <div className="text-3xl font-bold text-primary">{streak}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes Section */}
        <Card className="mb-6 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Your Notes
            </CardTitle>
            <CardDescription>
              {passagesWithNotes.length} passages with reflections
            </CardDescription>
          </CardHeader>
          <CardContent>
            {passagesWithNotes.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No notes yet. Start reading and reflecting!
              </p>
            ) : (
              <div className="space-y-4">
                {passagesWithNotes.map((passage) => (
                  <div 
                    key={passage.reference}
                    className="border border-border rounded-lg p-4 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <button
                        onClick={() => navigate(`/passage?ref=${encodeURIComponent(passage.reference)}`)}
                        className="font-semibold text-primary hover:underline"
                      >
                        {passage.reference}
                      </button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditNotes(passage)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {formatDate(passage.readAt)}
                    </p>
                    <p className="text-sm whitespace-pre-wrap">
                      {passage.notes}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reading History */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Reading History
            </CardTitle>
            <CardDescription>
              All {readPassages.length} passages you've read
            </CardDescription>
          </CardHeader>
          <CardContent>
            {readPassages.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No reading history yet. Start your journey!
              </p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {readPassages.map((passage) => (
                  <button
                    key={passage.reference}
                    onClick={() => navigate(`/passage?ref=${encodeURIComponent(passage.reference)}`)}
                    className="w-full flex items-center justify-between p-3 rounded-lg 
                              hover:bg-secondary/50 transition-colors text-left"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-primary">
                        {passage.reference}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(passage.readAt)}
                      </div>
                    </div>
                    {passage.notes && (
                      <FileText className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Notes Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Notes</DialogTitle>
              <DialogDescription>
                {editingPassage?.reference}
              </DialogDescription>
            </DialogHeader>
            <Textarea
              value={editedNotes}
              onChange={(e) => setEditedNotes(e.target.value)}
              placeholder="Write your reflection..."
              className="min-h-32"
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveNotes}>
                Save Notes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Profile;
