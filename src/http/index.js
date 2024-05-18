export const API_URL = `https://localhost:5555`;

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
  .then((response) => 
    {
      return response
    })
  .catch((error) => {
    throw error;
  });
};

let repeatFlag = false;

const handleResponse = async (response, originalRequest) => {
  if (response.status === 401 && !repeatFlag) {
    repeatFlag = true;
    const refreshResponse = await fetchWithCredentials(`${API_URL}/refresh`);
    if (refreshResponse.ok) {
      const data = await refreshResponse.json();
      localStorage.setItem("token", data.accessToken);
      repeatFlag = false;
      const retryResponse = await fetchWithCredentials(originalRequest.url, originalRequest.options);
      return $api.responseHandler(retryResponse, originalRequest);
    } else {
      repeatFlag = false;
      throw new Error("Not authorized");
    }
  } 
  throw new Error(
    `Request failed with status ${response.status}`
  );
};


const $api = {
  get: (url, options = {}) => {
    const requestOptions = { url: `${API_URL}${url}`, options };
    return fetchWithCredentials(
      requestOptions.url,
      requestOptions.options
    ).then((response) => $api.responseHandler(response, requestOptions));
  },
  post: (url, data, options = {}) => {
    const requestOptions = {
      url: `${API_URL}${url}`,
      options: {
        ...options,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        body: JSON.stringify(data),
      },
    };
    return fetchWithCredentials(
      requestOptions.url,
      requestOptions.options
    ).then((response) => $api.responseHandler(response, requestOptions));
  },
};

$api.interceptors = {
  response: (handler) => {
    $api.responseHandler = handler;
  },
};

$api.responseHandler = async (response, originalRequest) => {
  if (!response.ok) {
    return handleResponse(response, originalRequest);
  }
  const jsonData = await response.json(); // Изменено: Убедитесь, что возвращаемый результат это JSON-данные
  return jsonData;
};

export default $api;
