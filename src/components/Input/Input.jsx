import React, { useEffect, useState } from "react";
import "./Input.css";
import passOff from "../../icons/passOff.svg";
import passOn from "../../icons/passOn.svg";

const Input = ({
  type,
  placeholder,
  onChange,
  value,
  error,
  className,
  style,
}) => {
  const [showPass, setshowPass] = useState(false);
  const [otpState, setOtpState] = useState(["", "", "", "", "", ""]);

  useEffect(() => {
    if (type === "otp") {
      const elem = document.getElementById((0).toString());
      elem.focus();
    }
  }, [type]);

  if (type === "otp") {
    const handleOTPChange = (val, idx) => {
      const tempOTPArr = [...otpState];
      tempOTPArr[idx] = val;
      setOtpState(tempOTPArr);
      if (idx < 5 && val !== "") {
        const elem = document.getElementById((idx + 1).toString());
        elem.focus();
      }
      let otpString = "";
      tempOTPArr.forEach((e) => {
        otpString = otpString + e;
      });
      onChange(otpString);
    };
    const handleBackClick = (prev, idx) => {
      if (prev === "" && idx !== 0) {
        const elem = document.getElementById((idx - 1).toString());
        elem.focus();
      }
    };
    return (
      <div style={style}>
        <div className="otpContainer">
          {otpState.map((e, idx) => {
            return (
              <div className={`otpCellContainer`}>
                {
                  <input
                    id={idx.toString()}
                    type="text"
                    value={e}
                    className={`otpInput ${error ? "otpError" : ""}`}
                    onChange={(el) => {
                      handleOTPChange(el.target.value, idx);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Backspace") {
                        handleBackClick(e, idx);
                      }
                    }}
                    maxLength={1}
                  />
                }
              </div>
            );
          })}
        </div>
      </div>
    );
  } else
    return (
      <div style={style} className={`inputContainer ${className}`}>
        <input
          type={type === "password" ? (showPass ? "text" : "password") : type}
          value={value}
          onChange={onChange}
          className={`input ${error ? "error" : ""}`}
          required
        />
        <label className={`label`}>{placeholder}</label>
        {(placeholder === "Password" || placeholder === "Confirm Password") && (
          <img
            onClick={() => setshowPass(!showPass)}
            className="passIcon"
            src={showPass ? passOff : passOn}
            alt=""
          />
        )}
      </div>
    );
};

export default Input;
