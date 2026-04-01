/**
 * Standardized API response wrapper.
 * Every endpoint returns the same shape — makes frontend integration predictable.
 *
 * Success: { success: true, message, data }
 * Error:   { success: false, message, errors? }
 */

class ApiResponse {
  constructor(res) {
    this.res = res;
  }

  success(data = null, message = 'Success', statusCode = 200) {
    return this.res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  created(data = null, message = 'Created successfully') {
    return this.success(data, message, 201);
  }

  error(message = 'Something went wrong', statusCode = 500, errors = null) {
    const body = { success: false, message };
    if (errors) body.errors = errors;
    return this.res.status(statusCode).json(body);
  }

  notFound(message = 'Resource not found') {
    return this.error(message, 404);
  }

  unauthorized(message = 'Unauthorized') {
    return this.error(message, 401);
  }

  forbidden(message = 'Access denied') {
    return this.error(message, 403);
  }

  badRequest(message = 'Bad request', errors = null) {
    return this.error(message, 400, errors);
  }
}

// Factory — keeps controller code clean: respond(res).success(data)
const respond = (res) => new ApiResponse(res);

module.exports = { respond };
