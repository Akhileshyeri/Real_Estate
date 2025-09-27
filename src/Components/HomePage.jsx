import React, { useState, useEffect, useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Header from './Header';
import Footer from './Footer';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import "./HomePage.css"
import { Modal, Slider } from "antd"; // ✅ Import Modal
import nodata from "../assets/nodata.png"
import Dub from "../assets/du.jpg"
import { encryptId } from '../utils/crypto';
import { slugify } from '../utils/slugify';
import gps from "../assets/gps.png"
import { useMediaQuery } from "react-responsive";





const HomePage = () => {


    const [recentProperties, setRecentProperties] = useState([]);

const isTabletOrMobile = useMediaQuery({ maxWidth: 768 });


    const [reviews, setReviews] = useState([]);



    const [bannerUrl, setBannerUrl] = useState(""); // state for dynamic banner
    const [popupBanner, setPopupBanner] = useState(""); // state for dynamic banner
    const [stickyBanner, setStickyBanner] = useState(""); // state for dynamic banner

    const [footerBannerUrl, setFooterBannerUrl] = useState(""); // state for footer banner
    const [offset, setOffset] = useState(307.919); // full length (hidden)
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("View All"); // keep track of which tab is clicked
    const navigate = useNavigate()
    const [bannersLoading, setBannersLoading] = useState(true); // 👈 new state
    const [showPopup, setShowPopup] = useState(false);

    const [showSticky, setShowSticky] = useState(false);

    const authToken = localStorage.getItem("authToken") || "Guest";
    localStorage.setItem("authToken", authToken);


    const [blogs, setBlogs] = useState([]);

    const [page, setPage] = useState(1); // current page
    const [hasMore, setHasMore] = useState(true); // to check if more blogs exist


    const [priceRange, setPriceRange] = useState([0, 10000000]); // Default price range
    const [selectedBHK, setSelectedBHK] = useState(''); // Default BHK selection

    const [showAdvanced, setShowAdvanced] = useState(false);
    const [selectedBathroom, setSelectedBathroom] = useState("");
    const [selectedBedrooms, setSelectedBedrooms] = useState("");

    const [states, setStates] = useState([]);
    const [selectedState, setSelectedState] = useState("Select State");
    const [searchQuery, setSearchQuery] = useState("");

    const [detectedCity, setDetectedCity] = useState("");
    const [detectedState, setDetectedState] = useState("");
    const [detectedCountry, setDetectedCountry] = useState("");




    const handleOpenAdvanced = () => setShowAdvanced(true);
    const handleCloseAdvanced = () => setShowAdvanced(false);


    const addToRecent = (property) => {
        let recent = JSON.parse(localStorage.getItem("recentProperties")) || [];

        // normalize property shape
        const parsed = JSON.parse(storedRecent).map(p => ({
            id: p.id,
            title: p.title || p.name || "Untitled",
            image: p.image || null,
            location: p.location || "Unknown Location",
            price: p.price || "Price on Request",
            priceValue: p.priceValue || 0,
            priceUnit: p.priceUnit || "",
            status: p.status || "N/A",
            subType: p.subType || "N/A",
            meta: p.meta || [],
            agentName: p.agentName || "Agent", // ✅ add this line
            createdAt: p.createdAt || new Date().toISOString(),
        }));


        // remove duplicate if already exists
        recent = recent.filter((p) => p.id !== normalized.id);

        // add to start
        recent.unshift(normalized);

        // ✅ keep only 3
        if (recent.length > 2) {
            recent = recent.slice(0, 2);
        }

        // save to localStorage
        localStorage.setItem("recentProperties", JSON.stringify(recent));

        // ✅ update React state immediately
        setRecentProperties(recent);
    };




    useEffect(() => {
        setLoading(true);

        const storedRecent = localStorage.getItem("recentProperties");
        if (storedRecent) {
            const parsed = JSON.parse(storedRecent).map(p => ({
                id: p.id,
                title: p.title || p.name || "Untitled",
                image: p.image || null,
                location: p.location || "Unknown Location",

                price: p.price || "Price on Request",
                priceValue: p.priceValue || 0,
                priceUnit: p.priceUnit || "",

                status: p.status || "N/A",
                subType: p.subType || "N/A",

                // 👇 keep meta array intact
                meta: p.meta || [],
                agentName: p.agentName || "Agent",

                createdAt: p.createdAt || new Date().toISOString(),
            }));


            const today = new Date().toLocaleDateString();
            const todayRecent = parsed
                .filter(p => {
                    const createdAt = new Date(p.createdAt).toLocaleDateString();
                    return createdAt === today;
                })
                .slice(0, 3);   // ✅ enforce limit 6

            setRecentProperties(todayRecent);
        } else {
            setRecentProperties([]);
        }


        setLoading(false);
    }, []);


    useEffect(() => {
        if (popupBanner) {
            const hasSeenPopup = localStorage.getItem("hasSeenPopup");

            if (!hasSeenPopup) {
                const timer = setTimeout(() => {
                    setShowPopup(true);
                    localStorage.setItem("hasSeenPopup", "true"); // mark as shown
                }, 10000);

                return () => clearTimeout(timer);
            }
        }
    }, [popupBanner]);

    useEffect(() => {
        if (stickyBanner) {
            const hasSeenSticky = localStorage.getItem("hasSeenSticky");

            if (!hasSeenSticky) {
                setShowSticky(true);
                localStorage.setItem("hasSeenSticky", "true"); // mark as shown
            }
        }
    }, [stickyBanner]);

    const words = ["Dream Home", "Perfect Home", "Real Estate"];
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % words.length);
        }, 2000); // change every 2 seconds
        return () => clearInterval(interval);
    }, [words.length]);


    const [selectedListingType, setSelectedListingType] = useState("rent"); // rent | sale
    const [selectedType, setSelectedType] = useState("All");

    // Property types
    const propertyTypes = [
        "Flat / Apartment",
        "Independent House / Villa",
        "Farmhouse",
        "Serviced Apartment",
        "1 RK / Studio Apartment",
        "Independent Floor",
        "Plot / Land",   // ✅ already there
        "Office",        // ✅ new
        "Retail"         // ✅ new
    ];


    const [rentRange, setRentRange] = useState([0, 200000]); // ✅ separate rent range

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                    );
                    const data = await response.json();

                    const city =
                        data.address.city ||
                        data.address.town ||
                        data.address.village ||
                        "";
                    const state = data.address.state || "";
                    const country = data.address.country || "";

                    setDetectedCity(city);
                    setDetectedState(state);
                    setDetectedCountry(country);

                    if (state) setSelectedState(state);

