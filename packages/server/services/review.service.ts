import { llmClient } from '../llm/client';
import { reviewRepository } from '../repositories/reviews.repository';
import template from '../prompts/summarize-reviews.txt';

export const reviewService = {
  async summarizeReviews(productId: number): Promise<string> {
    //Check if a summary has already been generated for the product and that is not expired
    const existingSummary = await reviewRepository.getReviewSummary(productId);
    if (existingSummary) {
      return existingSummary;
    }
    //Get the last 10 reviews for summarization
    const reviews = await reviewRepository.getReviews(productId, 10);
    const joinedReviews = reviews.map((r) => r.content).join('/n/n');
    // Send it to a LLM to generate a summary
    const prompt = template.replace('{{reviews}}', joinedReviews);

    const { text: summary } = await llmClient.generateText({
      model: 'gpt-4.1',
      prompt,
      temperature: 0.2,
      maxTokens: 500,
    });

    await reviewRepository.storeReviewSummary(productId, summary);
    return summary;
  },
};
