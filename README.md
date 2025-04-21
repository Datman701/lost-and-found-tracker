# Lost and Found Tracker

A modern web application for tracking lost and found items, built with React, Firebase, and Tailwind CSS.

![Lost and Found Tracker](https://via.placeholder.com/800x400?text=Lost+and+Found+Tracker)

## Live Demo

Visit the live application at: [https://guileless-mooncake-22c3b8.netlify.app/](https://guileless-mooncake-22c3b8.netlify.app/)

## Features

- **User Authentication**: Secure login and registration system
- **Item Management**: Post, view, and manage lost or found items
- **Image Upload**: Upload images of items using ImgBB
- **Search & Filter**: Find items by category, location, or keywords
- **Claim System**: Report found items and manage claims
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Mode**: Toggle between light and dark themes

## Tech Stack

- **Frontend**: React, React Router, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore)
- **Image Storage**: ImgBB API
- **Build Tool**: Vite
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- ImgBB API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/lost-and-found-tracker.git
   cd lost-and-found-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_IMGBB_API_KEY=your_imgbb_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
lost-and-found-tracker/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── auth/           # Authentication components
│   │   ├── items/          # Item-related components
│   │   ├── layout/         # Layout components
│   │   └── profile/        # Profile-related components
│   ├── context/            # React context providers
│   ├── pages/              # Page components
│   ├── utils/              # Utility functions
│   ├── App.jsx             # Main application component
│   └── main.jsx            # Application entry point
├── .env                    # Environment variables
├── index.html              # HTML template
├── netlify.toml            # Netlify configuration
├── package.json            # Project dependencies
└── vite.config.js          # Vite configuration
```

## Firebase Setup

1. Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password provider
3. Create a Firestore database with the following collections:
   - `items`: Stores lost and found items
   - `found_reports`: Stores reports of found items
4. Copy your Firebase configuration to the `.env` file

## ImgBB Setup

1. Create an account at [https://api.imgbb.com/](https://api.imgbb.com/)
2. Get your API key from the dashboard
3. Add the API key to your `.env` file

## Deployment

This project is configured for deployment on Netlify:

1. Push your code to GitHub
2. Connect your GitHub repository to Netlify
3. Set the build command to `npm run build`
4. Set the publish directory to `dist`
5. Add the environment variables in the Netlify dashboard
6. Deploy!

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Firebase](https://firebase.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [ImgBB](https://api.imgbb.com/)
- [Netlify](https://www.netlify.com/)
