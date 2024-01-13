/* eslint-disable eqeqeq */
import React, { useEffect } from "react";
import "./Dropdown.css";
import searchIcon from "../../icons/search.png";
import downGray from "../../icons/downGray.svg";
import downWhite from "../../icons/downWhite.svg";
import { useState } from "react";
import { useRef } from "react";

const Dropdown = ({
  search,
  checkbox,
  options,
  value,
  onChange,
  type,
  name,
  disable,
  flowtype
}) => {
  const [open, setOpen] = useState(false);
  const [searchStr, setSearchStr] = useState("");
  const [dropdownOptions, setDropdownOptions] = useState();
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const ref6 = useRef(null);
  const ref7 = useRef(null);

  const handleClick = (e) => {
    if (
      e.target !== ref1.current &&
      e.target !== ref2.current &&
      e.target !== ref3.current &&
      e.target !== ref4.current &&
      e.target !== ref5.current &&
      e.target !== ref6.current
    ) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.body.addEventListener("click", handleClick);

    return () => {
      document.body.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    setDropdownOptions([...options]);
  }, [options]);

  const handleSearch = (val) => {
    setSearchStr(val);
    setDropdownOptions([...options]);
    if (val != "") {
      setDropdownOptions(
        options.filter((e) => {
          const lowerCaseLabel = e.label.toLowerCase();
          const lowerCaseStr = val.toLowerCase();
          return lowerCaseLabel.includes(lowerCaseStr);
        })
      );
    }
  };
  const containerStyle = flowtype === 'user'
    ? {
        borderRadius: '7px',
        backgroundColor: disable ? "gray" : value ? "#F16524" : "#FFFFFF",
        border: value ? "" : "1px solid #e0e5eb",
        cursor: disable ? "not-allowed" : "",
        fontWeight: '500',
      }
    : {
        backgroundColor: disable ? "gray" : value ? "#F16524" : "#FFFFFF",
        border: value ? "" : "1px solid #58636e",
        cursor: disable ? "not-allowed" : "",
      };

  const optionsContainerStyle = flowtype === 'user'
    ? { width: '100%', zIndex: 1, textAlign: 'center'}
    : {};
    
  return (
    <div className={`main-container`} ref={ref1}>
      <div
        className={`dropdown-container`}
        onClick={() => {
          if (!disable) setOpen(!open);
        }}
        style={containerStyle}
      >
        <span
          ref={ref2}
          className={`value-field`}
          style={{
            color: disable ? "white" : value ? "white" : "",
          }}
        >
          {value ? options.filter((e) => e?.value == value)[0]?.label : name}
        </span>
        <button
          ref={ref3}
          style={{ cursor: disable ? "not-allowed" : "" }}
          className="icon"
        >
          <img
            ref={ref6}
            className="icon-img"
            src={disable ? downWhite : value ? downWhite : downGray}
            alt=""
          />
        </button>
      </div>
      {open && (
        <div ref={ref4} className="options-container" style={optionsContainerStyle}>
          {search && (
            <div className="search">
              <input
                ref={ref5}
                type="text"
                className="search-inp"
                placeholder={`Search ${name}`}
                value={searchStr}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <img ref={ref7} className="search-icon" src={searchIcon} alt="" />
            </div>
          )}
          {options &&
            dropdownOptions.map((elem, idx) => {
              return (
                <div
                  onClick={() => {
                    if (type) {
                      onChange(elem?.value, type);
                    } else {
                      onChange(elem?.value);
                    }
                    setOpen(false);
                  }}
                  className="option"
                  key={idx}
                  value={elem?.value}
                >
                  {elem?.label}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default Dropdown;