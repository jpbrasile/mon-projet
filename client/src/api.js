const BASE_URL = '/.netlify/functions';

export async function apiRequest(endpoint, method = "GET", data = null) {
  // Convert /api/prospects to /.netlify/functions/prospects
  const url = `${BASE_URL}${endpoint.replace('/api/', '/')}`;
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Erreur API (${response.status} ${response.statusText}) : ${errorText}`
    );
  }
  return response.json();
}