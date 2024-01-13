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
  return (
    <div className="homeContainer">
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
                  zIndex: 222222,
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
