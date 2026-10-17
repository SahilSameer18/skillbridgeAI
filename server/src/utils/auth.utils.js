import ApiError from "./ApiError.js";

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
 * Verifies a Google OAuth2 access token by checking its audience via Google's tokeninfo endpoint
 * and extracting verified user information via userinfo.
 * Enforces audience check (A1 fix) and email_verified claim.
 *
 * @param {string} accessToken - The OAuth2 access token from useGoogleLogin() implicit flow
 * @returns {Promise<{sub: string, email: string, name: string, picture: string|null}>}
 */
export async function verifyGoogleToken(accessToken) {
  if (!accessToken || typeof accessToken !== "string") {
    throw new ApiError(400, "Google access token is required");
  }

  try {
    // 1. Verify token audience and validity via Google's tokeninfo endpoint
    // This prevents token-substitution (confused deputy) attacks across different OAuth clients
    const tokenInfoRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(accessToken)}`
    );

    if (!tokenInfoRes.ok) {
      throw new ApiError(401, `Google token verification failed (${tokenInfoRes.status})`);
    }

    const tokenInfo = await tokenInfoRes.json();

    // Verify the token was explicitly issued to this application's Google Client ID
    const expectedClientId = process.env.GOOGLE_CLIENT_ID;
    if (expectedClientId) {
      const tokenAudience = tokenInfo.aud || tokenInfo.azp;
      if (tokenAudience !== expectedClientId) {
        throw new ApiError(401, "Google token audience mismatch: token was not issued for this application");
      }
    }

    // 2. Fetch full verified profile details via Google userinfo endpoint
    const userinfoRes = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!userinfoRes.ok) {
      throw new ApiError(401, `Google userinfo retrieval failed (${userinfoRes.status})`);
    }

    const payload = await userinfoRes.json();

    if (!payload || !payload.sub) {
      throw new ApiError(401, "Invalid Google userinfo payload");
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