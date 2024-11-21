# Donor Engagement System - Backend

## Overview

The Donor Engagement System is a backend application designed to manage donor data, events, and fundraising activities. It provides APIs for fetching, inserting, and managing donor information, as well as handling event-related functionalities.

## Architecture

The backend is built using TypeScript and Node.js, utilizing the Express framework for handling HTTP requests. The application interacts with a MySQL database to store and manage data. The architecture follows a modular design pattern, separating concerns into different layers:

- **Controllers**: Handle incoming requests and responses. They interact with services to perform business logic.
- **Services**: Contain the core business logic and interact with repositories to perform data operations.
- **Repositories**: Abstract the database interactions, providing methods to query and manipulate data.
- **Models**: Define the data structures used throughout the application.

### Key Features

- **Donor Management**: APIs to fetch, insert, and manage donor data.
- **Event Management**: Create and manage events, including donor selections for each event.
- **Fundraiser Management**: Associate fundraisers with events and manage their selections.


## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL Database
- TypeScript
- npm (Node Package Manager)

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/William-g7/BC-Cancer-Event-Management-System.git
   cd donor-engagement-system/backend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root of the backend directory and add your database configuration:
   ```plaintext
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_DATABASE=your_database_name
   ```

4. **Run Database Migrations**:
   Ensure your database schema is set up. You can use the provided SQL scripts in the `database` directory to create the necessary tables.

### Running the Application

1. **Start the Server**:
   You can run the application in development mode using:
   ```bash
   npm run dev
   ```

2. **Access the API**:
   The backend will be running on `http://localhost:5001`. You can use tools like Postman or curl to interact with the API endpoints.

### API Endpoints

- **GET /api/dashboard**: Get all events for the dashboard.
- **GET /api/events**: Fetch all events.
- **POST /api/events**: Create a new event.
- **GET /api/events/:id**: Get a specific event by ID.
- **GET /api/events/:id/selections**: Get all donors associated with a specific event.
