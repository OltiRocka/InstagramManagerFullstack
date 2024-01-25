import React from "react";
import styles from "./notifications.module.css";
import NavBar from "@/components/navBar";
import "@/app/globals.css";

export default function Notifications() {
  return (
    <main className={styles.main}>
      <NavBar></NavBar>
      <div className={styles.container}></div>
    </main>
  );
}
