import React, { useEffect } from "react";
import styles from "./id.module.css";
import "../../app/globals.css";
import NavBar from "@/components/navBar";
import DataTable from "../../components/table";
import axios from "axios";

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

type AccountList = (string | number | boolean)[];
type InstagramDataProps = {
  data: InstagramContent[];
};

export default function ContentID(props: any) {
  const [content, setContent] = React.useState([]);
  const [param, setUsername] = React.useState<string>("");
  const [categories, setCategories] = React.useState<string[]>([]);
  const [responseStatus, setResponseStatus] = React.useState<string | null>(
    null
  );
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    const fetchContent = async () => {
      if (id) {
        try {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/content/?owner=${id}`,
            { timeout: 5000 }
          );
          if (res.status === 200) {
            setContent(res.data);
          }
        } catch (error) {
          console.error("Failed to fetch content:", error);
        }
      }
    };

    fetchContent();
  }, [id]);
  console.log(content);
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
      account.categories,
      JSON.stringify(account.categories),
    ]);
  };

  const handleRefetch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Perform the API call with user input
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/content/?owner=${id}`
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
            <p>Search</p>
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
            />
          </div>
        </div>
      </div>
    </main>
  );
}
