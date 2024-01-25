import React, { useEffect, useState } from "react";
import styles from "./users.module.css";
import "@/app/globals.css";
import NavBar from "@/components/navBar";
import DataTable from "@/components/table";
import axios from "axios";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import SearchIcon from "@/assets/icons/SearchIcon.svg";
import { useRouter } from "next/router";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";

// TODO: Add the DeleteIcon with stateManagment
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
type AccountList = (string | number | boolean | Array<string>)[];

export default function Accounts() {
  const [accountLists, setAccounts] = useState<AccountList[]>([[]]);
  const [open, setOpen] = useState(false);
  const [param, setUsername] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [responseStatus, setResponseStatus] = useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [clickedCheckboxes, setClickedCheckboxes] = useState<string[]>([]);

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
        transformDataToLists(res.data);
      }
    };
    fetchAccounts();
  }, []);

  const transformDataToLists = (data: InstagramAccount[]) => {
    setAccounts(
      data.map((account) => [
        account.id,
        account.profile_image,
        account.username,
        account.bio,
        account.followers,
        account.following,
        account.num_content,
        parseCategories(account.categories),
      ])
    );
  };

  const parseCategories = (categories: string): string | Array<string> => {
    try {
      const parsedData = JSON.parse(categories);
      return Array.isArray(parsedData) ? parsedData : "";
    } catch (error) {
      return "";
    }
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
      transformDataToLists(res.data);
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

  const handleDelete = () => {
    if (
      Array.isArray(clickedCheckboxes) &&
      clickedCheckboxes.length > 0 &&
      JSON.stringify(clickedCheckboxes) !== JSON.stringify(["all"])
    ) {
      clickedCheckboxes.forEach((id) => {
        if (id !== "all") {
          axios
            .delete(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}/`)
            .then((res) => {
              if (res.status === 204) {
                fetchAccounts();
                setClickedCheckboxes([]);
              }
            });
        }
      });
    }
  };

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    rows: any[][]
  ) => {
    const checkboxId = event.target.id;
    if (event.target.checked) {
      if (checkboxId === "all") {
        setClickedCheckboxes(rows.map((item) => item[0]));
        setClickedCheckboxes((prevState) => [...prevState, "all"]);
      } else {
        setClickedCheckboxes((prevState) => [...prevState, checkboxId]);
      }
    } else {
      if (checkboxId === "all") {
        setClickedCheckboxes([]);
      } else {
        setClickedCheckboxes((prevState) =>
          prevState.filter((id) => id !== checkboxId)
        );
      }
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
  return (
    <main className={styles.main}>
      <NavBar />
      <div className={styles.container}>
        <div className={styles.secondContainer}>
          <div className={styles.functions}>
            <h2 className={styles.title}>Users</h2>
            <form className={styles.search_container} onSubmit={handleSearch}>
              <SearchIcon />
              <input type="text" placeholder="Search..." />
            </form>
            <Button onClick={() => setOpen(true)}>
              <AddCircleOutlineIcon />
            </Button>
            <Modal
              open={open}
              onClose={() => setOpen(false)}
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
                      <Alert
                        icon={<CheckIcon fontSize="inherit" />}
                        severity="success"
                      >
                        Success!
                      </Alert>
                    )}
                    {responseStatus === "error" && loading === false && (
                      <Alert severity="error">Error</Alert>
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
            <DeleteIcon
              onClick={handleDelete}
              style={
                clickedCheckboxes.length > 0 &&
                JSON.stringify(clickedCheckboxes) !== JSON.stringify(["all"])
                  ? { color: "red", cursor: "pointer" }
                  : { color: "lightgrey" }
              }
            />
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
              handleCheckboxChange={handleCheckboxChange}
              clickedCheckboxes={clickedCheckboxes}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
