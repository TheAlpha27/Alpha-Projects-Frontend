import React, { useState, useEffect } from "react";
import Table from "../Table/Table";
import "./Project.css";
import moment from "moment";

const Project = (fullData) => {
  const userColumns = [
    {
      columnName: "Project Name",
      key: "ProjectName",
      width: "20%",
      signal: true,
    },
    { columnName: "City", key: "City", width: "10%" },
    { columnName: "Project Manager", key: "ProjectManager", width: "15%" },
    { columnName: "Category", key: "category", width: "20%" },
    { columnName: "Date Added", key: "dateAdded", width: "10%" },
    { columnName: "Contract Amt", key: "ContractAmount", width: "10%" },
    { columnName: "Client", key: "Client", width: "15%" },
  ];

  const createUserTableData = (data) => {
    const tempData1 = [];
    data.forEach((e) => {
      const tempObj1 = {};
      tempObj1.ProjectName = {
        value: e.project_name,
        type: "string",
      };
      tempObj1.City = {
        value: e.city,
        type: "string",
      };
      tempObj1.ProjectManager = {
        value: e.project_manager,
        type: "string",
      };
      tempObj1.category = {
        value: e.project_category,
        type: "string",
      };
      tempObj1.dateAdded = {
        value: moment(e.date_added).format("MMM Do YYYY"),
        type: "string",
      };
      tempObj1.ContractAmount = {
        value: e.contract_amount,
        type: "string",
      };
      tempObj1.Client = {
        value: e.client,
        type: "string",
      };
      tempData1.push(tempObj1);
    });
    return tempData1;
  };

  const [requiredData, setRequiredData] = useState([]);
  useEffect(() => {
    setRequiredData(createUserTableData(fullData.fullData));
  }, []);
  return (
    <Table
      type={"project"}
      checkbox={false}
      columns={userColumns}
      data={requiredData}
      name={"Projects"}
    />
  );
};

export default Project;
