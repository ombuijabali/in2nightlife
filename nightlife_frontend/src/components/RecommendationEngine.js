import _ from 'lodash'; // Import lodash for utility functions

const RecommendationEngine = (
  userPreferences,
  pastVisitedLocations,
  congestionData,
  clubs
) => {
  // Filter clubs based on user preferences
  const filteredClubs = clubs.filter((club) => {
    const { drinks, music } = club;
    return (
      drinks.toLowerCase().includes(userPreferences.drink.toLowerCase()) &&
      music.toLowerCase().includes(userPreferences.music.toLowerCase())
    );
  });

  // Assign scores to clubs based on congestion and past visits
  const scoredClubs = filteredClubs.map((club) => {
    const congestionScore = congestionData[club.id] ? congestionData[club.id] : 0;
    const visitScore = pastVisitedLocations.includes(club.id) ? 0.5 : 1;
    return {
      ...club,
      score: congestionScore * visitScore,
    };
  });

  // Sort clubs based on scores (descending order)
  const sortedClubs = _.orderBy(scoredClubs, ['score'], ['desc']);

  return sortedClubs;
};

export default RecommendationEngine;