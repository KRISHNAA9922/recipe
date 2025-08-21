🍳 Recipe Book App
A modern, full-stack recipe management application built with React Native (Expo) and GraphQL. It offers an intuitive mobile experience to create, discover, and organize your favorite recipes.

🚀 Tech Stack
Frontend: React Native (Expo), Apollo Client, React Navigation, Tamagui, TypeScript

Backend: Node.js, Apollo Server, JWT for authentication

Database: MongoDB with Mongoose

📱 Core Features
Recipe Management: Create, browse, search, and edit recipes with ingredients, steps, and images.

User Accounts: Secure user registration and login.

Personalization: Save favorite recipes and add private notes.

Organization: Filter recipes by categories like Breakfast, Lunch, Dinner, and Dessert.

🛠️ Installation & Setup
Prerequisites
Node.js (v16+)

MongoDB (local or Atlas)

Expo CLI

1. Backend Setup
bash
# Go to the backend directory
cd backend/graphql-server

# Install dependencies
npm install

# Create a .env file and add your MONGODB_URI and JWT_SECRET
# PORT=4000
# MONGODB_URI=mongodb://localhost:27017/recipe-app
# JWT_SECRET=your-super-secret-key

# Start the GraphQL server
npm run dev
The server will start at http://localhost:4000/graphql.

2. Frontend Setup
bash
# Install root dependencies from the main project folder
npm install

2. backend Setup
bash
# cd backend/graphQl
# Install root dependencies from the main project folder
npm install
npm start

# Create a .env file in the root and configure the API endpoint
# EXPO_PUBLIC_GRAPHQL_URI=http://localhost:4000/graphql

# Start the development server
npm i
npm start
You can then run the app on an Android or iOS simulator/device.
