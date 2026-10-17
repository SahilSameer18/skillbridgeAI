# SkillBridge AI API Documentation

Base URL: `http://localhost:3000/api`

## Unified Response Format

Every API endpoint strictly conforms to the following standardized JSON contract:

### Success Response
```json
{
  "success": true,
  "message": "Human-readable confirmation message",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Human-readable error description",
  "errors": [ ... ]
}
```

## Authentication

All protected routes require an HTTP-Only cookie named `token` containing a signed JWT (or an `Authorization: Bearer <token>` header).
- Tokens are automatically validated against a self-expiring Redis blacklist.
- Password change automatically revokes all other active sessions while issuing a fresh token to the user's current session.

---

## Auth Endpoints

### 1. Register User
Create a new candidate account.

- **Method:** `POST`
- **Route:** `/auth/register`
- **Access:** Public
- **Rate Limit:** 10 requests per 15 minutes per IP

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePassword1!"
}
```
*Password Requirements: 8–72 characters, at least 1 uppercase, 1 lowercase, 1 digit, and 1 special character.*

---

### 2. Login User
Authenticate using credentials.

- **Method:** `POST`
- **Route:** `/auth/login`
- **Access:** Public
- **Rate Limit:** 10 requests per 15 minutes per IP

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword1!"
}
```

---

### 3. Google OAuth Login / Register
Authenticate using a verified Google OAuth 2.0 access token.

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
*Note: Tokens are strictly verified against Google token audience constraints.*

---

### 4. Link Google Account
Link Google SSO to an authenticated credential account.

- **Method:** `POST`
- **Route:** `/auth/link-google`
- **Access:** Private
- **Rate Limit:** 5 requests per 15 minutes per user

**Request Body:**
```json
{
  "accessToken": "ya29.a0AfB_by..."
}
```

---

### 5. Logout
Revoke the current session.

- **Method:** `POST`
- **Route:** `/auth/logout`
- **Access:** Private
- **Behavior:** Clears the cookie and blacklists the JWT in Redis with TTL until expiry.

---

### 6. Get Current User (Get Me)
- **Method:** `GET`
- **Route:** `/auth/get-me`
- **Access:** Private

---

## User Profile & Account Lifecycle Endpoints

### 1. Get Profile with Preparation Analytics
- **Method:** `GET`
- **Route:** `/user/profile`
- **Access:** Private

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "id": "cuid...",
      "username": "johndoe",
      "email": "john@example.com",
      "avatar": null,
      "hasPassword": true
    },
    "stats": {
      "totalReports": 5,
      "averageScore": 84,
      "topScore": 92
    }
  }
}
```

---

### 2. Update Profile
Update username, email, or avatar.

- **Method:** `PUT`
- **Route:** `/user/profile`
- **Access:** Private

**Request Body:**
```json
{
  "username": "new_username",
  "email": "new_email@example.com",
  "currentPassword": "CurrentPassword1!", // Mandatory when changing email on password accounts
  "avatar": "https://example.com/avatar.png"
}
```

---

### 3. Change Password
Update credentials. All other active sessions are immediately invalidated.

- **Method:** `PUT`
- **Route:** `/user/change-password`
- **Access:** Private

**Request Body:**
```json
{
  "currentPassword": "CurrentPassword1!",
  "newPassword": "NewSecurePassword2@"
}
```

---

### 4. Delete Account (GDPR Compliance)
Permanently remove candidate account and cascade delete all interview reports.

- **Method:** `DELETE`
- **Route:** `/user`
- **Access:** Private

---

## Interview Analysis Endpoints

### 1. Generate Interview Strategy Report
Analyzes resume against a target role description using Google Gemini (`gemini-3.5-flash-lite`).

- **Method:** `POST`
- **Route:** `/interview/`
- **Access:** Private
- **Content-Type:** `multipart/form-data`
- **Rate Limit:** 5 requests per hour (user-keyed)

**Multipart Fields:**
- `jobDescription` (text): **Required**. Target role requirements (**30 to 1200 characters**).
- `resume` (file): **Required**. Text-based PDF (max 4MB). Scanned image PDFs are rejected.

**Processing Pipeline:**
1. Text Extraction & Sanitization (null bytes stripped, scanned PDF guard).
2. AI Evaluation via Gemini (`gemini-3.5-flash-lite` with fallback to `gemini-3.1-flash-lite`).
3. Runtime Zod Schema Validation on generative output.
4. Deterministic Database Skill Matching against 94 catalog skills.
5. Automatic compound skill gap splitting (e.g., "Docker / Kubernetes").

---

### 2. Get All Interview Reports (Paginated)
Fetch candidate historical reports with bounded pagination.

- **Method:** `GET`
- **Route:** `/interview/?page=1&limit=6`
- **Access:** Private
- **Query Parameters:**
  - `page`: Integer $\ge 1$ (default: `1`)
  - `limit`: Clamped between `1` and `50` (default: `6`)

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Interview reports fetched successfully",
  "data": {
    "interviewReports": [ ... ],
    "totalCount": 12
  }
}
```

---

### 3. Get Report by ID
- **Method:** `GET`
- **Route:** `/interview/report/:interviewId`
- **Access:** Private

---

### 4. Delete Report
- **Method:** `DELETE`
- **Route:** `/interview/:interviewId`
- **Access:** Private