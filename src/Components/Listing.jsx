import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { Modal, Slider } from 'antd'; // Import only for functionality, not styling!
import "./Listing.css";
import nodata from "../assets/nodata.png"
import { Select } from "antd";
const { Option } = Select;


const Listing = () => {
    const { search } = useLocation();
    const [limit, setLimit] = useState(10);

    const [properties, setProperties] = useState([]);
    const [page, setPage] = useState(1);

    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    // Advanced filter states (functionality only, NOT HomePage styling)
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [selectedListingType, setSelectedListingType] = useState("");
    const [selectedType, setSelectedType] = useState("All");
    const [priceRange, setPriceRange] = useState([0, 50000000]);
    const [rentRange, setRentRange] = useState([0, 200000]);

    const [selectedBHK, setSelectedBHK] = useState("");
    const [selectedBathroom, setSelectedBathroom] = useState("");
    const [selectedBedroom, setSelectedBedroom] = useState("");
    const [selectedCity, setSelectedCity] = useState("");

    const [states, setStates] = useState([]);
    const [selectedState, setSelectedState] = useState(null);



    const navigate = useNavigate();


    // 🔹 Track when initial filters are ready
    const [filtersReady, setFiltersReady] = useState(false);

    useEffect(() => {
        const query = new URLSearchParams(search);

        const listingType = query.get("listingType") || "";
        const type = query.get("type") || "All";
        const bhk = query.get("bhk") || "";
        const bathrooms = query.get("bathrooms") || "";
        const bedrooms = query.get("bedrooms") || "";
        const city = query.get("city") || "";

        const priceMin = query.get("priceMin");
        const priceMax = query.get("priceMax");
        const rentMin = query.get("rentMin");
        const rentMax = query.get("rentMax");

        setSelectedListingType(listingType);
        setSelectedType(type);
        setSelectedBHK(bhk);
        setSelectedBathroom(bathrooms);
        setSelectedBedroom(bedrooms);
        setSelectedCity(city);

        let filters = { listingType, type, bhk, bathrooms, bedrooms, city, priceRange, rentRange };

        if (listingType === "rent" && rentMin && rentMax) {
            const range = [+rentMin, +rentMax];
            setRentRange(range);
            filters.rentRange = range;
        } else if (listingType === "sale" && priceMin && priceMax) {
            const range = [+priceMin, +priceMax];
            setPriceRange(range);
            filters.priceRange = range;
        }

        // ✅ Mark filters ready and fetch page 1
        setFiltersReady(true);
        fetchList(1, filters);
    }, [search]);

    // 🔹 Handle pagination AFTER filters are ready
    useEffect(() => {
        if (!filtersReady) return;
        fetchList(page);
    }, [page, filtersReady, limit]);






    const fetchList = async (pageNumber = 1, filters = null) => {
        setLoading(true);
        const fd = new FormData();
        fd.append("programType", "getProperties");
        fd.append("authToken", localStorage.getItem("authToken"));
        fd.append("page", pageNumber);
        fd.append("limit", limit);

        const appliedFilters = filters || {
            listingType: selectedListingType,
            type: selectedType,
            bhk: selectedBHK,
            bathrooms: selectedBathroom,
            bedrooms: selectedBedroom,
            city: selectedCity,
            priceRange,
            rentRange
        };

        if (appliedFilters.listingType) fd.append("listing_type", appliedFilters.listingType);
        if (appliedFilters.type && appliedFilters.type !== "All") fd.append("sub_property_type", appliedFilters.type);
        if (appliedFilters.city) fd.append("city", appliedFilters.city);
        if (appliedFilters.bathrooms) fd.append("bathrooms", appliedFilters.bathrooms);
        if (appliedFilters.bhk) fd.append("apartment_bhk", appliedFilters.bhk);
        if (appliedFilters.bedrooms) fd.append("bedrooms", appliedFilters.bedrooms);

        if (appliedFilters.listingType === "rent" && appliedFilters.rentRange) {
            fd.append("priceStart", appliedFilters.rentRange[0]);
            fd.append("priceEnd", appliedFilters.rentRange[1]);
        } else if (appliedFilters.listingType === "sale" && appliedFilters.priceRange) {
            fd.append("priceStart", appliedFilters.priceRange[0]);
            fd.append("priceEnd", appliedFilters.priceRange[1]);
        }


        console.log("Submitting form data:");
        for (let pair of fd.entries()) {
            console.log(pair[0], pair[1]); // Logs each key-value pair
        }



        try {
            const response = await api.post("/properties/property", fd);

            console.log(response)
            const { properties, page, limit } = response.data.data;
            const mapped = properties.map((item) => {
                let priceValue = "N/A";
                let priceUnit = "";

                if (item.listing_type === "rent") {
                    priceValue = item.expected_rent && item.expected_rent !== "0.00"
                        ? item.expected_rent
                        : "N/A";
                    priceUnit = item.rent_period ? `/${item.rent_period}` : "/month";
                } else {
                    priceValue = item.expected_price && item.expected_price !== "0.00"
                        ? item.expected_price
                        : "N/A";
                }

                // dynamically prepare meta info
                const metaInfo = [];
                if (item.bedrooms) {
                    metaInfo.push({ icon: "icon-bed", label: `${item.bedrooms} Beds` });
                }
                if (item.bathrooms) {
                    metaInfo.push({ icon: "icon-bathtub", label: `${item.bathrooms} Baths` });
                }
                if (item.carpet_area) {
                    metaInfo.push({
                        icon: "icon-ruler",
                        label: `${item.carpet_area} ${item.carpet_area_unit || ""}`,
                    });
                }

                return {
                    id: item.id,
                    image: item.image_path,
                    name: item.title,
                    location: item.location,
                    featured: item.featured === 1,
                    for: item.listing_type,
                    type: item.property_type_id,
                    detailsUrl: `/property/${item.slug}`,
                    avatar: "/assets/images/default-agent.jpg",
                    agentName: item.customerName || "Agent",
                    priceValue,
                    priceUnit,
                    metaInfo,
                };
            });

            setProperties(mapped);

            // if API provides total count, compute totalPages
            if (response.data.data.total) {
                setTotalPages(Math.ceil(response.data.data.total / limit));
            } else {
                // fallback: stop if less results than limit
                setTotalPages(mapped.length < limit ? page : page + 1);
            }
        } catch (error) {
            console.error("Error fetching properties:", error);
        } finally {
            setLoading(false);
        }
    };

    // Property types for filtering
    const propertyTypes = [
        "Flat / Apartment",
        "Independent House / Villa",
        "Farmhouse",
        "Serviced Apartment",
        "1 RK / Studio Apartment",
        "Independent Floor",
        "Plot / Land",
        "Office",
        "Retail"
    ];





    const handleOpenAdvanced = () => setShowAdvanced(true);
    const handleCloseAdvanced = () => setShowAdvanced(false);

    // Skeleton card for loading
    const SkeletonCard = () => (
        <div className="col-md-12">
            <div className="homeya-box list-style-1 list-style-2">
                <div className="images-group">
                    <div className="images-style skeleton" style={{ height: "200px" }}></div>
                </div>
                <div className="content p-3">
                    <div className="skeleton mb-2" style={{ height: "20px", width: "60%" }}></div>
                    <div>
                        <div className="skeleton mb-2" style={{ height: "15px", width: "40%" }}></div>
                        <div className="skeleton" style={{ height: "15px", width: "80%" }}></div>
                        <div className="skeleton" style={{ height: "15px", width: "40%" }}></div>
                    </div>
                </div>
            </div>
        </div>
    );



    const fetchStates = async () => {
        const fd = new FormData();
        fd.append("programType", "getStateListOnChangeOfCountry");
        fd.append("authToken", localStorage.getItem("authToken"));
        fd.append("country", 101);

        try {
            const response = await api.post("properties/preRequirements", fd);
            if (response.data.success) {
                setStates(response.data.data); // 👈 store states
            }
        } catch (error) {
            console.error("State fetch error:", error);
        }
    };


    useEffect(() => {
        fetchStates();
    }, []);


    return (

        <div>
            <Header />
            <section className="flat-section-v6 flat-recommended flat-sidebar">
                <div className="container">
                    <div className="box-title-listing">
                        <h5>Property listing</h5>
                        <div className="box-filter-tab">
                            <ul className="nav-tab-filter" role="tablist">
                                <li className="nav-tab-item" role="presentation">
                                    <a href="#gridLayout" className="nav-link-item" data-bs-toggle="tab"><i className="icon icon-grid"></i></a>
                                </li>
                                <li className="nav-tab-item" role="presentation">
                                    <a href="#listLayout" className="nav-link-item active" data-bs-toggle="tab"><i className="icon icon-list"></i></a>
                                </li>
                            </ul>
                            {/* <div className="nice-select list-page" tabindex="0"><span className="current">12 Per Page</span>
                                <ul className="list">
                                    <li data-value="1" className="option">10 Per Page</li>
                                    <li data-value="2" className="option">11 Per Page</li>
                                    <li data-value="3" className="option selected">12 Per Page</li>
                                </ul>
                            </div> */}
                            <div className="nice-select list-page" tabIndex="0">
                                <span className="current">{limit} Per Page</span>
                                <ul className="list">
                                    <li
                                        className={`option ${limit === 5 ? "selected" : ""}`}
                                        onClick={() => { setPage(1); setLimit(5); }}
                                    >
                                        5 Per Page
                                    </li>
                                    <li
                                        className={`option ${limit === 10 ? "selected" : ""}`}
                                        onClick={() => { setPage(1); setLimit(10); }}
                                    >
                                        10 Per Page
                                    </li>
                                    <li
                                        className={`option ${limit === 15 ? "selected" : ""}`}
                                        onClick={() => { setPage(1); setLimit(15); }}
                                    >
                                        15 Per Page
                                    </li>
                                </ul>
                            </div>




                            <div className="nice-select list-sort" tabindex="0"><span className="current">Sort by (Default)</span>
                                <ul className="list">
                                    <li data-value="default" className="option selected">Sort by (Default)</li>
                                    <li data-value="new" className="option">Newest</li>
                                    <li data-value="old" className="option">Oldest</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xl-4 col-lg-5">
                            <div className="widget-sidebar fixed-sidebar">
                                <div className="flat-tab flat-tab-form widget-filter-search widget-box bg-surface mb-4" style={{ background: "#f7f7f7" }}>
                                    <div className="h7 title fw-7">Search</div>
                                    <ul className="nav-tab-form" role="tablist">
                                        <li className="nav-tab-item">
                                            <a
                                                href="#forRent"
                                                className={`nav-link-item ${selectedListingType === "rent" ? "active" : ""}`}
                                                onClick={e => { e.preventDefault(); setSelectedListingType("rent"); setSelectedType("All"); }}
                                            >For Rent</a>
                                        </li>
                                        <li className="nav-tab-item">
                                            <a
                                                href="#forSale"
                                                className={`nav-link-item ${selectedListingType === "sale" ? "active" : ""}`}
                                                onClick={e => { e.preventDefault(); setSelectedListingType("sale"); setSelectedType("All"); }}
                                            >For Sale</a>
                                        </li>
                                    </ul>
                                    <div className="tab-content">
                                        <div className="tab-pane fade active show" role="tabpanel">
                                            <div className="form-sl">
                                                <form method="post">
                                                    <div className="wd-filter-select">
                                                        <div className="inner-group inner-filter">
                                                            <div className="form-style">
                                                                <label className="title-select">Keyword</label>
                                                                <input type="text" className="form-control" placeholder="Search Keyword." required="" />
                                                            </div>
                                                            <div className="form-group-2 form-style">
                                                                <label>Location</label>
                                                                <div className="group-select">
                                                                    <div className="nice-select" tabIndex="0">
                                                                        <span className="current">Select Location</span>
                                                                        <ul className="list">

                                                                            <li data-value="india" className="option">India</li>
                                                                            <li data-value="dubai" className="option">Dubai</li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="form-style">
                                                                <label className="title-select">State</label>
                                                                <Select
                                                                    showSearch
                                                                    placeholder="Select State"
                                                                    value={selectedState}
                                                                    onChange={(value) => setSelectedState(value)}
                                                                    filterOption={(input, option) =>
                                                                        (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
                                                                    }
                                                                    style={{ width: "100%", height:"45px" }}
                                                                >
                                                                    {states.map((s) => (
                                                                        <Option key={s.id} value={s.name}>
                                                                            {s.name}
                                                                        </Option>
                                                                    ))}
                                                                </Select>
                                                            </div>


                                                            <div className="form-style">
                                                                <label className="title-select">Type</label>
                                                                <div className="group-select">
                                                                    <div className="nice-select" tabIndex="0">
                                                                        <span className="current">{selectedType}</span>
                                                                        <ul className="list">
                                                                            <li
                                                                                className={`option ${selectedType === "All" ? "selected" : ""}`}
                                                                                onClick={() => setSelectedType("All")}
                                                                            >All</li>
                                                                            {propertyTypes.map(type => (
                                                                                <li
                                                                                    key={type}
                                                                                    className={`option ${selectedType === type ? "selected" : ""}`}
                                                                                    onClick={() => setSelectedType(type)}
                                                                                >{type}</li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/* 👇 Advanced filters right below Type */}
                                                            {showAdvanced && (
                                                                <div className="advanced-filters mt-3 p-3" style={{ borderRadius: "8px", border: "1px solid #eee" }}>
                                                                    {selectedListingType === "rent" ? (
                                                                        <div style={{ marginBottom: "25px" }}>
                                                                            <h6>Rent Range</h6>
                                                                            <Slider
                                                                                range
                                                                                min={0}
                                                                                max={200000}
                                                                                step={1000}
                                                                                value={rentRange}
                                                                                onChange={setRentRange}
                                                                            />
                                                                            <div>
                                                                                <span>₹{rentRange[0]}</span> - <span>₹{rentRange[1]}</span>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <div style={{ marginBottom: "25px" }}>
                                                                            <h6>Price Range</h6>
                                                                            <Slider
                                                                                range
                                                                                min={0}
                                                                                max={50000000}
                                                                                step={50000}
                                                                                value={priceRange}
                                                                                onChange={setPriceRange}
                                                                            />
                                                                            <div>
                                                                                <span>₹{priceRange[0]}</span> - <span>₹{priceRange[1]}</span>
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {/* Property type conditionals */}
                                                                    {["Flat / Apartment", "Independent House / Villa", "Farmhouse", "Serviced Apartment", "1 RK / Studio Apartment", "Independent Floor"].includes(selectedType) && (
                                                                        <>
                                                                            <div style={{ marginBottom: "20px", }}>
                                                                                <h6 className='mb-3'>BHK Type</h6>
                                                                                {["1 BHK", "2 BHK", "3 BHK", "4 BHK", "4+ BHK"].map(bhk => {
                                                                                    const bhkNumber = bhk.split(" ")[0]; // "1", "2", "3", "4", "4+"
                                                                                    return (
                                                                                        <button
                                                                                            key={bhk}
                                                                                            type="button"
                                                                                            style={{
                                                                                                marginRight: "10px",
                                                                                                marginBottom: "10px",
                                                                                                background: selectedBHK === bhk ? "#EC2126" : "#fff",
                                                                                                color: selectedBHK === bhk ? "#fff" : "#333",
                                                                                                border: selectedBHK === bhk ? "2px solid #EC2126" : "1px solid #ccc",
                                                                                                borderRadius: "20px",
                                                                                                padding: "8px 16px",
                                                                                                cursor: "pointer"
                                                                                            }}
                                                                                            onClick={() => {
                                                                                                setSelectedBHK(bhk);
                                                                                                setSelectedBedroom(bhkNumber); // 👈 auto-select bedroom
                                                                                            }}
                                                                                        >
                                                                                            {bhk}
                                                                                        </button>
                                                                                    );
                                                                                })}

                                                                            </div>

                                                                            <div style={{ marginBottom: "20px" }}>
                                                                                <h6 className='mb-3'>Bedrooms</h6>
                                                                                {["1", "2", "3", "4", "4+"].map(bed => (
                                                                                    <button
                                                                                        key={bed}
                                                                                        type="button"
                                                                                        disabled={selectedBedroom === bed} // 👈 disable if same as BHK
                                                                                        style={{
                                                                                            marginRight: "10px",
                                                                                            marginBottom: "10px",
                                                                                            background: selectedBedroom === bed ? "#EC2126" : "#fff",
                                                                                            color: selectedBedroom === bed ? "#fff" : "#333",
                                                                                            border: selectedBedroom === bed ? "2px solid #EC2126" : "1px solid #ccc",
                                                                                            borderRadius: "20px",
                                                                                            padding: "8px 16px",
                                                                                            cursor: selectedBedroom === bed ? "not-allowed" : "pointer",
                                                                                            opacity: selectedBedroom === bed ? 0.6 : 1
                                                                                        }}
                                                                                        onClick={() => setSelectedBedroom(bed)}
                                                                                    >
                                                                                        {bed}
                                                                                    </button>
                                                                                ))}
                                                                            </div>

                                                                            <div>
                                                                                <h6 className='mb-3'>Bathrooms</h6>
                                                                                {["1", "2", "3", "4", "4+"].map(bath => (
                                                                                    <button
                                                                                        key={bath}
                                                                                        type="button"
                                                                                        style={{
                                                                                            marginRight: "10px",
                                                                                            background: selectedBathroom === bath ? "#EC2126" : "#fff",
                                                                                            color: selectedBathroom === bath ? "#fff" : "#333",
                                                                                            border: selectedBathroom === bath ? "2px solid #EC2126" : "1px solid #ccc",
                                                                                            borderRadius: "20px",
                                                                                            padding: "8px 16px",
                                                                                            cursor: "pointer"
                                                                                        }}
                                                                                        onClick={() => setSelectedBathroom(bath)}
                                                                                    >
                                                                                        {bath}
                                                                                    </button>
                                                                                ))}
                                                                            </div>
                                                                        </>
                                                                    )}

                                                                    {selectedType === "Plot / Land" && (
                                                                        <div>
                                                                            <h6>Plot Size</h6>
                                                                            <Slider range min={500} max={10000} step={100} defaultValue={[1000, 5000]} />
                                                                            <h6>Facing</h6>
                                                                            {["East", "West", "North", "South"].map(dir => (
                                                                                <button key={dir} type="button" style={{ marginRight: "10px" }}>{dir}</button>
                                                                            ))}
                                                                        </div>
                                                                    )}

                                                                    {(selectedType === "Office" || selectedType === "Retail") && (
                                                                        <div>
                                                                            <h6>Carpet Area (sq.ft)</h6>
                                                                            <Slider range min={200} max={10000} step={100} defaultValue={[500, 5000]} />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}

                                                            {/* Toggle button */}
                                                            <div className="form-style btn-show-advanced">
                                                                <a
                                                                    className="filter-advanced pull-right"
                                                                    onClick={() => setShowAdvanced(prev => !prev)}
                                                                    style={{ cursor: "pointer" }}
                                                                >
                                                                    <span className="icon icon-faders"></span>
                                                                    <span className="text-advanced">{showAdvanced ? "Hide Advanced" : "Show Advanced"}</span>
                                                                </a>
                                                            </div>

                                                        </div>
                                                        <button
                                                            type="button"
                                                            className="tf-btn primary"
                                                            onClick={() => fetchList(1)}
                                                        >
                                                            Find Properties
                                                        </button>

                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>



                            </div>

                        </div>
                        <div className="col-xl-8 col-lg-7">
                            <div className="tab-content">

                                <div
                                    className="tab-pane fade active show"
                                    id="listLayout"
                                    role="tabpanel"
                                >
                                    <div className="row">
                                        {loading
                                            ? [...Array(limit)].map((_, i) => <SkeletonCard key={i} />)
                                            : properties.length === 0 ? (
                                                <div className="col-12 text-center py-5 mt-3">
                                                    <img
                                                        src={nodata} // 👈 replace with your own image path
                                                        alt="No Property Found"
                                                        style={{ maxWidth: "280px", marginBottom: "20px" }}
                                                    />
                                                    <h5>No Property Found</h5>
                                                    <p>Try adjusting your filters or search criteria.</p>
                                                </div>
                                            ) : (
                                                properties.map((property) => (
                                                    <div className="col-md-12" key={property.id}>
                                                        <div className="homeya-box list-style-1 list-style-2">
                                                            <Link to={`/property/${property.id}`} className="images-group">
                                                                <div className="images-style">
                                                                    <img
                                                                        src={
                                                                            property.image
                                                                                ? `${api.imageUrl}/${property.image}`
                                                                                : "https://themesflat.co/html/homzen/images/home/house-2.jpg"
                                                                        }
                                                                        alt={property.name}
                                                                        style={{
                                                                            width: "100%",       // full width of container
                                                                            height: "220px",     // fixed height
                                                                            objectFit: "cover",  // crops instead of stretching
                                                                            borderRadius: "8px", // optional rounded corners
                                                                        }}
                                                                    />

                                                                </div>
                                                                <div className="top">
                                                                    <ul className="d-flex gap-4 flex-wrap">
                                                                        <li className="flag-tag style-1">{property.for}</li>
                                                                    </ul>
                                                                </div>
                                                                <div className="bottom">
                                                                    <span className="flag-tag style-2">
                                                                        {property.type}
                                                                    </span>
                                                                </div>
                                                            </Link>
                                                            <div className="content" onClick={() => navigate(`/property/${property.id}`)}>
                                                                <div className="archive-top">
                                                                    <div className="h7 text-capitalize fw-7">
                                                                        {property.name}
                                                                    </div>
                                                                    <div className="desc">
                                                                        <i className="fs-16 icon icon-mapPin"></i>
                                                                        <p>{property.location}</p>
                                                                    </div>
                                                                    <ul className="meta-list">
                                                                        {property.metaInfo.map((meta, i) => (
                                                                            <li className="item" key={i}>
                                                                                <i className={`icon ${meta.icon}`}></i>{" "}
                                                                                <span>{meta.label}</span>
                                                                            </li>
                                                                        ))}
                                                                    </ul>

                                                                </div>
                                                                <div className="d-flex justify-content-between align-items-center archive-bottom">
                                                                    <div className="d-flex gap-8 align-items-center">
                                                                        <div className="avatar avt-40 round">
                                                                            <img
                                                                                src="https://themesflat.co/html/homzen/images/avatar/avt-9.jpg"
                                                                                alt="avt"
                                                                            />
                                                                        </div>
                                                                        <span>{property.agentName}</span>
                                                                    </div>
                                                                    <div className="d-flex align-items-center">
                                                                        <div className="h7 fw-7">
                                                                            ₹{property.priceValue}
                                                                        </div>
                                                                        <span className="text-variant-1">
                                                                            {property.priceUnit}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                    </div>

                                    {/* Pagination */}
                                    <ul className="justify-content-center wd-navigation">
                                        {[...Array(totalPages)].map((_, i) => (
                                            <li key={i}>
                                                <button
                                                    style={{ border: "none" }}
                                                    onClick={() => {
                                                        setPage(i + 1);
                                                        window.scrollTo({ top: 0, left: 0, behavior: "instant" }); // ✅ scroll here
                                                    }}
                                                    className={`nav-item ${page === i + 1 ? "active" : ""}`}
                                                >
                                                    {i + 1}
                                                </button>
                                            </li>
                                        ))}
                                        <li>
                                            <button
                                                style={{ border: "none" }}
                                                onClick={() => {
                                                    setPage((prev) => Math.min(prev + 1, totalPages));
                                                    window.scrollTo({ top: 0, left: 0, behavior: "instant" }); // ✅ scroll here too
                                                }}
                                                className="nav-item"
                                            >
                                                <i className="icon icon-arr-r"></i>
                                            </button>
                                        </li>
                                    </ul>

                                </div>
                            </div>
                        </div>
                    </div>



                </div>
            </section>


            <div className="progress-wrap">
                <svg className="progress-circle svg-content" width="100%" height="100%" viewBox="-1 -1 102 102">
                    <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" style={{ transition: 'stroke-dashoffset 10ms linear 0s', strokeDasharray: '307.919, 307.919', strokeDashoffset: '286.138' }}></path>
                </svg>
            </div>
            < Footer />
        </div>

    )
}

export default Listing