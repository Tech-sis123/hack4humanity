# 🤝 HopeChain Backend

> Blockchain-based Humanitarian Aid Platform Backend

This is the backend API for the HopeChain application - a decentralized platform that connects donors with recipients through blockchain transparency.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Atlas account (free tier available)
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd hopechain-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up MongoDB Atlas:**
   - Follow the detailed guide in `MONGODB_ATLAS_SETUP.md`
   - Get your connection string from MongoDB Atlas

4. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your MongoDB Atlas connection string:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hopechain-db?retryWrites=true&w=majority
   ```

5. **Start the server:**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

6. **Verify connection:**
   - Server should show: `🍃 MongoDB Atlas Connected`
   - API available at: `http://localhost:5000`
   - Health check: `http://localhost:5000/api/health`

## 🏗️ Architecture

### Core Features
- **User Management:** Donor and Recipient roles with blockchain identity
- **Direct Connections:** Simple donor ↔ recipient matching
- **Blockchain Integration:** Simulated blockchain with real Celo readiness
- **Resource Matching:** Free-text resource system (blood, money, food, etc.)
- **Trust System:** Simple help tracking and reputation

### Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas
- **Authentication:** JWT with bcrypt
- **Blockchain:** Simulated (Celo-ready)

## 📡 API Endpoints

### Authentication
```
POST /api/auth/register   - Register new user
POST /api/auth/login      - Login user
GET  /api/auth/me         - Get current user (Protected)
PUT  /api/auth/updatepassword - Update password (Protected)
```

### User Management
```
GET  /api/users/profile        - Get user profile (Protected)
PUT  /api/users/profile        - Update profile (Protected)
GET  /api/users/list/donors     - List all donors (Protected)
GET  /api/users/list/recipients - List all recipients (Protected)
GET  /api/users/:id            - Get user by ID (Protected)
```

### Connections
```
GET  /api/connections          - Get user connections (Protected)
POST /api/connections          - Create new connection (Protected)
GET  /api/connections/:id      - Get connection details (Protected)
PUT  /api/connections/:id/confirm  - Confirm connection (Protected)
PUT  /api/connections/:id/complete - Complete help (Protected)
PUT  /api/connections/:id/cancel   - Cancel connection (Protected)
```

### System
```
GET /api/health  - Health check
GET /           - Welcome message
```

## 🧪 Testing the API

### Register a Donor
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "type": "donor",
    "bloodType": "O+",
    "location": "123 Main St, New York, NY 10001"
  }'
```

### Register a Recipient
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "password123",
    "role": "recipient",
    "location": {
      "address": "456 Oak Ave",
      "city": "Boston",
      "state": "MA",
      "zipCode": "02101"
    }
  }'
```

## 🔗 Blockchain Integration

**Current State:** Simulated blockchain with real transaction hashes and DIDs

**Features:**
- User DID creation: `did:hopechain:donor:userId`
- Help transaction recording with simulated hashes
- Ready for Celo blockchain integration

**Sample Response:**
```json
{
  "user": {
    "blockchain": {
      "userDID": "did:hopechain:donor:60f7b1b9e4b0c1d2e3f4g5h6",
      "totalHelpTransactions": 0
    }
  },
  "blockchain": {
    "txHash": "0xREGISTER_1640995200000_a1b2c3d4",
    "status": "simulated_success"
  }
}
```

## 🛠️ Development

### Scripts
```bash
npm start      # Start production server
npm run dev    # Start with nodemon (auto-restart)
npm test       # Run tests (when available)
```

### Environment Variables
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
CELO_NETWORK=alfajores
```

## 📂 Project Structure
```
hopechain-backend/
├── config/
│   ├── database.js          # MongoDB Atlas connection
│   └── blockchain.js        # Blockchain configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── donorController.js   # User management
│   └── connectionController.js # Connection management
├── middleware/
│   └── auth.js             # JWT authentication
├── models/
│   ├── User.js             # Single user model (donors & recipients)
│   └── Connection.js       # Connection model
├── routes/
│   ├── auth.js             # Auth routes
│   ├── donors.js           # User routes
│   └── connections.js      # Connection routes
├── utils/
│   ├── blockchain.js       # Blockchain utilities
│   └── matchingAlgorithm.js # Matching logic
├── .env                    # Environment variables
├── server.js              # Main server file
└── package.json           # Dependencies
```

## 🚀 Deployment

### Heroku Deployment
1. Create Heroku app
2. Set environment variables in Heroku dashboard
3. Deploy from Git

### Railway/Render Deployment
1. Connect GitHub repository
2. Set environment variables
3. Auto-deploy on push

## 🔒 Security Features

- **JWT Authentication:** Secure token-based auth
- **Password Hashing:** bcrypt with salt rounds
- **Input Validation:** Mongoose schema validation
- **CORS Protection:** Configured for frontend domain
- **Security Headers:** XSS, CSRF protection
- **Environment Variables:** Sensitive data protection

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- **MongoDB Atlas Setup:** See `MONGODB_ATLAS_SETUP.md`
- **API Documentation:** Available at `/api/health`
- **Issues:** Create GitHub issue for bugs/features

---

**Built for Hack4Humanity 2024** 🌍

*Solving the trust problem in humanitarian aid through blockchain transparency.*