import React, { useEffect } from "react";
import styles from "./id.module.css";
import "../../app/globals.css";
import NavBar from "@/components/navBar";
import DataTable from "../../components/table";
import axios from "axios";
import SearchIcon from "@/assets/icons/SearchIcon.svg";

import { Button } from "@mui/material";
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
  const [content, setContent] = React.useState([]);
  const [param, setUsername] = React.useState<string>("");
  const [responseStatus, setResponseStatus] = React.useState<string | null>(
    null
  );
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
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

    fetchContent();
  }, [id]);
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
          <h2 className={styles.title}>Content</h2>
          <div className={styles.functions}>
            <form className={styles.search_container}>
              <SearchIcon />
              <input type="text" placeholder="Search..." />
            </form>
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
              endpoint="/api/content/"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
