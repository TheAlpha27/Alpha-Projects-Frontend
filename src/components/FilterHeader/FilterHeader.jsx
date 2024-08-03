/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import "./FilterHeader.css";
import Dropdown from "../Dropdown/Dropdown";
import {
  getAmountOptions,
  getCategoryOptions,
  getClientOptions,
  getLocationOptions,
  getProjectManagerOptions,
} from "../../utils/helper";

const FilterHeader = ({ data, setData, originalData }) => {
  const [filters, setFilters] = useState({
    location: "",
    category: "",
    client: "",
    amount: "",
    projectManager: "",
  });
  const [locationOptions, setLocationOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [amountOptions, setAmountOptions] = useState([]);
  const [clientOptions, setClientOptions] = useState([]);
  const [projectManagerOptions, setProjectManagerOptions] = useState([]);

  useEffect(() => {
    setLocationOptions(getLocationOptions(originalData));
    setCategoryOptions(getCategoryOptions(originalData));
    setClientOptions(getClientOptions(originalData));
    setAmountOptions(getAmountOptions(originalData));
    setProjectManagerOptions(getProjectManagerOptions(originalData));
  }, [originalData]);

  const handleFilterChange = () => {
    let tempData = [...originalData];
    if (filters.location != "") {
      tempData = tempData.filter((e) => e.city == filters.location);
    }
    if (filters.client != "") {
      tempData = tempData.filter((e) => e.client == filters.client);
    }
    if (filters.projectManager != "") {
      tempData = tempData.filter(
        (e) => e.project_manager == filters.projectManager
      );
    }
    if (filters.category != "") {
      tempData = tempData.filter((e) => e.project_category == filters.category);
    }
    if (filters.amount != "") {
      tempData = tempData.filter((e) => e.contract_amount == filters.amount);
    }
    setData(tempData);
  };

  const handleClear = () => {
    setFilters({
      location: "",
      client: "",
      projectManager: "",
      category: "",
      amount: "",
    });
  };

  useEffect(() => {
    handleFilterChange();
  }, [filters]);

  return (
    <div className="header-main">
      <Dropdown
        options={locationOptions}
        value={filters.location}
        onChange={(e) => {
          setFilters({ ...filters, location: e });
        }}
        search
        name="Location"
      />
      <Dropdown
        options={projectManagerOptions}
        value={filters.projectManager}
        onChange={(e) => {
          setFilters({ ...filters, projectManager: e });
        }}
        search
        name="Project Manager"
      />
      <Dropdown
        options={categoryOptions}
        value={filters.category}
        onChange={(e) => {
          setFilters({ ...filters, category: e });
        }}
        search
        name="Category"
      />
      <Dropdown
        options={clientOptions}
        value={filters.client}
        onChange={(e) => {
          setFilters({ ...filters, client: e });
        }}
        search
        name="Client"
      />
      <Dropdown
        options={amountOptions}
        value={filters.amount}
        onChange={(e) => {
          setFilters({ ...filters, amount: e });
        }}
        search
        name="Amount"
      />
      <div className="divider"></div>
      <button className="clear" onClick={handleClear}>
        Clear Filters
      </button>
    </div>
  );
};

export default FilterHeader;
