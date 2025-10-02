// utils/blockchain.js - SIMULATED BLOCKCHAIN
const { blockchainConfig } = require('../config/blockchain');

// Generate a realistic-looking simulated transaction hash
const generateSimulatedTxHash = (prefix) => {
  return `0x${prefix}_${Date.now()}_${Math.random().toString(16).substr(2, 8)}`;
};

// 1. Simulate user registration on blockchain
const registerUserOnChain = async (userId, userType) => {
  console.log(`🔗 [SIMULATED] Registering user ${userId} as ${userType} on blockchain`);
  
  // Simulate blockchain delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return {
    userDID: `did:hopechain:${userType}:${userId}`,
    txHash: generateSimulatedTxHash('REGISTER'),
    timestamp: new Date().toISOString(),
    status: 'simulated_success',
    network: blockchainConfig.network,
  };
};

// 2. Simulate help transaction recording
const recordHelpOnChain = async (donorId, recipientId, resourceType) => {
  console.log(`🔗 [SIMULATED] Recording help: ${donorId} → ${recipientId} with ${resourceType}`);
  
  // Simulate blockchain delay
  await new Promise(resolve => setTimeout(resolve, 150));
  
  return {
    txHash: generateSimulatedTxHash('HELP'),
    donorDID: `did:hopechain:donor:${donorId}`,
    recipientDID: `did:hopechain:recipient:${recipientId}`,
    resourceType: resourceType,
    timestamp: new Date().toISOString(),
    blockNumber: Math.floor(Math.random() * 1000000) + 1000000,
    gasUsed: Math.floor(Math.random() * 50000) + 21000,
    network: blockchainConfig.network,
    status: 'simulated_success',
    message: 'Transaction would be immutable on Celo blockchain'
  };
};

// 3. Verify a transaction (simulated)
const verifyTransaction = async (txHash) => {
  console.log(`🔗 [SIMULATED] Verifying transaction: ${txHash}`);
  
  // Simulate verification delay
  await new Promise(resolve => setTimeout(resolve, 50));
  
  return {
    valid: true,
    txHash: txHash,
    confirmations: Math.floor(Math.random() * 100) + 1,
    network: blockchainConfig.network,
    status: 'simulated_verified',
    message: 'In real implementation, this would check Celo blockchain'
  };
};

// 4. Record feedback on blockchain
const recordFeedbackOnChain = async (fromUserId, toUserId, rating, resourceType) => {
  console.log(`🔗 [SIMULATED] Recording feedback: ${rating} stars from ${fromUserId} to ${toUserId}`);
  
  await new Promise(resolve => setTimeout(resolve, 120));
  
  return {
    txHash: generateSimulatedTxHash('FEEDBACK'),
    fromUserDID: `did:hopechain:user:${fromUserId}`,
    toUserDID: `did:hopechain:user:${toUserId}`,
    rating: rating,
    resourceType: resourceType,
    timestamp: new Date().toISOString(),
    network: blockchainConfig.network,
    status: 'simulated_success',
    message: 'Feedback permanently recorded (simulated)'
  };
};

// 5. Get user's blockchain reputation
const getUserReputation = async (userId) => {
  console.log(`🔗 [SIMULATED] Getting reputation for user: ${userId}`);
  
  await new Promise(resolve => setTimeout(resolve, 80));
  
  // Simulate reputation data
  return {
    userDID: `did:hopechain:user:${userId}`,
    totalTransactions: Math.floor(Math.random() * 50),
    totalHelpsGiven: Math.floor(Math.random() * 25),
    totalHelpsReceived: Math.floor(Math.random() * 20),
    averageRating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 - 5.0
    reputationScore: Math.floor(Math.random() * 100),
    verificationLevel: 'basic',
    joinedBlockchain: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    network: blockchainConfig.network,
    status: 'simulated_data'
  };
};

// Legacy methods for backward compatibility
const createUserIdentity = (userId, userType) => {
  return {
    did: `did:hopechain:${userType}:${userId}`,
    created: new Date().toISOString(),
    method: 'hopechain',
    userType,
    userId,
    network: blockchainConfig.network
  };
};

const recordHelpTransaction = (donorId, recipientId, resource, details = {}) => {
  const transactionData = {
    donorDID: `did:hopechain:donor:${donorId}`,
    recipientDID: `did:hopechain:recipient:${recipientId}`,
    resource: resource,
    timestamp: Date.now(),
    details: details,
    network: blockchainConfig.network
  };
  
  const transactionHash = generateSimulatedTxHash('LEGACY');
  
  return {
    transactionHash,
    blockNumber: Math.floor(Math.random() * 1000000) + 1000000,
    gasUsed: Math.floor(Math.random() * 50000) + 21000,
    timestamp: new Date().toISOString(),
    verified: true,
    network: blockchainConfig.network,
    ...transactionData
  };
};

// Export new simulated functions and legacy functions
module.exports = {
  // New simulated blockchain functions
  registerUserOnChain,
  recordHelpOnChain,
  verifyTransaction,
  recordFeedbackOnChain,
  getUserReputation,
  
  // Legacy functions (maintained for backward compatibility)
  createUserIdentity,
  recordHelpTransaction,
  
  // Utility functions
  generateSimulatedTxHash,
  
  // Configuration
  isSimulated: true,
  config: blockchainConfig
};