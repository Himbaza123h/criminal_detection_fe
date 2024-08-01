// src/pages/SystemUsers/ViewSystemUsers.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../components/Header/index';
import Sidebar from '../../components/Sidebar/Admin/index';
import Modal from 'react-modal';
import { fetchSystemUsers, deleteSystemUser, updateSystemUser } from '../../slices/systemUserSlice';

Modal.setAppElement('#root'); // Set the root element for accessibility

const ViewSystemUsers = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [editUserData, setEditUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    user_type: ''
  });

  const dispatch = useDispatch();
  const { users, status, error, next, previous } = useSelector((state) => state.systemUsers);

  useEffect(() => {
    dispatch(fetchSystemUsers());
  }, [dispatch]);

  const handleNextPage = () => {
    if (next) {
      const page = new URL(next).searchParams.get('page');
      dispatch(fetchSystemUsers(page));
    }
  };

  const handlePreviousPage = () => {
    if (previous) {
      const page = new URL(previous).searchParams.get('page');
      dispatch(fetchSystemUsers(page));
    }
  };

  const filteredUsers = users.filter((user) =>
    user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (userId) => {
    setSelectedUserId(userId);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedUserId(null);
    setModalIsOpen(false);
  };

  const openEditModal = (user) => {
    setEditUserData(user);
    setEditModalIsOpen(true);
  };

  const closeEditModal = () => {
    setEditModalIsOpen(false);
  };

  const handleDelete = async () => {
    if (selectedUserId) {
      await dispatch(deleteSystemUser(selectedUserId));
      closeModal();
      dispatch(fetchSystemUsers());
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditUserData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const { public_id, ...data } = editUserData;
    await dispatch(updateSystemUser({ id: public_id, data }));
    closeEditModal();
    dispatch(fetchSystemUsers());
  };

  useEffect(() => {
    if (status === 'succeeded') {
      console.log('Fetched Users:', users);
    }
    if (status === 'failed') {
      console.error('Error fetching users:', error);
    }
  }, [status, users, error]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-col flex-1 overflow-y-auto">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-grow p-4 md:p-6 lg:p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">View System Users</h1>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          {status === 'loading' && <p>Loading...</p>}
          {status === 'failed' && <p>Error: {error}</p>}
          {status === 'succeeded' && filteredUsers.length === 0 && <p>No users found</p>}
          {status === 'succeeded' && filteredUsers.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">N/O</th>
                      <th className="px-4 py-2">First Name</th>
                      <th className="px-4 py-2">Last Name</th>
                      <th className="px-4 py-2">Email</th>
                      <th className="px-4 py-2">Phone Number</th>
                      <th className="px-4 py-2">Role</th>
                      <th className="px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, index) => (
                      <tr key={user.public_id}>
                        <td className="border px-4 py-2">{index + 1}</td>
                        <td className="border px-4 py-2">{user.first_name}</td>
                        <td className="border px-4 py-2">{user.last_name}</td>
                        <td className="border px-4 py-2">{user.email}</td>
                        <td className="border px-4 py-2">{user.phone_number}</td>
                        <td className="border px-4 py-2">{user.user_type}</td>
                        <td className="border px-4 py-2">
                          <button
                            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                            onClick={() => openEditModal(user)}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                            onClick={() => openModal(user.public_id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between mt-4">
                <button
                  onClick={handlePreviousPage}
                  disabled={!previous}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={!next}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </main>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Confirm Delete"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
          <p>Are you sure you want to delete this user?</p>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Yes, Delete
            </button>
            <button
              onClick={closeModal}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={editModalIsOpen}
        onRequestClose={closeEditModal}
        contentLabel="Edit User"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg mx-auto my-8 w-full max-w-lg">
          <h2 className="text-xl font-bold mb-4">Edit User</h2>
          <form onSubmit={handleEditSubmit} className="space-y-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">First Name</label>
              <input
                type="text"
                name="first_name"
                value={editUserData.first_name}
                onChange={handleEditChange}
                placeholder="Enter first name"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={editUserData.last_name}
                onChange={handleEditChange}
                placeholder="Enter last name"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={editUserData.email}
                onChange={handleEditChange}
                placeholder="Enter email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
              <input
                type="text"
                name="phone_number"
                value={editUserData.phone_number}
                onChange={handleEditChange}
                placeholder="Enter phone number"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Role</label>
              <select
                name="user_type"
                value={editUserData.user_type}
                onChange={handleEditChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="" disabled>Select role</option>
                <option value="Admin">Admin</option>
                <option value="Police">Police</option>
                <option value="User">User</option>
              </select>
            </div>
            <div className="flex justify-end col-span-2">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={closeEditModal}
                className="bg-red-500 hover:bg-danger-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default ViewSystemUsers;
