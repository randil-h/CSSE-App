import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/utility/Navbar";

export default function Registration() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const customerData = { ...formData };

    try {
      const response = await axios.post('https://csse-backend.vercel.app/customer', customerData);

      if (response.status === 201) { // Assuming 201 means successful registration
        console.log('Customer registered successfully');
        navigate("/customers"); // Navigate to confirmation page
      } else {
        console.error('Failed to register customer');
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-100">
      {/* Navbar */}
      <div className="sticky top-0 z-10">
        <Navbar />
      </div>

      <div className="flex flex-1 justify-center items-center p-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6 max-w-lg w-full space-y-6"
        >
          <h2 className="text-2xl font-bold text-center">Customer Registration</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 p-2 block w-full appearance-none text-sm border-0  border-b-2 hover:border-b-sky-700 transition-all duration-200 focus:ring-0 focus:ring-offset-0 bg-transparent ring-sky-400 placeholder:text-gray-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 p-2 block w-full appearance-none text-sm border-0  border-b-2 hover:border-b-sky-700 transition-all duration-200 focus:ring-0 focus:ring-offset-0 bg-transparent ring-sky-400 placeholder:text-gray-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 p-2 block w-full appearance-none text-sm border-0  border-b-2 hover:border-b-sky-700 transition-all duration-200 focus:ring-0 focus:ring-offset-0 bg-transparent ring-sky-400 placeholder:text-gray-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 p-2 block  w-full appearance-none text-sm border-0  border-b-2 hover:border-b-sky-700 transition-all duration-200 focus:ring-0 focus:ring-offset-0 bg-transparent ring-sky-400 placeholder:text-gray-400"
              required
            />
          </div>
          <div className="flex space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="mt-1 p-2 block w-full appearance-none text-sm border-0  border-b-2 hover:border-b-sky-700 transition-all duration-200 focus:ring-0 focus:ring-offset-0 bg-transparent ring-sky-400 placeholder:text-gray-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="mt-1 p-2 block w-full appearance-none text-sm border-0  border-b-2 hover:border-b-sky-700 transition-all duration-200 focus:ring-0 focus:ring-offset-0 bg-transparent ring-sky-400 placeholder:text-gray-400"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Postal Code</label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              className="mt-1 p-2 block w-full appearance-none text-sm border-0  border-b-2 hover:border-b-sky-700 transition-all duration-200 focus:ring-0 focus:ring-offset-0 bg-transparent ring-sky-400 placeholder:text-gray-400"
              required
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-sky-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-sky-800 transition"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
