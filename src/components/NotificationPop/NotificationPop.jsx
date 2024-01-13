import React, { useEffect, useState } from "react";
import "./NotificationPop.css";
import success from "../../icons/success.png";
import error from "../../icons/error.svg";

const NotificationPop = ({ message, type }) => {
  const [show, setShow] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setShow(false);
    }, 6000);
  }, []);

  const loaderBg = {
    backgroundColor:
      type === "Success" ? "#00A37D" : type === "Error" ? "#DE1C22" : "#E6A901",
    height: "5px",
    borderRadius: "8px",
  };

  return (
    <div className={`popUpContainer ${show ? `` : `hidden`} `}>
      <div className="top-container">
        <div
          className="bar"
          style={{
            background:
              type === "Success"
                ? "#00A37D"
                : type === "Error"
                ? "#DE1C22"
                : "#E6A901",
          }}
        ></div>
        <div className="message">{message}</div>
        <img
          src={type === "Success" ? success : error}
          alt=""
          className="icon"
        />
      </div>
      <div className={"animate"} style={loaderBg}></div>
    </div>
  );
};

export default NotificationPop;
