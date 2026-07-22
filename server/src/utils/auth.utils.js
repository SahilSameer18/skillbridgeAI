import { OAuth2Client } from "google-auth-library";
import ApiError from "./ApiError.js";

// Initialize Google OAuth2 Client using environment variable
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Standardizes user response payload across all authentication routes.
 * Ensures consistent output for id, username, email, avatar, connected providers, and password status.
 */
export function formatUserResponse(user) {
  if (!user) return null;

  // Extract array of provider names (e.g. ['google']) if loaded from database
  const providers = Array.isArray(user.providers)
    ? user.providers.map((p) => p.providerName || p)
    : [];

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    avatar: user.avatar || null,
    providers,
    hasPassword: Boolean(user.password),
    createdAt: user.createdAt,
  };
}

/**
 * Verifies a Google ID Token JWT sent from the React client.
 * Validates token signature, expiration, client ID audience, and email_verified claim.
 * @param {string} idToken - The JWT credential token from Google Identity Services
 * @returns {Promise<{sub: string, email: string, name: string, picture: string|null}>}
 */
export async function verifyGoogleToken(idToken) {
  if (!idToken || typeof idToken !== "string") {
    throw new ApiError(400, "Google ID token is required");
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new ApiError(401, "Invalid Google token payload");
    }

    // Critical security check: Ensure Google has verified ownership of this email address
    if (!payload.email_verified) {
      throw new ApiError(401, "Google account email is not verified");
    }

    return {
      sub: payload.sub,
      email: payload.email,
      name: payload.name || "",
      picture: payload.picture || null,
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(401, `Google token authentication failed: ${error.message}`);
  }
}



