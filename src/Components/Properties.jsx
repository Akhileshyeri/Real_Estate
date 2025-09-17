import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { Link, useNavigate, useParams } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import Header from "./Header";
import Footer from "./Footer";
import api from "../api/api";
import toast from "react-hot-toast";
import download from '/src/assets/download.png'

const Properties = () => {

    const [rating, setRating] = useState(0); // selected rating
    const [hovers, setHovers] = useState(0);   // hover preview
    const [loadingReview, setLoadingReview] = useState(false);
    const [showAllReviews, setShowAllReviews] = useState(false);



    const [profileImg, setProfileImg] = useState(
        localStorage.getItem("userProfile") ||
        "https://static.vecteezy.com/system/resources/previews/044/245/684/non_2x/smiling-real-estate-agent-holding-a-house-shaped-keychain-png.png"
    );
    const [profileName, setProfileName] = useState(localStorage.getItem("userName") || "Guest User");
    const [profileEmail, setProfileEmail] = useState(localStorage.getItem("userEmail") || "");
    const [profileMobile, setProfileMobile] = useState(localStorage.getItem("userMobile") || "");






    const { id } = useParams();
    const navigate = useNavigate()
    const [propertyData, setPropertyData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFloor, setActiveFloor] = useState(null);
    const [featuredProperties, setFeaturedProperties] = useState([]);
    const [isPlot, setIsPlot] = useState(false);

    const [name, setName] = useState(localStorage.getItem("name"));
    const [mobile, setMobile] = useState(localStorage.getItem("mobile"));

    const [email, setEmail] = useState(localStorage.getItem("email"));
    const [message, setMessage] = useState("I am Intersted!");
    const [bannersLoading, setBannersLoading] = useState(true); // 👈 new state
    // inside Properties component
    const [liked, setLiked] = useState(false);
    const [hover, setHover] = useState(false);

    const [favoriteId, setFavoriteId] = useState(null);

    useEffect(() => {
        if (propertyData?.isFavourite) {
            setFavoriteId(propertyData.isFavourite); // store the id directly
            console.log(propertyData.isFavourite)
        } else {
            setFavoriteId(null);
        }
    }, [propertyData]);

    useEffect(() => {
        fetchAminitiesIcons()
    }, []);

    const handleFavorite = async () => {
        const fd = new FormData();
        fd.append("programType", "addFavorites");
        fd.append("property_id", id);
        fd.append("authToken", localStorage.getItem("authToken"));

        try {
            const response = await api.post("/properties/property", fd);
            console.log("Wishlist:", response);

            if (response.data.success) {
                // API should return new favoriteId
                setFavoriteId(response.data.favoriteId || true);
                toast.success(response.data.message);
                fetchDetails()
            }
        } catch (error) {
            console.error("Error adding favorite:", error);
            setError("Error adding to favorites");
        }
    };

    const [iconsData, setIconsData] = useState([]);

    const fetchAminitiesIcons = async () => {
        const fd = new FormData();
        fd.append("programType", "getAmenities");
        fd.append("authToken", localStorage.getItem("authToken"));

        try {
            const response = await api.post("properties/amenities", fd);
            if (response.data.success) {
                setIconsData(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching icons:", error);
        }
    };


    const handleRemove = async () => {
        if (!favoriteId) return; // nothing to remove

        const fd = new FormData();
        fd.append("programType", "removeFavorites");
        fd.append("favoriteId", favoriteId); // use favoriteId, not property id
        fd.append("property_id", id); // use favoriteId, not property id

        fd.append("authToken", localStorage.getItem("authToken"));

        console.log("Submitting form data:");
        for (let pair of fd.entries()) {
            console.log(pair[0], pair[1]); // Logs each key-value pair
        }


        try {
            const response = await api.post("/properties/property", fd);
            console.log("Remove:", response);

            if (response.data.success) {
                setFavoriteId(null);
                toast.success(response.data.message);
            }
        } catch (error) {
            console.error("Error removing favorite:", error);
            setError("Error removing from favorites");
        }
    };

    const handleAddEnquiry = async () => {


        const fd = new FormData();
        fd.append("programType", "getInquiryForProperty");
        fd.append("name", name);
        fd.append("email", email);


        fd.append("phone", mobile);

        fd.append("message", message);


        fd.append("property_id", id); // use favoriteId, not property id

        fd.append("authToken", localStorage.getItem("authToken"));

        try {
            const response = await api.post("properties/propertyInquiry", fd);
            console.log("enquiry:", response);

            if (response.data.success) {
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);

            }
        } catch (error) {
            console.error("Error removing favorite:", error);
            setError("Error removing from favorites");
        }
    };


    const toggleFavorite = (e) => {
        e.preventDefault();
        if (favoriteId) {
            handleRemove();
        } else {
            handleFavorite();
        }
    };


    const handleToggleFloor = (index) => {
        setActiveFloor(activeFloor === index ? null : index);
    };

    const fetchDetails = async () => {
        const fd = new FormData();
        fd.append("programType", "propertyOverView");
        fd.append("id", id);
        fd.append("authToken", localStorage.getItem("authToken"));

        try {
            const response = await api.post("/properties/property", fd);
            console.log("API Response:", response);

            if (response.data.success) {
                const data = response.data.data[0];
                setPropertyData(data);

                // Check if it's a plot
                const isPlotProperty = data.details.apartment_type === "Plot" ||
                    data.property.sub_property_type_id === "Residential Plot" ||
                    data.area.plot_area > 0;
                setIsPlot(isPlotProperty);

                // For demo purposes, we'll use the same property as featured
                setFeaturedProperties([data]);
            } else {
                setError(response.data.message || "Failed to fetch property details");
            }
        } catch (error) {
            console.error("Error fetching properties:", error);
            setError("Error fetching property details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const handleShare = async () => {
        const shareData = {
            title: "Check this out!",
            text: "Have a look at this amazing property.",
            url: window.location.href, // current page URL
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
                console.log("Shared successfully");
            } catch (err) {
                console.error("Share failed:", err.message);
            }
        } else {
            // Fallback (desktop browsers)
            alert(
                "Sharing not supported on this device. Copy the link manually:\n" +
                window.location.href
            );
        }
    };






    const [star, setStar] = useState("");
    const [review, setReview] = useState();



    const reviewAdd = async (e) => {
        if (e) e.preventDefault();

        if (!rating) {
            toast.error("Please select a star rating");
            return;
        }
        if (!review || review.trim() === "") {
            toast.error("Please write a review message");
            return;
        }

        setLoadingReview(true);

        const fd = new FormData();
        fd.append("programType", "addReviewOnProperty");
        fd.append("authToken", localStorage.getItem("authToken"));
        fd.append("property_id", id);
        fd.append("message", review);
        fd.append("star", rating);

        try {
            const response = await api.post("/properties/property", fd);
            console.log("Review Response:", response);

            if (response.data.success) {
                toast.success("Review submitted successfully!");

                // ✅ Create a new review object (mimic backend structure)
                const newReview = {
                    id: Date.now(), // temporary unique id
                    user_name: profileName || "Guest",
                    star: rating,
                    message: review,
                    created_at: new Date().toISOString(),
                };

                // ✅ Update propertyData state immediately
                setPropertyData((prev) => ({
                    ...prev,
                    review: [...(prev?.review || []), newReview],
                }));

                // ✅ Reset form
                setReview("");
                setRating(0);
            } else {
                toast.error(response.data.message || "Failed to submit review");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            toast.error("Something went wrong");
        } finally {
            setLoadingReview(false);
        }
    };








    // Alternative: Bouncing cubes loader
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

    if (error) {
        return (
            <div>
                <Header />
                <div className="container text-center py-5">
                    <div className="alert alert-danger">{error}</div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!propertyData) {
        return (
            <div>
                <Header />
                <div className="container text-center py-5">
                    <div className="alert alert-warning">No property data found</div>
                </div>
                <Footer />
            </div>
        );
    }

    // Extract property images for the slider
    // Extract property images for the slider (excluding Plans)
    const propertyImages = propertyData.propertyImages || [];
    const sliderImages = propertyImages
        .filter(img => img.image_type !== "Plan") // 👈 exclude Plan images
        .map(img => img.image_path);

    // Fallback images if no property images available (after filtering)
    const images1 = sliderImages.length > 0 ? sliderImages : [
        "images/banner/banner-property-1.jpg",
        "images/banner/banner-property-3.jpg",
        "images/banner/banner-property-2.jpg",
        "images/banner/banner-property-1.jpg",
        "images/banner/banner-property-3.jpg",
        "images/banner/banner-property-2.jpg",
    ];

    // Format currency
    const formatCurrency = (amount, currency = "INR") => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Features data - conditionally show based on property type
    const featuresData = isPlot ? [
        { icon: "icon-ruler", label: `${propertyData.area.plot_area} ${propertyData.area.plot_area_unit || 'sqft'}` },
        { icon: "icon-arrows-out", label: `${propertyData.construction.open_sides || 0} Open Sides` },
        { icon: "icon-fence", label: propertyData.construction.has_boundary_wall ? "Boundary Wall" : "No Boundary Wall" },
        { icon: "icon-map-pin", label: `Facing ${propertyData.location.property_facing || 'East'}` }
    ] : [
        { icon: "icon-bed", label: `${propertyData.details.bedrooms} Bedrooms` },
        { icon: "icon-bathtub", label: `${propertyData.details.bathrooms} Bathrooms` },
        { icon: "icon-ruler", label: `${propertyData.area.carpet_area || propertyData.area.built_up_area} ${propertyData.area.carpet_area_unit || propertyData.area.built_up_area_unit || 'sqft'}` },
        { icon: "fa-regular fa-building", label: `Floor ${propertyData.details.property_on_floor}/${propertyData.details.total_floors}` }

    ];

    // Overview data - conditionally show based on property type
    const overviewData = isPlot ? [
        { icon: "icon-ruler", label: "Plot Area", value: `${propertyData.area.plot_area} ${propertyData.area.plot_area_unit || 'sqft'}` },
        { icon: "icon-arrows-out", label: "Dimensions", value: `${propertyData.construction.plot_length || propertyData.area.plot_length || '0'} x ${propertyData.construction.plot_breadth || propertyData.area.plot_breadth || '0'} ft` },
        { icon: "icon-arrows-out", label: "Open Sides", value: propertyData.construction.open_sides || 0 },
        { icon: "icon-calendar", label: "Floors Allowed", value: propertyData.details.floors_allowed || 0 }
    ] : [
        { icon: "icon-bed", label: "Bedrooms", value: propertyData.details.bedrooms },
        { icon: "icon-bathtub", label: "Bathrooms", value: propertyData.details.bathrooms },
        { icon: "icon-ruler", label: "Area", value: `${propertyData.area.carpet_area || propertyData.area.built_up_area} ${propertyData.area.carpet_area_unit || propertyData.area.built_up_area_unit || 'sqft'}` },
        // { icon: "fa-regular fa-building", label: "Year Built", value: propertyData.construction.year_built || 'N/A' }
    ];

    // Property details - conditionally show based on property type
    const propertyDetailsData = isPlot ? [
        { label: "Property Type", value: propertyData.property.sub_property_type_id || propertyData.property.property_type_id },
        { label: "Listing Type", value: propertyData.property.listing_type },
        { label: "Plot Dimensions", value: `${propertyData.construction.plot_length || propertyData.area.plot_length || '0'} x ${propertyData.construction.plot_breadth || propertyData.area.plot_breadth || '0'} ft` },
        { label: "Road Width", value: `${propertyData.location.road_width} ${propertyData.location.road_width_unit}` },
        { label: "Facing", value: propertyData.location.property_facing || 'East' },
        { label: "Price per sqft", value: `${propertyData.pricing.currency} ${propertyData.pricing.price_per_sqft}` }
    ] : [
        { label: "Property Type", value: propertyData.property.property_type_id },
        { label: "Listing Type", value: propertyData.property.listing_type },
        { label: "Floor", value: `${propertyData.details.property_on_floor} of ${propertyData.details.total_floors}` },
        { label: "Furnishing", value: propertyData.features.furnishing },
        { label: "Availability", value: propertyData.availability.availability_status },
        { label: "Price per sqft", value: `${propertyData.pricing.currency} ${propertyData.pricing.price_per_sqft}` }
    ];

    // Sample amenities data (categorized)
    const amenitiesData = [
        {
            category: "Amenities",
            items: Array.isArray(propertyData?.features?.amenities)
                ? propertyData.features.amenities.map((amenity) => ({
                    icon: "icon-check",
                    label: amenity.replace(/_/g, " "),
                }))
                : [], // fallback empty array if it's not an array
        },
        {
            category: "Additional Features",
            items: Array.isArray(propertyData?.features?.additional_features)
                ? propertyData.features.additional_features.map((feature) => ({
                    icon: "icon-check",
                    label: feature.replace(/_/g, " "),
                }))
                : [],
        },
    ];

    // Add construction features for plots
    if (isPlot) {
        amenitiesData.push({
            category: "Plot Features",
            items: [
                { icon: "icon-check", label: propertyData.construction.has_boundary_wall ? "Boundary Wall" : "No Boundary Wall" },
                { icon: "icon-check", label: `${propertyData.construction.open_sides || 0} Open Sides` },
                { icon: "icon-check", label: `Entrance Width: ${propertyData.construction.entrance_width} ${propertyData.construction.entrance_width_unit}` }
            ].filter(item => item.label)
        });
    } else {
        // Add furnishing details for buildings
        if (propertyData.features.furnishing_details && propertyData.features.furnishing_details.length > 0) {
            amenitiesData.push({
                category: "Furnishing Details",
                items: propertyData.features.furnishing_details.map(detail => ({
                    icon: "icon-check",
                    label: detail.replace(/_/g, ' ')
                }))
            });
        }
    }

    // Add safety features if available
    if (propertyData.features.fire_safety_features && propertyData.features.fire_safety_features.length > 0) {
        amenitiesData.push({
            category: "Safety Features",
            items: propertyData.features.fire_safety_features.map(safety => ({
                icon: "icon-check",
                label: safety.replace(/_/g, ' ')
            }))
        });
    }

    // Sample contact seller data
    const contactSellerData = {
        avatar: propertyData.customerDetails.profile || "images/avatar/avatar-default.png",
        name: `${propertyData.customerDetails.firstName} ${propertyData.customerDetails.lastName}`,
        phone: propertyData.customerDetails.mobile,
        email: propertyData.customerDetails.email
    };

    // Sample why choose us data
    const whyChooseUsData = [
        { icon: "icon-shield-check", label: "Verified Property" },
        { icon: "icon-currency-circle-dollar", label: "Best Price Guarantee" },
        { icon: "icon-headset", label: "24/7 Support" },
        { icon: "icon-map-pin", label: "Prime Location" }
    ];


    return (
        <div>
            <Header />

            <section className="flat-location flat-slider-detail-v1">
                <Swiper
                    modules={[Navigation, Autoplay]}
                    slidesPerView={2}
                    spaceBetween={20}
                    centeredSlides={true}
                    loop={true}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    navigation={{
                        nextEl: ".nav-next-location",
                        prevEl: ".nav-prev-location",
                    }}
                    className="tf-sw-location"
                >
                    {images1.map((src, index) => (
                        <SwiperSlide key={index}>
                            <Link
                                to={`${api.imageUrl}/${src}`}
                                data-fancybox="gallery"
                                className="box-imgage-detail d-block"
                            >
                                <img
                                    src={`${api.imageUrl}/${src}`}
                                    alt={`img-property-${index}`}
                                    onError={(e) => {
                                        e.target.src =
                                            "https://themesflat.co/html/homzen/images/home/house-2.jpg";
                                    }}
                                    style={{
                                        width: "100%",
                                        height: "400px",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                    }}
                                />
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>


                {/* Navigation buttons */}
                <div className="box-navigation">
                    <div className="navigation swiper-nav-next nav-next-location">
                        <span className="icon icon-arr-l"></span>
                    </div>
                    <div className="navigation swiper-nav-prev nav-prev-location">
                        <span className="icon icon-arr-r"></span>
                    </div>
                </div>

                {/* Icon box */}
                <div className="icon-box">

                    <Link

                        className="item active"
                        data-fancybox="gallery"
                    >
                        <span className="icon icon-images"></span>
                    </Link>
                </div>
            </section>

            <section className="flat-section pt-0 flat-property-detail">
                <div className="container">
                    {/* Header */}
                    <div className="header-property-detail">
                        <div className="content-top d-flex justify-content-between align-items-center">
                            <div className="box-name">
                                {/* <a href="#" className="flag-tag primary">
                                    {propertyData.property.status === 1 ? "Active" : "Inactive"}
                                </a> */}
                                <span
                                    className="flag-tag primary"
                                    style={{ marginLeft: "5px" }}
                                >
                                    {propertyData.property.listing_type}
                                </span>
                                <h4 className="title link">{propertyData.property.title}</h4>
                                {isPlot && <span className="badge bg-secondary ms-2">Plot</span>}
                            </div>
                            <div className="box-price d-flex align-items-center">
                                {propertyData.property.listing_type === "sale" ? (
                                    <>
                                        <h4>{formatCurrency(propertyData.pricing.expected_price)}</h4>
                                        <span className="body-1 text-variant-1"></span>
                                    </>
                                ) : (
                                    <>
                                        <h4>{formatCurrency(propertyData.pricing.expected_rent)}</h4>
                                        <span className="body-1 text-variant-1">/month</span>
                                    </>
                                )}
                            </div>

                        </div>
                        <div className="content-bottom">
                            <div className="info-box">
                                <div className="label">FEATURES:</div>
                                <ul className="meta">
                                    {featuresData.map((f, i) => (
                                        <li className="meta-item" style={{ color: "red" }} key={i}>
                                            {f.icon.startsWith("fa") ? (
                                                <i className={f.icon}></i>
                                            ) : (
                                                <span className={`icon icon-b ${f.icon}`} style={{ color: "red !important" }}></span>
                                            )}
                                            <span style={{ color: "black" }}>{f.label}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="info-box">
                                <div className="label">LOCATION:</div>
                                <p className="meta-item">
                                    <span className="icon icon-mapPin"></span>
                                    {propertyData.location.address}, {propertyData.location.location}
                                </p>
                            </div>
                            <ul className="icon-box" >
                                <li>
                                    <a href="#" className="item" onClick={toggleFavorite}>
                                        <span
                                            className={favoriteId ? "fa-solid fa-heart" : "fa-regular fa-heart"}
                                            style={{
                                                fontSize: "20px",
                                                color: favoriteId ? "red" : "#555", // red if liked, grey otherwise
                                                cursor: "pointer",
                                                transition: "color 0.3s ease",
                                            }}
                                            onMouseEnter={() => setHover(true)}
                                            onMouseLeave={() => setHover(false)}
                                        ></span>
                                    </a>
                                </li>

                                <li>
                                    <a
                                        href="#"
                                        className="item"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleShare();
                                        }}
                                    >
                                        <span
                                            className="fa-solid fa-share-from-square"
                                            style={{
                                                fontSize: "20px",
                                                color: "black",
                                                cursor: "pointer",
                                                transition: "color 0.3s ease",
                                            }}
                                        ></span>
                                    </a>
                                </li>
                                {/* <li>
                                    <a href="#" className="item">
                                        <span className="icon icon-printer"></span>
                                    </a>
                                </li> */}
                            </ul>
                        </div>
                    </div>

                    <div className="row">
                        {/* Main Content */}
                        <div className="col-lg-8">
                            {/* Description */}
                            <div className="single-property-element single-property-desc">
                                <div className="h7 title fw-7">Description</div>
                                <p className="body-2 text-variant-1">{propertyData.property.description}</p>
                                <p className="body-2 text-variant-1">{propertyData.property.unique_property}</p>
                            </div>

                            {/* Overview */}
                            <div className="single-property-element single-property-overview">
                                <div className="h7 title fw-7">Overview</div>
                                <ul className="info-box">
                                    {overviewData.map((o, i) => (
                                        <li className="item" key={i}>
                                            <a href="#" className="box-icon w-52"><i className={`icon ${o.icon}`}></i></a>
                                            <div className="content">
                                                <span className="label">{o.label}:</span>
                                                <span>{o.value}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Video - Only show if not a plot or if plot has video */}
                            {/* Video - Only show if not a plot or if plot has video */}
                            {/* {!isPlot && (
                                <div className="single-property-element single-property-video">
                                    <div className="h7 title fw-7">Video</div>
                                    <div className="video-wrapper">
                                        <iframe
                                            width="100%"
                                            height="400"
                                            src="https://www.youtube.com/embed/MLpWrANjFbI"
                                            title="Property Video"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                </div>
                            )} */}

                            {/* Property Details */}
                            <div className="single-property-element single-property-info">
                                <div className="h7 title fw-7">Property Details</div>
                                <div className="row">
                                    {propertyDetailsData.map((d, i) => (
                                        <div className="col-md-6" key={i}>
                                            <div className="inner-box">
                                                <span className="label">{d.label}:</span>
                                                <div className="content fw-7">
                                                    {d.value}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Amenities and Features */}
                            {/* Amenities and Features */}
                            <div
                                style={{
                                    marginTop: "30px",
                                    marginBottom: "30px",
                                    padding: "20px",
                                    border: "1px solid #eee",
                                    borderRadius: "12px",
                                    background: "#fafafa",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                                }}
                            >
                                <h3
                                    style={{
                                        fontSize: "20px",
                                        fontWeight: "700",
                                        marginBottom: "20px",
                                        color: "#333",
                                    }}
                                >
                                    Amenities and Features
                                </h3>

                                <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
                                    {amenitiesData.map(
                                        (cat, ci) =>
                                            cat.items.length > 0 && (
                                                <div key={ci}>
                                                    <h4
                                                        style={{
                                                            fontSize: "16px",
                                                            fontWeight: "600",
                                                            marginBottom: "12px",
                                                            color: "#444",
                                                        }}
                                                    >
                                                        {cat.category}
                                                    </h4>

                                                    <ul
                                                        style={{
                                                            listStyle: "none",
                                                            padding: 0,
                                                            margin: 0,
                                                            display: "flex",
                                                            flexWrap: "wrap",
                                                            gap: "15px",
                                                        }}
                                                    >
                                                        {cat.items.map((f, fi) => {
                                                            // Find the matching icon from your icons API
                                                            const icon = iconsData?.find(
                                                                (i) =>
                                                                    i.name.toLowerCase().trim() ===
                                                                    f.label.toLowerCase().trim()
                                                            );

                                                            return (
                                                                <li
                                                                    key={fi}
                                                                    style={{
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        gap: "8px",
                                                                        fontSize: "14px",
                                                                        color: "#555",
                                                                        padding: "6px 10px",
                                                                        background: "#fff",
                                                                        border: "1px solid #e0e0e0",
                                                                        borderRadius: "8px",
                                                                        minWidth: "120px",
                                                                    }}
                                                                >
                                                                    {icon ? (
                                                                        <img
                                                                            src={`${api.imageUrl}/${icon.image}`}
                                                                            alt={f.label}
                                                                            style={{
                                                                                width: "25px",
                                                                                height: "25px",
                                                                                objectFit: "contain",
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <span
                                                                            className={`icon ${f.icon}`}
                                                                            style={{
                                                                                color: "#4a90e2",
                                                                                fontSize: "16px",
                                                                            }}
                                                                        ></span>
                                                                    )}
                                                                    {f.label}
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                </div>
                                            )
                                    )}
                                </div>
                            </div>




                            {/* Map */}
                            <div className="single-property-element single-property-map">
                                <div className="h7 title fw-7">Map</div>

                                <div className="map-single" style={{ width: "100%", height: "400px" }}>
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        style={{ border: 0 }}
                                        loading="lazy"
                                        allowFullScreen
                                        src={`https://www.google.com/maps?q=${propertyData?.latitude},${propertyData?.longitude}&hl=en&z=16&output=embed`}
                                    ></iframe>
                                </div>

                                <ul className="info-map">
                                    <li>
                                        <div className="fw-7">Address</div>
                                        <span className="mt-4 text-variant-1">{propertyData?.property?.address || "Not Available"}</span>
                                    </li>
                                    <li>
                                        <div className="fw-7">Downtown</div>
                                        <span className="mt-4 text-variant-1">5 min</span>
                                    </li>
                                    <li>
                                        <div className="fw-7">FLL</div>
                                        <span className="mt-4 text-variant-1">15 min</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Floor Plans - Only show for buildings */}
                            {propertyData.propertyImages
                                .filter(img => img.image_type === "Plan") // only take floor plans
                                .map((planImg, index) => (
                                    <>
                                        {!isPlot && propertyData.propertyImages?.length > 0 && (
                                            <div className="single-property-element single-property-floor">
                                                <div className="h7 title fw-7 pt-3">Floor Plans</div>

                                                <ul className="box-floor" id="parent-floor">
                                                    {propertyData.propertyImages
                                                        .filter((img) => img.image_type === "Plan")
                                                        .map((planImg, index) => (
                                                            <li className="floor-item" key={index}>
                                                                <div
                                                                    className="floor-header"
                                                                    onClick={() => handleToggleFloor(index)}
                                                                    style={{ cursor: "pointer" }}
                                                                >
                                                                    <div className="inner-left">
                                                                        {/* Toggle arrow based on activeFloor */}
                                                                        {activeFloor === index ? (
                                                                            <i className="fas fa-chevron-up me-2"></i> // Up arrow when expanded
                                                                        ) : (
                                                                            <i className="fas fa-chevron-down me-2"></i> // Down arrow when collapsed
                                                                        )}
                                                                        <span className="fw-7">
                                                                            {planImg.image_label || `Plan ${index + 1}`}
                                                                        </span>
                                                                    </div>

                                                                    <ul className="inner-right">
                                                                        <li className="d-flex align-items-center gap-8">
                                                                            <i className="fas fa-bed"></i>{" "}
                                                                            {propertyData.details.bedrooms} Bedrooms
                                                                        </li>
                                                                        <li className="d-flex align-items-center gap-8">
                                                                            <i className="fas fa-bath"></i>{" "}
                                                                            {propertyData.details.bathrooms} Bathrooms
                                                                        </li>
                                                                        <li className="d-flex align-items-center gap-8">
                                                                            <i className="fas fa-ruler-combined"></i>{" "}
                                                                            {propertyData.area.carpet_area}{" "}
                                                                            {propertyData.area.carpet_area_unit}
                                                                        </li>
                                                                    </ul>
                                                                </div>

                                                                {activeFloor === index && (
                                                                    <div className="faq-body">
                                                                        <div className="box-img">
                                                                            <img
                                                                                src={`${api.imageUrl}${planImg.image_path}`}
                                                                                alt={planImg.image_label || "Floor Plan"}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </li>
                                                        ))}
                                                </ul>
                                            </div>
                                        )}

                                    </>
                                ))}


                            {/* Plot Layout - Only show for plots */}
                            {isPlot && propertyImages.some(img => img.image_type === 'Plan' || img.image_type === 'plot_layout') && (
                                <div className="single-property-element single-property-floor">
                                    <div className="h7 title fw-7">Plot Layout</div>
                                    <div className="box-img">
                                        <img src={propertyImages.find(img => img.image_type === 'Plan' || img.image_type === 'plot_layout')?.image_path || "images/banner/banner-property-1.jpg"} alt="plot-layout" />
                                    </div>
                                </div>
                            )}

                            {/* Attachments */}
                            {/* <div className="single-property-element single-property-attachments">
                                <div className="h7 title fw-7">File Attachments</div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <a href="#" target="_blank" className="attachments-item">
                                            <div className="box-icon w-60">
                                                <img src="https://themesflat.co/html/homzen/images/home/file-1.png" alt="file" />
                                            </div>
                                            <span>Property Brochure</span>
                                            <i className="icon icon-download"></i>
                                        </a>
                                    </div>
                                    <div className="col-sm-6">
                                        <a href="#" target="_blank" className="attachments-item">
                                            <div className="box-icon w-60">
                                                <img src="https://themesflat.co/html/homzen/images/home/file-1.png" alt="file" />
                                            </div>
                                            <span>{isPlot ? "Plot Layout" : "Floor Plan Details"}</span>
                                            <i className="icon icon-download"></i>
                                        </a>
                                    </div>
                                </div>
                            </div> */}

                            {/* Explore - Only show for buildings */}
                            {/* {!isPlot && (
                                <div className="single-property-element single-property-explore">
                                    <div className="h7 title fw-7">Explore Property</div>
                                    <div className="box-img">
                                        <img src="images/banner/banner-property-1.jpg" alt="img" />
                                        <div className="box-icon w-80">
                                            <span className="icon icon-360-view"></span>
                                        </div>
                                    </div>
                                </div>
                            )} */}

                            {/* Loan Calculator */}
                            {/* <div className="single-property-element single-property-loan">
                                <div className="h7 title fw-7">Loan Calculator</div>
                                <form action="#" className="box-loan-calc">
                                    <div className="box-top">
                                        <div className="item-calc">
                                            <label className="label">Home Price:</label>
                                            <input type="number" placeholder="2500000" className="form-control" />
                                        </div>
                                        <div className="item-calc">
                                            <label className="label">Down Payment:</label>
                                            <input type="number" placeholder="500000" className="form-control" />
                                        </div>
                                        <div className="item-calc">
                                            <label className="label">Loan Term (Years):</label>
                                            <input type="number" placeholder="20" className="form-control" />
                                        </div>
                                        <div className="item-calc">
                                            <label className="label">Interest Rate (%):</label>
                                            <input type="number" placeholder="7.5" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="box-bottom">
                                        <button className="tf-btn primary">Calculator</button>
                                        <div className="d-flex gap-4">
                                            <span className="h7 fw-7">Monthly Payment:</span>
                                            <span className="result h7 fw-7">₹11,976</span>
                                        </div>
                                    </div>
                                </form>
                            </div> */}

                            {/* Nearby */}
                            {/* <div className="single-property-element single-property-nearby">
                                <div className="h7 title fw-7">What's nearby?</div>
                                <p className="body-2">This property is conveniently located near various amenities and facilities.</p>
                                <div className="grid-2 box-nearby">
                                    <ul className="box-left">
                                        <li className="item-nearby">
                                            <span className="label">Schools:</span>
                                            <span className="fw-7">Within 1 km</span>
                                        </li>
                                        <li className="item-nearby">
                                            <span className="label">Hospitals:</span>
                                            <span className="fw-7">Within 2 km</span>
                                        </li>
                                        <li className="item-nearby">
                                            <span className="label">Shopping Malls:</span>
                                            <span className="fw-7">Within 1.5 km</span>
                                        </li>
                                    </ul>
                                    <ul className="box-right">
                                        <li className="item-nearby">
                                            <span className="label">Public Transport:</span>
                                            <span className="fw-7">Within 500 m</span>
                                        </li>
                                        <li className="item-nearby">
                                            <span className="label">Parks:</span>
                                            <span className="fw-7">Within 800 m</span>
                                        </li>
                                        <li className="item-nearby">
                                            <span className="label">Restaurants:</span>
                                            <span className="fw-7">Within 1 km</span>
                                        </li>
                                    </ul>
                                </div>
                            </div> */}

                            {/* Reviews - Keeping this section as it was */}
                            <div className="single-property-element single-wrapper-review">
                                <div className="box-title-review d-flex justify-content-between align-items-center flex-wrap gap-20">
                                    <div className="h7 fw-7">Reviews</div>
                                    {propertyData?.review?.length > 1 && (
                                        <button
                                            type="button"
                                            className="tf-btn"
                                            onClick={() => setShowAllReviews(!showAllReviews)}
                                        >
                                            {showAllReviews ? "Show Latest Review" : "View All Reviews"}
                                        </button>
                                    )}
                                </div>

                                <div className="wrap-review">
                                    <ul className="box-review">
                                        {propertyData?.review?.length > 0 ? (
                                            (showAllReviews
                                                ? propertyData.review   // show all
                                                : [propertyData.review[propertyData.review.length - 1]] // show only latest
                                            ).map((rev) => (
                                                <li className="list-review-item" key={rev.id}>
                                                    <div className="avatar avt-60 round">
                                                        <img 
                                                        // src={download} 
                                                        src={rev?.profile ? `${api.imageUrl}${rev.profile}` : download}
                                                        alt="avatar" />

                                                    </div>
                                                    <div className="content">
                                                        <div className="name h7 fw-7 text-black">{rev.user_name || "Guest"}</div>
                                                        <span className="mt-4 d-inline-block date body-3 text-variant-2">
                                                            {new Date(rev.created_at).toLocaleDateString("en-GB", {
                                                                day: "2-digit",
                                                                month: "2-digit",
                                                                year: "numeric",
                                                            })}
                                                        </span>
                                                        <ul className="mt-8 list-star">
                                                            {[1, 2, 3, 4, 5].map((s) => (
                                                                <li
                                                                    key={s}
                                                                    className={s <= rev.star ? "icon-star" : "icon-star text-muted"}
                                                                ></li>
                                                            ))}
                                                        </ul>


                                                        <p className="mt-12 body-2 text-black" style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                                                            {rev.message}
                                                        </p>

                                                    </div>
                                                </li>
                                            ))
                                        ) : (
                                            <li>No reviews yet. Be the first to comment!</li>
                                        )}
                                    </ul>

                                </div>


                                <div className="wrap-form-comment">
                                    <div className="h7">Leave A Reply</div>
                                    <div id="comments" className="comments">
                                        <div className="respond-comment">
                                            <form method="post" id="contactform" className="comment-form form-submit"
                                                action="https://themesflat.co/html/homzen/contact/contact-process.php" acceptCharset="utf-8"
                                                noValidate="novalidate">








                                                <fieldset className="form-wg">
                                                    <label className="sub-ip">Your Rating</label>
                                                    <div className="star-rating d-flex gap-2">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <span
                                                                key={star}
                                                                className="star"
                                                                onClick={() => setRating(star)}
                                                                onMouseEnter={() => setHovers(star)}
                                                                onMouseLeave={() => setHovers(0)}
                                                                style={{
                                                                    fontSize: "28px",
                                                                    cursor: "pointer",
                                                                    color:
                                                                        star <= (hovers || rating) ? "#f5c518" : "#ccc",
                                                                }}
                                                            >
                                                                {star <= (hovers || rating) ? "★" : "☆"}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <input type="hidden" name="rating" value={rating} />
                                                </fieldset>

                                                <fieldset className="form-wg">
                                                    <label className="sub-ip">Review</label>
                                                    <textarea

                                                        value={review}
                                                        onChange={(e) => setReview(e.target.value)}
                                                        rows="4"
                                                        placeholder="Write comment "
                                                        aria-required="true"
                                                    ></textarea>
                                                </fieldset>


                                                <button
                                                    className="form-wg tf-btn primary"
                                                    onClick={reviewAdd}
                                                    disabled={loadingReview}
                                                >
                                                    {loadingReview ? (
                                                        <span>
                                                            <i className="fa fa-spinner fa-spin" style={{ marginRight: "8px" }}></i>
                                                            Posting...
                                                        </span>
                                                    ) : (
                                                        <span>Post Comment</span>
                                                    )}
                                                </button>





                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>




                        {/* Sidebar */}
                        <div className="col-lg-4">
                            <div className="widget-sidebar fixed-sidebar wrapper-sidebar-right">
                                {/* Contact Seller */}






                                <div className="widget-box single-property-contact bg-surface">
                                    <div className="h7 title fw-7">Contact Seller</div>
                                    <div className="box-avatar">
                                        <div className="avatar avt-100 round">
                                            <img src={profileImg} alt="avatar" />
                                        </div>
                                        <div className="info">
                                            <div className="text-1 name">{profileName}</div>
                                            <span>
                                                {profileMobile} {profileEmail}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Contact form */}
                                    <form action="#" className="contact-form">
                                        <div className="ip-group">
                                            <label>Full Name:</label>
                                            <input
                                                type="text"
                                                placeholder="Your Name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="ip-group">
                                            <label>Phone Number:</label>
                                            <input
                                                type="text"
                                                placeholder="ex 0123456789"
                                                value={mobile}
                                                onChange={(e) => setMobile(e.target.value)}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="ip-group">
                                            <label>Email Address:</label>
                                            <input
                                                type="text"
                                                placeholder="your@email.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="ip-group">
                                            <label>Your Message:</label>
                                            <textarea
                                                name="message"
                                                rows="4"
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                placeholder="Message"
                                                aria-required="true"
                                                className="form-control"
                                            ></textarea>
                                        </div>
                                        <button
                                            type="button"   // <-- important: stop form submit
                                            className="tf-btn primary w-100"
                                            onClick={(e) => {
                                                e.preventDefault();   // stop page reload
                                                handleAddEnquiry();
                                            }}
                                        >
                                            Send Message
                                        </button>

                                    </form>
                                </div>

                                {/* Search Widget - Keeping this section as it was */}
                                {/* <div className="flat-tab flat-tab-form widget-filter-search widget-box bg-surface">
                                    <div className="h7 title fw-7">Search</div>
                                    <ul className="nav-tab-form" role="tablist">
                                        <li className="nav-tab-item" role="presentation">
                                            <a href="#forRent" className="nav-link-item active" data-bs-toggle="tab">For Rent</a>
                                        </li>
                                        <li className="nav-tab-item" role="presentation">
                                            <a href="#forSale" className="nav-link-item" data-bs-toggle="tab">For Sale</a>
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
                                                                <input type="text" className="form-control" placeholder="Search Keyword." value="" name="s" title="Search for" required="" />
                                                            </div>
                                                            <div className="form-style">
                                                                <label className="title-select">Location</label>
                                                                <div className="group-ip ip-icon">
                                                                    <input type="text" className="form-control" placeholder="Search Location" value="" name="s" title="Search for" required="" />
                                                                    <a href="#" className="icon-right icon-location"></a>
                                                                </div>
                                                            </div>
                                                            <div className="form-style">
                                                                <label className="title-select">Type</label>
                                                                <div className="group-select">
                                                                    <div className="nice-select" tabIndex="0"><span className="current">All</span>
                                                                        <ul className="list">
                                                                            <li data-value className="option selected">All</li>
                                                                            <li data-value="villa" className="option">Villa</li>
                                                                            <li data-value="studio" className="option">Studio</li>
                                                                            <li data-value="office" className="option">Office</li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="form-style box-select">
                                                                <label className="title-select">Rooms</label>
                                                                <div className="nice-select" tabIndex="0"><span className="current">2</span>
                                                                    <ul className="list">
                                                                        <li data-value="2" className="option">1</li>
                                                                        <li data-value="2" className="option selected">2</li>
                                                                        <li data-value="3" className="option">3</li>
                                                                        <li data-value="4" className="option">4</li>
                                                                        <li data-value="5" className="option">5</li>
                                                                        <li data-value="6" className="option">6</li>
                                                                        <li data-value="7" className="option">7</li>
                                                                        <li data-value="8" className="option">8</li>
                                                                        <li data-value="9" className="option">9</li>
                                                                        <li data-value="10" className="option">10</li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                            <div className="form-style box-select">
                                                                <label className="title-select">Bathrooms</label>
                                                                <div className="nice-select" tabIndex="0"><span className="current">4</span>
                                                                    <ul className="list">
                                                                        <li data-value="all" className="option">All</li>
                                                                        <li data-value="1" className="option">1</li>
                                                                        <li data-value="2" className="option">2</li>
                                                                        <li data-value="3" className="option">3</li>
                                                                        <li data-value="4" className="option selected">4</li>
                                                                        <li data-value="5" className="option">5</li>
                                                                        <li data-value="6" className="option">6</li>
                                                                        <li data-value="7" className="option">7</li>
                                                                        <li data-value="8" className="option">8</li>
                                                                        <li data-value="9" className="option">9</li>
                                                                        <li data-value="10" className="option">10</li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                            <div className="form-style box-select">
                                                                <label className="title-select">Bedrooms</label>
                                                                <div className="nice-select" tabIndex="0"><span className="current">4</span>
                                                                    <ul className="list">
                                                                        <li data-value="1" className="option">All</li>
                                                                        <li data-value="1" className="option">1</li>
                                                                        <li data-value="2" className="option">2</li>
                                                                        <li data-value="3" className="option">3</li>
                                                                        <li data-value="4" className="option selected">4</li>
                                                                        <li data-value="5" className="option">5</li>
                                                                        <li data-value="6" className="option">6</li>
                                                                        <li data-value="7" className="option">7</li>
                                                                        <li data-value="8" className="option">8</li>
                                                                        <li data-value="9" className="option">9</li>
                                                                        <li data-value="10" className="option">10</li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                            <div className="form-style widget-price">
                                                                <div className="box-title-price">
                                                                    <span className="title-price">Price Range</span>
                                                                    <div className="caption-price">
                                                                        <span>from</span>
                                                                        <span id="slider-range-value1" className="fw-7"></span>
                                                                        <span>to</span>
                                                                        <span id="slider-range-value2" className="fw-7"></span>
                                                                    </div>
                                                                </div>
                                                                <div id="slider-range"></div>
                                                                <div className="slider-labels">
                                                                    <input type="hidden" name="min-value" value="" />
                                                                    <input type="hidden" name="max-value" value="" />
                                                                </div>
                                                            </div>
                                                            <div className="form-style widget-price wd-price-2">
                                                                <div className="box-title-price">
                                                                    <span className="title-price">Size Range</span>
                                                                    <div className="caption-price">
                                                                        <span>from</span>
                                                                        <span id="slider-range-value01" className="fw-7"></span>
                                                                        <span>to</span>
                                                                        <span id="slider-range-value02" className="fw-7"></span>
                                                                    </div>
                                                                </div>
                                                                <div id="slider-range2"></div>
                                                                <div className="slider-labels">
                                                                    <input type="hidden" name="min-value2" value="" />
                                                                    <input type="hidden" name="max-value2" value="" />
                                                                </div>
                                                            </div>
                                                            <div className="form-style btn-show-advanced">
                                                                <a className="filter-advanced pull-right">
                                                                    <span className="icon icon-faders"></span>
                                                                    <span className="text-advanced">Show Advanced</span>
                                                                </a>
                                                            </div>
                                                            <div className="form-style wd-amenities">
                                                                <div className="group-checkbox">
                                                                    <div className="text-1">Amenities:</div>
                                                                    <div className="group-amenities">
                                                                        <fieldset className="amenities-item">
                                                                            <input type="checkbox" className="tf-checkbox style-1" id="cb1" defaultChecked />
                                                                            <label htmlFor="cb1" className="text-cb-amenities">Air Condition</label>
                                                                        </fieldset>
                                                                        <fieldset className="amenities-item">
                                                                            <input type="checkbox" className="tf-checkbox style-1" id="cb2" />
                                                                            <label htmlFor="cb2" className="text-cb-amenities">Disabled Access</label>
                                                                        </fieldset>
                                                                        <fieldset className="amenities-item">
                                                                            <input type="checkbox" className="tf-checkbox style-1" id="cb3" />
                                                                            <label htmlFor="cb3" className="text-cb-amenities">Ceiling Height</label>
                                                                        </fieldset>
                                                                        <fieldset className="amenities-item">
                                                                            <input type="checkbox" className="tf-checkbox style-1" id="cb4" defaultChecked />
                                                                            <label htmlFor="cb4" className="text-cb-amenities">Floor</label>
                                                                        </fieldset>
                                                                        <fieldset className="amenities-item">
                                                                            <input type="checkbox" className="tf-checkbox style-1" id="cb5" />
                                                                            <label htmlFor="cb5" className="text-cb-amenities">Heating</label>
                                                                        </fieldset>
                                                                        <fieldset className="amenities-item">
                                                                            <input type="checkbox" className="tf-checkbox style-1" id="cb6" />
                                                                            <label htmlFor="cb6" className="text-cb-amenities">Renovation</label>
                                                                        </fieldset>
                                                                        <fieldset className="amenities-item">
                                                                            <input type="checkbox" className="tf-checkbox style-1" id="cb7" />
                                                                            <label htmlFor="cb7" className="text-cb-amenities">Window Type</label>
                                                                        </fieldset>
                                                                        <fieldset className="amenities-item">
                                                                            <input type="checkbox" className="tf-checkbox style-1" id="cb8" />
                                                                            <label htmlFor="cb8" className="text-cb-amenities">Cable TV</label>
                                                                        </fieldset>
                                                                        <fieldset className="amenities-item">
                                                                            <input type="checkbox" className="tf-checkbox style-1" id="cb9" defaultChecked />
                                                                            <label htmlFor="cb9" className="text-cb-amenities">Elevator</label>
                                                                        </fieldset>
                                                                        <fieldset className="amenities-item">
                                                                            <input type="checkbox" className="tf-checkbox style-1" id="cb10" />
                                                                            <label htmlFor="cb10" className="text-cb-amenities">Furnishing</label>
                                                                        </fieldset>
                                                                        <fieldset className="amenities-item">
                                                                            <input type="checkbox" className="tf-checkbox style-1" id="cb11" />
                                                                            <label htmlFor="cb11" className="text-cb-amenities">Intercom</label>
                                                                        </fieldset>
                                                                        <fieldset className="amenities-item">
                                                                            <input type="checkbox" className="tf-checkbox style-1" id="cb12" />
                                                                            <label htmlFor="cb12" className="text-cb-amenities">Security</label>
                                                                        </fieldset>
                                                                        <fieldset className="amenities-item">
                                                                            <input type="checkbox" className="tf-checkbox style-1" id="cb13" />
                                                                            <label htmlFor="cb13" className="text-cb-amenities">Search property</label>
                                                                        </fieldset>
                                                                        <fieldset className="amenities-item">
                                                                            <input type="checkbox" className="tf-checkbox style-1" id="cb14" />
                                                                            <label htmlFor="cb14" className="text-cb-amenities">Ceiling Height</label>
                                                                        </fieldset>
                                                                        <fieldset className="amenities-item">
                                                                            <input type="checkbox" className="tf-checkbox style-1" id="cb15" />
                                                                            <label htmlFor="cb15" className="text-cb-amenities">Fence</label>
                                                                        </fieldset>
                                                                        <fieldset className="amenities-item">
                                                                            <input type="checkbox" className="tf-checkbox style-1" id="cb16" />
                                                                            <label htmlFor="cb16" className="text-cb-amenities">Fence</label>
                                                                        </fieldset>
                                                                        <fieldset className="amenities-item">
                                                                            <input type="checkbox" className="tf-checkbox style-1" id="cb17" defaultChecked />
                                                                            <label htmlFor="cb17" className="text-cb-amenities">Garage</label>
                                                                        </fieldset>
                                                                        <fieldset className="amenities-item">
                                                                            <input type="checkbox" className="tf-checkbox style-1" id="cb18" />
                                                                            <label htmlFor="cb18" className="text-cb-amenities">Parking</label>
                                                                        </fieldset>
                                                                        <fieldset className="amenities-item">
                                                                            <input type="checkbox" className="tf-checkbox style-1" id="cb19" />
                                                                            <label htmlFor="cb19" className="text-cb-amenities">Swimming Pool</label>
                                                                        </fieldset>
                                                                        <fieldset className="amenities-item">
                                                                            <input type="checkbox" className="tf-checkbox style-1" id="cb20" />
                                                                            <label htmlFor="cb20" className="text-cb-amenities">Construction Year</label>
                                                                        </fieldset>
                                                                        <fieldset className="amenities-item">
                                                                            <input type="checkbox" className="tf-checkbox style-1" id="cb21" />
                                                                            <label htmlFor="cb21" className="text-cb-amenities">Fireplace</label>
                                                                        </fieldset>
                                                                        <fieldset className="amenities-item">
                                                                            <input type="checkbox" className="tf-checkbox style-1" id="cb22" />
                                                                            <label htmlFor="cb22" className="text-cb-amenities">Garden</label>
                                                                        </fieldset>
                                                                        <fieldset className="amenities-item">
                                                                            <input type="checkbox" className="tf-checkbox style-1" id="cb23" />
                                                                            <label htmlFor="cb23" className="text-cb-amenities">Pet Friendly</label>
                                                                        </fieldset>
                                                                        <fieldset className="amenities-item">
                                                                            <input type="checkbox" className="tf-checkbox style-1" id="cb24" />
                                                                            <label htmlFor="cb24" className="text-cb-amenities">WiFi</label>
                                                                        </fieldset>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                            <div className="form-style btn-hide-advanced">
                                                                <a className="filter-advanced pull-right">
                                                                    <span className="icon icon-faders"></span>
                                                                    <span className="text-advanced">Hide Advanced</span>
                                                                </a>
                                                            </div>
                                                            <div className="form-style">
                                                                <button className="tf-btn primary" onClick={() => navigate("/listing")}>Find Properties</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>

                                    </div>
                                </div> */}

                                {/* Why Choose Us */}
                                <div className="widget-box single-property-whychoose bg-surface">
                                    <div className="h7 title fw-7">Why Choose Us?</div>
                                    <ul className="box-whychoose">
                                        {whyChooseUsData.map((w, i) => (
                                            <li className="item-why" key={i}>
                                                <i className={`icon ${w.icon}`}></i>
                                                {w.label}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Featured Properties Section */}
                        {/* <section className="flat-section pt-0 flat-latest-property">
                            <div className="container">
                                <div className="box-title">
                                    <div className="text-subtitle text-primary">Featured properties</div>
                                    <h4 className="mt-4">The Most Recent Estate</h4>
                                </div>

                                <Swiper
                                    modules={[Navigation, Autoplay]}
                                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                                    loop={true}
                                    spaceBetween={30}
                                    breakpoints={{
                                        0: { slidesPerView: 1 },
                                        768: { slidesPerView: 2 },
                                        1024: { slidesPerView: 3 },
                                    }}
                                >
                                    {featuredProperties.map((property, index) => (
                                        <SwiperSlide key={index}>
                                            <div className="homeya-box style-2">
                                                <div className="archive-top">
                                                    <Link to="#" className="images-group">
                                                        <div className="images-style">
                                                            <img src={propertyImages[0]?.image_path || "images/banner/banner-property-1.jpg"} alt="img" />
                                                        </div>
                                                        <div className="top">
                                                            <ul className="d-flex gap-8">
                                                                <li className="flag-tag success">Featured</li>
                                                                <li className="flag-tag style-1">For Sale</li>
                                                            </ul>
                                                            <ul className="d-flex gap-4">
                                                                <li className="box-icon w-32">
                                                                    <span className="icon icon-heart"></span>
                                                                </li>
                                                                <li className="box-icon w-32">
                                                                    <span className="icon icon-eye"></span>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div className="bottom">
                                                            <span className="flag-tag style-2">{propertyData.property.listing_type}</span>
                                                        </div>
                                                    </Link>
                                                    <div className="content">
                                                        <div className="h7 text-capitalize fw-7">
                                                            <Link to="#" className="link">
                                                                {propertyData.property.title}
                                                            </Link>
                                                        </div>
                                                        <div className="desc">
                                                            <i className="fs-16 icon icon-mapPin"></i>
                                                            <p>{propertyData.location.address}, {propertyData.location.location}</p>
                                                        </div>
                                                        <ul className="meta-list">
                                                            <li className="item">
                                                                <i className="icon icon-bed"></i>
                                                                <span>{propertyData.details.bedrooms}</span>
                                                            </li>
                                                            <li className="item">
                                                                <i className="icon icon-bathtub"></i>
                                                                <span>{propertyData.details.bathrooms}</span>
                                                            </li>
                                                            <li className="item">
                                                                <i className="icon icon-ruler"></i>
                                                                <span>{propertyData.area.carpet_area} {propertyData.area.carpet_area_unit}</span>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="archive-bottom d-flex justify-content-between align-items-center">
                                                    <div className="d-flex gap-8 align-items-center">
                                                        <div className="avatar avt-40 round">
                                                            <img src={contactSellerData.avatar} alt="avt" />
                                                        </div>
                                                        <span>{contactSellerData.name}</span>
                                                    </div>
                                                    <div className="d-flex align-items-center">
                                                        <h6>{formatCurrency(propertyData.pricing.sale_price)}</h6>
                                                        {propertyData.pricing.expected_rent && (
                                                            <span className="text-variant-1">/month</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </section> */}

                    </div>
                </div>
            </section>

            <Footer />

            <div className="progress-wrap">
                {/* <svg className="progress-circle svg-content" width="100%" height="100%" viewBox="-1 -1 102 102">
                    <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" style={{ transition: 'stroke-dashoffset 10ms linear 0s', strokeDasharray: '307.919, 307.919', strokeDashoffset: '286.138' }}></path>
                </svg> */}
            </div>
        </div>
    );
};

export default Properties;