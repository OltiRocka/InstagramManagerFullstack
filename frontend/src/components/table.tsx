import styles from "./table.module.css";
import React from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import IconButton from "@mui/material/IconButton";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import DeleteIcon from "@mui/icons-material/Delete";
import Image from "next/image";
import Link from "next/link";
interface DataTableProps {
  rows: any[][];
  columns: { id: string; label: string }[];
  display: boolean;
}

export default function DataTable(props: DataTableProps) {
  const { rows, columns, display } = props;
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [diplayRows, setDisplayRows] = React.useState(
    rows.slice(page, rowsPerPage)
  );
  const [clickedCheckboxes, setClickedCheckboxes] = React.useState<string[]>(
    []
  );

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
    console.log(clickedCheckboxes);
  };
  console.log(diplayRows);
  return (
    <div className={styles.table_container}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th} onClick={handleDelete}>
              <div className={styles.delete}>
                <DeleteIcon />
              </div>
            </th>
            {columns.map((column) => (
              <th key={column.id} className={styles.th}>
                {column.label}
              </th>
            ))}
            <th className={styles.th}>Details</th>
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
                    onChange={handleCheck}
                  />
                </td>
                {row.map((cell, index) => (
                  <td key={index} className={styles.td}>
                    {typeof cell === "string" &&
                    cell.includes("http") &&
                    display ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}/media/media/images/${row[1]}.jpg`}
                        alt={cell}
                        className={styles.image}
                      />
                    ) : typeof cell === "string" && cell.includes("http") ? (
                      <Link href={cell} style={{ color: "blue" }}>
                        Link
                      </Link>
                    ) : (
                      cell
                    )}
                  </td>
                ))}
                <td className={styles.td}>
                  <a href={`/content/${row[0]}`} style={{ color: "blue" }}>
                    <ExitToAppIcon />
                  </a>
                </td>
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
