
export interface AIResponse {
  message: string;
  isError: boolean;
}

export const generateAIResponse = async (
  prompt: string,
  apiKey: string
): Promise<AIResponse> => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful medical assistant providing advice about symptoms and health concerns. Always remind users that you are not a substitute for professional medical care and encourage seeking medical attention for serious conditions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        message: `Error: ${errorData.error?.message || 'Failed to get AI response'}`,
        isError: true
      };
    }

    const data = await response.json();
    return {
      message: data.choices[0].message.content,
      isError: false
    };
  } catch (error) {
    console.error('AI service error:', error);
    return {
      message: 'Sorry, there was an error connecting to the AI service. Please try again later.',
      isError: true
    };
  }
};
