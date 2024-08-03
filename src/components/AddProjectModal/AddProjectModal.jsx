import React from "react";
import Input from "../Input/Input";

const AddProjectModal = ({
  setNewProject,
  newProject,
  errors,
  handleSave,
  handleClose,
}) => {
  return (
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
  );
};

export default AddProjectModal;
