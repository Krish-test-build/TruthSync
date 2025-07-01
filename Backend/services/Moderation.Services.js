const axios = require('axios');
const PERSPECTIVE_API_KEY = process.env.PERSPECTIVE_API_KEY;

module.exports.checkToxicity = async (text) => {
  try {
    const response = await axios.post(
      `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${PERSPECTIVE_API_KEY}`,
      {
        comment: { text },
        languages: ['en'],
        requestedAttributes: {
          TOXICITY: {},
          SEVERE_TOXICITY: {},
          INSULT: {},
          THREAT: {}
        }
      }
    );

    const scores = response.data.attributeScores;
    return {
      isFlagged: Object.values(scores).some(attr => attr.summaryScore.value >= 0.825),
      rawScores: scores
    };
  } catch (error) {
    console.error("Perspective API error:", error.message);
    return { isFlagged: false };
  }
};

