/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import "./Home.css";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import MapContainerComponent from "../MapContainer/MapContainerComponent";
import Header from "../Header/Header";
import axios from "axios";
import logoSm from "../../icons/logoSm.svg";
import file from "../../icons/assets/file.svg";
import file1 from "../../icons/assets/file1.svg";
import projects from "../../icons/projects.svg";
import users from "../../icons/user.svg";
import UserDropCard from "../UserDropCard/UserDropCard";
import { useNavigate } from "react-router-dom";
import Users from "../Users/Users";
import Metric from "../metrics/Metric";
import Project from "../Projects/Project";
import add from "../../icons/add.svg";
import Input from "../Input/Input";
import { generateRandomKey, setPopUpObjFunc } from "../../helper";
import NotificationPop from "../NotificationPop/NotificationPop";

const ViewMapSwitch = ({ projectsView, loading, setProjectsView }) => {
  return (
    <div className="switches">
      <button
        onClick={() => setProjectsView(1)}
        className={`switch-btn ${projectsView === 2 ? "" : "active-switch"}`}
        disabled={loading}
      >
        Map
      </button>
      <button
        onClick={() => setProjectsView(2)}
        className={`switch-btn ${projectsView === 1 ? "" : "active-switch"}`}
        disabled={loading}
      >
        Table
      </button>
    </div>
  );
};