console.log("Detected Location:", city, state, country);

                    // ✅ Navigate to listing with detected location
                    const queryParams = new URLSearchParams({
                        country: country || "",
                        state: state || "",
                        city: city || "",
                        state: state, // 👈 keep state here

                    });

                    navigate(`/listing?${queryParams.toString()}`);
                } catch (error) {
                    console.error("Error fetching location details:", error);
                }
            },
            (error) => {
                console.error("Geolocation error:", error);
                alert("Unable to fetch location. Please enable GPS.");
            }
        );
    };




    useEffect(() => {
        // Trigger animation after component mounts
        const timer = setTimeout(() => {
            setOffset(286.138); // target value
        }, 100); // small delay so animation is visible
        return () => clearTimeout(timer);
    }, []);
    const [home, setHome] = useState({

        amenities: [],
        properties: [],
        agents: [],
        testimonials: [],
        blogs: []
    });


    const [allProperties, setAllProperties] = useState([]); // store all properties


    // 👇 runs whenever activeTab changes
    // ✅ Fetch once on mount
    useEffect(() => {
        fetchAllProperties();
    }, []);

    // 🔹 Fetch everything from backend (no filter here)
    const fetchAllProperties = async () => {
        setLoading(true);
        const fd = new FormData();
        fd.append("programType", "getProperties");
        fd.append("authToken", authToken);
        fd.append("limit", 9);
        fd.append("page", 1);
        // 🔹 Read country from localStorage
        const countryCode = localStorage.getItem("country");
        let countryName = "";

        if (countryCode === "101") {
            countryName = "india";
        } else if (countryCode === "229") {
            countryName = "dubai";
        }

        // ✅ Append country name instead of numeric code
        if (countryName) {
            fd.append("country", countryName);
        }

        console.log("country", countryName)


        try {
            const response = await api.post("/properties/property", fd);
            console.log("list", response)
            const mapped = response.data.data.properties.map((item) => {
                let priceValue = "N/A";
                let priceUnit = "";

                if (item.listing_type === "rent") {
                    priceValue = item.expected_rent && item.expected_rent !== "0.00" ? item.expected_rent : "N/A";
                    priceUnit = item.rent_period ? `/${item.rent_period}` : "/month";
                } else {
                    priceValue = item.expected_price && item.expected_price !== "0.00" ? item.expected_price : "N/A";
                }

                let meta = [];
                if (item.sub_property_type_id?.toLowerCase().includes("plot")) {
                    meta.push({ icon: "icon-ruler", label: `${item.carpet_area} ${item.carpet_area_unit || ""}` });
                } else if (item.title?.toLowerCase().includes("warehouse")) {
                    meta.push({ icon: "icon-ruler", label: `${item.carpet_area} ${item.carpet_area_unit || ""}` });
                    meta.push({ icon: "icon-bathtub", label: `${item.washrooms || 0} Washrooms` });
                } else {
                    meta.push({ icon: "icon-bed", label: `${item.bedrooms || 0}` });
                    meta.push({ icon: "icon-bathtub", label: `${item.bathrooms || 0}` });
                    meta.push({ icon: "icon-ruler", label: `${item.carpet_area} ${item.carpet_area_unit || ""}` });
                }

                return {
                    id: item.id,
                    image: item.image_path,
                    name: item.title,
                    location: item.location,
                    featured: item.featured === 1,
                    for: item.listing_type,
                    type: item.property_type_id,
                    subType: item.sub_property_type_id, // 👈 keep subtype
                    detailsUrl: `/property/${item.slug}`,
                    avatar: "/assets/images/default-agent.jpg",
                    agentName: item.customerName || "Agent",
                    priceValue,
                    priceUnit,
                    meta,
                };
            });

            setAllProperties(mapped);
            setProperties(mapped); // default: show all
        } catch (error) {
            console.error("Error fetching properties:", error);
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Run filtering whenever tab changes
    useEffect(() => {
        if (activeTab === "View All") {
            setProperties(allProperties);
        } else {
            setProperties(
                allProperties.filter((p) =>
                    p.subType?.toLowerCase().includes(activeTab.toLowerCase())
                )
            );
        }
    }, [activeTab, allProperties]);


    const bannerList = async () => {
        setBannersLoading(true);
        const fd = new FormData();
        fd.append("programType", "getBannerDetails");
        fd.append("authToken", authToken);

        try {
            const response = await api.post("properties/preRequirements", fd);
            console.log("banners", response)

            if (response.data && response.data.data) {
                const banners = response.data.data;
                const baseURL = api.imageUrl;

                const heroBanner = banners.find(b => b.type === "Hero Banner");
                if (heroBanner && heroBanner.sliderImage) {
                    setBannerUrl(heroBanner.sliderImage);
                }

                const popupBanner = banners.find(b => b.type === "Popup Banner");
                if (popupBanner && popupBanner.sliderImage) {
                    setPopupBanner(popupBanner.sliderImage);
                }

                const stickyBanner = banners.find(b => b.type === "Sticky Banner");
                if (stickyBanner && stickyBanner.sliderImage) {
                    setStickyBanner(stickyBanner.sliderImage);
                }


                const footerBanner = banners.find(b => b.type === "Footer Banner");
                if (footerBanner && footerBanner.sliderImage) {
                    setFooterBannerUrl(footerBanner.sliderImage);
                }
            }
        } catch (error) {
            console.error("banner error:", error);
        } finally {
            setBannersLoading(false);
        }
    };

    useEffect(() => {
        bannerList();
    }, []);









    // Load first page on mount
    useEffect(() => {
        bloglist(1); // always load page 1 explicitly
    }, []);

    // Load more handler
    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        bloglist(nextPage); // pass nextPage explicitly
    };

    const bloglist = async (currentPage) => {
        setLoading(true);
        const fd = new FormData();
        fd.append("programType", "getBlogDetails");
        fd.append("authToken", localStorage.getItem("authToken"));
        fd.append("limit", 3);
        fd.append("page", currentPage);

        try {
            const response = await api.post("/properties/preRequirements", fd);
            console.log(response)
            if (response.data.success) {
                const newBlogs = response.data.data;

                if (currentPage === 1) {
                    // First page, replace the blogs
                    setBlogs([])
                    setBlogs(newBlogs);
                } else {
                    // Append subsequent pages
                    setBlogs((prev) => [...prev, ...newBlogs]);
                }

                if (newBlogs.length < 1) {
                    setHasMore(false);
                }
            }
        } catch (error) {
            console.error("blog error:", error);
        } finally {
            setLoading(false);
        }
    };



    // update whenever localStorage authToken changes (like after login)
    useEffect(() => {
        const checkToken = () => {
            setAuthToken(localStorage.getItem("authToken") || "Guest");
        };

        // listen for changes across tabs/windows
        window.addEventListener("storage", checkToken);

        return () => {
            window.removeEventListener("storage", checkToken);
        };
    }, []);

    // 🔹 Call reviewList whenever authToken changes & is not Guest
    useEffect(() => {
        if (authToken && authToken !== "Guest") {
            reviewList();
        }
    }, [authToken]);


    const reviewList = async () => {
        const fd = new FormData();
        fd.append("programType", "getAllInquiryDetails");
        fd.append("authToken", authToken);

        try {
            const response = await api.post("/properties/propertyInquiry", fd);
            console.log("ReviewDetails home", response);

            if (response.data.success && response.data.data) {
                setReviews(
                    Array.isArray(response.data.data)
                        ? response.data.data
                        : [response.data.data]
                );
            }
        } catch (error) {
            console.error("Review error:", error);
        }
    };








    const [showSearch, setShowSearch] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 580) {
                setShowSearch(true);
            } else {
                setShowSearch(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const addToRecentProperties = (property) => {
        const recent = JSON.parse(localStorage.getItem("recentProperties")) || [];
        const filtered = recent.filter((p) => p.id !== property.id);

        filtered.unshift({
            id: property.id,
            name: property.name,
            image: property.image,
            detailsUrl: property.detailsUrl || `/property/${property.id}`,
            location: property.location,
            priceValue: property.priceValue,
            priceUnit: property.priceUnit,
            agentName: property.agentName,  // ✅ okay here
            meta: property.meta,
            featured: property.featured,
            type: property.type,
            subType: property.subType,
            for: property.for,
        });

        const latest = filtered.slice(0, 4);
        localStorage.setItem("recentProperties", JSON.stringify(latest));
    };

    const fetchStates = async () => {
        const fd = new FormData();
        fd.append("programType", "getStateListOnChangeOfCountry");
        fd.append("authToken", localStorage.getItem("authToken"));
        fd.append("country", localStorage.getItem("country"));

        try {
            const response = await api.post("properties/preRequirements", fd);
            if (response.data?.success) {
                setStates(response.data.data); // 👈 store states
            }
        } catch (error) {
            console.error("State fetch error:", error);
        }
    };

    useEffect(() => {
        fetchStates();
    }, []);


    // flatten reviews into a single array of review objects
    const reviewSlides = useMemo(() => {
        if (!Array.isArray(reviews)) return [];
        return reviews.flatMap(prop => Array.isArray(prop.review) ? prop.review : []);
    }, [reviews]);





    // ✅ Show loader until both banners and properties are ready
    if (loading || bannersLoading) {
        return (
            <div>
                <Header showSearch={showSearch} />




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
                    <p className="mt-3">Loading property details...</p>
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
                .cube:nth-child(2) { animation-delay: 0.2s; }
                .cube:nth-child(3) { animation-delay: 0.4s; }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
            `}</style>
            </div>
        );
    }




    return (
        <div className='body bg-surface '>
            <div id="wrapper">
                <div id="pagee" className="clearfix">
                    <Header showSearch={showSearch} />


                    {/* ✅ Floating search bar */}

                    {/* SLIDER & TABS */}
                    <section
                        className="flat-slider home-1"
                        style={{
                            backgroundImage: bannerUrl
                                ? `url(${api.imageUrl}${bannerUrl})`
                                : "https://eu-central.storage.cloudconvert.com/tasks/ae46ca00-b99e-40e7-9cb8-2407fd19666c/appartment.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=cloudconvert-production%2F20250908%2Ffra%2Fs3%2Faws4_request&X-Amz-Date=20250908T080423Z&X-Amz-Expires=86400&X-Amz-Signature=a8431c7d4a33a3b9c76a84e1b4bfab05bf20dcb08377eaa2513f43da782d4a95&X-Amz-SignedHeaders=host&response-content-disposition=inline%3B%20filename%3D%22appartment.jpg%22&response-content-type=image%2Fjpeg&x-id=GetObject",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            height: "800px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative"
                        }}
                    >
                        <div className="container relative">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="slider-content">
                                        <div className="heading text-center">
                                            <h1 className="text-white animationtext slide">
                                                Find Your
                                                <span className="tf-text s1 cd-words-wrapper">
                                                    <span className="item-text is-visible">Dream Home</span>
                                                    <span className="item-text is-hidden">Perfect Home</span>
                                                    <span className="item-text is-hidden">Real Estate</span>
                                                </span>
                                            </h1>
                                            <p className="subtitle text-white body-1 wow fadeIn" data-wow-delay=".8s" data-wow-duration="2000ms">We are a real estate agency that will help you find the best residence you dream of, let’s discuss for your dream house?</p>
                                        </div>
                                        <div className="flat-tab flat-tab-form">
                                            <ul className="nav-tab-form style-1 justify-content-center" role="tablist">
                                                <li className="nav-tab-item">
                                                    <a
                                                        href="#forRent"
                                                        className={`nav-link-item ${selectedListingType === "rent" ? "active" : ""}`}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setSelectedListingType("rent");
                                                            setSelectedType("All"); // reset
                                                        }}
                                                    >
                                                        For Rent
                                                    </a>
                                                </li>
                                                <li className="nav-tab-item">
                                                    <a
                                                        href="#forSale"
                                                        className={`nav-link-item ${selectedListingType === "sale" ? "active" : ""}`}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setSelectedListingType("sale");
                                                            setSelectedType("All"); // reset
                                                        }}
                                                    >
                                                        For Buy
                                                    </a>
                                                </li>
                                                <li className="nav-tab-item">
                                                    <a
                                                        href="#jointVenture"
                                                        className={`nav-link-item ${selectedListingType === "joint" ? "active" : ""}`}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setSelectedListingType("joint");
                                                            setSelectedType("All"); // reset
                                                        }}
                                                    >
                                                        Joint Venture
                                                    </a>
                                                </li>
                                            </ul>


                                            <div className="tab-content">
                                                <div className="tab-pane fade active show" role="tabpanel">
                                                    <div className="form-sl">
                                                        <form method="post">
                                                            <div className="wd-find-select">
                                                                <div className="inner-group">
                                                                    <div className="form-group-1 search-form form-style">
                                                                        <label>Search</label>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            placeholder="Search Properties"
                                                                            title="Search for"
                                                                            value={searchQuery}
                                                                            onChange={(e) => setSearchQuery(e.target.value)}
                                                                            required
                                                                        />

                                                                    </div>
                                                                  


                                                                    <div className="form-group-3 form-style">
                                                                        <label>Type</label>
                                                                        <div className="group-select">
                                                                            <div className="nice-select" tabIndex="0">
                                                                                <span className="current">{selectedType}</span>
                                                                                <ul className="list">
                                                                                    <li
                                                                                        className={`option ${selectedType === "All" ? "selected" : ""}`}
                                                                                        onClick={() => setSelectedType("All")}
                                                                                    >
                                                                                        All
                                                                                    </li>
                                                                                    {propertyTypes.map((type) => (
                                                                                        <li
                                                                                            key={type}
                                                                                            className={`option ${selectedType === type ? "selected" : ""}`}
                                                                                            onClick={() => setSelectedType(type)}
                                                                                        >
                                                                                            {type}
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* ✅ GPS Icon */}

                                                                    <span
                                                                        type="button"
                                                                        onClick={handleDetectLocation}
                                                                        style={{
                                                                          
                                                                               padding: isTabletOrMobile ? "8px" :  "20px",
                                                                            backgroundColor: "#F0F4FF",
                                                                            border: "none",
                                                                            marginRight: "20px",
                                                                            cursor: "pointer",
                                                                            color: "#5D87FF",
                                                                            borderRadius: "50%",
                                                                            display: "flex",
                                                                            alignItems: "center",
                                                                            justifyContent: "center",
                                                                        }}
                                                                        title="Detect my location"
                                                                    >
                                                                        <img
                                                                            src={gps}
                                                                            alt="gps"
                                                                            width={isTabletOrMobile ? "20px" : "80px"}
                                                                            height={isTabletOrMobile ? "20px" : "80px"}
                                                                        />
                                                                    </span>

                                                                    {/* Show detected location */}
                                                                    {/* {detectedCity && (
                                                                        <p style={{ marginTop: "5px", fontSize: "12px", color: "#555" }}>
                                                                            {detectedCity}, {detectedState}, {detectedCountry}
                                                                        </p>
                                                                    )} */}



                                                                    <div className="form-group-4 box-filter">
                                                                        <span
                                                                            className="filter-advanced pull-right"
                                                                            onClick={handleOpenAdvanced}
                                                                            style={{ cursor: "pointer" }}
                                                                        >
                                                                            <span className="icon icon-faders"></span>
                                                                            <span className="text-1">Advanced</span>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    className="tf-btn primary"
                                                                    onClick={() => {
                                                                        // build query params
                                                                        const queryParams = new URLSearchParams({
                                                                            country: detectedCountry || "",   // 👈 add country
                                                                            state: detectedState || "",       // 👈 add state
                                                                            city: detectedCity || "",         // 👈 add city
                                                                            state: selectedState,   // 👈 add state here
                                                                            listingType: selectedListingType,
                                                                            type: selectedType,
                                                                            priceMin: priceRange[0],
                                                                            priceMax: priceRange[1],
                                                                            rentMin: rentRange[0],
                                                                            rentMax: rentRange[1],
                                                                            bhk: selectedBHK,
                                                                            bedrooms: selectedBedrooms,
                                                                            bathrooms: selectedBathroom,
                                                                            search: searchQuery,   // 👈 add search text here
                                                                        });

                                                                        navigate(`/listing?${queryParams.toString()}`);
                                                                    }}
                                                                >
                                                                    Search
                                                                </button>

                                                            </div>
                                                            {/* Advanced Filters Section */}

                                                            <Modal
                                                                title={<h5 style={{ margin: 0, fontWeight: 600, color: "#333" }}>Advanced Filters</h5>}
                                                                open={showAdvanced}
                                                                onCancel={handleCloseAdvanced}
                                                                footer={null}
                                                                centered
                                                                bodyStyle={{ padding: "20px 24px" }}
                                                                width="90%"   // 👈 makes it responsive
                                                                style={{ maxWidth: "600px" }} // 👈 optional cap for larger screens
                                                            >


                                                                {/* Listing Type Selection */}
                                                                <div className="filter-section" style={{ marginBottom: "25px" }}>
                                                                    <h6 className="filter-title">Listing Type</h6>
                                                                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                                                        {["Rent", "Buy", "Joint Venture"].map((type) => (
                                                                            <button
                                                                                key={type}
                                                                                onClick={() => setSelectedListingType(type.toLowerCase())}
                                                                                style={{
                                                                                    padding: "8px 16px",
                                                                                    borderRadius: "20px",
                                                                                    border: "1px solid #ccc",
                                                                                    backgroundColor: selectedListingType === type.toLowerCase() ? "#ed2027" : "#fff",
                                                                                    color: selectedListingType === type.toLowerCase() ? "#fff" : "#000",
                                                                                    cursor: "pointer",
                                                                                }}
                                                                            >
                                                                                {type}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>


                                                                <div className="form-group-3 form-style" style={{ marginBottom: "25px" }}>
                                                                    <label>Type</label>
                                                                    <div className="group-select">
                                                                        <div className="nice-select" tabIndex="0">
                                                                            <span className="current">{selectedType}</span>
                                                                            <ul className="list">
                                                                                <li
                                                                                    className={`option ${selectedType === "All" ? "selected" : ""}`}
                                                                                    onClick={() => setSelectedType("All")}
                                                                                >
                                                                                    All
                                                                                </li>
                                                                                {propertyTypes.map((type) => (
                                                                                    <li
                                                                                        key={type}
                                                                                        className={`option ${selectedType === type ? "selected" : ""}`}
                                                                                        onClick={() => setSelectedType(type)}
                                                                                    >
                                                                                        {type}
                                                                                    </li>
                                                                                ))}
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </div>



                                                                {/* Rent or Price Slider */}
                                                                {selectedListingType === "rent" ? (
                                                                    <div className="filter-section" style={{ marginBottom: "25px" }}>
                                                                        <h6 className="filter-title">Rent Range</h6>
                                                                        <div className="slider-values" style={{ display: "flex", justifyContent: "space-between" }}>
                                                                            <span>₹{rentRange[0].toLocaleString()}</span>
                                                                            <span>₹{rentRange[1].toLocaleString()}</span>
                                                                        </div>
                                                                        <Slider
                                                                            range
                                                                            min={0}
                                                                            max={200000}
                                                                            step={1000}
                                                                            value={rentRange}
                                                                            onChange={setRentRange}
                                                                            tooltip={{ formatter: (value) => `₹${value.toLocaleString()}` }}
                                                                        />
                                                                    </div>
                                                                ) : (
                                                                    <div className="filter-section" style={{ marginBottom: "25px" }}>
                                                                        <h6 className="filter-title">Price Range</h6>
                                                                        <div className="slider-values" style={{ display: "flex", justifyContent: "space-between" }}>
                                                                            <span>₹{priceRange[0].toLocaleString()}</span>
                                                                            <span>₹{priceRange[1].toLocaleString()}</span>
                                                                        </div>
                                                                        <Slider
                                                                            range
                                                                            min={0}
                                                                            max={50000000}
                                                                            step={50000}
                                                                            value={priceRange}
                                                                            onChange={setPriceRange}
                                                                            tooltip={{ formatter: (value) => `₹${value.toLocaleString()}` }}
                                                                        />
                                                                    </div>
                                                                )}

                                                                {/* Dynamic Filters Based on Type */}
                                                                {["Flat / Apartment", "Independent House / Villa", "Farmhouse", "Serviced Apartment", "1 RK / Studio Apartment", "Independent Floor"].includes(selectedType) && (
                                                                    <>
                                                                        {/* ✅ BHK Selection */}
                                                                        <div className="filter-section" style={{ marginBottom: "25px" }}>
                                                                            <h6 className="filter-title">BHK Type</h6>
                                                                            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                                                                {["1 BHK", "2 BHK", "3 BHK", "4 BHK", "4+ BHK"].map((bhk) => (
                                                                                    <button
                                                                                        key={bhk}
                                                                                        type="button"
                                                                                        className={`bhk-pill ${selectedBHK === bhk ? "active" : ""}`}
                                                                                        onClick={() => {
                                                                                            setSelectedBHK(bhk);

                                                                                            // Auto set bedrooms
                                                                                            if (bhk === "1 BHK") setSelectedBedrooms("1");
                                                                                            else if (bhk === "2 BHK") setSelectedBedrooms("2");
                                                                                            else if (bhk === "3 BHK") setSelectedBedrooms("3");
                                                                                            else if (bhk === "4 BHK") setSelectedBedrooms("4");
                                                                                            else if (bhk === "4+ BHK") setSelectedBedrooms("4+");
                                                                                        }}
                                                                                        style={{
                                                                                            padding: "8px 16px",
                                                                                            borderRadius: "20px",
                                                                                            border: selectedBHK === bhk ? "2px solid #EC2126" : "1px solid #ccc",
                                                                                            background: selectedBHK === bhk ? "#EC2126" : "#fff",
                                                                                            color: selectedBHK === bhk ? "#fff" : "#333",
                                                                                            cursor: "pointer",
                                                                                        }}
                                                                                    >
                                                                                        {bhk}
                                                                                    </button>
                                                                                ))}

                                                                            </div>
                                                                        </div>

                                                                        <div className="filter-section" style={{ marginBottom: "25px" }}>
                                                                            <h6 className="filter-title">Bedrooms</h6>
                                                                            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                                                                {["1", "2", "3", "4", "4+"].map((room) => (
                                                                                    <button
                                                                                        key={room}
                                                                                        type="button"
                                                                                        className={`bedroom-pill ${selectedBedrooms === room ? "active" : ""}`}
                                                                                        onClick={() => setSelectedBedrooms(room)}
                                                                                        disabled={
                                                                                            // disable if linked to BHK
                                                                                            (selectedBHK === "1 BHK" && room === "1") ||
                                                                                            (selectedBHK === "2 BHK" && room === "2") ||
                                                                                            (selectedBHK === "3 BHK" && room === "3") ||
                                                                                            (selectedBHK === "4 BHK" && room === "4") ||
                                                                                            (selectedBHK === "4+ BHK" && room === "4+")
                                                                                        }
                                                                                        style={{
                                                                                            padding: "8px 16px",
                                                                                            borderRadius: "20px",
                                                                                            border: selectedBedrooms === room ? "2px solid #EC2126" : "1px solid #ccc",
                                                                                            background: selectedBedrooms === room ? "#EC2126" : "#fff",
                                                                                            color: selectedBedrooms === room ? "#fff" : "#333",
                                                                                            cursor: "pointer",
                                                                                            opacity:
                                                                                                (selectedBHK === "1 BHK" && room === "1") ||
                                                                                                    (selectedBHK === "2 BHK" && room === "2") ||
                                                                                                    (selectedBHK === "3 BHK" && room === "3") ||
                                                                                                    (selectedBHK === "4 BHK" && room === "4") ||
                                                                                                    (selectedBHK === "4+ BHK" && room === "4+")
                                                                                                    ? 0.6
                                                                                                    : 1,
                                                                                        }}
                                                                                    >
                                                                                        {room}
                                                                                    </button>
                                                                                ))}
                                                                            </div>
                                                                        </div>


                                                                        {/* ✅ Bathrooms */}
                                                                        <div className="filter-section">
                                                                            <h6 className="filter-title">No. of Bathrooms</h6>
                                                                            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                                                                {["1", "2", "3", "4", "4+"].map((bath) => (
                                                                                    <button
                                                                                        key={bath}
                                                                                        type="button"
                                                                                        className={`bath-pill ${selectedBathroom === bath ? "active" : ""}`}
                                                                                        onClick={() => setSelectedBathroom(bath)}
                                                                                        style={{
                                                                                            padding: "8px 16px",
                                                                                            borderRadius: "20px",
                                                                                            border: selectedBathroom === bath ? "2px solid #EC2126" : "1px solid #ccc",
                                                                                            background: selectedBathroom === bath ? "#EC2126" : "#fff",
                                                                                            color: selectedBathroom === bath ? "#fff" : "#333",
                                                                                            cursor: "pointer",
                                                                                        }}
                                                                                    >
                                                                                        {bath}
                                                                                    </button>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                )}

                                                                {selectedType === "Plot / Land" && (
                                                                    <>
                                                                        {/* ✅ Plot Filters */}
                                                                        <div className="filter-section" style={{ marginBottom: "25px" }}>
                                                                            <h6 className="filter-title">Plot Size</h6>
                                                                            <Slider range min={500} max={10000} step={100} defaultValue={[1000, 5000]} />
                                                                        </div>
                                                                        <div className="filter-section">
                                                                            <h6 className="filter-title">Facing</h6>
                                                                            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                                                                {["East", "West", "North", "South"].map((dir) => (
                                                                                    <button
                                                                                        key={dir}
                                                                                        type="button"
                                                                                        className="plot-facing"
                                                                                        style={{
                                                                                            padding: "8px 16px",
                                                                                            borderRadius: "20px",
                                                                                            border: "1px solid #ccc",
                                                                                            background: "#fff",
                                                                                            cursor: "pointer",
                                                                                        }}
                                                                                    >
                                                                                        {dir}
                                                                                    </button>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                )}

                                                                {(selectedType === "Office" || selectedType === "Retail") && (
                                                                    <>
                                                                        {/* ✅ Office/Retail Filters */}
                                                                        <div className="filter-section" style={{ marginBottom: "25px" }}>
                                                                            <h6 className="filter-title">Carpet Area (sq.ft)</h6>
                                                                            <Slider range min={200} max={10000} step={100} defaultValue={[500, 5000]} />
                                                                        </div>

                                                                    </>
                                                                )}

                                                                {/* Apply Filters Button */}
                                                                <div style={{ textAlign: "right", marginTop: "25px" }}>
                                                                    <button

                                                                        style={{
                                                                            padding: "10px 24px",
                                                                            borderRadius: "25px",
                                                                            background: "#EC2126",
                                                                            color: "#fff",
                                                                            fontWeight: 600,
                                                                            border: "none",
                                                                            cursor: "pointer",
                                                                        }}
                                                                        onClick={() => {
                                                                            // build query params
                                                                            const queryParams = new URLSearchParams({
                                                                                country: detectedCountry || "",   // 👈 add country
                                                                                state: detectedState || "",       // 👈 add state
                                                                                city: detectedCity || "",         // 👈 add city
                                                                                state: selectedState,   // 👈 add state here
                                                                                listingType: selectedListingType,
                                                                                type: selectedType,
                                                                                priceMin: priceRange[0],
                                                                                priceMax: priceRange[1],
                                                                                rentMin: rentRange[0],
                                                                                rentMax: rentRange[1],
                                                                                bhk: selectedBHK,
                                                                                bedrooms: selectedBedrooms,
                                                                                bathrooms: selectedBathroom,
                                                                                search: searchQuery,   // 👈 add search text here
                                                                            });

                                                                            navigate(`/listing?${queryParams.toString()}`);
                                                                        }}

                                                                    >
                                                                        Apply Filters
                                                                    </button>
                                                                </div>
                                                            </Modal>


                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>


                            </div>
                        </div>
                        <div className="overlay"></div>
                    </section>



                    <section className="flat-section flat-recommended">
                        <div className="container">
                            <div className="text-center wow fadeInUpSmall" data-wow-delay=".2s" data-wow-duration="2000ms">
                                <div className="text-subtitle text-primary">Featured Properties</div>
                                <h4 className="mt-4">Recommended For You</h4>
                            </div>
                            <div className="flat-tab-recommended wow fadeInUpSmall" data-wow-delay=".2s" data-wow-duration="2000ms">
                                <ul className="nav-tab-recommended justify-content-center">
                                    {["View All", "Apartment", "Villa", "Studio", "Plot", "House", "Office"].map((label, i) => (
                                        <li key={i} className="nav-tab-item">
                                            <a
                                                href="#"
                                                className={`nav-link-item ${activeTab === label ? "active" : ""}`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setActiveTab(label); // sets the clicked tab
                                                }}
                                            >
                                                {label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>

                                <div className="tab-content">
                                    <div className="tab-pane fade active show" role="tabpanel">
                                        <div className="row">
                                            {loading ? (
                                                // Skeleton Loader
                                                [...Array(6)].map((_, i) => (
                                                    <div key={i} className="col-xl-4 col-lg-6 col-md-6 mb-4">
                                                        <div className="homeya-box p-3">
                                                            <div className="skeleton skeleton-img mb-3"></div>
                                                            <br />
                                                            <div className="skeleton skeleton-text w-75 mb-2"></div>
                                                            <div className="skeleton skeleton-text w-50 mb-2"></div>
                                                            <div className="skeleton skeleton-text w-100 mb-2"></div>
                                                            <div className="d-flex justify-content-between mt-3">
                                                                <div className="skeleton skeleton-avatar"></div>
                                                                <div className="skeleton skeleton-text w-25"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : properties.length === 0 ? (
                                                // 👇 No properties case
                                                <div className="col-12 text-center py-5">
                                                    <div className="col-12 text-center py-5 mt-3">
                                                        <img
                                                            src={nodata}
                                                            alt="No Property Found"
                                                            style={{ maxWidth: "280px", marginBottom: "20px" }}
                                                        />
                                                        <h5>No Property Found</h5>
                                                        <p>Try adjusting your filters or search criteria.</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                // 👇 Render property cards
                                                properties.map((item) => (
                                                    <div key={item.id} className="col-xl-4 col-lg-6 col-md-6">
                                                        <div className="homeya-box">
                                                            <div className="archive-top">
                                                                {/* ✅ Image clickable using Link with encrypted ID */}
                                                                <Link
                                                                    to={`/property/${encryptId(item.id)}&slug=${slugify(item.name)}`}
                                                                    onClick={() => addToRecentProperties(item)}
                                                                    className="images-group"
                                                                >
                                                                    <div className="images-style">
                                                                        <img
                                                                            src={
                                                                                item.image
                                                                                    ? `${api.imageUrl}/${item.image}`
                                                                                    : "https://themesflat.co/html/homzen/images/home/house-2.jpg"
                                                                            }
                                                                            alt={item.name}
                                                                            style={{
                                                                                width: "100%",
                                                                                height: "200px",
                                                                                objectFit: "cover",
                                                                                borderRadius: "8px",
                                                                            }}
                                                                        />
                                                                    </div>

                                                                    <div className="top">
                                                                        <ul className="d-flex gap-8">
                                                                            <li className="flag-tag style-1">{item.for}</li>
                                                                        </ul>
                                                                    </div>
                                                                    <div className="bottom">
                                                                        <span className="flag-tag style-2">{item.type}</span>
                                                                    </div>
                                                                </Link>

                                                                <div className="content" style={{ background: "#fff" }}>
                                                                    <div className="h7 text-capitalize fw-7">
                                                                        <div className="h7 text-capitalize fw-7">
                                                                            {/* ✅ Property name clickable using Link with encrypted ID */}
                                                                            <Link
                                                                                to={`/property/${encryptId(item.id)}`}
                                                                                onClick={() => addToRecentProperties(item)}
                                                                                className="property-name"
                                                                            >
                                                                                {item.name}
                                                                            </Link>
                                                                        </div>
                                                                    </div>

                                                                    <div className="desc">
                                                                        <i className="fs-16 icon icon-mapPin"></i>
                                                                        <p>{item.location}</p>
                                                                    </div>

                                                                    <ul className="meta-list">
                                                                        {item.meta.map((m, idx) => (
                                                                            <li className="item" key={idx}>
                                                                                <i className={`icon ${m.icon}`}></i>
                                                                                <span>{m.label}</span>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            </div>

                                                            <div className="archive-bottom d-flex justify-content-between align-items-center">
                                                                <div className="d-flex gap-8 align-items-center">
                                                                    <span style={{ fontWeight: "bold", fontSize: "18px" }}>{item.agentName}</span>
                                                                </div>
                                                                <div className="d-flex align-items-center">
                                                                    <h6>₹{item.priceValue}</h6>
                                                                    <span className="text-variant-1">{item.priceUnit}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                        {/* 👇 Only show button if properties exist */}
                                        {!loading && properties.length > 0 && (
                                            <div className="text-center mt-4">
                                                <Link to="/listing" className="tf-btn primary size-1">
                                                    View All Properties
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>


                            </div>

                        </div>
                        <section
                            className="flat-section-v3 flat-location bg-surface p-0"
                            style={{
                                paddingTop: "20px",

                                width: "100%",
                                overflow: "hidden"
                            }}
                        >
                            <div
                                className="container-full"
                                style={{
                                    width: "100%",
                                    maxWidth: "100%",
                                    padding: "0 15px",
                                    margin: "0 auto"
                                }}
                            >
                                {/* Section Title */}
                                <div
                                    className="box-title text-center wow fadeInUpSmall"
                                    data-wow-delay=".2s"
                                    data-wow-duration="2000ms"
                                >
                                    <div
                                        className="text-subtitle text-primary"
                                        style={{ fontSize: "16px", marginTop: "30px" }}
                                    >
                                        Explore Cities
                                    </div>
                                    <h4
                                        className="mt-4"
                                        style={{
                                            fontSize: "28px",
                                            marginTop: "16px",
                                            lineHeight: "1.3"
                                        }}
                                    >
                                        Our Location For You
                                    </h4>
                                </div>

                                {/* Location Cards */}
                                <div
                                    className="wow fadeInUpSmall"
                                    data-wow-delay=".4s"
                                    data-wow-duration="2000ms"
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        flexWrap: "wrap",
                                        gap: "40px", // slightly larger spacing
                                        padding: "20px 15px"
                                    }}
                                >
                                    {/* Card 1 */}
                                    <div
                                        onClick={() => navigate("/city-list/229")}
                                        className="box-location"
                                        style={{
                                            display: "block",
                                            width: "300px", // larger width
                                            borderRadius: "12px",
                                            overflow: "hidden",
                                            boxShadow: "0 6px 16px rgba(0,0,0,0.15)", // slightly stronger shadow
                                            position: "relative",
                                            transition: "transform 0.3s ease",
                                            cursor: "pointer"
                                        }}
                                    >
                                        <div
                                            className="image"
                                            style={{
                                                position: "relative",
                                                paddingBottom: "70%",
                                                overflow: "hidden"
                                            }}
                                        >
                                            <img
                                                src={Dub}
                                                style={{
                                                    position: "absolute",
                                                    top: 0,
                                                    left: 0,
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                    transition: "transform 0.3s ease"
                                                }}
                                            />
                                        </div>
                                        <div
                                            className="content"
                                            style={{
                                                position: "absolute",
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                padding: "15px",
                                                background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
                                                color: "#fff"
                                            }}
                                        >
                                            {/* <span
                                                className="sub-title"
                                                style={{ display: "block", fontSize: "14px", marginBottom: "4px" }}
                                            >
                                                321 Property
                                            </span> */}
                                            <h6
                                                className="title"
                                                style={{ fontSize: "18px", margin: 0, fontWeight: "600" }}
                                            >
                                                Dubai, United Arab Emirates
                                            </h6>
                                        </div>
                                    </div>

                                    {/* Card 2 */}
                                    <div
                                        onClick={() => navigate("/city-list/101")}
                                        className="box-location"
                                        style={{
                                            display: "block",
                                            width: "300px",
                                            borderRadius: "12px",
                                            overflow: "hidden",
                                            boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                                            position: "relative",
                                            transition: "transform 0.3s ease",
                                            cursor: "pointer"
                                        }}
                                    >
                                        <div
                                            className="image"
                                            style={{
                                                position: "relative",
                                                paddingBottom: "70%",
                                                overflow: "hidden"
                                            }}
                                        >
                                            <img
                                                src="https://s7ap1.scene7.com/is/image/incredibleindia/india-gate-delhi-2-attr-hero?qlt=82&ts=1742164655647"
                                                alt="London, United Kingdom"
                                                style={{
                                                    position: "absolute",
                                                    top: 0,
                                                    left: 0,
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                    transition: "transform 0.3s ease"
                                                }}
                                            />
                                        </div>
                                        <div
                                            className="content"
                                            style={{
                                                position: "absolute",
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                padding: "15px",
                                                background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
                                                color: "#fff"
                                            }}
                                        >

                                            <h6
                                                className="title"
                                                style={{ fontSize: "18px", margin: 0, fontWeight: "600" }}
                                            >
                                                India
                                            </h6>
                                        </div>
                                    </div>

                                    {/* Add more cards as needed */}
                                </div>
                            </div>
                        </section>
                        {!loading && recentProperties.length > 0 && (
                            <div className="container" style={{ marginTop: "30px" }}>
                                <div
                                    className="text-center wow fadeInUpSmall"
                                    data-wow-delay=".2s"
                                    data-wow-duration="2000ms"
                                >
                                    <div className="text-subtitle text-primary">Properties</div>
                                    <h4 className="mt-4">Recent Activity</h4>
                                </div>

                                <div
                                    className="flat-tab-recommended wow fadeInUpSmall"
                                    data-wow-delay=".2s"
                                    data-wow-duration="2000ms"
                                >
                                    <div className="tab-content" style={{ marginTop: "50px" }}>
                                        <div className="tab-pane fade active show" role="tabpanel">
                                            <div className={`row ${recentProperties.length <= 2 && !loading ? "justify-content-center" : ""
                                                }`}>
                                                {loading ? (
                                                    // 🔹 Skeleton Loader (same as home page)
                                                    [...Array(6)].map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className="col-xl-4 col-lg-6 col-md-6 mb-4"
                                                        >
                                                            <div className="homeya-box p-3">
                                                                <div className="skeleton skeleton-img mb-3"></div>
                                                                <br />
                                                                <div className="skeleton skeleton-text w-75 mb-2"></div>
                                                                <div className="skeleton skeleton-text w-50 mb-2"></div>
                                                                <div className="skeleton skeleton-text w-100 mb-2"></div>
                                                                <div className="d-flex justify-content-between mt-3">
                                                                    <div className="skeleton skeleton-avatar"></div>
                                                                    <div className="skeleton skeleton-text w-25"></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : recentProperties.length === 0 ? (
                                                    // 🔹 No Recent Activity
                                                    <div className="col-12 text-center py-5 mt-3">
                                                        <img
                                                            src={nodata}
                                                            alt="No Recent Activity"
                                                            style={{ maxWidth: "280px", marginBottom: "20px" }}
                                                        />
                                                        <h5>No Recent Activity Today</h5>
                                                        <p>Browse properties to see them appear here.</p>
                                                    </div>
                                                ) : (
                                                    // 🔹 Property Cards (same styling as home page)
                                                    recentProperties.map((property) => (
                                                        <div
                                                            key={property.id}
                                                            className="col-xl-4 col-lg-6 col-md-6 mb-4"
                                                        >
                                                            <div className="homeya-box">
                                                                <div className="archive-top">
                                                                    <a
                                                                        onClick={() => {
                                                                            const encryptedId = encryptId(property.id)
                                                                            const slug = slugify(property.title);
                                                                            addToRecent(property);
                                                                            navigate(`/property/${encryptedId}&slug=${slug}`);
                                                                        }}
                                                                        className="images-group"
                                                                        style={{ cursor: "pointer" }}
                                                                    >
                                                                        <div className="images-style">
                                                                            <img
                                                                                src={
                                                                                    property.image
                                                                                        ? `${api.imageUrl}${property.image}`
                                                                                        : "https://themesflat.co/html/homzen/images/home/house-1.jpg"
                                                                                }
                                                                                alt={property.title}
                                                                                style={{
                                                                                    width: "100%",
                                                                                    height: "200px",
                                                                                    objectFit: "cover",
                                                                                    borderRadius: "8px",
                                                                                }}
                                                                                onError={(e) => {
                                                                                    e.target.onerror = null;
                                                                                    e.target.src =
                                                                                        "https://themesflat.co/html/homzen/images/home/house-1.jpg";
                                                                                }}
                                                                            />
                                                                        </div>
                                                                        {/* <div className="top">
                                                                        <ul className="d-flex gap-8">
                                                                            {property.featured && <li className="flag-tag success">Featured</li>}
                                                                            <li className="flag-tag style-1">{property.status}</li>
                                                                        </ul>
                                                                    </div>

                                                                    <div className="bottom">
                                                                        <span className="flag-tag style-2">{property.type}</span>
                                                                    </div> */}


                                                                    </a>

                                                                    {/* Content section */}
                                                                    <div className="content" style={{ background: "#fff" }}>
                                                                        <div className="h7 text-capitalize fw-7">
                                                                            <a
                                                                                onClick={() => {
                                                                                    addToRecent(property);
                                                                                    navigate(`/property/${property.id}`);
                                                                                }}
                                                                                style={{ cursor: "pointer" }}
                                                                            >
                                                                                {property.title}
                                                                            </a>
                                                                        </div>
                                                                        <div className="desc">
                                                                            <i className="fs-16 icon icon-mapPin"></i>
                                                                            <p>{property.location}</p>


                                                                        </div>
                                                                        <ul className="meta-list">
                                                                            {property.meta && property.meta.map((m, idx) => (
                                                                                <li className="item" key={idx}>
                                                                                    <i className={`icon ${m.icon}`}></i>
                                                                                    <span>{m.label}</span>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                </div>

                                                                {/* Bottom Price & Agent */}
                                                                <div className="archive-bottom d-flex justify-content-between align-items-center">
                                                                    <div className="d-flex gap-8 align-items-center">

                                                                        <span style={{ fontWeight: "bold", fontSize: "18px" }}>{property.agentName || "Agent"}</span>
                                                                    </div>
                                                                    <div className="d-flex align-items-center">
                                                                        <h6>₹{Number(property.priceValue).toLocaleString()}</h6>
                                                                        <span className="text-variant-1">{property.priceUnit}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* 🔹 Show button only if data exists */}
                                    {!loading && recentProperties.length > 0 && (
                                        <div className="text-center mt-4">
                                            <Link to="/recent" className="tf-btn primary size-1">
                                                View All Recent Activity
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}




                    </section>







                    <div className="card-container">
                        <div
                            className="card"
                            onClick={() => {
                                navigate("/emi");
                            }}

                        >
                            <img
                                src="images/logo/schedule.png"
                                alt="EMI"
                                style={{ width: "65px", height: "60px", marginBottom: "10px" }}
                            />
                            <h2  >EMI Calculator</h2>
                            <div className="card-subtitle" style={{ color: '#ED2027' }}>Calculate your loan EMI with ease</div>
                        </div>

                        <div
                            className="card"
                            onClick={() => {
                                navigate("/calc");
                            }}

                        >
                            <img
                                src="images/logo/calculator.png"
                                alt="Construction Calculator"
                                style={{ width: "50px", height: "50px", marginBottom: "10px" }}
                            />
                            <h2 >Construction Calculator</h2>
                            <div className="card-subtitle" style={{ color: '#ED2027' }}>Estimate construction costs</div>
                        </div>

                        <div
                            className="card"
                            onClick={() => {
                                navigate("/area");
                            }}

                        >
                            <img
                                src="images/logo/size.png"
                                alt="Area Unit Calculator"
                                style={{ width: "50px", height: "50px", marginBottom: "10px" }}
                            />
                            <h2 >Area Unit Calculator</h2>
                            <div className="card-subtitle" style={{ color: '#ED2027' }}>Convert area measurements</div>
                        </div>

                        <div
                            className="card"
                            onClick={() => {
                                navigate("/rent");
                            }}

                        >
                            <img
                                src="images/logo/contract.png"
                                alt="Rent vs Buy"
                                style={{ width: "50px", height: "50px", marginBottom: "10px" }}
                            />
                            <h2>Rent vs Buy </h2>
                            <div className="card-subtitle" style={{ color: '#ED2027' }}>Compare renting and buying costs</div>
                        </div>
                    </div>

                    {/* <!-- Service & Counter  -->  */}
                    <section className="flat-section">
                        <div className="container">
                            <div className="box-title style-1 wow fadeInUpSmall" data-wow-delay=".2s" data-wow-duration="2000ms">
                                <div className="box-left">
                                    <div className="text-subtitle text-primary">Our Services</div>
                                    <h4 className="mt-4">What We Do?</h4>
                                </div>
                            </div>
                            <div className="flat-service wrap-service wow fadeInUpSmall" data-wow-delay=".4s" data-wow-duration="2000ms">
                                <div className="box-service hover-btn-view">
                                    <div className="icon-box">
                                        <span className="icon icon-buy-home"></span>
                                    </div>
                                    <div className="content">
                                        <h6 className="title">Buy A New Home</h6>
                                        <p className="description">Discover your dream home effortlessly. Explore diverse properties and expert guidance for a seamless buying experience.</p>

                                    </div>
                                </div>
                                <div className="box-service hover-btn-view">
                                    <div className="icon-box">
                                        <span className="icon icon-rent-home"></span>
                                    </div>
                                    <div className="content">
                                        <h6 className="title">Rent a home</h6>
                                        <p className="description">Discover your perfect rental effortlessly. Explore a diverse variety of listings tailored precisely to suit your unique lifestyle needs.</p>

                                    </div>
                                </div>
                                <div className="box-service hover-btn-view">
                                    <div className="icon-box">
                                        <span className="icon icon-sale-home"></span>
                                    </div>
                                    <div className="content">
                                        <h6 className="title">Sell a home</h6>
                                        <p className="description">Sell confidently with expert guidance and effective strategies, showcasing your property's best features for a successful sale.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flat-counter tf-counter wrap-counter wow fadeInUpSmall" data-wow-delay=".4s" data-wow-duration="2000ms">
                                <div className="counter-box">
                                    <div className="count-number">
                                        <div className="number" data-speed="2000" data-to="85" data-inviewport="yes">85</div>
                                    </div>
                                    <div className="title-count">Satisfied Clients</div>
                                </div>
                                <div className="counter-box">
                                    <div className="count-number">
                                        <div className="number" data-speed="2000" data-to="112" data-inviewport="yes">112</div>
                                    </div>
                                    <div className="title-count">Awards Received</div>
                                </div>
                                <div className="counter-box">
                                    <div className="count-number">
                                        <div className="number" data-speed="2000" data-to="32" data-inviewport="yes">32</div>
                                    </div>
                                    <div className="title-count">Successful Transactions</div>
                                </div>

                            </div>
                        </div>
                    </section>
                    {/* <!-- End Service & Counter -->
            <!-- Benefit --> */}
                    <section className="flat-section flat-benefit bg-surface">
                        <div className="container">
                            <div className="box-title text-center wow fadeInUpSmall" data-wow-delay=".2s" data-wow-duration="2000ms">
                                <div className="text-subtitle text-primary">Our Benifit</div>
                                <h4 className="mt-4">Why Choose Eazy Acres</h4>
                            </div>
                            <div className="wrap-benefit wow fadeInUpSmall" data-wow-delay=".2s" data-wow-duration="2000ms">
                                <div className="box-benefit">
                                    <div className="icon-box">
                                        <span className="icon icon-proven"></span>
                                    </div>
                                    <div className="content text-center">
                                        <h6 className="title">Proven Expertise</h6>
                                        <p className="description">Our seasoned team excels in real estate with years of successful market navigation, offering informed decisions and optimal results.</p>
                                    </div>
                                </div>
                                <div className="box-benefit">
                                    <div className="icon-box">
                                        <span className="icon icon-double-ruler"></span>
                                    </div>
                                    <div className="content text-center">
                                        <h6 className="title">Customized Solutions</h6>
                                        <p className="description">We pride ourselves on crafting personalized strategies to match your unique goals, ensuring a seamless real estate journey.</p>
                                    </div>
                                </div>
                                <div className="box-benefit">
                                    <div className="icon-box">
                                        <span className="icon icon-hand"></span>
                                    </div>
                                    <div className="content text-center">
                                        <h6 className="title">Transparent Partnerships</h6>
                                        <p className="description">Transparency is key in our client relationships. We prioritize clear communication and ethical practices, fostering trust and reliability throughout.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>






                    <div className="box-title text-center wow fadeInUpSmall" data-wow-delay=".2s" data-wow-duration="2000ms">
                        <div className="text-subtitle text-primary" style={{ marginTop: "60px" }}>Blogs</div>
                        <h4 className="mt-4">check the blogs </h4>

                        <section className="flat-section">
                            <div className="container">
                                <div className="row">
                                    {blogs.length === 0 && loading
                                        ? renderSkeleton()
                                        : blogs.map((blog) => (
                                            <div className="col-lg-4 col-md-6" key={blog.blogId}>
                                                <div
                                                    className="flat-blog-item hover-img"
                                                    onClick={() => {
                                                        const encryptedId = encryptId(blog.blogId);

                                                        navigate(`/blogoverview/${encryptedId}`);
                                                    }}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    <div className="img-style">
                                                        <img
                                                            src={api.imageUrl + blog.featured_image}
                                                            alt={blog.title}
                                                        />
                                                        <span className="date-post">
                                                            {new Date().toLocaleDateString("en-US", {
                                                                month: "long",
                                                                day: "2-digit",
                                                                year: "numeric",
                                                            })}
                                                        </span>
                                                    </div>
                                                    <div className="content-box">
                                                        <div className="post-author">
                                                            <span>{blog.relatedTo || "Property"}</span>
                                                        </div>
                                                        <h6 className="title">{blog.title}</h6>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }

                                    <div className="col-12 text-center mt-3">
                                        <button
                                            className="tf-btn size-1 primary"
                                            onClick={() => navigate("/blogs")}
                                        >
                                            View More
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>



                    {/* <!-- End Benefit -->
                    {/* PROPERTIES */}


                    <section className=" flat-property">
                        <div className="container">
                            {/* <div className="box-title style-1 wow fadeInUpSmall" data-wow-delay=".2s" data-wow-duration="2000ms">
                                <div className="box-left">
                                    <div className="text-subtitle text-primary">Top Properties</div>
                                    <h4 className="mt-4">Best Property Value</h4>
                                </div>
                                <a href="#" className="tf-btn primary size-1">View All</a>
                            </div> */}
                            <div className="wrap-property">
                                <div className="box-left  wow fadeInLeftSmall" data-wow-delay=".2s" data-wow-duration="2000ms">
                                    {/* Property main card */}
                                    {home.properties.length > 0 && (
                                        <div className="homeya-box lg">
                                            <div className="archive-top">
                                                <a href={home.properties[0].detailsUrl} className="images-group">
                                                    <div className="images-style">
                                                        <img src={home.properties[0].image} alt="img" />
                                                    </div>
                                                    <div className="top">
                                                        <ul className="d-flex gap-8">
                                                            <li className="flag-tag success style-3">{home.properties[0].featured ? "Featured" : ""}</li>
                                                            <li className="flag-tag style-1 style-3">{home.properties[0].for}</li>
                                                        </ul>
                                                        <ul className="d-flex gap-4">
                                                            <li className="box-icon w-40"><span className="icon icon-arrLeftRight"></span></li>
                                                            <li className="box-icon w-40"><span className="icon icon-heart"></span></li>
                                                            <li className="box-icon w-40"><span className="icon icon-eye"></span></li>
                                                        </ul>
                                                    </div>
                                                    <div className="bottom">
                                                        <span className="flag-tag style-2">{home.properties[0].type}</span>
                                                    </div>
                                                </a>
                                                <div className="content">
                                                    <h5 className="text-capitalize"><a href={home.properties[0].detailsUrl} className="link">{home.properties[0].name}</a></h5>
                                                    <div className="desc"><i className="icon icon-mapPin"></i><p>{home.properties[0].location}</p></div>
                                                    <p className="note">"I truly appreciate the professionalism and in-depth..."</p>
                                                    <ul className="meta-list">
                                                        <li className="item"><i className="icon icon-bed"></i><span>{home.properties[0].beds}</span></li>
                                                        <li className="item"><i className="icon icon-bathtub"></i><span>{home.properties[0].baths}</span></li>
                                                        <li className="item"><i className="icon icon-ruler"></i><span>{home.properties[0].size}</span></li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="archive-bottom d-flex justify-content-between align-items-center">
                                                <div className="d-flex gap-8 align-items-center">
                                                    <div className="avatar avt-40 round">
                                                        <img src={home.properties[0].avatar} alt="avt" />
                                                    </div>
                                                    <span className="body-2">{home.properties[0].agentName}</span>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <h6>${home.properties[0].priceValue}</h6>
                                                    <span className="text-variant-1">{home.properties[0].priceUnit}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="box-right wow fadeInRightSmall" data-wow-delay=".2s" data-wow-duration="2000ms">
                                    {home.properties.slice(1, 4).map((prop, idx) => (
                                        <div className="homeya-box list-style-1" key={prop.id}>
                                            <a href={prop.detailsUrl} className="images-group">
                                                <div className="images-style">
                                                    <img src={prop.image} alt="img" />
                                                </div>
                                                <div className="top">
                                                    <ul className="d-flex gap-4 flex-wrap flex-column">
                                                        {prop.featured && <li className="flag-tag success">Featured</li>}
                                                        <li className="flag-tag style-1">{prop.for}</li>
                                                    </ul>
                                                    <ul className="d-flex gap-4">

                                                        <li className="box-icon w-28"><span className="icon icon-eye"></span></li>
                                                    </ul>
                                                </div>
                                                <div className="bottom">
                                                    <span className="flag-tag style-2">{prop.type}</span>
                                                </div>
                                            </a>
                                            <div className="content">
                                                <div className="archive-top">
                                                    <div className="h7 text-capitalize fw-7"><a href={prop.detailsUrl} className="link">{prop.name}</a></div>
                                                    <div className="desc"><i className="icon icon-mapPin"></i><p>{prop.location}</p></div>
                                                    <ul className="meta-list">
                                                        <li className="item"><i className="icon icon-bed"></i><span>{prop.beds}</span></li>
                                                        <li className="item"><i className="icon icon-bathtub"></i><span>{prop.baths}</span></li>
                                                        <li className="item"><i className="icon icon-ruler"></i><span>{prop.size}</span></li>
                                                    </ul>
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div className="d-flex gap-8 align-items-center">
                                                        <div className="avatar avt-40 round">
                                                            <img src={prop.avatar} alt="avt" />
                                                        </div>
                                                        <span>{prop.agentName}</span>
                                                    </div>
                                                    <div className="d-flex align-items-center">
                                                        <div className="h7 fw-7">${prop.priceValue}</div>
                                                        <span className="text-variant-1">{prop.priceUnit}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>





                    {/* TESTIMONIALS */}
                    {
                        reviewSlides.length > 0 && (
                            <section className="flat-section-v3 bg-surface flat-testimonial">
                                <div className="cus-layout-1">
                                    <div className="row align-items-center">
                                        <div className="col-lg-3">
                                            <div className="box-title">
                                                <div className="text-subtitle text-primary">Top Properties</div>
                                                <h4 className="mt-4">What’s people say’s</h4>
                                            </div>
                                            <p className="text-variant-1 p-16">
                                                Our seasoned team excels in real estate with years of successful market
                                                navigation, offering informed decisions and optimal results.
                                            </p>
                                        </div>

                                        <div className="col-lg-9">
                                            <Swiper
                                                modules={[Navigation, Autoplay]}
                                                autoplay={{ delay: 3000, disableOnInteraction: false }}
                                                loop={true}
                                                spaceBetween={30}
                                                slidesPerView={1}
                                                breakpoints={{
                                                    768: { slidesPerView: 2, spaceBetween: 20 },
                                                    1024: { slidesPerView: 2, spaceBetween: 30 },
                                                }}
                                                className="tf-sw-testimonial"
                                            >
                                                {Array.isArray(reviews) &&
                                                    reviews.map((property) =>
                                                        Array.isArray(property.review) &&
                                                        property.review.map((rev) => (
                                                            <SwiperSlide key={rev.reviewId}>
                                                                <div className="box-tes-item">
                                                                    {/* ⭐ Dynamic stars */}
                                                                    <ul className="list-star">
                                                                        {Array.from({ length: 5 }).map((_, i) => (
                                                                            <li key={i} className="icon">
                                                                                {i < parseInt(rev.star) ? (
                                                                                    <i className="icon-star text-warning"></i>   // filled star
                                                                                ) : (
                                                                                    <i className="icon-star-empty text-gray-400"></i> // empty star
                                                                                )}
                                                                            </li>
                                                                        ))}
                                                                    </ul>


                                                                    {/* 📝 Review text */}
                                                                    <p className="note body-1">"{rev.message}"</p>

                                                                    {/* 👤 User info */}
                                                                    <div className="box-avt d-flex align-items-center gap-12">
                                                                        <div className="avatar avt-60 round">

                                                                            <img
                                                                                src={rev?.profile ? `${api.imageUrl}${rev.profile}` : "images/avatar/avt-7.jpg"}
                                                                                alt="avatar"
                                                                                onError={(e) => { e.currentTarget.src = { download } }}
                                                                            />

                                                                        </div>
                                                                        <div className="info">
                                                                            <div className="h7 fw-7">{rev.user_name}</div>
                                                                            <p className="text-variant-1 mt-4">{rev.userType}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </SwiperSlide>
                                                        ))
                                                    )}
                                            </Swiper>

                                        </div>
                                    </div>
                                </div>
                            </section>
                        )
                    }
                    {/* AGENTS */}
                    {/* <section className="flat-section flat-agents">
                        <div className="container">
                            <div className="box-title text-center wow fadeIn" data-wow-delay=".2s" data-wow-duration="2000ms">
                                <div className="text-subtitle text-primary">Our Teams</div>
                                <h4 className="mt-4">Meet Our Agents</h4>
                            </div>
                            <div className="row">
                                {home.agents.map((agent, idx) => (
                                    <div className="box col-lg-3 col-sm-6" key={idx}>
                                        <div
                                            className="box-agent hover-img wow fadeIn"
                                            data-wow-delay={`${0.2 + idx * 0.2}s`}
                                            data-wow-duration="2000ms"
                                        >
                                            <a href="#" className="box-img img-style" style={{ display: "block", width: "100%", height: "300px", overflow: "hidden" }}>
                                                <img
                                                    src={agent.image}
                                                    alt="image-agent"
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover", // makes sure the image fills properly
                                                    }}
                                                />
                                                <ul className="agent-social">
                                                    {agent.social.map((icon, i) => (
                                                        <li key={i}>
                                                            <span className={`icon icon-${icon}`}></span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </a>

                                            <a href="#" className="content">
                                                <div className="info">
                                                    <h6 className="link">{agent.name}</h6>
                                                    <p className="mt-4 text-variant-1">{agent.role}</p>
                                                </div>
                                                <span className="icon-phone"></span>
                                            </a>
                                        </div>
                                    </div>

                                ))}
                            </div>
                        </div>
                    </section> */}

                    {
                        footerBannerUrl && (
                            <div className="footer-banner text-center">
                                <img
                                    src={`${api.imageUrl}${footerBannerUrl}`}
                                    alt="Footer Banner"
                                    style={{
                                        maxWidth: "100%",   // fills container width responsively
                                        height: "auto",     // maintains aspect ratio
                                    }}
                                />
                            </div>
                        )
                    }




                    {/* ✅ Popup Banner Modal */}
                    {
                        showPopup && popupBanner && (
                            <div className="popup-overlay">
                                <div className="popup-container">
                                    <button className="popup-close" style={{ zIndex: "999" }} onClick={() => setShowPopup(false)}>
                                        ✖
                                    </button>
                                    <img
                                        src={`${api.imageUrl}${popupBanner}`}
                                        alt="Popup Banner"
                                        className="popup-img"
                                    />
                                </div>
                            </div>
                        )
                    }

                    <style>{`
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0,0,0,0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          animation: fadeIn 0.5s ease-in-out;
        }
        .popup-container {
          position: relative;
          background: #fff;
          padding: 10px;
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.3);
          animation: scaleUp 0.4s ease-in-out;
          max-width: 600px;
          width: 90%;
        }
        .popup-img {
          width: 100%;
          height: auto;
          border-radius: 10px;
        }
        .popup-close {
          position: absolute;
          top: 8px;
          right: 8px;
          background: #ec2126;
          border: none;
          color: #fff;
          font-size: 18px;
          font-weight: bold;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          cursor: pointer;
          transition: 0.3s;
        }
        .popup-close:hover {
          background: #b8161a;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>


                    {
                        showSticky && stickyBanner && (
                            <div
                                style={{
                                    position: "fixed",
                                    bottom: "20px",
                                    left: "20px",
                                    zIndex: 9999,
                                }}
                            >
                                <div
                                    style={{
                                        position: "relative",
                                        background: "#fff",
                                        borderRadius: "12px",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                        overflow: "hidden",
                                        maxWidth: "280px",
                                        animation: "slideUp 0.5s ease-out",
                                    }}
                                >
                                    {/* Close Button */}
                                    <button className="popup-close" style={{ zIndex: "999" }} onClick={() => {
                                        setShowSticky(false);
                                        localStorage.setItem("hasSeenSticky", "true"); // mark dismissed
                                    }}>
                                        ✖
                                    </button>

                                    {/* Banner Image */}
                                    <img
                                        src={`${api.imageUrl}${stickyBanner}`}
                                        alt="Sticky Banner"
                                        style={{
                                            display: "block",
                                            width: "100%",
                                            height: "auto",
                                            borderRadius: "12px",
                                        }}
                                    />
                                </div>
                            </div>
                        )
                    }






                    <Footer />

                    {/* <div className="progress-wrap">
                        <svg className="progress-circle svg-content" width="100%" height="100%" viewBox="-1 -1 102 102">
                            <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" style={{ transition: 'stroke-dashoffset 10ms linear 0s', strokeDasharray: '307.919, 307.919', strokeDashoffset: '286.138' }}></path>
                        </svg>
                    </div> */}

                </div >
            </div >
        </div >
    );
};

export default HomePage;