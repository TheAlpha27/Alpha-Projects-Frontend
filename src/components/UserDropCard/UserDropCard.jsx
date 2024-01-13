import React, { useState } from "react";
import "./UserDropCard.css";
import downBlack from "../../icons/downBlack.svg";
import profileImg from "../../icons/profileImg.svg";

const UserDropCard = ({ userDetails, logOut }) => {
  const [showDrop, setShowDrop] = useState(false);
  return (
    <div className="UserDropCard">
      <div className="userImg">
        <img src={profileImg} alt="" />
      </div>
      <div className="details">
        <div className="name">{userDetails?.fullname}</div>
        <div className="userType">{userDetails?.userType}</div>
      </div>
      <div
        onClick={() => {
          setShowDrop(!showDrop);
        }}
        className="drop pointer"
      >
        <img src={downBlack} alt="" />
      </div>
      {showDrop && (
        <div className="option">
          <div
            onClick={() => {
              logOut();
              setShowDrop(false);
            }}
            className="optionItem pointer"
          >
            Logout
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropCard;
