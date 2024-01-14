import React from 'react'
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