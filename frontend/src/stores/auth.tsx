import { AxiosError } from "axios";
import api from "@/utils/api";
import axios from "axios";
interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}
interface LoginForm {
  email: string;
  password: string;
}
interface SignupForm {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export const loginUser = async (loginData: LoginForm): Promise<ApiResponse> => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login/`,
      loginData
    );
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("accessToken", response.data.access);
    localStorage.setItem("refreshToken", response.data.refresh);
    const user = await api.get("/auth/profile/");

    return { success: true, data: user.data };
  } catch (error) {
    const errorMessage =
      (error as AxiosError).message || "An unknown error occurred";
    return { success: false, error: errorMessage };
  }
};

export const signupUser = async (
  signupData: SignupForm
): Promise<ApiResponse> => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login/`,
      signupData
    );
    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage =
      (error as AxiosError).message || "An unknown error occurred";
    return { success: false, error: errorMessage };
  }
};

export const logoutUser = async (): Promise<ApiResponse> => {
  const refresh = localStorage.getItem("RefreshToken");
  if (!refresh) return { success: false, error: "No refresh token found" };
  try {
    const response = await api.post("/auth/logout/", { refresh });
    localStorage.setItem("isAuthenticated", "false");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage =
      (error as AxiosError).message || "An unknown error occurred";
    return { success: false, error: errorMessage };
  }
};
