/**
 * Standardized API response wrapper.
 * Ensures all API responses have a consistent shape.
 */
class ApiResponse {
  /**
   * Creates a success response object.
   * Input: statusCode (number), message (string), data (any)
   * Output: { success, statusCode, message, data }
   */
  static success(res, statusCode = 200, message = 'Success', data = null) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  /**
   * Creates a paginated success response.
   * Input: statusCode, message, data, pagination info
   * Output: { success, message, data, pagination }
   */
  static paginated(res, statusCode = 200, message = 'Success', data = [], pagination = {}) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      pagination,
    });
  }
}

module.exports = ApiResponse;
