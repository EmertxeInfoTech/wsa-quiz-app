async function validateAnswerAPI(
  questionId,
  answer,
  handleResponse,
  handleError,
  setLoading
) {
  setLoading(true);
  try {
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    const endpoint = "/v1/questions/validate-answer";

    const url = new URL(endpoint, baseUrl);

    const requestBody = JSON.stringify({
      id: questionId,
      answer,
    });

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    };

    const response = await fetch(url, requestOptions);

    const jsonData = await response.json();

    if (!response.ok) {
      const errorMessage = jsonData.message || "Unknown error occurred";
      throw new Error(errorMessage);
    }

    handleResponse(jsonData);
  } catch (error) {
    handleError(error);
  } finally {
    setLoading(false);
  }
}

export default validateAnswerAPI;
