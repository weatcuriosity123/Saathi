const authService = require('./auth.service');
const { respond } = require('../../utils/ApiResponse');
const { setRefreshTokenCookie, clearRefreshTokenCookie } = require('../../utils/token');

/**
 * Auth Controller — HTTP layer only.
 * Reads from req, calls the service, writes to res.
 * Zero business logic here.
 */

/**
 * POST /api/v1/auth/register
 * Body: { name, email, password, role? }
 */
const register = async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.registerUser(req.body);

  setRefreshTokenCookie(res, refreshToken);

  return respond(res).created(
    { user, accessToken },
    'Account created successfully'
  );
};

/**
 * POST /api/v1/auth/login
 * Body: { email, password }
 */
const login = async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.loginUser(req.body);

  setRefreshTokenCookie(res, refreshToken);

  return respond(res).success(
    { user, accessToken },
    'Logged in successfully'
  );
};

/**
 * POST /api/v1/auth/refresh-token
 * Reads refreshToken from HttpOnly cookie (not body — can't be stolen via XSS)
 */
const refreshToken = async (req, res) => {
  const token = req.cookies?.refreshToken;
  const { accessToken, refreshToken: newRefreshToken } = await authService.refreshAccessToken(token);

  setRefreshTokenCookie(res, newRefreshToken);

  return respond(res).success({ accessToken }, 'Token refreshed');
};

/**
 * POST /api/v1/auth/logout
 * Clears the HttpOnly cookie. Frontend should also discard the access token.
 */
const logout = (req, res) => {
  clearRefreshTokenCookie(res);
  return respond(res).success(null, 'Logged out successfully');
};

/**
 * GET /api/v1/auth/me
 * Protected route — returns the currently authenticated user's profile.
 */
const getMe = async (req, res) => {
  const user = await authService.getMe(req.user.id);
  return respond(res).success({ user });
};

module.exports = { register, login, refreshToken, logout, getMe };
