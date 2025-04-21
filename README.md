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
    "name": "John Doe",
    "email": "johndoe@example.com",
    "password": "securepassword123"
  }
  ```
- **Response**:
  - `201 Created`: User registered successfully.
    ```json
    {
      "message": "Registration successful.",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huZG9lQGV4YW1wbGUuY29tIiwiaWF0IjoxNjg0Mjg3NjMwLCJleHAiOjE2ODQyOTEyMzB9.3Ich-ltn8gcaQDSIX9ipfrHvvOON2VBMYL8nwKbbEzs",
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "johndoe@example.com",
        "role": "user"
      }
    }
    ```
  - `400 Bad Request`: Missing or invalid data.
    ```json
    {
      "message": "Invalid input data."
    }
    ```

### POST `/api/auth/login`

- **Description**: Log in a user.
- **Request Body**:
  ```json
  {
    "email": "johndoe@example.com",
    "password": "securepassword123"
  }
  ```
- **Response**:
  - `200 OK`: Login successful.
    ```json
    {
      "message": "Login successful.",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huZG9lQGV4YW1wbGUuY29tIiwiaWF0IjoxNjg0Mjg3NjMwLCJleHAiOjE2ODQyOTEyMzB9.3Ich-ltn8gcaQDSIX9ipfrHvvOON2VBMYL8nwKbbEzs",
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "johndoe@example.com",
        "role": "user"
      }
    }
    ```
  - `401 Unauthorized`: Invalid credentials.
    ```json
    {
      "message": "Invalid email or password."
    }
    ```

### GET `/api/auth/me`

- **Description**: Get the logged-in user's profile.
- **Headers**: Requires `Authorization: Bearer <token>`.
- **Response**:
  - `200 OK`: User profile data.
    ```json
    {
      "id": 1,
      "name": "John Doe",
      "email": "johndoe@example.com",
      "role": "user"
    }
    ```
  - `401 Unauthorized`: Missing or invalid token.
    ```json
    {
      "message": "Invalid or expired token."
    }
    ```

### POST `/api/auth/email-reset-password`

- **Description**: Request a password reset email.
- **Request Body**:
  ```json
  {
    "email": "johndoe@example.com"
  }
  ```
- **Response**:
  - `200 OK`: Email sent.
    ```json
    {
      "message": "Password reset email sent."
    }
    ```
  - `404 Not Found`: Email not registered.
    ```json
    {
      "message": "Email not found in the system."
    }
    ```

### POST `/api/auth/enter-reset-password`

- **Description**: Reset the password using a token.
- **Request Body**:
  ```json
  {
    "token": "reset-token-example",
    "newPassword": "newsecurepassword123"
  }
  ```
- **Response**:
  - `200 OK`: Password reset successful.
    ```json
    {
      "message": "Password has been reset successfully."
    }
    ```
  - `400 Bad Request`: Invalid or expired token.
    ```json
    {
      "message": "Invalid or expired token."
    }
    ```

---

## Articles

### GET `/api/article`

- **Description**: Retrieve all articles.
- **Response**:
  - `200 OK`: List of articles.
    ```json
    [
      {
        "id": 1,
        "title": "Understanding REST APIs",
        "content": "REST APIs are...",
        "tags": ["API", "REST"],
        "createdAt": "2025-04-17T10:00:00Z",
        "updatedAt": "2025-04-17T10:00:00Z"
      }
    ]
    ```

### GET `/api/article/:id`

- **Description**: Retrieve a specific article by ID.
- **Response**:
  - `200 OK`: Article data.
    ```json
    {
      "id": 1,
      "title": "Understanding REST APIs",
      "content": "REST APIs are...",
      "tags": ["API", "REST"],
      "createdAt": "2025-04-17T10:00:00Z",
      "updatedAt": "2025-04-17T10:00:00Z"
    }
    ```
  - `404 Not Found`: Article not found.
    ```json
    {
      "message": "Article not found."
    }
    ```

### POST `/api/article`

- **Description**: Create a new article.
- **Headers**: Requires `Authorization: Bearer <token>`.
- **Request Body**:
  - `title` (string, required): The title of the article.
  - `content` (string, required): The content of the article.
  - `tags` (array of strings, optional): Tags associated with the article.
  - `image` (string, optional): A URL link to the image.
  ```json
  {
    "title": "Understanding REST APIs",
    "content": "REST APIs are...",
    "tags": ["API", "REST"],
    "image": "https://example.com/image.jpg"
  }
  ```
- **Response**:
  - `201 Created`: Article created successfully.
    ```json
    {
      "message": "Article created successfully.",
      "article": {
        "id": 1,
        "title": "Understanding REST APIs",
        "content": "REST APIs are...",
        "tags": ["API", "REST"],
        "image": "https://example.com/image.jpg",
        "createdAt": "2025-04-17T10:00:00Z",
        "updatedAt": "2025-04-17T10:00:00Z"
      }
    }
    ```
  - `400 Bad Request`: Missing or invalid data.
    ```json
    {
      "message": "Invalid input data."
    }
    ```

### PUT `/api/article/:id`

- **Description**: Update an article by ID.
- **Headers**: Requires `Authorization: Bearer <token>`.
- **Request Body**:
  - `title` (string, required): The updated title of the article.
  - `content` (string, required): The updated content of the article.
  - `tags` (array of strings, optional): Updated tags associated with the article.
  - `image` (file, optional): An updated image file to be uploaded. If not provided, the existing image will remain unchanged.
  ```json
  {
    "title": "Updated REST API Guide",
    "content": "Updated content...",
    "tags": ["API", "Guide"],
    "image": "https://example.com/updated-image.jpg"
  }
  ```
- **Response**:
  - `200 OK`: Article updated successfully.
    ```json
    {
      "message": "Article updated successfully.",
      "article": {
        "id": 1,
        "title": "Updated REST API Guide",
        "content": "Updated content...",
        "tags": ["API", "Guide"],
        "image": "https://example.com/updated-image.jpg",
        "createdAt": "2025-04-17T10:00:00Z",
        "updatedAt": "2025-04-17T12:00:00Z"
      }
    }
    ```
  - `404 Not Found`: Article not found.
    ```json
    {
      "message": "Article not found."
    }
    ```

### DELETE `/api/article/:id`

- **Description**: Delete an article by ID.
- **Headers**: Requires `Authorization: Bearer <token>`.
- **Response**:
  - `200 OK`: Article deleted successfully.
    ```json
    {
      "message": "Article deleted successfully."
    }
    ```
  - `404 Not Found`: Article not found.
    ```json
    {
      "message": "Article not found."
    }
    ```

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
    "user_id": "1",
    "word": "example",
    "article_id": "1"
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
    "user_id": "1",
    "answers": [
      {
        "question_id": "101",
        "selected_answer": "A"
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
    "question": "What is REST API?"
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
    "articleTitle": "Understanding REST APIs",
    "articleContent": "REST APIs are..."
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
