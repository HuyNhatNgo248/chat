import Cookies from "js-cookie";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";

    this.handleError();
  }

  handleError() {
    if (this.status === 401) new UnauthorizedError(this.message);
    else {
      // console.error(this.message);
    }
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = "Unauthorized") {
    super(401, message);
    this.name = "UnauthorizedError";

    this.handleError();
  }

  handleError() {
    // Remove the token cookie
    Cookies.remove("token");

    // Redirect to the login page
    window.location.href = "/signin";
  }
}
