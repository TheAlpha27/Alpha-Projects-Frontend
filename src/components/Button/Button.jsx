import React from "react";
import "./Button.css";
import loader from "../../icons/loader.gif";

const Button = ({ name, onClick, disable, style, outline, loading }) => {
  return (
    <div className="buttonContainer">
      <button
        className={`button ${disable ? "disable" : ""} ${
          outline ? "outline" : ""
        } ${loading ? "reducePadding" : ""}`}
        disabled={disable}
        onClick={onClick}
        style={style}
      >
        {loading ? (
          <img className="loader" src={loader} alt="loading..." />
        ) : (
          name
        )}
      </button>
    </div>
  );
};

export default Button;
