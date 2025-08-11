import axios from "axios";

export const loginUser = async (username: string, password: string) => {
  try {
    const response = await axios.post(
      "https://api-sandbox.factus.com.co/oauth/token",
      new URLSearchParams({
        grant_type: "password",
        client_id: "9e309485-7d30-47fc-80f7-5f1162309003",
        client_secret: "OI6JHg4BvajvAbZg4clYoNxoY5WEKbkPwS0ZHwJU",
        username,
        password,
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
    return response.data.access_token;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
};
