export type Sentiment = 'positive' | 'negative' | 'neutral';

export interface CommentData {
  id: string;
  text: string;
  sentiment: Sentiment;
  date: string;
  source: string;
}
