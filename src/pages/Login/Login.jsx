/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import "./Login.css";
import logoSm from "../../icons/logoSm.svg";
import vector from "../../icons/vector.svg";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import axios from "axios";
import NotificationPop from "../../components/NotificationPop/NotificationPop";
import { useNavigate } from "react-router-dom";
import edit from "../../icons/edit.svg";
import success from "../../icons/success.svg";
import { generateRandomKey, setPopUpObjFunc } from "../../utils/helper";
import { AuthContext } from "../../utils/authContext";
import {
  baseURL,
  ForgetPasswordStage,
  InitialForgetPassInput,
  InitialLoginInput,
  InitialSignUpInput,
  LoginStage,
  SignUpStage,
} from "../../utils/constants";

const LoginInputs = ({
  loginInput,
  setLoginInput,
  login,
  error,
  setStages,
  stages,
  setError,
  loading,
}) => {
  return (
    <>
      <div className="LoginTop">
        <div className="welcome">Welcome</div>
        <div className="creds">Enter your credentials</div>
        <Input
          type={"text"}
          className={"inp"}
          placeholder={"Email ID"}
          value={loginInput.email}
          error={error}
          onChange={(e) => {
            setError(false);
            setLoginInput({ ...loginInput, email: e.target.value });
          }}
        />
        <Input
          type={"password"}
          placeholder={"Password"}
          error={error}
          value={loginInput.password}
          onChange={(e) => {
            setError(false);
            setLoginInput({ ...loginInput, password: e.target.value });
          }}
        />
        <div className="forgotPass">
          <span
            onClick={() => {
              const tempObj = { ...stages };
              tempObj.login.show = false;
              tempObj.forgotPassword.show = true;
              setStages(tempObj);
            }}
            className="pointer"
          >
            Forgot password?
          </span>
        </div>
        <Button
          name={"Login"}
          disable={
            loginInput.email === "" || loginInput.password === "" || loading
          }
          onClick={login}
          loading={loading}
        />
        <div className="createAccount">
          Don’t have an account?{" "}
          <span
            style={{ marginLeft: "5px" }}
            className="link pointer"
            onClick={() => {
              const tempObj = { ...stages };
              tempObj.login.show = false;
              tempObj.signUp.show = true;
              setStages(tempObj);
            }}
          >
            Create an account
          </span>
        </div>
      </div>
      <div className="LoginBottom">
        By continuing, you agree to our{" "}
        <span className="link">Privacy Policy</span> and{" "}
        <span className="link">Terms & Conditions</span>
      </div>
    </>
  );
};

const Timer = ({ style, setAllowResend }) => {
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => (prevSeconds > 0 ? prevSeconds - 1 : 0));
    }, 1000);

    // Clear the interval when the component is unmounted or when countdown reaches 0
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line eqeqeq
    if (seconds == 0) {
      setAllowResend(true);
    }
  }, [seconds]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const remainingSeconds = time % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div style={style}>
      <p>{formatTime(seconds)}s</p>
    </div>
  );
};

