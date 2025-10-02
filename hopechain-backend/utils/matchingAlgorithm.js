// Simple matching algorithm for HopeChain
// Matches offers with needs based on resource similarity, location, and urgency

/**
 * Calculate text similarity between two strings using simple word matching
 * @param {string} text1 - First text to compare
 * @param {string} text2 - Second text to compare
 * @returns {number} Similarity score between 0 and 1
 */
const calculateTextSimilarity = (text1, text2) => {
  if (!text1 || !text2) return 0;
  
  // Convert to lowercase and split into words
  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);
  
  // Find common words
  const commonWords = words1.filter(word => 
    words2.includes(word) && word.length > 2 // Ignore very short words
  );
  
  // Calculate similarity as ratio of common words to total unique words
  const totalUniqueWords = new Set([...words1, ...words2]).size;
  const similarity = totalUniqueWords > 0 ? commonWords.length / totalUniqueWords : 0;
  
  return Math.min(1, similarity * 2); // Boost similarity slightly
};

/**
 * Calculate distance between two coordinates in kilometers
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

/**
 * Calculate match score between an offer and a need
 * @param {Object} offer - Offer object
 * @param {Object} need - Need object
 * @returns {Object} Match details with score
 */
const calculateMatchScore = (offer, need) => {
  if (!offer || !need) {
    throw new Error('Both offer and need are required');
  }
  
  const matchDetails = {
    offerId: offer._id,
    needId: need._id,
    resource: offer.resource,
    matchingFactors: {},
    totalScore: 0
  };
  
  // 1. Resource Matching (40 points max)
  const resourceSimilarity = calculateTextSimilarity(
    `${offer.resource} ${offer.description}`,
    `${need.resource} ${need.description}`
  );
  matchDetails.matchingFactors.resourceMatch = Math.round(resourceSimilarity * 40);
  
  // 2. Location Score (30 points max)
  const distance = calculateDistance(
    offer.location.coordinates.latitude,
    offer.location.coordinates.longitude,
    need.location.coordinates.latitude,
    need.location.coordinates.longitude
  );
  
  matchDetails.matchingFactors.locationDistance = Math.round(distance * 100) / 100;
  
  // Closer = higher score (within 100km)
  let locationScore = 0;
  if (distance <= 5) locationScore = 30;
  else if (distance <= 15) locationScore = 25;
  else if (distance <= 30) locationScore = 20;
  else if (distance <= 50) locationScore = 15;
  else if (distance <= 100) locationScore = 10;
  else locationScore = 5;
  
  matchDetails.matchingFactors.locationScore = locationScore;
  
  // 3. Urgency Score (20 points max)
  const urgencyScores = { low: 5, medium: 10, high: 15, critical: 20 };
  const urgencyScore = urgencyScores[need.urgency.level] || 5;
  matchDetails.matchingFactors.urgencyScore = urgencyScore;
  
  // 4. Time Score (10 points max)
  const now = new Date();
  const offerAge = (now - new Date(offer.createdAt)) / (1000 * 60 * 60 * 24); // Days
  const needAge = (now - new Date(need.createdAt)) / (1000 * 60 * 60 * 24); // Days
  
  // Newer offers and older needs get higher scores
  let timeScore = 10;
  if (offerAge > 7) timeScore -= 3;
  if (needAge > 3) timeScore += 2;
  if (need.urgency.deadline) {
    const hoursUntilDeadline = (new Date(need.urgency.deadline) - now) / (1000 * 60 * 60);
    if (hoursUntilDeadline <= 24) timeScore += 3;
  }
  
  matchDetails.matchingFactors.timeScore = Math.max(0, Math.min(10, timeScore));
  
  // Calculate total score
  matchDetails.totalScore = 
    matchDetails.matchingFactors.resourceMatch +
    matchDetails.matchingFactors.locationScore +
    matchDetails.matchingFactors.urgencyScore +
    matchDetails.matchingFactors.timeScore;
  
  return matchDetails;
};

/**
 * Find potential matches for a given need
 * @param {Object} need - Need object to find matches for
 * @param {Array} offers - Array of available offers
 * @param {Object} options - Matching options
 * @returns {Array} Array of matches sorted by score
 */
const findMatchesForNeed = (need, offers, options = {}) => {
  const {
    maxDistance = 100, // km
    minScore = 20,
    maxResults = 10
  } = options;
  
  if (!need || !offers || !Array.isArray(offers)) {
    return [];
  }
  
  const matches = [];
  
  for (const offer of offers) {
    // Skip if offer is not available
    if (offer.status !== 'available') continue;
    
    // Skip if offer is expired
    if (offer.availability && new Date(offer.availability.endDate) < new Date()) continue;
    
    try {
      const matchDetails = calculateMatchScore(offer, need);
      
      // Skip if distance is too far
      if (matchDetails.matchingFactors.locationDistance > maxDistance) continue;
      
      // Skip if score is too low
      if (matchDetails.totalScore < minScore) continue;
      
      matches.push({
        ...matchDetails,
        offer: offer,
        need: need,
        confidence: matchDetails.totalScore >= 70 ? 'high' : 
                   matchDetails.totalScore >= 50 ? 'medium' : 'low'
      });
    } catch (error) {
      console.error('Error calculating match score:', error);
      continue;
    }
  }
  
  // Sort by score (highest first) and return top results
  return matches
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, maxResults);
};

