import React from "react";
import styles from "./profile.module.css";
import NavBar from "@/components/navBar";
import "@/app/globals.css";

export default function Profile() {
  return (
    <main className={styles.main}>
      <NavBar></NavBar>
      <div className={styles.container}></div>
    </main>
  );
}
