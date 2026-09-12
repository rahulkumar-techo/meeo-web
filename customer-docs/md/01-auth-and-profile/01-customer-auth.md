# 🔐 Customer Authentication & Session Management

This guide details customer sign-up, sign-in, token refresh, social authentication, CSRF security, and logout flows.

---

## 📋 Endpoints Overview

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/signup` | Public | Register a new customer account |
| `POST` | `/api/v1/auth/login` | Public | Authenticate customer with email/password |
| `POST` | `/api/v1/auth/refresh` | Public (Cookie / Header) | Refresh expired access token |
| `POST` | `/api/v1/auth/logout` | Authenticated | Invalidate active session and clear cookies |
| `GET` | `/api/v1/auth/csrf` | Public | Obtain CSRF token for state-changing requests |
| `POST` | `/api/v1/auth/forgot-password` | Public | Request password reset email |
| `POST` | `/api/v1/auth/reset-password` | Public | Reset account password with token |

---

## 1. Retrieve CSRF Protection Token

Before executing mutating actions using cookies, frontend clients should obtain a CSRF token.

### Request
```http
GET /api/v1/auth/csrf HTTP/1.1
Host: api.example.com
```

### Response `200 OK`
```json
{
  "success": true,
  "csrfToken": "9e1c45dfa7b8e147289f6d701e8a93a0b12c4e56"
}
```

> **Client Implementation Note:** Store this token and attach it to mutating requests as `X-CSRF-Token: <token>`.

---

## 2. Customer Registration (`Signup`)

### Request
```http
POST /api/v1/auth/signup HTTP/1.1
Host: api.example.com
Content-Type: application/json
X-CSRF-Token: 9e1c45dfa7b8e147289f6d701e8a93a0b12c4e56

{
  "email": "customer@example.com",
  "password": "StrongPassword@123",
  "firstName": "Sarah",
  "lastName": "Connor"
}
```

### Response `201 Created`
```json
{
  "success": true,
  "message": "Account created successfully. Please verify your email.",
  "data": {
    "user": {
      "id": "usr_01J8R9XYZ8877",
      "email": "customer@example.com",
      "firstName": "Sarah",
      "lastName": "Connor",
      "role": "CUSTOMER",
      "isEmailVerified": false,
      "createdAt": "2026-09-12T07:20:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 900
    }
  }
}
```

---

## 3. Customer Login

### Request
```http
POST /api/v1/auth/login HTTP/1.1
Host: api.example.com
Content-Type: application/json
X-CSRF-Token: 9e1c45dfa7b8e147289f6d701e8a93a0b12c4e56

{
  "email": "customer@example.com",
  "password": "StrongPassword@123"
}
```

### Response `200 OK`
Sets `refreshToken` in HTTP-only Cookie and returns short-lived `accessToken`:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "usr_01J8R9XYZ8877",
      "email": "customer@example.com",
      "firstName": "Sarah",
      "lastName": "Connor",
      "role": "CUSTOMER"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 900
    }
  }
}
```

---

## 4. Token Refresh Flow

When the `accessToken` expires (HTTP `401 Unauthorized`), the client triggers the refresh endpoint automatically.

### Request
```http
POST /api/v1/auth/refresh HTTP/1.1
Host: api.example.com
Cookie: refreshToken=eyJhbGciOiJIUzI1Ni...
```

### Response `200 OK`
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.new_access_token...",
    "expiresIn": 900
  }
}
```

---

## 5. Logout & Session Termination

### Request
```http
POST /api/v1/auth/logout HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJhbGciOiJIUzI1Ni...
X-CSRF-Token: 9e1c45dfa7b8e147289f6d701e8a93a0b12c4e56
```

### Response `200 OK`
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 💡 Frontend Integration Example (TypeScript / Axios)

```typescript
import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true, // required for refreshToken cookies
});

// Request Interceptor: Attach Access Token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Silent Token Refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await apiClient.post("/auth/refresh");
        localStorage.setItem("accessToken", data.data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshErr) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);
```