const SignupInputs = ({
  stage,
  signupInput,
  setSignupInput,
  getOtp,
  verifyOtp,
  signup,
  error,
  setError,
  setStages,
  stages,
  loading,
}) => {
  const [allowResend, setAllowResend] = useState(false);
  const [cnfPassErr, setCnfPassErr] = useState(false);
  useEffect(() => {
    if (stage === SignUpStage.Done) {
      const tempObj = { ...stages };
      tempObj.signUp.show = false;
      tempObj.signUp.stage = SignUpStage.Email;
      tempObj.login.show = true;
      setTimeout(() => {
        setStages(tempObj);
      }, 3000);
    }
  }, [stages]);
  return (
    <>
      <div className="LoginTop">
        {stage === SignUpStage.Email && (
          <>
            <div className="welcome">Create account</div>
            <div className="creds">
              Get started with an account on Alpha Projects.
            </div>
            <Input
              type={"text"}
              className={"inp"}
              placeholder={"Email ID"}
              error={error}
              value={signupInput.email}
              onChange={(e) => {
                setError(false);
                setSignupInput({ ...signupInput, email: e.target.value });
              }}
            />
            <Button
              name={"Get OTP"}
              disable={signupInput.email === "" || loading}
              style={{ marginTop: "32px" }}
              onClick={getOtp}
              loading={loading}
            />
            <div className="already">
              Already have an account?
              <span
                onClick={() => {
                  const tempObj = { ...stages };
                  tempObj.signUp.show = false;
                  tempObj.login.show = true;
                  setStages(tempObj);
                }}
                className="link pointer"
              >
                Log In
              </span>
            </div>
          </>
        )}
        {stage === SignUpStage.OTP && (
          <>
            <div className="welcome">OTP Verification</div>
            <div className="creds">
              6-digit OTP send to {signupInput.email}{" "}
              <img
                onClick={() => {
                  const tempObj = { ...stages };
                  tempObj.signUp.stage = SignUpStage.Email;
                  setStages(tempObj);
                }}
                src={edit}
                className="pointer"
                alt=""
              />
            </div>
            <div className="timer">
              Enter the OTP{" "}
              <span>
                <Timer
                  style={{ color: "#F16524", marginLeft: "5px" }}
                  setAllowResend={setAllowResend}
                />
              </span>
            </div>
            <Input
              type={"otp"}
              value={signupInput.otp}
              setSignupInput={setSignupInput}
              error={error}
              onChange={(e) => setSignupInput({ ...signupInput, otp: e })}
            />
            <div className="resend">
              Haven’t received OTP?{" "}
              <span
                style={{ marginLeft: "5px" }}
                onClick={() => {
                  if (allowResend) {
                    getOtp();
                  }
                }}
                className={`${allowResend ? "link pointer" : "notAllowed"}`}
              >
                Resend OTP
              </span>
            </div>
            <Button
              name={"Confirm OTP"}
              disable={signupInput.otp.length !== 6 || loading}
              style={{ marginTop: "32px" }}
              onClick={verifyOtp}
              loading={loading}
            />
            <div className="already">
              Already have an account?
              <span
                onClick={() => {
                  const tempObj = { ...stages };
                  tempObj.signUp.show = false;
                  tempObj.signUp.stage = SignUpStage.Email;
                  tempObj.login.show = true;
                  setStages(tempObj);
                }}
                className="link pointer"
              >
                Log In
              </span>
            </div>
          </>
        )}
        {stage === SignUpStage.CreatePassword && (
          <>
            <div className="welcome">Create account</div>
            <div className="creds">
              Get started with an account on Alpha Projects.
            </div>
            <Input
              type={"text"}
              className={"inp"}
              placeholder={"Full Name"}
              error={error}
              value={signupInput.fullname}
              onChange={(e) => {
                setError(false);
                setSignupInput({ ...signupInput, fullname: e.target.value });
              }}
            />
            <Input
              type={"text"}
              className={"inp"}
              placeholder={"Email ID"}
              error={error}
              value={signupInput.email}
              onChange={(e) => {
                setError(false);
                setSignupInput({ ...signupInput, email: e.target.value });
              }}
            />
            <Input
              type={"password"}
              className={"inp"}
              placeholder={"Password"}
              error={error}
              value={signupInput.password}
              onChange={(e) => {
                setError(false);
                setSignupInput({ ...signupInput, password: e.target.value });
              }}
            />
            <Input
              type={"password"}
              className={"inp"}
              placeholder={"Confirm Password"}
              error={error || cnfPassErr}
              value={signupInput.confirmPass}
              onChange={(e) => {
                setError(false);
                setSignupInput({ ...signupInput, confirmPass: e.target.value });
                if (e.target.value !== signupInput.password) {
                  setCnfPassErr(true);
                } else {
                  setCnfPassErr(false);
                }
              }}
            />
            <div className="terms">
              By registering, you agree with our{" "}
              <span style={{ marginLeft: "5px" }} className="link">
                Terms & Conditions
              </span>
            </div>
            <Button
              name={"Create account"}
              disable={
                !signupInput.email ||
                !signupInput.fullname ||
                !signupInput.password ||
                !signupInput.confirmPass ||
                cnfPassErr ||
                loading
              }
              style={{ marginTop: "16px" }}
              onClick={signup}
              loading={loading}
            />
            <div className="already">
              Already have an account?
              <span
                onClick={() => {
                  const tempObj = { ...stages };
                  tempObj.signUp.show = false;
                  tempObj.signUp.stage = SignUpStage.Email;
                  tempObj.login.show = true;
                  setStages(tempObj);
                }}
                className="link pointer"
              >
                Log In
              </span>
            </div>
          </>
        )}
        {stage === SignUpStage.Done && (
          <div className="doneMain">
            <img src={success} alt="" />
            <div style={{ fontSize: "42px" }} className="welcome">
              Awesome!
            </div>
            <div className="creds">
              Your account has been created successfully.
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const ForgotPassword = ({
  stage,
  forgotPassInput,
  setForgotPassInput,
  error,
  setError,
  forgotPass,
  verifyOtpReset,
  setPass,
  setStages,
  stages,
  loading,
}) => {
  const [allowResend, setAllowResend] = useState(false);
  const [cnfPassErr, setCnfPassErr] = useState(false);
  useEffect(() => {
    if (stage === ForgetPasswordStage.Done) {
      const tempObj = { ...stages };
      tempObj.forgotPassword.show = false;
      tempObj.forgotPassword.stage = ForgetPasswordStage.Email;
      tempObj.login.show = true;
      setTimeout(() => {
        setStages(tempObj);
      }, 3000);
    }
  }, [stages]);

  return (
    <>
      <div className="LoginTop">
        {stage === ForgetPasswordStage.Email && (
          <>
            {" "}
            <div className="welcome">Forgot Password</div>
            <div className="creds">
              No worries, we’ll send you instructions for reset!
            </div>
            <Input
              type={"text"}
              className={"inp"}
              placeholder={"Email ID"}
              value={forgotPassInput.email}
              error={error}
              onChange={(e) => {
                setError(false);
                setForgotPassInput({
                  ...forgotPassInput,
                  email: e.target.value,
                });
              }}
            />
            <Button
              onClick={() => forgotPass()}
              disable={!forgotPassInput.email || loading}
              loading={loading}
              style={{ marginBottom: "20px", marginTop: "32px" }}
              name={"Reset Password"}
            />
            <Button
              onClick={() => {
                const tempObj = { ...stages };
                tempObj.forgotPassword.show = false;
                tempObj.login.show = true;
                setStages(tempObj);
              }}
              name={"Back"}
              outline
            />
          </>
        )}
        {stage === ForgetPasswordStage.OTP && (
          <>
            {" "}
            <div className="welcome">OTP Verification</div>
            <div className="creds">
              We’ve sent a{" "}
              <span style={{ fontWeight: "600" }}>6-digit OTP</span> to your
              email{" "}
              <span style={{ fontWeight: "600" }}>{forgotPassInput.email}</span>{" "}
              to rest your password
            </div>
            <div className="timer">
              Enter the OTP{" "}
              <span>
                <Timer
                  style={{ color: "#F16524", marginLeft: "5px" }}
                  setAllowResend={setAllowResend}
                />
              </span>
            </div>
            <Input
              type={"otp"}
              value={forgotPassInput.otp}
              setSignupInput={forgotPassInput}
              error={error}
              onChange={(e) => {
                setError(false);
                setForgotPassInput({ ...forgotPassInput, otp: e });
              }}
            />
            <div className="resend">
              Haven’t received OTP?{" "}
              <span
                style={{ marginLeft: "5px" }}
                onClick={() => {
                  if (allowResend) {
                    forgotPass();
                  }
                }}
                className={`${allowResend ? "link pointer" : "notAllowed"}`}
              >
                Resend OTP
              </span>
            </div>
            <Button
              name={"Confirm OTP"}
              disable={forgotPassInput.otp.length !== 6 || loading}
              loading={loading}
              style={{ marginTop: "32px" }}
              onClick={verifyOtpReset}
            />
            <div className="already">
              Already have an account?
              <span
                onClick={() => {
                  const tempObj = { ...stages };
                  tempObj.forgotPassword.show = false;
                  tempObj.forgotPassword.stage = ForgetPasswordStage.Email;
                  tempObj.login.show = true;
                  setStages(tempObj);
                }}
                className="link pointer"
              >
                Log In
              </span>
            </div>
          </>
        )}
        {stage === ForgetPasswordStage.SetPassword && (
          <>
            {" "}
            <div className="welcome" style={{ fontSize: "40px" }}>
              Set a New Password
            </div>
            <div className="creds">
              New password must be different from your previous used passwords
            </div>
            <Input
              type={"password"}
              className={"inp"}
              placeholder={"Password"}
              error={error}
              value={forgotPassInput.password}
              onChange={(e) => {
                setError(false);
                setForgotPassInput({
                  ...forgotPassInput,
                  password: e.target.value,
                });
              }}
            />
            <Input
              type={"password"}
              className={"inp"}
              placeholder={"Confirm Password"}
              error={error || cnfPassErr}
              value={forgotPassInput.confirmPass}
              onChange={(e) => {
                setError(false);
                setForgotPassInput({
                  ...forgotPassInput,
                  confirmPass: e.target.value,
                });
                if (e.target.value !== forgotPassInput.password) {
                  setCnfPassErr(true);
                } else {
                  setCnfPassErr(false);
                }
              }}
            />
            <Button
              name={"Reset account"}
              disable={
                !forgotPassInput.password ||
                !forgotPassInput.confirmPass ||
                cnfPassErr ||
                loading
              }
              style={{ marginTop: "16px" }}
              onClick={setPass}
              loading={loading}
            />
          </>
        )}
        {stage === ForgetPasswordStage.Done && (
          <div className="doneMain">
            <img src={success} alt="" />
            <div style={{ fontSize: "24px" }} className="welcome">
              Password Changed Successfully
            </div>
            <div className="creds">
              Your password has been changed successfully!
            </div>
          </div>
        )}
      </div>
      {stage !== ForgetPasswordStage.Done && (
        <div className="LoginBottom">
          By continuing, you agree to our{" "}
          <span className="link">Terms & Conditions</span>
        </div>
      )}
    </>
  );
};

const Login = () => {
  const [popUpObjArr, setPopUpObjArr] = useState([
    {
      show: false,
      msg: "",
      type: "",
      key: generateRandomKey(),
    },
  ]);
  const [stages, setStages] = useState({
    login: {
      show: true,
      stage: LoginStage.LoginCreds,
    },
    signUp: {
      show: false,
      stage: SignUpStage.Email,
    },
    forgotPassword: {
      show: false,
      stage: ForgetPasswordStage.Email,
    },
  });
  const [loginInput, setLoginInput] = useState({ ...InitialLoginInput });
  const [signUpInput, setSignUpInput] = useState({ ...InitialSignUpInput });
  const [forgotPassInput, setForgotPassInput] = useState({
    ...InitialForgetPassInput,
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUserDetails, logOut } = useContext(AuthContext);

  const login = async () => {
    try {
      setLoading(true);
      const data = await axios.post(baseURL + "/login", loginInput);
      setLoading(false);
      setError(false);
      setUserDetails(data.data.user);
      localStorage.setItem("userDetails", JSON.stringify(data.data.user));
      navigate("/");
    } catch (error) {
      if (error.response.status === 401) {
        logOut();
      }
      setError(true);
      setPopUpObjFunc(popUpObjArr, setPopUpObjArr, {
        show: true,
        msg: error.response.data.message,
        type: "Error",
      });
    } finally {
      setLoading(false);
    }
  };

  const getOtp = async () => {
    try {
      setLoading(true);
      const data = await axios.post(baseURL + "/signup", signUpInput);
      setLoading(false);
      setError(false);
      setPopUpObjFunc(popUpObjArr, setPopUpObjArr, {
        show: true,
        msg: data.data.message,
        type: "Success",
      });
      const tempObj = { ...stages };
      tempObj.signUp.stage = SignUpStage.OTP;
      setStages(tempObj);
    } catch (error) {
      if (error.response.status === 401) {
        logOut();
      }
      setError(true);
      setPopUpObjFunc(popUpObjArr, setPopUpObjArr, {
        show: true,
        msg: error.response.data.message,
        type: "Error",
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    try {
      setLoading(true);
      const data = await axios.post(baseURL + "/verify-otp", signUpInput);
      setLoading(false);
      setError(false);
      setPopUpObjFunc(popUpObjArr, setPopUpObjArr, {
        show: true,
        msg: data.data.message,
        type: "Success",
      });
      const tempObj = { ...stages };
      tempObj.signUp.stage = SignUpStage.CreatePassword;
      setStages(tempObj);
    } catch (error) {
      if (error.response.status === 401) {
        logOut();
      }
      setError(true);
      setPopUpObjFunc(popUpObjArr, setPopUpObjArr, {
        show: true,
        msg: error.response.data.message,
        type: "Error",
      });
    } finally {
      setLoading(false);
    }
  };

  const signup = async () => {
    try {
      setLoading(true);
      const data = await axios.post(baseURL + "/createPassword", signUpInput);
      setLoading(false);
      setError(false);
      setPopUpObjFunc(popUpObjArr, setPopUpObjArr, {
        show: true,
        msg: data.data.message,
        type: "Success",
      });
      const tempObj = { ...stages };
      tempObj.signUp.stage = SignUpStage.Done;
      setStages(tempObj);
    } catch (error) {
      if (error.response.status === 401) {
        logOut();
      }
      setError(true);
      setPopUpObjFunc(popUpObjArr, setPopUpObjArr, {
        show: true,
        msg: error.response.data.message,
        type: "Error",
      });
    } finally {
      setLoading(false);
    }
  };

  const forgotPass = async () => {
    try {
      setLoading(true);
      const data = await axios.post(
        baseURL + "/forgotPassword",
        forgotPassInput
      );
      setLoading(false);
      setError(false);
      setPopUpObjFunc(popUpObjArr, setPopUpObjArr, {
        show: true,
        msg: data.data.message,
        type: "Success",
      });
      const tempObj = { ...stages };
      tempObj.forgotPassword.stage = ForgetPasswordStage.OTP;
      setStages(tempObj);
    } catch (error) {
      if (error.response.status === 401) {
        logOut();
      }
      setError(true);
      setPopUpObjFunc(popUpObjArr, setPopUpObjArr, {
        show: true,
        msg: error.response.data.message,
        type: "Error",
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyOtpReset = async () => {
    try {
      setLoading(true);
      const data = await axios.post(baseURL + "/verify-otp", forgotPassInput);
      setLoading(false);
      setError(false);
      setPopUpObjFunc(popUpObjArr, setPopUpObjArr, {
        show: true,
        msg: data.data.message,
        type: "Success",
      });
      const tempObj = { ...stages };
      tempObj.forgotPassword.stage = ForgetPasswordStage.SetPassword;
      setStages(tempObj);
    } catch (error) {
      if (error.response.status === 401) {
        logOut();
      }
      setError(true);
      setPopUpObjFunc(popUpObjArr, setPopUpObjArr, {
        show: true,
        msg: error.response.data.message,
        type: "Error",
      });
    } finally {
      setLoading(false);
    }
  };

  const setPass = async () => {
    try {
      setLoading(true);
      const data = await axios.post(
        baseURL + "/resetPassword",
        forgotPassInput
      );
      setLoading(false);
      setError(false);
      setPopUpObjFunc(popUpObjArr, setPopUpObjArr, {
        show: true,
        msg: data.data.message,
        type: "Success",
      });
      const tempObj = { ...stages };
      tempObj.forgotPassword.stage = ForgetPasswordStage.Done;
      setStages(tempObj);
    } catch (error) {
      if (error.response.status === 401) {
        logOut();
      }
      setError(true);
      setPopUpObjFunc(popUpObjArr, setPopUpObjArr, {
        show: true,
        msg: error.response.data.message,
        type: "Error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginContainer">
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
      <div className="responsiveContainer">
        <div className="top">
          <img src={logoSm} alt="logo" className="logo" />
          <span>Alpha Projects</span>
        </div>
        <div className="bottom">
          <div className="loginCard">
            <div
              className="left"
              style={
                stages.signUp.stage === SignUpStage.Done ||
                stages.forgotPassword.stage === ForgetPasswordStage.Done
                  ? { backgroundColor: "#00A37D" }
                  : {}
              }
            >
              <div className="content">
                <div className="title">
                  {stages.forgotPassword.show
                    ? stages.forgotPassword.stage ===
                      ForgetPasswordStage.SetPassword
                      ? "Set Password"
                      : stages.forgotPassword.stage === ForgetPasswordStage.Done
                      ? "Welcome to Alpha Projects"
                      : "Forgot Password"
                    : "Welcome to Alpha Projects"}
                </div>
                <div className="desc">
                  {stages.forgotPassword.show
                    ? stages.forgotPassword.stage ===
                      ForgetPasswordStage.SetPassword
                      ? "Set a strong password to protect your account."
                      : stages.forgotPassword.stage === ForgetPasswordStage.Done
                      ? "We offer data display and Decision Support platform to promote and provide information about Alpha projects."
                      : "Reset your Alpha Projects software password to account access. Don’t worry. We’ll help you to fix it."
                    : "We offer data display and Decision Support platform to promote and provide information about Alpha projects. "}
                </div>
              </div>
              <div className="img">
                <img src={vector} alt="" className="vector" />
              </div>
            </div>
            <div className="right">
              {stages.login.show && (
                <LoginInputs
                  login={login}
                  loginInput={loginInput}
                  setLoginInput={setLoginInput}
                  stages={stages}
                  setStages={setStages}
                  error={error}
                  setError={setError}
                  loading={loading}
                />
              )}
              {stages.signUp.show && (
                <SignupInputs
                  stage={stages.signUp.stage}
                  signupInput={signUpInput}
                  setSignupInput={setSignUpInput}
                  stages={stages}
                  setStages={setStages}
                  error={error}
                  setError={setError}
                  getOtp={getOtp}
                  verifyOtp={verifyOtp}
                  signup={signup}
                  loading={loading}
                />
              )}
              {stages.forgotPassword.show && (
                <ForgotPassword
                  stage={stages.forgotPassword.stage}
                  forgotPassInput={forgotPassInput}
                  setForgotPassInput={setForgotPassInput}
                  stages={stages}
                  setStages={setStages}
                  error={error}
                  setError={setError}
                  forgotPass={forgotPass}
                  verifyOtpReset={verifyOtpReset}
                  setPass={setPass}
                  loading={loading}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
