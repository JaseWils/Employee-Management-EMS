

import React, { useState } from "react";
import axios from 'axios';
import { NavLink } from "react-router-dom";

const AddAdmin = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photo: null
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const URL = process.env.REACT_APP_BACKEND_URL;
    console.log(URL)
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    if (formData.photo) {
      data.append("photo", formData.photo);
    }

    // Retrieve token from localStorage or any other source
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `${URL}/admin`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`  // Include the token here
          }
        }
      );
      console.log(response.data);
      alert(response.data.message);
    } catch (error) {
      alert(error.message);
      console.error("There was an error adding the admin!", error);
    }
  };


  const boxStyle = {
    background: "white",
    padding: "21px",
    borderTop: "5px solid #004dffe8",
    borderRadius: "5px",
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg"
        style={{ backgroundColor: "rgb(0 77 255 / 65%)" }}
      >
        <div className="container mt-5">
          <NavLink
            className="navbar-brand"
            style={{
              fontSize: "25px",
              color: "white",
              letterSpacing: ".05125em",
            }}
            to="/"
          >
            Admin
          </NavLink>

          <div className="mt-2 pt-2">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <NavLink
                    to="/"
                    className="text-dark fw-semibold text-decoration-none"
                  >
                    Home
                  </NavLink>
                </li>
                <li
                  className="breadcrumb-item active fw-semibold text-decoration-underline"
                  aria-current="page"
                >
                  Add
                </li>
                <li className="breadcrumb-item">
                  <NavLink
                    to="/manageAdmin"
                    className="text-dark fw-semibold text-decoration-none"
                  >
                    ManageAdmin
                  </NavLink>
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </nav>
      <div className="container my-2 pt-3">
        <h2>Admin Management</h2>
      </div>
      <div className="mb-4 pt-3 extra-special">
        <div className="row d-flex justify-content-evenly" style={boxStyle}>
          <h5 style={{ fontSize: "20px" }} className="px-2">
            Add Admin
          </h5>
          <hr />
          <div className="col-12">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <b>Admin Name</b>
                <span style={{ color: "red" }}>*</span>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  style={{ border: "1px solid" }}
                />
              </div>
              <div className="mb-3">
                <b>Admin Photo</b>
                <span style={{ color: "red" }}>*</span>
                <input
                  type="file"
                  className="form-control"
                  name="photo"
                  id="photo"
                  onChange={handleChange}
                  style={{ border: "1px solid" }}
                />
              </div>
              <div className="mb-3">
                <b>Admin Email </b>
                <span style={{ color: "red" }}>*</span>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="name@mail.com"
                  value={formData.email}
                  onChange={handleChange}
                  style={{ border: "1px solid" }}
                />
              </div>
              <div>
                <button
                  type="button"
                  className="btn btn-outline-danger float-end mx-1"
                  id="applyleave"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary float-end mx-1"
                  id="submit"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddAdmin;
