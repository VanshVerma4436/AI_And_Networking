export async function getTrafficData() {
  const res = await fetch('http://localhost:8000/traffic');
  return res.json();
}
