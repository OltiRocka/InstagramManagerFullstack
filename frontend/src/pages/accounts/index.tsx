import React, { useEffect } from "react";
import styles from "./accounts.module.css";
import "../../app/globals.css";
import NavBar from "@/components/navBar";
import DataTable from "../../components/table";
import axios from "axios";

import { Modal, Box, Typography, TextField, Button } from "@mui/material";
type InstagramAccount = {
  id: string;
  username: string;
  is_private: string;
  bio: string;
  followers: number;
  following: number;
  profile_image: string;
  num_content: number;
  categories: string;
};

type AccountList = (string | number | boolean)[];
type InstagramDataProps = {
  data: InstagramAccount[];
};

export default function Accounts() {
  const [accounts, setAccounts] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [param, setUsername] = React.useState<string>("");
  const [categories, setCategories] = React.useState<string[]>([]);
  const [responseStatus, setResponseStatus] = React.useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchAccounts = async () => {
      const res = await axios.get("http://localhost:8000/api/users/", {
        timeout: 5000,
      });
      if (res.status === 200) {
        setAccounts(res.data);
      }
    };
    fetchAccounts();
  }, []);

  const transformDataToLists = (data: InstagramAccount[]): AccountList[] => {
    return data.map((account) => [
      account.id,
      account.username,
      account.is_private.toString(),
      account.bio,
      account.followers,
      account.following,
      account.profile_image,
      account.num_content,
      JSON.stringify(account.categories),
    ]);
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = { param, categories };
    // Perform the API call with user input
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/insta/username/`,
        data
      );

      // Check the response status
      if (response.status === 200) {
        setResponseStatus("success");
      } else {
        setResponseStatus("error");
        console.log(response.data);
      }
    } catch (error) {
      console.error("API call error:", error);
      setResponseStatus("error");
    }
  };

  const accountLists = transformDataToLists(accounts);
  console.log(accountLists);
  return (
    <main className={styles.main}>
      <NavBar />
      <div className={styles.container}>
        <div className={styles.secondContainer}>
          <h2 className={styles.title}>Accounts</h2>
          <div className={styles.functions}>
            <p>Search</p>
            <Button onClick={handleOpen}>Add</Button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={modalStyle}>
                <form onSubmit={handleSubmit}>
                  <Typography variant="h6" component="h2">
                    Add Instagram User
                  </Typography>

                  <TextField
                    label="Username"
                    type="text"
                    value={param}
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                    margin="normal"
                  />

                  <TextField
                    label="Categories"
                    type="text"
                    value={categories}
                    onChange={(e) => setCategories(e.target.value.split(","))}
                    fullWidth
                    margin="normal"
                  />

                  <Button type="submit" variant="contained" color="primary">
                    Submit
                  </Button>
                </form>
                {responseStatus === "success" && (
                  <Typography style={{ color: "green" }}>Success!</Typography>
                )}
                {responseStatus === "error" && (
                  <Typography style={{ color: "red" }}>Error!</Typography>
                )}
              </Box>
            </Modal>
          </div>
          <div className={styles.table_container}>
            <DataTable
              columns={[
                {
                  id: "id",
                  label: "ID",
                },
                {
                  id: "username",
                  label: "Username",
                },
                {
                  id: "is_private",
                  label: "Private",
                },
                {
                  id: "bio",
                  label: "Bio",
                },
                {
                  id: "followers",
                  label: "Followers",
                },
                {
                  id: "following",
                  label: "Following",
                },
                {
                  id: "profile_image",
                  label: "Profile Image",
                },
                {
                  id: "num_content",
                  label: "Content Amount",
                },
                {
                  id: "categories",
                  label: "Categories",
                },
              ]}
              rows={accountLists}
              display={true}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
