import React, { useEffect, useState } from "react";
import styles from "./id.module.css";
import "@/app/globals.css";
import NavBar from "@/components/navBar";
import DataTable from "@/components/table";
import axios from "axios";
import SearchIcon from "@/assets/icons/SearchIcon.svg";
import DeleteIcon from "@mui/icons-material/Delete";

import { useRouter } from "next/router";
type InstagramContent = {
  id: string;
  url: string;
  display_url: string;
  type: string;
  carousel: string;
  owner: string;
  description: string;
  likes: number;
  comments: number;
  views: number;
  categories: string;
};

type AccountList = (string | number | boolean | Array<string>)[];
type InstagramDataProps = {
  data: InstagramContent[];
};

export default function ContentID(props: any) {
  const [content, setContent] = useState([]);
  const [param, setUsername] = useState<string>("");
  const [responseStatus, setResponseStatus] = useState<string | null>(null);
  const router = useRouter();
  const [clickedCheckboxes, setClickedCheckboxes] = useState<string[]>([]);

  const { id } = router.query;
  useEffect(() => {
    fetchContent();
  }, [id]);
  const fetchContent = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/content/`,
        { timeout: 5000 }
      );
      if (res.status === 200) {
        setContent(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch content:", error);
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

  const handleDelete = () => {
    if (
      Array.isArray(clickedCheckboxes) &&
      clickedCheckboxes.length > 0 &&
      JSON.stringify(clickedCheckboxes) !== JSON.stringify(["all"])
    ) {
      clickedCheckboxes.forEach((id) => {
        if (id !== "all") {
          axios
            .delete(`${process.env.NEXT_PUBLIC_API_URL}/api/content/${id}/`)
            .then((res) => {
              if (res.status === 204) {
                fetchContent();
                setClickedCheckboxes([]);
              }
            });
        }
      });
    }
  };
  const transformDataToLists = (data: InstagramContent[]): AccountList[] => {
    return data.map((account) => [
      account.id,
      account.url,
      account.display_url,
      account.type,
      account.carousel.toString(),
      account.owner,
      account.description,
      account.likes,
      account.comments,
      account.views,
      parseCategories(account.categories), // Call a separate function to parse or return an empty string
    ]);
  };

  // Function to parse JSON or return an empty string
  const parseCategories = (categories: string): string | Array<string> => {
    try {
      const parsedData = JSON.parse(categories);
      return Array.isArray(parsedData) ? parsedData : "";
    } catch (error) {
      return "";
    }
  };
  const handleRefetch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Perform the API call with user input
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/content/`
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

  const accountLists = transformDataToLists(content);
  return (
    <main className={styles.main}>
      <NavBar />
      <div className={styles.container}>
        <div className={styles.secondContainer}>
          <div className={styles.functions}>
            <h2 className={styles.title}>Content</h2>
            <form className={styles.search_container}>
              <SearchIcon />
              <input type="text" placeholder="Search..." />
            </form>
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
                  id: "url",
                  label: "Url",
                },
                {
                  id: "display_url",
                  label: "Thumbnail",
                },
                {
                  id: "type",
                  label: "Type",
                },
                {
                  id: "carousel",
                  label: "Carousel",
                },
                {
                  id: "owner",
                  label: "Owner ID",
                },
                {
                  id: "description",
                  label: "Description",
                },
                {
                  id: "likes",
                  label: "Likes",
                },
                {
                  id: "comments",
                  label: "Comments",
                },
                {
                  id: "views",
                  label: "Views",
                },
                {
                  id: "categories",
                  label: "Categories",
                },
              ]}
              rows={accountLists}
              display={false}
              details={false}
              handleCheckboxChange={handleCheckboxChange}
              clickedCheckboxes={clickedCheckboxes}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
