import React, { useEffect } from "react";
import styles from "./accounts.module.css";
import "../../app/globals.css";
import NavBar from "@/components/navBar";
import DataTable from "../../components/table";
import axios from "axios";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import SearchIcon from "@/assets/icons/SearchIcon.svg";
import { useRouter } from "next/router";
import CircularProgress from "@mui/material/CircularProgress";

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
  const [loading, setLoading] = React.useState<boolean>(false);

  const router = useRouter();
  useEffect(() => {
    const fetchAccounts = async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/`,
        {
          timeout: 5000,
        }
      );
      if (res.status === 200) {
        setAccounts(res.data);
      }
    };
    fetchAccounts();
  }, []);

  const transformDataToLists = (data: InstagramAccount[]): AccountList[] => {
    return data.map((account) => [
      account.id,
      account.profile_image,
      account.username,
      account.bio,
      account.followers,
      account.following,
      account.num_content,
      JSON.parse(account.categories),
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
  const fetchAccounts = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/`,
      {
        timeout: 5000,
      }
    );
    if (res.status === 200) {
      setAccounts(res.data);
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const data = { param, categories };
    // Perform the API call with user input
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/insta/username/`,
        data
      );

      // Check the response status
      if (response.status === 200) {
        setLoading(false);
        setResponseStatus("success");
        fetchAccounts();
      } else {
        setLoading(false);
        setResponseStatus("error");
      }
    } catch (error) {
      setLoading(false);
      console.error("API call error:", error);
      setResponseStatus("error");
    }
  };
  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = { param };
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
      }
    } catch (error) {
      console.error("API call error:", error);
      setResponseStatus("error");
    }
  };
  const accountLists = transformDataToLists(accounts);
  return (
    <main className={styles.main}>
      <NavBar />
      <div className={styles.container}>
        <div className={styles.secondContainer}>
          <h2 className={styles.title}>Accounts</h2>
          <div className={styles.functions}>
            <form className={styles.search_container} onSubmit={handleSearch}>
              <SearchIcon />
              <input type="text" placeholder="Search..." />
            </form>
            <Button onClick={handleOpen}>
              <AddCircleOutlineIcon />
            </Button>
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
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "90%",
                    }}
                  >
                    <Button type="submit" variant="contained" color="primary">
                      Submit
                    </Button>
                    {responseStatus === "success" && loading === false && (
                      <Typography style={{ color: "green" }}>
                        Success!
                      </Typography>
                    )}
                    {responseStatus === "error" && loading === false && (
                      <Typography style={{ color: "red" }}>Error!</Typography>
                    )}
                    {loading && (
                      <CircularProgress
                        size={24}
                        className={styles.buttonProgress}
                      />
                    )}
                  </div>
                </form>
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
                  id: "profile_image",
                  label: "Profile Picture",
                },
                {
                  id: "username",
                  label: "Username",
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
                  id: "num_content",
                  label: "Content",
                },
                {
                  id: "categories",
                  label: "Categories",
                },
              ]}
              rows={accountLists}
              display={true}
              details={true}
              endpoint="/api/users/"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
