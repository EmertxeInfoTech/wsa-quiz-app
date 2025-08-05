/**
 * Asynchronous function that makes a request to the API endpoint.
 *
 * @param {Object} options - Options for the API request.
 * @param {string} options.endpoint - The endpoint of the API.
 * @param {string} [options.method="GET"] - The HTTP method for the request.
 * @param {boolean} [options.includeAuth=true] - Whether to include the access token in the request headers.
 * @param {any} [options.body=undefined] - The body of the request.
 * @returns {Promise<Response>} - The response from the API.
 */
async function apiRequest(options) {
  // Destructure the options object to get the endpoint, method, includeAuth, and body.
  const {
    endpoint,
    method = "GET",
    includeAuth = true,
    body = undefined,
  } = options;

  // Create a new Headers object.
  const headers = new Headers();

  // If the body is an object, set the "Content-Type" header to "application/json" and stringify the body.
  let requestBody = body;
  if (body && typeof body === "object") {
    headers.append("Content-Type", "application/json");
    requestBody = JSON.stringify(requestBody);
  }

  // If includeAuth is true and there is an access token in localStorage, append the "Authorization" header with the access token.
  if (includeAuth && localStorage.getItem("accessToken")) {
    headers.append(
      "Authorization",
      `Bearer ${localStorage.getItem("accessToken")}`
    );
  }

  // Create a new URL object with the base URL from the environment variables and the endpoint.
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const url = new URL(endpoint, baseUrl);

  console.log(requestBody);
  // Make a request to the API endpoint with the specified method, headers, and body.
  const response = await fetch(url, {
    method,
    headers,
    body: requestBody,
  });

  // Return the response from the API.
  return response;
}

// Export the apiRequest function as the default export.
export default apiRequest;
