import React from 'react'
import logoSm from "../../icons/logoSm.svg";
import settings from '../../icons/assets/settings.svg'
import "./Metric.css";

const Metric = ({text,metrice,logo}) => {
  return (
          <div className="smallContainers">
            <img src={logo} alt="" />
            <span className="text">
              <p>{text}</p>
              <h1>{metrice}</h1>
            </span>
          </div>

  )
}

export default Metric;