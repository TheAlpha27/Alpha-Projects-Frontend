import React, { useState, useEffect } from "react";
import "./FilterDropdown.css";
import downGray from "../../icons/downGray.svg";
import Filter from "../../icons/assets/filter.svg";
import Slider from "react-slider";

const FilterDropdown = ({ data, onApplyFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [uniqueCities, setUniqueCities] = useState(new Set());
  const [uniqueClasses, setUniqueClasses] = useState(new Set());
  const [uniqueProjectManagers, setUniqueProjectManagers] = useState(new Set());
  const [selectedItems, setSelectedItems] = useState({});
  const [values, setValues] = useState([0, 25000]);
  const minValue = 0;
  const maxValue = 25000;

  useEffect(() => {
    data.forEach((item) => {
      if (item.City.value !== "") {
        setUniqueCities((prevSet) => new Set([...prevSet, item.City.value]));
      }
      if (item.Class.value !== "") {
        setUniqueClasses((prevSet) => new Set([...prevSet, item.Class.value]));
      }
      if (item.ProjectManager.value !== "") {
        setUniqueProjectManagers(
          (prevSet) => new Set([...prevSet, item.ProjectManager.value])
        );
      }
    });
  }, [data]);

  const handleClick = (category, value) => {
    setSelectedItems((prevSelectedItems) => ({
      ...prevSelectedItems,
      [category]: value,
    }));
  };
  const handleChange = (newValues) => {
    setValues(newValues);
  };

  const clearFilters = () => {
    setSelectedItems({});
    setValues([0, 25000]);
  };

  const renderOptions = (category, uniqueValues) => {
    return Array.from(uniqueValues).map((value, index) => (
      <div
        key={index}
        onClick={() => handleClick(category, value)}
        style={{
          width: "100%",
          height: category === "projectManager" ? "55px" : "35px",
          borderRadius: "6px",
          padding: "4px",
          background: selectedItems[category] === value ? "#FEE8DD" : "#F7F8F9",
          marginTop: "10px",
          textAlign: "center",
          cursor: "pointer",
          overflow: category !== "projectManager" && "hidden",
        }}
      >
        {value}
      </div>
    ));
  };
  const applyFilters = () => {
    const filterCriteria = {
      ...selectedItems,
      minRange: values[0],
      maxRange: values[1],
    };
    onApplyFilter(filterCriteria);
  };
  return (
    <div className="basic-dropdown">
      <div
        className="dropdown-header"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: "#FFFFFF",
          border: "1px solid #e0e5eb",
        }}
      >
        <img className="info" src={Filter} alt="" />
        <span className="selected-option">Filters</span>
        <button className="dropdown-icon">
          <img src={downGray} alt="" style={{ cursor: "pointer" }} />
        </button>
      </div>
      {isOpen && (
        <div className="box">
          <div className="filter-container">
            <span className="content">Filter</span>
            <span className="cross" onClick={() => setIsOpen(false)}></span>
          </div>
          <div className="option-container">
            <div className="contract_amt">
              <span>Contract Amount</span>
              <div className="tooltip">
                <div className="tooltip1">
                  $ {values[0]}
                  <div className="triangle-down1"></div>
                </div>
                <div className="tooltip2">
                  $ {values[1]}
                  <div className="triangle-down2"></div>
                </div>
              </div>
              <div className="range">
                <Slider
                  className="range-slider"
                  thumbClassName="example-thumb"
                  trackClassName="example-track"
                  min={minValue}
                  max={maxValue}
                  value={values}
                  withBars
                  onChange={handleChange}
                />
              </div>
              <div className="sign_box">
                <span className="sign_box_max">Min</span>
                <span
                  style={{
                    padding: "6px",
                    width: "00px",
                    height: "16px",
                    fontWeight: "400",
                    fontSize: "15px",
                    color: "#3D424F",
                    justifyContent: "center",
                  }}
                >
                  to
                </span>
                <span className="sign_box_min">
                  Max
                </span>
              </div>
            </div>
            <div className="city">
              <span>City</span>
              <div className="city_data">
                {renderOptions("city", uniqueCities)}
              </div>
            </div>
            <div className="class">
              <span>Class</span>
              <div className="class_data">
                {renderOptions("class", uniqueClasses)}
              </div>
            </div>
            <div className="project_manager">
              <span>Project Manager</span>
              <div className="projectManager_data">
                {renderOptions("projectManager", uniqueProjectManagers)}
              </div>
            </div>
          </div>
          <div className="filter_btn">
            <div className="filter_btn1" onClick={clearFilters}>
              Clear Filter
            </div>
            <div className="filter_btn2" onClick={applyFilters}>
              Apply Filter
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
