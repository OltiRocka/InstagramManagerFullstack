import styles from "./table.module.css";
import React from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import IconButton from "@mui/material/IconButton";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import DeleteIcon from "@mui/icons-material/Delete";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
interface DataTableProps {
  rows: any[][];
  columns: { id: string; label: string }[];
  display: boolean;
  details: boolean;
  endpoint: string;
}

export default function DataTable(props: DataTableProps) {
  const { rows, columns, display, details, endpoint } = props;
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [diplayRows, setDisplayRows] = React.useState(
    rows.slice(page, rowsPerPage)
  );
  const [clickedCheckboxes, setClickedCheckboxes] = React.useState<string[]>(
    []
  );
  const router = useRouter();
  React.useEffect(() => {
    setDisplayRows(
      rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    );
  }, [rows, page, rowsPerPage]);

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checkboxId = event.target.id;
    if (event.target.checked) {
      setClickedCheckboxes((prevState) => [...prevState, checkboxId]);
    } else {
      setClickedCheckboxes((prevState) =>
        prevState.filter((id) => id !== checkboxId)
      );
    }
  };

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
    setDisplayRows(
      rows.slice(newPage * rowsPerPage, newPage * rowsPerPage + rowsPerPage)
    );
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setDisplayRows(rows.slice(0, event.target.value));
  };
  const handleDelete = () => {
    if (Array.isArray(clickedCheckboxes) && clickedCheckboxes.length > 0) {
      clickedCheckboxes.forEach((id) => {
        axios
          .delete(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}${id}/`)
          .then((res) => {
            if (res.status === 204) {
              console.log("Deleted");
              router.reload();
            }
          });
      });
    }
  };
  const tag_colors = ["#D8FAD1", "#FAD8D1", "#CFDEFC", "#FCCFF5"];
  return (
    <div className={styles.table_container}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th} onClick={handleDelete}>
              <DeleteIcon className={styles.delete} />
            </th>
            {columns.map((column) => (
              <th key={column.id} className={styles.th}>
                {column.label}
              </th>
            ))}
            {details ? (
              <th className={styles.th}>Details</th>
            ) : (
              <th className={styles.th} style={{ display: "none" }}></th>
            )}
          </tr>
        </thead>
        <tbody>
          {diplayRows &&
            diplayRows.length > 0 &&
            diplayRows.map((row, index) => (
              <tr key={row[0]} className={styles.tr}>
                <td className={styles.td}>
                  <input
                    className={styles.checkbox}
                    type="checkbox"
                    id={row[0]}
                    checked={clickedCheckboxes.includes(row[0])}
                    onChange={handleCheck}
                  />
                </td>
                {row.map((cell, index) => (
                  <td key={index} className={styles.td}>
                    {typeof cell === "string" &&
                    cell.includes("http") &&
                    display ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}/media/media/images/${row[2]}.jpg`}
                        alt={cell}
                        className={styles.image}
                      />
                    ) : typeof cell === "string" && cell.includes("http") ? (
                      <Link href={cell} style={{ color: "#1976d2" }}>
                        Link
                      </Link>
                    ) : Array.isArray(cell) ? (
                      <div className={styles.cell_container}>
                        {cell.map((item, index) => (
                          <div
                            className={styles.cell_type}
                            style={{ backgroundColor: tag_colors[index % 4] }}
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    ) : (
                      cell
                    )}
                  </td>
                ))}

                {details ? (
                  <td className={styles.td}>
                    <a href={`/content/${row[0]}`} style={{ color: "blue" }}>
                      <ExitToAppIcon />
                    </a>
                  </td>
                ) : (
                  <td className={styles.td} style={{ display: "none" }}></td>
                )}
              </tr>
            ))}
        </tbody>
      </table>
      <div className={styles.tfoot}>
        <div className={styles.pagination}>
          <p>Rows per page:</p>
          <select name="" id="" onChange={handleChangeRowsPerPage}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        <p>
          {page * rowsPerPage + 1} -{" "}
          {rows.length < (page + 1) * rowsPerPage
            ? rows.length
            : (page + 1) * rowsPerPage}{" "}
          of {rows.length}
        </p>
        <div className={styles.buttons}>
          <IconButton
            onClick={(e) => {
              if (page > 0) {
                handleChangePage(e, page - 1); // Decrement the page
              }
            }}
            style={{ cursor: page > 0 ? "pointer" : "not-allowed" }}
          >
            <NavigateBeforeIcon />
          </IconButton>
          <IconButton
            onClick={(e) => {
              if ((page + 1) * rowsPerPage < rows.length) {
                handleChangePage(e, page + 1); // Increment the page
              }
            }}
            style={{
              cursor:
                (page + 1) * rowsPerPage < rows.length
                  ? "pointer"
                  : "not-allowed",
            }}
          >
            <NavigateNextIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
