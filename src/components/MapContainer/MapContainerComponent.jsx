/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Icon, divIcon, point } from "leaflet";
import "./MapContainerComponent.css";
import close from "../../icons/close.svg";
import info from "../../icons/info.svg";
import moment from "moment";

const customIcon = new Icon({
  iconUrl: require("../../icons/pin.png"),
  iconSize: [38, 38],
});

const createClusterCustomIcon = function (cluster) {
  return new divIcon({
    html: `<span>${cluster.getChildCount()}</span>`,
    className: "custom-marker-cluster",
    iconSize: point(33, 33, true),
  });
};

const MapContainerComponent = ({ data }) => {
  const [showProjectCount, setShowProjectCount] = useState(true);
  const [viewport, setViewport] = useState({
    center: ["24.6399612", "-81.57378955755314"], // initial center
    zoom: 8, // initial zoom
  });
  const [type, setType] = useState(1); //1: Regular, 2: Satellite

  const updateCenter = (newCenter) => {
    setViewport({
      ...viewport,
      center: newCenter,
    });
  };

  const updateZoom = (newZoom) => {
    setViewport({
      ...viewport,
      zoom: newZoom,
    });
  };

  useEffect(() => {
    if (data.length > 0) {
      updateCenter([data[0].latitude, data[0].longitude]);
    }
  }, [data]);

  return (
    <div className="map-container">
      <div className="leftCont">
        {showProjectCount && (
          <div className="showProjects">
            <img className="info" src={info} alt="" />
            <span>
              <span style={{ fontWeight: "500" }}>Total Projects :</span>{" "}
              <span
                style={{
                  fontWeight: "700",
                  color: "#58636e",
                  paddingRight: "12px",
                }}
              >
                {data.length}
              </span>
            </span>
            <button
              onClick={() => setShowProjectCount(false)}
              className="close"
            >
              <img src={close} alt="" />
            </button>
          </div>
        )}
      </div>
      <MapContainer
        center={viewport.center}
        zoom={viewport.zoom}
        key={Math.random()}
        zoomControl={false}
      >
        <>
          <TileLayer
            attribution="Google Maps"
            url={`${
              type === 1
                ? "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                : type === 2
                ? "http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
                : ""
            }`}
            maxZoom={21}
            subdomains={["mt0", "mt1", "mt2", "mt3"]}
          />
          <MarkerClusterGroup
            chunkedLoading
            iconCreateFunction={createClusterCustomIcon}
          >
            {data.length > 0 &&
              data?.map((marker, idx) => {
                return (
                  <Marker
                    key={idx}
                    position={[marker.latitude, marker.longitude]}
                    icon={customIcon}
                  >
                    <Popup maxWidth={"300px"}>
                      <div className="popupContainer">
                        <div
                          className="item"
                          style={{
                            display: "flex",
                            fontSize: "14px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <div className="title" style={{ fontWeight: "700" }}>
                            Project:
                          </div>
                          <div
                            className="value"
                            style={{
                              fontWeight: "400",
                              paddingLeft: "5px",
                            }}
                          >
                            {marker.project_name}
                          </div>
                        </div>
                        <div
                          className="item"
                          style={{
                            display: "flex",
                            fontSize: "14px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <div className="title" style={{ fontWeight: "700" }}>
                            Category:
                          </div>
                          <div
                            className="value"
                            style={{
                              fontWeight: "400",
                              paddingLeft: "5px",
                            }}
                          >
                            {marker.project_category}
                          </div>
                        </div>
                        <div
                          className="item"
                          style={{
                            display: "flex",
                            fontSize: "14px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <div className="title" style={{ fontWeight: "700" }}>
                            Project Manager:
                          </div>
                          <div
                            className="value"
                            style={{
                              fontWeight: "400",
                              paddingLeft: "5px",
                            }}
                          >
                            {marker.project_manager}
                          </div>
                        </div>
                        <div
                          className="item"
                          style={{
                            display: "flex",
                            fontSize: "14px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <div className="title" style={{ fontWeight: "700" }}>
                            Client:
                          </div>
                          <div
                            className="value"
                            style={{
                              fontWeight: "400",
                              paddingLeft: "5px",
                            }}
                          >
                            {marker.client}
                          </div>
                        </div>
                        <div
                          className="item"
                          style={{
                            display: "flex",
                            fontSize: "14px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <div className="title" style={{ fontWeight: "700" }}>
                            Address:
                          </div>
                          <div
                            className="value"
                            style={{
                              fontWeight: "400",
                              paddingLeft: "5px",
                            }}
                          >
                            {marker.city + ", " + marker.country}
                          </div>
                        </div>
                        <div
                          className="item"
                          style={{
                            display: "flex",
                            fontSize: "14px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <div className="title" style={{ fontWeight: "700" }}>
                            Contract Amount:
                          </div>
                          <div
                            className="value"
                            style={{
                              fontWeight: "400",
                              paddingLeft: "5px",
                            }}
                          >
                            {marker.contract_amount
                              ? marker.contract_amount + "$"
                              : "NA"}
                          </div>
                        </div>
                        <div
                          className="item"
                          style={{
                            display: "flex",
                            fontSize: "14px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <div className="title" style={{ fontWeight: "700" }}>
                            Date Added:
                          </div>
                          <div
                            className="value"
                            style={{
                              fontWeight: "400",
                              paddingLeft: "5px",
                            }}
                          >
                            {moment(marker.date_added).format("MMM Do YYYY")}
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
          </MarkerClusterGroup>
        </>
      </MapContainer>
    </div>
  );
};

export default MapContainerComponent;
