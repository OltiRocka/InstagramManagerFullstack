"use client";
import styles from "./page.module.css";
import NavBar from "@/components/navBar";
export default function Home() {
  return (
    <main className={styles.main}>
      <NavBar></NavBar>
      <div className={styles.container}></div>
    </main>
  );
}
