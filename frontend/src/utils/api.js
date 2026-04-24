const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");
  const isFormData = options.body instanceof FormData;
  const contentHeaders = isFormData ? {} : { "Content-Type": "application/json" };

  const headers = {
    ...contentHeaders,
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || "An error occurred");
  }
  
  return data;
};
