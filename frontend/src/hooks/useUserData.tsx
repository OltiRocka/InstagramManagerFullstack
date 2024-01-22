"use client";
import { useUserStore } from "@/stores/store";

export interface UserData {
  first_name: string;
  last_name: string;
  email: string;
  profile_image: string; // Use string if it's a URL, or any other type that represents the image data
}

function useUserData() {
  const first_name = useUserStore((state: any) => state.first_name);
  const last_name = useUserStore((state: any) => state.last_name);
  const email = useUserStore((state: any) => state.email);
  const profile_image = useUserStore((state: any) => state.profile_image);

  return { first_name, last_name, email, profile_image };
}

export default useUserData;
