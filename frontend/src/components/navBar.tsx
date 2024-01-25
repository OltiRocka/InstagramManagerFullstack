"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "./navBar.module.css";
import Image from "next/image";

import {
  NotificationsOutlined,
  PieChartOutlineOutlined,
  ContactPageOutlined,
  InsertChartOutlined,
  GroupOutlined,
  SpaceDashboardOutlined,
  LogoutOutlined,
  SearchOutlined,
  VideoCameraBackOutlined,
} from "@mui/icons-material";
import useHover from "@/hooks/useHover";
import { logoutUser } from "@/stores/auth";
import { useRouter } from "next/navigation";

const NavBar = () => {
  const { hovered, eventHandlers } = useHover();
  const [user, setUser] = useState({
    first_name: "John",
    last_name: "Doe",
    email: "john@doe.com",
    profile_image: `${process.env.NEXT_PUBLIC_API_URL}/media/profile_image/default.png`,
  });
  useEffect(() => {
    const userDataString = window.localStorage.getItem("userData");
    if (userDataString !== null) {
      setUser(JSON.parse(userDataString));
    }
  }, []);

  const router = useRouter();
  const handleLogout = async () => {
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
            src={user.profile_image}
            width={90}
            height={90}
            alt="ProfileImage"
            className={styles.profilePic}
          />
          {hovered ? (
            <div className={styles.personalInfo}>
              <h3>
                {user.first_name} {user.last_name}
              </h3>
              <p>{user.email}</p>
            </div>
          ) : (
            []
          )}
        </Link>
        <form className={styles.search_container}>
          <SearchOutlined />
          <input type="text" placeholder="Search..." />
        </form>
        <div className={styles.content}>
          <Link href="/" className={styles.element}>
            <SpaceDashboardOutlined />
            <p
              className={`${styles.text} ${
                hovered ? styles.active : styles.null
              }`}
            >
              Dashboard
            </p>
          </Link>
          <Link href="/revenue" className={styles.element}>
            <InsertChartOutlined />
            <p
              className={`${styles.text} ${
                hovered ? styles.active : styles.null
              }`}
            >
              Revenue
            </p>
          </Link>
          <Link href="/notifications" className={styles.element}>
            <NotificationsOutlined />
            <p
              className={`${styles.text} ${
                hovered ? styles.active : styles.null
              }`}
            >
              Notifications
            </p>
          </Link>
          <Link href="/analytics" className={styles.element}>
            <PieChartOutlineOutlined />
            <p
              className={`${styles.text} ${
                hovered ? styles.active : styles.null
              }`}
            >
              Analytics
            </p>
          </Link>

          <Link href="/accounts" className={styles.element}>
            <GroupOutlined />
            <p
              className={`${styles.text} ${
                hovered ? styles.active : styles.null
              }`}
            >
              Accounts
            </p>
          </Link>
          <Link href="/users" className={styles.element}>
            <ContactPageOutlined />
            <p
              className={`${styles.text} ${
                hovered ? styles.active : styles.null
              }`}
            >
              Users
            </p>
          </Link>
          <Link href="/content" className={styles.element}>
            <VideoCameraBackOutlined />
            <p
              className={`${styles.text} ${
                hovered ? styles.active : styles.null
              }`}
            >
              Content
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
          <LogoutOutlined />
          <p
            className={`${styles.text} ${
              hovered ? styles.active : styles.null
            }`}
          >
            Logout
          </p>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
