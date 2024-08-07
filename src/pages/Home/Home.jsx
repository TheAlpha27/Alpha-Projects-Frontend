/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import "./Home.css";
import "leaflet/dist/leaflet.css";
import { useContext, useEffect, useState } from "react";
import MapContainerComponent from "../../components/MapContainer/MapContainerComponent";
import axios from "axios";
import logoSm from "../../icons/logoSm.svg";
import file from "../../icons/assets/file.svg";
import file1 from "../../icons/assets/file1.svg";
import projects from "../../icons/projects.svg";
import users from "../../icons/user.svg";
import UserDropCard from "../../components/UserDropCard/UserDropCard";
import { useNavigate } from "react-router-dom";
import Metric from "../../components/metrics/Metric";
import add from "../../icons/add.svg";
import NotificationPop from "../../components/NotificationPop/NotificationPop";
import {
  baseURL,
  InitialProject,
  InitialProjectErrors,
  ProjectView,
  Sections,
  UserTypes,
} from "../../utils/constants";
import Users from "../Users/Users";
import { generateRandomKey, setPopUpObjFunc } from "../../utils/helper";
import { AuthContext } from "../../utils/authContext";
import ProjectTable from "../Projects/ProjectTable";
import FilterHeader from "../../components/FilterHeader/FilterHeader";
import AddProjectModal from "../../components/AddProjectModal/AddProjectModal";

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

const Home = () => {
  const [fullData, setFullData] = useState([]);
  const [alphaData, setAlphaData] = useState([]);
  const [section, setSection] = useState(Sections.projects);
  const [projectsView, setProjectsView] = useState(ProjectView.map);
  const [showAdd, setshowAdd] = useState({ show: false, edit: false });
  const [newProject, setNewProject] = useState({ ...InitialProject });
  const [errors, setErrors] = useState({ ...InitialProjectErrors });
  const [popUpObjArr, setPopUpObjArr] = useState([
    {
      show: false,
      msg: "",
      type: "",
      key: generateRandomKey(),
    },
  ]);
  const { userDetails, logOut } = useContext(AuthContext);

  const fetchData = async () => {
    try {
      const data = await axios.get(baseURL + "/getProjects", {
        headers: {
          Authorization: userDetails.token,
        },
      });
      if (data.data && data.data.length > 0) {
        setFullData(data.data);
        setAlphaData(data.data);
      }
    } catch (error) {
      if (error.response.status === 401) {
        logOut();
      }
      setPopUpObjFunc(popUpObjArr, setPopUpObjArr, {
        show: true,
        msg: error.response.data.message,
        type: "Error",
      });
    }
  };

  useEffect(() => {
    if (userDetails) {
      fetchData();
    }
  }, [userDetails]);

  const navigate = useNavigate();

  const handleSave = async () => {
    console.log(newProject);
    let hasErrors = false;
    let temp = { ...errors };
    for (const key in newProject) {
      if (key !== "__v") {
        if (
          newProject[key] == "" ||
          newProject[key] == null ||
          newProject[key] < 0
        ) {
          temp[key] = true;
          hasErrors = true;
        }
      }
    }
    setErrors(temp);

    if (!hasErrors) {
      if (showAdd.edit) {
        try {
          const res = await axios.put(baseURL + "/updateProject", newProject, {
            headers: {
              Authorization: userDetails.token,
            },
          });
          setPopUpObjFunc(popUpObjArr, setPopUpObjArr, {
            show: true,
            msg: res.data.message,
            type: "Success",
          });
          fetchData();
          handleClose();
        } catch (error) {
          if (error.response.status === 401) {
            logOut();
          }
          if (error.response.data.message == "Invalid city or country") {
            setErrors({ ...errors, city: true, country: true });
          }
          setPopUpObjFunc(popUpObjArr, setPopUpObjArr, {
            show: true,
            msg: error.response.data.message,
            type: "Error",
          });
        }
      } else {
        try {
          const res = await axios.post(baseURL + "/addProject", newProject, {
            headers: {
              Authorization: userDetails.token,
            },
          });
          setPopUpObjFunc(popUpObjArr, setPopUpObjArr, {
            show: true,
            msg: res.data.message,
            type: "Success",
          });
          fetchData();
          handleClose();
        } catch (error) {
          if (error.response.status === 401) {
            logOut();
          }
          if (error.response.data.message == "Invalid city or country") {
            setErrors({ ...errors, city: true, country: true });
          }
          setPopUpObjFunc(popUpObjArr, setPopUpObjArr, {
            show: true,
            msg: error.response.data.message,
            type: "Error",
          });
        }
      }
    }
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        baseURL + "/deleteProject/" + newProject._id,
        {
          headers: {
            Authorization: userDetails.token,
          },
        }
      );
      setPopUpObjFunc(popUpObjArr, setPopUpObjArr, {
        show: true,
        msg: res.data.message,
        type: "Success",
      });
      fetchData();
      handleClose();
    } catch (error) {
      if (error.response.status === 401) {
        logOut();
      }
      setPopUpObjFunc(popUpObjArr, setPopUpObjArr, {
        show: true,
        msg: error.response.data.message,
        type: "Error",
      });
    }
  };

  const handleClose = () => {
    setNewProject({ ...InitialProject });
    setErrors({ ...InitialProjectErrors });
    setshowAdd({ show: false, edit: false });
  };

  const handleProjectClick = (projectName) => {
    setNewProject({
      ...fullData.filter((data) => data.project_name === projectName)[0],
    });
    setshowAdd({ show: true, edit: true });
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
      {(userDetails?.type == UserTypes.admin ||
        userDetails?.type == UserTypes.user) &&
        showAdd.show && (
          <AddProjectModal
            setNewProject={setNewProject}
            newProject={newProject}
            errors={errors}
            handleClose={handleClose}
            handleSave={handleSave}
            edit={showAdd.edit}
            handleDelete={handleDelete}
          />
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
          {userDetails?.email ? (
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
          {userDetails?.type !== UserTypes.guest && (
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
          {section === Sections.projects && (
            <div className="projects">
              {projectsView === ProjectView.map && (
                <div className="map">
                  <FilterHeader
                    data={alphaData}
                    setData={setAlphaData}
                    originalData={fullData}
                  />
                  <MapContainerComponent data={alphaData} />
                </div>
              )}
              {projectsView === ProjectView.table && (
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
                    {(userDetails.type == UserTypes.admin ||
                      userDetails.type == UserTypes.user) && (
                      <div
                        className="addNew"
                        onClick={() => setshowAdd({ show: true, edit: false })}
                      >
                        {" "}
                        Add Project <img src={add} alt="" />
                      </div>
                    )}
                  </div>
                  <div style={{ height: "100%" }}>
                    <ProjectTable
                      fullData={fullData}
                      handleProjectClick={handleProjectClick}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          {section === Sections.users && <Users />}
        </div>
      </div>
    </div>
  );
};

export default Home;
