import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Cases = () => {
  axios.defaults.withCredentials = true;
  const [cases, setCases] = useState([]);

  // Define fetchData outside useEffect
  const fetchData = async () => {
    try {
      const listingResp = await axios.get("/api/cases");
      setCases(listingResp.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // Call fetchData inside useEffect
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/cases/${id}`);
      // Use the callback function form of setCases to ensure you're working with the latest state
      setCases((prevCases) =>
        prevCases.filter((listing) => listing._id !== id)
      );
    } catch (error) {
      console.error("Error deleting case:", error);
    }
  };

  return (
    <div className="container mx-auto mt-8 flex justify-center">
      <div className="max-w-[1000px]"> {/* Adjusted width to max-w-[1000px] */}
        <h1 className="text-3xl font-bold mb-4 text-center">Cases</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-center">
          {cases.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-md p-4 w-full min-w-[250px]"
            >
              <h2 className="text-xl font-semibold mb-2">{item.clientName}</h2>
              <div className="flex justify-between">
                <Link
                  to={`/cases/${item._id}`}
                  className="text-blue-600 hover:underline"
                >
                  View
                </Link>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
                <Link
                  to={`/cases/${item._id}/edit`}
                  className="text-gray-600 hover:underline"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cases;
