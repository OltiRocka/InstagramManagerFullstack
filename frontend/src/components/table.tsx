import styles from "./table.module.css";
import React, { useEffect, useState } from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import IconButton from "@mui/material/IconButton";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
interface DataTableProps {
  rows: any[][];
  columns: { id: string; label: string }[];
  display: boolean;
  details: boolean;
  clickedCheckboxes: string[];
  handleCheckboxChange: any;
}

export default function DataTable(props: DataTableProps) {
  const {
    rows,
    columns,
    display,
    details,
    handleCheckboxChange,
    clickedCheckboxes,
  } = props;
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [diplayRows, setDisplayRows] = useState(rows.slice(page, rowsPerPage));

  useEffect(() => {
    setDisplayRows(
      rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    );
  }, [rows, page, rowsPerPage]);

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

  const tag_colors = ["#D8FAD1", "#FAD8D1", "#CFDEFC", "#FCCFF5"];
  return (
    <div className={styles.table_container}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr key="headerRow">
            <th className={styles.th} key="delete-icon">
              <input
                className={styles.checkbox}
                type="checkbox"
                id="all"
                checked={clickedCheckboxes.includes("all")}
                onChange={(e) => handleCheckboxChange(e, rows)}
              />
            </th>
            {columns.map((column) => (
              <th key={column.id} className={styles.th}>
                {column.label}
              </th>
            ))}
            {details ? (
              <th key={1001} className={styles.th}>
                Details
              </th>
            ) : (
              <th
                key={1001}
                className={styles.th}
                style={{ display: "none" }}
              ></th>
            )}
          </tr>
        </thead>
        <tbody>
          {diplayRows &&
            diplayRows.length > 0 &&
            diplayRows.map((row, rowIndex) => (
              <tr key={`rowi-${row[0]}`} className={styles.tr}>
                <td className={styles.td} key={`checkbox-${row[0]}`}>
                  <input
                    className={styles.checkbox}
                    type="checkbox"
                    id={row[0]}
                    checked={
                      clickedCheckboxes.includes("all") ||
                      clickedCheckboxes.includes(row[0])
                    }
                    onChange={(e) => handleCheckboxChange(e, rows)}
                  />
                </td>
                {row.map((cell, cellIndex) => (
                  <td key={`${rowIndex}-${cellIndex}`} className={styles.td}>
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
                            key={`divkey-${index}`}
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
                  <td className={styles.td} key={20000}>
                    <a href={`/content/${row[0]}`} style={{ color: "blue" }}>
                      <ExitToAppIcon />
                    </a>
                  </td>
                ) : (
                  <td
                    key={2000}
                    className={styles.td}
                    style={{ display: "none" }}
                  ></td>
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
