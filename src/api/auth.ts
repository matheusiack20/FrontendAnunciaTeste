export const verifyToken = async () => {
  try {
    const authToken = localStorage.getItem('authToken'); // Get authToken from localStorage
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}auth/verify-token`, {
      method: "GET",
      credentials: "include", // 🔹 Garante que os cookies sejam enviados junto
      headers: {
        "Authorization": `Bearer ${authToken}` // Include authToken in the request headers
      }
    });

    if (!response.ok) {
      throw new Error('Failed to verify tokenn');
    }

    const data = await response.json();
    console.log("Resposta do backend:", data);
    return data;
  } catch (error) {
    console.error("Erro ao buscar o token:", error);
    return null;
  }
};