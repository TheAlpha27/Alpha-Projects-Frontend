import React, { useEffect, useRef, useState } from "react";
import "./UserDropCard.css";
import downBlack from "../../icons/downBlack.svg";
import profileImg from "../../icons/profileImg.svg";

const UserDropCard = ({ userDetails, logOut }) => {
  const [showDrop, setShowDrop] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowDrop(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);
  return (
    <div
      className="UserDropCard pointer"
      onClick={() => {
        setShowDrop(!showDrop);
      }}
      ref={menuRef}
    >
      <div className="userImg">
        <img src={profileImg} alt="" />
      </div>
      <div className="details">
        <div className="name">{userDetails?.fullname}</div>
        <div className="userType">{userDetails?.type}</div>
      </div>
      <div className="drop ">
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
