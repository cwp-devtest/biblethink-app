/**
 * Bible Service - Handles loading and parsing ASV Bible data
 */

export interface BibleVerse {
  number: number;
  text: string;
}

export interface BiblePassage {
  reference: string;
  book: string;
  chapter: number;
  startVerse: number;
  endVerse: number;
  verses: BibleVerse[];
}

export interface BibleData {
  [book: string]: {
    [chapter: string]: {
      [verse: string]: string;
    };
  };
}

class BibleService {
  private bibleData: BibleData | null = null;
  private loading: boolean = false;
  private loadPromise: Promise<BibleData> | null = null;

  /**
   * Load the ASV Bible data from JSON file
   */
  async loadBibleData(): Promise<BibleData> {
    if (this.bibleData) {
      return this.bibleData;
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loading = true;
    this.loadPromise = (async () => {
      try {
        const response = await fetch('/ASV_bible.json');
        if (!response.ok) {
          throw new Error('Failed to load Bible data');
        }
        this.bibleData = await response.json();
        this.loading = false;
        return this.bibleData;
      } catch (error) {
        this.loading = false;
        this.loadPromise = null;
        console.error('Error loading Bible data:', error);
        throw error;
      }
    })();

    return this.loadPromise;
  }

  /**
   * Parse a Bible reference string (e.g., "Genesis 1:1-5" or "John 3:16")
   */
  parseReference(reference: string): { 
    book: string; 
    chapter: number; 
    startVerse: number; 
    endVerse: number;
  } | null {
    // Handle formats: "Genesis 1:1", "Genesis 1:1-5", "John 3:16"
    const match = reference.match(/^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/);
    
    if (!match) {
      return null;
    }

    const [, book, chapter, startVerse, endVerse] = match;

    return {
      book: book.trim(),
      chapter: parseInt(chapter),
      startVerse: parseInt(startVerse),
      endVerse: endVerse ? parseInt(endVerse) : parseInt(startVerse),
    };
  }

  /**
   * Get a passage from the Bible
   */
  async getPassage(reference: string): Promise<BiblePassage | null> {
    const parsed = this.parseReference(reference);
    if (!parsed) {
      console.error('Invalid reference format:', reference);
      return null;
    }

    const data = await this.loadBibleData();
    const { book, chapter, startVerse, endVerse } = parsed;

    // Check if book exists
    if (!data[book]) {
      console.error('Book not found:', book);
      return null;
    }

    // Check if chapter exists
    if (!data[book][chapter.toString()]) {
      console.error('Chapter not found:', chapter);
      return null;
    }

    const chapterData = data[book][chapter.toString()];
    const verses: BibleVerse[] = [];

    for (let v = startVerse; v <= endVerse; v++) {
      const verseText = chapterData[v.toString()];
      if (verseText) {
        verses.push({
          number: v,
          text: verseText,
        });
      }
    }

    if (verses.length === 0) {
      console.error('No verses found for reference:', reference);
      return null;
    }

    return {
      reference,
      book,
      chapter,
      startVerse,
      endVerse,
      verses,
    };
  }

  /**
   * Get a random passage from the Bible
   */
  async getRandomPassage(verseCount: number = 5): Promise<BiblePassage> {
    const data = await this.loadBibleData();
    const books = Object.keys(data);
    
    // Pick random book
    const randomBook = books[Math.floor(Math.random() * books.length)];
    const chapters = Object.keys(data[randomBook]);
    
    // Pick random chapter
    const randomChapter = chapters[Math.floor(Math.random() * chapters.length)];
    const verses = Object.keys(data[randomBook][randomChapter]);
    
    // Pick random starting verse (ensure we have enough verses)
    const maxStart = Math.max(1, verses.length - verseCount + 1);
    const randomStart = Math.floor(Math.random() * maxStart) + 1;
    const endVerse = Math.min(randomStart + verseCount - 1, verses.length);

    const reference = `${randomBook} ${randomChapter}:${randomStart}-${endVerse}`;
    const passage = await this.getPassage(reference);
    
    // Fallback in case getPassage fails
    if (!passage) {
      return this.getRandomPassage(verseCount);
    }
    
    return passage;
  }

  /**
   * Get all book names
   */
  async getBookNames(): Promise<string[]> {
    const data = await this.loadBibleData();
    return Object.keys(data);
  }

  /**
   * Search for passages containing a keyword
   */
  async searchPassages(query: string, limit: number = 20): Promise<{
    book: string;
    chapter: number;
    verse: number;
    text: string;
    reference: string;
  }[]> {
    const data = await this.loadBibleData();
    const results: {
      book: string;
      chapter: number;
      verse: number;
      text: string;
      reference: string;
    }[] = [];
    const lowerQuery = query.toLowerCase();

    for (const book of Object.keys(data)) {
      if (results.length >= limit) break;

      for (const chapter of Object.keys(data[book])) {
        if (results.length >= limit) break;

        for (const verse of Object.keys(data[book][chapter])) {
          if (results.length >= limit) break;

          const text = data[book][chapter][verse];
          if (text.toLowerCase().includes(lowerQuery)) {
            results.push({
              book,
              chapter: parseInt(chapter),
              verse: parseInt(verse),
              text,
              reference: `${book} ${chapter}:${verse}`,
            });
          }
        }
      }
    }

    return results;
  }
}

// Export singleton instance
export const bibleService = new BibleService();
