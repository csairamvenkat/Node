# MySQL Login Project

A Node.js application that connects to a MySQL database for handling login credentials.

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Create a MySQL database named "Practice" and the table "LoginCredentials":
   ```sql
   CREATE DATABASE IF NOT EXISTS Practice;
   USE Practice;
   CREATE TABLE IF NOT EXISTS LoginCredentials (
       id INT AUTO_INCREMENT PRIMARY KEY,
       Username VARCHAR(50) NOT NULL UNIQUE,
       Password VARCHAR(255) NOT NULL
   );
   ```

3. Update the `.env` file with your MySQL credentials:
   ```
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_DATABASE=Practice
   ```

4. Start the application:
   ```
   npm start
   ```

## API Endpoints

- `GET /`: Test if the server is running
- `GET /test-db`: Test the database connection
- `GET /users`: Get all users (only returns IDs and usernames for security)
- `POST /users`: Create a new user (requires username and password in the request body)

## File Structure

- `app.js`: Main application entry point
- `db.js`: Database connection setup
- `userOperations.js`: Functions for user CRUD operations
- `.env`: Environment variables for configuration