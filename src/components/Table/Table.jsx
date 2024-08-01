/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import "./Table.css";
import Search from "../../icons/assets/search.svg";
import Dropdown from "../Dropdown/Dropdown";
import { ProjectStatus, UserStatus, UserTypes } from "../../utils/constants";

const userTypeOptions = [
  { value: UserTypes.guest, bgColor: "#DFEBFD", textColor: "#4C6FA5" },
  { value: UserTypes.user, bgColor: "#F0E3FD", textColor: "#784CA5" },
  { value: UserTypes.admin, bgColor: "#FEF2EF", textColor: "#E07529" },
];

const userStatusOptions = [
  { value: UserStatus.active, bgColor: "#EFFEFA", textColor: "#13A579" },
  { value: UserStatus.inactive, bgColor: "#FFF1F1", textColor: "#D93838" },
];

const projectStatusOptions = [
  { value: ProjectStatus.notStarted, bgColor: "#DFEBFD", textColor: "#4C6FA5" },
  { value: ProjectStatus.inProgress, bgColor: "#F0E3FD", textColor: "#784CA5" },
  { value: ProjectStatus.completed, bgColor: "#FEF2EF", textColor: "#E07529" },
];

const Chip = ({ value, options, onChange, email, updateType }) => {
  const [showOptions, setShowOptions] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const getBgColor = () => {
    const bgColor = options.filter((e) => e.value === value)[0].bgColor;
    return bgColor;
  };
  const getTextColor = () => {
    const textColor = options.filter((e) => e.value === value)[0].textColor;
    return textColor;
  };
  return (
    <div
      className="chipContainer pointer"
      onClick={() => setShowOptions(!showOptions)}
      style={{ backgroundColor: `${getBgColor()}`, color: `${getTextColor()}` }}
      ref={menuRef}
    >
      <div>{value}</div>
      {showOptions && (
        <div className="optionContainer">
          {options.map((e, index) => {
            return (
              <div
                key={index}
                style={{
                  backgroundColor: `${e.bgColor}`,
                  color: `${e.textColor}`,
                }}
                className="option"
                onClick={() => {
                  setShowOptions(!showOptions);
                  onChange({ userUpdates: [{ email, [updateType]: e.value }] });
                }}
              >
                {e.value}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const Table = ({
  type,
  columns,
  data,
  itemsPerPage = 5,
  checkbox,
  onUserTypeChange,
  onUserStatusChange,
}) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(false);

  useEffect(() => {
    const getStatusFromSelectedRows = () => {
      if (selectedRows.length === 0) {
        return false;
      }
      if (selectedRows.length >= 1) {
        return true;
      }
    };

    const newStatus = getStatusFromSelectedRows();
    setSelectedStatus(newStatus);
  }, [selectedRows]);

  const handleCheckboxChange = (row) => {
    if (selectedRows.includes(row)) {
      setSelectedRows(
        selectedRows.filter((selectedRow) => selectedRow !== row)
      );
    } else {
      setSelectedRows([...selectedRows, row]);
    }
  };
  const getDropdownOptions = () => {
    return ["Admin", "Guest", "User"];
  };
  const getDropdownOptions1 = () => {
    return ["Active", "Inactive"];
  };

  const handleUpdateType = (selectedOption) => {
    const emails = selectedRows.map((selectedRow) => selectedRow?.Email?.value);
    if (emails.length > 0) {
      setSelectedRows([]);
      const payload = {
        userUpdates: emails.map((email) => ({ email, type: selectedOption })),
      };
      onUserTypeChange(payload);
    } else {
      console.error("Emails not found in selected rows.");
    }
  };

  const handleUpdateStatus = (selectedOption) => {
    const emails = selectedRows.map((selectedRow) => selectedRow?.Email?.value);
    if (emails.length > 0) {
      setSelectedRows([]);
      const payload = {
        userUpdates: emails.map((email) => ({ email, status: selectedOption })),
      };
      onUserStatusChange(payload);
    } else {
      console.error("Emails not found in selected rows.");
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filteredData = data.filter((row) => {
    if (type === "user") {
      return (
        row.Full_Name.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.Email.value.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      return row.ProjectName.value
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    }
  });
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredData.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (pageNumber) => {
    if (
      pageNumber >= 1 &&
      pageNumber <= Math.ceil(filteredData.length / itemsPerPage)
    )
      setCurrentPage(pageNumber);
  };
  return (
    <div className="table">
      <div className="tableOverHead">
        {type === "user" ? "All Users" : "Projects"}
      </div>
      <div className="inputs" style={{ gap: "20px" }}>
        <div className="showProjects">
          <img className="info" src={Search} alt="" />
          <input
            className="fields"
            type="text"
            placeholder={
              type === "user" ? "Search Name or Email" : "Search Project Name"
            }
            style={{ borderLeft: "none", borderRight: "none", size: "14px" }}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        {type === "user" && (
          <>
            <Dropdown
              options={getDropdownOptions().map((value) => ({
                label: value,
                value,
              }))}
              onChange={(selectedOption) => handleUpdateType(selectedOption)}
              disable={!selectedStatus}
              name={"Update Type"}
              flowtype={"user"}
            />
            <Dropdown
              options={getDropdownOptions1().map((value) => ({
                label: value,
                value,
              }))}
              onChange={(selectedOption) => handleUpdateStatus(selectedOption)}
              disable={!selectedStatus}
              name={"Update Status"}
              flowtype={"user"}
            />
          </>
        )}
      </div>
      {type === "user" ? (
        <table cellSpacing="0" cellPadding="0">
          <thead>
            <tr>
              {checkbox && <th className="table-head"></th>}
              {columns.map((column) => (
                <th
                  style={{
                    textAlign: "start",
                  }}
                  className="table-head"
                  key={column.key}
                >
                  {column.columnName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={rowIndex % 2 === 0 ? "even-row" : "odd-row"}
              >
                {checkbox && (
                  <td
                    className="table-data"
                    style={{ padding: "0px 20px 0px 20px" }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row)}
                      onChange={() => handleCheckboxChange(row)}
                    />
                  </td>
                )}
                {columns.map((column) => {
                  return (
                    <td
                      style={{
                        width: `${column.width}`,
                      }}
                      className="table-data"
                      key={column.key}
                    >
                      {row[column.key] &&
                      row[column.key].type === "typeChip" ? (
                        <Chip
                          value={row[column.key].value}
                          options={userTypeOptions}
                          onChange={row[column.key].onChange}
                          email={row.Email.value}
                          updateType="type"
                        />
                      ) : row[column.key].type === "statusChip" ? (
                        <Chip
                          value={row[column.key].value}
                          options={userStatusOptions}
                          onChange={row[column.key].onChange}
                          email={row.Email.value}
                          updateType="status"
                        />
                      ) : (
                        row[column.key]?.value
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <table cellSpacing="0" cellPadding="0" style={{ width: "91.8vw" }}>
          <div className="ActualTableDiv">
            <thead>
              <tr style={{ position: "relative", backgroundColor: "white" }}>
                {columns.map((column, index) => {
                  return (
                    <th
                      style={{
                        textAlign: "start",
                        position: index === 0 && "sticky",
                        paddingLeft: "1.5%",
                        backgroundColor: "white",
                        left: 0,
                        borderRight: index === 0 && "1px solid gray",
                        width: "200px",
                      }}
                      className="table-head"
                      key={column.key}
                    >
                      {column.columnName}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={rowIndex % 2 === 0 ? "odd-row" : "even-row"}
                  style={{
                    weight: "400px",
                    height: "5rem",
                  }}
                >
                  {columns.map((column, index) => {
                    return (
                      <td
                        style={{
                          minWidth: "190px",
                          backgroundColor: index === 0 && "white",
                          position: index === 0 && "sticky",
                          paddingLeft: "1.5%",
                          left: 0,
                          fontWeight:
                            index === 0 || index === 5 ? "800" : "100",
                          borderRight: index === 0 && "1px solid gray",
                        }}
                        className="table-data"
                        key={column.key}
                      >
                        {row[column.key]?.value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </div>
        </table>
      )}
      <div className="pagination">
        <div className="numbers">
          <div
            className="prev pointer"
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Prev
          </div>
          {pageNumbers.map((number) => (
            <div className="number" key={number}>
              <button
                className="numberBtn"
                style={
                  currentPage === number
                    ? { backgroundColor: "#F16524", color: "#fff" }
                    : {}
                }
                onClick={() => handlePageChange(number)}
              >
                {number}
              </button>
            </div>
          ))}
          <div
            className="next pointer"
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
