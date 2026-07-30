# SkillBridge AI API Documentation

Base URL: `http://localhost:3000/api`

## Authentication

All protected routes require an HTTP-Only cookie named `token` containing a valid JWT. The backend automatically handles parsing and validating this cookie. If the token is invalid, expired, or blacklisted in Redis, the API responds with `401 Unauthorized`.

---

## Auth Endpoints

### 1. Register User
Create a new account using a username, email, and password.

- **Method:** `POST`
- **Route:** `/auth/register`
- **Access:** Public
- **Rate Limit:** 10 requests per 15 minutes per IP

**Request Body:**
```json
{
  "username": "johndoe",       // min 4 chars, letters/numbers/underscores only
  "email": "john@example.com", // valid email format
  "password": "securepassword" // min 6 characters
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "cuid...",
    "username": "johndoe",
    "email": "john@example.com",
    "avatar": null,
    "hasPassword": true,
    "createdAt": "2023-10-01T12:00:00Z"
  }
}
```
*Note: Sets HTTP-Only `token` cookie.*

---

### 2. Login User
Authenticate using an email and password.

- **Method:** `POST`
- **Route:** `/auth/login`
- **Access:** Public
- **Rate Limit:** 10 requests per 15 minutes per IP

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```
*Note: Fails with `401` if attempting to password-login to an account exclusively created via Google OAuth.*

---

### 3. Google OAuth Login / Register
Authenticate using a Google Access Token. This endpoint handles both registration and login depending on whether the Google account is recognized.

- **Method:** `POST`
- **Route:** `/auth/google`
- **Access:** Public
- **Rate Limit:** 10 requests per 15 minutes per IP

**Request Body:**
```json
{
  "accessToken": "ya29.a0AfB_by..."
}
```

**Responses:**
- `200 OK`: Login successful.
- `201 Created`: Registration successful (username is auto-generated).
- `409 Conflict`: The Google email exists in the system as a password account. The user must login with their password first, then use `/auth/link-google`.

---

### 4. Link Google Account
Link a Google account to an already authenticated credential-based session.

- **Method:** `POST`
- **Route:** `/auth/link-google`
- **Access:** Private (Requires `token` cookie)
- **Rate Limit:** 5 requests per 15 minutes per IP

**Request Body:**
```json
{
  "accessToken": "ya29.a0AfB_by..."
}
```
*Note: The email returned by Google MUST match the currently logged-in user's email.*

---

### 5. Logout
Revoke the current session.

- **Method:** `POST`
- **Route:** `/auth/logout`
- **Access:** Private
- **Behavior:** Clears the `token` cookie and pushes the JWT into the Redis token blacklist until it naturally expires.

---

### 6. Get Current User (Get Me)
Fetch the profile details of the currently authenticated user.

- **Method:** `GET`
- **Route:** `/auth/get-me`
- **Access:** Private (Requires `token` cookie)

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "User details retrieved successfully",
  "user": { ... }
}
```

---

## User Profile Endpoints

### 1. Get Profile with Analytics
Fetch user details along with their candidate preparation analytics.

- **Method:** `GET`
- **Route:** `/user/profile`
- **Access:** Private

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "user": { ... },
  "stats": {
    "totalReports": 5,
    "averageScore": 78,
    "topScore": 92
  }
}
```

---

### 2. Update Profile
Update username, email, and/or avatar.

- **Method:** `PUT`
- **Route:** `/user/profile`
- **Access:** Private
- **Behavior:** Validates unique constraints. Automatically invalidates the `userCache` in Redis so subsequent requests reflect the new data immediately.

**Request Body (All fields optional):**
```json
{
  "username": "new_username",
  "email": "newemail@example.com",
  "avatar": "https://example.com/avatar.png"
}
```

---

### 3. Change Password
Update the password for a credential-based account.

- **Method:** `PUT`
- **Route:** `/user/change-password`
- **Access:** Private

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newsecurepassword" // min 6 characters
}
```
*Note: Fails with `400` if the user registered via Google OAuth and has no password.*

---

## Interview Endpoints

### 1. Generate Interview Report
Analyzes a job description and a resume (PDF) using Google Gemini AI to generate a structured preparation report.

- **Method:** `POST`
- **Route:** `/interview/`
- **Access:** Private
- **Content-Type:** `multipart/form-data`
- **Rate Limit:** 5 generations per hour per IP

**Form Data Requirements:**
- `jobDescription` (text): Required. The text of the target job post.
- `resume` (file): Optional. PDF document.

**Behavior:**
1. Parses PDF (if provided).
2. Prompts Gemini AI for a structured JSON response.
3. Automatically matches identified skill gaps against the internal `Skill` database to attach documentation and video links.
4. Saves the report to PostgreSQL.

---

### 2. Get All Interview Reports
Fetch a list of all historical reports generated by the user.

- **Method:** `GET`
- **Route:** `/interview/`
- **Access:** Private

---

### 3. Get Report by ID
Fetch the complete details of a specific interview report, including technical questions, behavioral questions, ranked skill gaps, learning resources, and the multi-day preparation plan.

- **Method:** `GET`
- **Route:** `/interview/report/:interviewId`
- **Access:** Private

---

### 4. Delete Report
Permanently remove a generated report.

- **Method:** `DELETE`
- **Route:** `/interview/:interviewId`
- **Access:** Private

---

### 5. Generate Resume PDF Export
Generates a downloadable PDF version of the analyzed resume content via Puppeteer.

- **Method:** `POST`
- **Route:** `/interview/resume/pdf/:interviewReportId`
- **Access:** Private

**Success Response:** Returns a raw `application/pdf` buffer stream to trigger a browser download.
