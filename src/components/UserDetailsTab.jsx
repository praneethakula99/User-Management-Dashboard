// UserDetailsTab.jsx
import React, { useState, useEffect } from "react";
import { BiSearch } from "react-icons/bi";
import axios from "axios";

const UserDetailsTab = () => {
  // ------------------- STATES -------------------
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ------------------- FETCH DATA -------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          "https://jsonplaceholder.typicode.com/users"
        );
        // Add a fake creationDate for UI purpose
        const usersWithDate = data.map((user) => ({
          ...user,
          creationDate: new Date(
            Date.now() - Math.random() * 1e10
          ).toLocaleDateString(),
        }));
        setUsers(usersWithDate);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ------------------- EVENT HANDLERS -------------------
  const handleRowClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleGenerateReport = () => {
    alert(`Report generated for ${selectedUser.username}`);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const handlePageChange = (page) => setCurrentPage(page);

  const handleUsersPerPageChange = (e) => {
    setUsersPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // ------------------- FILTERING + PAGINATION -------------------
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.phone.toLowerCase().includes(searchTerm)
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // ------------------- CONDITIONAL RENDERING -------------------
  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-xl">
        Loading users...
      </div>
    );
  if (error)
    return (
      <div className="text-center text-red-600 font-semibold mt-10">
        Error: {error}
      </div>
    );

  // ------------------- MAIN JSX -------------------
  return (
    <div className="flex flex-col justify-center items-center p-6">
      <h2 className="text-4xl mt-2 mb-6 text-pink-600 font-extrabold tracking-wide leading-tight">
        User Details
      </h2>

      {/* Search + Pagination Controls */}
      <div className="flex gap-4 items-center mb-4">
        <div className="relative">
          <input
            className="p-3 w-64 lg:w-96 text-lg text-gray-900 border border-gray-300 rounded-full pl-10 focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white"
            type="text"
            placeholder="Search Username, Email, Phone"
            onChange={handleSearch}
          />
          <BiSearch className="absolute left-3 top-3 text-2xl text-gray-500" />
        </div>

        <label htmlFor="usersPerPage" className="text-lg">
          Users Per Page:
        </label>
        <select
          id="usersPerPage"
          className="text-lg border border-gray-300 rounded p-1"
          value={usersPerPage}
          onChange={handleUsersPerPageChange}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
        </select>
      </div>

      <h3 className="mt-2 text-xl font-semibold border-b-2 border-pink-500 pb-2">
        Select a User to Generate Report
      </h3>

      {/* User Table */}
      <div className="w-full mt-4 overflow-x-auto">
        <table className="w-full bg-white border border-gray-200 divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="pt-2 pb-3">ID</th>
              <th className="pt-2 pb-3">Username</th>
              <th className="pt-2 pb-3">Email</th>
              <th className="pt-2 pb-3">Phone</th>
              <th className="pt-2 pb-3">Creation Date</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr
                key={user.id}
                onClick={() => handleRowClick(user)}
                className={`${
                  user.id % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100 cursor-pointer`}
              >
                <td className="pt-2 pb-2 pl-8 text-center">{user.id}</td>
                <td className="pt-2 pb-2 pl-8">{user.username}</td>
                <td className="pt-2 pb-2 pl-8">{user.email}</td>
                <td className="pt-2 pb-2 pl-8">{user.phone}</td>
                <td className="pt-2 pb-2 pl-8">{user.creationDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="pagination flex flex-row mt-5 items-center">
        <button
          className="rounded-lg bg-gray-700 py-2 px-4 text-sm font-bold uppercase text-white shadow-md hover:bg-gray-800 disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        <span className="text-lg mx-4">
          Page {currentPage} of {Math.ceil(filteredUsers.length / usersPerPage)}
        </span>
        <button
          className="rounded-lg bg-gray-700 py-2 px-4 text-sm font-bold uppercase text-white shadow-md hover:bg-gray-800 disabled:opacity-50"
          disabled={indexOfLastUser >= filteredUsers.length}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-70"
            onClick={handleCloseModal}
          ></div>
          <div className="relative bg-white w-96 p-6 rounded-lg shadow-lg z-10">
            <button
              className="absolute top-2 right-4 text-3xl text-red-500 hover:text-red-700"
              onClick={handleCloseModal}
            >
              &times;
            </button>
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              User Details
            </h3>
            <p className="mb-2">
              <strong>Username:</strong> {selectedUser.username}
            </p>
            <p className="mb-2">
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <p className="mb-2">
              <strong>Phone:</strong> {selectedUser.phone}
            </p>
            <button
              className="mt-4 bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
              onClick={handleGenerateReport}
            >
              Generate Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetailsTab;
