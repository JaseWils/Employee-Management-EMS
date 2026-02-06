
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from 'axios';

const ManageAdmin = () => {
  const [entries, setEntries] = useState(1);
  const [search, setSearch] = useState("");
  const [admins, setAdmins] = useState([]);
  const [totalAdmins, setTotalAdmins] = useState(0);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/admins`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });
        setAdmins(response.data.admins);
        setTotalAdmins(response.data.total);
      } catch (error) {
        console.error("Error fetching admins:", error);
      }
    };
    fetchAdmins();
  }, []);

  const handleEdit = (id) => {
    // Handle edit logic
    console.log(`Edit admin with ID: ${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/admin/${id}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      setAdmins(admins.filter(admin => admin._id !== id));
      alert("Admin deleted successfully!");
    } catch (error) {
      console.error("Error deleting admin:", error);
      alert("Error deleting admin!");
    }
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
                  Manage
                </li>
                <li className="breadcrumb-item">
                  <NavLink
                    to="/addAdmin"
                    className="text-dark fw-semibold text-decoration-none"
                  >
                    Add Admin
                  </NavLink>
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </nav>
      <div className="pt-4 extra-special3 text-dark">
        <h1 className="fs-2 mb-4">Manage Admin</h1>

        <div
          className="bg-white text-dark p-4 rounded-top rounded-bottom-1 shadow"
          style={{ borderTop: "5px solid #004dffe8" }}
        >
          <h2 className="fs-4 fw-semibold mb-4 border-bottom pb-2">
            View Admin
          </h2>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center gap-2">
              <label htmlFor="entries" className="fs-6">
                Show
              </label>
              <select
                id="entries"
                className="form-select border-1 border-black form-select-sm"
                value={entries}
                onChange={(e) => setEntries(e.target.value)}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
              <span className="fs-6">entries</span>
            </div>

            <div className="d-flex align-items-center gap-2">
              <input
                type="text"
                placeholder="Search"
                className="form-control d-none d-md-flex"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="btn btn-danger btn-sm">Search</button>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-striped table-bordered tablestyle">
              <thead className="">
                <tr>
                  <th className="py-2 px-4 ">#</th>
                  <th className="py-2 px-4 ">Admin Name</th>
                  <th className="py-2 px-4 ">Admin Photo</th>
                  <th className="py-2 px-4 ">Admin Email</th>
                  <th className="py-2 px-4 ">Actions</th>
                </tr>
              </thead>
              <tbody className="">
                {admins.map((admin, index) => (
                  <tr key={admin._id}>
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4">{admin.name}</td>
                    <td className="text-center">
                      <img
                        className="rounded-2"
                        src={admin.photoUrl || "https://placehold.co/64x64"}
                        alt="img-Profile"
                      />
                    </td>
                    <td className="py-2 px-4">{admin.email}</td>
                    <td className="py-2 px-4">
                      <span
                        className="badge text-bg-success mx-1 px-2"
                        onClick={() => handleEdit(admin._id)}
                        style={{ cursor: 'pointer' }}
                      >
                        Edit
                      </span>
                      <span
                        className="badge text-bg-danger mx-1 px-2"
                        onClick={() => handleDelete(admin._id)}
                        style={{ cursor: 'pointer' }}
                      >
                        Delete
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-4">
            <span className="fs-6">Showing 1 to {entries} of {totalAdmins} entries</span>
            <div className="d-flex gap-1">
              <button className="btn btn-primary btn-sm">&lt;</button>
              <button className="btn btn-primary btn-sm">1</button>
              <button className="btn btn-primary btn-sm">&gt;</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageAdmin;
