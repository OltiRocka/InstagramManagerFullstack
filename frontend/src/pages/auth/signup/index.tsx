import React from "react";
import styles from "./signup.module.css";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import { Formik, Form, Field } from "formik";
import { signupUser } from "@/stores/auth";
import { useRouter } from "next/navigation";
import "@/app/globals.css";
import "react-toastify/dist/ReactToastify.css";

export default function Signup() {
  const router = useRouter();

  const handleSubmit = async (
    values: {
      email: string;
      password: string;
      first_name: string;
      last_name: string;
    },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      const signupData = {
        email: values.email,
        password: values.password,
        first_name: values.first_name,
        last_name: values.last_name,
      };

      const result = await signupUser(signupData);

      if (result && result.success) {
        toast.success("Signup successful");
        router.push("/auth/login");
      } else {
        console.error("Signup failed:", result?.error);

        let errorMessage = "Signup failed for unknown reasons";

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
          first_name: "",
          last_name: "",
        }}
        onSubmit={handleSubmit}
      >
        <Form className={styles.login_form}>
          <div className={styles.header}>
            <h2 className={styles.login_maintext}>Create a new Account</h2>
            <p className={styles.login_maindesc}>
              Manage what is going on with your Socials
            </p>
          </div>
          <div className={styles.input_container}>
            <label className={styles.input_label}>First Name</label>
            <Field
              type="text"
              name="first_name"
              autoComplete="on"
              placeholder="John"
              className={styles.input}
            />
          </div>
          <div className={styles.input_container}>
            <label className={styles.input_label}>Last Name</label>
            <Field
              type="text"
              name="last_name"
              autoComplete="on"
              placeholder="Doe"
              className={styles.input}
            />
          </div>
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
            <Link href="/auth/login" className={styles.link}>
              Already have an Account?
            </Link>
          </div>

          <button type="submit" className={styles.login_button}>
            Signup
          </button>
        </Form>
      </Formik>
      <ToastContainer position="top-center" />
    </div>
  );
}
