# Donor Engagement System - Frontend

## Overview

The Donor Engagement System frontend is built using React and Material-UI, providing a user-friendly interface for managing donor engagement, events, and fundraising activities. This application interacts with the backend API to fetch and display data, allowing users to collaborate effectively.

## Project Structure

The frontend application is organized into several key components:

- **public**: Static files for the application, such as the `index.html` file and the static assets.
- **Components**: Reusable UI components that make up the application, such as `Header`, `Sidebar`, `DashboardEvents`, and `DonorSelectionTable`.
- **Pages**: Each page represents a different view in the application, such as `DashboardPage`, `DonorSelectionPage`, and `EventDetail`.
- **Theme**: Contains the theme configuration for Material-UI, allowing for consistent styling across the application.
- **Hooks**: Custom hooks for managing state and side effects in the application.
- **Services**: API services for interacting with the backend API.
- **Types**: TypeScript types for the application.
- **App.js**: The main entry point for the application, setting up routing and other global configurations.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/William-g7/BC-Cancer-Event-Management-System.git
   cd donor-engagement-system/my-react-app
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root of the frontend directory and add your API configuration:
   ```plaintext
   REACT_APP_API_URL=http://localhost:5001/api (or the URL of your backend server)
   ```

### Running the Application

1. **Start the Development Server**:
   You can run the application in development mode using:
   ```bash
   npm start
   ```

2. **Access the Application**:
   Open your web browser and navigate to `http://localhost:3000` to view the application.

### Key Features

- **Dashboard**: View all events and their details, including donor selections and fundraising progress.
- **Event Management**: Create and manage events, including assigning fundraisers and tracking progress.
- **Donor Selection**: Select donors for events, view their details, notes and manage selections for events.

### API Endpoints

The frontend interacts with the following backend API endpoints:

- **GET /dashboard**: Get all upcoming events for the dashboard.
- **GET /api/events**: Fetch all events.
- **POST /api/events**: Create a new event.
- **GET /api/events/:id**: Get a specific event by ID.
- **GET /api/events/:id/selections**: Get all donors associated with a specific event.

