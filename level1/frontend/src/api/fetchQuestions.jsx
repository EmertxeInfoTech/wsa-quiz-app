async function fetchQuestionsAPI(handleResponse, handleError, setLoading) {
  setLoading(true);
  try {
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    console.log(`url : ${process.env.REACT_APP_API_BASE_URL}`);
    const endpoint = "/v1/questions";

    const url = new URL(endpoint, baseUrl);
    console.log(url);

    const response = await fetch(url);
    console.log(response);

    const jsonData = await response.json();
    console.log(jsonData);

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

export default fetchQuestionsAPI;