export default function Home({ userDetails, logOut, baseURL }) {
  const [fullData, setFullData] = useState([]);
  const [alphaData, setAlphaData] = useState([]);
  const [section, setSection] = useState(1); //1: Projects, 2: Users
  const [projectsView, setProjectsView] = useState(1); //1: Map, 2: Table
  const [showAdd, setshowAdd] = useState(false);
  const [newProject, setNewProject] = useState({
    project_name: "",
    project_category: "",
    project_manager: "",
    client: "",
    city: "",
    country: "",
    contract_amount: "",
  });
  const [errors, setErrors] = useState({
    project_name: false,
    project_category: false,
    project_manager: false,
    client: false,
    city: false,
    country: false,
    contract_amount: false,
  });
  const [popUpObjArr, setPopUpObjArr] = useState([
    {
      show: false,
      msg: "",
      type: "",
      key: generateRandomKey(),
    },
  ]);

  const fetchData = async () => {
    const data = await axios.get(baseURL + "/getProjects");
    if (data.data && data.data.length > 0) {
      // console.log(data.data);
      setFullData(data.data);
      setAlphaData(data.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const navigate = useNavigate();

  const handleSave = async () => {
    console.log(newProject);
    let hasErrors = false;
    let temp = { ...errors };
    for (const key in newProject) {
      console.log(key);
      if (
        newProject[key] == "" ||
        newProject[key] == null ||
        newProject[key] < 0
      ) {
        temp[key] = true;
        hasErrors = true;
      }
    }
    setErrors(temp);
    if (!hasErrors) {
      const res = await axios.post(baseURL + "/addProject", newProject);
      if (!res.data?.error) {
        setPopUpObjFunc(popUpObjArr, setPopUpObjArr, {
          show: true,
          msg: res.data.message,
          type: "Success",
        });
        fetchData();
        handleClose();
      } else {
        if (res.data.message == "Invalid city or country") {
          setErrors({ ...errors, city: true, country: true });
        }
        setPopUpObjFunc(popUpObjArr, setPopUpObjArr, {
          show: true,
          msg: res.data.message,
          type: "Error",
        });
      }
    }
  };

  const handleClose = () => {
    setNewProject({
      project_name: "",
      project_category: "",
      project_manager: "",
      client: "",
      city: "",
      country: "",
      contract_amount: "",
    });
    setErrors({
      project_name: false,
      project_category: false,
      project_manager: false,
      client: false,
      city: false,
      country: false,
      contract_amount: false,
    });
    setshowAdd(false);
  };

  return (
    <div className="homeContainer">
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
          else return <></>;
        })}
      </div>
      {(userDetails.userType == "Admin" || userDetails.userType == "User") &&
        showAdd && (
          <div className="addProjectModal">
            <div className="modalCont">
              <div>Add New Project</div>
              <Input
                type={"text"}
                placeholder={"Project Name"}
                onChange={(e) => {
                  setNewProject({
                    ...newProject,
                    project_name: e.target.value,
                  });
                }}
                value={newProject.project_name}
                error={errors.project_name}
              />
              <Input
                type={"text"}
                placeholder={"Project Category"}
                onChange={(e) => {
                  setNewProject({
                    ...newProject,
                    project_category: e.target.value,
                  });
                }}
                value={newProject.project_category}
                error={errors.project_category}
              />
              <Input
                type={"text"}
                placeholder={"Project Manager"}
                onChange={(e) => {
                  setNewProject({
                    ...newProject,
                    project_manager: e.target.value,
                  });
                }}
                value={newProject.project_manager}
                error={errors.project_manager}
              />
              <Input
                type={"text"}
                placeholder={"Client"}
                onChange={(e) => {
                  setNewProject({ ...newProject, client: e.target.value });
                }}
                value={newProject.client}
                error={errors.client}
              />
              <Input
                type={"text"}
                placeholder={"City"}
                onChange={(e) => {
                  setNewProject({ ...newProject, city: e.target.value });
                }}
                value={newProject.city}
                error={errors.city}
              />
              <Input
                type={"text"}
                placeholder={"Country"}
                onChange={(e) => {
                  setNewProject({ ...newProject, country: e.target.value });
                }}
                value={newProject.country}
                error={errors.country}
              />
              <Input
                type={"number"}
                placeholder={"Contract Amount"}
                onChange={(e) => {
                  if (e.target.value >= 0)
                    setNewProject({
                      ...newProject,
                      contract_amount: e.target.value,
                    });
                }}
                value={newProject.contract_amount}
                error={errors.contract_amount}
              />
              <div className="btns">
                {" "}
                <div
                  className="save"
                  onClick={() => {
                    handleSave();
                  }}
                >
                  Save
                </div>
                <div
                  className="close"
                  onClick={() => {
                    handleClose();
                  }}
                >
                  Close
                </div>
              </div>
            </div>
          </div>
        )}
      <div className="topBar">
        <div className="logo">
          <img src={logoSm} alt="" />
        </div>
        <div className="sectionType">
          {section === 1 ? (
            <>
              <div>Projects</div>
              <div
                style={{
                  position: "absolute",
                  right: "2%",
                  top: "11%",
                  zIndex: 1003,
                }}
              >
                <ViewMapSwitch
                  projectsView={projectsView}
                  setProjectsView={setProjectsView}
                />
              </div>
            </>
          ) : (
            "Users"
          )}
        </div>
        <div className="rightCont">
          {userDetails.email ? (
            <UserDropCard userDetails={userDetails} logOut={logOut} />
          ) : (
            <div
              onClick={() => {
                navigate("/login");
              }}
              className="login pointer"
            >
              Login
            </div>
          )}
        </div>
      </div>
      <div className="bottomSection">
        <div className="leftBar">
          <div
            onClick={() => setSection(1)}
            className={`sectionIcon pointer ${
              section === 1 ? "activeSection" : ""
            }`}
          >
            <div className={"sectionIconImg"}>
              <img src={projects} alt="" />
            </div>
            <div className="sectionName">Projects</div>
          </div>
          {userDetails.userType === "Admin" && (
            <div
              onClick={() => setSection(2)}
              className={`sectionIcon pointer ${
                section === 2 ? "activeSection" : ""
              }`}
            >
              <div className={"sectionIconImg"}>
                <img src={users} alt="" />
              </div>
              <div className="sectionName">Users</div>
            </div>
          )}
        </div>
        <div className="mainContainer">
          {section === 1 && (
            <div className="projects">
              {projectsView === 1 && (
                <div className="map">
                  <Header
                    data={alphaData}
                    setData={setAlphaData}
                    originalData={fullData}
                  />
                  <MapContainerComponent data={alphaData} />
                </div>
              )}
              {projectsView === 2 && (
                <div className="project_container">
                  <div className="matrices">
                    <Metric
                      text={"Total Projects"}
                      metrice={fullData?.length}
                      logo={file}
                    />
                    <Metric
                      text={"New Projects"}
                      metrice={fullData?.length}
                      logo={file1}
                    />
                    {(userDetails.userType == "Admin" ||
                      userDetails.userType == "User") && (
                      <div className="addNew" onClick={() => setshowAdd(true)}>
                        {" "}
                        Add Project <img src={add} alt="" />
                      </div>
                    )}
                  </div>
                  <div>
                    <Project fullData={fullData} />
                  </div>
                </div>
              )}
            </div>
          )}
          {section === 2 && (
            <Users baseURL={baseURL} userDetails={userDetails} />
          )}
        </div>
      </div>
    </div>
  );
}
