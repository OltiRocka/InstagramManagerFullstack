import React from "react";
import styles from "./login.module.css";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { loginUser } from "@/stores/auth";
import "../../app/globals.css";
import { useRouter } from "next/navigation";
export default function Loginform() {
  const router = useRouter();
  const handleSubmit = async (
    values: {
      username: string;
      password: string;
    },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      const loginData = {
        username: values.username,
        password: values.password,
      };

      const result = await loginUser(loginData);

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
      <div className={styles.secondCont}>
        <Formik
          initialValues={{
            username: "",
            password: "",
          }}
          onSubmit={handleSubmit}
        >
          <Form className={styles.login_form}>
            <p className={styles.login_maintext}>Sign in</p>
            <div className={styles.passCont}>
              <label className={styles.login_label}>Username</label>
              <div className={styles.inputWithIcon}>
                <Field
                  type="text"
                  name="username"
                  autoComplete="on"
                  placeholder="Email Address"
                  className={styles.login_input}
                />
              </div>
              <div className={styles.errorMessage}>
                <ErrorMessage name="username" component="div" />
              </div>
            </div>

            <div className={styles.passCont}>
              <label className={styles.login_label}>Password:</label>
              <div className={styles.inputWithIcon}>
                <Field
                  name="password"
                  autoComplete="current-password"
                  id="current-password"
                  placeholder="Password"
                  className={styles.login_input}
                  type="password"
                />
              </div>
              <div className={styles.errorMessage}>
                <ErrorMessage name="password" component="div" />
              </div>
            </div>
            <div className={styles.login_text}>
              <Link href="/auth/signup">Create Account</Link>
            </div>

            <button type="submit" className={styles.login_button}>
              Sign In
            </button>
          </Form>
        </Formik>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
}
