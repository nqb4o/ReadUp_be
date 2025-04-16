# ReadUp Backend API Documentation

## Overview

The ReadUp backend provides a RESTful API for managing articles, users, vocabulary, quizzes, and chatbot interactions. Below is the detailed documentation for each endpoint.

---

## Authentication

### POST `/api/auth/register`

- **Description**: Register a new user.
- **Request Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  - `201 Created`: User registered successfully.
  - `400 Bad Request`: Missing or invalid data.

### POST `/api/auth/login`

- **Description**: Log in a user.
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  - `200 OK`: Login successful.
  - `401 Unauthorized`: Invalid credentials.

### GET `/api/auth/me`

- **Description**: Get the logged-in user's profile.
- **Headers**: Requires `Authorization: Bearer <token>`.
- **Response**:
  - `200 OK`: User profile data.
  - `401 Unauthorized`: Missing or invalid token.

### POST `/api/auth/email-reset-password`

- **Description**: Request a password reset email.
- **Request Body**:
  ```json
  {
    "email": "string"
  }
  ```
- **Response**:
  - `200 OK`: Email sent.
  - `404 Not Found`: Email not registered.

### POST `/api/auth/enter-reset-password`

- **Description**: Reset the password using a token.
- **Request Body**:
  ```json
  {
    "token": "string",
    "newPassword": "string"
  }
  ```
- **Response**:
  - `200 OK`: Password reset successful.
  - `400 Bad Request`: Invalid or expired token.

---

## Articles

### GET `/api/article`

- **Description**: Retrieve all articles.
- **Response**:
  - `200 OK`: List of articles.

### GET `/api/article/:id`

- **Description**: Retrieve a specific article by ID.
- **Response**:
  - `200 OK`: Article data.
  - `404 Not Found`: Article not found.

### POST `/api/article`

- **Description**: Create a new article.
- **Headers**: Requires `Authorization: Bearer <token>`.
- **Request Body**:
  ```json
  {
    "title": "string",
    "content": "string",
    "tags": ["string"]
  }
  ```
- **Response**:
  - `201 Created`: Article created successfully.
  - `400 Bad Request`: Missing or invalid data.

### PUT `/api/article/:id`

- **Description**: Update an article by ID.
- **Headers**: Requires `Authorization: Bearer <token>`.
- **Request Body**:
  ```json
  {
    "title": "string",
    "content": "string",
    "tags": ["string"]
  }
  ```
- **Response**:
  - `200 OK`: Article updated successfully.
  - `404 Not Found`: Article not found.

### DELETE `/api/article/:id`

- **Description**: Delete an article by ID.
- **Headers**: Requires `Authorization: Bearer <token>`.
- **Response**:
  - `200 OK`: Article deleted successfully.
  - `404 Not Found`: Article not found.

---

## Vocabulary

### GET `/api/vocabulary/:user_id`

- **Description**: Retrieve vocabulary for a specific user.
- **Response**:
  - `200 OK`: List of vocabulary.
  - `400 Bad Request`: Missing user ID.

### POST `/api/vocabulary`

- **Description**: Add a new vocabulary word.
- **Request Body**:
  ```json
  {
    "user_id": "string",
    "word": "string",
    "article_id": "string"
  }
  ```
- **Response**:
  - `201 Created`: Vocabulary added successfully.
  - `400 Bad Request`: Missing or invalid data.

### DELETE `/api/vocabulary/:id`

- **Description**: Delete a vocabulary word by ID.
- **Response**:
  - `200 OK`: Vocabulary deleted successfully.
  - `404 Not Found`: Vocabulary not found.

---

## Quizzes

### GET `/api/quiz/random`

- **Description**: Retrieve 10 random quiz questions.
- **Response**:
  - `200 OK`: List of questions.

### POST `/api/quiz/submit`

- **Description**: Submit quiz answers.
- **Request Body**:
  ```json
  {
    "user_id": "string",
    "answers": [
      {
        "question_id": "string",
        "selected_answer": "string"
      }
    ]
  }
  ```
- **Response**:
  - `201 Created`: Quiz results saved.
  - `400 Bad Request`: Missing or invalid data.

### GET `/api/quiz/history/:user_id`

- **Description**: Retrieve quiz history for a user.
- **Response**:
  - `200 OK`: Quiz history.
  - `404 Not Found`: No history found.

### GET `/api/quiz/details/:attempt_id`

- **Description**: Retrieve details of a specific quiz attempt.
- **Response**:
  - `200 OK`: Quiz attempt details.
  - `404 Not Found`: Attempt not found.

---

## Chatbot

### POST `/api/chatbot/query`

- **Description**: Ask a question to the chatbot.
- **Request Body**:
  ```json
  {
    "question": "string"
  }
  ```
- **Response**:
  - `200 OK`: Chatbot response.
  - `503 Service Unavailable`: Chatbot not initialized.

### POST `/api/chatbot/upload`

- **Description**: Upload a document for the chatbot to process.
- **Headers**: Requires `Authorization: Bearer <token>`.
- **Request**: Multipart form-data with a `document` file.
- **Response**:
  - `200 OK`: Document processed successfully.
  - `400 Bad Request`: Missing or invalid file.

### POST `/api/chatbot/initialize-with-article`

- **Description**: Initialize the chatbot with article content.
- **Request Body**:
  ```json
  {
    "articleTitle": "string",
    "articleContent": "string"
  }
  ```
- **Response**:
  - `200 OK`: Chatbot initialized successfully.
  - `400 Bad Request`: Missing or invalid data.

---

## Users

### GET `/api/users`

- **Description**: Retrieve all users (Admin only).
- **Headers**: Requires `Authorization: Bearer <token>`.
- **Response**:
  - `200 OK`: List of users.

### DELETE `/api/users/:id`

- **Description**: Delete a user by ID (Admin only).
- **Headers**: Requires `Authorization: Bearer <token>`.
- **Response**:
  - `200 OK`: User deleted successfully.
  - `404 Not Found`: User not found.
