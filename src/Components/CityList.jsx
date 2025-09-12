import React, { useEffect, useState } from "react";
import Header from "./Header";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const CityList = () => {
  const [cities, setCities] = useState([]);
  const navigate = useNavigate()

  const fetchCity = async () => {
    const fd = new FormData();
    fd.append("programType", "getCityDetails");
    fd.append("authToken", localStorage.getItem("authToken"));

    try {
      const response = await api.post("properties/preRequirements", fd);
      console.log(response);
      
      if (response?.data?.success) {
        setCities(response.data.data || []);
      }
    } catch (error) {
      console.error("City fetch error:", error);
    }
  };

  useEffect(() => {
    fetchCity();
  }, []);

  return (
    <div>
      <Header />

      {/* Page Title */}
      <section className="flat-title-page">
        <div className="container">
          <h2 className="text-center">Cities Covered</h2>
          <ul className="breadcrumb">
            <li>
              <a href="/home">Home</a>
            </li>
            <li>/ City</li>
          </ul>
        </div>
      </section>

      {/* City Cards */}
      <section className="flat-section">
        <div className="container">
          <div className="row">
            {cities.length > 0 ? (
              cities.map((city) => (
                <div key={city.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                  <div className="card h-100 shadow-sm border-0">
                    <img
                      // src={`${api.imageUrl}${city.image_name}`}
                      src="https://static.vecteezy.com/system/resources/previews/026/314/060/non_2x/of-a-city-skyline-with-tall-buildings-and-trees-in-a-flat-icon-style-vector.jpg"
                      alt={city.name}
                      className="card-img-top"
                      style={{ height: "180px", objectFit: "cover" }}
                      onClick={() =>navigate("/listing")}
                    />
                    <div className="card-body text-center">
                      <h5 className="card-title mb-0">{city.name}</h5>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted">No cities found.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CityList;
