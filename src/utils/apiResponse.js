class ApiResponse {
  constructor(statusCode, message, data = null, success = true) {
    this.statusCode = statusCode;
    this.success = success;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }

  static success(res, message, data = null, statusCode = 200) {
    return res
      .status(statusCode)
      .json(new ApiResponse(statusCode, message, data, true));
  }

  static error(res, message, statusCode = 500, data = null) {
    return res
      .status(statusCode)
      .json(new ApiResponse(statusCode, message, data, false));
  }
}

export default ApiResponse;
