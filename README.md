# Chat Task - Real-Time Chat Application

A modern real-time chat application built with React Native (Expo) and NestJS, featuring WebSocket communication and JWT authentication.

## ✨ Features

This application provides a complete real-time messaging solution with secure user authentication and online presence tracking. Users can register and login with JWT-based authentication, ensuring secure access to the chat system. The platform supports instant messaging through WebSocket connections, allowing users to send and receive messages in real-time without any delays. The application tracks user presence, displaying who is currently online and updating their status automatically when they connect or disconnect. All messages are persisted in a PostgreSQL database, ensuring chat history is never lost. The mobile interface is built with React Native and Expo, providing a smooth and native-like experience on both iOS and Android devices. The backend is powered by NestJS with Socket.IO for handling real-time connections efficiently, and Sequelize ORM for database operations.

## 🛠️ Technologies

### Backend
- NestJS - Progressive Node.js framework
- Socket.IO - Real-time bidirectional communication
- PostgreSQL - Relational database
- Sequelize ORM - Database management
- JWT Authentication - Secure token-based auth
- TypeScript - Type-safe development

### Frontend (Mobile)
- React Native - Cross-platform mobile development
- Expo - React Native framework
- Socket.IO Client - WebSocket communication
- TypeScript - Type-safe development
- Expo Router - File-based navigation

## 📦 Installation

### Backend Setup
```bash
cd backend
npm install

# Create .env file with the following:
# DATABASE_URL=postgresql://user:password@localhost:5432/chatdb
# JWT_SECRET=your-secret-key

npm run start:dev
```

### Mobile App Setup
```bash
cd chat
npm install

# Update IP addresses in:
# - chat/services/api.tsx
# - chat/services/socket.tsx
# Replace with your local IP address

npx expo start
```

## 🔧 Configuration

### Backend Environment (.env)
```env
DATABASE_URL=postgresql://username:password@localhost:5432/chat_db
JWT_SECRET=your-jwt-secret-key
PORT=3000
```

### Frontend IP Settings

Update `chat/services/api.tsx` and `chat/services/socket.tsx`:
```typescript
const urls = {
  android: 'http://YOUR_LOCAL_IP:3000',
  // Example: 'http://192.168.1.159:3000'
};
```

## 📱 Usage

1. Start the backend server
2. Launch the mobile app with Expo
3. Register a new account or login
4. Start chatting in the general chat room
5. See who's online in real-time

## 🔐 Authentication Flow

1. User registers or logs in via REST API
2. Backend returns JWT access token
3. Token is stored in device AsyncStorage
4. WebSocket connection established with token
5. All socket events are authenticated with JWT
6. User status automatically updates on connect/disconnect

## 📝 Notes

- Use `10.0.2.2:3000` for Android emulator
- Use local IP address for physical devices
- Ensure PostgreSQL is running before starting backend
- Backend and mobile app must be on the same network for local development


---

⭐ If you like this project, please give it a star!
