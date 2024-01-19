import SunIcon from "@/assets/icons/SunIcon.svg";
import MoonIcon from "@/assets/icons/MoonIcon.svg";
import React from "react";
import styles from "./switch.module.css";
const Switch = () => {
  const [nightMode, setNightMode] = React.useState(false);
  return (
    <div
      className={styles.switch}
      onClick={() => {
        setNightMode(!nightMode);
        localStorage.setItem("nightMode", nightMode.toString());
      }}
      style={
        !nightMode
          ? { backgroundColor: "#1F1F22" }
          : { backgroundColor: "#C8BCF6" }
      }
    >
      <div
        style={
          !nightMode
            ? {
                transform: "translateX(100%)",
                backgroundColor: "#C8BCF6",
                border: "2px solid #1F1F22",
              }
            : {
                transform: "translateX(0%)",
                backgroundColor: "#1F1F22",
                border: "2px solid #C8BCF6",
              }
        }
      >
        {!nightMode ? <SunIcon /> : <MoonIcon />}
      </div>
    </div>
  );
};

export default Switch;
