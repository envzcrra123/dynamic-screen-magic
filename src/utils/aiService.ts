
export interface AIResponse {
  message: string;
  isError: boolean;
}

export const generateAIResponse = async (
  prompt: string,
  apiKey: string
): Promise<AIResponse> => {
  try {
    const response = await fetch('https://dialogflow.googleapis.com/v2/projects/medical-assistant/agent/sessions/123456:detectIntent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        queryInput: {
          text: {
            text: prompt,
            languageCode: 'en-US'
          }
        },
        queryParams: {
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
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
      message: data.queryResult?.fulfillmentText || 'Sorry, I couldn\'t understand that. Could you rephrase your question?',
      isError: false
    };
  } catch (error) {
    console.error('AI service error:', error);
    return {
      message: 'Sorry, there was an error connecting to the AI service. Please check your API key and try again later.',
      isError: true
    };
  }
};
