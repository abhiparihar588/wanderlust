# Wanderlust 🌍

Wanderlust is a modern, full-stack MERN (MongoDB, Express, React, Node.js) application that serves as a property rental platform similar to Airbnb. It allows users to explore beautiful destinations, view property details, read/write reviews, and seamlessly create their own property listings.

## 🚀 Features

- **User Authentication & Authorization**: Secure login and registration using JWT (JSON Web Tokens) and secure password hashing with bcrypt. Role-based access control to ensure users can only edit or delete their own listings and reviews.
- **Property Listings (CRUD)**: Users can browse properties, create new listings, update existing ones, and delete properties they own.
- **Image Uploads**: Secure and optimized image storage integrated with **Cloudinary** and managed via `multer`.
- **Review System**: Authenticated users can leave ratings and reviews on properties.
- **Modern UI**: A responsive, dynamic, and glassmorphic frontend built with **React** and powered by Vite for blazing-fast performance.
- **Robust API & MVC Architecture**: The backend utilizes a strictly typed Model-View-Controller architecture with RESTful API endpoints.
- **Data Validation & Security**: Server-side data validation using **Joi**, combined with security headers and rate-limiting using `helmet` and `express-rate-limit`.

## 🛠️ Tech Stack

### Frontend
- **React.js** (via Vite)
- **React Router DOM** (Client-side routing)
- **Lucide React** (Beautiful icons)
- **Vanilla CSS / Custom Components** (Dynamic, modern glassmorphic designs)

### Backend
- **Node.js & Express.js**
- **MongoDB & Mongoose** (Database and ODM)
- **Passport.js & JWT** (Authentication)
- **Cloudinary & Multer** (Image processing & storage)
- **Joi** (Data validation)
- **Helmet, Compression, Morgan** (Security & Performance)

## 📂 Project Structure

The project is structured into two main directories:
- `frontend/`: Contains the React application (built with Vite).
- `backend/`: Contains the Express server, MongoDB models, controllers, and routes in an MVC pattern.

## 💻 Running Locally

### Prerequisites
- Node.js installed
- MongoDB installed and running (or a MongoDB Atlas connection string)
- Cloudinary Account (for image uploads)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/wanderlust.git
cd wanderlust
```

### 2. Setup the Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory by copying `.env.example`:
```env
PORT=8080
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```
Start the backend development server:
```bash
npm run dev
```

### 3. Setup the Frontend
```bash
cd ../frontend
npm install
```
Start the Vite development server:
```bash
npm run dev
```

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License
This project is licensed under the ISC License.
