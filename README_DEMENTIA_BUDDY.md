# Dementia Buddy - Mobile App

A comprehensive React Native mobile application built with Expo and Firebase to help dementia patients manage their medication reminders with support from caretakers and administrators.

## Features

### 🔐 Authentication & User Roles

- **Patient**: Can create reminders, mark them as taken/missed
- **Caretaker**: Can view linked patients' reminders and track status
- **Admin**: Fixed credentials (dementiabuddy@gmail.com / kakushin.123) with full system access

### 📱 Patient Features

- Create medication reminders with title, description, and time
- View all personal reminders with status tracking
- Mark reminders as "Taken" or "Missed"
- Real-time progress statistics
- Push notifications for reminder times

### 👥 Caretaker Features

- View all linked patients' reminders
- Track medication compliance status
- Receive notifications when patients have reminders
- Monitor overall patient progress

### 🛠️ Admin Features

- View all users, patients, and caretakers
- Monitor all reminders and their status
- Link caretakers to patients
- Access comprehensive system statistics
- Manage user accounts

### 🔔 Notifications

- Push notifications using Expo Notifications
- Automatic scheduling for reminder times
- Notifications sent to both patients and linked caretakers

## Tech Stack

- **Frontend**: React Native with Expo (managed workflow)
- **Backend**: Firebase (Authentication, Firestore, Cloud Messaging)
- **Navigation**: React Navigation v6
- **Notifications**: Expo Notifications
- **State Management**: React Context API

## Project Structure

```
dementia-buddy/
├── app/                    # Expo Router app directory
├── components/             # Reusable UI components
│   ├── LoadingScreen.js
│   ├── ReminderCard.js
│   └── StatCard.js
├── contexts/              # React Context providers
│   └── AuthContext.js
├── navigation/            # Navigation configuration
│   └── AppNavigator.js
├── screens/              # Screen components
│   ├── auth/            # Authentication screens
│   ├── patient/         # Patient-specific screens
│   ├── caretaker/       # Caretaker-specific screens
│   └── admin/           # Admin-specific screens
├── services/            # Firebase and API services
│   ├── authService.js
│   ├── firebaseConfig.js
│   ├── notificationService.js
│   ├── reminderService.js
│   └── userService.js
└── .env                 # Environment variables
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- Expo CLI
- Firebase project with Authentication and Firestore enabled

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd dementia-buddy
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Firebase**

   - Create a Firebase project
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Update `.env` file with your Firebase config:

   ```
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

### Firebase Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Reminders - patients can manage their own, caretakers can read linked patients'
    match /reminders/{reminderId} {
      allow read, write: if request.auth != null &&
        (resource.data.patientId == request.auth.uid ||
         exists(/databases/$(database)/documents/caretaker_patients/$(request.auth.uid + '_' + resource.data.patientId)));
    }

    // Caretaker-patient links
    match /caretaker_patients/{linkId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Usage

### For Patients

1. Sign up with email and select "Patient" role
2. Create medication reminders with specific times
3. Receive push notifications at reminder times
4. Mark reminders as taken or missed
5. View progress statistics

### For Caretakers

1. Sign up with email and select "Caretaker" role
2. Contact admin to link patients to your account
3. View all linked patients' reminders
4. Monitor medication compliance
5. Receive notifications for patient reminders

### For Administrators

1. Use fixed credentials: `dementiabuddy@gmail.com` / `kakushin.123`
2. View all users and system statistics
3. Link caretakers to patients
4. Monitor overall system usage and compliance

## Key Features Implementation

### Real-time Data

- Uses Firebase Firestore real-time listeners
- Automatic UI updates when data changes
- Optimistic updates for better UX

### Push Notifications

- Expo Notifications for cross-platform support
- Automatic scheduling based on reminder times
- Background notification handling

### Role-based Access Control

- Context-based authentication state management
- Automatic navigation based on user role
- Secure data access patterns

### Offline Support

- Firebase Firestore offline persistence
- Graceful handling of network issues
- Local data caching

## Development

### Running Tests

```bash
npm test
```

### Building for Production

```bash
# For Android
npx expo build:android

# For iOS
npx expo build:ios
```

### Code Style

- ESLint configuration included
- Prettier formatting
- Consistent naming conventions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Note**: This application is designed for healthcare use and should be thoroughly tested before deployment in a production environment. Ensure compliance with healthcare data regulations (HIPAA, GDPR, etc.) as applicable.
