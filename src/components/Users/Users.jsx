import React, { useEffect } from "react";
import "./Users.css";
import { useState } from "react";
import axios from "axios";
import Table from "../Table/Table";
import { generateRandomKey, setPopUpObjFunc } from "../../helper";
import group from "../../icons/assets/group.svg";
import settings from "../../icons/assets/settings.svg";
import verified from "../../icons/assets/verified.svg";
import user from "../../icons/assets/user.svg";
import Metric from "../metrics/Metric";
import NotificationPop from "../NotificationPop/NotificationPop";

const userColumns = [
  { columnName: "Full Name", key: "Full_Name", width: "30%" },
  { columnName: "User Type", key: "Type", width: "20%" },
  { columnName: "Email", key: "Email", width: "30%" },
  { columnName: "Status", key: "Status", width: "20%" },
];

const Users = ({ userDetails, baseURL }) => {
  const [usersData, setUsersData] = useState([]);

  const [popUpObjArr, setPopUpObjArr] = useState([
    {
      show: false,
      msg: "",
      type: "",
      key: generateRandomKey(),
    },
  ]);

  const metricesCount = (data, userType) => {
    return data.reduce((count, user) => {
      if (user.Type.value === userType) {
        return count + 1;
      }
      return count;
    }, 0);
  };

  const onUserTypeChange = async (payload) => {
    const data = await axios.put(baseURL + "/change-user-type", payload, {
      headers: {
        Authorization: userDetails.token,
      },
    });
    if (!data.data?.error) {
      setPopUpObjFunc(popUpObjArr, setPopUpObjArr, {
        show: true,
        msg: data.data.message,
        type: "Success",
      });
      fetchData();
    } else {
      setPopUpObjFunc(popUpObjArr, setPopUpObjArr, {
        show: true,
        msg: data.data.message,
        type: "Error",
      });
    }
  };

  const onUserStatusChange = async (payload) => {
    try {
      const data = await axios.put(baseURL + "/change-user-status", payload, {
        headers: {
          Authorization: userDetails.token,
        },
      });
      if (!data.data?.error) {
        setPopUpObjFunc(popUpObjArr, setPopUpObjArr, {
          show: true,
          msg: data.data.message,
          type: "Success",
        });
        fetchData();
      } else {
        setPopUpObjFunc(popUpObjArr, setPopUpObjArr, {
          show: true,
          msg: data.data.message,
          type: "Error",
        });
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const createUserTableData = (data) => {
    const tempData = [];
    data.forEach((e) => {
      const tempObj = {};
      tempObj.Email = {
        value: e.email,
        type: "string",
      };
      tempObj.Full_Name = {
        value: e.fullname,
        type: "string",
      };
      tempObj.Type = {
        value: e.type,
        type: "typeChip",
        onChange: onUserTypeChange,
      };
      tempObj.Status = {
        value: e.status,
        type: "statusChip",
        onChange: onUserStatusChange,
      };
      tempData.push(tempObj);
    });
    return tempData;
  };

  const fetchData = async () => {
    const data = await axios.get(baseURL + "/get-users", {
      headers: {
        Authorization: userDetails.token,
      },
    });
    if (data.status === 200) {
      setUsersData(createUserTableData(data.data));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="users">
      <div className="notificationPop">
        {popUpObjArr.map((popUpobj) => {
          if (popUpobj.show)
            return (
              popUpobj.show && (
                <NotificationPop
                  key={popUpobj.key}
                  message={popUpobj.msg}
                  type={popUpobj.type}
                />
              )
            );
          else {
            return <></>;
          }
        })}
      </div>
      <div className="tableContainer">
        <div className="uppeContainers">
          <Metric
            text={"Total Users"}
            logo={group}
            metrice={usersData?.length}
          />
          <Metric
            text={"Administrators"}
            logo={settings}
            metrice={metricesCount(usersData, "Admin")}
          />
          <Metric
            text={"Users"}
            logo={verified}
            metrice={metricesCount(usersData, "User")}
          />
          <Metric
            text={"Guests"}
            logo={user}
            metrice={metricesCount(usersData, "Guest")}
          />
        </div>
        {usersData.length > 0 && (
          <Table
            type={"user"}
            checkbox={true}
            columns={userColumns}
            data={usersData}
            name={"All Users"}
            onUserTypeChange={onUserTypeChange}
            onUserStatusChange={onUserStatusChange}
          />
        )}
      </div>
    </div>
  );
};

export default Users;
