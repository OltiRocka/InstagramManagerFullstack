import React from "react";
import styles from "./accounts.module.css";
import "../../app/globals.css";
import NavBar from "@/components/navBar";

export default function Accounts() {
  return (
    <main className={styles.main}>
      <NavBar></NavBar>
      <div className={styles.container}></div>
    </main>
  );
}
