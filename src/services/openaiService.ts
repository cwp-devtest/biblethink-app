/**
 * OpenAI Service - Handles AI chat interactions for Bible study
 */

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const API_URL = 'https://api.openai.com/v1/chat/completions';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  message: string;
  error?: string;
}

class OpenAIService {
  /**
   * Send a chat message to OpenAI with Bible study context
   */
  async sendMessage(
    userMessage: string,
    conversationHistory: ChatMessage[] = [],
    currentPassage?: string
  ): Promise<ChatResponse> {
    if (!API_KEY || API_KEY === 'sk-your-openai-key-here') {
      return {
        message: '',
        error: 'OpenAI API key not configured. Please add your API key to the .env file.',
      };
    }

    try {
      // Build the conversation with system prompt
      const messages: ChatMessage[] = [
        {
          role: 'system',
          content: this.getSystemPrompt(currentPassage),
        },
        ...conversationHistory,
        {
          role: 'user',
          content: userMessage,
        },
      ];

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // Fast and cost-effective
          messages: messages,
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('OpenAI API Error:', errorData);
        
        if (response.status === 401) {
          return {
            message: '',
            error: 'Invalid API key. Please check your OpenAI API key in the .env file.',
          };
        }
        
        if (response.status === 429) {
          return {
            message: '',
            error: 'Rate limit reached. Please try again in a moment.',
          };
        }

        return {
          message: '',
          error: `API Error: ${response.status}. Please try again.`,
        };
      }

      const data = await response.json();
      const assistantMessage = data.choices[0]?.message?.content || '';

      if (!assistantMessage) {
        return {
          message: '',
          error: 'No response from AI. Please try again.',
        };
      }

      return {
        message: assistantMessage.trim(),
      };
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      return {
        message: '',
        error: 'Failed to connect to AI service. Please check your internet connection.',
      };
    }
  }

  /**
   * Get the system prompt with optional passage context
   */
  private getSystemPrompt(currentPassage?: string): string {
    const basePrompt = `You are a thoughtful, knowledgeable Bible study assistant for BibleThink, an app that helps people engage deeply with scripture.

Your role is to:
- Help users understand Bible passages through historical, cultural, and literary context
- Ask thought-provoking questions that encourage personal reflection
- Provide insights without being dogmatic or prescriptive
- Respect diverse interpretations and faith traditions
- Be warm, encouraging, and non-judgmental
- Keep responses concise and accessible (2-3 paragraphs max)

You are NOT:
- A preacher or authority figure
- Trying to convert or convince anyone
- Providing absolute interpretations
- Being overly formal or academic

Remember: The goal is to help people THINK about scripture, not tell them what to think.`;

    if (currentPassage) {
      return `${basePrompt}

CURRENT PASSAGE CONTEXT:
The user is currently reading: ${currentPassage}

When they ask questions without specifying a passage, assume they're asking about this one.`;
    }

    return basePrompt;
  }

  /**
   * Generate reflection questions for a specific passage
   */
  async generateReflectionQuestions(
    passageReference: string,
    passageText: string
  ): Promise<string[]> {
    const prompt = `Generate 3 thoughtful reflection questions for this Bible passage. 
Make them invitational and open-ended, encouraging personal contemplation.

Passage: ${passageReference}
Text: ${passageText}

Format: Return ONLY the 3 questions, one per line, no numbering or bullets.`;

    try {
      const response = await this.sendMessage(prompt, []);
      
      if (response.error || !response.message) {
        // Return default questions if API fails
        return [
          'What stands out to you in this passage?',
          'How might this apply to your life today?',
          'What questions does this raise for you?',
        ];
      }

      const questions = response.message
        .split('\n')
        .filter(q => q.trim().length > 0)
        .slice(0, 3);

      return questions.length === 3 ? questions : [
        'What stands out to you in this passage?',
        'How might this apply to your life today?',
        'What questions does this raise for you?',
      ];
    } catch (error) {
      console.error('Error generating questions:', error);
      return [
        'What stands out to you in this passage?',
        'How might this apply to your life today?',
        'What questions does this raise for you?',
      ];
    }
  }
}

// Export singleton instance
export const openaiService = new OpenAIService();
