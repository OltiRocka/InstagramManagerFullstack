"use client";
import Link from "next/link";
import React from "react";
import styles from "./navBar.module.css";
import Image from "next/image";
import BellIcon from "@/assets/icons/BellIcon.svg";
import BoxIcon from "@/assets/icons/BoxIcon.svg";
import ChartIcon from "@/assets/icons/ChartIcon.svg";
import GraphIcon from "@/assets/icons/GraphIcon.svg";
import HomeIcon from "@/assets/icons/HomeIcon.svg";
import LogIcon from "@/assets/icons/LogIcon.svg";
import SearchIcon from "@/assets/icons/SearchIcon.svg";
import profilePic from "@/assets/images/profile.png";
import useHover from "@/hooks/useHover";
import { logoutUser } from "@/stores/auth";
import Switch from "./Switch";
import { useRouter } from "next/navigation";
const NavBar = () => {
  const { hovered, eventHandlers } = useHover();
  const router = useRouter();

  const handleLogout = async () => {
    console.log("logout");
    try {
      await logoutUser();
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <div className={styles.container} {...eventHandlers}>
      <div className={styles.top_container}>
        <Link className={styles.header_container} href={"/profile"}>
          <Image
            src={profilePic}
            width={90}
            height={90}
            alt="ProfileImage"
            className={styles.profilePic}
          />
          {hovered ? (
            <div className={styles.personalInfo}>
              <h3>Olti Roka</h3>
              <p>olti@roka.dev</p>
            </div>
          ) : (
            []
          )}
        </Link>
        <form className={styles.search_container}>
          <SearchIcon />
          <input type="text" placeholder="Search..." />
        </form>
        <div className={styles.content}>
          <Link href="/" className={styles.element}>
            <HomeIcon />
            <p
              className={`${styles.text} ${
                hovered ? styles.active : styles.null
              }`}
            >
              Dashboard
            </p>
          </Link>
          <Link href="/revenue" className={styles.element}>
            <GraphIcon />
            <p
              className={`${styles.text} ${
                hovered ? styles.active : styles.null
              }`}
            >
              Revenue
            </p>
          </Link>
          <Link href="/notifications" className={styles.element}>
            <BellIcon />
            <p
              className={`${styles.text} ${
                hovered ? styles.active : styles.null
              }`}
            >
              Notifications
            </p>
          </Link>
          <Link href="/analytics" className={styles.element}>
            <ChartIcon />
            <p
              className={`${styles.text} ${
                hovered ? styles.active : styles.null
              }`}
            >
              Analytics
            </p>
          </Link>
          <Link href="/accounts" className={styles.element}>
            <BoxIcon />
            <p
              className={`${styles.text} ${
                hovered ? styles.active : styles.null
              }`}
            >
              Accounts
            </p>
          </Link>
        </div>
      </div>
      <div className={styles.content}>
        <div
          onClick={handleLogout}
          className={styles.element}
          style={{ cursor: "pointer" }}
        >
          <LogIcon />
          <p
            className={`${styles.text} ${
              hovered ? styles.active : styles.null
            }`}
          >
            Logout
          </p>
        </div>
        <div className={styles.night_mode}>
          <Switch />
        </div>
      </div>
    </div>
  );
};

export default NavBar;