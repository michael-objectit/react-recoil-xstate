export async function apiService(url: string) {
  return fetch(`http://localhost:8091${url}`).then((resp) => resp.json());
}
