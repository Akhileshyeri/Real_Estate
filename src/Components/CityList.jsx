import React, { useEffect, useState } from "react";
import Header from "./Header";
import api from "../api/api";
import { useNavigate, useParams } from "react-router-dom";

const StateList = () => {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  const fetchStates = async () => {
    setLoading(true); // start loader
    const fd = new FormData();
    fd.append("programType", "getStateListOnChangeOfCountry");
    fd.append("authToken", localStorage.getItem("authToken"));
    fd.append("country", id);

    try {
      const response = await api.post("properties/preRequirements", fd);
      if (response?.data?.success && response?.data?.data) {
        setStates(response.data.data);
      }
    } catch (error) {
      console.error("State fetch error:", error);
    } finally {
      setLoading(false); // stop loader
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  if (loading) {
    return (
      <div>
        <Header />
        <div
          style={{
            minHeight: "80vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div className="bouncing-cubes">
            <div className="cube" style={{ backgroundColor: "#EC2126" }}></div>
            <div className="cube" style={{ backgroundColor: "#EC2126" }}></div>
            <div className="cube" style={{ backgroundColor: "#EC2126" }}></div>
          </div>
          <p className="mt-3">Loading states...</p>
        </div>

        <style>{`
          .bouncing-cubes {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            height: 50px;
          }
          
          .cube {
            width: 20px;
            height: 20px;
            animation: bounce 1.5s infinite ease-in-out;
          }
          
          .cube:nth-child(2) {
            animation-delay: 0.2s;
          }
          
          .cube:nth-child(3) {
            animation-delay: 0.4s;
          }
          
          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-20px);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div>
      <Header />

      {/* Page Title */}
      <section className="flat-title-page">
        <div className="container">
          <h2 className="text-center">States Covered</h2>
          <ul className="breadcrumb">
            <li>
              <a href="/home">Home</a>
            </li>
            <li>/ States</li>
          </ul>
        </div>
      </section>

      {/* State List */}
      <section className="flat-section">
        <div className="container">
          <div className="row">
            {states.length > 0 ? (
              states.map((state) => (
                <div
                  key={state.id}
                  className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3"
                >
                  <div
                    className="state-card"
                    onClick={() =>
                      navigate("/listing", { state: { selectedState: state.name } })
                    }
                  >
                    <h5 className="mb-0 text-center" style={{fontSize:"15px"}}>{state.name}</h5>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted">No states found.</p>
            )}
          </div>
        </div>
      </section>

      {/* Hover Styles */}
      <style jsx="true">{`
        .state-card {
          background: #ffffff;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          cursor: pointer;
          font-size: 10px;
          font-weight: 500;
          color: #000;
        }
        .state-card:hover {
          transform: translateY(-6px);
          background: #ED2027;
          color: #fff;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }
        .state-card:hover h5 {
          color: #fff;
        }
      `}</style>
    </div>
  );
};

export default StateList;
