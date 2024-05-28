Here's a `README.md` file for our project. This file provides an overview of the project, instructions for setting it up, and how to run tests.

# Fire Detection Dashboard

## Overview

The Fire Detection Dashboard is a web application designed to monitor and alert users about potential fire hazards. The application includes features such as real-time gauge updates, notifications, threshold value management, and feedback management.

## Features

- Real-time gauge display for fire detection.
- Notifications for potential fire hazards.
- Admin dashboard to update threshold values.
- User feedback collection and management.
- Admin authentication for secure access.
- RESTful API for managing threshold values and feedback.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- WebSocket
- HTML, CSS, JavaScript
- Bootstrap
- Mocha and Chai for testing

## Installation

### Prerequisites

- Node.js (version 14 or higher)
- MongoDB

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/fire-detection-dashboard.git
   cd fire-detection-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up MongoDB**
   Ensure you have MongoDB installed and running. Update the connection string in `config/db.js` with your MongoDB URI.

4. **Start the application**
   ```bash
   npm start
   ```

   The application will be running at `http://localhost:3000`.

## API Endpoints

### Authentication

- **Register Admin**
  - `POST /api/auth/register`
  - Body: `{ "username": "admin", "password": "password123" }`

- **Login**
  - `POST /api/auth/login`
  - Body: `{ "username": "admin", "password": "password123" }`

### Threshold Management

- **Set Threshold**
  - `POST /api/threshold`
  - Body: `{ "thresholdValue": 70 }`

- **Update Threshold**
  - `PUT /api/threshold`
  - Body: `{ "thresholdValue": 75 }`

- **Get Threshold**
  - `GET /api/threshold`

### Feedback Management

- **Submit Feedback**
  - `POST /feedback`
  - Body: `{ "name": "John", "feedback": "Great service!", "rating": 5 }`

- **Delete Feedback**
  - `DELETE /api/feedback/:name`
  - URL Parameter: `name` (e.g., `/api/feedback/John`)

## Running Tests

To run the tests, use the following command:
```bash
npm test
```

This will execute the test cases using Mocha and Chai.

## File Structure

- `app.js` - Main application file.
- `config/db.js` - Database connection configuration.
- `controllers/controller.js` - Contains the logic for handling various routes.
- `models/user.js` - User model for MongoDB operations.
- `models/feedback.js` - Feedback model for MongoDB operations.
- `routes/index.js` - Defines the application routes.
- `public/` - Contains static files (HTML, CSS, JS).
- `views/` - Contains HTML views.
- `test/` - Contains test cases for Mocha and Chai.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

```
This `README.md` file provides a comprehensive overview of the project, how to set it up, run it, and test it. Adjust the content as needed to fit your project's specifics.
