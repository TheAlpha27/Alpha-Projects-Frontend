export const baseURL = "http://localhost:4000";
// export const baseURL = "https://alpha-projects-backend.onrender.com";

export const UserTypes = {
  user: "User",
  guest: "Guest",
  admin: "Admin",
};

export const UserStatus = {
  active: "Active",
  inactive: "Inactive",
};

export const ProjectStatus = {
  notStarted: "Not Started",
  inProgress: "In Progress",
  completed: "Completed",
};

export const Sections = {
  projects: 1,
  users: 2,
};

export const ProjectView = {
  map: 1,
  table: 2,
  board: 3,
};

export const LoginStage = {
  LoginCreds: 1,
};

export const SignUpStage = {
  Email: 1,
  OTP: 2,
  CreatePassword: 3,
  Done: 4,
};

export const ForgetPasswordStage = {
  Email: 1,
  OTP: 2,
  SetPassword: 3,
  Done: 4,
};

export const InitialProject = {
  project_name: "",
  project_category: "",
  project_manager: "",
  client: "",
  city: "",
  country: "",
  contract_amount: "",
};

export const InitialProjectErrors = {
  project_name: false,
  project_category: false,
  project_manager: false,
  client: false,
  city: false,
  country: false,
  contract_amount: false,
};

export const InitialLoginInput = { email: "", password: "" };

export const InitialSignUpInput = {
  email: "",
  otp: "",
  password: "",
  confirmPass: "",
  fullname: "",
};

export const InitialForgetPassInput = {
  email: "",
  otp: "",
  password: "",
  confirmPass: "",
};
