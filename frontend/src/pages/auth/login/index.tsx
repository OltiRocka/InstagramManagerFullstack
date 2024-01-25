import React, { useState } from "react";
import styles from "./login.module.css";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import { Formik, Form, Field } from "formik";
import { loginUser } from "@/stores/auth";
import { useRouter } from "next/navigation";
import GoogleIcon from "@/assets/images/GoogleIcon.png";
import "@/app/globals.css";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
export default function Loginform() {
  const router = useRouter();
  const [user, setUser] = useState({
    first_name: "John",
    last_name: "Doe",
    email: "john@doe.com",
    profile_image: `${process.env.NEXT_PUBLIC_BACKEND_URL}/media/profile_image/default.png`,
  });
  const handleSubmit = async (
    values: {
      email: string;
      password: string;
    },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      const loginData = {
        email: values.email,
        password: values.password,
      };

      const result = await loginUser(loginData);

      localStorage.setItem(
        "userData",
        JSON.stringify({
          first_name: result.data.first_name,
          last_name: result.data.last_name,
          email: result.data.email,
          profile_image: `${process.env.NEXT_PUBLIC_API_URL}${result.data.profile_image}`,
        })
      );
      if (result && result.success) {
        toast.success("Login successful");
        router.push("/");
      } else {
        console.error("Login failed:", result?.error);

        let errorMessage = "Login failed for unknown reasons";

        if (result?.error) {
          switch (result.error) {
            case "INVALID_CREDENTIALS":
              errorMessage = "Invalid email or password. Please try again.";
              break;
            case "ACCOUNT_LOCKED":
              errorMessage =
                "Your account has been locked. Please contact support.";
              break;
            default:
              errorMessage = result.error;
          }
        }

        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error("An error occurred during login. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        onSubmit={handleSubmit}
      >
        <Form className={styles.login_form}>
          <div className={styles.header}>
            <h2 className={styles.login_maintext}>Login to your Account</h2>
            <p className={styles.login_maindesc}>
              See what is going on with your Socials
            </p>
          </div>
          <button className={styles.google}>
            <Image src={GoogleIcon} alt="GoogleIcon" /> Continue with Google
          </button>
          <p className={styles.seporator}>or Sign In with Email</p>
          <div className={styles.input_container}>
            <label className={styles.input_label}>Email</label>
            <Field
              type="email"
              name="email"
              autoComplete="on"
              placeholder="mail@example.com"
              className={styles.input}
            />
          </div>

          <div className={styles.input_container}>
            <label className={styles.input_label}>Password</label>
            <Field
              name="password"
              autoComplete="current-password"
              id="current-password"
              placeholder="*****************"
              className={styles.input}
              type="password"
            />
          </div>
          <div className={styles.link_container}>
            <Link href="/auth/signup" className={styles.link}>
              Create Account
            </Link>{" "}
            <Link href="/auth/forgotPassword" className={styles.link}>
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className={styles.login_button}>
            Sign In
          </button>
        </Form>
      </Formik>
      <ToastContainer position="top-center" />
    </div>
  );
}