/**
 * Find potential matches for a given offer
 * @param {Object} offer - Offer object to find matches for
 * @param {Array} needs - Array of open needs
 * @param {Object} options - Matching options
 * @returns {Array} Array of matches sorted by score
 */
const findMatchesForOffer = (offer, needs, options = {}) => {
  const {
    maxDistance = 100, // km
    minScore = 20,
    maxResults = 10
  } = options;
  
  if (!offer || !needs || !Array.isArray(needs)) {
    return [];
  }
  
  const matches = [];
  
  for (const need of needs) {
    // Skip if need is not open
    if (need.status !== 'open') continue;
    
    // Skip if need is expired
    if (need.urgency.deadline && new Date(need.urgency.deadline) < new Date()) continue;
    
    try {
      const matchDetails = calculateMatchScore(offer, need);
      
      // Skip if distance is too far
      if (matchDetails.matchingFactors.locationDistance > maxDistance) continue;
      
      // Skip if score is too low
      if (matchDetails.totalScore < minScore) continue;
      
      matches.push({
        ...matchDetails,
        offer: offer,
        need: need,
        confidence: matchDetails.totalScore >= 70 ? 'high' : 
                   matchDetails.totalScore >= 50 ? 'medium' : 'low'
      });
    } catch (error) {
      console.error('Error calculating match score:', error);
      continue;
    }
  }
  
  // Sort by score (highest first) and return top results
  return matches
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, maxResults);
};

/**
 * Auto-match all open needs with available offers
 * @param {Array} needs - Array of open needs
 * @param {Array} offers - Array of available offers
 * @param {Object} options - Matching options
 * @returns {Array} Array of potential matches
 */
const autoMatchAll = (needs, offers, options = {}) => {
  const {
    maxDistance = 100,
    minScore = 30, // Higher threshold for auto-matching
    maxMatchesPerNeed = 3
  } = options;
  
  const allMatches = [];
  
  // Process high urgency needs first
  const sortedNeeds = needs
    .filter(need => need.status === 'open')
    .sort((a, b) => {
      const urgencyOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return urgencyOrder[b.urgency.level] - urgencyOrder[a.urgency.level];
    });
  
  for (const need of sortedNeeds) {
    const matches = findMatchesForNeed(need, offers, {
      maxDistance,
      minScore,
      maxResults: maxMatchesPerNeed
    });
    
    allMatches.push(...matches);
  }
  
  // Remove duplicates and sort by score
  const uniqueMatches = [];
  const seen = new Set();
  
  for (const match of allMatches) {
    const key = `${match.offerId}-${match.needId}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueMatches.push(match);
    }
  }
  
  return uniqueMatches.sort((a, b) => b.totalScore - a.totalScore);
};

/**
 * Get match recommendations for a specific resource type
 * @param {string} resourceType - The type of resource to find matches for
 * @param {Array} offers - Available offers
 * @param {Array} needs - Open needs
 * @param {Object} location - Optional location for proximity filtering
 * @returns {Object} Recommendations object
 */
const getResourceRecommendations = (resourceType, offers, needs, location = null) => {
  if (!resourceType) {
    throw new Error('Resource type is required');
  }
  
  // Filter offers and needs by resource type
  const relevantOffers = offers.filter(offer => 
    offer.status === 'available' &&
    (offer.resource.toLowerCase().includes(resourceType.toLowerCase()) ||
     offer.description.toLowerCase().includes(resourceType.toLowerCase()))
  );
  
  const relevantNeeds = needs.filter(need => 
    need.status === 'open' &&
    (need.resource.toLowerCase().includes(resourceType.toLowerCase()) ||
     need.description.toLowerCase().includes(resourceType.toLowerCase()))
  );
  
  // Find matches
  const matches = autoMatchAll(relevantNeeds, relevantOffers, {
    maxDistance: location ? 50 : 100,
    minScore: 25
  });
  
  return {
    resourceType,
    totalOffers: relevantOffers.length,
    totalNeeds: relevantNeeds.length,
    totalMatches: matches.length,
    highConfidenceMatches: matches.filter(m => m.confidence === 'high').length,
    urgentNeeds: relevantNeeds.filter(n => ['high', 'critical'].includes(n.urgency.level)).length,
    matches: matches.slice(0, 20), // Return top 20 matches
    location
  };
};

module.exports = {
  calculateTextSimilarity,
  calculateDistance,
  calculateMatchScore,
  findMatchesForNeed,
  findMatchesForOffer,
  autoMatchAll,
  getResourceRecommendations
};