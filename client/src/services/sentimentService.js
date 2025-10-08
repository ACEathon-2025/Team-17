import Sentiment from 'sentiment';

const sentiment = new Sentiment();

export const sentimentService = {
  /**
   * Analyze sentiment of text
   * @param {string} text - Text to analyze
   * @returns {Object} Sentiment analysis result
   */
  analyzeSentiment(text) {
    if (!text || text.trim().length === 0) {
      return {
        score: 0,
        comparative: 0,
        sentiment: 'neutral',
        emoji: '😐',
        color: 'gray',
        label: 'Neutral',
        details: 'No text to analyze'
      };
    }

    try {
      const result = sentiment.analyze(text);
      
      // Calculate sentiment category based on score
      let sentimentType = 'neutral';
      let emoji = '😐';
      let color = 'gray';
      let label = 'Neutral';
      
      if (result.score > 5) {
        sentimentType = 'very-positive';
        emoji = '😄';
        color = 'green';
        label = 'Very Positive';
      } else if (result.score > 2) {
        sentimentType = 'positive';
        emoji = '🙂';
        color = 'lightgreen';
        label = 'Positive';
      } else if (result.score < -5) {
        sentimentType = 'very-negative';
        emoji = '😢';
        color = 'red';
        label = 'Very Negative';
      } else if (result.score < -2) {
        sentimentType = 'negative';
        emoji = '😕';
        color = 'orange';
        label = 'Negative';
      }

      return {
        score: result.score,
        comparative: result.comparative,
        sentiment: sentimentType,
        emoji: emoji,
        color: color,
        label: label,
        positive: result.positive,
        negative: result.negative,
        tokens: result.tokens,
        words: result.words,
        details: this.generateDetails(result)
      };
    } catch (error) {
      console.error('Sentiment analysis error:', error);
      return {
        score: 0,
        comparative: 0,
        sentiment: 'neutral',
        emoji: '😐',
        color: 'gray',
        label: 'Error',
        details: 'Failed to analyze sentiment'
      };
    }
  },

  /**
   * Generate human-readable details
   */
  generateDetails(result) {
    const positiveCount = result.positive.length;
    const negativeCount = result.negative.length;
    
    let details = [];
    
    if (positiveCount > 0) {
      details.push(`${positiveCount} positive word${positiveCount > 1 ? 's' : ''}`);
    }
    
    if (negativeCount > 0) {
      details.push(`${negativeCount} negative word${negativeCount > 1 ? 's' : ''}`);
    }
    
    if (positiveCount === 0 && negativeCount === 0) {
      details.push('Neutral tone');
    }
    
    return details.join(' • ');
  },

  /**
   * Analyze sentiment of multiple sentences
   */
  analyzeBySentence(text) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    
    return sentences.map(sentence => ({
      text: sentence.trim(),
      ...this.analyzeSentiment(sentence)
    }));
  },

  /**
   * Get overall sentiment summary
   */
  getSummary(text) {
    const analysis = this.analyzeSentiment(text);
    const wordCount = text.split(/\s+/).length;
    
    return {
      ...analysis,
      wordCount,
      averagePerWord: (analysis.score / wordCount).toFixed(2),
      recommendation: this.getRecommendation(analysis)
    };
  },

  /**
   * Get reading recommendations based on sentiment
   */
  getRecommendation(analysis) {
    if (analysis.sentiment === 'very-negative') {
      return 'This text contains strong negative emotions. Take breaks if needed.';
    } else if (analysis.sentiment === 'negative') {
      return 'This text has a somewhat negative tone. Be mindful of your emotional state.';
    } else if (analysis.sentiment === 'very-positive') {
      return 'This text has a very uplifting and positive tone!';
    } else if (analysis.sentiment === 'positive') {
      return 'This text has a pleasant and positive tone.';
    } else {
      return 'This text has a balanced, neutral tone.';
    }
  }
};
