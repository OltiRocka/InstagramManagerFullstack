import { AxiosError } from "axios";
import api from "@/utils/api";

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}
interface LoginForm {
  username: string;
  password: string;
}
interface SignupForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
export const loginUser = async (loginData: LoginForm): Promise<ApiResponse> => {
  try {
    const response = await api.post("/login/", loginData);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("accessToken", response.data.access);
    localStorage.setItem("refreshToken", response.data.refresh);
    return { success: true, data: response.data };
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
    if (signupData.password !== signupData.confirmPassword) {
      return { success: false, error: "Passwords do not match" };
    }

    const response = await api.post("/signup/", signupData);
    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage =
      (error as AxiosError).message || "An unknown error occurred";
    return { success: false, error: errorMessage };
  }
};

export const logoutUser = async (): Promise<ApiResponse> => {
  const refresh = localStorage.getItem("RefreshToken");
  console.log("refresh", refresh);
  if (!refresh) return { success: false, error: "No refresh token found" };
  try {
    const response = await api.post("/logout/", { refresh });
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
