export const API_URL = `http://localhost:5555`;

const fetchWithCredentials = (url, options = {}) => {
  const { headers = {}, ...restOptions } = options;
  return fetch(url, {
    ...restOptions,
    headers: {
      ...headers,
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    credentials: "include",
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .catch((error) => {
    console.error("Fetch error:", error);
    throw error;
  });
};

const handleResponse = async (response) => {
  if (response.status === 401) {
    const refreshResponse = await fetchWithCredentials(`${API_URL}/refresh`);
    if (refreshResponse.ok) {
      const data = await refreshResponse.json();
      localStorage.setItem("token", data.accessToken);
      return true;
    } else {
      throw new Error("Not authorized");
    }
  }
  throw new Error(`Request failed with status ${response.status}`);
};

const $api = {
  get: (url, options = {}) => fetchWithCredentials(`${API_URL}${url}`, options),
  post: (url, data, options = {}) =>
    fetchWithCredentials(`${API_URL}${url}`, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: JSON.stringify(data),
    }),
};

$api.interceptors = {
  response: (handler) => {
    $api.responseHandler = handler;
  },
};

$api.responseHandler = async (response) => {
  if (!response.ok) {
    await handleResponse(response);
  }
  return response;
};

export default $api;
