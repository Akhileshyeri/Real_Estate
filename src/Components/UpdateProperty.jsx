import React, { useEffect, useState, useRef } from "react";
import Header from "./Header";
import "./Addproperty.css"; // Import styles
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import api from "../api/api";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { decryptId } from "../utils/crypto";

const UpdateProperty = () => {
  
      const { id: rawParam } = useParams();
  
      let encryptedId = rawParam;
      let slug = "";
  
      if (rawParam.includes("&slug=")) {
          const [enc, s] = rawParam.split("&slug=");
          encryptedId = enc;
          slug = s; // you can use slug if needed
      }
  
      const id = decryptId(encryptedId);


  const [percentage, setPercentage] = useState(0);
  const [listingType, setListingType] = useState("Sell");
  const [ownerPercentage, setOwnerPercentage] = useState("");
  const [ownerType, setOwnerType] = useState("");

  const [developerPercentage, setDeveloperPercentage] = useState("");

  const [sections, setSections] = useState([{ type: "Plan", files: [] }]);


  const [isOpen, setIsOpen] = useState(false);
  const [brokerageAmount, setBrokerageAmount] = useState("");


  const [currentStep, setCurrentStep] = useState(1);
  const [propertyType, setPropertyType] = useState("");
  const [subPropertyType, setSubPropertyType] = useState("");
  const [subPropertyQuestionOption, setSubPropertyQuestionOption] = useState("");
  const [subPropertyQuestionOptionLvl2, setSubPropertyQuestionOptionLvl2] = useState("");
  // 🟡 RENT DETAILS STATES
  const [availableFrom, setAvailableFrom] = useState("");
  const [willingTo, setWillingTo] = useState("");            // Family / Single men / Single women
  const [expectedRent, setExpectedRent] = useState("");
  const [elecWaterExcluded, setElecWaterExcluded] = useState(false);
  const [agreementType, setAgreementType] = useState("");    // Company lease agreement / Any
  const [allowBroker, setAllowBroker] = useState("");        // Yes / No
  const [membershipCharge, setMembershipCharge] = useState("");
  const [apartmentBhk, setApartmentBhk] = useState("");
  const [retailWashroom, setRetailWashroom] = useState([]);
  const [files, setFiles] = useState([]);



  const [previewList, setPreviewList] = useState([]);
  const fileInputRef = useRef(null);

  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const [parkingFacility, setParkingFacility] = useState("");

  // inside AddProperty.js

  const [allAmenities, setAllAmenities] = useState([]);   // API amenities
  const [selectedAmenities, setSelectedAmenities] = useState([]); // Chosen amenity IDs
  const [amenities, setAmenities] = useState({
    // Amenities
    maintenanceStaff: false,
    waterStorage: false,
    wasteDisposal: false,
    rainWaterHarvesting: false,
    pipedGas: false,
    waterPurifier: false,
    visitorParking: false,
    fengShui: false,
    park: false,

    // Property Features
    highCeilingHeight: false,
    falseCeilingLighting: false,
    internetWifi: false,
    centrallyAirConditioned: false,
    securityFireAlarm: false,
    recentlyRenovated: false,
    privateGardenTerrace: false,
    naturalLight: false,
    anyRooms: false,
    intercomFacility: false,
    spaciousInteriors: false,

    // Society/Building features
    fitnessCentre: false,
    swimmingPool: false,
    clubHouse: false,
    securityPersonnel: false,
    lift: false,

    // Additional Features
    separateEntryServantRoom: false,
    noOpenDrainage: false,
    bankAttachedProperty: false,
    lowDensitySociety: false,

    // Water Source
    municipalCorporation: false,
    borewellTank: false,
    water24x7: false,

    // Overlooking
    overlookingPool: false,
    overlookingPark: false,
    overlookingClub: false,
    overlookingMainRoad: false
  });


  // Fetch amenities on mount
  useEffect(() => {
    const fetchAmenities = async () => {
      const fd = new FormData();
      fd.append("programType", "getAmenities");
      fd.append("authToken", localStorage.getItem("authToken"));

      try {
        const response = await api.post("/properties/amenities", fd);
        if (response.data.success) {
          setAllAmenities(response.data.data); // Store amenities
        } else {
          toast.error("Failed to fetch amenities");
        }
      } catch (error) {
        console.error("Error fetching amenities:", error);
        toast.error("Error fetching amenities");
      }
    };

    fetchAmenities();
  }, []);

  // Toggle amenity selection
  const toggleAmenity = (name) => {
    setSelectedAmenities((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  const fetchProperty = async () => {
    const decryptedId = decryptId(encryptedId);
    const fd = new FormData();
    fd.append("programType", "propertyOverView");
    fd.append("id", decryptedId);
    fd.append("authToken", localStorage.getItem("authToken"));

    try {
      const response = await api.post("/properties/property", fd);
      console.log("edit", response);

      if (response.data.success && response.data.data.length > 0) {
        const property = response.data.data[0]; // your full object

        // 🔹 Map Basic Details
        setTitle(property.property.title || "");
        setDescription(property.property.description || "");
        // 🔹 Listing Type
        if (
          property.property.listing_type?.toLowerCase() === "sale" ||
          property.property.listing_type?.toLowerCase() === "sell"
        ) {
          setListingType("Sell");
        } else if (property.property.listing_type?.toLowerCase() === "rent") {
          setListingType("Rent");
        } else {
          setListingType(property.property.listing_type || "");
        }

        setPropertyType(property.property.property_type_id || "");
        setSubPropertyType(property.property.sub_property_type_id || "");
        setSelectedOwnership(property.property.ownership_type_id || "");
        setUniqueProperty(property.property.unique_property || "");

        // 🔹 Location
        setCity(property.location.city_id || "");
        setLocation(property.location.location || "");
        setSubLocality(property.location.sub_locality || "");
        setApartment(property.location.apartment || "");
        setHouseNo(property.location.house_no || "");
        setPostalCode(property.location.postal_code || "");
        // 🔹 Property Facing
        if (property.location.property_facing) {
          // Capitalize first letter of each word to match button labels
          const facing = property.location.property_facing
            .toLowerCase()
            .replace(/\b\w/g, (c) => c.toUpperCase());

          setPropertyFacing(facing);
        }


        // 🔹 Area
        setCarpetArea(property.area.carpet_area || "");
        setCarpetUnit(property.area.carpet_area_unit || "");
        setBuiltUpArea(property.area.built_up_area || "");
        setBuiltUpUnit(property.area.built_up_area_unit || "");
        setPlotArea(property.area.plot_area || "");
        setPlotAreaUnit(property.area.plot_area_unit || "");

        // 🔹 Air Conditioning
        if (property.features.air_conditioning) {
          const ac = property.features.air_conditioning.toLowerCase();
          if (ac === "central") {
            setAirConditioning("Central");
            console.log("central")
          }
          else if (ac === "individual") setAirConditioning("Individual");
          else if (ac === "none") setAirConditioning("None");
          else setAirConditioning("");
        }


        // 🔹 Availability
        // 🔹 Availability
        if (property.availability.availability_status) {
          const avail = property.availability.availability_status.toLowerCase();
          if (avail === "ready-to-move") setAvailabilityStatus("Ready to Move");
          else if (avail === "under-construction") setAvailabilityStatus("Under Construction");
          else setAvailabilityStatus("");
        }

        setAvailableFrom(property.availability.available_from || "");
        setPossessionBy(property.availability.possession_by || "");

        // 🔹 Details
        setApartmentBhk(property.details.apartment_bhk)
        setBedrooms(property.details.bedrooms || 0);
        setBathrooms(property.details.bathrooms || 0);
        setBalconies(property.details.balconies || 0);
        setTotalRooms(property.details.total_rooms || 0);
        // 🔹 Furnishing details checkboxes
        if (property.features.furnishing_details && property.features.furnishing_details.length > 0) {
          setFurnishingCheckboxes((prev) => {
            const updated = { ...prev };
            property.features.furnishing_details.forEach((item) => {
              if (updated.hasOwnProperty(item)) {
                updated[item] = true;
              }
            });
            return updated;
          });
        }
        setTotalFloors(property.details.total_floors || "")
        setPropertyOnFloor(property.details.property_on_floor || "")


        // 🔹 Pricing
        setExpectedPrice(property.pricing.expected_price || "");
        setPricePerSqYards(property.pricing.price_per_sq_yards || "");
        setCheckboxes({
          allInclusive: property.pricing.all_inclusive === 1,
          taxExcluded: property.pricing.govt_taxes === 1,
          negotiable: property.pricing.negotiable === 1,
        });

        // 🔹 Parking
        setCoveredParking(property.parking.covered_parking || 0);
        setOpenParking(property.parking.open_parking || 0);
        setParking(property.parking.parking_type || "");

        // 🔹 Features
        setFurnishing(property.features.furnishing || "");

        setOxygen(property.features.oxygen || 0);
        setUps(property.features.ups || 0);

        // 🔹 Commercial
        setMinSeats(property.commercial.min_seats || "");
        setMaxSeats(property.commercial.max_seats || "");
        setNoOfCabins(property.commercial.no_of_cabins || "");
        setNoOfMeetingRooms(property.commercial.no_of_meeting_rooms || "");

        // 🔹 Construction
        setWallStatus(property.construction.wall_status || "");
        setDoorsConstructed(property.construction.doors_constructed || 0);
        setWashroomBare(property.construction.washroom_bare || 0);
        setFlooringType(property.construction.flooring_type || "");
        setEntranceWidth(property.construction.entrance_width || "");
        setCeilingHeight(property.construction.ceiling_height || "");

        if (property.features.amenities && property.features.amenities.length > 0) {
          setSelectedAmenities(property.features.amenities);
        }


        // 🔹 Customer Details (if you show them in form)
        // you can also store in state if needed
        // setCustomerName(property.customerDetails.firstName);

        // 🔹 Property Images
        if (property.propertyImages && property.propertyImages.length > 0) {
          const apiSections = property.propertyImages.map(img => ({
            type: img.image_type || "Other",
            files: [{
              file: null,
              preview: `${api.imageUrl}${img.image_path}`,
              name: img.image_path.split("/").pop()
            }]
          }));
          setSections(apiSections);
        }



      }
    } catch (error) {
      console.error("Error fetching property:", error);
      toast.error("Error fetching property details");
    }
  };



  useEffect(() => {
    fetchProperty();
  }, []);





  // handlers
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileChange = (e) => {
    addFiles(Array.from(e.target.files));
  };

  const addFiles = (incoming) => {
    const valid = incoming.filter((file) => {
      return (
        file.type.startsWith("image/") ||
        file.type.startsWith("video/")
      );
    });

    const previews = valid.map((file) => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setFiles((prev) => [...prev, ...valid]);
    setPreviewList((prev) => [...prev, ...previews]);
  };

  const handleOwnerPercentageChange = (e) => {
    setOwnerPercentage(e.target.value);
  };

  const handleDeveloperPercentageChange = (e) => {
    setDeveloperPercentage(e.target.value);
  };



  // Location step states
  const [title, setTitle] = useState("");
  //   const [keyword, setKeyword] = useState("");

  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [subLocality, setSubLocality] = useState("");
  const [apartment, setApartment] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [selectedOwnership, setSelectedOwnership] = useState("")
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [balconies, setBalconies] = useState(0);
  const [areaType, setAreaType] = useState("");
  const [areaUnit, setAreaUnit] = useState("");
  const [otherRooms, setOtherRooms] = useState([]);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [furnishingType, setFurnishingType] = useState("Furnished");
  const [totalFloors, setTotalFloors] = useState("");
  const [propertyOnFloor, setPropertyOnFloor] = useState("");
  const [ageOfProperty, setAgeOfProperty] = useState("0-1 years");
  const [previewFiles, setPreviewFiles] = useState([]);
  const [minSeats, setMinSeats] = useState("");
  const [maxSeats, setMaxSeats] = useState("");
  const [noOfCabins, setNoOfCabins] = useState("");
  const [noOfMeetingRooms, setNoOfMeetingRooms] = useState("");
  const [washroom, setWashroom] = useState("");
  const [conferenceRoom, setConferenceRoom] = useState("");
  const [receptionArea, setReceptionArea] = useState("");
  const [pantryType, setPantryType] = useState("");
  const [furnishing, setFurnishing] = useState("");
  const [airConditioning, setAirConditioning] = useState("");
  const [oxygen, setOxygen] = useState("");
  const [ups, setUps] = useState("");
  const [fireSafety, setFireSafety] = useState([]);     // stores array of selected fire-safety options
  const [staircases, setStaircases] = useState("");     // 1 / 2 / 3 etc.
  const [lifts, setLifts] = useState("");
  const [parking, setParking] = useState("");
  const [wallStatus, setWallStatus] = useState("");
  const [doorsConstructed, setDoorsConstructed] = useState("");
  const [washroomBare, setWashroomBare] = useState("");
  const [flooringType, setFlooringType] = useState("");
  const [entranceWidth, setEntranceWidth] = useState("");
  const [entranceUnit, setEntranceUnit] = useState("");
  const [showEntranceUnit, setShowEntranceUnit] = useState(false);
  const [ceilingHeight, setCeilingHeight] = useState("");
  const [ceilingUnit, setCeilingUnit] = useState("");
  const [showCeilingUnit, setShowCeilingUnit] = useState(false);
  // const [retailWashroom, setRetailWashroom] = useState("");
  const [locatedNear, setLocatedNear] = useState("");
  const [parkingTypeRetail, setParkingTypeRetail] = useState([]);
  const [businessTypes, setBusinessTypes] = useState([]);
  const [showBusinessTypes, setShowBusinessTypes] = useState(false);
  const [roadWidth, setRoadWidth] = useState("");
  const [roadUnit, setRoadUnit] = useState("");
  const [showRoadUnit, setShowRoadUnit] = useState(false);
  const [propertyFacing, setPropertyFacing] = useState("");
  const [totalRooms, setTotalRooms] = useState("");
  const [hospitalityWash, setHospitalityWash] = useState("");
  const [qualityRating, setQualityRating] = useState("");
  const [availabilityStatus, setAvailabilityStatus] = useState("");
  const [allInclusive, setAllInclusive] = useState(false);
  const [taxGovt, setTaxGovt] = useState(false);
  const [priceNegotiable, setPriceNegotiable] = useState(false);
  const [showAdditionalPricing, setShowAdditionalPricing] = useState(false);
  const [maintenanceUnit, setMaintenanceUnit] = useState("");
  const [rental, setRental] = useState("");
  const [uniqueProperty, setUniqueProperty] = useState("");
  const [apartmentType, setApartmentType] = useState('');
  // Step 5 states (paste with your other useState declarations)
  const [selectedSubProperty, setSelectedSubProperty] = useState("");
  const [expectedPrice, setExpectedPrice] = useState("");
  const [pricePerSqYards, setPricePerSqYards] = useState("");
  const [checkboxes, setCheckboxes] = useState({
    allInclusive: false,
    taxExcluded: false,
    negotiable: false,
  });
  const [maintenance, setMaintenance] = useState("");
  const [maintenanceFreq, setMaintenanceFreq] = useState("Monthly");
  const [expectedRental, setExpectedRental] = useState("");
  const [bookingAmount, setBookingAmount] = useState("");
  const [annualDues, setAnnualDues] = useState("");
  const [brokerage, setBrokerage] = useState(""); // "yes" | "no"
  const [description, setDescription] = useState("");
  const UNIT_OPTIONS = ["Sq.ft", "Sq.yards", "Sq.m", "Acres", "Marla", "Cents"];
  const [carpetArea, setCarpetArea] = useState("");
  const [carpetUnit, setCarpetUnit] = useState("");
  const [showCarpetUnits, setShowCarpetUnits] = useState(false);
  const [showBuiltUpArea, setShowBuiltUpArea] = useState(false);
  const [builtUpArea, setBuiltUpArea] = useState("");
  const [builtUpUnit, setBuiltUpUnit] = useState("");
  const [showBuiltUpUnits, setShowBuiltUpUnits] = useState(false);
  const [possessionBy, setPossessionBy] = useState("");
  const [coveredParking, setCoveredParking] = useState(0);
  const [openParking, setOpenParking] = useState(0);
  const [sharedUnit, setSharedUnit] = useState("Sq.ft");
  const [plotArea, setPlotArea] = useState('');
  const [plotAreaUnit, setPlotAreaUnit] = useState('Sq.ft');
  const [plotLength, setPlotLength] = useState('');
  const [plotBreadth, setPlotBreadth] = useState('');
  const [floorsAllowed, setFloorsAllowed] = useState('');
  const [hasBoundaryWall, setHasBoundaryWall] = useState(null);
  const [openSides, setOpenSides] = useState(null);
  const [hasConstruction, setHasConstruction] = useState(null);
  const [constructionTypes, setConstructionTypes] = useState([]);
  const [showCarpetArea, setShowCarpetArea] = useState(false);
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);
  const [furnishings, setFurnishings] = useState({
    Light: 1,
    Warehouse: 0,
  });
  const [furnishingCheckboxes, setFurnishingCheckboxes] = useState({
    "Sofa": false,
    "Washing Machine": true,
    "Stove": false,
    "Fridge": true,
    "Water Purifier": false,
    "Microwave": true,
    "Modular Kitchen": false,
    "Chimney": false,
    "Dinning Table": false,
    "Curtains": false,
    "Exhaust Fan": false,
  });

  const steps = [
    { title: "Basic Details", subtitle: "Step 1" },
    { title: "Location Details", subtitle: "step 2" },
    { title: "Property Profile", subtitle: "Step 3" },
    { title: "Photos, Videos & Voice-over", subtitle: "Step 4" },
    { title: "Pricing & Others", subtitle: "Step 5" },
    { title: "Amenities", subtitle: "Step 6" }
  ];





  // ---- add these two states above return ----
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingPropertyType, setPendingPropertyType] = useState("");

  // confirmation handler
  const handlePropertyTypeChange = (newType) => {
    if (
      (propertyType === "Residential" && (newType === "Commercial" || newType === "Layout/Land development")) ||
      (propertyType === "Commercial" && (newType === "Residential" || newType === "Layout/Land development")) ||
      (propertyType === "Layout/Land development" && (newType === "Residential" || newType === "Commercial"))
    ) {
      // Show confirmation modal+
      setPendingPropertyType(newType);
      setShowConfirmModal(true);
      return;
    }

    // Directly change if no confirmation needed
    setPropertyType(newType);
    setSubPropertyType("");
    setSubPropertyQuestionOption("");
    setSubPropertyQuestionOptionLvl2("");
  };



  const handleFurnishingCount = (item, change) => {
    setFurnishings((prev) => ({
      ...prev,
      [item]: Math.max(0, (prev[item] || 0) + change),
    }));
  };

  const toggleFurnishingCheckbox = (item) => {
    setFurnishingCheckboxes((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };
  const toggleRentOption = (option) => {
    setWillingToRent((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };



  const propertyOptions = ["Residential", "Commercial", "Layout/Land development"];


  const subPropertyOptions = {
    Residential: [
      "Flat / Apartment",
      "Independent House / Villa",
      "Independent Floor",
      "Plot / Land",
      "1 RK / Studio Apartment",
      "Serviced Apartment",
      "Farmhouse ",
      "Others"
    ],
    Commercial: ["Office", "Retail", "Plot", "Storage", "Industry", "Hospitality", "Others"]
  };

  const propertyTypes = (listingType === "Joint Venture"
    ? ["Residential", "Commercial", "Layout/Land development"]
    : ["Residential", "Commercial"]
  ) || [];


  const commercialOfficeOptions = [
    "Ready to move office space",
    "Bare shell office space",
    "Co-working office space"
  ];

  const commercialRetailOptions = [
    "Commercial Shops",
    "Commercial Showrooms"
  ];

  const commercialRetailLocationOptions = [
    "Mall",
    "Commercial Project",
    "Residential Project",
    "Retail Complex / Building",
    "Market / High Street",
    "Other"
  ];

  const commercialPlotOptions = [
    "Commercial Land/inst.Land",
    "Agriculture/Farm Land",
    "Industrial Lands/Plots"
  ];

  const commercialStorageOptions = [
    "Ware House",
    "Cold Storage"
  ];

  const commercialIndustryOptions = [
    "Factory",
    "Manufacturing"
  ];

  const commercialHospitalityOptions = [
    "Hotel / Resorts",
    "Guest-House / Banquet Hall"
  ];


  const questionOptions = {
    Flat: ["1 BHK", "2 BHK", "3 BHK"],
    Villa: ["Independent Villa", "Row House"],
    Plot: ["Residential Plot", "Gated Plot"],
    Farmhouse: ["Developed", "Undeveloped"],

    Office: ["Ready to move office space", "Bare shell office space"],
    "Retail Plot": ["Mall", "High Street"],
    Storage: ["Warehouse", "Cold Storage"],
    Industry: ["Small Scale", "Large Scale"]



  };

  // Function to handle Continue
  const handleContinue = () => {
    if (selectedSubProperty) {
      setCurrentStep("location"); // move to location step
    }
  };

  const handleLocationContinue = () => {
    setCurrentStep(3); // Move to Property Profile
    handleUpdate2()
  };

  const handleFileUpdate = (fileItems) => {
    // Clean old URLs to prevent memory leaks
    previewFiles.forEach(file => URL.revokeObjectURL(file.preview));

    const newFiles = fileItems.map(fileItem => {
      const fileObj = fileItem.file;
      return {
        file: fileObj,
        preview: URL.createObjectURL(fileObj),
      };
    });

    setFiles(fileItems.map(fileItem => fileItem.file));
    setPreviewFiles(newFiles);
  };

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      previewFiles.forEach(file => URL.revokeObjectURL(file.preview));
    };
  }, [previewFiles]);

  // helpers
  const toggleCheckbox = (key) =>
    setCheckboxes((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleStep5Continue = () => {
    handleUpdate5()
    setCurrentStep(6); // Go directly to Amenities step
  };

  const handleConstructionTypeChange = (type, isChecked) => {
    if (isChecked) {
      setConstructionTypes([...constructionTypes, type]);
    } else {
      setConstructionTypes(constructionTypes.filter(t => t !== type));
    }
  };

  useEffect(() => {
    const allData = {
      currentStep,
      listingType,
      propertyType,
      subPropertyType,
      subPropertyQuestionOption,
      title,
      //   keyword,
      city,
      selectedOwnership,
      location,
      subLocality,
      apartment,
      houseNo,
      bedrooms,
      bathrooms,
      balconies,
      areaType,
      areaUnit,
      otherRooms,
      furnishingType,
      furnishings,
      furnishingCheckboxes,
      totalFloors,
      propertyOnFloor,
      ageOfProperty,
      files,
      expectedPrice,
      pricePerSqYards,
      checkboxes,
      maintenance,
      maintenanceFreq,
      expectedRental,
      bookingAmount,
      annualDues,
      brokerage,
      description,
      carpetArea,
      carpetUnit,
      builtUpArea,
      builtUpUnit,
      availabilityStatus,
      allInclusive,
      taxGovt,
      priceNegotiable,
      showAdditionalPricing,
      maintenanceUnit,
      rental,
      uniqueProperty,
      apartmentType,
      amenities,
      address,
      postalCode,
      locatedNear,
    };

    localStorage.setItem("addPropertyForm", JSON.stringify(allData));
  }, [
    currentStep,
    listingType,
    propertyType,
    subPropertyType,
    subPropertyQuestionOption,
    city,
    title,
    // keyword,
    selectedOwnership,
    location,
    subLocality,
    apartment,
    houseNo,
    bedrooms,
    bathrooms,
    balconies,
    areaType,
    areaUnit,
    otherRooms,
    furnishingType,
    furnishings,
    furnishingCheckboxes,
    totalFloors,
    propertyOnFloor,
    ageOfProperty,
    files,
    expectedPrice,
    pricePerSqYards,
    checkboxes,
    maintenance,
    maintenanceFreq,
    expectedRental,
    bookingAmount,
    annualDues,
    brokerage,
    description,
    carpetArea,
    carpetUnit,
    builtUpArea,
    builtUpUnit,
    availabilityStatus,
    allInclusive,
    taxGovt,
    priceNegotiable,
    showAdditionalPricing,
    maintenanceUnit,
    rental,
    uniqueProperty,
    apartmentType,
    amenities,
    address,
    postalCode,
    ownerType,
    locatedNear
  ]);
  useEffect(() => {
    const savedData = localStorage.getItem("addPropertyForm");
    if (savedData) {
      const parsed = JSON.parse(savedData);

      setCurrentStep(parsed.currentStep || 1);
      setListingType(parsed.listingType || "");
      setPropertyType(parsed.propertyType || "");
      setSubPropertyType(parsed.subPropertyType || "");
      setSubPropertyQuestionOption(parsed.subPropertyQuestionOption || "");
      setCity(parsed.city || "");
      setTitle(parsed.title || "");
      //   setKeyword(parsed.keyword || "");

      setAddress(parsed.address || "");
      setPostalCode(parsed.postalCode || "");
      setLocatedNear(parsed.locatedNear || "");

      setOwnerType(parsed.ownerType || "")
      setSelectedOwnership(parsed.selectedOwnership || "");
      setLocation(parsed.location || "");
      setSubLocality(parsed.subLocality || "");
      setApartment(parsed.apartment || "");
      setHouseNo(parsed.houseNo || "");
      setBedrooms(parsed.bedrooms || 1);
      setBathrooms(parsed.bathrooms || 1);
      setBalconies(parsed.balconies || 0);
      setAreaType(parsed.areaType || "");
      setAreaUnit(parsed.areaUnit || "");
      setOtherRooms(parsed.otherRooms || []);
      setFurnishingType(parsed.furnishingType || "Furnished");
      setFurnishings(parsed.furnishings || {});
      setFurnishingCheckboxes(parsed.furnishingCheckboxes || {});
      setTotalFloors(parsed.totalFloors || "");
      setPropertyOnFloor(parsed.propertyOnFloor || "");
      setAgeOfProperty(parsed.ageOfProperty || "0-1 years");
      setFiles(parsed.files || []);
      setExpectedPrice(parsed.expectedPrice || "");
      setPricePerSqYards(parsed.pricePerSqYards || "");
      setCheckboxes(parsed.checkboxes || {});
      setMaintenance(parsed.maintenance || "");
      setMaintenanceFreq(parsed.maintenanceFreq || "Monthly");
      setExpectedRental(parsed.expectedRental || "");
      setBookingAmount(parsed.bookingAmount || "");
      setAnnualDues(parsed.annualDues || "");
      setBrokerage(parsed.brokerage || "");
      setDescription(parsed.description || "");
      setCarpetArea(parsed.carpetArea || "");
      setCarpetUnit(parsed.carpetUnit || "");
      setBuiltUpArea(parsed.builtUpArea || "");
      setBuiltUpUnit(parsed.builtUpUnit || "");
      setAvailabilityStatus(parsed.availabilityStatus || "");
      setAllInclusive(parsed.allInclusive || false);
      setTaxGovt(parsed.taxGovt || false);
      setPriceNegotiable(parsed.priceNegotiable || false);
      setShowAdditionalPricing(parsed.showAdditionalPricing || false);
      setMaintenanceUnit(parsed.maintenanceUnit || "");
      setRental(parsed.rental || "");
      setUniqueProperty(parsed.uniqueProperty || "");
      setApartmentType(parsed.apartmentType || "");
      setAmenities(parsed.amenities || {});
    }
  }, []);

  const handleUpdate1 = async () => {
    const fd = new FormData();
    fd.append("programType", "updateProperty");
    fd.append("propertyId", id);
    fd.append("updateType", "property");
    fd.append("authToken", localStorage.getItem("authToken"));
    //step1

    fd.append('title', title);
    fd.append('listing_type', listingType);
    fd.append('property_type_id', propertyType);
    fd.append('sub_property_type_id', subPropertyType);

    fd.forEach((value, key) => {
      console.log(key, value);
    });


    try {
      const response = await api.post("properties/property", fd);
      console.log("step 1 response", response)

    } catch (error) {
      console.error("Error fetching amenities:", error);
      toast.error("Error fetching amenities");
    }
  };

  const handleUpdate2 = async () => {
    const fd = new FormData();
    fd.append("programType", "updateProperty");
    fd.append("propertyId", id);
    fd.append("updateType", "property");
    fd.append("authToken", localStorage.getItem("authToken"));
    //step2

    fd.append('city', city);
    fd.append('location', location);
    fd.append('subLocality', subLocality);
    fd.append('apartment', apartment);
    fd.append('houseNo', houseNo);
    fd.append('selectedOwnership', selectedOwnership);

    fd.append('address', address);
    fd.append('postal_code', postalCode);
    fd.append('sub_locality', subLocality);
    fd.append('located_near', locatedNear);
    fd.append('houseNo', houseNo);

    fd.forEach((value, key) => {
      console.log(key, value);
    });


    try {
      const response = await api.post("properties/property", fd);
      console.log("step 2 response", response)

    } catch (error) {
      console.error("Error fetching amenities:", error);
      toast.error("Error fetching amenities");
    }
  };

  const handleUpdate3 = async () => {

    const facingMap = {
      "North": "north",
      "South": "south",
      "East": "east",
      "West": "west",
      "North-East": "north-east",
      "North-West": "north-west",
      "South-East": "south-east",
      "South-West": "south-west",
    };


    const willingMap = {
      "Family": "family",
      "Bachelors": "bachelors",
      "Single women": "single_women",
      "Company": "company",
      "Anyone": "anyone",
    };


    const unitMap = {
      "Sq.ft": "sqft",
      "Sq.m": "sqm",
      "Sq.yards": "sqyards",
      "Acres": "acres",
    };

    const availabilityMap = {
      "Ready to Move": "ready-to-move",
      "Under Construction": "under-construction",
      "Upcoming": "upcoming",
    };

    const parkingMap = {
      "Covered": "covered",
      "Open": "open",
      "Both": "both",
      "None": "none",
    };
    const acMap = {
      "Central": "central",
      "Individual": "individual",
      "None": "none",
    };
    // inside handleSubmitPropperty before sending
    let furnishingMapped = "";
    if (furnishingType === "Furnished") furnishingMapped = "fully-furnished";
    else if (furnishingType === "Semi-furnished") furnishingMapped = "semi-furnished";
    else if (furnishingType === "Un-furnished") furnishingMapped = "unfurnished";



    const fd = new FormData();
    fd.append("programType", "updateProperty");
    fd.append("propertyId", id);
    fd.append("updateType", "details_features");
    fd.append("authToken", localStorage.getItem("authToken"));
    //step3

    fd.append('apartment_bhk', apartmentBhk);
    fd.append('bedrooms', bedrooms);
    fd.append('bathrooms', bathrooms);
    fd.append('balconies', balconies);
    fd.append('totalRooms', totalRooms);
    fd.append('ageOfProperty', ageOfProperty);
    fd.append('totalFloors', totalFloors);
    fd.append('propertyOnFloor', propertyOnFloor);
    fd.append('floorsAllowed', floorsAllowed);
    fd.append('apartmentType', apartmentType);

    fd.append("parking_type", parkingMap[parkingFacility] || "");
    fd.append("possessionBy", possessionBy);

    fd.append('parking', parking);
    fd.append('parkingTypeRetail', parkingTypeRetail);
    fd.append('coveredParking', coveredParking);
    fd.append('openParking', openParking);

    fd.append("carpetUnit", unitMap[carpetUnit] || carpetUnit);
    fd.append("builtUpUnit", unitMap[builtUpUnit] || builtUpUnit);
    fd.append("plotAreaUnit", unitMap[plotAreaUnit] || plotAreaUnit);
    fd.append("areaUnit", unitMap[areaUnit] || areaUnit);


    fd.append('carpetArea', carpetArea);

    fd.append('builtUpArea', builtUpArea);

    fd.append('plotArea', plotArea);

    fd.append('plotLength', plotLength);
    fd.append('plotBreadth', plotBreadth);
    fd.append("availabilityStatus", availabilityMap[availabilityStatus]);
    fd.append('availableFrom', availableFrom);
    fd.append("willingTo", willingMap[willingTo]);

    fd.append('areaType', areaType);
    fd.append('minSeats', minSeats);
    fd.append('maxSeats', maxSeats);
    fd.append('noOfCabins', noOfCabins);
    fd.append('noOfMeetingRooms', noOfMeetingRooms);
    fd.append('washroom', washroom);
    fd.append('conferenceRoom', conferenceRoom);
    fd.append('receptionArea', receptionArea);
    fd.append('pantryType', pantryType);
    // fd.append('furnishing', furnishing);

    fd.append('furnishing', furnishingMapped);
    fd.append('wallStatus', wallStatus);
    fd.append('doorsConstructed', doorsConstructed);
    fd.append('washroomBare', washroomBare);
    fd.append('flooringType', flooringType);
    fd.append('entranceWidth', entranceWidth);
    fd.append('entranceUnit', entranceUnit);
    fd.append('ceilingHeight', ceilingHeight);
    fd.append('ceilingUnit', ceilingUnit);
    fd.append('retailWashroom', retailWashroom);

    fd.append('hasBoundaryWall', hasBoundaryWall);




    fd.append('openSides', openSides);
    fd.append('hasConstruction', hasConstruction);


    fd.append('elecWaterExcluded', elecWaterExcluded);
    fd.append('agreementType', agreementType);
    fd.append('allowBroker', allowBroker);

    // Fire Safety (array of selected options)
    fireSafety.forEach((fs, index) => {
      fd.append(`fire_safety_features[]`, fs);
    });

    // Business Types (array of selected)
    businessTypes.forEach((b, index) => {
      fd.append(`business_types[]`, b);
    });

    // Furnishing Checkboxes
    Object.keys(furnishingCheckboxes).forEach((key) => {
      if (furnishingCheckboxes[key]) {
        fd.append("furnishing_details[]", key);
      }
    });






    fd.forEach((value, key) => {
      console.log(key, value);
    });


    try {
      const response = await api.post("properties/property", fd);
      console.log("step 3 response", response)

    } catch (error) {
      console.error("Error fetching amenities:", error);
      toast.error("Error fetching amenities");
    }
  };

  const handleUpdate4 = async () => {
    const fd = new FormData();
    fd.append("programType", "updateProperty");
    fd.append("propertyId", id);
    fd.append("updateType", "propertyImages");
    fd.append("authToken", localStorage.getItem("authToken"));
    //step4

    // Images/files
    sections.forEach((section) => {
      fd.append("imageType[]", section.type);
      section.files.forEach((file) => {
        fd.append("files[]", file);
      });
    });


    fd.forEach((value, key) => {
      console.log(key, value);
    });


    try {
      const response = await api.post("properties/property", fd);
      console.log("step 4 response", response)

    } catch (error) {
      console.error("Error fetching amenities:", error);
      toast.error("Error fetching amenities");
    }
  };

  const handleUpdate5 = async () => {
    const fd = new FormData();
    fd.append("programType", "updateProperty");
    fd.append("propertyId", id);
    fd.append("updateType", "pricing");
    fd.append("authToken", localStorage.getItem("authToken"));
    //step5
    fd.append('expectedPrice', expectedPrice);
    fd.append('pricePerSqYards', pricePerSqYards);
    fd.append('bookingAmount', bookingAmount);
    fd.append('annualDues', annualDues);
    fd.append('brokerage', brokerage);
    fd.append('expectedRental', expectedRental);
    fd.append('expectedRent', expectedRent);
    fd.append('membershipCharge', membershipCharge);
    fd.append('brokerageAmount', brokerageAmount);
    fd.append('maintenance', maintenance);
    fd.append('maintenanceFreq', maintenanceFreq);

    // Additional pricing checkboxes
    fd.append("allInclusive", allInclusive);
    fd.append("taxGovt", taxGovt);
    fd.append("priceNegotiable", priceNegotiable);





    fd.forEach((value, key) => {
      console.log(key, value);
    });


    try {
      const response = await api.post("properties/property", fd);
      console.log("step 5 response", response)

    } catch (error) {
      console.error("Error fetching amenities:", error);
      toast.error("Error fetching amenities");
    }
  };

  const handleUpdate6 = async () => {
    const fd = new FormData();
    fd.append("programType", "updateProperty");
    fd.append("propertyId", id);
    fd.append("updateType", "pricing");
    fd.append("authToken", localStorage.getItem("authToken"));
    //step6



    fd.forEach((value, key) => {
      console.log(key, value);
    });


    try {
      const response = await api.post("properties/property", fd);
      console.log("step 6 response", response)

    } catch (error) {
      console.error("Error fetching amenities:", error);
      toast.error("Error fetching amenities");
    }
  };

  async function handleSubmitPropperty() {

    const facingMap = {
      "North": "north",
      "South": "south",
      "East": "east",
      "West": "west",
      "North-East": "north-east",
      "North-West": "north-west",
      "South-East": "south-east",
      "South-West": "south-west",
    };


    const willingMap = {
      "Family": "family",
      "Bachelors": "bachelors",
      "Single women": "single_women",
      "Company": "company",
      "Anyone": "anyone",
    };


    const unitMap = {
      "Sq.ft": "sqft",
      "Sq.m": "sqm",
      "Sq.yards": "sqyards",
      "Acres": "acres",
    };

    const availabilityMap = {
      "Ready to Move": "ready-to-move",
      "Under Construction": "under-construction",
      "Upcoming": "upcoming",
    };

    const parkingMap = {
      "Covered": "covered",
      "Open": "open",
      "Both": "both",
      "None": "none",
    };
    const acMap = {
      "Central": "central",
      "Individual": "individual",
      "None": "none",
    };



    // inside handleSubmitPropperty before sending
    let furnishingMapped = "";
    if (furnishingType === "Furnished") furnishingMapped = "fully-furnished";
    else if (furnishingType === "Semi-furnished") furnishingMapped = "semi-furnished";
    else if (furnishingType === "Un-furnished") furnishingMapped = "unfurnished";
    const fd = new FormData();


    fd.append('title', title);

    fd.append('address', address);
    fd.append('postal_code', postalCode);
    fd.append('sub_locality', subLocality);
    fd.append('located_near', locatedNear);


    // fd.append('keyword', keyword);
    fd.append('description', description);
    fd.append('listingType', listingType);
    fd.append('propertyType', propertyType);
    fd.append('subPropertyType', subPropertyType);
    fd.append('selectedOwnership', selectedOwnership);
    fd.append('apartmentBhk', apartmentBhk);
    fd.append('bedrooms', bedrooms);
    fd.append('bathrooms', bathrooms);
    fd.append('balconies', balconies);
    fd.append('totalRooms', totalRooms);
    fd.append('ageOfProperty', ageOfProperty);
    fd.append('totalFloors', totalFloors);
    fd.append('propertyOnFloor', propertyOnFloor);
    fd.append('floorsAllowed', floorsAllowed);
    fd.append('apartmentType', apartmentType);

    fd.append("parking_type", parkingMap[parkingFacility] || "");
    fd.append("possessionBy", possessionBy);


    fd.append('city', city);
    fd.append('location', location);
    fd.append('subLocality', subLocality);
    fd.append('apartment', apartment);
    fd.append('houseNo', houseNo);
    //address
    //pincode
    //latitude
    //longitude
    fd.append('propertyFacing', facingMap[propertyFacing] || "");
    fd.append('road_width', roadWidth);
    fd.append('road_width_unit', roadUnit);
    fd.append('parking', parking);
    fd.append('parkingTypeRetail', parkingTypeRetail);
    fd.append('coveredParking', coveredParking);
    fd.append('openParking', openParking);
    fd.append('expectedPrice', expectedPrice);
    fd.append('pricePerSqYards', pricePerSqYards);
    fd.append('bookingAmount', bookingAmount);
    fd.append('annualDues', annualDues);
    fd.append('brokerage', brokerage);
    fd.append('expectedRental', expectedRental);
    fd.append('expectedRent', expectedRent);
    fd.append('membershipCharge', membershipCharge);
    fd.append('brokerageAmount', brokerageAmount);
    fd.append('maintenance', maintenance);
    fd.append('maintenanceFreq', maintenanceFreq);

    //sale_price
    //price_per_sqft
    //price_negotiable
    //security_deposit
    //rent_period
    //currency

    fd.append("airConditioning", acMap[airConditioning] || "");

    fd.append('oxygen', oxygen);
    fd.append('ups', ups);

    fd.append('staircases', staircases);
    fd.append('lifts', lifts);
    //furnishing_details
    //fire_safety_features

    //additional_features
    //amenities

    fd.append("carpetUnit", unitMap[carpetUnit] || carpetUnit);
    fd.append("builtUpUnit", unitMap[builtUpUnit] || builtUpUnit);
    fd.append("plotAreaUnit", unitMap[plotAreaUnit] || plotAreaUnit);
    fd.append("areaUnit", unitMap[areaUnit] || areaUnit);


    fd.append('carpetArea', carpetArea);

    fd.append('builtUpArea', builtUpArea);


    fd.append('plotArea', plotArea);

    fd.append('plotLength', plotLength);
    fd.append('plotBreadth', plotBreadth);
    fd.append("availabilityStatus", availabilityMap[availabilityStatus]);
    fd.append('availableFrom', availableFrom);
    fd.append("willingTo", willingMap[willingTo]);







    fd.append('subPropertyQuestionOption', subPropertyQuestionOption);
    fd.append('subPropertyQuestionOptionLvl2', subPropertyQuestionOptionLvl2);




    fd.append('areaType', areaType);
    fd.append('minSeats', minSeats);
    fd.append('maxSeats', maxSeats);
    fd.append('noOfCabins', noOfCabins);
    fd.append('noOfMeetingRooms', noOfMeetingRooms);
    fd.append('washroom', washroom);
    fd.append('conferenceRoom', conferenceRoom);
    fd.append('receptionArea', receptionArea);
    fd.append('pantryType', pantryType);
    // fd.append('furnishing', furnishing);

    fd.append('furnishing', furnishingMapped);
    fd.append('wallStatus', wallStatus);
    fd.append('doorsConstructed', doorsConstructed);
    fd.append('washroomBare', washroomBare);
    fd.append('flooringType', flooringType);
    fd.append('entranceWidth', entranceWidth);
    fd.append('entranceUnit', entranceUnit);
    fd.append('ceilingHeight', ceilingHeight);
    fd.append('ceilingUnit', ceilingUnit);
    fd.append('retailWashroom', retailWashroom);


    fd.append('road_width', roadWidth);
    fd.append('road_width_unit', roadUnit);

    fd.append('hospitalityWash', hospitalityWash);
    fd.append('qualityRating', qualityRating);

    fd.append('hasBoundaryWall', hasBoundaryWall);




    fd.append('openSides', openSides);
    fd.append('hasConstruction', hasConstruction);


    fd.append('elecWaterExcluded', elecWaterExcluded);
    fd.append('agreementType', agreementType);
    fd.append('allowBroker', allowBroker);



    fd.append('selectedSubProperty', selectedSubProperty);


    fd.append('uniqueProperty', uniqueProperty);



    // Arrays / objects need special handling
    // Append amenities
    // Object.keys(amenities).forEach(key => {
    //   fd.append(`amenities[${key}]`, amenities[key]);
    // });

    selectedAmenities.forEach((name) => {
      fd.append("amenities[]", name); // now sending names, not IDs
    });


    // Fire Safety (array of selected options)
    fireSafety.forEach((fs, index) => {
      fd.append(`fire_safety_features[]`, fs);
    });

    // Business Types (array of selected)
    businessTypes.forEach((b, index) => {
      fd.append(`business_types[]`, b);
    });

    // Furnishing Checkboxes
    Object.keys(furnishingCheckboxes).forEach((key) => {
      if (furnishingCheckboxes[key]) {
        fd.append("furnishing_details[]", key);
      }
    });


    // Additional pricing checkboxes
    fd.append("allInclusive", allInclusive);
    fd.append("taxGovt", taxGovt);
    fd.append("priceNegotiable", priceNegotiable);


    // Images/files
    sections.forEach((section) => {
      fd.append("imageType[]", section.type);
      section.files.forEach((file) => {
        fd.append("files[]", file);
      });
    });

    fd.append("authToken", "QlhOUWNKY2pVUE11ZzFrM3RBekp3cGtpSDhNMzBIaGVzNklaUlRLalhXTT0=");
    fd.append("programType", "addPropertyMain");

    fd.forEach((value, key) => {
      console.log(key, value);


    });

    try {
      const response = await api.post("properties/prop1", fd);
      console.log("ee", response)
      toast.success(response.data.message)
    }
    catch (err) {
      console.log(err)
    }

  }

  useEffect(() => {
    const progress = Math.floor((currentStep / 6) * 100);
    setPercentage(progress);
  }, [currentStep]);



  useEffect(() => {
    if (builtUpArea && builtUpArea !== "0.00") {
      setShowBuiltUpArea(true); // auto open input if area already exists
    }
  }, [builtUpArea]);




  // Handle BHK selection
  const handleBhkSelect = (bhk) => {
    setApartmentBhk(bhk);

    if (bhk === "1 BHK") {
      setBedrooms(1);
    } else if (bhk === "2 BHK") {
      setBedrooms(2);
    } else if (bhk === "3 BHK") {
      setBedrooms(3);
    } else {
      setBedrooms(null); // let user choose
    }
  };







  return (



    <div
      style={{
        fontFamily: '"Josefin Sans", sans-serif',
        color: "#161E2D",
        fontWeight: "600",

      }}
    >
      <Header />
      <div className="container" style={{
        marginTop: "10px",
        maxWidth: "1200px",
        padding: "0 20px",
        position: "relative"

      }}>
        <div className="row" style={{ display: "flex", width: "100%" }}>
          {/* Mobile Stepper (Horizontal) */}
          <div
            className="col-12 d-md-none"
            style={{
              marginTop: "10px",
              marginBottom: "20px",
              overflowX: "auto",
              whiteSpace: "nowrap",
              paddingBottom: "10px",
              position: "sticky",
              top: "0",
              backgroundColor: "#fff",
              zIndex: 100,
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
            }}
          >
            <div style={{ display: "inline-flex", alignItems: "flex-start" }}>
              {steps.map((step, index) => {
                const stepNumber = index + 1;
                const isActive = stepNumber === currentStep;
                const isCompleted = stepNumber < currentStep;

                return (
                  <div
                    key={`mobile-${index}`}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      minWidth: "80px",
                      padding: "0 5px",
                      cursor: "pointer",
                      position: "relative"
                    }}
                    onClick={() => {
                      if (stepNumber <= currentStep) setCurrentStep(stepNumber);
                    }}
                  >
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        border: `2px solid ${isCompleted || isActive ? "#ED2027" : "#999"}`,
                        backgroundColor: isCompleted ? "#ED2027" : "#fff",
                        color: isCompleted ? "#fff" : isActive ? "#ED2027" : "#999",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        fontSize: "12px",
                        transition: "all 0.3s ease"
                      }}
                    >
                      {isCompleted ? "✓" : stepNumber}
                    </div>
                    <div
                      style={{
                        width: "100%",
                        textAlign: "center",
                        marginTop: "5px",
                        fontWeight: isActive ? "600" : "500",
                        fontSize: "12px",
                        color: isActive ? "#333" : "#666",
                        whiteSpace: "normal",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical"
                      }}
                    >
                      {step.title}
                    </div>
                    {index !== steps.length - 1 && (
                      <div
                        style={{
                          position: "absolute",
                          left: "calc(50% + 20px)",
                          top: "12px",
                          width: "40px",
                          height: "2px",
                          backgroundColor: stepNumber < currentStep ? "#ED2027" : "#999",
                          opacity: 0.8
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desktop Stepper (Vertical) */}

          <div
            className="col-md-4 d-none d-md-block"
            style={{

              width: "30%",
              position: "sticky",
              top: "100px",
              maxHeight: "calc(100vh - 100px)",
              overflowY: "auto",
              paddingRight: "30px",
              fontWeight: "600",
              marginTop: "15px"
            }}
          >
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              const isActive = stepNumber === currentStep;
              const isCompleted = stepNumber < currentStep;

              return (
                <div
                  key={`desktop-${index}`}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    cursor: "pointer",
                    marginBottom: "0.6rem"

                  }}
                  onClick={() => {
                    if (stepNumber <= currentStep) setCurrentStep(stepNumber);
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center"
                    }}
                  >
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        border: `2px solid ${isCompleted || isActive ? "#ED2027" : "#999"}`,
                        backgroundColor: isCompleted ? "#ED2027" : "#fff",
                        color: isCompleted ? "#fff" : isActive ? "#ED2027" : "#999",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        fontSize: "12px",
                        transition: "all 0.3s ease"
                      }}
                    >
                      {isCompleted ? "✓" : stepNumber}
                    </div>
                    {index !== steps.length - 1 && (
                      <div
                        style={{
                          width: "2px",
                          height: "30px",
                          backgroundColor: stepNumber < currentStep ? "#ED2027" : "#999",
                          margin: "5px 0",
                          opacity: 0.8
                        }}
                      />
                    )}
                  </div>
                  <div style={{ marginLeft: "10px" }}>
                    <div
                      style={{
                        fontWeight: isActive ? "600" : "500",
                        fontSize: "15px",
                        color: isActive ? "#161E2D" : "#161E2D",
                        marginBottom: "2px"
                      }}
                    >
                      {step.title}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: isActive ? "#ED2027" : "#999",
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      {step.subtitle}
                      {step.editable && (
                        <span
                          style={{
                            marginLeft: "8px",
                            color: "#ED2027",
                            cursor: "pointer",
                            fontSize: "11px",
                            fontWeight: "500"
                          }}
                        >
                          Edit
                        </span>
                      )}
                    </div>
                  </div>
                </div>

              );
            })}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "#f4f6f8",
                borderRadius: "8px",
                padding: "15px",
                marginBottom: "20px",
                marginLeft: "-25px"
              }}
            >
              <div style={{ width: "70px", marginRight: "15px", marginTop: "20px" }}>
                <CircularProgressbar
                  value={percentage}
                  text={`${percentage}%`}
                  styles={{
                    path: { stroke: "#31AB3D" },
                    text: { fill: "#161E2D", fontSize: "28px" },   // keep same font size
                    trail: { stroke: "#e6e6e6" },
                  }}
                />
              </div>


              <div>
                <p style={{ margin: 0, fontWeight: 600, color: "#161E2D", fontFamily: '"Josefin Sans", sans-serif', fontSize: "16px", }}>
                  Property Score
                </p>

                <p style={{ margin: 0, fontSize: "13px", color: "#888" }}>
                  Better your property score,<br />
                  greater your visibility
                </p>
              </div>
            </div>

          </div>


          {/* Step Content */}
          <div className="col-12 col-md-8" style={{
            // width: "70%",
            backgroundColor: "#fff",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            marginBottom: "30px",
          }}>



            {/* Inline responsive styles */}
            <style>
              {`
      @media (max-width: 575px) {
        .button-group,
        .radio-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .subproperty-option {
          width: 100%;
        }

        .continue-btn {
          width: 100%;
        }

        .title h6 {
          font-size: 14px;
          line-height: 20px;
        }

        .step-heading,
        .step-subheading {
          font-size: 15px;
          line-height: 22px;
        }
      }
    `}
            </style>


            {/* Step 1 - Basic Details */}

            {currentStep === 1 && (
              <>
                <div
                  className="title"
                  style={{ text: "semibold", color: "#161E2D", marginBottom: "20px" }}
                >
                  <h6>
                    Welcome Back,
                    <br className="title-break" />
                    Fill out basic deatils
                  </h6>
                </div>

                {/* TITLE INPUT */}
                <h4 className="step-heading" style={{ color: "#161E2D" }}>
                  Property Title
                </h4>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter property title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    console.log("Title:", e.target.value); // ✅ log input
                  }}


                  style={{
                    width: "100%",
                    padding: "10px",
                    marginBottom: "20px",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                  }}
                />

                {/* Keywords */}
                {/* <h4 className="step-heading" style={{ color: "#161E2D" }}>
                  Keyword
                </h4>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter keyword"
                  value={keyword}
                  onChange={(e) => {
                    setKeyword(e.target.value);
                    console.log("Keyword:", e.target.value); 
                  }}
                  style={{
                    width: "100%",
                    padding: "10px",
                    marginBottom: "20px",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                  }}
                /> */}


                {/* LISTING TYPE */}
                <h4 className="step-heading" style={{ color: "#161E2D" }}>
                  Choose Listing Type
                </h4>
                <div className="button-group">
                  {["Sell", "Rent", "Joint Venture"].map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setListingType(type);
                        setPropertyType("");
                        setSubPropertyType("");
                        setSubPropertyQuestionOption("");
                        setSubPropertyQuestionOptionLvl2("");
                        console.log("Listing Type:", type); // ✅ log selection
                      }}
                      className={`button-option ${listingType === type ? "active" : ""}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {/* PROPERTY TYPE */}
                <h4 className="step-subheading" style={{ color: "#161E2D" }}>
                  What kind of property do you have?
                </h4>
                <div className="radio-group">
                  {(listingType === "Joint Venture"
                    ? ["Residential", "Commercial", "Layout/Land development"]
                    : ["Residential", "Commercial"]
                  ).map((type) => (
                    <label key={type} className="radio-label">
                      <input
                        type="radio"
                        name="propertyType"
                        value={type}
                        checked={propertyType === type}
                        onChange={() => {
                          handlePropertyTypeChange(type);
                          console.log("Property Type:", type);
                        }}
                      />
                      {type}
                    </label>
                  ))}
                </div>

                {/* If Layout/Land development under Joint Venture */}
                {listingType === "Joint Venture" &&
                  propertyType === "Layout/Land development" && (

                    <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                      {/* Continue Button */}
                      <button
                        className="continue-btn"
                        onClick={() => {
                          handleUpdate1();   // ✅ call update
                          setCurrentStep(2); // ✅ then move to next step
                        }}
                        style={{
                          padding: "12px 24px",
                          backgroundColor: "#ED2027",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: "600",
                          fontSize: "16px",
                        }}
                      >
                        Continue
                      </button>


                    </div>

                  )}

                {/* SUB PROPERTY OPTIONS */}
                {propertyType && propertyType !== "Layout/Land development" && (
                  <div className="button-group">
                    {(() => {
                      if (listingType === "Joint Venture") {
                        if (propertyType === "Residential") {
                          return [
                            "Flat / Apartment",
                            "Independent House / Villa",
                            "1 RK / Studio Apartment",
                            "Farmhouse",
                          ].map((subType) => (
                            <div
                              key={subType}
                              onClick={() => {
                                setSubPropertyType(subType);
                                setSubPropertyQuestionOption("");
                                setSubPropertyQuestionOptionLvl2("");
                                console.log("Sub Property Type:", subType); // ✅ log selection
                              }}
                              className={`subproperty-option ${subPropertyType === subType ? "active" : ""
                                }`}
                            >
                              {subType}
                            </div>
                          ));
                        } else if (propertyType === "Commercial") {
                          return ["Office", "Retail", "Industry", "Hospitality"].map(
                            (subType) => (
                              <div
                                key={subType}
                                onClick={() => {
                                  setSubPropertyType(subType);
                                  setSubPropertyQuestionOption("");
                                  setSubPropertyQuestionOptionLvl2("");
                                }}
                                className={`subproperty-option ${subPropertyType === subType ? "active" : ""
                                  }`}
                              >
                                {subType}
                              </div>
                            )
                          );
                        }
                      }

                      // Default SELL/RENT
                      return (propertyType === "Residential"
                        ? subPropertyOptions[propertyType].filter(
                          (sub) => (listingType === "Rent" ? sub !== "Plot / Land" : true)
                        )
                        : subPropertyOptions[propertyType]
                      ).map((subType) => (
                        <div
                          key={subType}
                          onClick={() => {
                            setSubPropertyType(subType);
                            setSubPropertyQuestionOption("");
                            setSubPropertyQuestionOptionLvl2("");
                          }}
                          className={`subproperty-option ${subPropertyType === subType ? "active" : ""
                            }`}
                        >
                          {subType}
                        </div>
                      ));
                    })()}
                  </div>
                )}

                {/* ===== Commercial follow-ups (ONLY for Sell/Rent, not Joint Venture) ===== */}


                {propertyType === "Commercial" && subPropertyType === "Office" && (
                  <>
                    <h4 className="step-label" style={{ color: "#161E2D" }}>
                      What type of office is it?
                    </h4>
                    <div className="button-group">
                      {commercialOfficeOptions.map((opt) => (
                        <div
                          key={opt}
                          onClick={() => setSubPropertyQuestionOption(opt)}
                          className={`subproperty-option ${subPropertyQuestionOption === opt ? "active" : ""
                            }`}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {propertyType === "Commercial" && subPropertyType === "Retail" && (
                  <>
                    <h4 className="step-label" style={{ color: "#161E2D" }}>
                      What type of retail space do you have?
                    </h4>
                    <div className="button-group">
                      {commercialRetailOptions.map((opt) => (
                        <div
                          key={opt}
                          onClick={() => {
                            setSubPropertyQuestionOption(opt);
                            setSubPropertyQuestionOptionLvl2("");
                          }}
                          className={`subproperty-option ${subPropertyQuestionOption === opt ? "active" : ""
                            }`}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>

                    {subPropertyQuestionOption && (
                      <>
                        <p className="step-label" style={{ color: "#161E2D" }}>
                          Your shop is located inside?
                        </p>
                        <div className="button-group">
                          {commercialRetailLocationOptions.map((opt) => (
                            <div
                              key={opt}
                              onClick={() => setSubPropertyQuestionOptionLvl2(opt)}
                              className={`subproperty-option ${subPropertyQuestionOptionLvl2 === opt ? "active" : ""
                                }`}
                            >
                              {opt}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                )}

                {propertyType === "Commercial" && subPropertyType === "Plot" && (
                  <>
                    <p className="step-label">What kind of plot/land is it?</p>
                    <div className="button-group">
                      {commercialPlotOptions.map((opt) => (
                        <div
                          key={opt}
                          onClick={() => setSubPropertyQuestionOption(opt)}
                          className={`subproperty-option ${subPropertyQuestionOption === opt ? "active" : ""
                            }`}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {propertyType === "Commercial" && subPropertyType === "Storage" && (
                  <>
                    <p className="step-label">What kind of storage is it?</p>
                    <div className="button-group">
                      {commercialStorageOptions.map((opt) => (
                        <div
                          key={opt}
                          onClick={() => setSubPropertyQuestionOption(opt)}
                          className={`subproperty-option ${subPropertyQuestionOption === opt ? "active" : ""
                            }`}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {propertyType === "Commercial" && subPropertyType === "Industry" && (
                  <>
                    <p className="step-label">What kind of industry is it?</p>
                    <div className="button-group">
                      {commercialIndustryOptions.map((opt) => (
                        <div
                          key={opt}
                          onClick={() => setSubPropertyQuestionOption(opt)}
                          className={`subproperty-option ${subPropertyQuestionOption === opt ? "active" : ""
                            }`}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {propertyType === "Commercial" && subPropertyType === "Hospitality" && (
                  <>
                    <p className="step-label" style={{ color: "#161E2D" }}>
                      What kind of hospitality is it?
                    </p>
                    <div className="button-group">
                      {commercialHospitalityOptions.map((opt) => (
                        <div
                          key={opt}
                          onClick={() => setSubPropertyQuestionOption(opt)}
                          className={`subproperty-option ${subPropertyQuestionOption === opt ? "active" : ""
                            }`}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  </>
                )}



                {/* CONTINUE BUTTON */}
                {subPropertyType && propertyType !== "Layout/Land development" && (
                  <>
                    {(() => {
                      const isCommercial = propertyType === "Commercial";
                      const isListingTypeSet = listingType !== "";
                      const isPropertyTypeSet = propertyType !== "";

                      // For Sell/Rent, validation stays same
                      const isValidRetail =
                        listingType !== "Joint Venture" &&
                        isCommercial &&
                        subPropertyType === "Retail" &&
                        subPropertyQuestionOption &&
                        subPropertyQuestionOptionLvl2;

                      const isValidOffice =
                        listingType !== "Joint Venture" &&
                        isCommercial &&
                        subPropertyType === "Office" &&
                        subPropertyQuestionOption;

                      const isValidOtherCommercial =
                        listingType !== "Joint Venture" &&
                        isCommercial &&
                        ["Plot", "Storage", "Industry", "Hospitality"].includes(
                          subPropertyType
                        ) &&
                        subPropertyQuestionOption;

                      // Joint Venture = simple continue if subPropertyType selected
                      const isJV = listingType === "Joint Venture" && subPropertyType;

                      const isResidentialOrSimple =
                        !isCommercial ||
                        (isCommercial &&
                          ![
                            "Retail",
                            "Office",
                            "Plot",
                            "Storage",
                            "Industry",
                            "Hospitality",
                          ].includes(subPropertyType));

                      const canContinue =
                        isListingTypeSet &&
                        isPropertyTypeSet &&
                        (isJV ||
                          isValidRetail ||
                          isValidOffice ||
                          isValidOtherCommercial ||
                          (isResidentialOrSimple && subPropertyType));

                      return canContinue ? (
                        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                          {/* Continue Button */}
                          <button
                            className="continue-btn"
                            onClick={() => {
                              handleUpdate1();   // ✅ call update
                              setCurrentStep(2); // ✅ then move to next step
                            }}
                            style={{
                              padding: "12px 24px",
                              backgroundColor: "#ED2027",
                              color: "white",
                              border: "none",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontWeight: "600",
                              fontSize: "16px",
                            }}
                          >
                            Continue
                          </button>


                        </div>

                      ) : (
                        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                          {/* Continue Button */}
                          <button
                            className="continue-btn"
                            onClick={() => {
                              handleUpdate1();   // ✅ call update
                              setCurrentStep(2); // ✅ then move to next step
                            }}
                            style={{
                              padding: "12px 24px",
                              backgroundColor: "#ED2027",
                              color: "white",
                              border: "none",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontWeight: "600",
                              fontSize: "16px",
                            }}
                          >
                            Continue
                          </button>


                        </div>

                      );
                    })()}
                  </>
                )}

                {/* ===== Confirmation Popup Card ===== */}
                {showConfirmModal && (
                  <div className="modal-overlay">
                    <div className="confirm-card">
                      <h6 className="confirm-message">
                        Changing this field will change inputs made throughout the form. Do
                        you want to continue?
                      </h6>
                      <div className="button-group">
                        <button
                          className="cancel-btn"
                          onClick={() => {
                            setShowConfirmModal(false);
                            setPendingPropertyType("");
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          className="popup-continue-btn"
                          onClick={() => {
                            setShowConfirmModal(false);
                            setPropertyType(pendingPropertyType);
                            setPendingPropertyType("");
                            setSubPropertyType("");
                            setSubPropertyQuestionOption("");
                            setSubPropertyQuestionOptionLvl2("");
                          }}
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}


            {/* Step 2 - Location Details */}

            {currentStep === 2 && (
              <div>
                <h4 className="step-heading">Where is your property Located?</h4>

                {/* City Select */}
                <div className="form-group">
                  <label>City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="select-field"
                    style={{ height: "55px" }}
                  >
                    <option value="">Select City</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Chennai">Chennai</option>
                  </select>
                </div>

                {/* You are? Buttons */}
                {city && (
                  <div className="form-group">
                    <label>You are?</label>
                    <div className="ownership-buttons">
                      {["Owner", "Broker", "Builder"].map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => setOwnerType(role)}
                          className={`ownership-option ${ownerType === role ? "active" : ""
                            }`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Location Input */}
                {selectedOwnership && (
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      placeholder="Enter Location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="input-field"
                    />
                  </div>
                )}

                {/* Apartment Select */}
                {location && (
                  <div className="form-group">
                    <label>Apartment/Project</label>
                    <select
                      value={apartment}
                      onChange={(e) => setApartment(e.target.value)}
                      className="select-field"
                      style={{ height: "55px" }}
                    >
                      <option value="">Select Apartment</option>
                      <option value="Prestige Lakeside">Prestige Lakeside</option>
                      <option value="Brigade Gateway">Brigade Gateway</option>
                      <option value="Sobha Dream Acres">Sobha Dream Acres</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                )}


                {/* Address */}
                <div className="step2-section">
                  <label className="step2-label">Full Address</label>
                  <input
                    type="text"
                    className="step2-input"
                    placeholder="Enter full address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                {/* Postal Code */}
                <div className="step2-section mt-3">
                  <label className="step2-label">Postal Code</label>
                  <input
                    type="text"
                    className="step2-input"
                    placeholder="Enter postal code"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>

                {/* Sub Locality */}
                <div className="step2-section mt-3">
                  <label className="step2-label">Sub Locality</label>
                  <input
                    type="text"
                    className="step2-input"
                    placeholder="Enter sub locality"
                    value={subLocality}
                    onChange={(e) => setSubLocality(e.target.value)}
                  />
                </div>



                {/* Located Near */}
                <div className="step2-section mt-3">
                  <label className="step2-label">Located Near</label>
                  <input
                    type="text"
                    className="step2-input"
                    placeholder="e.g. Near Metro Station, Near Park"
                    value={locatedNear}
                    onChange={(e) => setLocatedNear(e.target.value)}
                  />
                </div>

                {/* Road Width Input + Unit Dropdown */}
                <div className="form-group  " style={{ display: "flex", gap: "10px" }}>
                  <div className="mt-3" style={{ flex: 2 }}>
                    <label>Road Width</label>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="Enter road width"
                      value={roadWidth}
                      onChange={(e) => setRoadWidth(e.target.value)}
                    />
                  </div>
                  <div className="mt-3" style={{ flex: 1 }}>
                    <label>Unit</label>
                    <select
                      className="select-field input-field p-2"
                      value={roadUnit}
                      onChange={(e) => setRoadUnit(e.target.value)}
                      style={{ height: "55px" }}
                    >
                      <option value="">Select</option>
                      <option value="feet">Feet</option>
                      <option value="meters">Meters</option>
                    </select>
                  </div>
                </div>


                {/* Property facing */}
                <div className="step3-section mt-3">
                  <label className="step3-label">Property facing</label>
                  <div className="button-group">
                    {[
                      "North",
                      "South",
                      "East",
                      "West",
                      "North-East",
                      "North-West",
                      "South-East",
                      "South-West",
                    ].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        className={`subproperty-option ${propertyFacing === opt ? "active" : ""}`}
                        onClick={() => setPropertyFacing(opt)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* House No. Input */}
                <div className="house-no-group mt-3">
                  <label>House No. (Optional)</label>
                  <input
                    type="text"
                    placeholder="House No."
                    value={houseNo}
                    onChange={(e) => setHouseNo(e.target.value)}
                    className="input-field"
                  />
                </div>

                {/* Continue button */}
                {city && selectedOwnership && location && (
                  <button onClick={handleLocationContinue} className="continue-btn">
                    Continue
                  </button>
                )}
              </div>
            )}

            {/* Steps 3 Placeholder */}

            {currentStep === 3 && (
              <div className="step3-container">
                {/* Property Profile Header */}
                <h4 className="step3-header">
                  Tell us about your property
                </h4>


                {(subPropertyType.includes("Flat / Apartment") || subPropertyType.includes("Independent Floor") || subPropertyType.includes("Serviced Apartment")) && (
                  <>
                    {/* Rent + Residential */}
                    {listingType === "Rent" && propertyType === "Residential" && (
                      <>
                        {/* Apartment Type (BHK) */}
                        {/* BHK Selection */}
                        <div className="step3-section">
                          <label className="step3-label">Your apartment is a</label>
                          <div className="step3-button-group">
                            {["1 BHK", "2 BHK", "3 BHK", "Other"].map((bhk) => (
                              <button
                                key={bhk}
                                type="button"
                                onClick={() => handleBhkSelect(bhk)}
                                className={`step3-option-btn ${apartmentBhk === bhk ? "active" : ""}`}
                              >
                                {bhk}
                              </button>
                            ))}
                          </div>
                        </div>



                        {/* Room Details */}
                        <div className="step3-section">
                          <h6 className="step3-subheader">
                            Add Room Details
                          </h6>

                          {/* Bedrooms */}
                          <div className="step3-subsection">
                            <label className="step3-label">No. of Bedrooms</label>
                            <div className="step3-button-group">
                              {[1, 2, 3, 4, 5].map((num) => {
                                const isDisabled = apartmentBhk !== "Other"; // disable unless Other
                                return (
                                  <div
                                    key={num}
                                    onClick={() => !isDisabled && setBedrooms(num)}
                                    className={`step3-number-btn ${bedrooms === num ? "active" : ""} ${isDisabled ? "disabled" : ""}`}
                                    style={{
                                      opacity: isDisabled ? 0.5 : 1,
                                      pointerEvents: isDisabled ? "none" : "auto",
                                    }}
                                  >
                                    {num}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Bathrooms */}
                          <div className="step3-subsection">
                            <label className="step3-label">
                              No. of Bathrooms
                            </label>
                            <div className="step3-button-group">
                              {[1, 2, 3, 4, 5].map((num) => (
                                <div
                                  key={num}
                                  onClick={() => setBathrooms(num)}
                                  className={`step3-number-btn ${bathrooms === num ? 'active' : ''}`}
                                >
                                  {num}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Balconies */}
                          <div className="step3-subsection">
                            <label className="step3-label">
                              Balconies
                            </label>
                            <div className="step3-button-group">
                              {[0, 1, 2, 3, "More than 3"].map((val) => (
                                <div
                                  key={val}
                                  onClick={() => setBalconies(val)}
                                  className={`step3-option-btn ${balconies === val ? 'active' : ''}`}
                                >
                                  {val}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Area Details */}
                        <div

                        >
                          {/* Header */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginBottom: "8px",
                            }}
                          >
                            <label style={{ fontSize: "16px", fontWeight: 600, color: "#333" }}>
                              Add Area Details
                            </label>

                          </div>

                          <p style={{ fontSize: "13px", color: "#888", marginBottom: "16px" }}>
                            At least one area type is mandatory
                          </p>

                          {/* Carpet Area */}
                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                              marginBottom: "16px",
                              position: "relative",
                            }}
                          >
                            <input
                              type="number"
                              placeholder="Carpet Area"
                              value={carpetArea}
                              onChange={(e) => setCarpetArea(e.target.value)}
                              style={{
                                flex: 1,
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid #ccc",
                                fontSize: "14px",
                              }}
                            />
                            <div
                              style={{
                                minWidth: "100px",
                                padding: "12px",
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                cursor: "pointer",
                                background: "#f9f9f9",
                              }}
                              onClick={() => setShowCarpetUnits((p) => !p)}
                            >
                              {carpetUnit || "Unit"} <span style={{ fontSize: "12px" }}>▼</span>
                            </div>

                            {showCarpetUnits && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: "110%",
                                  right: "0",
                                  background: "#fff",
                                  border: "1px solid #ddd",
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                  zIndex: 10,
                                  width: "120px",
                                }}
                              >
                                {UNIT_OPTIONS.map((u) => (
                                  <div
                                    key={u}
                                    onClick={() => {
                                      setCarpetUnit(u);
                                      setBuiltUpUnit(u); // sync
                                      setShowCarpetUnits(false);
                                    }}
                                    style={{
                                      padding: "10px",
                                      cursor: "pointer",
                                      background: carpetUnit === u ? "#ED2027" : "#fff",
                                      color: carpetUnit === u ? "#fff" : "#333",
                                      borderBottom: "1px solid #eee",
                                    }}
                                  >
                                    {u}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Validation */}
                          {carpetArea && builtUpArea && Number(carpetArea) >= Number(builtUpArea) && (
                            <p style={{ color: "red", fontSize: "13px", marginBottom: "12px" }}>
                              Carpet area must be smaller than built-up area
                            </p>
                          )}

                          {/* Built-up Area */}
                          {!showBuiltUpArea ? (
                            <button
                              type="button"
                              onClick={() => setShowBuiltUpArea(true)}
                              style={{
                                background: "transparent",
                                border: "1px dashed #ED2027",
                                color: "#ED2027",
                                padding: "10px 14px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontWeight: "500",
                                marginTop: "10px",
                              }}
                            >
                              + Add Built-up Area
                            </button>
                          ) : (
                            <div
                              style={{
                                display: "flex",
                                gap: "10px",
                                marginTop: "16px",
                                position: "relative",
                              }}
                            >
                              <input
                                type="number"
                                placeholder="Built-up Area"
                                value={builtUpArea}
                                onChange={(e) => setBuiltUpArea(e.target.value)}
                                style={{
                                  flex: 1,
                                  padding: "12px",
                                  borderRadius: "8px",
                                  border: "1px solid #ccc",
                                  fontSize: "14px",
                                }}
                              />
                              <div
                                style={{
                                  minWidth: "100px",
                                  padding: "12px",
                                  border: "1px solid #ccc",
                                  borderRadius: "8px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  cursor: "pointer",
                                  background: "#f9f9f9",
                                }}
                                onClick={() => setShowBuiltUpUnits((p) => !p)}
                              >
                                {builtUpUnit || "Unit"} <span style={{ fontSize: "12px" }}>▼</span>
                              </div>

                              {showBuiltUpUnits && (
                                <div
                                  style={{
                                    position: "absolute",
                                    top: "110%",
                                    right: "0",
                                    background: "#fff",
                                    border: "1px solid #ddd",
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                    zIndex: 10,
                                    width: "120px",
                                  }}
                                >
                                  {UNIT_OPTIONS.map((u) => (
                                    <div
                                      key={u}
                                      onClick={() => {
                                        setBuiltUpUnit(u);
                                        setCarpetUnit(u); // sync
                                        setShowBuiltUpUnits(false);
                                      }}
                                      style={{
                                        padding: "10px",
                                        cursor: "pointer",
                                        background: builtUpUnit === u ? "#ED2027" : "#fff",
                                        color: builtUpUnit === u ? "#fff" : "#333",
                                        borderBottom: "1px solid #eee",
                                      }}
                                    >
                                      {u}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>




                        {/* Furnishing */}
                        <div className="section mt-3">
                          <label className="section-label">Furnishing</label>
                          <div className="furnishing-options">
                            {["Furnished", "Semi-furnished", "Un-furnished"].map((type) => (
                              <div
                                key={type}
                                onClick={() => setFurnishingType(type)}
                                className={`furnishing-chip ${furnishingType === type ? "active" : ""
                                  }`}
                              >
                                {type}
                              </div>
                            ))}
                          </div>

                          {/* Show only when Furnished or Semi-furnished */}
                          {(furnishingType === "Furnished" || furnishingType === "Semi-furnished") && (
                            <>

                              <p style={{ marginTop: "10px", fontFamily: '"Josefin Sans", sans-serif', fontWeight: "600" }}>
                                At least three furnishings are mandatory for furnished
                              </p>


                              <div className="furnishing-grid">


                                {Object.keys(furnishingCheckboxes).map((item) => (
                                  <label key={item} className="furnishing-checkbox">
                                    <input
                                      type="checkbox"
                                      checked={furnishingCheckboxes[item]}
                                      onChange={() => toggleFurnishingCheckbox(item)}
                                    />
                                    {item}
                                  </label>
                                ))}
                              </div>
                            </>
                          )}
                        </div>

                        {/* Floor Details */}
                        <div className="step3-section">
                          <label className="step3-label">
                            Floor Details
                          </label>
                          <div className="step3-floor-group">
                            <input
                              type="number"
                              value={totalFloors}
                              onChange={(e) => {
                                const v = e.target.value;
                                setTotalFloors(v);
                                const nTotal = parseInt(v, 10);
                                const nProp = parseInt(propertyOnFloor, 10);
                                if (!Number.isNaN(nTotal) && !Number.isNaN(nProp) && nProp > nTotal) {
                                  setPropertyOnFloor(String(nTotal));
                                }
                              }}
                              placeholder="Total Floors"
                              className="step3-floor-input"
                            />
                            <select
                              value={propertyOnFloor}
                              onChange={(e) => setPropertyOnFloor(e.target.value)}
                              className="step3-floor-select"
                            >
                              <option value="" hidden>Property on Floor</option>
                              <option value="Basement">Basement</option>
                              <option value="Lower Ground">Lower Ground</option>
                              <option value="Ground">Ground</option>
                              {(() => {
                                const n = parseInt(totalFloors, 10);
                                if (!Number.isNaN(n) && n > 0) {
                                  return Array.from({ length: n }, (_, i) => i + 1).map((f) => (
                                    <option key={f} value={String(f)}>
                                      {f}
                                    </option>
                                  ));
                                }
                                return null;
                              })()}
                            </select>
                          </div>
                        </div>



                        {/* Age of property if Ready to Move */}

                        <div className="step3-section">
                          <label className="step3-label">Age of property</label>
                          <div className="step3-button-group">
                            {["0-1 years", "1-5 years", "5-10 years", "10+ years"].map((age) => (
                              <button
                                key={age}
                                type="button"
                                onClick={() => setAgeOfProperty(age)}
                                className={`step3-option-btn ${ageOfProperty === age ? "active" : ""
                                  }`}
                              >
                                {age}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Parking Facility */}
                        <div className="step3-section">
                          <label className="step3-label">Parking Facility</label>
                          <div className="step3-button-group">
                            {["Covered", "Open", "Both", "None"].map((option) => (
                              <button
                                key={option}
                                type="button"
                                onClick={() => setParkingFacility(option)}
                                className={`step3-option-btn ${parkingFacility === option ? "active" : ""}`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* ------------------- RENT DETAILS ------------------- */}
                        {/* Available From */}
                        <div className="step3-section">
                          <label className="step3-label">Available from</label>
                          <input
                            type="date"
                            value={availableFrom}
                            onChange={(e) => setAvailableFrom(e.target.value)}
                            className="step3-input"
                          />
                        </div>

                        {/* Willing to rent out to */}
                        <div className="step3-section">
                          <label className="step3-label">Willing to rent out to</label>
                          <div className="step3-button-group">
                            {["Family", "Single men", "Single women"].map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setWillingTo(opt)}
                                className={`step3-option-btn ${willingTo === opt ? "active" : ""
                                  }`}
                              >
                                + {opt}
                              </button>
                            ))}
                          </div>
                        </div>


                        {/* ------------------- END OF RENT DETAILS ------------------- */}


                      </>
                    )}

                    {/* Sell + Residential */}
                    {listingType === "Sell" && propertyType === "Residential" && (
                      <>

                        <div className="step3-section">
                          <label className="step3-label">Your apartment is a</label>
                          <div className="step3-button-group">
                            {["1 BHK", "2 BHK", "3 BHK", "Other"].map((bhk) => (
                              <button
                                key={bhk}
                                type="button"
                                onClick={() => handleBhkSelect(bhk)}
                                className={`step3-option-btn ${apartmentBhk === bhk ? "active" : ""}`}
                              >
                                {bhk}
                              </button>
                            ))}
                          </div>
                        </div>


                        {/* Room Details */}
                        <div className="step3-section">
                          <h6 className="step3-subheader">
                            Add Room Details
                          </h6>

                          {/* Bedrooms */}
                          <div className="step3-subsection">
                            <label className="step3-label">No. of Bedrooms</label>
                            <div className="step3-button-group">
                              {[1, 2, 3, 4, 5].map((num) => {
                                const isDisabled = apartmentBhk !== "Other"; // disable unless Other
                                return (
                                  <div
                                    key={num}
                                    onClick={() => !isDisabled && setBedrooms(num)}
                                    className={`step3-number-btn ${bedrooms === num ? "active" : ""} ${isDisabled ? "disabled" : ""}`}
                                    style={{
                                      opacity: isDisabled ? 0.5 : 1,
                                      pointerEvents: isDisabled ? "none" : "auto",
                                    }}
                                  >
                                    {num}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Bathrooms */}
                          <div className="step3-subsection">
                            <label className="step3-label">
                              No. of Bathrooms
                            </label>
                            <div className="step3-button-group">
                              {[1, 2, 3, 4, 5].map((num) => (
                                <div
                                  key={num}
                                  onClick={() => setBathrooms(num)}
                                  className={`step3-number-btn ${bathrooms === num ? 'active' : ''}`}
                                >
                                  {num}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Balconies */}
                          <div className="step3-subsection">
                            <label className="step3-label">
                              Balconies
                            </label>
                            <div className="step3-button-group">
                              {[0, 1, 2, 3, "More than 3"].map((val) => (
                                <div
                                  key={val}
                                  onClick={() => setBalconies(val)}
                                  className={`step3-option-btn ${balconies === val ? 'active' : ''}`}
                                >
                                  {val}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Area Details */}
                        <div
                          className="mb-3"
                        >
                          {/* Header */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginBottom: "8px",
                            }}
                          >
                            <label style={{ fontSize: "16px", fontWeight: 600, color: "#333" }}>
                              Add Area Details
                            </label>

                          </div>

                          <p style={{ fontSize: "13px", color: "#888", marginBottom: "16px" }}>
                            At least one area type is mandatory
                          </p>

                          {/* Carpet Area */}
                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                              marginBottom: "16px",
                              position: "relative",
                            }}
                          >
                            <input
                              type="number"
                              placeholder="Carpet Area"
                              value={carpetArea}
                              onChange={(e) => setCarpetArea(e.target.value)}
                              style={{
                                flex: 1,
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid #ccc",
                                fontSize: "14px",
                              }}
                            />
                            <div
                              style={{
                                minWidth: "100px",
                                padding: "12px",
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                cursor: "pointer",
                                background: "#f9f9f9",
                              }}
                              onClick={() => setShowCarpetUnits((p) => !p)}
                            >
                              {carpetUnit || "Unit"} <span style={{ fontSize: "12px" }}>▼</span>
                            </div>

                            {showCarpetUnits && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: "110%",
                                  right: "0",
                                  background: "#fff",
                                  border: "1px solid #ddd",
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                  zIndex: 10,
                                  width: "120px",
                                }}
                              >
                                {UNIT_OPTIONS.map((u) => (
                                  <div
                                    key={u}
                                    onClick={() => {
                                      setCarpetUnit(u);
                                      setBuiltUpUnit(u); // sync
                                      setShowCarpetUnits(false);
                                    }}
                                    style={{
                                      padding: "10px",
                                      cursor: "pointer",
                                      background: carpetUnit === u ? "#ED2027" : "#fff",
                                      color: carpetUnit === u ? "#fff" : "#333",
                                      borderBottom: "1px solid #eee",
                                    }}
                                  >
                                    {u}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Validation */}
                          {carpetArea && builtUpArea && Number(carpetArea) >= Number(builtUpArea) && (
                            <p style={{ color: "red", fontSize: "13px", marginBottom: "12px" }}>
                              Carpet area must be smaller than built-up area
                            </p>
                          )}

                          {/* Built-up Area */}
                          {!showBuiltUpArea ? (
                            <button
                              type="button"
                              onClick={() => setShowBuiltUpArea(true)}
                              style={{
                                background: "transparent",
                                border: "1px dashed #ED2027",
                                color: "#ED2027",
                                padding: "10px 14px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontWeight: "500",
                                marginTop: "10px",
                              }}
                            >
                              + Add Built-up Area
                            </button>
                          ) : (
                            <div
                              style={{
                                display: "flex",
                                gap: "10px",
                                marginTop: "16px",
                                position: "relative",
                              }}
                            >
                              <input
                                type="number"
                                placeholder="Built-up Area"
                                value={builtUpArea}
                                onChange={(e) => setBuiltUpArea(e.target.value)}
                                style={{
                                  flex: 1,
                                  padding: "12px",
                                  borderRadius: "8px",
                                  border: "1px solid #ccc",
                                  fontSize: "14px",
                                }}
                              />
                              <div
                                style={{
                                  minWidth: "100px",
                                  padding: "12px",
                                  border: "1px solid #ccc",
                                  borderRadius: "8px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  cursor: "pointer",
                                  background: "#f9f9f9",
                                }}
                                onClick={() => setShowBuiltUpUnits((p) => !p)}
                              >
                                {builtUpUnit || "Unit"} <span style={{ fontSize: "12px" }}>▼</span>
                              </div>

                              {showBuiltUpUnits && (
                                <div
                                  style={{
                                    position: "absolute",
                                    top: "110%",
                                    right: "0",
                                    background: "#fff",
                                    border: "1px solid #ddd",
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                    zIndex: 10,
                                    width: "120px",
                                  }}
                                >
                                  {UNIT_OPTIONS.map((u) => (
                                    <div
                                      key={u}
                                      onClick={() => {
                                        setBuiltUpUnit(u);
                                        setCarpetUnit(u); // sync
                                        setShowBuiltUpUnits(false);
                                      }}
                                      style={{
                                        padding: "10px",
                                        cursor: "pointer",
                                        background: builtUpUnit === u ? "#ED2027" : "#fff",
                                        color: builtUpUnit === u ? "#fff" : "#333",
                                        borderBottom: "1px solid #eee",
                                      }}
                                    >
                                      {u}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>


                        {/* Furnishing */}
                        <div className="section">
                          <label className="section-label">Furnishing</label>
                          <div className="furnishing-options">
                            {["Furnished", "Semi-furnished", "Un-furnished"].map((type) => (
                              <div
                                key={type}
                                onClick={() => setFurnishingType(type)}
                                className={`furnishing-chip ${furnishingType === type ? "active" : ""
                                  }`}
                              >
                                {type}
                              </div>
                            ))}
                          </div>

                          {/* Show only when Furnished or Semi-furnished */}
                          {(furnishingType === "Furnished" || furnishingType === "Semi-furnished") && (
                            <>

                              <p style={{ marginTop: "10px", fontFamily: '"Josefin Sans", sans-serif', fontWeight: "600" }}>
                                At least three furnishings are mandatory for furnished
                              </p>


                              <div className="furnishing-grid">


                                {Object.keys(furnishingCheckboxes).map((item) => (
                                  <label key={item} className="furnishing-checkbox">
                                    <input
                                      type="checkbox"
                                      checked={furnishingCheckboxes[item]}
                                      onChange={() => toggleFurnishingCheckbox(item)}
                                    />
                                    {item}
                                  </label>
                                ))}
                              </div>
                            </>
                          )}
                        </div>

                        {/* Floor Details */}
                        <div className="step3-section">
                          <label className="step3-label">
                            Floor Details
                          </label>
                          <div className="step3-floor-group">
                            <input
                              type="number"
                              value={totalFloors}
                              onChange={(e) => {
                                const v = e.target.value;
                                setTotalFloors(v);
                                const nTotal = parseInt(v, 10);
                                const nProp = parseInt(propertyOnFloor, 10);
                                if (!Number.isNaN(nTotal) && !Number.isNaN(nProp) && nProp > nTotal) {
                                  setPropertyOnFloor(String(nTotal));
                                }
                              }}
                              placeholder="Total Floors"
                              className="step3-floor-input"
                            />
                            <select
                              value={propertyOnFloor}
                              onChange={(e) => setPropertyOnFloor(e.target.value)}
                              className="step3-floor-select"
                            >
                              <option value="" hidden>Property on Floor</option>
                              <option value="Basement">Basement</option>
                              <option value="Lower Ground">Lower Ground</option>
                              <option value="Ground">Ground</option>
                              {(() => {
                                const n = parseInt(totalFloors, 10);
                                if (!Number.isNaN(n) && n > 0) {
                                  return Array.from({ length: n }, (_, i) => i + 1).map((f) => (
                                    <option key={f} value={String(f)}>
                                      {f}
                                    </option>
                                  ));
                                }
                                return null;
                              })()}
                            </select>
                          </div>
                        </div>

                        {/* Air Conditioning */}
                        <div className="step3-section">
                          <label className="step3-label">Air Conditioning</label>
                          <div className="step3-button-group">
                            {["Central", "Individual", "None"].map((option) => (
                              <button
                                key={option}
                                type="button"
                                onClick={() => setAirConditioning(option)}
                                className={`step3-option-btn ${airConditioning === option ? "active" : ""
                                  }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>


                        {/* Parking Facility */}
                        <div className="step3-section">
                          <label className="step3-label">Parking Facility</label>
                          <div className="step3-button-group">
                            {["Covered", "Open", "Both", "None"].map((option) => (
                              <button
                                key={option}
                                type="button"
                                onClick={() => setParkingFacility(option)}
                                className={`step3-option-btn ${parkingFacility === option ? "active" : ""}`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>





                        {/* Availability Status */}
                        <div className="step3-section">
                          <label className="step3-label">
                            Availability Status
                          </label>
                          <div className="step3-button-group">
                            {["Ready to Move", "Under Construction"].map((status) => (
                              <button
                                key={status}
                                type="button"
                                onClick={() => setAvailabilityStatus(status)}
                                className={`step3-option-btn ${availabilityStatus === status ? 'active' : ''}`}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Age of property if Ready to Move */}
                        {availabilityStatus === "Ready to Move" && (
                          <div className="step3-section">
                            <label className="step3-label">
                              Age of property
                            </label>
                            <div className="step3-button-group">
                              {["0-1 years", "1-5 years", "5-10 years", "10+ years"].map((age) => (
                                <button
                                  key={age}
                                  type="button"
                                  onClick={() => setAgeOfProperty(age)}
                                  className={`step3-option-btn ${ageOfProperty === age ? 'active' : ''}`}
                                >
                                  {age}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Possession By if Under Construction */}
                        {availabilityStatus === "Under Construction" && (
                          <div className="step3-section">
                            <label className="step3-label">Possession By</label>
                            <select
                              value={possessionBy}
                              onChange={(e) => setPossessionBy(e.target.value)}
                              className="step3-input"
                            >
                              <option value="" hidden>Expected time</option>
                              <option value="Within 3 Months">Within 3 Months</option>
                              <option value="Within 6 Months">Within 6 Months</option>
                              <option value="By 2026">By 2026</option>
                              <option value="By 2027">By 2027</option>
                              <option value="By 2028">By 2028</option>
                              <option value="By 2029">By 2029</option>
                              <option value="By 2030">By 2030</option>
                            </select>
                          </div>
                        )}

                        {/* Age of property */}

                        {/* Ownership */}
                        <div className="step3-section">
                          <label className="step3-label">
                            Ownership
                          </label>
                          <div className="step3-button-group">
                            {["Freehold", "Leasehold", "Co-operative Society", "Power of Attorney"].map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setSelectedOwnership(opt)}
                                className={`step3-option-btn ${selectedOwnership === opt ? 'active' : ''}`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>


                      </>
                    )}

                  </>
                )}

                {subPropertyType.includes("Independent House / Villa") && (
                  <>

                    {/* Sell + Residential */}
                    {listingType === "Sell" && propertyType === "Residential" && (
                      <>

                        <div className="step3-section">
                          <label className="step3-label">Your apartment is a</label>
                          <div className="step3-button-group">
                            {["1 BHK", "2 BHK", "3 BHK", "Other"].map((bhk) => (
                              <button
                                key={bhk}
                                type="button"
                                onClick={() => handleBhkSelect(bhk)}
                                className={`step3-option-btn ${apartmentBhk === bhk ? "active" : ""}`}
                              >
                                {bhk}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="step3-section">
                          <h6 className="step3-subheader">
                            Add Room Details
                          </h6>

                          {/* Bedrooms */}
                          <div className="step3-subsection">
                            <label className="step3-label">No. of Bedrooms</label>
                            <div className="step3-button-group">
                              {[1, 2, 3, 4, 5].map((num) => {
                                const isDisabled = apartmentBhk !== "Other"; // disable unless Other
                                return (
                                  <div
                                    key={num}
                                    onClick={() => !isDisabled && setBedrooms(num)}
                                    className={`step3-number-btn ${bedrooms === num ? "active" : ""} ${isDisabled ? "disabled" : ""}`}
                                    style={{
                                      opacity: isDisabled ? 0.5 : 1,
                                      pointerEvents: isDisabled ? "none" : "auto",
                                    }}
                                  >
                                    {num}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Bathrooms */}
                          <div className="step3-subsection">
                            <label className="step3-label">
                              No. of Bathrooms
                            </label>
                            <div className="step3-button-group">
                              {[1, 2, 3, 4, 5].map((num) => (
                                <div
                                  key={num}
                                  onClick={() => setBathrooms(num)}
                                  className={`step3-number-btn ${bathrooms === num ? 'active' : ''}`}
                                >
                                  {num}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Balconies */}
                          <div className="step3-subsection">
                            <label className="step3-label">
                              Balconies
                            </label>
                            <div className="step3-button-group">
                              {[0, 1, 2, 3, "More than 3"].map((val) => (
                                <div
                                  key={val}
                                  onClick={() => setBalconies(val)}
                                  className={`step3-option-btn ${balconies === val ? 'active' : ''}`}
                                >
                                  {val}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* plotinput */}


                        {/* Area Details */}
                        <div
                          className="mb-3"
                        >
                          {/* Header */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginBottom: "8px",
                            }}
                          >
                            <label style={{ fontSize: "16px", fontWeight: 600, color: "#333" }}>
                              Add Area Details
                            </label>

                          </div>

                          <p style={{ fontSize: "13px", color: "#888", marginBottom: "16px" }}>
                            At least one area type is mandatory
                          </p>

                          {/* Carpet Area */}
                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                              marginBottom: "16px",
                              position: "relative",
                            }}
                          >
                            <input
                              type="number"
                              placeholder="Carpet Area"
                              value={carpetArea}
                              onChange={(e) => setCarpetArea(e.target.value)}
                              style={{
                                flex: 1,
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid #ccc",
                                fontSize: "14px",
                              }}
                            />
                            <div
                              style={{
                                minWidth: "100px",
                                padding: "12px",
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                cursor: "pointer",
                                background: "#f9f9f9",
                              }}
                              onClick={() => setShowCarpetUnits((p) => !p)}
                            >
                              {carpetUnit || "Unit"} <span style={{ fontSize: "12px" }}>▼</span>
                            </div>

                            {showCarpetUnits && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: "110%",
                                  right: "0",
                                  background: "#fff",
                                  border: "1px solid #ddd",
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                  zIndex: 10,
                                  width: "120px",
                                }}
                              >
                                {UNIT_OPTIONS.map((u) => (
                                  <div
                                    key={u}
                                    onClick={() => {
                                      setCarpetUnit(u);
                                      setBuiltUpUnit(u); // sync
                                      setShowCarpetUnits(false);
                                    }}
                                    style={{
                                      padding: "10px",
                                      cursor: "pointer",
                                      background: carpetUnit === u ? "#ED2027" : "#fff",
                                      color: carpetUnit === u ? "#fff" : "#333",
                                      borderBottom: "1px solid #eee",
                                    }}
                                  >
                                    {u}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Validation */}
                          {carpetArea && builtUpArea && Number(carpetArea) >= Number(builtUpArea) && (
                            <p style={{ color: "red", fontSize: "13px", marginBottom: "12px" }}>
                              Carpet area must be smaller than built-up area
                            </p>
                          )}

                          {/* Built-up Area */}
                          {!showBuiltUpArea ? (
                            <button
                              type="button"
                              onClick={() => setShowBuiltUpArea(true)}
                              style={{
                                background: "transparent",
                                border: "1px dashed #ED2027",
                                color: "#ED2027",
                                padding: "10px 14px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontWeight: "500",
                                marginTop: "10px",
                              }}
                            >
                              + Add Built-up Area
                            </button>
                          ) : (
                            <div
                              style={{
                                display: "flex",
                                gap: "10px",
                                marginTop: "16px",
                                position: "relative",
                              }}
                            >
                              <input
                                type="number"
                                placeholder="Built-up Area"
                                value={builtUpArea}
                                onChange={(e) => setBuiltUpArea(e.target.value)}
                                style={{
                                  flex: 1,
                                  padding: "12px",
                                  borderRadius: "8px",
                                  border: "1px solid #ccc",
                                  fontSize: "14px",
                                }}
                              />
                              <div
                                style={{
                                  minWidth: "100px",
                                  padding: "12px",
                                  border: "1px solid #ccc",
                                  borderRadius: "8px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  cursor: "pointer",
                                  background: "#f9f9f9",
                                }}
                                onClick={() => setShowBuiltUpUnits((p) => !p)}
                              >
                                {builtUpUnit || "Unit"} <span style={{ fontSize: "12px" }}>▼</span>
                              </div>

                              {showBuiltUpUnits && (
                                <div
                                  style={{
                                    position: "absolute",
                                    top: "110%",
                                    right: "0",
                                    background: "#fff",
                                    border: "1px solid #ddd",
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                    zIndex: 10,
                                    width: "120px",
                                  }}
                                >
                                  {UNIT_OPTIONS.map((u) => (
                                    <div
                                      key={u}
                                      onClick={() => {
                                        setBuiltUpUnit(u);
                                        setCarpetUnit(u); // sync
                                        setShowBuiltUpUnits(false);
                                      }}
                                      style={{
                                        padding: "10px",
                                        cursor: "pointer",
                                        background: builtUpUnit === u ? "#ED2027" : "#fff",
                                        color: builtUpUnit === u ? "#fff" : "#333",
                                        borderBottom: "1px solid #eee",
                                      }}
                                    >
                                      {u}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Furnishing */}
                        <div className="section">
                          <label className="section-label">Furnishing</label>
                          <div className="furnishing-options">
                            {["Furnished", "Semi-furnished", "Un-furnished"].map((type) => (
                              <div
                                key={type}
                                onClick={() => setFurnishingType(type)}
                                className={`furnishing-chip ${furnishingType === type ? "active" : ""
                                  }`}
                              >
                                {type}
                              </div>
                            ))}
                          </div>

                          {/* Show only when Furnished or Semi-furnished */}
                          {(furnishingType === "Furnished" || furnishingType === "Semi-furnished") && (
                            <>

                              <p style={{ marginTop: "10px", fontFamily: '"Josefin Sans", sans-serif', fontWeight: "600" }}>
                                At least three furnishings are mandatory for furnished
                              </p>


                              <div className="furnishing-grid">


                                {Object.keys(furnishingCheckboxes).map((item) => (
                                  <label key={item} className="furnishing-checkbox">
                                    <input
                                      type="checkbox"
                                      checked={furnishingCheckboxes[item]}
                                      onChange={() => toggleFurnishingCheckbox(item)}
                                    />
                                    {item}
                                  </label>
                                ))}
                              </div>
                            </>
                          )}
                        </div>

                        {/* {floor deatils} */}
                        <div className="step3-section">
                          <label className="step3-label">
                            Floor Details
                          </label>
                          <div className="step3-floor-group">
                            <input
                              type="number"
                              value={totalFloors}
                              onChange={(e) => {
                                const v = e.target.value;
                                setTotalFloors(v);
                                const nTotal = parseInt(v, 10);
                                const nProp = parseInt(propertyOnFloor, 10);
                                if (!Number.isNaN(nTotal) && !Number.isNaN(nProp) && nProp > nTotal) {
                                  setPropertyOnFloor(String(nTotal));
                                }
                              }}
                              placeholder="Total Floors"
                              className="step3-floor-input"
                            />

                          </div>
                        </div>

                        {/* Air Conditioning */}
                        <div className="step3-section">
                          <label className="step3-label">Air Conditioning</label>
                          <div className="step3-button-group">
                            {["Central", "Individual", "None"].map((option) => (
                              <button
                                key={option}
                                type="button"
                                onClick={() => setAirConditioning(option)}
                                className={`step3-option-btn ${airConditioning === option ? "active" : ""
                                  }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Parking Facility */}
                        <div className="step3-section">
                          <label className="step3-label">Parking Facility</label>
                          <div className="step3-button-group">
                            {["Covered", "Open", "Both", "None"].map((option) => (
                              <button
                                key={option}
                                type="button"
                                onClick={() => setParkingFacility(option)}
                                className={`step3-option-btn ${parkingFacility === option ? "active" : ""}`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>


                        {/* Availability Status */}
                        <div className="step3-section">
                          <label className="step3-label">
                            Availability Status
                          </label>
                          <div className="step3-button-group">
                            {["Ready to Move", "Under Construction"].map((status) => (
                              <button
                                key={status}
                                type="button"
                                onClick={() => setAvailabilityStatus(status)}
                                className={`step3-option-btn ${availabilityStatus === status ? 'active' : ''}`}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Age of property if Ready to Move */}
                        {availabilityStatus === "Ready to Move" && (
                          <div className="step3-section">
                            <label className="step3-label">
                              Age of property
                            </label>
                            <div className="step3-button-group">
                              {["0-1 years", "1-5 years", "5-10 years", "10+ years"].map((age) => (
                                <button
                                  key={age}
                                  type="button"
                                  onClick={() => setAgeOfProperty(age)}
                                  className={`step3-option-btn ${ageOfProperty === age ? 'active' : ''}`}
                                >
                                  {age}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Possession By if Under Construction */}
                        {availabilityStatus === "Under Construction" && (
                          <div className="step3-section">
                            <label className="step3-label">Possession By</label>
                            <select
                              value={possessionBy}
                              onChange={(e) => setPossessionBy(e.target.value)}
                              className="step3-input"
                            >
                              <option value="" hidden>Expected time</option>
                              <option value="Within 3 Months">Within 3 Months</option>
                              <option value="Within 6 Months">Within 6 Months</option>
                              <option value="By 2026">By 2026</option>
                              <option value="By 2027">By 2027</option>
                              <option value="By 2028">By 2028</option>
                              <option value="By 2029">By 2029</option>
                              <option value="By 2030">By 2030</option>
                            </select>
                          </div>
                        )}



                        {/* Ownership */}
                        <div className="step3-section">
                          <label className="step3-label">
                            Ownership
                          </label>
                          <div className="step3-button-group">
                            {["Freehold", "Leasehold", "Co-operative Society", "Power of Attorney"].map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setSelectedOwnership(opt)}
                                className={`step3-option-btn ${selectedOwnership === opt ? 'active' : ''}`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>

                      </>
                    )}

                    {/* Rent + Residential */}
                    {listingType === "Rent" && propertyType === "Residential" && (
                      <>

                        <div className="step3-section">
                          <label className="step3-label">Your apartment is a</label>
                          <div className="step3-button-group">
                            {["1 BHK", "2 BHK", "3 BHK", "Other"].map((bhk) => (
                              <button
                                key={bhk}
                                type="button"
                                onClick={() => handleBhkSelect(bhk)}
                                className={`step3-option-btn ${apartmentBhk === bhk ? "active" : ""}`}
                              >
                                {bhk}
                              </button>
                            ))}
                          </div>
                        </div>
                        {/* Room Details */}
                        <div className="step3-section">
                          <h6 className="step3-subheader">
                            Add Room Details
                          </h6>
                          {/* Bedrooms */}
                          <div className="step3-subsection">
                            <label className="step3-label">No. of Bedrooms</label>
                            <div className="step3-button-group">
                              {[1, 2, 3, 4, 5].map((num) => {
                                const isDisabled = apartmentBhk !== "Other"; // disable unless Other
                                return (
                                  <div
                                    key={num}
                                    onClick={() => !isDisabled && setBedrooms(num)}
                                    className={`step3-number-btn ${bedrooms === num ? "active" : ""} ${isDisabled ? "disabled" : ""}`}
                                    style={{
                                      opacity: isDisabled ? 0.5 : 1,
                                      pointerEvents: isDisabled ? "none" : "auto",
                                    }}
                                  >
                                    {num}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Bathrooms */}
                          <div className="step3-subsection">
                            <label className="step3-label">
                              No. of Bathrooms
                            </label>
                            <div className="step3-button-group">
                              {[1, 2, 3, 4, 5].map((num) => (
                                <div
                                  key={num}
                                  onClick={() => setBathrooms(num)}
                                  className={`step3-number-btn ${bathrooms === num ? 'active' : ''}`}
                                >
                                  {num}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Balconies */}
                          <div className="step3-subsection">
                            <label className="step3-label">
                              Balconies
                            </label>
                            <div className="step3-button-group">
                              {[0, 1, 2, 3, "More than 3"].map((val) => (
                                <div
                                  key={val}
                                  onClick={() => setBalconies(val)}
                                  className={`step3-option-btn ${balconies === val ? 'active' : ''}`}
                                >
                                  {val}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Area Details */}
                        <div
                          className="mb-3"
                        >
                          {/* Header */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginBottom: "8px",
                            }}
                          >
                            <label style={{ fontSize: "16px", fontWeight: 600, color: "#333" }}>
                              Add Area Details
                            </label>

                          </div>

                          <p style={{ fontSize: "13px", color: "#888", marginBottom: "16px" }}>
                            At least one area type is mandatory
                          </p>

                          {/* Carpet Area */}
                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                              marginBottom: "16px",
                              position: "relative",
                            }}
                          >
                            <input
                              type="number"
                              placeholder="Carpet Area"
                              value={carpetArea}
                              onChange={(e) => setCarpetArea(e.target.value)}
                              style={{
                                flex: 1,
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid #ccc",
                                fontSize: "14px",
                              }}
                            />
                            <div
                              style={{
                                minWidth: "100px",
                                padding: "12px",
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                cursor: "pointer",
                                background: "#f9f9f9",
                              }}
                              onClick={() => setShowCarpetUnits((p) => !p)}
                            >
                              {carpetUnit || "Unit"} <span style={{ fontSize: "12px" }}>▼</span>
                            </div>

                            {showCarpetUnits && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: "110%",
                                  right: "0",
                                  background: "#fff",
                                  border: "1px solid #ddd",
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                  zIndex: 10,
                                  width: "120px",
                                }}
                              >
                                {UNIT_OPTIONS.map((u) => (
                                  <div
                                    key={u}
                                    onClick={() => {
                                      setCarpetUnit(u);
                                      setBuiltUpUnit(u); // sync
                                      setShowCarpetUnits(false);
                                    }}
                                    style={{
                                      padding: "10px",
                                      cursor: "pointer",
                                      background: carpetUnit === u ? "#ED2027" : "#fff",
                                      color: carpetUnit === u ? "#fff" : "#333",
                                      borderBottom: "1px solid #eee",
                                    }}
                                  >
                                    {u}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Validation */}
                          {carpetArea && builtUpArea && Number(carpetArea) >= Number(builtUpArea) && (
                            <p style={{ color: "red", fontSize: "13px", marginBottom: "12px" }}>
                              Carpet area must be smaller than built-up area
                            </p>
                          )}

                          {/* Built-up Area */}
                          {!showBuiltUpArea ? (
                            <button
                              type="button"
                              onClick={() => setShowBuiltUpArea(true)}
                              style={{
                                background: "transparent",
                                border: "1px dashed #ED2027",
                                color: "#ED2027",
                                padding: "10px 14px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontWeight: "500",
                                marginTop: "10px",
                              }}
                            >
                              + Add Built-up Area
                            </button>
                          ) : (
                            <div
                              style={{
                                display: "flex",
                                gap: "10px",
                                marginTop: "16px",
                                position: "relative",
                              }}
                            >
                              <input
                                type="number"
                                placeholder="Built-up Area"
                                value={builtUpArea}
                                onChange={(e) => setBuiltUpArea(e.target.value)}
                                style={{
                                  flex: 1,
                                  padding: "12px",
                                  borderRadius: "8px",
                                  border: "1px solid #ccc",
                                  fontSize: "14px",
                                }}
                              />
                              <div
                                style={{
                                  minWidth: "100px",
                                  padding: "12px",
                                  border: "1px solid #ccc",
                                  borderRadius: "8px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  cursor: "pointer",
                                  background: "#f9f9f9",
                                }}
                                onClick={() => setShowBuiltUpUnits((p) => !p)}
                              >
                                {builtUpUnit || "Unit"} <span style={{ fontSize: "12px" }}>▼</span>
                              </div>

                              {showBuiltUpUnits && (
                                <div
                                  style={{
                                    position: "absolute",
                                    top: "110%",
                                    right: "0",
                                    background: "#fff",
                                    border: "1px solid #ddd",
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                    zIndex: 10,
                                    width: "120px",
                                  }}
                                >
                                  {UNIT_OPTIONS.map((u) => (
                                    <div
                                      key={u}
                                      onClick={() => {
                                        setBuiltUpUnit(u);
                                        setCarpetUnit(u); // sync
                                        setShowBuiltUpUnits(false);
                                      }}
                                      style={{
                                        padding: "10px",
                                        cursor: "pointer",
                                        background: builtUpUnit === u ? "#ED2027" : "#fff",
                                        color: builtUpUnit === u ? "#fff" : "#333",
                                        borderBottom: "1px solid #eee",
                                      }}
                                    >
                                      {u}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>



                        {/* Furnishing */}
                        <div className="section">
                          <label className="section-label">Furnishing</label>
                          <div className="furnishing-options">
                            {["Furnished", "Semi-furnished", "Un-furnished"].map((type) => (
                              <div
                                key={type}
                                onClick={() => setFurnishingType(type)}
                                className={`furnishing-chip ${furnishingType === type ? "active" : ""
                                  }`}
                              >
                                {type}
                              </div>
                            ))}
                          </div>

                          {/* Show only when Furnished or Semi-furnished */}
                          {(furnishingType === "Furnished" || furnishingType === "Semi-furnished") && (
                            <>

                              <p style={{ marginTop: "10px", fontFamily: '"Josefin Sans", sans-serif', fontWeight: "600" }}>
                                At least three furnishings are mandatory for furnished
                              </p>


                              <div className="furnishing-grid">


                                {Object.keys(furnishingCheckboxes).map((item) => (
                                  <label key={item} className="furnishing-checkbox">
                                    <input
                                      type="checkbox"
                                      checked={furnishingCheckboxes[item]}
                                      onChange={() => toggleFurnishingCheckbox(item)}
                                    />
                                    {item}
                                  </label>
                                ))}
                              </div>
                            </>
                          )}
                        </div>


                        {/* {floor deatils} */}
                        <div className="step3-section">
                          <label className="step3-label">
                            Floor Details
                          </label>
                          <div className="step3-floor-group">
                            <input
                              type="number"
                              value={totalFloors}
                              onChange={(e) => {
                                const v = e.target.value;
                                setTotalFloors(v);
                                const nTotal = parseInt(v, 10);
                                const nProp = parseInt(propertyOnFloor, 10);
                                if (!Number.isNaN(nTotal) && !Number.isNaN(nProp) && nProp > nTotal) {
                                  setPropertyOnFloor(String(nTotal));
                                }
                              }}
                              placeholder="Total Floors"
                              className="step3-floor-input"
                            />

                          </div>
                        </div>

                        {/* Age of property if Ready to Move */}

                        <div className="step3-section">
                          <label className="step3-label">Age of property</label>
                          <div className="step3-button-group">
                            {["0-1 years", "1-5 years", "5-10 years", "10+ years"].map((age) => (
                              <button
                                key={age}
                                type="button"
                                onClick={() => setAgeOfProperty(age)}
                                className={`step3-option-btn ${ageOfProperty === age ? "active" : ""
                                  }`}
                              >
                                {age}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* ------------------- RENT DETAILS ------------------- */}
                        {/* Available From */}
                        <div className="step3-section">
                          <label className="step3-label">Available from</label>
                          <input
                            type="date"
                            value={availableFrom}
                            onChange={(e) => setAvailableFrom(e.target.value)}
                            className="step3-input"
                          />
                        </div>

                        {/* Willing to rent out to */}
                        <div className="step3-section">
                          <label className="step3-label">Willing to rent out to</label>
                          <div className="step3-button-group">
                            {["Family", "Single men", "Single women"].map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setWillingTo(opt)}
                                className={`step3-option-btn ${willingTo === opt ? "active" : ""
                                  }`}
                              >
                                + {opt}
                              </button>
                            ))}
                          </div>
                        </div>






                      </>
                    )}

                  </>
                )}

                {subPropertyType.includes("Plot / Land") && (
                  <>
                    <div
                      className="mb-3"

                    >
                      <label
                        style={{
                          display: "block",
                          fontSize: "16px",
                          fontWeight: 600,
                          marginBottom: "6px",
                          color: "#333",
                        }}
                      >
                        Add Area Details
                      </label>

                      <p
                        style={{
                          fontSize: "13px",
                          color: "#777",
                          marginBottom: "14px",
                        }}
                      >
                        Please enter the plot size
                      </p>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        {/* Input box */}
                        <input
                          type="number"
                          placeholder="Plot Area"
                          value={plotArea}
                          onChange={(e) => setPlotArea(e.target.value)}
                          style={{
                            flex: 1,
                            padding: "10px 14px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            fontSize: "15px",
                            color: "#333",
                            outline: "none",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                            transition: "all 0.2s ease",
                          }}
                          onFocus={(e) => (e.target.style.border = "1px solid #4a90e2")}
                          onBlur={(e) => (e.target.style.border = "1px solid #ccc")}
                        />

                        {/* Select dropdown */}
                        <select
                          value={plotAreaUnit}
                          onChange={(e) => setPlotAreaUnit(e.target.value)}
                          style={{
                            padding: "10px 14px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            fontSize: "15px",
                            color: "#333",
                            backgroundColor: "#fff",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                            outline: "none",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            height: "48px"
                          }}
                          onFocus={(e) => (e.target.style.border = "1px solid #4a90e2")}
                          onBlur={(e) => (e.target.style.border = "1px solid #ccc")}
                        >
                          <option value="sqft">Sq.ft</option>
                          <option value="sqyards">Sq.yards</option>
                          <option value="sqm">Sq.m</option>
                          <option value="acres">Acres</option>
                          <option value="Marla">Marla</option>
                          <option value="Cents">Cents</option>
                        </select>
                      </div>
                    </div>


                    {/* Property Dimensions (Optional) */}
                    <div className="step3-section">
                      <label className="step3-label">
                        Property Dimensions (Optional)
                      </label>

                      <div className="step3-input-group">
                        <input
                          type="number"
                          placeholder="Length of plot (in Ft.)"
                          value={plotLength}
                          onChange={(e) => setPlotLength(e.target.value)}
                          className="step3-input"
                        />
                      </div>

                      <div className="step3-input-group">
                        <input
                          type="number"
                          placeholder="Breadth of plot (in Ft.)"
                          value={plotBreadth}
                          onChange={(e) => setPlotBreadth(e.target.value)}
                          className="step3-input"
                        />
                      </div>
                    </div>

                    {/* Floors Allowed */}
                    <div className="step3-section">
                      <label className="step3-label">
                        Floors Allowed For Construction
                      </label>
                      <div className="step3-input-group">
                        <input
                          type="number"
                          placeholder="No. of floors"
                          value={floorsAllowed}
                          onChange={(e) => setFloorsAllowed(e.target.value)}
                          className="step3-input"
                        />
                      </div>
                    </div>

                    {/* Boundary Wall */}
                    <div className="step3-section">
                      <label className="step3-label">
                        Is there a boundary wall around the property?
                      </label>
                      <div className="step3-button-group">
                        <button
                          type="button"
                          onClick={() => setHasBoundaryWall(true)}
                          className={`step3-option-btn ${hasBoundaryWall ? 'active' : ''}`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setHasBoundaryWall(false)}
                          className={`step3-option-btn ${hasBoundaryWall === false ? 'active' : ''}`}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    {/* Open Sides */}
                    <div className="step3-section">
                      <label className="step3-label">
                        No. of open sides
                      </label>
                      <div className="step3-button-group">
                        {[1, 2, 3, "3+"].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setOpenSides(num)}
                            className={`step3-option-btn ${openSides === num ? 'active' : ''}`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Existing Construction */}
                    <div className="step3-section">
                      <label className="step3-label">
                        Any construction done on this property?
                      </label>
                      <div className="step3-button-group">
                        <button
                          type="button"
                          onClick={() => setHasConstruction(true)}
                          className={`step3-option-btn ${hasConstruction ? 'active' : ''}`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setHasConstruction(false)}
                          className={`step3-option-btn ${hasConstruction === false ? 'active' : ''}`}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    {/* Construction Type (if hasConstruction is true) */}
                    {hasConstruction && (
                      <div className="step3-section">
                        <label className="step3-label">
                          What type of construction has been done?
                        </label>
                        <div className="step3-button-group">
                          {['Shed', 'Rooms', 'Washroom', 'Other'].map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => {
                                if (constructionTypes.includes(type)) {
                                  setConstructionTypes(constructionTypes.filter(t => t !== type));
                                } else {
                                  setConstructionTypes([...constructionTypes, type]);
                                }
                              }}
                              className={`step3-option-btn ${constructionTypes.includes(type) ? 'active' : ''}`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Possession By */}
                    <div className="step3-section">
                      <label className="step3-label">Possession By</label>
                      <select
                        value={possessionBy}
                        onChange={(e) => setPossessionBy(e.target.value)}
                        className="step3-input"
                      >
                        <option value="" hidden>Expected time</option>
                        <option value="Immediate">Immediate</option>
                        <option value="Within 3 Months">Within 3 Months</option>
                        <option value="Within 6 Months">Within 6 Months</option>
                        <option value="By 2026">By 2026</option>
                        <option value="By 2027">By 2027</option>
                        <option value="By 2028">By 2028</option>
                        <option value="By 2029">By 2029</option>

                      </select>
                    </div>
                    {/* ownership */}
                    <div className="step3-section">
                      <label className="step3-label">
                        Ownership
                      </label>
                      <div className="step3-button-group">
                        {["Freehold", "Leasehold", "Co-operative Society", "Power of Attorney"].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setSelectedOwnership(opt)}
                            className={`step3-option-btn ${selectedOwnership === opt ? 'active' : ''}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>


                  </>
                )}

                {subPropertyType === "1 RK / Studio Apartment" && (

                  <>
                    {/* Sell + Residential */}
                    {listingType === "Sell" && propertyType === "Residential" && (
                      <>
                        <div className="step3-section">
                          <h6 className="step3-subheader">
                            Add Room Details
                          </h6>

                          {/* Bedrooms */}
                          <div className="step3-subsection">
                            <label className="step3-label">
                              No. of Bedrooms
                            </label>
                            <div className="step3-button-group">
                              {[1].map((num) => (
                                <div
                                  key={num}
                                  onClick={() => setBedrooms(num)}
                                  className={`step3-number-btn ${bedrooms === num ? 'active' : ''}`}
                                >
                                  {num}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Bathrooms */}
                          <div className="step3-subsection">
                            <label className="step3-label">
                              No. of Bathrooms
                            </label>
                            <div className="step3-button-group">
                              {[1].map((num) => (
                                <div
                                  key={num}
                                  onClick={() => setBathrooms(num)}
                                  className={`step3-number-btn ${bathrooms === num ? 'active' : ''}`}
                                >
                                  {num}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Balconies */}
                          <div className="step3-subsection">
                            <label className="step3-label">
                              Balconies
                            </label>
                            <div className="step3-button-group">
                              {[0, 1, 2, 3, "More than 3"].map((val) => (
                                <div
                                  key={val}
                                  onClick={() => setBalconies(val)}
                                  className={`step3-option-btn ${balconies === val ? 'active' : ''}`}
                                >
                                  {val}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Area Details */}
                        <div
                          className="mb-3"
                        >
                          {/* Header */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginBottom: "8px",
                            }}
                          >
                            <label style={{ fontSize: "16px", fontWeight: 600, color: "#333" }}>
                              Add Area Details
                            </label>

                          </div>

                          <p style={{ fontSize: "13px", color: "#888", marginBottom: "16px" }}>
                            At least one area type is mandatory
                          </p>

                          {/* Carpet Area */}
                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                              marginBottom: "16px",
                              position: "relative",
                            }}
                          >
                            <input
                              type="number"
                              placeholder="Carpet Area"
                              value={carpetArea}
                              onChange={(e) => setCarpetArea(e.target.value)}
                              style={{
                                flex: 1,
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid #ccc",
                                fontSize: "14px",
                              }}
                            />
                            <div
                              style={{
                                minWidth: "100px",
                                padding: "12px",
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                cursor: "pointer",
                                background: "#f9f9f9",
                              }}
                              onClick={() => setShowCarpetUnits((p) => !p)}
                            >
                              {carpetUnit || "Unit"} <span style={{ fontSize: "12px" }}>▼</span>
                            </div>

                            {showCarpetUnits && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: "110%",
                                  right: "0",
                                  background: "#fff",
                                  border: "1px solid #ddd",
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                  zIndex: 10,
                                  width: "120px",
                                }}
                              >
                                {UNIT_OPTIONS.map((u) => (
                                  <div
                                    key={u}
                                    onClick={() => {
                                      setCarpetUnit(u);
                                      setBuiltUpUnit(u); // sync
                                      setShowCarpetUnits(false);
                                    }}
                                    style={{
                                      padding: "10px",
                                      cursor: "pointer",
                                      background: carpetUnit === u ? "#ED2027" : "#fff",
                                      color: carpetUnit === u ? "#fff" : "#333",
                                      borderBottom: "1px solid #eee",
                                    }}
                                  >
                                    {u}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Validation */}
                          {carpetArea && builtUpArea && Number(carpetArea) >= Number(builtUpArea) && (
                            <p style={{ color: "red", fontSize: "13px", marginBottom: "12px" }}>
                              Carpet area must be smaller than built-up area
                            </p>
                          )}

                          {/* Built-up Area */}
                          {!showBuiltUpArea ? (
                            <button
                              type="button"
                              onClick={() => setShowBuiltUpArea(true)}
                              style={{
                                background: "transparent",
                                border: "1px dashed #ED2027",
                                color: "#ED2027",
                                padding: "10px 14px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontWeight: "500",
                                marginTop: "10px",
                              }}
                            >
                              + Add Built-up Area
                            </button>
                          ) : (
                            <div
                              style={{
                                display: "flex",
                                gap: "10px",
                                marginTop: "16px",
                                position: "relative",
                              }}
                            >
                              <input
                                type="number"
                                placeholder="Built-up Area"
                                value={builtUpArea}
                                onChange={(e) => setBuiltUpArea(e.target.value)}
                                style={{
                                  flex: 1,
                                  padding: "12px",
                                  borderRadius: "8px",
                                  border: "1px solid #ccc",
                                  fontSize: "14px",
                                }}
                              />
                              <div
                                style={{
                                  minWidth: "100px",
                                  padding: "12px",
                                  border: "1px solid #ccc",
                                  borderRadius: "8px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  cursor: "pointer",
                                  background: "#f9f9f9",
                                }}
                                onClick={() => setShowBuiltUpUnits((p) => !p)}
                              >
                                {builtUpUnit || "Unit"} <span style={{ fontSize: "12px" }}>▼</span>
                              </div>

                              {showBuiltUpUnits && (
                                <div
                                  style={{
                                    position: "absolute",
                                    top: "110%",
                                    right: "0",
                                    background: "#fff",
                                    border: "1px solid #ddd",
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                    zIndex: 10,
                                    width: "120px",
                                  }}
                                >
                                  {UNIT_OPTIONS.map((u) => (
                                    <div
                                      key={u}
                                      onClick={() => {
                                        setBuiltUpUnit(u);
                                        setCarpetUnit(u); // sync
                                        setShowBuiltUpUnits(false);
                                      }}
                                      style={{
                                        padding: "10px",
                                        cursor: "pointer",
                                        background: builtUpUnit === u ? "#ED2027" : "#fff",
                                        color: builtUpUnit === u ? "#fff" : "#333",
                                        borderBottom: "1px solid #eee",
                                      }}
                                    >
                                      {u}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="section">
                          <label className="section-label">Other rooms (Optional)</label>
                          <div className="room-options">
                            {["Pooja Room", "Study Room", "Servant Room", "Store Room"].map((room) => (
                              <div
                                key={room}
                                onClick={() =>
                                  setOtherRooms((prev) =>
                                    prev.includes(room)
                                      ? prev.filter((r) => r !== room)
                                      : [...prev, room]
                                  )
                                }
                                className={`room-chip ${otherRooms.includes(room) ? "active" : ""}`}
                              >
                                {room}
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* furnished */}
                        <div className="section">
                          <label className="section-label">Furnishing</label>
                          <div className="furnishing-options">
                            {["Furnished", "Semi-furnished", "Un-furnished"].map((type) => (
                              <div
                                key={type}
                                onClick={() => setFurnishingType(type)}
                                className={`furnishing-chip ${furnishingType === type ? "active" : ""
                                  }`}
                              >
                                {type}
                              </div>
                            ))}
                          </div>

                          {/* Show only when Furnished or Semi-furnished */}
                          {(furnishingType === "Furnished" || furnishingType === "Semi-furnished") && (
                            <>

                              <p style={{ marginTop: "10px", fontFamily: '"Josefin Sans", sans-serif', fontWeight: "600" }}>
                                At least three furnishings are mandatory for furnished
                              </p>


                              <div className="furnishing-grid">


                                {Object.keys(furnishingCheckboxes).map((item) => (
                                  <label key={item} className="furnishing-checkbox">
                                    <input
                                      type="checkbox"
                                      checked={furnishingCheckboxes[item]}
                                      onChange={() => toggleFurnishingCheckbox(item)}
                                    />
                                    {item}
                                  </label>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                        <div className="section">
                          <label className="section-label">Reserved Parking (Optional)</label>
                          <div className="parking-container">
                            <div className="parking-item">
                              <span className="parking-label">Covered Parking</span>
                              <button
                                className={`count-btn ${hoveredButton === "covered-minus" ? "hovered" : ""
                                  }`}
                                onClick={() => setCoveredParking(Math.max(0, coveredParking - 1))}
                                onMouseEnter={() => setHoveredButton("covered-minus")}
                                onMouseLeave={() => setHoveredButton(null)}
                              >
                                –
                              </button>
                              <span className="count-value">{coveredParking}</span>
                              <button
                                className={`count-btn ${hoveredButton === "covered-plus" ? "hovered" : ""
                                  }`}
                                onClick={() => setCoveredParking(coveredParking + 1)}
                                onMouseEnter={() => setHoveredButton("covered-plus")}
                                onMouseLeave={() => setHoveredButton(null)}
                              >
                                +
                              </button>
                            </div>

                            <div className="parking-item">
                              <span className="parking-label">Open Parking</span>
                              <button
                                className={`count-btn ${hoveredButton === "open-minus" ? "hovered" : ""
                                  }`}
                                onClick={() => setOpenParking(Math.max(0, openParking - 1))}
                                onMouseEnter={() => setHoveredButton("open-minus")}
                                onMouseLeave={() => setHoveredButton(null)}
                              >
                                –
                              </button>
                              <span className="count-value">{openParking}</span>
                              <button
                                className={`count-btn ${hoveredButton === "open-plus" ? "hovered" : ""
                                  }`}
                                onClick={() => setOpenParking(openParking + 1)}
                                onMouseEnter={() => setHoveredButton("open-plus")}
                                onMouseLeave={() => setHoveredButton(null)}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                        {/* floor */}
                        <div className="step3-section">
                          <label className="step3-label">
                            Floor Details
                          </label>
                          <div className="step3-floor-group">
                            <input
                              type="number"
                              value={totalFloors}
                              onChange={(e) => {
                                const v = e.target.value;
                                setTotalFloors(v);
                                const nTotal = parseInt(v, 10);
                                const nProp = parseInt(propertyOnFloor, 10);
                                if (!Number.isNaN(nTotal) && !Number.isNaN(nProp) && nProp > nTotal) {
                                  setPropertyOnFloor(String(nTotal));
                                }
                              }}
                              placeholder="Total Floors"
                              className="step3-floor-input"
                            />
                            <select
                              value={propertyOnFloor}
                              onChange={(e) => setPropertyOnFloor(e.target.value)}
                              className="step3-floor-select"
                            >
                              <option value="" hidden>Property on Floor</option>
                              <option value="Basement">Basement</option>
                              <option value="Lower Ground">Lower Ground</option>
                              <option value="Ground">Ground</option>
                              {(() => {
                                const n = parseInt(totalFloors, 10);
                                if (!Number.isNaN(n) && n > 0) {
                                  return Array.from({ length: n }, (_, i) => i + 1).map((f) => (
                                    <option key={f} value={String(f)}>
                                      {f}
                                    </option>
                                  ));
                                }
                                return null;
                              })()}
                            </select>
                          </div>
                        </div>

                        {/* Availability Status */}
                        <div className="step3-section">
                          <label className="step3-label">
                            Availability Status
                          </label>
                          <div className="step3-button-group">
                            {["Ready to Move", "Under Construction"].map((status) => (
                              <button
                                key={status}
                                type="button"
                                onClick={() => setAvailabilityStatus(status)}
                                className={`step3-option-btn ${availabilityStatus === status ? 'active' : ''}`}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Age of property if Ready to Move */}
                        {availabilityStatus === "Ready to Move" && (
                          <div className="step3-section">
                            <label className="step3-label">
                              Age of property
                            </label>
                            <div className="step3-button-group">
                              {["0-1 years", "1-5 years", "5-10 years", "10+ years"].map((age) => (
                                <button
                                  key={age}
                                  type="button"
                                  onClick={() => setAgeOfProperty(age)}
                                  className={`step3-option-btn ${ageOfProperty === age ? 'active' : ''}`}
                                >
                                  {age}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Possession By if Under Construction */}
                        {availabilityStatus === "Under Construction" && (
                          <div className="step3-section">
                            <label className="step3-label">Possession By</label>
                            <select
                              value={possessionBy}
                              onChange={(e) => setPossessionBy(e.target.value)}
                              className="step3-input"
                            >
                              <option value="" hidden>Expected time</option>
                              <option value="Within 3 Months">Within 3 Months</option>
                              <option value="Within 6 Months">Within 6 Months</option>
                              <option value="By 2026">By 2026</option>
                              <option value="By 2027">By 2027</option>
                              <option value="By 2028">By 2028</option>
                              <option value="By 2029">By 2029</option>
                              <option value="By 2030">By 2030</option>
                            </select>
                          </div>
                        )}

                        {/* Ownership */}
                        <div className="step3-section">
                          <label className="step3-label">
                            Ownership
                          </label>
                          <div className="step3-button-group">
                            {["Freehold", "Leasehold", "Co-operative Society", "Power of Attorney"].map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setSelectedOwnership(opt)}
                                className={`step3-option-btn ${selectedOwnership === opt ? 'active' : ''}`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>


                      </>
                    )}
                    {/* Rent + Residential */}
                    {listingType === "Rent" && propertyType === "Residential" && (
                      <>


                        <div className="step3-section">
                          <h6 className="step3-subheader">
                            Add Room Details
                          </h6>

                          {/* Bedrooms */}
                          <div className="step3-subsection">
                            <label className="step3-label">
                              No. of Bedrooms
                            </label>
                            <div className="step3-button-group">
                              {[1].map((num) => (
                                <div
                                  key={num}
                                  onClick={() => setBedrooms(num)}
                                  className={`step3-number-btn ${bedrooms === num ? 'active' : ''}`}
                                >
                                  {num}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Bathrooms */}
                          <div className="step3-subsection">
                            <label className="step3-label">
                              No. of Bathrooms
                            </label>
                            <div className="step3-button-group">
                              {[1].map((num) => (
                                <div
                                  key={num}
                                  onClick={() => setBathrooms(num)}
                                  className={`step3-number-btn ${bathrooms === num ? 'active' : ''}`}
                                >
                                  {num}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Balconies */}
                          <div className="step3-subsection">
                            <label className="step3-label">
                              Balconies
                            </label>
                            <div className="step3-button-group">
                              {[0, 1, 2, 3, "More than 3"].map((val) => (
                                <div
                                  key={val}
                                  onClick={() => setBalconies(val)}
                                  className={`step3-option-btn ${balconies === val ? 'active' : ''}`}
                                >
                                  {val}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Area Details */}
                        <div
                          className="mb-3"
                        >
                          {/* Header */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginBottom: "8px",
                            }}
                          >
                            <label style={{ fontSize: "16px", fontWeight: 600, color: "#333" }}>
                              Add Area Details
                            </label>

                          </div>

                          <p style={{ fontSize: "13px", color: "#888", marginBottom: "16px" }}>
                            At least one area type is mandatory
                          </p>

                          {/* Carpet Area */}
                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                              marginBottom: "16px",
                              position: "relative",
                            }}
                          >
                            <input
                              type="number"
                              placeholder="Carpet Area"
                              value={carpetArea}
                              onChange={(e) => setCarpetArea(e.target.value)}
                              style={{
                                flex: 1,
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid #ccc",
                                fontSize: "14px",
                              }}
                            />
                            <div
                              style={{
                                minWidth: "100px",
                                padding: "12px",
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                cursor: "pointer",
                                background: "#f9f9f9",
                              }}
                              onClick={() => setShowCarpetUnits((p) => !p)}
                            >
                              {carpetUnit || "Unit"} <span style={{ fontSize: "12px" }}>▼</span>
                            </div>

                            {showCarpetUnits && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: "110%",
                                  right: "0",
                                  background: "#fff",
                                  border: "1px solid #ddd",
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                  zIndex: 10,
                                  width: "120px",
                                }}
                              >
                                {UNIT_OPTIONS.map((u) => (
                                  <div
                                    key={u}
                                    onClick={() => {
                                      setCarpetUnit(u);
                                      setBuiltUpUnit(u); // sync
                                      setShowCarpetUnits(false);
                                    }}
                                    style={{
                                      padding: "10px",
                                      cursor: "pointer",
                                      background: carpetUnit === u ? "#ED2027" : "#fff",
                                      color: carpetUnit === u ? "#fff" : "#333",
                                      borderBottom: "1px solid #eee",
                                    }}
                                  >
                                    {u}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Validation */}
                          {carpetArea && builtUpArea && Number(carpetArea) >= Number(builtUpArea) && (
                            <p style={{ color: "red", fontSize: "13px", marginBottom: "12px" }}>
                              Carpet area must be smaller than built-up area
                            </p>
                          )}

                          {/* Built-up Area */}
                          {!showBuiltUpArea ? (
                            <button
                              type="button"
                              onClick={() => setShowBuiltUpArea(true)}
                              style={{
                                background: "transparent",
                                border: "1px dashed #ED2027",
                                color: "#ED2027",
                                padding: "10px 14px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontWeight: "500",
                                marginTop: "10px",
                              }}
                            >
                              + Add Built-up Area
                            </button>
                          ) : (
                            <div
                              style={{
                                display: "flex",
                                gap: "10px",
                                marginTop: "16px",
                                position: "relative",
                              }}
                            >
                              <input
                                type="number"
                                placeholder="Built-up Area"
                                value={builtUpArea}
                                onChange={(e) => setBuiltUpArea(e.target.value)}
                                style={{
                                  flex: 1,
                                  padding: "12px",
                                  borderRadius: "8px",
                                  border: "1px solid #ccc",
                                  fontSize: "14px",
                                }}
                              />
                              <div
                                style={{
                                  minWidth: "100px",
                                  padding: "12px",
                                  border: "1px solid #ccc",
                                  borderRadius: "8px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  cursor: "pointer",
                                  background: "#f9f9f9",
                                }}
                                onClick={() => setShowBuiltUpUnits((p) => !p)}
                              >
                                {builtUpUnit || "Unit"} <span style={{ fontSize: "12px" }}>▼</span>
                              </div>

                              {showBuiltUpUnits && (
                                <div
                                  style={{
                                    position: "absolute",
                                    top: "110%",
                                    right: "0",
                                    background: "#fff",
                                    border: "1px solid #ddd",
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                    zIndex: 10,
                                    width: "120px",
                                  }}
                                >
                                  {UNIT_OPTIONS.map((u) => (
                                    <div
                                      key={u}
                                      onClick={() => {
                                        setBuiltUpUnit(u);
                                        setCarpetUnit(u); // sync
                                        setShowBuiltUpUnits(false);
                                      }}
                                      style={{
                                        padding: "10px",
                                        cursor: "pointer",
                                        background: builtUpUnit === u ? "#ED2027" : "#fff",
                                        color: builtUpUnit === u ? "#fff" : "#333",
                                        borderBottom: "1px solid #eee",
                                      }}
                                    >
                                      {u}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>


                        {/* furnished */}
                        <div className="section">
                          <label className="section-label">Furnishing</label>
                          <div className="furnishing-options">
                            {["Furnished", "Semi-furnished", "Un-furnished"].map((type) => (
                              <div
                                key={type}
                                onClick={() => setFurnishingType(type)}
                                className={`furnishing-chip ${furnishingType === type ? "active" : ""
                                  }`}
                              >
                                {type}
                              </div>
                            ))}
                          </div>

                          {/* Show only when Furnished or Semi-furnished */}
                          {(furnishingType === "Furnished" || furnishingType === "Semi-furnished") && (
                            <>

                              <p style={{ marginTop: "10px", fontFamily: '"Josefin Sans", sans-serif', fontWeight: "600" }}>
                                At least three furnishings are mandatory for furnished
                              </p>


                              <div className="furnishing-grid">


                                {Object.keys(furnishingCheckboxes).map((item) => (
                                  <label key={item} className="furnishing-checkbox">
                                    <input
                                      type="checkbox"
                                      checked={furnishingCheckboxes[item]}
                                      onChange={() => toggleFurnishingCheckbox(item)}
                                    />
                                    {item}
                                  </label>
                                ))}
                              </div>
                            </>
                          )}
                        </div>

                        <div className="section">
                          <label className="section-label">Reserved Parking (Optional)</label>
                          <div className="parking-container">
                            <div className="parking-item">
                              <span className="parking-label">Covered Parking</span>
                              <button
                                className={`count-btn ${hoveredButton === "covered-minus" ? "hovered" : ""
                                  }`}
                                onClick={() => setCoveredParking(Math.max(0, coveredParking - 1))}
                                onMouseEnter={() => setHoveredButton("covered-minus")}
                                onMouseLeave={() => setHoveredButton(null)}
                              >
                                –
                              </button>
                              <span className="count-value">{coveredParking}</span>
                              <button
                                className={`count-btn ${hoveredButton === "covered-plus" ? "hovered" : ""
                                  }`}
                                onClick={() => setCoveredParking(coveredParking + 1)}
                                onMouseEnter={() => setHoveredButton("covered-plus")}
                                onMouseLeave={() => setHoveredButton(null)}
                              >
                                +
                              </button>
                            </div>

                            <div className="parking-item">
                              <span className="parking-label">Open Parking</span>
                              <button
                                className={`count-btn ${hoveredButton === "open-minus" ? "hovered" : ""
                                  }`}
                                onClick={() => setOpenParking(Math.max(0, openParking - 1))}
                                onMouseEnter={() => setHoveredButton("open-minus")}
                                onMouseLeave={() => setHoveredButton(null)}
                              >
                                –
                              </button>
                              <span className="count-value">{openParking}</span>
                              <button
                                className={`count-btn ${hoveredButton === "open-plus" ? "hovered" : ""
                                  }`}
                                onClick={() => setOpenParking(openParking + 1)}
                                onMouseEnter={() => setHoveredButton("open-plus")}
                                onMouseLeave={() => setHoveredButton(null)}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>



                        {/* floor */}
                        <div className="step3-section">
                          <label className="step3-label">
                            Floor Details
                          </label>
                          <div className="step3-floor-group">
                            <input
                              type="number"
                              value={totalFloors}
                              onChange={(e) => {
                                const v = e.target.value;
                                setTotalFloors(v);
                                const nTotal = parseInt(v, 10);
                                const nProp = parseInt(propertyOnFloor, 10);
                                if (!Number.isNaN(nTotal) && !Number.isNaN(nProp) && nProp > nTotal) {
                                  setPropertyOnFloor(String(nTotal));
                                }
                              }}
                              placeholder="Total Floors"
                              className="step3-floor-input"
                            />
                            <select
                              value={propertyOnFloor}
                              onChange={(e) => setPropertyOnFloor(e.target.value)}
                              className="step3-floor-select"
                            >
                              <option value="" hidden>Property on Floor</option>
                              <option value="Basement">Basement</option>
                              <option value="Lower Ground">Lower Ground</option>
                              <option value="Ground">Ground</option>
                              {(() => {
                                const n = parseInt(totalFloors, 10);
                                if (!Number.isNaN(n) && n > 0) {
                                  return Array.from({ length: n }, (_, i) => i + 1).map((f) => (
                                    <option key={f} value={String(f)}>
                                      {f}
                                    </option>
                                  ));
                                }
                                return null;
                              })()}
                            </select>
                          </div>
                        </div>



                        {/* Age of property if Ready to Move */}

                        <div className="step3-section">
                          <label className="step3-label">Age of property</label>
                          <div className="step3-button-group">
                            {["0-1 years", "1-5 years", "5-10 years", "10+ years"].map((age) => (
                              <button
                                key={age}
                                type="button"
                                onClick={() => setAgeOfProperty(age)}
                                className={`step3-option-btn ${ageOfProperty === age ? "active" : ""
                                  }`}
                              >
                                {age}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* ------------------- RENT DETAILS ------------------- */}
                        {/* Available From */}
                        <div className="step3-section">
                          <label className="step3-label">Available from</label>
                          <input
                            type="date"
                            value={availableFrom}
                            onChange={(e) => setAvailableFrom(e.target.value)}
                            className="step3-input"
                          />
                        </div>

                        {/* Willing to rent out to */}
                        <div className="step3-section">
                          <label className="step3-label">Willing to rent out to</label>
                          <div className="step3-button-group">
                            {["Family", "Single men", "Single women"].map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setWillingTo(opt)}
                                className={`step3-option-btn ${willingTo === opt ? "active" : ""
                                  }`}
                              >
                                + {opt}
                              </button>
                            ))}
                          </div>
                        </div>


                      </>
                    )}
                  </>
                )}


                {subPropertyType.includes("Farmhouse") && (
                  <>
                    {/* Sell + Residential */}
                    {listingType === "Sell" && propertyType === "Residential" && (
                      <>
                        <div className="step3-section">
                          <h6 className="step3-subheader">
                            Add Room Details
                          </h6>

                          {/* Bedrooms */}
                          <div className="step3-subsection">
                            <label className="step3-label">
                              No. of Bedrooms
                            </label>
                            <div className="step3-button-group">
                              {[1, 2, 3, 4, 5].map((num) => (
                                <div
                                  key={num}
                                  onClick={() => setBedrooms(num)}
                                  className={`step3-number-btn ${bedrooms === num ? 'active' : ''}`}
                                >
                                  {num}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Bathrooms */}
                          <div className="step3-subsection">
                            <label className="step3-label">
                              No. of Bathrooms
                            </label>
                            <div className="step3-button-group">
                              {[1, 2, 3, 4, 5].map((num) => (
                                <div
                                  key={num}
                                  onClick={() => setBathrooms(num)}
                                  className={`step3-number-btn ${bathrooms === num ? 'active' : ''}`}
                                >
                                  {num}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Balconies */}
                          <div className="step3-subsection">
                            <label className="step3-label">
                              Balconies
                            </label>
                            <div className="step3-button-group">
                              {[0, 1, 2, 3, "More than 3"].map((val) => (
                                <div
                                  key={val}
                                  onClick={() => setBalconies(val)}
                                  className={`step3-option-btn ${balconies === val ? 'active' : ''}`}
                                >
                                  {val}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        {/* Area Details */}
                        <div
                          className="mb-3"
                        >
                          {/* Header */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginBottom: "8px",
                            }}
                          >
                            <label style={{ fontSize: "16px", fontWeight: 600, color: "#333" }}>
                              Add Area Details
                            </label>

                          </div>

                          <p style={{ fontSize: "13px", color: "#888", marginBottom: "16px" }}>
                            At least one area type is mandatory
                          </p>

                          {/* Carpet Area */}
                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                              marginBottom: "16px",
                              position: "relative",
                            }}
                          >
                            <input
                              type="number"
                              placeholder="Carpet Area"
                              value={carpetArea}
                              onChange={(e) => setCarpetArea(e.target.value)}
                              style={{
                                flex: 1,
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid #ccc",
                                fontSize: "14px",
                              }}
                            />
                            <div
                              style={{
                                minWidth: "100px",
                                padding: "12px",
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                cursor: "pointer",
                                background: "#f9f9f9",
                              }}
                              onClick={() => setShowCarpetUnits((p) => !p)}
                            >
                              {carpetUnit || "Unit"} <span style={{ fontSize: "12px" }}>▼</span>
                            </div>

                            {showCarpetUnits && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: "110%",
                                  right: "0",
                                  background: "#fff",
                                  border: "1px solid #ddd",
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                  zIndex: 10,
                                  width: "120px",
                                }}
                              >
                                {UNIT_OPTIONS.map((u) => (
                                  <div
                                    key={u}
                                    onClick={() => {
                                      setCarpetUnit(u);
                                      setBuiltUpUnit(u); // sync
                                      setShowCarpetUnits(false);
                                    }}
                                    style={{
                                      padding: "10px",
                                      cursor: "pointer",
                                      background: carpetUnit === u ? "#ED2027" : "#fff",
                                      color: carpetUnit === u ? "#fff" : "#333",
                                      borderBottom: "1px solid #eee",
                                    }}
                                  >
                                    {u}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Validation */}
                          {carpetArea && builtUpArea && Number(carpetArea) >= Number(builtUpArea) && (
                            <p style={{ color: "red", fontSize: "13px", marginBottom: "12px" }}>
                              Carpet area must be smaller than built-up area
                            </p>
                          )}

                          {/* Built-up Area */}
                          {!showBuiltUpArea ? (
                            <button
                              type="button"
                              onClick={() => setShowBuiltUpArea(true)}
                              style={{
                                background: "transparent",
                                border: "1px dashed #ED2027",
                                color: "#ED2027",
                                padding: "10px 14px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontWeight: "500",
                                marginTop: "10px",
                              }}
                            >
                              + Add Built-up Area
                            </button>
                          ) : (
                            <div
                              style={{
                                display: "flex",
                                gap: "10px",
                                marginTop: "16px",
                                position: "relative",
                              }}
                            >
                              <input
                                type="number"
                                placeholder="Built-up Area"
                                value={builtUpArea}
                                onChange={(e) => setBuiltUpArea(e.target.value)}
                                style={{
                                  flex: 1,
                                  padding: "12px",
                                  borderRadius: "8px",
                                  border: "1px solid #ccc",
                                  fontSize: "14px",
                                }}
                              />
                              <div
                                style={{
                                  minWidth: "100px",
                                  padding: "12px",
                                  border: "1px solid #ccc",
                                  borderRadius: "8px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  cursor: "pointer",
                                  background: "#f9f9f9",
                                }}
                                onClick={() => setShowBuiltUpUnits((p) => !p)}
                              >
                                {builtUpUnit || "Unit"} <span style={{ fontSize: "12px" }}>▼</span>
                              </div>

                              {showBuiltUpUnits && (
                                <div
                                  style={{
                                    position: "absolute",
                                    top: "110%",
                                    right: "0",
                                    background: "#fff",
                                    border: "1px solid #ddd",
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                    zIndex: 10,
                                    width: "120px",
                                  }}
                                >
                                  {UNIT_OPTIONS.map((u) => (
                                    <div
                                      key={u}
                                      onClick={() => {
                                        setBuiltUpUnit(u);
                                        setCarpetUnit(u); // sync
                                        setShowBuiltUpUnits(false);
                                      }}
                                      style={{
                                        padding: "10px",
                                        cursor: "pointer",
                                        background: builtUpUnit === u ? "#ED2027" : "#fff",
                                        color: builtUpUnit === u ? "#fff" : "#333",
                                        borderBottom: "1px solid #eee",
                                      }}
                                    >
                                      {u}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>


                        {/* {floor deatils} */}
                        <div className="step3-section">
                          <label className="step3-label">
                            Floor Details
                          </label>
                          <div className="step3-floor-group">
                            <input
                              type="number"
                              value={totalFloors}
                              onChange={(e) => {
                                const v = e.target.value;
                                setTotalFloors(v);
                                const nTotal = parseInt(v, 10);
                                const nProp = parseInt(propertyOnFloor, 10);
                                if (!Number.isNaN(nTotal) && !Number.isNaN(nProp) && nProp > nTotal) {
                                  setPropertyOnFloor(String(nTotal));
                                }
                              }}
                              placeholder="Total Floors"
                              className="step3-floor-input"
                            />

                          </div>
                        </div>


                        {/* Availability Status */}
                        <div className="step3-section">
                          <label className="step3-label">
                            Availability Status
                          </label>
                          <div className="step3-button-group">
                            {["Ready to Move", "Under Construction"].map((status) => (
                              <button
                                key={status}
                                type="button"
                                onClick={() => setAvailabilityStatus(status)}
                                className={`step3-option-btn ${availabilityStatus === status ? 'active' : ''}`}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Age of property if Ready to Move */}
                        {availabilityStatus === "Ready to Move" && (
                          <div className="step3-section">
                            <label className="step3-label">
                              Age of property
                            </label>
                            <div className="step3-button-group">
                              {["0-1 years", "1-5 years", "5-10 years", "10+ years"].map((age) => (
                                <button
                                  key={age}
                                  type="button"
                                  onClick={() => setAgeOfProperty(age)}
                                  className={`step3-option-btn ${ageOfProperty === age ? 'active' : ''}`}
                                >
                                  {age}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Possession By if Under Construction */}
                        {availabilityStatus === "Under Construction" && (
                          <div className="step3-section">
                            <label className="step3-label">Possession By</label>
                            <select
                              value={possessionBy}
                              onChange={(e) => setPossessionBy(e.target.value)}
                              className="step3-input"
                            >
                              <option value="" hidden>Expected time</option>
                              <option value="Within 3 Months">Within 3 Months</option>
                              <option value="Within 6 Months">Within 6 Months</option>
                              <option value="By 2026">By 2026</option>
                              <option value="By 2027">By 2027</option>
                              <option value="By 2028">By 2028</option>
                              <option value="By 2029">By 2029</option>
                              <option value="By 2030">By 2030</option>
                            </select>
                          </div>
                        )}

                        {/* Ownership */}
                        <div className="step3-section">
                          <label className="step3-label">
                            Ownership
                          </label>
                          <div className="step3-button-group">
                            {["Freehold", "Leasehold", "Co-operative Society", "Power of Attorney"].map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setSelectedOwnership(opt)}
                                className={`step3-option-btn ${selectedOwnership === opt ? 'active' : ''}`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>


                        {/*  pooja Others rooms */}
                        <div className="section">
                          <label className="section-label">Other rooms (Optional)</label>
                          <div className="room-options">
                            {["Pooja Room", "Study Room", "Servant Room", "Store Room"].map((room) => (
                              <div
                                key={room}
                                onClick={() =>
                                  setOtherRooms((prev) =>
                                    prev.includes(room)
                                      ? prev.filter((r) => r !== room)
                                      : [...prev, room]
                                  )
                                }
                                className={`room-chip ${otherRooms.includes(room) ? "active" : ""}`}
                              >
                                {room}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Furnishing */}
                        <div className="section">
                          <label className="section-label">Furnishing</label>
                          <div className="furnishing-options">
                            {["Furnished", "Semi-furnished", "Un-furnished"].map((type) => (
                              <div
                                key={type}
                                onClick={() => setFurnishingType(type)}
                                className={`furnishing-chip ${furnishingType === type ? "active" : ""
                                  }`}
                              >
                                {type}
                              </div>
                            ))}
                          </div>

                          {/* Show only when Furnished or Semi-furnished */}
                          {(furnishingType === "Furnished" || furnishingType === "Semi-furnished") && (
                            <>

                              <p style={{ marginTop: "10px", fontFamily: '"Josefin Sans", sans-serif', fontWeight: "600" }}>
                                At least three furnishings are mandatory for furnished
                              </p>


                              <div className="furnishing-grid">
                                {Object.keys(furnishings).map((item) => (
                                  <div key={item} className="furnishing-item">
                                    <button
                                      onClick={() => handleFurnishingCount(item, -1)}
                                      onMouseEnter={() => setHoveredButton(`${item}-minus`)}
                                      onMouseLeave={() => setHoveredButton(null)}
                                      className={`count-btn ${hoveredButton === `${item}-minus` ? "hovered" : ""
                                        }`}
                                    >
                                      –
                                    </button>
                                    <span className="count-value">{furnishings[item]}</span>
                                    <button
                                      onClick={() => handleFurnishingCount(item, 1)}
                                      onMouseEnter={() => setHoveredButton(`${item}-plus`)}
                                      onMouseLeave={() => setHoveredButton(null)}
                                      className={`count-btn ${hoveredButton === `${item}-plus` ? "hovered" : ""
                                        }`}
                                    >
                                      +
                                    </button>
                                    <span className="furnishing-name">{item}</span>
                                  </div>
                                ))}

                                {Object.keys(furnishingCheckboxes).map((item) => (
                                  <label key={item} className="furnishing-checkbox">
                                    <input
                                      type="checkbox"
                                      checked={furnishingCheckboxes[item]}
                                      onChange={() => toggleFurnishingCheckbox(item)}
                                    />
                                    {item}
                                  </label>
                                ))}
                              </div>











                            </>
                          )}
                        </div>

                      </>
                    )}

                    {/* Rent + Residential */}
                    {listingType === "Rent" && propertyType === "Residential" && (
                      <>
                        <div className="step3-section">
                          <h6 className="step3-subheader">
                            Add Room Details
                          </h6>

                          {/* Bedrooms */}
                          <div className="step3-subsection">
                            <label className="step3-label">
                              No. of Bedrooms
                            </label>
                            <div className="step3-button-group">
                              {[1, 2, 3, 4, 5].map((num) => (
                                <div
                                  key={num}
                                  onClick={() => setBedrooms(num)}
                                  className={`step3-number-btn ${bedrooms === num ? 'active' : ''}`}
                                >
                                  {num}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Bathrooms */}
                          <div className="step3-subsection">
                            <label className="step3-label">
                              No. of Bathrooms
                            </label>
                            <div className="step3-button-group">
                              {[1, 2, 3, 4, 5].map((num) => (
                                <div
                                  key={num}
                                  onClick={() => setBathrooms(num)}
                                  className={`step3-number-btn ${bathrooms === num ? 'active' : ''}`}
                                >
                                  {num}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Balconies */}
                          <div className="step3-subsection">
                            <label className="step3-label">
                              Balconies
                            </label>
                            <div className="step3-button-group">
                              {[0, 1, 2, 3, "More than 3"].map((val) => (
                                <div
                                  key={val}
                                  onClick={() => setBalconies(val)}
                                  className={`step3-option-btn ${balconies === val ? 'active' : ''}`}
                                >
                                  {val}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        {/* Area Details */}
                        <div
                          className="mb-3"
                        >
                          {/* Header */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginBottom: "8px",
                            }}
                          >
                            <label style={{ fontSize: "16px", fontWeight: 600, color: "#333" }}>
                              Add Area Details
                            </label>

                          </div>

                          <p style={{ fontSize: "13px", color: "#888", marginBottom: "16px" }}>
                            At least one area type is mandatory
                          </p>

                          {/* Carpet Area */}
                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                              marginBottom: "16px",
                              position: "relative",
                            }}
                          >
                            <input
                              type="number"
                              placeholder="Carpet Area"
                              value={carpetArea}
                              onChange={(e) => setCarpetArea(e.target.value)}
                              style={{
                                flex: 1,
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid #ccc",
                                fontSize: "14px",
                              }}
                            />
                            <div
                              style={{
                                minWidth: "100px",
                                padding: "12px",
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                cursor: "pointer",
                                background: "#f9f9f9",
                              }}
                              onClick={() => setShowCarpetUnits((p) => !p)}
                            >
                              {carpetUnit || "Unit"} <span style={{ fontSize: "12px" }}>▼</span>
                            </div>

                            {showCarpetUnits && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: "110%",
                                  right: "0",
                                  background: "#fff",
                                  border: "1px solid #ddd",
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                  zIndex: 10,
                                  width: "120px",
                                }}
                              >
                                {UNIT_OPTIONS.map((u) => (
                                  <div
                                    key={u}
                                    onClick={() => {
                                      setCarpetUnit(u);
                                      setBuiltUpUnit(u); // sync
                                      setShowCarpetUnits(false);
                                    }}
                                    style={{
                                      padding: "10px",
                                      cursor: "pointer",
                                      background: carpetUnit === u ? "#ED2027" : "#fff",
                                      color: carpetUnit === u ? "#fff" : "#333",
                                      borderBottom: "1px solid #eee",
                                    }}
                                  >
                                    {u}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Validation */}
                          {carpetArea && builtUpArea && Number(carpetArea) >= Number(builtUpArea) && (
                            <p style={{ color: "red", fontSize: "13px", marginBottom: "12px" }}>
                              Carpet area must be smaller than built-up area
                            </p>
                          )}

                          {/* Built-up Area */}
                          {!showBuiltUpArea ? (
                            <button
                              type="button"
                              onClick={() => setShowBuiltUpArea(true)}
                              style={{
                                background: "transparent",
                                border: "1px dashed #ED2027",
                                color: "#ED2027",
                                padding: "10px 14px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontWeight: "500",
                                marginTop: "10px",
                              }}
                            >
                              + Add Built-up Area
                            </button>
                          ) : (
                            <div
                              style={{
                                display: "flex",
                                gap: "10px",
                                marginTop: "16px",
                                position: "relative",
                              }}
                            >
                              <input
                                type="number"
                                placeholder="Built-up Area"
                                value={builtUpArea}
                                onChange={(e) => setBuiltUpArea(e.target.value)}
                                style={{
                                  flex: 1,
                                  padding: "12px",
                                  borderRadius: "8px",
                                  border: "1px solid #ccc",
                                  fontSize: "14px",
                                }}
                              />
                              <div
                                style={{
                                  minWidth: "100px",
                                  padding: "12px",
                                  border: "1px solid #ccc",
                                  borderRadius: "8px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  cursor: "pointer",
                                  background: "#f9f9f9",
                                }}
                                onClick={() => setShowBuiltUpUnits((p) => !p)}
                              >
                                {builtUpUnit || "Unit"} <span style={{ fontSize: "12px" }}>▼</span>
                              </div>

                              {showBuiltUpUnits && (
                                <div
                                  style={{
                                    position: "absolute",
                                    top: "110%",
                                    right: "0",
                                    background: "#fff",
                                    border: "1px solid #ddd",
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                    zIndex: 10,
                                    width: "120px",
                                  }}
                                >
                                  {UNIT_OPTIONS.map((u) => (
                                    <div
                                      key={u}
                                      onClick={() => {
                                        setBuiltUpUnit(u);
                                        setCarpetUnit(u); // sync
                                        setShowBuiltUpUnits(false);
                                      }}
                                      style={{
                                        padding: "10px",
                                        cursor: "pointer",
                                        background: builtUpUnit === u ? "#ED2027" : "#fff",
                                        color: builtUpUnit === u ? "#fff" : "#333",
                                        borderBottom: "1px solid #eee",
                                      }}
                                    >
                                      {u}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="section">
                          <label className="section-label">Furnishing</label>
                          <div className="furnishing-options">
                            {["Furnished", "Semi-furnished", "Un-furnished"].map((type) => (
                              <div
                                key={type}
                                onClick={() => setFurnishingType(type)}
                                className={`furnishing-chip ${furnishingType === type ? "active" : ""
                                  }`}
                              >
                                {type}
                              </div>
                            ))}
                          </div>

                          {/* Show only when Furnished or Semi-furnished */}
                          {(furnishingType === "Furnished" || furnishingType === "Semi-furnished") && (
                            <>

                              <p style={{ marginTop: "10px", fontFamily: '"Josefin Sans", sans-serif', fontWeight: "600" }}>
                                At least three furnishings are mandatory for furnished
                              </p>


                              <div className="furnishing-grid">
                                {Object.keys(furnishings).map((item) => (
                                  <div key={item} className="furnishing-item">
                                    <button
                                      onClick={() => handleFurnishingCount(item, -1)}
                                      onMouseEnter={() => setHoveredButton(`${item}-minus`)}
                                      onMouseLeave={() => setHoveredButton(null)}
                                      className={`count-btn ${hoveredButton === `${item}-minus` ? "hovered" : ""
                                        }`}
                                    >
                                      –
                                    </button>
                                    <span className="count-value">{furnishings[item]}</span>
                                    <button
                                      onClick={() => handleFurnishingCount(item, 1)}
                                      onMouseEnter={() => setHoveredButton(`${item}-plus`)}
                                      onMouseLeave={() => setHoveredButton(null)}
                                      className={`count-btn ${hoveredButton === `${item}-plus` ? "hovered" : ""
                                        }`}
                                    >
                                      +
                                    </button>
                                    <span className="furnishing-name">{item}</span>
                                  </div>
                                ))}

                                {Object.keys(furnishingCheckboxes).map((item) => (
                                  <label key={item} className="furnishing-checkbox">
                                    <input
                                      type="checkbox"
                                      checked={furnishingCheckboxes[item]}
                                      onChange={() => toggleFurnishingCheckbox(item)}
                                    />
                                    {item}
                                  </label>
                                ))}
                              </div>

                            </>
                          )}
                        </div>


                        {/* {floor deatils} */}
                        <div className="step3-section">
                          <label className="step3-label">
                            Floor Details
                          </label>
                          <div className="step3-floor-group">
                            <input
                              type="number"
                              value={totalFloors}
                              onChange={(e) => {
                                const v = e.target.value;
                                setTotalFloors(v);
                                const nTotal = parseInt(v, 10);
                                const nProp = parseInt(propertyOnFloor, 10);
                                if (!Number.isNaN(nTotal) && !Number.isNaN(nProp) && nProp > nTotal) {
                                  setPropertyOnFloor(String(nTotal));
                                }
                              }}
                              placeholder="Total Floors"
                              className="step3-floor-input"
                            />

                          </div>
                        </div>



                        {/* Age of property if Ready to Move */}

                        <div className="step3-section">
                          <label className="step3-label">Age of property</label>
                          <div className="step3-button-group">
                            {["0-1 years", "1-5 years", "5-10 years", "10+ years"].map((age) => (
                              <button
                                key={age}
                                type="button"
                                onClick={() => setAgeOfProperty(age)}
                                className={`step3-option-btn ${ageOfProperty === age ? "active" : ""
                                  }`}
                              >
                                {age}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* ------------------- RENT DETAILS ------------------- */}
                        {/* Available From */}
                        <div className="step3-section">
                          <label className="step3-label">Available from</label>
                          <input
                            type="date"
                            value={availableFrom}
                            onChange={(e) => setAvailableFrom(e.target.value)}
                            className="step3-input"
                          />
                        </div>

                        {/* Willing to rent out to */}
                        <div className="step3-section">
                          <label className="step3-label">Willing to rent out to</label>
                          <div className="step3-button-group">
                            {["Family", "Single men", "Single women"].map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setWillingTo(opt)}
                                className={`step3-option-btn ${willingTo === opt ? "active" : ""
                                  }`}
                              >
                                + {opt}
                              </button>
                            ))}
                          </div>
                        </div>







                      </>
                    )}

                  </>
                )}







                {propertyType === "Commercial" &&
                  subPropertyType === "Office" &&
                  subPropertyQuestionOption === "Ready to move office space" && (
                    <>



                      {/* Describe your office setup */}
                      <div className="step3-section">
                        <label className="step3-label">Describe your office setup</label>
                        <div className="step3-input-row">
                          <input
                            type="number"
                            placeholder="Min. no. of Seats"
                            value={minSeats}
                            onChange={(e) => setMinSeats(e.target.value)}
                            className="step3-input"
                          />
                          <input
                            type="number"
                            placeholder="Max. no. of Seats (optional)"
                            value={maxSeats}
                            onChange={(e) => setMaxSeats(e.target.value)}
                            className="step3-input"
                          />
                        </div>
                        <input
                          type="number"
                          placeholder="No. of Cabins"
                          value={noOfCabins}
                          onChange={(e) => setNoOfCabins(e.target.value)}
                          className="step3-input"
                        />
                      </div>

                      {/* No. of meeting rooms */}
                      <div className="step3-section">
                        <label className="step3-label">No. of Meeting Rooms</label>
                        <input
                          type="number"
                          placeholder="No. of Meeting Rooms"
                          value={noOfMeetingRooms}
                          onChange={(e) => setNoOfMeetingRooms(e.target.value)}
                          className="step3-input"
                        />
                      </div>

                      {/* Washrooms */}
                      <div className="step3-section">
                        <label className="step3-label">Washrooms</label>
                        <div className="button-group">
                          <button
                            type="button"
                            onClick={() => setWashroom("Available")}
                            className={`subproperty-option ${washroom === "Available" ? "active" : ""
                              }`}
                          >
                            Available
                          </button>
                          <button
                            type="button"
                            onClick={() => setWashroom("Not Available")}
                            className={`subproperty-option ${washroom === "Not Available" ? "active" : ""
                              }`}
                          >
                            Not - Available
                          </button>
                        </div>
                      </div>

                      {/* Conference Room */}
                      <div className="step3-section">
                        <label className="step3-label">Conference Room</label>
                        <div className="button-group">
                          <button
                            type="button"
                            onClick={() => setConferenceRoom("Available")}
                            className={`subproperty-option ${conferenceRoom === "Available" ? "active" : ""
                              }`}
                          >
                            Available
                          </button>
                          <button
                            type="button"
                            onClick={() => setConferenceRoom("Not Available")}
                            className={`subproperty-option ${conferenceRoom === "Not Available" ? "active" : ""
                              }`}
                          >
                            Not - Available
                          </button>
                        </div>
                      </div>

                      {/* Reception Area */}
                      <div className="step3-section">
                        <label className="step3-label">Reception Area</label>
                        <div className="button-group">
                          <button
                            type="button"
                            onClick={() => setReceptionArea("Available")}
                            className={`subproperty-option ${receptionArea === "Available" ? "active" : ""
                              }`}
                          >
                            Available
                          </button>
                          <button
                            type="button"
                            onClick={() => setReceptionArea("Not Available")}
                            className={`subproperty-option ${receptionArea === "Not Available" ? "active" : ""
                              }`}
                          >
                            Not - Available
                          </button>
                        </div>
                      </div>

                      {/* Pantry Type */}
                      <div className="step3-section">
                        <label className="step3-label">Pantry Type</label>
                        <div className="button-group">
                          <button
                            type="button"
                            onClick={() => setPantryType("Private")}
                            className={`subproperty-option ${pantryType === "Private" ? "active" : ""
                              }`}
                          >
                            Private
                          </button>
                          <button
                            type="button"
                            onClick={() => setPantryType("Shared")}
                            className={`subproperty-option ${pantryType === "Shared" ? "active" : ""
                              }`}
                          >
                            Shared
                          </button>
                          <button
                            type="button"
                            onClick={() => setPantryType("Not Available")}
                            className={`subproperty-option ${pantryType === "Not Available" ? "active" : ""
                              }`}
                          >
                            Not - Available
                          </button>
                        </div>
                      </div>

                      {/* Facilities Available */}
                      <div className="step3-section">
                        <label className="step3-label">Please select the facilities available</label>

                        {/* Furnishing */}
                        <div className="step3-facility-row" style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
                          <span style={{ minWidth: "200px" }}>Furnishing</span>
                          <label style={{ marginRight: "15px" }}>
                            <input
                              type="radio"
                              name="furnishing"
                              checked={furnishing === "Available"}
                              onChange={() => setFurnishing("Available")}
                            />{" "}
                            Available
                          </label>
                          <label>
                            <input
                              type="radio"
                              name="furnishing"
                              checked={furnishing === "Not Available"}
                              onChange={() => setFurnishing("Not Available")}
                            />{" "}
                            Not Available
                          </label>
                        </div>

                        {/* Air Conditioning */}
                        <div className="step3-facility-row" style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
                          <span style={{ minWidth: "200px" }}>Central Air Conditioning</span>
                          <label style={{ marginRight: "15px" }}>
                            <input
                              type="radio"
                              name="airConditioning"
                              checked={airConditioning === "Available"}
                              onChange={() => setAirConditioning("Available")}
                            />{" "}
                            Available
                          </label>
                          <label>
                            <input
                              type="radio"
                              name="airConditioning"
                              checked={airConditioning === "Not Available"}
                              onChange={() => setAirConditioning("Not Available")}
                            />{" "}
                            Not Available
                          </label>
                        </div>

                        {/* Oxygen Duct */}
                        <div className="step3-facility-row" style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
                          <span style={{ minWidth: "200px" }}>Oxygen Duct</span>
                          <label style={{ marginRight: "15px" }}>
                            <input
                              type="radio"
                              name="oxygen"
                              checked={oxygen === "Available"}
                              onChange={() => setOxygen("Available")}
                            />{" "}
                            Available
                          </label>
                          <label>
                            <input
                              type="radio"
                              name="oxygen"
                              checked={oxygen === "Not Available"}
                              onChange={() => setOxygen("Not Available")}
                            />{" "}
                            Not Available
                          </label>
                        </div>

                        {/* UPS */}
                        <div className="step3-facility-row" style={{ display: "flex", alignItems: "center" }}>
                          <span style={{ minWidth: "200px" }}>UPS</span>
                          <label style={{ marginRight: "15px" }}>
                            <input
                              type="radio"
                              name="ups"
                              checked={ups === "Available"}
                              onChange={() => setUps("Available")}
                            />{" "}
                            Available
                          </label>
                          <label>
                            <input
                              type="radio"
                              name="ups"
                              checked={ups === "Not Available"}
                              onChange={() => setUps("Not Available")}
                            />{" "}
                            Not Available
                          </label>
                        </div>
                      </div>



                      {/* 🔥 Fire Safety Measures Include */}
                      <div className="step3-section">
                        <label className="step3-label">Fire safety measures include</label>
                        <div className="button-group">
                          {["Fire Extinguisher", "Fire Sensors", "Sprinklers", "Fire Hose"].map((item) => (
                            <button
                              type="button"
                              key={item}
                              onClick={() =>
                                setFireSafety((prev) =>
                                  prev.includes(item)
                                    ? prev.filter((i) => i !== item)
                                    : [...prev, item]
                                )
                              }
                              className={`subproperty-option ${fireSafety.includes(item) ? "active" : ""
                                }`}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Floor deatils */}
                      <div className="step3-section">
                        <label className="step3-label">
                          Floor Details
                        </label>
                        <div className="step3-floor-group">
                          <input
                            type="number"
                            value={totalFloors}
                            onChange={(e) => {
                              const v = e.target.value;
                              setTotalFloors(v);
                              const nTotal = parseInt(v, 10);
                              const nProp = parseInt(propertyOnFloor, 10);
                              if (!Number.isNaN(nTotal) && !Number.isNaN(nProp) && nProp > nTotal) {
                                setPropertyOnFloor(String(nTotal));
                              }
                            }}
                            placeholder="Total Floors"
                            className="step3-floor-input"
                          />
                          <select
                            value={propertyOnFloor}
                            onChange={(e) => setPropertyOnFloor(e.target.value)}
                            className="step3-floor-select"
                          >
                            <option value="" hidden>Property on Floor</option>
                            <option value="Basement">Basement</option>
                            <option value="Lower Ground">Lower Ground</option>
                            <option value="Ground">Ground</option>
                            {(() => {
                              const n = parseInt(totalFloors, 10);
                              if (!Number.isNaN(n) && n > 0) {
                                return Array.from({ length: n }, (_, i) => i + 1).map((f) => (
                                  <option key={f} value={String(f)}>
                                    {f}
                                  </option>
                                ));
                              }
                              return null;
                            })()}
                          </select>
                        </div>
                      </div>

                      {/* 🧱 Number of Staircases */}
                      <div className="step3-section">
                        <label className="step3-label">
                          No. of Staircases <span className="step3-optional">(Optional)</span>
                        </label>
                        <div className="button-group">
                          {[1, 2, 3, 4].map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => setStaircases(num)}
                              className={`subproperty-option ${staircases === num ? "active" : ""
                                }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 🛗 Lifts */}
                      <div className="step3-section">
                        <label className="step3-label">Lifts</label>
                        <div className="button-group">
                          <button
                            type="button"
                            onClick={() => setLifts("Available")}
                            className={`subproperty-option ${lifts === "Available" ? "active" : ""
                              }`}
                          >
                            Available
                          </button>
                          <button
                            type="button"
                            onClick={() => setLifts("Not Available")}
                            className={`subproperty-option ${lifts === "Not Available" ? "active" : ""
                              }`}
                          >
                            Not - Available
                          </button>
                        </div>
                      </div>

                      {/* 🚗 Parking */}
                      <div className="step3-section">
                        <label className="step3-label">Parking</label>
                        <div className="button-group">
                          <button
                            type="button"
                            onClick={() => setParking("Available")}
                            className={`subproperty-option ${parking === "Available" ? "active" : ""
                              }`}
                          >
                            Available
                          </button>
                          <button
                            type="button"
                            onClick={() => setParking("Not Available")}
                            className={`subproperty-option ${parking === "Not Available" ? "active" : ""
                              }`}
                          >
                            Not - Available
                          </button>
                        </div>
                      </div>


                      {/* Availability Status */}
                      <div className="step3-section">
                        <label className="step3-label">
                          Availability Status
                        </label>
                        <div className="step3-button-group">
                          {["Ready to Move", "Under Construction"].map((status) => (
                            <button
                              key={status}
                              type="button"
                              onClick={() => setAvailabilityStatus(status)}
                              className={`step3-option-btn ${availabilityStatus === status ? 'active' : ''}`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Age of property if Ready to Move */}
                      {availabilityStatus === "Ready to Move" && (
                        <div className="step3-section">
                          <label className="step3-label">
                            Age of property
                          </label>
                          <div className="step3-button-group">
                            {["0-1 years", "1-5 years", "5-10 years", "10+ years"].map((age) => (
                              <button
                                key={age}
                                type="button"
                                onClick={() => setAgeOfProperty(age)}
                                className={`step3-option-btn ${ageOfProperty === age ? 'active' : ''}`}
                              >
                                {age}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Possession By if Under Construction */}
                      {availabilityStatus === "Under Construction" && (
                        <div className="step3-section">
                          <label className="step3-label">Possession By</label>
                          <select
                            value={possessionBy}
                            onChange={(e) => setPossessionBy(e.target.value)}
                            className="step3-input"
                          >
                            <option value="" hidden>Expected time</option>
                            <option value="Within 3 Months">Within 3 Months</option>
                            <option value="Within 6 Months">Within 6 Months</option>
                            <option value="By 2026">By 2026</option>
                            <option value="By 2027">By 2027</option>
                            <option value="By 2028">By 2028</option>
                            <option value="By 2029">By 2029</option>
                            <option value="By 2030">By 2030</option>
                          </select>
                        </div>
                      )}
                    </>
                  )}


                {propertyType === "Commercial" &&
                  subPropertyType === "Office" &&
                  subPropertyQuestionOption === "Bare shell office space" && (
                    <>

                      {/* buit and carpet  Details */}



                      {/* Construction status of walls */}
                      <div className="step3-section">
                        <label className="step3-label">Construction status of walls</label>
                        <div className="button-group">
                          {["No walls", "Brick walls", "Cemented walls", "Plastered walls"].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              className={`subproperty-option ${wallStatus === opt ? "active" : ""}`}
                              onClick={() => setWallStatus(opt)}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Doors constructed */}
                      <div className="step3-section">
                        <label className="step3-label">Are doors constructed</label>
                        <div className="button-group">
                          {["Yes", "No"].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              className={`subproperty-option ${doorsConstructed === opt ? "active" : ""}`}
                              onClick={() => setDoorsConstructed(opt)}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Washrooms */}
                      <div className="step3-section">
                        <label className="step3-label">Washrooms</label>
                        <div className="button-group">
                          {["Available", "Not built yet"].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              className={`subproperty-option ${washroomBare === opt ? "active" : ""}`}
                              onClick={() => setWashroomBare(opt)}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>


                      {/* Pantry Type */}
                      <div className="step3-section">
                        <label className="step3-label">Pantry Type</label>
                        <div className="button-group">
                          <button
                            type="button"
                            onClick={() => setPantryType("Shared Pantry")}
                            className={`subproperty-option ${pantryType === "Shared Pantry" ? "active" : ""
                              }`}
                          >
                            Shared Pantry
                          </button>

                          <button
                            type="button"
                            onClick={() => setPantryType("No Shared Pantry")}
                            className={`subproperty-option ${pantryType === "No Shared Pantry" ? "active" : ""
                              }`}
                          >
                            No Shared Pantry
                          </button>
                        </div>
                      </div>


                      {/* Flooring  */}
                      <div className="step3-section">
                        <label className="step3-label">Type of flooring</label>
                        <select
                          className="step3-input"
                          value={flooringType}
                          onChange={(e) => setFlooringType(e.target.value)}
                        >
                          <option value="">Select</option>
                          <option value="Marble">Marble</option>
                          <option value="Concrete">Concrete</option>
                          <option value="Polished concrete">Polished concrete</option>
                          <option value="Granite">Granite</option>
                          <option value="Ceramic">Ceramic</option>
                        </select>
                      </div>

                      {/* Central Air Conditioning (3 options) */}
                      <div className="step3-section">
                        <label className="step3-label">Please select the facilities available</label>


                        <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
                          <span style={{ minWidth: "200px" }}>Central Air Conditioning</span>

                          <label style={{ marginRight: "15px" }}>
                            <input
                              type="radio"
                              name="airConditioning"
                              checked={airConditioning === "Duct Only"}
                              onChange={() => setAirConditioning("Duct Only")}
                            />{" "}
                            Duct Only
                          </label>

                          <label style={{ marginRight: "15px" }}>
                            <input
                              type="radio"
                              name="airConditioning"
                              checked={airConditioning === "Available"}
                              onChange={() => setAirConditioning("Available")}
                            />{" "}
                            Available
                          </label>

                          <label style={{ marginRight: "15px" }}>
                            <input
                              type="radio"
                              name="airConditioning"
                              checked={airConditioning === "Not Available"}
                              onChange={() => setAirConditioning("Not Available")}
                            />{" "}
                            Not Available
                          </label>


                        </div>

                        {/* Oxygen Duct (2 options) */}
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span style={{ minWidth: "200px" }}>Oxygen Duct</span>

                          <label style={{ marginRight: "22px" }}>
                            <input
                              type="radio"
                              name="oxygen"
                              checked={oxygen === "Available"}
                              onChange={() => setOxygen("Available")}
                            />{" "}
                            Available
                          </label>

                          <label>
                            <input
                              type="radio"
                              name="oxygen"
                              checked={oxygen === "Not Available"}
                              onChange={() => setOxygen("Not Available")}
                            />{" "}
                            Not Available
                          </label>
                        </div>
                      </div>

                      {/* 🔥 Fire Safety Measures Include */}
                      <div className="step3-section">
                        <label className="step3-label">Fire safety measures include</label>
                        <div className="button-group">
                          {["Fire Extinguisher", "Fire Sensors", "Sprinklers", "Fire Hose"].map((item) => (
                            <button
                              type="button"
                              key={item}
                              onClick={() =>
                                setFireSafety((prev) =>
                                  prev.includes(item)
                                    ? prev.filter((i) => i !== item)
                                    : [...prev, item]
                                )
                              }
                              className={`subproperty-option ${fireSafety.includes(item) ? "active" : ""
                                }`}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>


                      {/* Floor deatils */}
                      <div className="step3-section">
                        <label className="step3-label">
                          Floor Details
                        </label>
                        <div className="step3-floor-group">
                          <input
                            type="number"
                            value={totalFloors}
                            onChange={(e) => {
                              const v = e.target.value;
                              setTotalFloors(v);
                              const nTotal = parseInt(v, 10);
                              const nProp = parseInt(propertyOnFloor, 10);
                              if (!Number.isNaN(nTotal) && !Number.isNaN(nProp) && nProp > nTotal) {
                                setPropertyOnFloor(String(nTotal));
                              }
                            }}
                            placeholder="Total Floors"
                            className="step3-floor-input"
                          />
                          <select
                            value={propertyOnFloor}
                            onChange={(e) => setPropertyOnFloor(e.target.value)}
                            className="step3-floor-select"
                          >
                            <option value="" hidden>Property on Floor</option>
                            <option value="Basement">Basement</option>
                            <option value="Lower Ground">Lower Ground</option>
                            <option value="Ground">Ground</option>
                            {(() => {
                              const n = parseInt(totalFloors, 10);
                              if (!Number.isNaN(n) && n > 0) {
                                return Array.from({ length: n }, (_, i) => i + 1).map((f) => (
                                  <option key={f} value={String(f)}>
                                    {f}
                                  </option>
                                ));
                              }
                              return null;
                            })()}
                          </select>
                        </div>
                      </div>

                      {/* 🧱 Number of Staircases */}
                      <div className="step3-section">
                        <label className="step3-label">
                          No. of Staircases <span className="step3-optional">(Optional)</span>
                        </label>
                        <div className="button-group">
                          {[1, 2, 3, 4].map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => setStaircases(num)}
                              className={`subproperty-option ${staircases === num ? "active" : ""
                                }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 🛗 Lifts */}
                      <div className="step3-section">
                        <label className="step3-label">Lifts</label>
                        <div className="button-group">
                          <button
                            type="button"
                            onClick={() => setLifts("Available")}
                            className={`subproperty-option ${lifts === "Available" ? "active" : ""
                              }`}
                          >
                            Available
                          </button>
                          <button
                            type="button"
                            onClick={() => setLifts("Not Available")}
                            className={`subproperty-option ${lifts === "Not Available" ? "active" : ""
                              }`}
                          >
                            Not - Available
                          </button>
                        </div>
                      </div>

                      {/* 🚗 Parking */}
                      <div className="step3-section">
                        <label className="step3-label">Parking</label>
                        <div className="button-group">
                          <button
                            type="button"
                            onClick={() => setParking("Available")}
                            className={`subproperty-option ${parking === "Available" ? "active" : ""
                              }`}
                          >
                            Available
                          </button>
                          <button
                            type="button"
                            onClick={() => setParking("Not Available")}
                            className={`subproperty-option ${parking === "Not Available" ? "active" : ""
                              }`}
                          >
                            Not - Available
                          </button>
                        </div>
                      </div>


                      {/* Availability Status */}
                      <div className="step3-section">
                        <label className="step3-label">
                          Availability Status
                        </label>
                        <div className="step3-button-group">
                          {["Ready to Move", "Under Construction"].map((status) => (
                            <button
                              key={status}
                              type="button"
                              onClick={() => setAvailabilityStatus(status)}
                              className={`step3-option-btn ${availabilityStatus === status ? 'active' : ''}`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Age of property if Ready to Move */}
                      {availabilityStatus === "Ready to Move" && (
                        <div className="step3-section">
                          <label className="step3-label">
                            Age of property
                          </label>
                          <div className="step3-button-group">
                            {["0-1 years", "1-5 years", "5-10 years", "10+ years"].map((age) => (
                              <button
                                key={age}
                                type="button"
                                onClick={() => setAgeOfProperty(age)}
                                className={`step3-option-btn ${ageOfProperty === age ? 'active' : ''}`}
                              >
                                {age}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Possession By if Under Construction */}
                      {availabilityStatus === "Under Construction" && (
                        <div className="step3-section">
                          <label className="step3-label">Possession By</label>
                          <select
                            value={possessionBy}
                            onChange={(e) => setPossessionBy(e.target.value)}
                            className="step3-input"
                          >
                            <option value="" hidden>Expected time</option>
                            <option value="Within 3 Months">Within 3 Months</option>
                            <option value="Within 6 Months">Within 6 Months</option>
                            <option value="By 2026">By 2026</option>
                            <option value="By 2027">By 2027</option>
                            <option value="By 2028">By 2028</option>
                            <option value="By 2029">By 2029</option>
                            <option value="By 2030">By 2030</option>
                          </select>
                        </div>
                      )}
                    </>
                  )}


                {propertyType === "Commercial" &&
                  subPropertyType === "Office" &&
                  subPropertyQuestionOption === "Co-working office space" && (
                    <>

                      {/* Washrooms */}
                      <div className="step3-section">
                        <label className="step3-label">Washrooms</label>
                        <div className="button-group">
                          {["None", "Shared", "1", "2", "3", "4"].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              className={`subproperty-option ${washroomBare === opt ? "active" : ""}`}
                              onClick={() => setWashroomBare(opt)}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>



                      {/* Availability Status */}
                      <div className="step3-section">
                        <label className="step3-label">
                          Availability Status
                        </label>
                        <div className="step3-button-group">
                          {["Ready to Move", "Under Construction"].map((status) => (
                            <button
                              key={status}
                              type="button"
                              onClick={() => setAvailabilityStatus(status)}
                              className={`step3-option-btn ${availabilityStatus === status ? 'active' : ''}`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Age of property if Ready to Move */}
                      {availabilityStatus === "Ready to Move" && (
                        <div className="step3-section">
                          <label className="step3-label">
                            Age of property
                          </label>
                          <div className="step3-button-group">
                            {["0-1 years", "1-5 years", "5-10 years", "10+ years"].map((age) => (
                              <button
                                key={age}
                                type="button"
                                onClick={() => setAgeOfProperty(age)}
                                className={`step3-option-btn ${ageOfProperty === age ? 'active' : ''}`}
                              >
                                {age}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Possession By if Under Construction */}
                      {availabilityStatus === "Under Construction" && (
                        <div className="step3-section">
                          <label className="step3-label">Possession By</label>
                          <select
                            value={possessionBy}
                            onChange={(e) => setPossessionBy(e.target.value)}
                            className="step3-input"
                          >
                            <option value="" hidden>Expected time</option>
                            <option value="Within 3 Months">Within 3 Months</option>
                            <option value="Within 6 Months">Within 6 Months</option>
                            <option value="By 2026">By 2026</option>
                            <option value="By 2027">By 2027</option>
                            <option value="By 2028">By 2028</option>
                            <option value="By 2029">By 2029</option>
                            <option value="By 2030">By 2030</option>
                          </select>
                        </div>
                      )}
                    </>
                  )}

                {propertyType === "Commercial" &&
                  subPropertyType === "Retail" &&
                  (subPropertyQuestionOption === "Commercial Shops" ||
                    subPropertyQuestionOption === "Commercial Showrooms") && (
                    <>


                      {/* Shop Facade Size */}
                      <div className="step3-section">
                        <label className="step3-label">
                          Shop facade size <span className="step3-optional">(Optional)</span>
                        </label>
                        <p className="step3-subtext">Shop - front related details</p>

                        {/* Entrance width */}
                        <div className="step3-input-group">
                          <input
                            type="number"
                            placeholder="Entrance width"
                            value={entranceWidth}
                            onChange={(e) => setEntranceWidth(e.target.value)}
                            className="step3-input"
                          />
                          <div
                            className="step3-unit-selector"
                            onClick={() => setShowEntranceUnit((p) => !p)}
                          >
                            {entranceUnit || "ft."} <span className="step3-dropdown-icon">▼</span>
                          </div>
                          {showEntranceUnit && (
                            <div className="step3-unit-dropdown">
                              {["ft.", "mtr."].map((u) => (
                                <div
                                  key={u}
                                  onClick={() => {
                                    setEntranceUnit(u);
                                    setShowEntranceUnit(false);
                                  }}
                                  className="step3-unit-option"
                                >
                                  {u}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Ceiling Height */}
                        <div className="step3-input-group">
                          <input
                            type="number"
                            placeholder="Ceiling Height"
                            value={ceilingHeight}
                            onChange={(e) => setCeilingHeight(e.target.value)}
                            className="step3-input"
                          />
                          <div
                            className="step3-unit-selector"
                            onClick={() => setShowCeilingUnit((p) => !p)}
                          >
                            {ceilingUnit || "ft."} <span className="step3-dropdown-icon">▼</span>
                          </div>
                          {showCeilingUnit && (
                            <div className="step3-unit-dropdown">
                              {["ft.", "mtr."].map((u) => (
                                <div
                                  key={u}
                                  onClick={() => {
                                    setCeilingUnit(u);
                                    setShowCeilingUnit(false);
                                  }}
                                  className="step3-unit-option"
                                >
                                  {u}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Washroom details */}
                      <div className="step3-section">
                        <label className="step3-label">Washroom details</label>
                        <div className="button-group">
                          {["Private washrooms", "Public washrooms", "Not Available"].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              className={`subproperty-option ${retailWashroom.includes(opt) ? "active" : ""}`}
                              onClick={() => {
                                if (opt === "Not Available") {
                                  // If "Not Available" clicked -> clear all other options and select only this
                                  setRetailWashroom(["Not Available"]);
                                } else {
                                  setRetailWashroom((prev) => {
                                    // if "Not Available" is already selected -> remove it
                                    let updated = prev.filter((i) => i !== "Not Available");

                                    // then toggle the selected option
                                    if (updated.includes(opt)) {
                                      return updated.filter((i) => i !== opt);
                                    } else {
                                      return [...updated, opt];
                                    }
                                  });
                                }
                              }}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Floor Details */}
                      <div className="step3-section">
                        <label className="step3-label">
                          Floor Details
                        </label>
                        <div className="step3-floor-group">
                          <input
                            type="number"
                            value={totalFloors}
                            onChange={(e) => {
                              const v = e.target.value;
                              setTotalFloors(v);
                              const nTotal = parseInt(v, 10);
                              const nProp = parseInt(propertyOnFloor, 10);
                              if (!Number.isNaN(nTotal) && !Number.isNaN(nProp) && nProp > nTotal) {
                                setPropertyOnFloor(String(nTotal));
                              }
                            }}
                            placeholder="Total Floors"
                            className="step3-floor-input"
                          />
                          <select
                            value={propertyOnFloor}
                            onChange={(e) => setPropertyOnFloor(e.target.value)}
                            className="step3-floor-select"
                          >
                            <option value="" hidden>Property on Floor</option>
                            <option value="Basement">Basement</option>
                            <option value="Lower Ground">Lower Ground</option>
                            <option value="Ground">Ground</option>
                            {(() => {
                              const n = parseInt(totalFloors, 10);
                              if (!Number.isNaN(n) && n > 0) {
                                return Array.from({ length: n }, (_, i) => i + 1).map((f) => (
                                  <option key={f} value={String(f)}>
                                    {f}
                                  </option>
                                ));
                              }
                              return null;
                            })()}
                          </select>
                        </div>
                      </div>

                      {/* Located Near */}
                      <div className="step3-section">
                        <label className="step3-label">Located Near <span className="step3-optional">(Optional)</span></label>
                        <div className="button-group">
                          {["Entrance", "Elevator", "Stairs"].map((option) => (
                            <button
                              key={option}
                              type="button"
                              className={`subproperty-option ${locatedNear.includes(option) ? "active" : ""}`}
                              onClick={() => {
                                setLocatedNear((prev) =>
                                  prev.includes(option)
                                    ? prev.filter((i) => i !== option)
                                    : [...prev, option]
                                );
                              }}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Parking Type */}
                      <div className="step3-section">
                        <label className="step3-label">Parking Type</label>
                        <div className="button-group">
                          {["Private Parking", "Public Parking", "Multilevel Parking", "Not Available"].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              className={`subproperty-option ${parkingTypeRetail.includes(opt) ? "active" : ""}`}
                              onClick={() => {
                                if (opt === "Not Available") {
                                  setParkingTypeRetail(["Not Available"]);
                                } else {
                                  setParkingTypeRetail((prev) => {
                                    let updated = prev.filter((i) => i !== "Not Available");
                                    if (updated.includes(opt)) {
                                      return updated.filter((i) => i !== opt);
                                    } else {
                                      return [...updated, opt];
                                    }
                                  });
                                }
                              }}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>


                      {/* Availability Status */}
                      <div className="step3-section">
                        <label className="step3-label">
                          Availability Status
                        </label>
                        <div className="step3-button-group">
                          {["Ready to Move", "Under Construction"].map((status) => (
                            <button
                              key={status}
                              type="button"
                              onClick={() => setAvailabilityStatus(status)}
                              className={`step3-option-btn ${availabilityStatus === status ? 'active' : ''}`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Age of property if Ready to Move */}
                      {availabilityStatus === "Ready to Move" && (
                        <div className="step3-section">
                          <label className="step3-label">
                            Age of property
                          </label>
                          <div className="step3-button-group">
                            {["0-1 years", "1-5 years", "5-10 years", "10+ years"].map((age) => (
                              <button
                                key={age}
                                type="button"
                                onClick={() => setAgeOfProperty(age)}
                                className={`step3-option-btn ${ageOfProperty === age ? 'active' : ''}`}
                              >
                                {age}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Possession By if Under Construction */}
                      {availabilityStatus === "Under Construction" && (
                        <div className="step3-section">
                          <label className="step3-label">Possession By</label>
                          <select
                            value={possessionBy}
                            onChange={(e) => setPossessionBy(e.target.value)}
                            className="step3-input"
                          >
                            <option value="" hidden>Expected time</option>
                            <option value="Within 3 Months">Within 3 Months</option>
                            <option value="Within 6 Months">Within 6 Months</option>
                            <option value="By 2026">By 2026</option>
                            <option value="By 2027">By 2027</option>
                            <option value="By 2028">By 2028</option>
                            <option value="By 2029">By 2029</option>
                            <option value="By 2030">By 2030</option>
                          </select>
                        </div>
                      )}

                      {/* Business Type (multi-select dropdown with checkboxes) */}
                      <div className="step3-section">
                        <label className="step3-label">Business Type</label>

                        <div
                          className="step3-input"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            cursor: "pointer",
                            marginTop: "4px",
                          }}
                          onClick={() => setShowBusinessTypes((p) => !p)}
                        >
                          {businessTypes.length === 0
                            ? "Select"
                            : businessTypes.length === 1
                              ? businessTypes[0]
                              : `${businessTypes[0]} +${businessTypes.length - 1}`
                          }
                          <span className="step3-dropdown-icon">▼</span>
                        </div>

                        {showBusinessTypes && (
                          <div
                            className="step3-dropdown-checkbox-list"
                            style={{
                              border: "1px solid #d1d5db",
                              borderRadius: "4px",
                              padding: "12px",
                              maxHeight: "170px",
                              overflowY: "auto",
                              marginTop: "6px"
                            }}
                          >
                            {[
                              "ATM",
                              "Bakery",
                              "Boutique",
                              "Clinic",
                              "Grocery Store",
                              "Restaurant"
                            ].map((type) => (
                              <label
                                key={type}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  marginBottom: "10px",
                                  gap: "8px"
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={businessTypes.includes(type)}
                                  onChange={() => {
                                    setBusinessTypes((prev) =>
                                      prev.includes(type)
                                        ? prev.filter((i) => i !== type)
                                        : [...prev, type]
                                    );
                                  }}
                                />
                                <span>{type}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>

                    </>
                  )}

                {propertyType === "Commercial" &&
                  subPropertyType === "Plot" &&
                  (
                    subPropertyQuestionOption === "Commercial Land/inst.Land" ||
                    subPropertyQuestionOption === "Agriculture/Farm Land" ||
                    subPropertyQuestionOption === "Industrial Lands/Plots"
                  ) && (
                    <>
                      {/* Plot Area Section */}
                      <div
                        className="mb-3"

                      >
                        <label
                          style={{
                            display: "block",
                            fontSize: "16px",
                            fontWeight: 600,
                            marginBottom: "6px",
                            color: "#333",
                          }}
                        >
                          Add Area Details
                        </label>

                        <p
                          style={{
                            fontSize: "13px",
                            color: "#777",
                            marginBottom: "14px",
                          }}
                        >
                          Please enter the plot size
                        </p>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          {/* Input box */}
                          <input
                            type="number"
                            placeholder="Plot Area"
                            value={plotArea}
                            onChange={(e) => setPlotArea(e.target.value)}
                            style={{
                              flex: 1,
                              padding: "10px 14px",
                              borderRadius: "8px",
                              border: "1px solid #ccc",
                              fontSize: "15px",
                              color: "#333",
                              outline: "none",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                              transition: "all 0.2s ease",
                            }}
                            onFocus={(e) => (e.target.style.border = "1px solid #4a90e2")}
                            onBlur={(e) => (e.target.style.border = "1px solid #ccc")}
                          />

                          {/* Select dropdown */}
                          <select
                            value={plotAreaUnit}
                            onChange={(e) => setPlotAreaUnit(e.target.value)}
                            style={{
                              padding: "10px 14px",
                              borderRadius: "8px",
                              border: "1px solid #ccc",
                              fontSize: "15px",
                              color: "#333",
                              backgroundColor: "#fff",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                              outline: "none",
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              height: "48px"
                            }}
                            onFocus={(e) => (e.target.style.border = "1px solid #4a90e2")}
                            onBlur={(e) => (e.target.style.border = "1px solid #ccc")}
                          >
                            <option value="sqft">Sq.ft</option>
                            <option value="sqyards">Sq.yards</option>
                            <option value="sqm">Sq.m</option>
                            <option value="acres">Acres</option>
                            <option value="Marla">Marla</option>
                            <option value="Cents">Cents</option>
                          </select>
                        </div>
                      </div>

                      {/* Property Dimensions */}
                      <div className="step3-section">
                        <label className="step3-label">
                          Property Dimensions <span className="step3-optional">(Optional)</span>
                        </label>
                        <input
                          type="number"
                          placeholder="Length of plot (in Yard)"
                          value={plotLength}
                          onChange={(e) => setPlotLength(e.target.value)}
                          className="step3-input"
                          style={{ marginBottom: "10px" }}
                        />
                        <input
                          type="number"
                          placeholder="Breadth of plot (in Yard)"
                          value={plotBreadth}
                          onChange={(e) => setPlotBreadth(e.target.value)}
                          className="step3-input"
                        />
                      </div>

                      {/* Width of facing road */}
                      <div className="step3-section">
                        <label className="step3-label">Width of facing road </label>
                        <div className="step3-input-group">
                          <input
                            type="number"
                            placeholder="Enter the width"
                            value={roadWidth}
                            onChange={(e) => setRoadWidth(e.target.value)}
                            className="step3-input"
                          />
                          <div
                            className="step3-unit-selector"
                            onClick={() => setShowRoadUnit((p) => !p)}
                          >
                            {roadUnit || "Select"} <span className="step3-dropdown-icon">▼</span>
                          </div>

                          {showRoadUnit && (
                            <div className="step3-unit-dropdown">
                              {["Feet", "Meter"].map((u) => (
                                <div
                                  key={u}
                                  onClick={() => {
                                    setRoadUnit(u);
                                    setShowRoadUnit(false);
                                  }}
                                  className="step3-unit-option"
                                >
                                  {u}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* No. of open sides */}
                      <div className="step3-section">
                        <label className="step3-label">No. of open sides</label>
                        <div className="button-group">
                          {["1", "2", "3", "3+"].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              className={`subproperty-option ${openSides === opt ? "active" : ""}`}
                              onClick={() => setOpenSides(opt)}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>


                      {/* Existing Construction */}
                      <div className="step3-section">
                        <label className="step3-label">
                          Any construction done on this property?
                        </label>
                        <div className="step3-button-group">
                          <button
                            type="button"
                            onClick={() => setHasConstruction(true)}
                            className={`step3-option-btn ${hasConstruction ? 'active' : ''}`}
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => setHasConstruction(false)}
                            className={`step3-option-btn ${hasConstruction === false ? 'active' : ''}`}
                          >
                            No
                          </button>
                        </div>
                      </div>

                      {/* Construction Type (if hasConstruction is true) */}
                      {hasConstruction && (
                        <div className="step3-section">
                          <label className="step3-label">
                            What type of construction has been done?
                          </label>
                          <div className="step3-button-group">
                            {['Shed', 'Rooms', 'Washroom', 'Other'].map((type) => (
                              <button
                                key={type}
                                type="button"
                                onClick={() => {
                                  if (constructionTypes.includes(type)) {
                                    setConstructionTypes(constructionTypes.filter(t => t !== type));
                                  } else {
                                    setConstructionTypes([...constructionTypes, type]);
                                  }
                                }}
                                className={`step3-option-btn ${constructionTypes.includes(type) ? 'active' : ''}`}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}


                      {/* Property facing */}
                      <div className="step3-section">
                        <label className="step3-label">Property facing</label>
                        <div className="button-group">
                          {[
                            "North",
                            "South",
                            "East",
                            "West",
                            "North-East",
                            "North-West",
                            "South-East",
                            "South-West",
                          ].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              className={`subproperty-option ${propertyFacing === opt ? "active" : ""}`}
                              onClick={() => setPropertyFacing(opt)}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>


                      {/* Possession By */}
                      <div className="step3-section">
                        <label className="step3-label">Possession By</label>
                        <select
                          value={possessionBy}
                          onChange={(e) => setPossessionBy(e.target.value)}
                          className="step3-input"
                        >
                          <option value="" hidden>Expected time</option>
                          <option value="Immediate">Immediate</option>
                          <option value="Within 3 Months">Within 3 Months</option>
                          <option value="Within 6 Months">Within 6 Months</option>
                          <option value="By 2026">By 2026</option>
                          <option value="By 2027">By 2027</option>
                          <option value="By 2028">By 2028</option>
                          <option value="By 2029">By 2029</option>

                        </select>
                      </div>


                    </>
                  )}

                {propertyType === "Commercial" &&
                  subPropertyType === "Storage" &&
                  (subPropertyQuestionOption === "Ware House" ||
                    subPropertyQuestionOption === "Cold Storage") && (
                    <>
                      {/* Washrooms */}
                      <div className="step3-section">
                        <label className="step3-label">Washrooms</label>
                        <div className="button-group">
                          {["None", "Shared", "1", "2", "3", "4"].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              className={`subproperty-option ${washroomBare === opt ? "active" : ""}`}
                              onClick={() => setWashroomBare(opt)}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                      {/* Area Details */}
                      <div
                        className="mb-3"
                      >
                        {/* Header */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "8px",
                          }}
                        >
                          <label style={{ fontSize: "16px", fontWeight: 600, color: "#333" }}>
                            Add Area Details
                          </label>

                        </div>

                        <p style={{ fontSize: "13px", color: "#888", marginBottom: "16px" }}>
                          At least one area type is mandatory
                        </p>

                        {/* Carpet Area */}
                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            marginBottom: "16px",
                            position: "relative",
                          }}
                        >
                          <input
                            type="number"
                            placeholder="Carpet Area"
                            value={carpetArea}
                            onChange={(e) => setCarpetArea(e.target.value)}
                            style={{
                              flex: 1,
                              padding: "12px",
                              borderRadius: "8px",
                              border: "1px solid #ccc",
                              fontSize: "14px",
                            }}
                          />
                          <div
                            style={{
                              minWidth: "100px",
                              padding: "12px",
                              border: "1px solid #ccc",
                              borderRadius: "8px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              cursor: "pointer",
                              background: "#f9f9f9",
                            }}
                            onClick={() => setShowCarpetUnits((p) => !p)}
                          >
                            {carpetUnit || "Unit"} <span style={{ fontSize: "12px" }}>▼</span>
                          </div>

                          {showCarpetUnits && (
                            <div
                              style={{
                                position: "absolute",
                                top: "110%",
                                right: "0",
                                background: "#fff",
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                zIndex: 10,
                                width: "120px",
                              }}
                            >
                              {UNIT_OPTIONS.map((u) => (
                                <div
                                  key={u}
                                  onClick={() => {
                                    setCarpetUnit(u);
                                    setBuiltUpUnit(u); // sync
                                    setShowCarpetUnits(false);
                                  }}
                                  style={{
                                    padding: "10px",
                                    cursor: "pointer",
                                    background: carpetUnit === u ? "#ED2027" : "#fff",
                                    color: carpetUnit === u ? "#fff" : "#333",
                                    borderBottom: "1px solid #eee",
                                  }}
                                >
                                  {u}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Validation */}
                        {carpetArea && builtUpArea && Number(carpetArea) >= Number(builtUpArea) && (
                          <p style={{ color: "red", fontSize: "13px", marginBottom: "12px" }}>
                            Carpet area must be smaller than built-up area
                          </p>
                        )}

                        {/* Built-up Area */}
                        {!showBuiltUpArea ? (
                          <button
                            type="button"
                            onClick={() => setShowBuiltUpArea(true)}
                            style={{
                              background: "transparent",
                              border: "1px dashed #ED2027",
                              color: "#ED2027",
                              padding: "10px 14px",
                              borderRadius: "8px",
                              cursor: "pointer",
                              fontWeight: "500",
                              marginTop: "10px",
                            }}
                          >
                            + Add Built-up Area
                          </button>
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                              marginTop: "16px",
                              position: "relative",
                            }}
                          >
                            <input
                              type="number"
                              placeholder="Built-up Area"
                              value={builtUpArea}
                              onChange={(e) => setBuiltUpArea(e.target.value)}
                              style={{
                                flex: 1,
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid #ccc",
                                fontSize: "14px",
                              }}
                            />
                            <div
                              style={{
                                minWidth: "100px",
                                padding: "12px",
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                cursor: "pointer",
                                background: "#f9f9f9",
                              }}
                              onClick={() => setShowBuiltUpUnits((p) => !p)}
                            >
                              {builtUpUnit || "Unit"} <span style={{ fontSize: "12px" }}>▼</span>
                            </div>

                            {showBuiltUpUnits && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: "110%",
                                  right: "0",
                                  background: "#fff",
                                  border: "1px solid #ddd",
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                  zIndex: 10,
                                  width: "120px",
                                }}
                              >
                                {UNIT_OPTIONS.map((u) => (
                                  <div
                                    key={u}
                                    onClick={() => {
                                      setBuiltUpUnit(u);
                                      setCarpetUnit(u); // sync
                                      setShowBuiltUpUnits(false);
                                    }}
                                    style={{
                                      padding: "10px",
                                      cursor: "pointer",
                                      background: builtUpUnit === u ? "#ED2027" : "#fff",
                                      color: builtUpUnit === u ? "#fff" : "#333",
                                      borderBottom: "1px solid #eee",
                                    }}
                                  >
                                    {u}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Availability Status */}
                      <div className="step3-section">
                        <label className="step3-label">
                          Availability Status
                        </label>
                        <div className="step3-button-group">
                          {["Ready to Move", "Under Construction"].map((status) => (
                            <button
                              key={status}
                              type="button"
                              onClick={() => setAvailabilityStatus(status)}
                              className={`step3-option-btn ${availabilityStatus === status ? 'active' : ''}`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Age of property if Ready to Move */}
                      {availabilityStatus === "Ready to Move" && (
                        <div className="step3-section">
                          <label className="step3-label">
                            Age of property
                          </label>
                          <div className="step3-button-group">
                            {["0-1 years", "1-5 years", "5-10 years", "10+ years"].map((age) => (
                              <button
                                key={age}
                                type="button"
                                onClick={() => setAgeOfProperty(age)}
                                className={`step3-option-btn ${ageOfProperty === age ? 'active' : ''}`}
                              >
                                {age}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Possession By if Under Construction */}
                      {availabilityStatus === "Under Construction" && (
                        <div className="step3-section">
                          <label className="step3-label">Possession By</label>
                          <select
                            value={possessionBy}
                            onChange={(e) => setPossessionBy(e.target.value)}
                            className="step3-input"
                          >
                            <option value="" hidden>Expected time</option>
                            <option value="Within 3 Months">Within 3 Months</option>
                            <option value="Within 6 Months">Within 6 Months</option>
                            <option value="By 2026">By 2026</option>
                            <option value="By 2027">By 2027</option>
                            <option value="By 2028">By 2028</option>
                            <option value="By 2029">By 2029</option>
                            <option value="By 2030">By 2030</option>
                          </select>
                        </div>
                      )}



                    </>
                  )}

                {propertyType === "Commercial" &&
                  subPropertyType === "Industry" &&
                  (subPropertyQuestionOption === "Factory" ||
                    subPropertyQuestionOption === "Manufacturing") && (
                    <>
                      {/* Washrooms */}
                      <div className="step3-section">
                        <label className="step3-label">Washrooms</label>
                        <div className="button-group">
                          {["None", "Shared", "1", "2", "3", "4"].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              className={`subproperty-option ${washroomBare === opt ? "active" : ""}`}
                              onClick={() => setWashroomBare(opt)}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>


                      {/* Availability Status */}
                      <div className="step3-section">
                        <label className="step3-label">
                          Availability Status
                        </label>
                        <div className="step3-button-group">
                          {["Ready to Move", "Under Construction"].map((status) => (
                            <button
                              key={status}
                              type="button"
                              onClick={() => setAvailabilityStatus(status)}
                              className={`step3-option-btn ${availabilityStatus === status ? 'active' : ''}`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Age of property if Ready to Move */}
                      {availabilityStatus === "Ready to Move" && (
                        <div className="step3-section">
                          <label className="step3-label">
                            Age of property
                          </label>
                          <div className="step3-button-group">
                            {["0-1 years", "1-5 years", "5-10 years", "10+ years"].map((age) => (
                              <button
                                key={age}
                                type="button"
                                onClick={() => setAgeOfProperty(age)}
                                className={`step3-option-btn ${ageOfProperty === age ? 'active' : ''}`}
                              >
                                {age}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Possession By if Under Construction */}
                      {availabilityStatus === "Under Construction" && (
                        <div className="step3-section">
                          <label className="step3-label">Possession By</label>
                          <select
                            value={possessionBy}
                            onChange={(e) => setPossessionBy(e.target.value)}
                            className="step3-input"
                          >
                            <option value="" hidden>Expected time</option>
                            <option value="Within 3 Months">Within 3 Months</option>
                            <option value="Within 6 Months">Within 6 Months</option>
                            <option value="By 2026">By 2026</option>
                            <option value="By 2027">By 2027</option>
                            <option value="By 2028">By 2028</option>
                            <option value="By 2029">By 2029</option>
                            <option value="By 2030">By 2030</option>
                          </select>
                        </div>
                      )}



                    </>
                  )}


                {propertyType === "Commercial" &&
                  subPropertyType === "Hospitality" &&
                  (subPropertyQuestionOption === "Hotel / Resorts" ||
                    subPropertyQuestionOption === "Guest-House / Banquet Hall") && (
                    <>
                      {/* Add Room Details */}
                      <div className="step3-section">
                        <label className="step3-label">Add Room Details</label>
                        <input
                          type="number"
                          placeholder="Enter the total no. of rooms"
                          value={totalRooms}
                          onChange={(e) => setTotalRooms(e.target.value)}
                          className="step3-input"
                          style={{ marginBottom: "12px" }}
                        />

                        <label className="step3-label" style={{ marginTop: "8px" }}>No. of Washrooms</label>
                        <div className="button-group">
                          {["None", "Shared", "1", "2", "3", "4"].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              className={`subproperty-option ${hospitalityWash === opt ? "active" : ""}`}
                              onClick={() => setHospitalityWash(opt)}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Availability Status */}
                      <div className="step3-section">
                        <label className="step3-label">
                          Availability Status
                        </label>
                        <div className="step3-button-group">
                          {["Ready to Move", "Under Construction"].map((status) => (
                            <button
                              key={status}
                              type="button"
                              onClick={() => setAvailabilityStatus(status)}
                              className={`step3-option-btn ${availabilityStatus === status ? 'active' : ''}`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Age of property if Ready to Move */}
                      {availabilityStatus === "Ready to Move" && (
                        <div className="step3-section">
                          <label className="step3-label">
                            Age of property
                          </label>
                          <div className="step3-button-group">
                            {["0-1 years", "1-5 years", "5-10 years", "10+ years"].map((age) => (
                              <button
                                key={age}
                                type="button"
                                onClick={() => setAgeOfProperty(age)}
                                className={`step3-option-btn ${ageOfProperty === age ? 'active' : ''}`}
                              >
                                {age}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Possession By if Under Construction */}
                      {availabilityStatus === "Under Construction" && (
                        <div className="step3-section">
                          <label className="step3-label">Possession By</label>
                          <select
                            value={possessionBy}
                            onChange={(e) => setPossessionBy(e.target.value)}
                            className="step3-input"
                          >
                            <option value="" hidden>Expected time</option>
                            <option value="Within 3 Months">Within 3 Months</option>
                            <option value="Within 6 Months">Within 6 Months</option>
                            <option value="By 2026">By 2026</option>
                            <option value="By 2027">By 2027</option>
                            <option value="By 2028">By 2028</option>
                            <option value="By 2029">By 2029</option>
                            <option value="By 2030">By 2030</option>
                          </select>
                        </div>
                      )}

                      {/* Quality Rating */}
                      <div className="step3-section">
                        <label className="step3-label">Quality Rating</label>
                        <div className="button-group">
                          {["No Rating", "1 Star", "2 Star", "3 Star", "4 Star", "5 Star", "6 Star", "7 Star"].map((rate) => (
                            <button
                              key={rate}
                              type="button"
                              className={`subproperty-option ${qualityRating === rate ? "active" : ""}`}
                              onClick={() => setQualityRating(rate)}
                            >
                              {rate}
                            </button>
                          ))}
                        </div>
                      </div>


                    </>
                  )}

                {propertyType === "Commercial" &&
                  (subPropertyType === "Others") && (
                    <>
                      {/* Area Details */}
                      <div
                        className="mb-3"
                      >
                        {/* Header */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "8px",
                          }}
                        >
                          <label style={{ fontSize: "16px", fontWeight: 600, color: "#333" }}>
                            Add Area Details
                          </label>

                        </div>

                        <p style={{ fontSize: "13px", color: "#888", marginBottom: "16px" }}>
                          At least one area type is mandatory
                        </p>

                        {/* Carpet Area */}
                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            marginBottom: "16px",
                            position: "relative",
                          }}
                        >
                          <input
                            type="number"
                            placeholder="Carpet Area"
                            value={carpetArea}
                            onChange={(e) => setCarpetArea(e.target.value)}
                            style={{
                              flex: 1,
                              padding: "12px",
                              borderRadius: "8px",
                              border: "1px solid #ccc",
                              fontSize: "14px",
                            }}
                          />
                          <div
                            style={{
                              minWidth: "100px",
                              padding: "12px",
                              border: "1px solid #ccc",
                              borderRadius: "8px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              cursor: "pointer",
                              background: "#f9f9f9",
                            }}
                            onClick={() => setShowCarpetUnits((p) => !p)}
                          >
                            {carpetUnit || "Unit"} <span style={{ fontSize: "12px" }}>▼</span>
                          </div>

                          {showCarpetUnits && (
                            <div
                              style={{
                                position: "absolute",
                                top: "110%",
                                right: "0",
                                background: "#fff",
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                zIndex: 10,
                                width: "120px",
                              }}
                            >
                              {UNIT_OPTIONS.map((u) => (
                                <div
                                  key={u}
                                  onClick={() => {
                                    setCarpetUnit(u);
                                    setBuiltUpUnit(u); // sync
                                    setShowCarpetUnits(false);
                                  }}
                                  style={{
                                    padding: "10px",
                                    cursor: "pointer",
                                    background: carpetUnit === u ? "#ED2027" : "#fff",
                                    color: carpetUnit === u ? "#fff" : "#333",
                                    borderBottom: "1px solid #eee",
                                  }}
                                >
                                  {u}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Validation */}
                        {carpetArea && builtUpArea && Number(carpetArea) >= Number(builtUpArea) && (
                          <p style={{ color: "red", fontSize: "13px", marginBottom: "12px" }}>
                            Carpet area must be smaller than built-up area
                          </p>
                        )}

                        {/* Built-up Area */}
                        {!showBuiltUpArea ? (
                          <button
                            type="button"
                            onClick={() => setShowBuiltUpArea(true)}
                            style={{
                              background: "transparent",
                              border: "1px dashed #ED2027",
                              color: "#ED2027",
                              padding: "10px 14px",
                              borderRadius: "8px",
                              cursor: "pointer",
                              fontWeight: "500",
                              marginTop: "10px",
                            }}
                          >
                            + Add Built-up Area
                          </button>
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                              marginTop: "16px",
                              position: "relative",
                            }}
                          >
                            <input
                              type="number"
                              placeholder="Built-up Area"
                              value={builtUpArea}
                              onChange={(e) => setBuiltUpArea(e.target.value)}
                              style={{
                                flex: 1,
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid #ccc",
                                fontSize: "14px",
                              }}
                            />
                            <div
                              style={{
                                minWidth: "100px",
                                padding: "12px",
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                cursor: "pointer",
                                background: "#f9f9f9",
                              }}
                              onClick={() => setShowBuiltUpUnits((p) => !p)}
                            >
                              {builtUpUnit || "Unit"} <span style={{ fontSize: "12px" }}>▼</span>
                            </div>

                            {showBuiltUpUnits && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: "110%",
                                  right: "0",
                                  background: "#fff",
                                  border: "1px solid #ddd",
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                  zIndex: 10,
                                  width: "120px",
                                }}
                              >
                                {UNIT_OPTIONS.map((u) => (
                                  <div
                                    key={u}
                                    onClick={() => {
                                      setBuiltUpUnit(u);
                                      setCarpetUnit(u); // sync
                                      setShowBuiltUpUnits(false);
                                    }}
                                    style={{
                                      padding: "10px",
                                      cursor: "pointer",
                                      background: builtUpUnit === u ? "#ED2027" : "#fff",
                                      color: builtUpUnit === u ? "#fff" : "#333",
                                      borderBottom: "1px solid #eee",
                                    }}
                                  >
                                    {u}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Possession By */}
                      <div className="step3-section">
                        <label className="step3-label">Possession By</label>
                        <select
                          value={possessionBy}
                          onChange={(e) => setPossessionBy(e.target.value)}
                          className="step3-input"
                        >
                          <option value="" hidden>Expected time</option>
                          <option value="Immediate">Immediate</option>
                          <option value="Within 3 Months">Within 3 Months</option>
                          <option value="Within 6 Months">Within 6 Months</option>
                          <option value="By 2026">By 2026</option>
                          <option value="By 2027">By 2027</option>
                          <option value="By 2028">By 2028</option>
                          <option value="By 2029">By 2029</option>

                        </select>
                      </div>


                    </>
                  )}



                {(subPropertyType.includes("Flat / Apartment") || subPropertyType.includes("Independent House / Villa") || subPropertyType.includes("1 RK / Studio Apartment") || subPropertyType.includes("Farmhouse")) && (
                  <>

                    {listingType === "Joint Venture" && propertyType === "Residential" && (
                      <>
                        <div
                          className="mb-3"
                        >
                          {/* Header */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginBottom: "8px",
                            }}
                          >
                            <label style={{ fontSize: "16px", fontWeight: 600, color: "#333" }}>
                              Add Area Details
                            </label>

                          </div>

                          <p style={{ fontSize: "13px", color: "#888", marginBottom: "16px" }}>
                            At least one area type is mandatory
                          </p>

                          {/* Carpet Area */}
                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                              marginBottom: "16px",
                              position: "relative",
                            }}
                          >
                            <input
                              type="number"
                              placeholder="Carpet Area"
                              value={carpetArea}
                              onChange={(e) => setCarpetArea(e.target.value)}
                              style={{
                                flex: 1,
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid #ccc",
                                fontSize: "14px",
                              }}
                            />
                            <div
                              style={{
                                minWidth: "100px",
                                padding: "12px",
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                cursor: "pointer",
                                background: "#f9f9f9",
                              }}
                              onClick={() => setShowCarpetUnits((p) => !p)}
                            >
                              {carpetUnit || "Unit"} <span style={{ fontSize: "12px" }}>▼</span>
                            </div>

                            {showCarpetUnits && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: "110%",
                                  right: "0",
                                  background: "#fff",
                                  border: "1px solid #ddd",
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                  zIndex: 10,
                                  width: "120px",
                                }}
                              >
                                {UNIT_OPTIONS.map((u) => (
                                  <div
                                    key={u}
                                    onClick={() => {
                                      setCarpetUnit(u);
                                      setBuiltUpUnit(u); // sync
                                      setShowCarpetUnits(false);
                                    }}
                                    style={{
                                      padding: "10px",
                                      cursor: "pointer",
                                      background: carpetUnit === u ? "#ED2027" : "#fff",
                                      color: carpetUnit === u ? "#fff" : "#333",
                                      borderBottom: "1px solid #eee",
                                    }}
                                  >
                                    {u}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Validation */}
                          {carpetArea && builtUpArea && Number(carpetArea) >= Number(builtUpArea) && (
                            <p style={{ color: "red", fontSize: "13px", marginBottom: "12px" }}>
                              Carpet area must be smaller than built-up area
                            </p>
                          )}

                          {/* Built-up Area */}
                          {!showBuiltUpArea ? (
                            <button
                              type="button"
                              onClick={() => setShowBuiltUpArea(true)}
                              style={{
                                background: "transparent",
                                border: "1px dashed #ED2027",
                                color: "#ED2027",
                                padding: "10px 14px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontWeight: "500",
                                marginTop: "10px",
                              }}
                            >
                              + Add Built-up Area
                            </button>
                          ) : (
                            <div
                              style={{
                                display: "flex",
                                gap: "10px",
                                marginTop: "16px",
                                position: "relative",
                              }}
                            >
                              <input
                                type="number"
                                placeholder="Built-up Area"
                                value={builtUpArea}
                                onChange={(e) => setBuiltUpArea(e.target.value)}
                                style={{
                                  flex: 1,
                                  padding: "12px",
                                  borderRadius: "8px",
                                  border: "1px solid #ccc",
                                  fontSize: "14px",
                                }}
                              />
                              <div
                                style={{
                                  minWidth: "100px",
                                  padding: "12px",
                                  border: "1px solid #ccc",
                                  borderRadius: "8px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  cursor: "pointer",
                                  background: "#f9f9f9",
                                }}
                                onClick={() => setShowBuiltUpUnits((p) => !p)}
                              >
                                {builtUpUnit || "Unit"} <span style={{ fontSize: "12px" }}>▼</span>
                              </div>

                              {showBuiltUpUnits && (
                                <div
                                  style={{
                                    position: "absolute",
                                    top: "110%",
                                    right: "0",
                                    background: "#fff",
                                    border: "1px solid #ddd",
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                    zIndex: 10,
                                    width: "120px",
                                  }}
                                >
                                  {UNIT_OPTIONS.map((u) => (
                                    <div
                                      key={u}
                                      onClick={() => {
                                        setBuiltUpUnit(u);
                                        setCarpetUnit(u); // sync
                                        setShowBuiltUpUnits(false);
                                      }}
                                      style={{
                                        padding: "10px",
                                        cursor: "pointer",
                                        background: builtUpUnit === u ? "#ED2027" : "#fff",
                                        color: builtUpUnit === u ? "#fff" : "#333",
                                        borderBottom: "1px solid #eee",
                                      }}
                                    >
                                      {u}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="step3-label">
                            Joint Venture Percentage
                          </label>

                          <div style={{ gap: "15px", width: "400px" }}>
                            {/* Owner Percentage Input */}
                            <div>
                              <label style={{ display: "block", marginBottom: "5px" }}>
                                Owner Percentage
                              </label>
                              <input
                                type="number"
                                value={ownerPercentage}
                                onChange={handleOwnerPercentageChange}
                                placeholder="Enter owner %"
                                style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                              />
                            </div>

                            {/* Developer Percentage Input */}
                            <div>
                              <label style={{ display: "block", marginBottom: "5px", marginTop: "20px" }}>
                                Developer Percentage
                              </label>
                              <input
                                type="number"
                                value={developerPercentage}
                                onChange={handleDeveloperPercentageChange}
                                placeholder="Enter developer %"
                                style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                              />
                            </div>
                          </div>
                        </div>




                      </>
                    )}


                  </>
                )}

                {(subPropertyType.includes("Office") || subPropertyType.includes("Retail") || subPropertyType.includes("Industry") || subPropertyType.includes("Hospitality")) && (
                  <>
                    {listingType === "Joint Venture" && propertyType === "Commercial" && (
                      <>
                        <div
                          className="mb-3"
                        >
                          {/* Header */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginBottom: "8px",
                            }}
                          >
                            <label style={{ fontSize: "16px", fontWeight: 600, color: "#333" }}>
                              Add Area Details
                            </label>

                          </div>

                          <p style={{ fontSize: "13px", color: "#888", marginBottom: "16px" }}>
                            At least one area type is mandatory
                          </p>

                          {/* Carpet Area */}
                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                              marginBottom: "16px",
                              position: "relative",
                            }}
                          >
                            <input
                              type="number"
                              placeholder="Carpet Area"
                              value={carpetArea}
                              onChange={(e) => setCarpetArea(e.target.value)}
                              style={{
                                flex: 1,
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid #ccc",
                                fontSize: "14px",
                              }}
                            />
                            <div
                              style={{
                                minWidth: "100px",
                                padding: "12px",
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                cursor: "pointer",
                                background: "#f9f9f9",
                              }}
                              onClick={() => setShowCarpetUnits((p) => !p)}
                            >
                              {carpetUnit || "Unit"} <span style={{ fontSize: "12px" }}>▼</span>
                            </div>

                            {showCarpetUnits && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: "110%",
                                  right: "0",
                                  background: "#fff",
                                  border: "1px solid #ddd",
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                  zIndex: 10,
                                  width: "120px",
                                }}
                              >
                                {UNIT_OPTIONS.map((u) => (
                                  <div
                                    key={u}
                                    onClick={() => {
                                      setCarpetUnit(u);
                                      setBuiltUpUnit(u); // sync
                                      setShowCarpetUnits(false);
                                    }}
                                    style={{
                                      padding: "10px",
                                      cursor: "pointer",
                                      background: carpetUnit === u ? "#ED2027" : "#fff",
                                      color: carpetUnit === u ? "#fff" : "#333",
                                      borderBottom: "1px solid #eee",
                                    }}
                                  >
                                    {u}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Validation */}
                          {carpetArea && builtUpArea && Number(carpetArea) >= Number(builtUpArea) && (
                            <p style={{ color: "red", fontSize: "13px", marginBottom: "12px" }}>
                              Carpet area must be smaller than built-up area
                            </p>
                          )}

                          {/* Built-up Area */}
                          {!showBuiltUpArea ? (
                            <button
                              type="button"
                              onClick={() => setShowBuiltUpArea(true)}
                              style={{
                                background: "transparent",
                                border: "1px dashed #ED2027",
                                color: "#ED2027",
                                padding: "10px 14px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontWeight: "500",
                                marginTop: "10px",
                              }}
                            >
                              + Add Built-up Area
                            </button>
                          ) : (
                            <div
                              style={{
                                display: "flex",
                                gap: "10px",
                                marginTop: "16px",
                                position: "relative",
                              }}
                            >
                              <input
                                type="number"
                                placeholder="Built-up Area"
                                value={builtUpArea}
                                onChange={(e) => setBuiltUpArea(e.target.value)}
                                style={{
                                  flex: 1,
                                  padding: "12px",
                                  borderRadius: "8px",
                                  border: "1px solid #ccc",
                                  fontSize: "14px",
                                }}
                              />
                              <div
                                style={{
                                  minWidth: "100px",
                                  padding: "12px",
                                  border: "1px solid #ccc",
                                  borderRadius: "8px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  cursor: "pointer",
                                  background: "#f9f9f9",
                                }}
                                onClick={() => setShowBuiltUpUnits((p) => !p)}
                              >
                                {builtUpUnit || "Unit"} <span style={{ fontSize: "12px" }}>▼</span>
                              </div>

                              {showBuiltUpUnits && (
                                <div
                                  style={{
                                    position: "absolute",
                                    top: "110%",
                                    right: "0",
                                    background: "#fff",
                                    border: "1px solid #ddd",
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                    zIndex: 10,
                                    width: "120px",
                                  }}
                                >
                                  {UNIT_OPTIONS.map((u) => (
                                    <div
                                      key={u}
                                      onClick={() => {
                                        setBuiltUpUnit(u);
                                        setCarpetUnit(u); // sync
                                        setShowBuiltUpUnits(false);
                                      }}
                                      style={{
                                        padding: "10px",
                                        cursor: "pointer",
                                        background: builtUpUnit === u ? "#ED2027" : "#fff",
                                        color: builtUpUnit === u ? "#fff" : "#333",
                                        borderBottom: "1px solid #eee",
                                      }}
                                    >
                                      {u}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>


                        <div>
                          <label className="step3-label">
                            Joint Venture Percentage
                          </label>

                          <div style={{ gap: "15px", width: "400px" }}>
                            {/* Owner Percentage Input */}
                            <div>
                              <label style={{ display: "block", marginBottom: "5px" }}>
                                Owner Percentage
                              </label>
                              <input
                                type="number"
                                value={ownerPercentage}
                                onChange={handleOwnerPercentageChange}
                                placeholder="Enter owner %"
                                style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                              />
                            </div>

                            {/* Developer Percentage Input */}
                            <div>
                              <label style={{ display: "block", marginBottom: "5px", marginTop: "20px" }}>
                                Developer Percentage
                              </label>
                              <input
                                type="number"
                                value={developerPercentage}
                                onChange={handleDeveloperPercentageChange}
                                placeholder="Enter developer %"
                                style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                              />
                            </div>
                          </div>
                        </div>

                      </>
                    )}
                  </>
                )}


                {listingType === "Joint Venture" && propertyType === "Layout/Land development" && (
                  <>
                    <div
                      className="mb-3"
                    >
                      {/* Header */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                        }}
                      >
                        <label style={{ fontSize: "16px", fontWeight: 600, color: "#333" }}>
                          Add Area Details
                        </label>

                      </div>

                      <p style={{ fontSize: "13px", color: "#888", marginBottom: "16px" }}>
                        At least one area type is mandatory
                      </p>

                      {/* Carpet Area */}
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          marginBottom: "16px",
                          position: "relative",
                        }}
                      >
                        <input
                          type="number"
                          placeholder="Carpet Area"
                          value={carpetArea}
                          onChange={(e) => setCarpetArea(e.target.value)}
                          style={{
                            flex: 1,
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            fontSize: "14px",
                          }}
                        />
                        <div
                          style={{
                            minWidth: "100px",
                            padding: "12px",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            cursor: "pointer",
                            background: "#f9f9f9",
                          }}
                          onClick={() => setShowCarpetUnits((p) => !p)}
                        >
                          {carpetUnit || "Unit"} <span style={{ fontSize: "12px" }}>▼</span>
                        </div>

                        {showCarpetUnits && (
                          <div
                            style={{
                              position: "absolute",
                              top: "110%",
                              right: "0",
                              background: "#fff",
                              border: "1px solid #ddd",
                              borderRadius: "8px",
                              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                              zIndex: 10,
                              width: "120px",
                            }}
                          >
                            {UNIT_OPTIONS.map((u) => (
                              <div
                                key={u}
                                onClick={() => {
                                  setCarpetUnit(u);
                                  setBuiltUpUnit(u); // sync
                                  setShowCarpetUnits(false);
                                }}
                                style={{
                                  padding: "10px",
                                  cursor: "pointer",
                                  background: carpetUnit === u ? "#ED2027" : "#fff",
                                  color: carpetUnit === u ? "#fff" : "#333",
                                  borderBottom: "1px solid #eee",
                                }}
                              >
                                {u}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Validation */}
                      {carpetArea && builtUpArea && Number(carpetArea) >= Number(builtUpArea) && (
                        <p style={{ color: "red", fontSize: "13px", marginBottom: "12px" }}>
                          Carpet area must be smaller than built-up area
                        </p>
                      )}

                      {/* Built-up Area */}
                      {!showBuiltUpArea ? (
                        <button
                          type="button"
                          onClick={() => setShowBuiltUpArea(true)}
                          style={{
                            background: "transparent",
                            border: "1px dashed #ED2027",
                            color: "#ED2027",
                            padding: "10px 14px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "500",
                            marginTop: "10px",
                          }}
                        >
                          + Add Built-up Area
                        </button>
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            marginTop: "16px",
                            position: "relative",
                          }}
                        >
                          <input
                            type="number"
                            placeholder="Built-up Area"
                            value={builtUpArea}
                            onChange={(e) => setBuiltUpArea(e.target.value)}
                            style={{
                              flex: 1,
                              padding: "12px",
                              borderRadius: "8px",
                              border: "1px solid #ccc",
                              fontSize: "14px",
                            }}
                          />
                          <div
                            style={{
                              minWidth: "100px",
                              padding: "12px",
                              border: "1px solid #ccc",
                              borderRadius: "8px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              cursor: "pointer",
                              background: "#f9f9f9",
                            }}
                            onClick={() => setShowBuiltUpUnits((p) => !p)}
                          >
                            {builtUpUnit || "Unit"} <span style={{ fontSize: "12px" }}>▼</span>
                          </div>

                          {showBuiltUpUnits && (
                            <div
                              style={{
                                position: "absolute",
                                top: "110%",
                                right: "0",
                                background: "#fff",
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                zIndex: 10,
                                width: "120px",
                              }}
                            >
                              {UNIT_OPTIONS.map((u) => (
                                <div
                                  key={u}
                                  onClick={() => {
                                    setBuiltUpUnit(u);
                                    setCarpetUnit(u); // sync
                                    setShowBuiltUpUnits(false);
                                  }}
                                  style={{
                                    padding: "10px",
                                    cursor: "pointer",
                                    background: builtUpUnit === u ? "#ED2027" : "#fff",
                                    color: builtUpUnit === u ? "#fff" : "#333",
                                    borderBottom: "1px solid #eee",
                                  }}
                                >
                                  {u}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>


                    <div>
                      <label className="step3-label">
                        Joint Venture Percentage
                      </label>

                      <div style={{ gap: "15px", width: "400px" }}>
                        {/* Owner Percentage Input */}
                        <div>
                          <label style={{ display: "block", marginBottom: "5px" }}>
                            Owner Percentage
                          </label>
                          <input
                            type="number"
                            value={ownerPercentage}
                            onChange={handleOwnerPercentageChange}
                            placeholder="Enter owner %"
                            style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                          />
                        </div>

                        {/* Developer Percentage Input */}
                        <div>
                          <label style={{ display: "block", marginBottom: "5px", marginTop: "20px" }}>
                            Developer Percentage
                          </label>
                          <input
                            type="number"
                            value={developerPercentage}
                            onChange={handleDeveloperPercentageChange}
                            placeholder="Enter developer %"
                            style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                          />
                        </div>
                      </div>
                    </div>

                  </>
                )}

                <div className="step3-continue-container">
                  <button
                    onClick={() => {
                      handleUpdate3();   // ✅ call first
                      setCurrentStep(4); // ✅ then go to step 4
                    }}
                    className="step3-continue-btn"
                  >
                    Continue
                  </button>

                </div>
              </div>
            )}

            {/* Step 4 - Photos, Videos & Voice-over */}

            {currentStep === 4 && (
              <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: "24px" }}>
                <h4 style={{ fontSize: "24px", fontWeight: "600", color: "#333", margin: "0" }}>
                  Photos, Videos & Voice-over
                </h4>

                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {sections.map((section, index) => (
                    <div
                      key={index}
                      style={{
                        border: "1px solid #e1e5e9",
                        padding: "24px",
                        borderRadius: "12px",
                        background: "#fff",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                      }}
                    >
                      {/* Section Header */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <select
                          value={section.type}
                          onChange={(e) => {
                            const newSections = [...sections];
                            newSections[index].type = e.target.value;
                            setSections(newSections);
                          }}
                          style={{
                            padding: "12px 16px",
                            borderRadius: "8px",
                            border: "1px solid #d0d5dd",
                            background: "#fff",
                            fontSize: "14px",
                            color: "#344054",
                            minWidth: "200px",
                          }}
                        >
                          <option value="Plan">Plan</option>
                          <option value="Thumbnail">Thumbnail</option>
                          <option value="Interior">Interior</option>
                          <option value="Exterior">Exterior</option>
                        </select>

                        {/* Section Actions */}
                        <div style={{ display: "flex", gap: "12px" }}>
                          {sections.length > 1 && (
                            <button
                              onClick={() => {
                                const newSections = sections.filter((_, i) => i !== index);
                                setSections(newSections);
                              }}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "8px 16px",
                                background: "#f8f9fa",
                                color: "#6c757d",
                                border: "1px solid #dee2e6",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "14px",
                              }}
                            >
                              <span style={{ fontSize: "16px" }}>×</span> Remove
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Drag & Drop Upload Area */}
                      <div
                        style={{
                          border: "2px dashed #ed2027",
                          borderRadius: "12px",
                          padding: section.files.length > 0 ? "20px" : "32px",
                          textAlign: "center",
                          cursor: "pointer",
                          background: section.files.length > 0 ? "#f8f9fa" : "#fff5f5",
                          borderColor: section.files.length > 0 ? "#d0d5dd" : "#ed2027",
                          marginBottom: "20px",
                          transition: "all 0.2s",
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const droppedFiles = Array.from(e.dataTransfer.files);
                          const newSections = [...sections];
                          newSections[index].files = droppedFiles;
                          setSections(newSections);
                        }}
                        onClick={() => document.getElementById(`fileInput-${index}`).click()}
                      >
                        {section.files.length > 0 ? (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center" }}>
                            {section.files.map((file, i) => (
                              <div key={i} style={{ textAlign: "center" }}>
                                <img
                                  src={file.preview} // always use preview for both API & uploaded images
                                  alt="preview"
                                  style={{ height: "300px", width: "100%" }}
                                />
                                <p style={{
                                  fontSize: "12px",
                                  color: "#6c757d",
                                  marginTop: "8px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}>
                                  {file.name}
                                </p>
                              </div>
                            ))}


                          </div>
                        ) : (
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                            <div style={{ fontSize: "32px", marginBottom: "8px" }}>📁</div>
                            <p style={{ fontSize: "16px", color: "#ed2027", fontWeight: "500", margin: "0" }}>
                              Drag & Drop or Click to Upload
                            </p>
                            <p style={{ fontSize: "14px", color: "#6c757d", margin: "0" }}>
                              Supports images, videos, and audio files
                            </p>
                          </div>
                        )}
                        <input
                          type="file"
                          id={`fileInput-${index}`}
                          multiple
                          style={{ display: "none" }}
                          onChange={(e) => {
                            const newSections = [...sections];
                            newSections[index].files = Array.from(e.target.files);
                            setSections(newSections);
                          }}
                        />
                      </div>

                      {/* Add Section Button */}
                      {index === sections.length - 1 && (
                        <button
                          onClick={() => setSections([...sections, { type: "Plan", files: [] }])}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "12px 20px",
                            backgroundColor: "#ED2027",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                        >
                          <span style={{ fontSize: "16px" }}>+</span> Add Another Section
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Navigation */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "24px 0",
                    borderTop: "1px solid #e9ecef",
                    background: "#fff",
                  }}
                >
                  <button
                    onClick={() => setCurrentStep(3)}
                    style={{
                      padding: "12px 24px",
                      background: "#fff",
                      border: "1px solid #d0d5dd",
                      borderRadius: "8px",
                      color: "#344054",
                      fontSize: "14px",
                      fontWeight: "500",
                      cursor: "pointer",
                    }}
                  >
                    Back
                  </button>

                  <button
                    disabled={!sections.some((s) => s.files.length > 0)}
                    onClick={() => {
                      handleUpdate4();   // ✅ call first
                      setCurrentStep(5)
                    }
                    }
                    style={{
                      padding: "12px 24px",
                      background: sections.some((s) => s.files.length > 0) ? "#ED2027" : "#e9ecef",
                      color: sections.some((s) => s.files.length > 0) ? "white" : "#adb5bd",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "500",
                      cursor: sections.some((s) => s.files.length > 0) ? "pointer" : "not-allowed",
                    }}
                  >
                    Continue to Pricing
                  </button>
                </div>
              </div>
            )}



            {/* step 5 */}
            {currentStep === 5 && (
              <>


                {(subPropertyType.includes("Flat / Apartment") || subPropertyType.includes("Independent Floor") || subPropertyType.includes("Serviced Apartment")) && (
                  <>
                    {/* Rent + Residential */}
                    {(listingType === "Rent" || listingType === "Joint Venture") &&
                      propertyType === "Residential" && (
                        <>
                          {/* Rent Details */}
                          <div className="step3-section">
                            <h6 className="step3-subheader">Rent Details</h6>
                            <div className="step3-price-group">
                              <input
                                type="number"
                                placeholder="₹ Expected Rent"
                                value={expectedRent}
                                onChange={(e) => setExpectedRent(e.target.value)}
                                className={`step3-input ${!expectedRent ? "error-border" : ""}`}
                              />
                            </div>
                            <small className="step3-subnote">₹ Price in words</small>

                            {/* Checkboxes */}
                            <div className="step3-checkbox-group">
                              <label className="step3-checkbox-label">
                                <input
                                  type="checkbox"
                                  checked={elecWaterExcluded}
                                  onChange={(e) => setElecWaterExcluded(e.target.checked)}
                                  className="step3-checkbox"
                                />
                                Electricity & Water charges excluded
                              </label>
                              <label className="step3-checkbox-label">
                                <input
                                  type="checkbox"
                                  checked={priceNegotiable}
                                  onChange={(e) => setPriceNegotiable(e.target.checked)}
                                  className="step3-checkbox"
                                />
                                Price Negotiable
                              </label>
                            </div>
                          </div>
                          {/* Additional Price Details */}
                          <div className="step3-section">
                            <button
                              type="button"
                              onClick={() => setShowAdditionalPricing((prev) => !prev)}
                              className="step3-toggle-btn"
                            >
                              {showAdditionalPricing
                                ? "− Hide  more Rent Details"
                                : "+ Add more Rent Details (Optional)"}
                            </button>

                            {showAdditionalPricing && (
                              <div className="step3-additional-fields">
                                {/* Maintenance + unit */}
                                <div className="step3-input-group">
                                  <input
                                    type="number"
                                    placeholder="Maintenance"
                                    value={maintenance}
                                    onChange={(e) => setMaintenance(e.target.value)}
                                    className="step3-input"
                                  />
                                  <select
                                    value={maintenanceUnit}
                                    onChange={(e) => setMaintenanceUnit(e.target.value)}
                                    className="step3-unit-select"
                                  >
                                    <option value="">Select</option>
                                    <option value="Monthly">Monthly</option>
                                    <option value="Annually">Annually</option>
                                    <option value="One Time">One Time</option>
                                    <option value="Per Unit">Per Unit</option>
                                  </select>
                                </div>

                                {/* Booking Amount */}
                                <input
                                  type="number"
                                  placeholder="Booking Amount"
                                  value={bookingAmount}
                                  onChange={(e) => setBookingAmount(e.target.value)}
                                  className="step3-input"
                                />

                                {/* Membership Charge */}
                                <input
                                  type="number"
                                  placeholder="Membership Charge"
                                  value={membershipCharge}
                                  onChange={(e) => setMembershipCharge(e.target.value)}
                                  className="step3-input"
                                />
                              </div>
                            )}
                          </div>


                          {/* Preferred Agreement Type */}
                          <div className="step3-section">
                            <label className="step3-label">Preferred agreement type</label>
                            <div className="step3-button-group">
                              {["Company lease agreement", "Any"].map((type) => (
                                <button
                                  key={type}
                                  type="button"
                                  onClick={() => setAgreementType(type)}
                                  className={`step3-option-btn ${agreementType === type ? "active" : ""
                                    }`}
                                >
                                  {type}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Broker contact permission */}
                          <div className="step3-section">
                            <label className="step3-label">
                              Are you ok with brokers contacting you?
                            </label>
                            <div className="step3-button-group">
                              {["Yes", "No"].map((opt) => (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => setAllowBroker(opt)}
                                  className={`step3-option-btn ${allowBroker === opt ? "active" : ""
                                    }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Unique Property */}
                          <div className="step3-section">
                            <p className="step3-label">
                              What makes your property unique?
                            </p>
                            <textarea
                              placeholder="What makes your property unique?"
                              value={uniqueProperty}
                              onChange={(e) => setUniqueProperty(e.target.value)}
                              rows={3}
                              className="step3-textarea"
                            />
                          </div>

                          <div>
                            <button
                              type="button"
                              onClick={handleStep5Continue}
                              style={{
                                backgroundColor: "#ED2027",
                                color: "#fff",
                                padding: "12px 28px",
                                borderRadius: 6,
                                fontWeight: 600,
                                border: "none",
                                cursor: "pointer",
                                fontSize: 15,
                                transition: "background-color 0.15s ease",
                              }}
                              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#c41b21")}
                              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ED2027")}
                            >
                              Continue
                            </button>
                          </div>
                        </>
                      )}

                    {/* Sell + Residential */}
                    {(listingType === "Sell" || listingType === "Joint Venture") &&
                      propertyType === "Residential" && (
                        <>
                          <div className="step3-container">
                            {/* Price Details */}
                            <div className="step3-section">
                              <h6 className="step3-subheader">
                                Price Details
                              </h6>
                              <div className="step3-price-group">
                                <input
                                  type="number"
                                  placeholder="Expected Price"
                                  value={expectedPrice}
                                  onChange={(e) => setExpectedPrice(e.target.value)}
                                  className="step3-input"
                                />
                                <input
                                  type="number"
                                  placeholder="Price per Sq.Ft"
                                  value={
                                    expectedPrice && (carpetArea || builtUpArea)
                                      ? (
                                        parseFloat(expectedPrice) /
                                        parseFloat(carpetArea || builtUpArea)
                                      ).toFixed(2)
                                      : ""
                                  }
                                  readOnly
                                  className="step3-input step3-readonly-input mt-3"
                                />
                              </div>
                              <div className="step3-checkbox-group">
                                <label className="step3-checkbox-label">
                                  <input
                                    type="checkbox"
                                    checked={allInclusive}
                                    onChange={(e) => setAllInclusive(e.target.checked)}
                                    className="step3-checkbox"
                                  />
                                  All Inclusive Price?
                                </label>
                                <label className="step3-checkbox-label">
                                  <input
                                    type="checkbox"
                                    checked={taxGovt}
                                    onChange={(e) => setTaxGovt(e.target.checked)}
                                    className="step3-checkbox"
                                  />
                                  Tax & Govt. Charges
                                </label>
                                <label className="step3-checkbox-label">
                                  <input
                                    type="checkbox"
                                    checked={priceNegotiable}
                                    onChange={(e) => setPriceNegotiable(e.target.checked)}
                                    className="step3-checkbox"
                                  />
                                  Price Negotiable
                                </label>
                              </div>
                            </div>

                            {/* Additional Price Details */}
                            <div className="step3-section">
                              <button
                                type="button"
                                onClick={() => setShowAdditionalPricing((prev) => !prev)}
                                className="step3-toggle-btn"
                              >
                                {showAdditionalPricing
                                  ? "− Hide Additional Price Details"
                                  : "+ Add Additional Price Details (Optional)"}
                              </button>

                              {showAdditionalPricing && (
                                <div className="step3-additional-fields">
                                  <div className="step3-input-group">
                                    <input
                                      type="number"
                                      placeholder="Maintenance"
                                      value={maintenance}
                                      onChange={(e) => setMaintenance(e.target.value)}
                                      className="step3-input"
                                    />
                                    <select
                                      value={maintenanceUnit}
                                      onChange={(e) => setMaintenanceUnit(e.target.value)}
                                      className="step3-unit-select"
                                    >
                                      <option value="">Select</option>
                                      <option value="Monthly">Monthly</option>
                                      <option value="Annually">Annually</option>
                                      <option value="One Time">One Time</option>
                                      <option value="Per Unit">Per Unit</option>
                                    </select>
                                  </div>
                                  <input
                                    type="number"
                                    placeholder="Rental"
                                    value={rental}
                                    onChange={(e) => setRental(e.target.value)}
                                    className="step3-input"
                                  />
                                  <input
                                    type="number"
                                    placeholder="Booking Amount"
                                    value={bookingAmount}
                                    onChange={(e) => setBookingAmount(e.target.value)}
                                    className="step3-input"
                                  />
                                  <input
                                    type="number"
                                    placeholder="Annual Dues Payable Membership Charge"
                                    value={annualDues}
                                    onChange={(e) => setAnnualDues(e.target.value)}
                                    className="step3-input"
                                  />
                                </div>
                              )}
                            </div>

                            {/* Unique Property */}
                            <div className="step3-section">
                              <p className="step3-label">
                                What makes your property unique?
                              </p>
                              <textarea
                                placeholder="What makes your property unique?"
                                value={uniqueProperty}
                                onChange={(e) => setUniqueProperty(e.target.value)}
                                rows={3}
                                className="step3-textarea"
                              />
                            </div>


                            <div>
                              <button
                                type="button"
                                onClick={handleStep5Continue}
                                style={{
                                  backgroundColor: "#ED2027",
                                  color: "#fff",
                                  padding: "12px 28px",
                                  borderRadius: 6,
                                  fontWeight: 600,
                                  border: "none",
                                  cursor: "pointer",
                                  fontSize: 15,
                                  transition: "background-color 0.15s ease",
                                }}
                                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#c41b21")}
                                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ED2027")}
                              >
                                Continue
                              </button>
                            </div>
                          </div>
                        </>
                      )}

                  </>
                )}

                {subPropertyType.includes("Independent House / Villa") && (
                  <>
                    {/* Sell + Residential */}
                    {(listingType === "Sell" || listingType === "Joint Venture") &&
                      propertyType === "Residential" && (
                        <>
                          {/* Price Details */}
                          <div className="step3-section">
                            <h6 className="step3-subheader">
                              Price Details
                            </h6>
                            <div className="step3-price-group">
                              <input
                                type="number"
                                placeholder="Expected Price"
                                value={expectedPrice}
                                onChange={(e) => setExpectedPrice(e.target.value)}
                                className="step3-input"
                              />
                              <input
                                type="number"
                                placeholder="Price per Sq.Ft"
                                value={
                                  expectedPrice && (carpetArea || builtUpArea)
                                    ? (
                                      parseFloat(expectedPrice) /
                                      parseFloat(carpetArea || builtUpArea)
                                    ).toFixed(2)
                                    : ""
                                }
                                readOnly
                                className="step3-input step3-readonly-input"
                              />
                            </div>
                            <div className="step3-checkbox-group">
                              <label className="step3-checkbox-label">
                                <input
                                  type="checkbox"
                                  checked={allInclusive}
                                  onChange={(e) => setAllInclusive(e.target.checked)}
                                  className="step3-checkbox"
                                />
                                All Inclusive Price?
                              </label>
                              <label className="step3-checkbox-label">
                                <input
                                  type="checkbox"
                                  checked={taxGovt}
                                  onChange={(e) => setTaxGovt(e.target.checked)}
                                  className="step3-checkbox"
                                />
                                Tax & Govt. Charges
                              </label>
                              <label className="step3-checkbox-label">
                                <input
                                  type="checkbox"
                                  checked={priceNegotiable}
                                  onChange={(e) => setPriceNegotiable(e.target.checked)}
                                  className="step3-checkbox"
                                />
                                Price Negotiable
                              </label>
                            </div>
                          </div>

                          {/* Additional Price Details */}
                          <div className="step3-section">
                            <button
                              type="button"
                              onClick={() => setShowAdditionalPricing((prev) => !prev)}
                              className="step3-toggle-btn"
                            >
                              {showAdditionalPricing
                                ? "− Hide Additional Price Details"
                                : "+ Add Additional Price Details (Optional)"}
                            </button>

                            {showAdditionalPricing && (
                              <div className="step3-additional-fields">
                                <div className="step3-input-group">
                                  <input
                                    type="number"
                                    placeholder="Maintenance"
                                    value={maintenance}
                                    onChange={(e) => setMaintenance(e.target.value)}
                                    className="step3-input"
                                  />
                                  <select
                                    value={maintenanceUnit}
                                    onChange={(e) => setMaintenanceUnit(e.target.value)}
                                    className="step3-unit-select"
                                  >
                                    <option value="">Select</option>
                                    <option value="Monthly">Monthly</option>
                                    <option value="Annually">Annually</option>
                                    <option value="One Time">One Time</option>
                                    <option value="Per Unit">Per Unit</option>
                                  </select>
                                </div>
                                <input
                                  type="number"
                                  placeholder="Rental"
                                  value={rental}
                                  onChange={(e) => setRental(e.target.value)}
                                  className="step3-input"
                                />
                                <input
                                  type="number"
                                  placeholder="Booking Amount"
                                  value={bookingAmount}
                                  onChange={(e) => setBookingAmount(e.target.value)}
                                  className="step3-input"
                                />
                                <input
                                  type="number"
                                  placeholder="Annual Dues Payable Membership Charge"
                                  value={annualDues}
                                  onChange={(e) => setAnnualDues(e.target.value)}
                                  className="step3-input"
                                />
                              </div>
                            )}
                          </div>

                          {/* Unique Property */}
                          <div className="step3-section">
                            <p className="step3-label">
                              What makes your property unique?
                            </p>
                            <textarea
                              placeholder="What makes your property unique?"
                              value={uniqueProperty}
                              onChange={(e) => setUniqueProperty(e.target.value)}
                              rows={3}
                              className="step3-textarea"
                            />
                          </div>

                          <div>
                            <button
                              type="button"
                              onClick={handleStep5Continue}
                              style={{
                                backgroundColor: "#ED2027",
                                color: "#fff",
                                padding: "12px 28px",
                                borderRadius: 6,
                                fontWeight: 600,
                                border: "none",
                                cursor: "pointer",
                                fontSize: 15,
                                transition: "background-color 0.15s ease",
                              }}
                              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#c41b21")}
                              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ED2027")}
                            >
                              Continue
                            </button>
                          </div>
                        </>
                      )}

                    {/* Rent + Residential */}
                    {(listingType === "Rent" || listingType === "Joint Venture") &&
                      propertyType === "Residential" && (
                        <>
                          {/* Rent Details */}
                          <div className="step3-section">
                            <h6 className="step3-subheader">Rent Details</h6>
                            <div className="step3-price-group">
                              <input
                                type="number"
                                placeholder="₹ Expected Rent"
                                value={expectedRent}
                                onChange={(e) => setExpectedRent(e.target.value)}
                                className={`step3-input ${!expectedRent ? "error-border" : ""}`}
                              />
                            </div>
                            <small className="step3-subnote">₹ Price in words</small>

                            {/* Checkboxes */}
                            <div className="step3-checkbox-group">
                              <label className="step3-checkbox-label">
                                <input
                                  type="checkbox"
                                  checked={elecWaterExcluded}
                                  onChange={(e) => setElecWaterExcluded(e.target.checked)}
                                  className="step3-checkbox"
                                />
                                Electricity & Water charges excluded
                              </label>
                              <label className="step3-checkbox-label">
                                <input
                                  type="checkbox"
                                  checked={priceNegotiable}
                                  onChange={(e) => setPriceNegotiable(e.target.checked)}
                                  className="step3-checkbox"
                                />
                                Price Negotiable
                              </label>
                            </div>
                          </div>
                          {/* Additional Price Details */}
                          <div className="step3-section">
                            <button
                              type="button"
                              onClick={() => setShowAdditionalPricing((prev) => !prev)}
                              className="step3-toggle-btn"
                            >
                              {showAdditionalPricing
                                ? "− Hide  more Rent Details"
                                : "+ Add more Rent Details (Optional)"}
                            </button>

                            {showAdditionalPricing && (
                              <div className="step3-additional-fields">
                                {/* Maintenance + unit */}
                                <div className="step3-input-group">
                                  <input
                                    type="number"
                                    placeholder="Maintenance"
                                    value={maintenance}
                                    onChange={(e) => setMaintenance(e.target.value)}
                                    className="step3-input"
                                  />
                                  <select
                                    value={maintenanceUnit}
                                    onChange={(e) => setMaintenanceUnit(e.target.value)}
                                    className="step3-unit-select"
                                  >
                                    <option value="">Select</option>
                                    <option value="Monthly">Monthly</option>
                                    <option value="Annually">Annually</option>
                                    <option value="One Time">One Time</option>
                                    <option value="Per Unit">Per Unit</option>
                                  </select>
                                </div>

                                {/* Booking Amount */}
                                <input
                                  type="number"
                                  placeholder="Booking Amount"
                                  value={bookingAmount}
                                  onChange={(e) => setBookingAmount(e.target.value)}
                                  className="step3-input"
                                />


                              </div>
                            )}
                          </div>


                          {/* Preferred Agreement Type */}
                          <div className="step3-section">
                            <label className="step3-label">Preferred agreement type</label>
                            <div className="step3-button-group">
                              {["Company lease agreement", "Any"].map((type) => (
                                <button
                                  key={type}
                                  type="button"
                                  onClick={() => setAgreementType(type)}
                                  className={`step3-option-btn ${agreementType === type ? "active" : ""
                                    }`}
                                >
                                  {type}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Broker contact permission */}
                          <div className="step3-section">
                            <label className="step3-label">
                              Are you ok with brokers contacting you?
                            </label>
                            <div className="step3-button-group">
                              {["Yes", "No"].map((opt) => (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => setAllowBroker(opt)}
                                  className={`step3-option-btn ${allowBroker === opt ? "active" : ""
                                    }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Unique Property */}
                          <div className="step3-section">
                            <p className="step3-label">
                              What makes your property unique?
                            </p>
                            <textarea
                              placeholder="What makes your property unique?"
                              value={uniqueProperty}
                              onChange={(e) => setUniqueProperty(e.target.value)}
                              rows={3}
                              className="step3-textarea"
                            />
                          </div>

                          <div>
                            <button
                              type="button"
                              onClick={handleStep5Continue}
                              style={{
                                backgroundColor: "#ED2027",
                                color: "#fff",
                                padding: "12px 28px",
                                borderRadius: 6,
                                fontWeight: 600,
                                border: "none",
                                cursor: "pointer",
                                fontSize: 15,
                                transition: "background-color 0.15s ease",
                              }}
                              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#c41b21")}
                              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ED2027")}
                            >
                              Continue
                            </button>
                          </div>

                        </>
                      )}
                  </>
                )}



                {subPropertyType.includes("Plot / Land") && (
                  <>

                    {/* Price Details */}
                    <div className="step3-section">
                      <h6 className="step3-subheader">
                        Price Details
                      </h6>
                      <div className="step3-price-group">
                        <input
                          type="number"
                          placeholder="Expected Price"
                          value={expectedPrice}
                          onChange={(e) => setExpectedPrice(e.target.value)}
                          className="step3-input"
                        />
                        <input
                          type="number"
                          placeholder="Price per Sq.Ft"
                          value={
                            expectedPrice && (carpetArea || builtUpArea)
                              ? (
                                parseFloat(expectedPrice) /
                                parseFloat(carpetArea || builtUpArea)
                              ).toFixed(2)
                              : ""
                          }
                          readOnly
                          className="step3-input step3-readonly-input"
                        />
                      </div>
                      <div className="step3-checkbox-group">
                        <label className="step3-checkbox-label">
                          <input
                            type="checkbox"
                            checked={allInclusive}
                            onChange={(e) => setAllInclusive(e.target.checked)}
                            className="step3-checkbox"
                          />
                          All Inclusive Price?
                        </label>
                        <label className="step3-checkbox-label">
                          <input
                            type="checkbox"
                            checked={taxGovt}
                            onChange={(e) => setTaxGovt(e.target.checked)}
                            className="step3-checkbox"
                          />
                          Tax & Govt. Charges
                        </label>
                        <label className="step3-checkbox-label">
                          <input
                            type="checkbox"
                            checked={priceNegotiable}
                            onChange={(e) => setPriceNegotiable(e.target.checked)}
                            className="step3-checkbox"
                          />
                          Price Negotiable
                        </label>
                      </div>
                    </div>

                    {/* Additional Price Details */}
                    <div className="step3-section">
                      <button
                        type="button"
                        onClick={() => setShowAdditionalPricing((prev) => !prev)}
                        className="step3-toggle-btn"
                      >
                        {showAdditionalPricing
                          ? "− Hide Additional Price Details"
                          : "+ Add Additional Price Details (Optional)"}
                      </button>

                      {showAdditionalPricing && (
                        <div className="step3-additional-fields">
                          <div className="step3-input-group">
                            <input
                              type="number"
                              placeholder="Maintenance"
                              value={maintenance}
                              onChange={(e) => setMaintenance(e.target.value)}
                              className="step3-input"
                            />
                            <select
                              value={maintenanceUnit}
                              onChange={(e) => setMaintenanceUnit(e.target.value)}
                              className="step3-unit-select"
                            >
                              <option value="">Select</option>
                              <option value="Monthly">Monthly</option>
                              <option value="Annually">Annually</option>
                              <option value="One Time">One Time</option>
                              <option value="Per Unit">Per Unit</option>
                            </select>
                          </div>
                          <input
                            type="number"
                            placeholder="Rental"
                            value={rental}
                            onChange={(e) => setRental(e.target.value)}
                            className="step3-input"
                          />
                          <input
                            type="number"
                            placeholder="Booking Amount"
                            value={bookingAmount}
                            onChange={(e) => setBookingAmount(e.target.value)}
                            className="step3-input"
                          />
                          <input
                            type="number"
                            placeholder="Annual Dues Payable Membership Charge"
                            value={annualDues}
                            onChange={(e) => setAnnualDues(e.target.value)}
                            className="step3-input"
                          />
                        </div>
                      )}
                    </div>

                    {/* Unique Property */}
                    <div className="step3-section">
                      <p className="step3-label">
                        What makes your property unique?
                      </p>
                      <textarea
                        placeholder="What makes your property unique?"
                        value={uniqueProperty}
                        onChange={(e) => setUniqueProperty(e.target.value)}
                        rows={3}
                        className="step3-textarea"
                      />
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={handleStep5Continue}
                        style={{
                          backgroundColor: "#ED2027",
                          color: "#fff",
                          padding: "12px 28px",
                          borderRadius: 6,
                          fontWeight: 600,
                          border: "none",
                          cursor: "pointer",
                          fontSize: 15,
                          transition: "background-color 0.15s ease",
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#c41b21")}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ED2027")}
                      >
                        Continue
                      </button>
                    </div>

                  </>
                )}

                {subPropertyType === "1 RK / Studio Apartment" && (

                  <>
                    {/* Sell + Residential */}
                    {(listingType === "Sell" || listingType === "Joint Venture") &&
                      propertyType === "Residential" && (
                        <>
                          {/* Price Details */}
                          <div className="step3-section">
                            <h6 className="step3-subheader">
                              Price Details
                            </h6>
                            <div className="step3-price-group">
                              <input
                                type="number"
                                placeholder="Expected Price"
                                value={expectedPrice}
                                onChange={(e) => setExpectedPrice(e.target.value)}
                                className="step3-input"
                              />
                              <input
                                type="number"
                                placeholder="Price per Sq.Ft"
                                value={
                                  expectedPrice && (carpetArea || builtUpArea)
                                    ? (
                                      parseFloat(expectedPrice) /
                                      parseFloat(carpetArea || builtUpArea)
                                    ).toFixed(2)
                                    : ""
                                }
                                readOnly
                                className="step3-input step3-readonly-input"
                              />
                            </div>
                            <div className="step3-checkbox-group">
                              <label className="step3-checkbox-label">
                                <input
                                  type="checkbox"
                                  checked={allInclusive}
                                  onChange={(e) => setAllInclusive(e.target.checked)}
                                  className="step3-checkbox"
                                />
                                All Inclusive Price?
                              </label>
                              <label className="step3-checkbox-label">
                                <input
                                  type="checkbox"
                                  checked={taxGovt}
                                  onChange={(e) => setTaxGovt(e.target.checked)}
                                  className="step3-checkbox"
                                />
                                Tax & Govt. Charges
                              </label>
                              <label className="step3-checkbox-label">
                                <input
                                  type="checkbox"
                                  checked={priceNegotiable}
                                  onChange={(e) => setPriceNegotiable(e.target.checked)}
                                  className="step3-checkbox"
                                />
                                Price Negotiable
                              </label>
                            </div>
                          </div>

                          {/* Additional Price Details */}
                          <div className="step3-section">
                            <button
                              type="button"
                              onClick={() => setShowAdditionalPricing((prev) => !prev)}
                              className="step3-toggle-btn"
                            >
                              {showAdditionalPricing
                                ? "− Hide Additional Price Details"
                                : "+ Add Additional Price Details (Optional)"}
                            </button>

                            {showAdditionalPricing && (
                              <div className="step3-additional-fields">
                                <div className="step3-input-group">
                                  <input
                                    type="number"
                                    placeholder="Maintenance"
                                    value={maintenance}
                                    onChange={(e) => setMaintenance(e.target.value)}
                                    className="step3-input"
                                  />
                                  <select
                                    value={maintenanceUnit}
                                    onChange={(e) => setMaintenanceUnit(e.target.value)}
                                    className="step3-unit-select"
                                  >
                                    <option value="">Select</option>
                                    <option value="Monthly">Monthly</option>
                                    <option value="Annually">Annually</option>
                                    <option value="One Time">One Time</option>
                                    <option value="Per Unit">Per Unit</option>
                                  </select>
                                </div>
                                <input
                                  type="number"
                                  placeholder="Rental"
                                  value={rental}
                                  onChange={(e) => setRental(e.target.value)}
                                  className="step3-input"
                                />
                                <input
                                  type="number"
                                  placeholder="Booking Amount"
                                  value={bookingAmount}
                                  onChange={(e) => setBookingAmount(e.target.value)}
                                  className="step3-input"
                                />
                                <input
                                  type="number"
                                  placeholder="Annual Dues Payable Membership Charge"
                                  value={annualDues}
                                  onChange={(e) => setAnnualDues(e.target.value)}
                                  className="step3-input"
                                />
                              </div>
                            )}
                          </div>

                          {/* Unique Property */}
                          <div className="step3-section">
                            <p className="step3-label">
                              What makes your property unique?
                            </p>
                            <textarea
                              placeholder="What makes your property unique?"
                              value={uniqueProperty}
                              onChange={(e) => setUniqueProperty(e.target.value)}
                              rows={3}
                              className="step3-textarea"
                            />
                          </div>

                          <div>
                            <button
                              type="button"
                              onClick={handleStep5Continue}
                              style={{
                                backgroundColor: "#ED2027",
                                color: "#fff",
                                padding: "12px 28px",
                                borderRadius: 6,
                                fontWeight: 600,
                                border: "none",
                                cursor: "pointer",
                                fontSize: 15,
                                transition: "background-color 0.15s ease",
                              }}
                              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#c41b21")}
                              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ED2027")}
                            >
                              Continue
                            </button>
                          </div>
                        </>
                      )}

                    {/* Rent + Residential */}
                    {(listingType === "Rent" || listingType === "Joint Venture") &&
                      propertyType === "Residential" && (
                        <>
                          {/* Rent Details */}
                          <div className="step3-section">
                            <h6 className="step3-subheader">Rent Details</h6>
                            <div className="step3-price-group">
                              <input
                                type="number"
                                placeholder="₹ Expected Rent"
                                value={expectedRent}
                                onChange={(e) => setExpectedRent(e.target.value)}
                                className={`step3-input ${!expectedRent ? "error-border" : ""}`}
                              />
                            </div>
                            <small className="step3-subnote">₹ Price in words</small>

                            {/* Checkboxes */}
                            <div className="step3-checkbox-group">
                              <label className="step3-checkbox-label">
                                <input
                                  type="checkbox"
                                  checked={elecWaterExcluded}
                                  onChange={(e) => setElecWaterExcluded(e.target.checked)}
                                  className="step3-checkbox"
                                />
                                Electricity & Water charges excluded
                              </label>
                              <label className="step3-checkbox-label">
                                <input
                                  type="checkbox"
                                  checked={priceNegotiable}
                                  onChange={(e) => setPriceNegotiable(e.target.checked)}
                                  className="step3-checkbox"
                                />
                                Price Negotiable
                              </label>
                            </div>
                          </div>
                          {/* Additional Price Details */}
                          <div className="step3-section">
                            <button
                              type="button"
                              onClick={() => setShowAdditionalPricing((prev) => !prev)}
                              className="step3-toggle-btn"
                            >
                              {showAdditionalPricing
                                ? "− Hide  more Rent Details"
                                : "+ Add more Rent Details (Optional)"}
                            </button>

                            {showAdditionalPricing && (
                              <div className="step3-additional-fields">
                                {/* Maintenance + unit */}
                                <div className="step3-input-group">
                                  <input
                                    type="number"
                                    placeholder="Maintenance"
                                    value={maintenance}
                                    onChange={(e) => setMaintenance(e.target.value)}
                                    className="step3-input"
                                  />
                                  <select
                                    value={maintenanceUnit}
                                    onChange={(e) => setMaintenanceUnit(e.target.value)}
                                    className="step3-unit-select"
                                  >
                                    <option value="">Select</option>
                                    <option value="Monthly">Monthly</option>
                                    <option value="Annually">Annually</option>
                                    <option value="One Time">One Time</option>
                                    <option value="Per Unit">Per Unit</option>
                                  </select>
                                </div>

                                {/* Booking Amount */}
                                <input
                                  type="number"
                                  placeholder="Booking Amount"
                                  value={bookingAmount}
                                  onChange={(e) => setBookingAmount(e.target.value)}
                                  className="step3-input"
                                />

                                {/* Membership Charge */}
                                <input
                                  type="number"
                                  placeholder="Membership Charge"
                                  value={membershipCharge}
                                  onChange={(e) => setMembershipCharge(e.target.value)}
                                  className="step3-input"
                                />
                              </div>
                            )}
                          </div>


                          {/* Preferred Agreement Type */}
                          <div className="step3-section">
                            <label className="step3-label">Preferred agreement type</label>
                            <div className="step3-button-group">
                              {["Company lease agreement", "Any"].map((type) => (
                                <button
                                  key={type}
                                  type="button"
                                  onClick={() => setAgreementType(type)}
                                  className={`step3-option-btn ${agreementType === type ? "active" : ""
                                    }`}
                                >
                                  {type}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Broker contact permission */}
                          <div className="step3-section">
                            <label className="step3-label">
                              Are you ok with brokers contacting you?
                            </label>
                            <div className="step3-button-group">
                              {["Yes", "No"].map((opt) => (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => setAllowBroker(opt)}
                                  className={`step3-option-btn ${allowBroker === opt ? "active" : ""
                                    }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Unique Property */}
                          <div className="step3-section">
                            <p className="step3-label">
                              What makes your property unique?
                            </p>
                            <textarea
                              placeholder="What makes your property unique?"
                              value={uniqueProperty}
                              onChange={(e) => setUniqueProperty(e.target.value)}
                              rows={3}
                              className="step3-textarea"
                            />
                          </div>

                          <div>
                            <button
                              type="button"
                              onClick={handleStep5Continue}
                              style={{
                                backgroundColor: "#ED2027",
                                color: "#fff",
                                padding: "12px 28px",
                                borderRadius: 6,
                                fontWeight: 600,
                                border: "none",
                                cursor: "pointer",
                                fontSize: 15,
                                transition: "background-color 0.15s ease",
                              }}
                              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#c41b21")}
                              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ED2027")}
                            >
                              Continue
                            </button>
                          </div>
                        </>
                      )}

                  </>
                )}


                {subPropertyType.includes("Farmhouse") && (

                  <>
                    {/* Sell + Residential */}
                    {(listingType === "Sell" || listingType === "Joint Venture") &&
                      propertyType === "Residential" && (
                        <>
                          {/* Price Details */}
                          <div className="step3-section">
                            <h6 className="step3-subheader">
                              Price Details
                            </h6>
                            <div className="step3-price-group">
                              <input
                                type="number"
                                placeholder="Expected Price"
                                value={expectedPrice}
                                onChange={(e) => setExpectedPrice(e.target.value)}
                                className="step3-input"
                              />
                              <input
                                type="number"
                                placeholder="Price per Sq.Ft"
                                value={
                                  expectedPrice && (carpetArea || builtUpArea)
                                    ? (
                                      parseFloat(expectedPrice) /
                                      parseFloat(carpetArea || builtUpArea)
                                    ).toFixed(2)
                                    : ""
                                }
                                readOnly
                                className="step3-input step3-readonly-input"
                              />
                            </div>
                            <div className="step3-checkbox-group">
                              <label className="step3-checkbox-label">
                                <input
                                  type="checkbox"
                                  checked={allInclusive}
                                  onChange={(e) => setAllInclusive(e.target.checked)}
                                  className="step3-checkbox"
                                />
                                All Inclusive Price?
                              </label>
                              <label className="step3-checkbox-label">
                                <input
                                  type="checkbox"
                                  checked={taxGovt}
                                  onChange={(e) => setTaxGovt(e.target.checked)}
                                  className="step3-checkbox"
                                />
                                Tax & Govt. Charges
                              </label>
                              <label className="step3-checkbox-label">
                                <input
                                  type="checkbox"
                                  checked={priceNegotiable}
                                  onChange={(e) => setPriceNegotiable(e.target.checked)}
                                  className="step3-checkbox"
                                />
                                Price Negotiable
                              </label>
                            </div>
                          </div>

                          {/* Additional Price Details */}
                          <div className="step3-section">
                            <button
                              type="button"
                              onClick={() => setShowAdditionalPricing((prev) => !prev)}
                              className="step3-toggle-btn"
                            >
                              {showAdditionalPricing
                                ? "− Hide Additional Price Details"
                                : "+ Add Additional Price Details (Optional)"}
                            </button>

                            {showAdditionalPricing && (
                              <div className="step3-additional-fields">
                                <div className="step3-input-group">
                                  <input
                                    type="number"
                                    placeholder="Maintenance"
                                    value={maintenance}
                                    onChange={(e) => setMaintenance(e.target.value)}
                                    className="step3-input"
                                  />
                                  <select
                                    value={maintenanceUnit}
                                    onChange={(e) => setMaintenanceUnit(e.target.value)}
                                    className="step3-unit-select"
                                  >
                                    <option value="">Select</option>
                                    <option value="Monthly">Monthly</option>
                                    <option value="Annually">Annually</option>
                                    <option value="One Time">One Time</option>
                                    <option value="Per Unit">Per Unit</option>
                                  </select>
                                </div>
                                <input
                                  type="number"
                                  placeholder="Rental"
                                  value={rental}
                                  onChange={(e) => setRental(e.target.value)}
                                  className="step3-input"
                                />
                                <input
                                  type="number"
                                  placeholder="Booking Amount"
                                  value={bookingAmount}
                                  onChange={(e) => setBookingAmount(e.target.value)}
                                  className="step3-input"
                                />
                                <input
                                  type="number"
                                  placeholder="Annual Dues Payable Membership Charge"
                                  value={annualDues}
                                  onChange={(e) => setAnnualDues(e.target.value)}
                                  className="step3-input"
                                />
                              </div>
                            )}
                          </div>

                          {/* Unique Property */}
                          <div className="step3-section">
                            <p className="step3-label">
                              What makes your property unique?
                            </p>
                            <textarea
                              placeholder="What makes your property unique?"
                              value={uniqueProperty}
                              onChange={(e) => setUniqueProperty(e.target.value)}
                              rows={3}
                              className="step3-textarea"
                            />
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={handleStep5Continue}
                              style={{
                                backgroundColor: "#ED2027",
                                color: "#fff",
                                padding: "12px 28px",
                                borderRadius: 6,
                                fontWeight: 600,
                                border: "none",
                                cursor: "pointer",
                                fontSize: 15,
                                transition: "background-color 0.15s ease",
                              }}
                              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#c41b21")}
                              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ED2027")}
                            >
                              Continue
                            </button>
                          </div>
                        </>
                      )}


                    {/* Rent + Residential */}
                    {(listingType === "Rent" || listingType === "Joint Venture") &&
                      propertyType === "Residential" && (
                        <>
                          {/* Rent Details */}
                          <div className="step3-section">
                            <h6 className="step3-subheader">Rent Details</h6>
                            <div className="step3-price-group">
                              <input
                                type="number"
                                placeholder="₹ Expected Rent"
                                value={expectedRent}
                                onChange={(e) => setExpectedRent(e.target.value)}
                                className={`step3-input ${!expectedRent ? "error-border" : ""}`}
                              />
                            </div>
                            <small className="step3-subnote">₹ Price in words</small>

                            {/* Checkboxes */}
                            <div className="step3-checkbox-group">
                              <label className="step3-checkbox-label">
                                <input
                                  type="checkbox"
                                  checked={elecWaterExcluded}
                                  onChange={(e) => setElecWaterExcluded(e.target.checked)}
                                  className="step3-checkbox"
                                />
                                Electricity & Water charges excluded
                              </label>
                              <label className="step3-checkbox-label">
                                <input
                                  type="checkbox"
                                  checked={priceNegotiable}
                                  onChange={(e) => setPriceNegotiable(e.target.checked)}
                                  className="step3-checkbox"
                                />
                                Price Negotiable
                              </label>
                            </div>
                          </div>
                          {/* Additional Price Details */}
                          <div className="step3-section">
                            <button
                              type="button"
                              onClick={() => setShowAdditionalPricing((prev) => !prev)}
                              className="step3-toggle-btn"
                            >
                              {showAdditionalPricing
                                ? "− Hide  more Rent Details"
                                : "+ Add more Rent Details (Optional)"}
                            </button>

                            {showAdditionalPricing && (
                              <div className="step3-additional-fields">
                                {/* Maintenance + unit */}
                                <div className="step3-input-group">
                                  <input
                                    type="number"
                                    placeholder="Maintenance"
                                    value={maintenance}
                                    onChange={(e) => setMaintenance(e.target.value)}
                                    className="step3-input"
                                  />
                                  <select
                                    value={maintenanceUnit}
                                    onChange={(e) => setMaintenanceUnit(e.target.value)}
                                    className="step3-unit-select"
                                  >
                                    <option value="">Select</option>
                                    <option value="Monthly">Monthly</option>
                                    <option value="Annually">Annually</option>
                                    <option value="One Time">One Time</option>
                                    <option value="Per Unit">Per Unit</option>
                                  </select>
                                </div>

                                {/* Booking Amount */}
                                <input
                                  type="number"
                                  placeholder="Booking Amount"
                                  value={bookingAmount}
                                  onChange={(e) => setBookingAmount(e.target.value)}
                                  className="step3-input"
                                />


                              </div>
                            )}
                          </div>


                          {/* Preferred Agreement Type */}
                          <div className="step3-section">
                            <label className="step3-label">Preferred agreement type</label>
                            <div className="step3-button-group">
                              {["Company lease agreement", "Any"].map((type) => (
                                <button
                                  key={type}
                                  type="button"
                                  onClick={() => setAgreementType(type)}
                                  className={`step3-option-btn ${agreementType === type ? "active" : ""
                                    }`}
                                >
                                  {type}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Broker contact permission */}
                          <div className="step3-section">
                            <label className="step3-label">
                              Are you ok with brokers contacting you?
                            </label>
                            <div className="step3-button-group">
                              {["Yes", "No"].map((opt) => (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => setAllowBroker(opt)}
                                  className={`step3-option-btn ${allowBroker === opt ? "active" : ""
                                    }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Unique Property */}
                          <div className="step3-section">
                            <p className="step3-label">
                              What makes your property unique?
                            </p>
                            <textarea
                              placeholder="What makes your property unique?"
                              value={uniqueProperty}
                              onChange={(e) => setUniqueProperty(e.target.value)}
                              rows={3}
                              className="step3-textarea"
                            />
                          </div>
                        </>
                      )}



                  </>
                )}

                {/*READY TO MOVE OFFICE */}


                {propertyType === "Commercial" &&
                  subPropertyType === "Office" &&
                  (subPropertyQuestionOption === "Ready to move office space" ||
                    subPropertyQuestionOption === "Bare shell office space") && (


                    <>

                      {(listingType === "Sell" || listingType === "Joint Venture") && (

                        <>

                          <h4 style={{ color: "#333", fontWeight: 600, fontSize: 18, marginBottom: 20 }}>
                            Add pricing and details...
                          </h4>


                          <div style={{ marginBottom: 20 }}>
                            <label style={{ fontWeight: 600, display: "block", marginBottom: 10 }}>
                              Ownership
                            </label>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                              {["Freehold", "Leasehold", "Co-operative society", "Power of Attorney"].map(
                                (type) => {
                                  const isSelected = selectedOwnership === type;
                                  return (
                                    <button
                                      key={type}
                                      type="button"
                                      onClick={() => setSelectedOwnership(type)}
                                      style={{
                                        padding: "8px 18px",
                                        border: "1px solid",
                                        borderColor: isSelected ? "#ED2027" : "#ddd",
                                        borderRadius: 20,
                                        background: isSelected ? "#ED2027" : "#fff",
                                        color: isSelected ? "#fff" : "#333",
                                        cursor: "pointer",
                                        fontSize: 14,
                                        fontWeight: isSelected ? 600 : 500,
                                        transition: "all 0.15s ease",
                                      }}

                                      onMouseOut={(e) => !isSelected && (e.currentTarget.style.borderColor = "#ddd")}
                                    >
                                      {type}
                                    </button>
                                  );
                                }
                              )}
                            </div>
                          </div>

                          <div style={{ marginBottom: 20 }}>
                            <label style={{ fontWeight: 600, display: "block", marginBottom: 10 }}>
                              Price Details
                            </label>

                            <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                              <input
                                type="text"
                                placeholder="Expected Price"
                                value={expectedPrice}
                                onChange={(e) => setExpectedPrice(e.target.value)}
                                style={{
                                  flex: 1,
                                  padding: 10,
                                  border: "1px solid #ccc",
                                  borderRadius: 4,
                                  fontSize: 14,
                                  transition: "border-color 0.15s ease",
                                }}
                                onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                              />
                              <input
                                type="text"
                                placeholder="Price per sq.yards"
                                value={pricePerSqYards}
                                onChange={(e) => setPricePerSqYards(e.target.value)}
                                style={{
                                  flex: 1,
                                  padding: 10,
                                  border: "1px solid #ccc",
                                  borderRadius: 4,
                                  fontSize: 14,
                                  transition: "border-color 0.15s ease",
                                }}
                                onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                              />
                            </div>




                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                              <label
                                style={{
                                  fontSize: 14,
                                  accentColor: "#ED2027",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={checkboxes.allInclusive}
                                  onChange={() => toggleCheckbox("allInclusive")}
                                />
                                All inclusive price
                              </label>

                              <label
                                style={{
                                  fontSize: 14,
                                  accentColor: "#ED2027",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={checkboxes.taxExcluded}
                                  onChange={() => toggleCheckbox("taxExcluded")}
                                />
                                Tax and Govt. charges excluded
                              </label>

                              <label
                                style={{
                                  fontSize: 14,
                                  accentColor: "#ED2027",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={checkboxes.negotiable}
                                  onChange={() => toggleCheckbox("negotiable")}
                                />
                                Price Negotiable
                              </label>
                            </div>

                            <div style={{ marginBottom: 20, marginTop: 20 }}>

                              <div
                                style={{
                                  position: "relative",
                                  display: "inline-block",
                                  width: "100%",
                                  cursor: "pointer",
                                  border: "1px solid #ccc",
                                  borderRadius: 4,
                                  padding: "10px 40px 10px 16px",
                                  background: "#fff",
                                  fontSize: 14,
                                  color: "#333",
                                  userSelect: "none",
                                }}
                                onClick={() => setIsOpen(!isOpen)}
                                onMouseOver={(e) => (e.currentTarget.style.borderColor = "#ED2027")}
                                onMouseOut={(e) => (e.currentTarget.style.borderColor = "#ccc")}
                              >
                                <span>{isOpen ? "Close Pricing Details" : "Add More Pricing Details"}</span>
                                <span
                                  style={{
                                    position: "absolute",
                                    right: 12,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    fontSize: 12,
                                    pointerEvents: "none",
                                  }}
                                >
                                  {isOpen ? "▲" : "▼"}
                                </span>
                              </div>


                              {isOpen && (
                                <div style={{ marginTop: 20 }}>
                                  <label
                                    style={{
                                      fontWeight: 600,
                                      display: "block",
                                      marginBottom: 10,
                                    }}
                                  >
                                    Additional Pricing Details (Optional)
                                  </label>


                                  <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                                    <input
                                      type="text"
                                      placeholder="Maintenance"
                                      value={maintenance}
                                      onChange={(e) => setMaintenance(e.target.value)}
                                      style={{
                                        flex: 1,
                                        padding: 10,
                                        border: "1px solid #ccc",
                                        borderRadius: 4,
                                        fontSize: 14,
                                      }}
                                      onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                      onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                                    />

                                    <select
                                      value={maintenanceFreq}
                                      onChange={(e) => setMaintenanceFreq(e.target.value)}
                                      style={{
                                        width: 160,
                                        padding: 10,
                                        border: "1px solid #ccc",
                                        borderRadius: 4,
                                        fontSize: 14,
                                        background: "#fff",
                                      }}
                                      onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                      onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                                    >
                                      <option>Monthly</option>
                                      <option>Quarterly</option>
                                      <option>Yearly</option>
                                    </select>
                                  </div>


                                  <input
                                    type="text"
                                    placeholder="Expected rental"
                                    value={expectedRental}
                                    onChange={(e) => setExpectedRental(e.target.value)}
                                    style={{
                                      width: "100%",
                                      padding: 10,
                                      marginBottom: 10,
                                      border: "1px solid #ccc",
                                      borderRadius: 4,
                                      fontSize: 14,
                                    }}
                                    onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                    onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                                  />


                                  <input
                                    type="text"
                                    placeholder="Booking Amount"
                                    value={bookingAmount}
                                    onChange={(e) => setBookingAmount(e.target.value)}
                                    style={{
                                      width: "100%",
                                      padding: 10,
                                      marginBottom: 10,
                                      border: "1px solid #ccc",
                                      borderRadius: 4,
                                      fontSize: 14,
                                    }}
                                    onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                    onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                                  />


                                  <input
                                    type="text"
                                    placeholder="Annual dues payable"
                                    value={annualDues}
                                    onChange={(e) => setAnnualDues(e.target.value)}
                                    style={{
                                      width: "100%",
                                      padding: 10,
                                      marginBottom: 10,
                                      border: "1px solid #ccc",
                                      borderRadius: 4,
                                      fontSize: 14,
                                    }}
                                    onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                    onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                                  />
                                </div>
                              )}
                            </div>



                            {/* Previously the property used for */}
                            <div className="step2-section mt-3">
                              <label className="step2-label">Previously the property was used for?</label>
                              <input
                                type="text"
                                className="step2-input"
                                placeholder="e.g. Office, Retail, Warehouse"

                              />
                            </div>

                            <div className="mt-3" style={{ marginBottom: 20 }}>
                              <label style={{ fontWeight: 600, display: "block", marginBottom: 10 }}>
                                Is your office fire NOC Certified?
                              </label>


                              <div style={{ display: "flex", gap: 20 }}>
                                <label
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 8,
                                    cursor: "pointer",
                                    accentColor: "#ED2027",
                                    fontWeight: 500,
                                  }}
                                >
                                  <input
                                    type="radio"

                                    value="yes"

                                  />
                                  Yes
                                </label>

                                <label
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 8,
                                    cursor: "pointer",
                                    accentColor: "#ED2027",
                                    fontWeight: 500,
                                  }}
                                >
                                  <input
                                    type="radio"

                                    value="no"

                                  />
                                  No
                                </label>
                              </div>
                            </div>




                            <div style={{ marginBottom: 20 }}>
                              <label style={{ fontWeight: 600, display: "block", marginBottom: 10 }}>
                                Do you charge brokerage?
                              </label>


                              <div style={{ display: "flex", gap: 20 }}>
                                <label
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 8,
                                    cursor: "pointer",
                                    accentColor: "#ED2027",
                                    fontWeight: brokerage === "yes" ? 600 : 500,
                                  }}
                                >
                                  <input
                                    type="radio"
                                    name="brokerage"
                                    value="yes"
                                    checked={brokerage === "yes"}
                                    onChange={() => setBrokerage("yes")}
                                  />
                                  Yes
                                </label>

                                <label
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 8,
                                    cursor: "pointer",
                                    accentColor: "#ED2027",
                                    fontWeight: brokerage === "no" ? 600 : 500,
                                  }}
                                >
                                  <input
                                    type="radio"
                                    name="brokerage"
                                    value="no"
                                    checked={brokerage === "no"}
                                    onChange={() => setBrokerage("no")}
                                  />
                                  No
                                </label>
                              </div>


                              {brokerage === "yes" && (
                                <div style={{ marginTop: 15 }}>
                                  <input
                                    type="text"
                                    placeholder="Enter Brokerage Amount"
                                    value={brokerageAmount}
                                    onChange={(e) => setBrokerageAmount(e.target.value)}
                                    style={{
                                      width: "100%",
                                      padding: 10,
                                      border: "1px solid #ccc",
                                      borderRadius: 4,
                                      fontSize: 14,
                                      transition: "border-color 0.15s ease",
                                    }}
                                    onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                    onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                                  />
                                </div>
                              )}
                            </div>


                            <div style={{ marginBottom: 20 }}>
                              <label style={{ fontWeight: 600, display: "block", marginBottom: 10 }}>
                                What makes your property unique
                              </label>
                              <textarea
                                placeholder="Add a description..."
                                rows={4}
                                value={description}
                                onChange={(e) => {
                                  const onlyWords = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // removes numbers & special chars
                                  setDescription(onlyWords);
                                }}
                                style={{
                                  width: "100%",
                                  padding: 10,
                                  border: "1px solid #ccc",
                                  borderRadius: 4,
                                  fontSize: 14,
                                  transition: "border-color 0.15s ease",
                                }}
                                onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                              />
                              <small style={{ display: "block", marginTop: 6, color: "#888" }}>
                                Minimum 30 characters required
                              </small>
                            </div>



                            <div>
                              <button
                                type="button"
                                onClick={handleStep5Continue}
                                style={{
                                  backgroundColor: "#ED2027",
                                  color: "#fff",
                                  padding: "12px 28px",
                                  borderRadius: 6,
                                  fontWeight: 600,
                                  border: "none",
                                  cursor: "pointer",
                                  fontSize: 15,
                                  transition: "background-color 0.15s ease",
                                }}
                                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#c41b21")}
                                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ED2027")}
                              >
                                Continue
                              </button>
                            </div>
                          </div>



                        </>
                      )}
                    </>
                  )}
                {listingType === "Rent" && (
                  <>

                    {propertyType === "Commercial" &&
                      subPropertyType === "Office" &&
                      (subPropertyQuestionOption === "Ready to move office space" ||
                        subPropertyQuestionOption === "Bare shell office space") && (
                        <>

                          <h4 style={{ color: "#333", fontWeight: 600, fontSize: 18, marginBottom: 20 }}>
                            Add pricing and details...
                          </h4>


                          <div style={{ marginBottom: 20 }}>
                            <label style={{ fontWeight: 600, display: "block", marginBottom: 10 }}>
                              Ownership
                            </label>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                              {["Freehold", "Leasehold", "Co-operative society", "Power of Attorney"].map(
                                (type) => {
                                  const isSelected = selectedOwnership === type;
                                  return (
                                    <button
                                      key={type}
                                      type="button"
                                      onClick={() => setSelectedOwnership(type)}
                                      style={{
                                        padding: "8px 18px",
                                        border: "1px solid",
                                        borderColor: isSelected ? "#ED2027" : "#ddd",
                                        borderRadius: 20,
                                        background: isSelected ? "#ED2027" : "#fff",
                                        color: isSelected ? "#fff" : "#333",
                                        cursor: "pointer",
                                        fontSize: 14,
                                        fontWeight: isSelected ? 600 : 500,
                                        transition: "all 0.15s ease",
                                      }}

                                      onMouseOut={(e) => !isSelected && (e.currentTarget.style.borderColor = "#ddd")}
                                    >
                                      {type}
                                    </button>
                                  );
                                }
                              )}
                            </div>
                          </div>

                          {/* Rent Details */}
                          <div className="step3-section">
                            <h6 className="step3-subheader">Rent Details</h6>
                            <div className="step3-price-group">
                              <input
                                type="number"
                                placeholder="₹ Expected Rent"
                                value={expectedRent}
                                onChange={(e) => setExpectedRent(e.target.value)}
                                className={`step3-input ${!expectedRent ? "error-border" : ""}`}
                              />
                            </div>
                            <small className="step3-subnote">₹ Price in words</small>

                            {/* Checkboxes */}
                            <div className="step3-checkbox-group">
                              <label className="step3-checkbox-label">
                                <input
                                  type="checkbox"
                                  checked={elecWaterExcluded}
                                  onChange={(e) => setElecWaterExcluded(e.target.checked)}
                                  className="step3-checkbox"
                                />
                                Electricity & Water charges excluded
                              </label>
                              <label className="step3-checkbox-label">
                                <input
                                  type="checkbox"
                                  checked={priceNegotiable}
                                  onChange={(e) => setPriceNegotiable(e.target.checked)}
                                  className="step3-checkbox"
                                />
                                Price Negotiable
                              </label>
                            </div>
                          </div>
                          {/* Additional Price Details */}
                          <div className="step3-section">
                            <button
                              type="button"
                              onClick={() => setShowAdditionalPricing((prev) => !prev)}
                              className="step3-toggle-btn"
                            >
                              {showAdditionalPricing
                                ? "− Hide  more Rent Details"
                                : "+ Add more Rent Details (Optional)"}
                            </button>

                            {showAdditionalPricing && (
                              <div className="step3-additional-fields">
                                {/* Maintenance + unit */}
                                <div className="step3-input-group">
                                  <input
                                    type="number"
                                    placeholder="Maintenance"
                                    value={maintenance}
                                    onChange={(e) => setMaintenance(e.target.value)}
                                    className="step3-input"
                                  />
                                  <select
                                    value={maintenanceUnit}
                                    onChange={(e) => setMaintenanceUnit(e.target.value)}
                                    className="step3-unit-select"
                                  >
                                    <option value="">Select</option>
                                    <option value="Monthly">Monthly</option>
                                    <option value="Annually">Annually</option>
                                    <option value="One Time">One Time</option>
                                    <option value="Per Unit">Per Unit</option>
                                  </select>
                                </div>

                                {/* Booking Amount */}
                                <input
                                  type="number"
                                  placeholder="Booking Amount"
                                  value={bookingAmount}
                                  onChange={(e) => setBookingAmount(e.target.value)}
                                  className="step3-input"
                                />

                                {/* Membership Charge */}
                                <input
                                  type="number"
                                  placeholder="Membership Charge"
                                  value={membershipCharge}
                                  onChange={(e) => setMembershipCharge(e.target.value)}
                                  className="step3-input"
                                />
                              </div>
                            )}
                          </div>


                          {/* Preferred Agreement Type */}
                          <div className="step3-section">
                            <label className="step3-label">Preferred agreement type</label>
                            <div className="step3-button-group">
                              {["Company lease agreement", "Any"].map((type) => (
                                <button
                                  key={type}
                                  type="button"
                                  onClick={() => setAgreementType(type)}
                                  className={`step3-option-btn ${agreementType === type ? "active" : ""
                                    }`}
                                >
                                  {type}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Previously the property used for */}
                          <div className="step2-section mt-3">
                            <label className="step2-label">Previously the property was used for?</label>
                            <input
                              type="text"
                              className="step2-input"
                              placeholder="e.g. Office, Retail, Warehouse"

                            />
                          </div>

                          <div className="mt-3" style={{ marginBottom: 20 }}>
                            <label style={{ fontWeight: 600, display: "block", marginBottom: 10 }}>
                              Is your office fire NOC Certified?
                            </label>


                            <div style={{ display: "flex", gap: 20 }}>
                              <label
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 8,
                                  cursor: "pointer",
                                  accentColor: "#ED2027",
                                  fontWeight: 500,
                                }}
                              >
                                <input
                                  type="radio"

                                  value="yes"

                                />
                                Yes
                              </label>

                              <label
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 8,
                                  cursor: "pointer",
                                  accentColor: "#ED2027",
                                  fontWeight: 500,
                                }}
                              >
                                <input
                                  type="radio"

                                  value="no"

                                />
                                No
                              </label>
                            </div>
                          </div>




                          <div style={{ marginBottom: 20 }}>
                            <label style={{ fontWeight: 600, display: "block", marginBottom: 10 }}>
                              Do you charge brokerage?
                            </label>


                            <div style={{ display: "flex", gap: 20 }}>
                              <label
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 8,
                                  cursor: "pointer",
                                  accentColor: "#ED2027",
                                  fontWeight: brokerage === "yes" ? 600 : 500,
                                }}
                              >
                                <input
                                  type="radio"
                                  name="brokerage"
                                  value="yes"
                                  checked={brokerage === "yes"}
                                  onChange={() => setBrokerage("yes")}
                                />
                                Yes
                              </label>

                              <label
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 8,
                                  cursor: "pointer",
                                  accentColor: "#ED2027",
                                  fontWeight: brokerage === "no" ? 600 : 500,
                                }}
                              >
                                <input
                                  type="radio"
                                  name="brokerage"
                                  value="no"
                                  checked={brokerage === "no"}
                                  onChange={() => setBrokerage("no")}
                                />
                                No
                              </label>
                            </div>


                            {brokerage === "yes" && (
                              <div style={{ marginTop: 15 }}>
                                <input
                                  type="text"
                                  placeholder="Enter Brokerage Amount"
                                  value={brokerageAmount}
                                  onChange={(e) => setBrokerageAmount(e.target.value)}
                                  style={{
                                    width: "100%",
                                    padding: 10,
                                    border: "1px solid #ccc",
                                    borderRadius: 4,
                                    fontSize: 14,
                                    transition: "border-color 0.15s ease",
                                  }}
                                  onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                  onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                                />
                              </div>
                            )}
                          </div>


                          <div style={{ marginBottom: 20 }}>
                            <label style={{ fontWeight: 600, display: "block", marginBottom: 10 }}>
                              What makes your property unique
                            </label>
                            <textarea
                              placeholder="Add a description..."
                              rows={4}
                              value={description}
                              onChange={(e) => {
                                const onlyWords = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // removes numbers & special chars
                                setDescription(onlyWords);
                              }}
                              style={{
                                width: "100%",
                                padding: 10,
                                border: "1px solid #ccc",
                                borderRadius: 4,
                                fontSize: 14,
                                transition: "border-color 0.15s ease",
                              }}
                              onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                              onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                            />
                            <small style={{ display: "block", marginTop: 6, color: "#888" }}>
                              Minimum 30 characters required
                            </small>
                          </div>



                          <div>
                            <button
                              type="button"
                              onClick={handleStep5Continue}
                              style={{
                                backgroundColor: "#ED2027",
                                color: "#fff",
                                padding: "12px 28px",
                                borderRadius: 6,
                                fontWeight: 600,
                                border: "none",
                                cursor: "pointer",
                                fontSize: 15,
                                transition: "background-color 0.15s ease",
                              }}
                              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#c41b21")}
                              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ED2027")}
                            >
                              Continue
                            </button>
                          </div>
                        </>
                      )}
                  </>
                )}

                {/*Co OFFICE */}
                {(listingType === "Sell" || listingType === "Joint Venture") && (
                  <>

                    {propertyType === "Commercial" &&
                      subPropertyType === "Office" &&
                      subPropertyQuestionOption === "Co-working office space" && (
                        <>
                          <h4 style={{ color: "#333", fontWeight: 600, fontSize: 18, marginBottom: 20 }}>
                            Add pricing and details...
                          </h4>


                          <div style={{ marginBottom: 20 }}>
                            <label style={{ fontWeight: 600, display: "block", marginBottom: 10 }}>
                              Ownership
                            </label>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                              {["Freehold", "Leasehold", "Co-operative society", "Power of Attorney"].map(
                                (type) => {
                                  const isSelected = selectedOwnership === type;
                                  return (
                                    <button
                                      key={type}
                                      type="button"
                                      onClick={() => setSelectedOwnership(type)}
                                      style={{
                                        padding: "8px 18px",
                                        border: "1px solid",
                                        borderColor: isSelected ? "#ED2027" : "#ddd",
                                        borderRadius: 20,
                                        background: isSelected ? "#ED2027" : "#fff",
                                        color: isSelected ? "#fff" : "#333",
                                        cursor: "pointer",
                                        fontSize: 14,
                                        fontWeight: isSelected ? 600 : 500,
                                        transition: "all 0.15s ease",
                                      }}

                                      onMouseOut={(e) => !isSelected && (e.currentTarget.style.borderColor = "#ddd")}
                                    >
                                      {type}
                                    </button>
                                  );
                                }
                              )}
                            </div>
                          </div>

                          <div style={{ marginBottom: 20 }}>
                            <label style={{ fontWeight: 600, display: "block", marginBottom: 10 }}>
                              Price Details
                            </label>

                            <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                              <input
                                type="text"
                                placeholder="Expected Price"
                                value={expectedPrice}
                                onChange={(e) => setExpectedPrice(e.target.value)}
                                style={{
                                  flex: 1,
                                  padding: 10,
                                  border: "1px solid #ccc",
                                  borderRadius: 4,
                                  fontSize: 14,
                                  transition: "border-color 0.15s ease",
                                }}
                                onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                              />
                              <input
                                type="text"
                                placeholder="Price per sq.yards"
                                value={pricePerSqYards}
                                onChange={(e) => setPricePerSqYards(e.target.value)}
                                style={{
                                  flex: 1,
                                  padding: 10,
                                  border: "1px solid #ccc",
                                  borderRadius: 4,
                                  fontSize: 14,
                                  transition: "border-color 0.15s ease",
                                }}
                                onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                              />
                            </div>




                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                              <label
                                style={{
                                  fontSize: 14,
                                  accentColor: "#ED2027",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={checkboxes.allInclusive}
                                  onChange={() => toggleCheckbox("allInclusive")}
                                />
                                All inclusive price
                              </label>

                              <label
                                style={{
                                  fontSize: 14,
                                  accentColor: "#ED2027",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={checkboxes.taxExcluded}
                                  onChange={() => toggleCheckbox("taxExcluded")}
                                />
                                Tax and Govt. charges excluded
                              </label>

                              <label
                                style={{
                                  fontSize: 14,
                                  accentColor: "#ED2027",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={checkboxes.negotiable}
                                  onChange={() => toggleCheckbox("negotiable")}
                                />
                                Price Negotiable
                              </label>
                            </div>

                            <div style={{ marginBottom: 20, marginTop: 20 }}>

                              <div
                                style={{
                                  position: "relative",
                                  display: "inline-block",
                                  width: "100%",
                                  cursor: "pointer",
                                  border: "1px solid #ccc",
                                  borderRadius: 4,
                                  padding: "10px 40px 10px 16px",
                                  background: "#fff",
                                  fontSize: 14,
                                  color: "#333",
                                  userSelect: "none",
                                }}
                                onClick={() => setIsOpen(!isOpen)}
                                onMouseOver={(e) => (e.currentTarget.style.borderColor = "#ED2027")}
                                onMouseOut={(e) => (e.currentTarget.style.borderColor = "#ccc")}
                              >
                                <span>{isOpen ? "Close Pricing Details" : "Add More Pricing Details"}</span>
                                <span
                                  style={{
                                    position: "absolute",
                                    right: 12,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    fontSize: 12,
                                    pointerEvents: "none",
                                  }}
                                >
                                  {isOpen ? "▲" : "▼"}
                                </span>
                              </div>


                              {isOpen && (
                                <div style={{ marginTop: 20 }}>
                                  <label
                                    style={{
                                      fontWeight: 600,
                                      display: "block",
                                      marginBottom: 10,
                                    }}
                                  >
                                    Additional Pricing Details (Optional)
                                  </label>


                                  <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                                    <input
                                      type="text"
                                      placeholder="Maintenance"
                                      value={maintenance}
                                      onChange={(e) => setMaintenance(e.target.value)}
                                      style={{
                                        flex: 1,
                                        padding: 10,
                                        border: "1px solid #ccc",
                                        borderRadius: 4,
                                        fontSize: 14,
                                      }}
                                      onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                      onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                                    />

                                    <select
                                      value={maintenanceFreq}
                                      onChange={(e) => setMaintenanceFreq(e.target.value)}
                                      style={{
                                        width: 160,
                                        padding: 10,
                                        border: "1px solid #ccc",
                                        borderRadius: 4,
                                        fontSize: 14,
                                        background: "#fff",
                                      }}
                                      onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                      onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                                    >
                                      <option>Monthly</option>
                                      <option>Quarterly</option>
                                      <option>Yearly</option>
                                    </select>
                                  </div>


                                  <input
                                    type="text"
                                    placeholder="Expected rental"
                                    value={expectedRental}
                                    onChange={(e) => setExpectedRental(e.target.value)}
                                    style={{
                                      width: "100%",
                                      padding: 10,
                                      marginBottom: 10,
                                      border: "1px solid #ccc",
                                      borderRadius: 4,
                                      fontSize: 14,
                                    }}
                                    onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                    onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                                  />


                                  <input
                                    type="text"
                                    placeholder="Booking Amount"
                                    value={bookingAmount}
                                    onChange={(e) => setBookingAmount(e.target.value)}
                                    style={{
                                      width: "100%",
                                      padding: 10,
                                      marginBottom: 10,
                                      border: "1px solid #ccc",
                                      borderRadius: 4,
                                      fontSize: 14,
                                    }}
                                    onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                    onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                                  />


                                  <input
                                    type="text"
                                    placeholder="Annual dues payable"
                                    value={annualDues}
                                    onChange={(e) => setAnnualDues(e.target.value)}
                                    style={{
                                      width: "100%",
                                      padding: 10,
                                      marginBottom: 10,
                                      border: "1px solid #ccc",
                                      borderRadius: 4,
                                      fontSize: 14,
                                    }}
                                    onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                    onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                                  />
                                </div>
                              )}
                            </div>

                            <div style={{ marginBottom: 20 }}>
                              <label style={{ fontWeight: 600, display: "block", marginBottom: 10 }}>
                                What makes your property unique
                              </label>
                              <textarea
                                placeholder="Add a description..."
                                rows={4}
                                value={description}
                                onChange={(e) => {
                                  const onlyWords = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // removes numbers & special chars
                                  setDescription(onlyWords);
                                }}
                                style={{
                                  width: "100%",
                                  padding: 10,
                                  border: "1px solid #ccc",
                                  borderRadius: 4,
                                  fontSize: 14,
                                  transition: "border-color 0.15s ease",
                                }}
                                onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                              />
                              <small style={{ display: "block", marginTop: 6, color: "#888" }}>
                                Minimum 30 characters required
                              </small>
                            </div>



                            <div>
                              <button
                                type="button"
                                onClick={handleStep5Continue}
                                style={{
                                  backgroundColor: "#ED2027",
                                  color: "#fff",
                                  padding: "12px 28px",
                                  borderRadius: 6,
                                  fontWeight: 600,
                                  border: "none",
                                  cursor: "pointer",
                                  fontSize: 15,
                                  transition: "background-color 0.15s ease",
                                }}
                                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#c41b21")}
                                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ED2027")}
                              >
                                Continue
                              </button>
                            </div>
                          </div>
                        </>
                      )
                    }
                  </>
                )}

                {listingType === "Rent" && (
                  <>

                    {propertyType === "Commercial" &&
                      subPropertyType === "Office" &&
                      subPropertyQuestionOption === "Co-working office space" && (
                        <>

                          <h4 style={{ color: "#333", fontWeight: 600, fontSize: 18, marginBottom: 20 }}>
                            Add pricing and details...
                          </h4>
                          {/* Rent Details */}
                          <div className="step3-section">
                            <h6 className="step3-subheader">Rent Details</h6>
                            <div className="step3-price-group">
                              <input
                                type="number"
                                placeholder="₹ Expected Rent"
                                value={expectedRent}
                                onChange={(e) => setExpectedRent(e.target.value)}
                                className={`step3-input ${!expectedRent ? "error-border" : ""}`}
                              />
                            </div>
                            <small className="step3-subnote">₹ Price in words</small>

                            {/* Checkboxes */}
                            <div className="step3-checkbox-group">
                              <label className="step3-checkbox-label">
                                <input
                                  type="checkbox"
                                  checked={elecWaterExcluded}
                                  onChange={(e) => setElecWaterExcluded(e.target.checked)}
                                  className="step3-checkbox"
                                />
                                Electricity & Water charges excluded
                              </label>
                              <label className="step3-checkbox-label">
                                <input
                                  type="checkbox"
                                  checked={priceNegotiable}
                                  onChange={(e) => setPriceNegotiable(e.target.checked)}
                                  className="step3-checkbox"
                                />
                                Price Negotiable
                              </label>
                            </div>
                          </div>
                          {/* Additional Price Details */}
                          <div className="step3-section">
                            <button
                              type="button"
                              onClick={() => setShowAdditionalPricing((prev) => !prev)}
                              className="step3-toggle-btn"
                            >
                              {showAdditionalPricing
                                ? "− Hide  more Rent Details"
                                : "+ Add more Rent Details (Optional)"}
                            </button>

                            {showAdditionalPricing && (
                              <div className="step3-additional-fields">
                                {/* Maintenance + unit */}
                                <div className="step3-input-group">
                                  <input
                                    type="number"
                                    placeholder="Maintenance"
                                    value={maintenance}
                                    onChange={(e) => setMaintenance(e.target.value)}
                                    className="step3-input"
                                  />
                                  <select
                                    value={maintenanceUnit}
                                    onChange={(e) => setMaintenanceUnit(e.target.value)}
                                    className="step3-unit-select"
                                  >
                                    <option value="">Select</option>
                                    <option value="Monthly">Monthly</option>
                                    <option value="Annually">Annually</option>
                                    <option value="One Time">One Time</option>
                                    <option value="Per Unit">Per Unit</option>
                                  </select>
                                </div>

                                {/* Booking Amount */}
                                <input
                                  type="number"
                                  placeholder="Booking Amount"
                                  value={bookingAmount}
                                  onChange={(e) => setBookingAmount(e.target.value)}
                                  className="step3-input"
                                />

                                {/* Membership Charge */}
                                <input
                                  type="number"
                                  placeholder="Membership Charge"
                                  value={membershipCharge}
                                  onChange={(e) => setMembershipCharge(e.target.value)}
                                  className="step3-input"
                                />
                              </div>
                            )}
                          </div>

                          <div style={{ marginBottom: 20 }}>
                            <label style={{ fontWeight: 600, display: "block", marginBottom: 10 }}>
                              What makes your property unique
                            </label>
                            <textarea
                              placeholder="Add a description..."
                              rows={4}
                              value={description}
                              onChange={(e) => {
                                const onlyWords = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // removes numbers & special chars
                                setDescription(onlyWords);
                              }}
                              style={{
                                width: "100%",
                                padding: 10,
                                border: "1px solid #ccc",
                                borderRadius: 4,
                                fontSize: 14,
                                transition: "border-color 0.15s ease",
                              }}
                              onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                              onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                            />
                            <small style={{ display: "block", marginTop: 6, color: "#888" }}>
                              Minimum 30 characters required
                            </small>
                          </div>



                          <div>
                            <button
                              type="button"
                              onClick={handleStep5Continue}
                              style={{
                                backgroundColor: "#ED2027",
                                color: "#fff",
                                padding: "12px 28px",
                                borderRadius: 6,
                                fontWeight: 600,
                                border: "none",
                                cursor: "pointer",
                                fontSize: 15,
                                transition: "background-color 0.15s ease",
                              }}
                              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#c41b21")}
                              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ED2027")}
                            >
                              Continue
                            </button>
                          </div>
                        </>
                      )
                    }
                  </>
                )}

                {(listingType === "Sell" || listingType === "Joint Venture") && (
                  <>
                    {propertyType === "Commercial" &&
                      subPropertyType === "Retail" &&
                      (subPropertyQuestionOption === "Commercial Shops" ||
                        subPropertyQuestionOption === "Commercial Showrooms") && (
                        <>
                          <h4 style={{ color: "#333", fontWeight: 600, fontSize: 18, marginBottom: 20 }}>
                            Add pricing and details...
                          </h4>


                          <div style={{ marginBottom: 20 }}>
                            <label style={{ fontWeight: 600, display: "block", marginBottom: 10 }}>
                              Ownership
                            </label>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                              {["Freehold", "Leasehold", "Co-operative society", "Power of Attorney"].map(
                                (type) => {
                                  const isSelected = selectedOwnership === type;
                                  return (
                                    <button
                                      key={type}
                                      type="button"
                                      onClick={() => setSelectedOwnership(type)}
                                      style={{
                                        padding: "8px 18px",
                                        border: "1px solid",
                                        borderColor: isSelected ? "#ED2027" : "#ddd",
                                        borderRadius: 20,
                                        background: isSelected ? "#ED2027" : "#fff",
                                        color: isSelected ? "#fff" : "#333",
                                        cursor: "pointer",
                                        fontSize: 14,
                                        fontWeight: isSelected ? 600 : 500,
                                        transition: "all 0.15s ease",
                                      }}

                                      onMouseOut={(e) => !isSelected && (e.currentTarget.style.borderColor = "#ddd")}
                                    >
                                      {type}
                                    </button>
                                  );
                                }
                              )}
                            </div>
                          </div>

                          <div style={{ marginBottom: 20 }}>
                            <label style={{ fontWeight: 600, display: "block", marginBottom: 10 }}>
                              Price Details
                            </label>

                            <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                              <input
                                type="text"
                                placeholder="Expected Price"
                                value={expectedPrice}
                                onChange={(e) => setExpectedPrice(e.target.value)}
                                style={{
                                  flex: 1,
                                  padding: 10,
                                  border: "1px solid #ccc",
                                  borderRadius: 4,
                                  fontSize: 14,
                                  transition: "border-color 0.15s ease",
                                }}
                                onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                              />
                              <input
                                type="text"
                                placeholder="Price per sq.yards"
                                value={pricePerSqYards}
                                onChange={(e) => setPricePerSqYards(e.target.value)}
                                style={{
                                  flex: 1,
                                  padding: 10,
                                  border: "1px solid #ccc",
                                  borderRadius: 4,
                                  fontSize: 14,
                                  transition: "border-color 0.15s ease",
                                }}
                                onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                              />
                            </div>




                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                              <label
                                style={{
                                  fontSize: 14,
                                  accentColor: "#ED2027",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={checkboxes.allInclusive}
                                  onChange={() => toggleCheckbox("allInclusive")}
                                />
                                All inclusive price
                              </label>

                              <label
                                style={{
                                  fontSize: 14,
                                  accentColor: "#ED2027",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={checkboxes.taxExcluded}
                                  onChange={() => toggleCheckbox("taxExcluded")}
                                />
                                Tax and Govt. charges excluded
                              </label>

                              <label
                                style={{
                                  fontSize: 14,
                                  accentColor: "#ED2027",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={checkboxes.negotiable}
                                  onChange={() => toggleCheckbox("negotiable")}
                                />
                                Price Negotiable
                              </label>
                            </div>

                            <div style={{ marginBottom: 20, marginTop: 20 }}>

                              <div
                                style={{
                                  position: "relative",
                                  display: "inline-block",
                                  width: "100%",
                                  cursor: "pointer",
                                  border: "1px solid #ccc",
                                  borderRadius: 4,
                                  padding: "10px 40px 10px 16px",
                                  background: "#fff",
                                  fontSize: 14,
                                  color: "#333",
                                  userSelect: "none",
                                }}
                                onClick={() => setIsOpen(!isOpen)}
                                onMouseOver={(e) => (e.currentTarget.style.borderColor = "#ED2027")}
                                onMouseOut={(e) => (e.currentTarget.style.borderColor = "#ccc")}
                              >
                                <span>{isOpen ? "Close Pricing Details" : "Add More Pricing Details"}</span>
                                <span
                                  style={{
                                    position: "absolute",
                                    right: 12,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    fontSize: 12,
                                    pointerEvents: "none",
                                  }}
                                >
                                  {isOpen ? "▲" : "▼"}
                                </span>
                              </div>


                              {isOpen && (
                                <div style={{ marginTop: 20 }}>
                                  <label
                                    style={{
                                      fontWeight: 600,
                                      display: "block",
                                      marginBottom: 10,
                                    }}
                                  >
                                    Additional Pricing Details (Optional)
                                  </label>


                                  <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                                    <input
                                      type="text"
                                      placeholder="Maintenance"
                                      value={maintenance}
                                      onChange={(e) => setMaintenance(e.target.value)}
                                      style={{
                                        flex: 1,
                                        padding: 10,
                                        border: "1px solid #ccc",
                                        borderRadius: 4,
                                        fontSize: 14,
                                      }}
                                      onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                      onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                                    />

                                    <select
                                      value={maintenanceFreq}
                                      onChange={(e) => setMaintenanceFreq(e.target.value)}
                                      style={{
                                        width: 160,
                                        padding: 10,
                                        border: "1px solid #ccc",
                                        borderRadius: 4,
                                        fontSize: 14,
                                        background: "#fff",
                                      }}
                                      onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                      onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                                    >
                                      <option>Monthly</option>
                                      <option>Quarterly</option>
                                      <option>Yearly</option>
                                    </select>
                                  </div>


                                  <input
                                    type="text"
                                    placeholder="Expected rental"
                                    value={expectedRental}
                                    onChange={(e) => setExpectedRental(e.target.value)}
                                    style={{
                                      width: "100%",
                                      padding: 10,
                                      marginBottom: 10,
                                      border: "1px solid #ccc",
                                      borderRadius: 4,
                                      fontSize: 14,
                                    }}
                                    onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                    onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                                  />


                                  <input
                                    type="text"
                                    placeholder="Booking Amount"
                                    value={bookingAmount}
                                    onChange={(e) => setBookingAmount(e.target.value)}
                                    style={{
                                      width: "100%",
                                      padding: 10,
                                      marginBottom: 10,
                                      border: "1px solid #ccc",
                                      borderRadius: 4,
                                      fontSize: 14,
                                    }}
                                    onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                    onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                                  />


                                  <input
                                    type="text"
                                    placeholder="Annual dues payable"
                                    value={annualDues}
                                    onChange={(e) => setAnnualDues(e.target.value)}
                                    style={{
                                      width: "100%",
                                      padding: 10,
                                      marginBottom: 10,
                                      border: "1px solid #ccc",
                                      borderRadius: 4,
                                      fontSize: 14,
                                    }}
                                    onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                    onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                                  />
                                </div>
                              )}
                            </div>

                            <div style={{ marginBottom: 20 }}>
                              <label style={{ fontWeight: 600, display: "block", marginBottom: 10 }}>
                                What makes your property unique
                              </label>
                              <textarea
                                placeholder="Add a description..."
                                rows={4}
                                value={description}
                                onChange={(e) => {
                                  const onlyWords = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // removes numbers & special chars
                                  setDescription(onlyWords);
                                }}
                                style={{
                                  width: "100%",
                                  padding: 10,
                                  border: "1px solid #ccc",
                                  borderRadius: 4,
                                  fontSize: 14,
                                  transition: "border-color 0.15s ease",
                                }}
                                onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                              />
                              <small style={{ display: "block", marginTop: 6, color: "#888" }}>
                                Minimum 30 characters required
                              </small>
                            </div>



                            <div>
                              <button
                                type="button"
                                onClick={handleStep5Continue}
                                style={{
                                  backgroundColor: "#ED2027",
                                  color: "#fff",
                                  padding: "12px 28px",
                                  borderRadius: 6,
                                  fontWeight: 600,
                                  border: "none",
                                  cursor: "pointer",
                                  fontSize: 15,
                                  transition: "background-color 0.15s ease",
                                }}
                                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#c41b21")}
                                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ED2027")}
                              >
                                Continue
                              </button>
                            </div>
                          </div>
                        </>
                      )}

                  </>
                )}


                {listingType === "Rent" && (
                  <>

                    {propertyType === "Commercial" &&
                      subPropertyType === "Retail" &&
                      (subPropertyQuestionOption === "Commercial Shops" ||
                        subPropertyQuestionOption === "Commercial Showrooms") && (

                        <>

                          <h4 style={{ color: "#333", fontWeight: 600, fontSize: 18, marginBottom: 20 }}>
                            Add pricing and details...
                          </h4>
                          {/* Rent Details */}
                          <div className="step3-section">
                            <h6 className="step3-subheader">Rent Details</h6>
                            <div className="step3-price-group">
                              <input
                                type="number"
                                placeholder="₹ Expected Rent"
                                value={expectedRent}
                                onChange={(e) => setExpectedRent(e.target.value)}
                                className={`step3-input ${!expectedRent ? "error-border" : ""}`}
                              />
                            </div>
                            <small className="step3-subnote">₹ Price in words</small>

                            {/* Checkboxes */}
                            <div className="step3-checkbox-group">
                              <label className="step3-checkbox-label">
                                <input
                                  type="checkbox"
                                  checked={elecWaterExcluded}
                                  onChange={(e) => setElecWaterExcluded(e.target.checked)}
                                  className="step3-checkbox"
                                />
                                Electricity & Water charges excluded
                              </label>
                              <label className="step3-checkbox-label">
                                <input
                                  type="checkbox"
                                  checked={priceNegotiable}
                                  onChange={(e) => setPriceNegotiable(e.target.checked)}
                                  className="step3-checkbox"
                                />
                                Price Negotiable
                              </label>
                            </div>
                          </div>
                          {/* Additional Price Details */}
                          <div className="step3-section">
                            <button
                              type="button"
                              onClick={() => setShowAdditionalPricing((prev) => !prev)}
                              className="step3-toggle-btn"
                            >
                              {showAdditionalPricing
                                ? "− Hide  more Rent Details"
                                : "+ Add more Rent Details (Optional)"}
                            </button>

                            {showAdditionalPricing && (
                              <div className="step3-additional-fields">
                                {/* Maintenance + unit */}
                                <div className="step3-input-group">
                                  <input
                                    type="number"
                                    placeholder="Maintenance"
                                    value={maintenance}
                                    onChange={(e) => setMaintenance(e.target.value)}
                                    className="step3-input"
                                  />
                                  <select
                                    value={maintenanceUnit}
                                    onChange={(e) => setMaintenanceUnit(e.target.value)}
                                    className="step3-unit-select"
                                  >
                                    <option value="">Select</option>
                                    <option value="Monthly">Monthly</option>
                                    <option value="Annually">Annually</option>
                                    <option value="One Time">One Time</option>
                                    <option value="Per Unit">Per Unit</option>
                                  </select>
                                </div>

                                {/* Booking Amount */}
                                <input
                                  type="number"
                                  placeholder="Booking Amount"
                                  value={bookingAmount}
                                  onChange={(e) => setBookingAmount(e.target.value)}
                                  className="step3-input"
                                />

                                {/* Membership Charge */}
                                <input
                                  type="number"
                                  placeholder="Membership Charge"
                                  value={membershipCharge}
                                  onChange={(e) => setMembershipCharge(e.target.value)}
                                  className="step3-input"
                                />
                              </div>
                            )}
                          </div>

                          <div style={{ marginBottom: 20 }}>
                            <label style={{ fontWeight: 600, display: "block", marginBottom: 10 }}>
                              What makes your property unique
                            </label>
                            <textarea
                              placeholder="Add a description..."
                              rows={4}
                              value={description}
                              onChange={(e) => {
                                const onlyWords = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // removes numbers & special chars
                                setDescription(onlyWords);
                              }}
                              style={{
                                width: "100%",
                                padding: 10,
                                border: "1px solid #ccc",
                                borderRadius: 4,
                                fontSize: 14,
                                transition: "border-color 0.15s ease",
                              }}
                              onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                              onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                            />
                            <small style={{ display: "block", marginTop: 6, color: "#888" }}>
                              Minimum 30 characters required
                            </small>
                          </div>



                          <div>
                            <button
                              type="button"
                              onClick={handleStep5Continue}
                              style={{
                                backgroundColor: "#ED2027",
                                color: "#fff",
                                padding: "12px 28px",
                                borderRadius: 6,
                                fontWeight: 600,
                                border: "none",
                                cursor: "pointer",
                                fontSize: 15,
                                transition: "background-color 0.15s ease",
                              }}
                              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#c41b21")}
                              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ED2027")}
                            >
                              Continue
                            </button>
                          </div>
                        </>

                      )}
                  </>
                )}


                {listingType === "Sell" && (
                  <>
                    {propertyType === "Commercial" &&
                      subPropertyType === "Plot" &&
                      (
                        subPropertyQuestionOption === "Commercial Land/inst.Land" ||
                        subPropertyQuestionOption === "Agriculture/Farm Land" ||
                        subPropertyQuestionOption === "Industrial Lands/Plots"
                      ) && (

                        <>
                          <h4 style={{ color: "#333", fontWeight: 600, fontSize: 18, marginBottom: 20 }}>
                            Add pricing and details...
                          </h4>


                          <div style={{ marginBottom: 20 }}>
                            <label style={{ fontWeight: 600, display: "block", marginBottom: 10 }}>
                              Ownership
                            </label>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                              {["Freehold", "Leasehold", "Co-operative society", "Power of Attorney"].map(
                                (type) => {
                                  const isSelected = selectedOwnership === type;
                                  return (
                                    <button
                                      key={type}
                                      type="button"
                                      onClick={() => setSelectedOwnership(type)}
                                      style={{
                                        padding: "8px 18px",
                                        border: "1px solid",
                                        borderColor: isSelected ? "#ED2027" : "#ddd",
                                        borderRadius: 20,
                                        background: isSelected ? "#ED2027" : "#fff",
                                        color: isSelected ? "#fff" : "#333",
                                        cursor: "pointer",
                                        fontSize: 14,
                                        fontWeight: isSelected ? 600 : 500,
                                        transition: "all 0.15s ease",
                                      }}

                                      onMouseOut={(e) => !isSelected && (e.currentTarget.style.borderColor = "#ddd")}
                                    >
                                      {type}
                                    </button>
                                  );
                                }
                              )}
                            </div>
                          </div>

                          <div style={{ marginBottom: 20 }}>
                            <label style={{ fontWeight: 600, display: "block", marginBottom: 10 }}>
                              Price Details
                            </label>

                            <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                              <input
                                type="text"
                                placeholder="Expected Price"
                                value={expectedPrice}
                                onChange={(e) => setExpectedPrice(e.target.value)}
                                style={{
                                  flex: 1,
                                  padding: 10,
                                  border: "1px solid #ccc",
                                  borderRadius: 4,
                                  fontSize: 14,
                                  transition: "border-color 0.15s ease",
                                }}
                                onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                              />
                              <input
                                type="text"
                                placeholder="Price per sq.yards"
                                value={pricePerSqYards}
                                onChange={(e) => setPricePerSqYards(e.target.value)}
                                style={{
                                  flex: 1,
                                  padding: 10,
                                  border: "1px solid #ccc",
                                  borderRadius: 4,
                                  fontSize: 14,
                                  transition: "border-color 0.15s ease",
                                }}
                                onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                              />
                            </div>




                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                              <label
                                style={{
                                  fontSize: 14,
                                  accentColor: "#ED2027",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={checkboxes.allInclusive}
                                  onChange={() => toggleCheckbox("allInclusive")}
                                />
                                All inclusive price
                              </label>

                              <label
                                style={{
                                  fontSize: 14,
                                  accentColor: "#ED2027",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={checkboxes.taxExcluded}
                                  onChange={() => toggleCheckbox("taxExcluded")}
                                />
                                Tax and Govt. charges excluded
                              </label>

                              <label
                                style={{
                                  fontSize: 14,
                                  accentColor: "#ED2027",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={checkboxes.negotiable}
                                  onChange={() => toggleCheckbox("negotiable")}
                                />
                                Price Negotiable
                              </label>
                            </div>

                            <div style={{ marginBottom: 20, marginTop: 20 }}>

                              <div
                                style={{
                                  position: "relative",
                                  display: "inline-block",
                                  width: "100%",
                                  cursor: "pointer",
                                  border: "1px solid #ccc",
                                  borderRadius: 4,
                                  padding: "10px 40px 10px 16px",
                                  background: "#fff",
                                  fontSize: 14,
                                  color: "#333",
                                  userSelect: "none",
                                }}
                                onClick={() => setIsOpen(!isOpen)}
                                onMouseOver={(e) => (e.currentTarget.style.borderColor = "#ED2027")}
                                onMouseOut={(e) => (e.currentTarget.style.borderColor = "#ccc")}
                              >
                                <span>{isOpen ? "Close Pricing Details" : "Add More Pricing Details"}</span>
                                <span
                                  style={{
                                    position: "absolute",
                                    right: 12,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    fontSize: 12,
                                    pointerEvents: "none",
                                  }}
                                >
                                  {isOpen ? "▲" : "▼"}
                                </span>
                              </div>


                              {isOpen && (
                                <div style={{ marginTop: 20 }}>
                                  <label
                                    style={{
                                      fontWeight: 600,
                                      display: "block",
                                      marginBottom: 10,
                                    }}
                                  >
                                    Additional Pricing Details (Optional)
                                  </label>


                                  <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                                    <input
                                      type="text"
                                      placeholder="Maintenance"
                                      value={maintenance}
                                      onChange={(e) => setMaintenance(e.target.value)}
                                      style={{
                                        flex: 1,
                                        padding: 10,
                                        border: "1px solid #ccc",
                                        borderRadius: 4,
                                        fontSize: 14,
                                      }}
                                      onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                      onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                                    />

                                    <select
                                      value={maintenanceFreq}
                                      onChange={(e) => setMaintenanceFreq(e.target.value)}
                                      style={{
                                        width: 160,
                                        padding: 10,
                                        border: "1px solid #ccc",
                                        borderRadius: 4,
                                        fontSize: 14,
                                        background: "#fff",
                                      }}
                                      onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                      onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                                    >
                                      <option>Monthly</option>
                                      <option>Quarterly</option>
                                      <option>Yearly</option>
                                    </select>
                                  </div>


                                  <input
                                    type="text"
                                    placeholder="Expected rental"
                                    value={expectedRental}
                                    onChange={(e) => setExpectedRental(e.target.value)}
                                    style={{
                                      width: "100%",
                                      padding: 10,
                                      marginBottom: 10,
                                      border: "1px solid #ccc",
                                      borderRadius: 4,
                                      fontSize: 14,
                                    }}
                                    onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                    onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                                  />


                                  <input
                                    type="text"
                                    placeholder="Booking Amount"
                                    value={bookingAmount}
                                    onChange={(e) => setBookingAmount(e.target.value)}
                                    style={{
                                      width: "100%",
                                      padding: 10,
                                      marginBottom: 10,
                                      border: "1px solid #ccc",
                                      borderRadius: 4,
                                      fontSize: 14,
                                    }}
                                    onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                    onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                                  />


                                  <input
                                    type="text"
                                    placeholder="Annual dues payable"
                                    value={annualDues}
                                    onChange={(e) => setAnnualDues(e.target.value)}
                                    style={{
                                      width: "100%",
                                      padding: 10,
                                      marginBottom: 10,
                                      border: "1px solid #ccc",
                                      borderRadius: 4,
                                      fontSize: 14,
                                    }}
                                    onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                    onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                                  />
                                </div>
                              )}
                            </div>

                            <div style={{ marginBottom: 20 }}>
                              <label style={{ fontWeight: 600, display: "block", marginBottom: 10 }}>
                                What makes your property unique
                              </label>
                              <textarea
                                placeholder="Add a description..."
                                rows={4}
                                value={description}
                                onChange={(e) => {
                                  const onlyWords = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // removes numbers & special chars
                                  setDescription(onlyWords);
                                }}
                                style={{
                                  width: "100%",
                                  padding: 10,
                                  border: "1px solid #ccc",
                                  borderRadius: 4,
                                  fontSize: 14,
                                  transition: "border-color 0.15s ease",
                                }}
                                onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                              />
                              <small style={{ display: "block", marginTop: 6, color: "#888" }}>
                                Minimum 30 characters required
                              </small>
                            </div>



                            <div>
                              <button
                                type="button"
                                onClick={handleStep5Continue}
                                style={{
                                  backgroundColor: "#ED2027",
                                  color: "#fff",
                                  padding: "12px 28px",
                                  borderRadius: 6,
                                  fontWeight: 600,
                                  border: "none",
                                  cursor: "pointer",
                                  fontSize: 15,
                                  transition: "background-color 0.15s ease",
                                }}
                                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#c41b21")}
                                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ED2027")}
                              >
                                Continue
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                  </>
                )}

                {listingType === "Rent" && (
                  <>
                    {propertyType === "Commercial" &&
                      subPropertyType === "Plot" &&
                      (
                        subPropertyQuestionOption === "Commercial Land/inst.Land" ||
                        subPropertyQuestionOption === "Agriculture/Farm Land" ||
                        subPropertyQuestionOption === "Industrial Lands/Plots"
                      ) && (

                        <>
                          <h4 style={{ color: "#333", fontWeight: 600, fontSize: 18, marginBottom: 20 }}>
                            Add pricing and details...
                          </h4>
                          {/* Rent Details */}
                          <div className="step3-section">
                            <h6 className="step3-subheader">Rent Details</h6>
                            <div className="step3-price-group">
                              <input
                                type="number"
                                placeholder="₹ Expected Rent"
                                value={expectedRent}
                                onChange={(e) => setExpectedRent(e.target.value)}
                                className={`step3-input ${!expectedRent ? "error-border" : ""}`}
                              />
                            </div>
                            <small className="step3-subnote">₹ Price in words</small>

                            {/* Checkboxes */}
                            <div className="step3-checkbox-group">
                              <label className="step3-checkbox-label">
                                <input
                                  type="checkbox"
                                  checked={elecWaterExcluded}
                                  onChange={(e) => setElecWaterExcluded(e.target.checked)}
                                  className="step3-checkbox"
                                />
                                Electricity & Water charges excluded
                              </label>
                              <label className="step3-checkbox-label">
                                <input
                                  type="checkbox"
                                  checked={priceNegotiable}
                                  onChange={(e) => setPriceNegotiable(e.target.checked)}
                                  className="step3-checkbox"
                                />
                                Price Negotiable
                              </label>
                            </div>
                          </div>
                          {/* Additional Price Details */}
                          <div className="step3-section">
                            <button
                              type="button"
                              onClick={() => setShowAdditionalPricing((prev) => !prev)}
                              className="step3-toggle-btn"
                            >
                              {showAdditionalPricing
                                ? "− Hide  more Rent Details"
                                : "+ Add more Rent Details (Optional)"}
                            </button>

                            {showAdditionalPricing && (
                              <div className="step3-additional-fields">
                                {/* Maintenance + unit */}
                                <div className="step3-input-group">
                                  <input
                                    type="number"
                                    placeholder="Maintenance"
                                    value={maintenance}
                                    onChange={(e) => setMaintenance(e.target.value)}
                                    className="step3-input"
                                  />
                                  <select
                                    value={maintenanceUnit}
                                    onChange={(e) => setMaintenanceUnit(e.target.value)}
                                    className="step3-unit-select"
                                  >
                                    <option value="">Select</option>
                                    <option value="Monthly">Monthly</option>
                                    <option value="Annually">Annually</option>
                                    <option value="One Time">One Time</option>
                                    <option value="Per Unit">Per Unit</option>
                                  </select>
                                </div>

                                {/* Booking Amount */}
                                <input
                                  type="number"
                                  placeholder="Booking Amount"
                                  value={bookingAmount}
                                  onChange={(e) => setBookingAmount(e.target.value)}
                                  className="step3-input"
                                />

                                {/* Membership Charge */}
                                <input
                                  type="number"
                                  placeholder="Membership Charge"
                                  value={membershipCharge}
                                  onChange={(e) => setMembershipCharge(e.target.value)}
                                  className="step3-input"
                                />
                              </div>
                            )}
                          </div>

                          <div style={{ marginBottom: 20 }}>
                            <label style={{ fontWeight: 600, display: "block", marginBottom: 10 }}>
                              What makes your property unique
                            </label>
                            <textarea
                              placeholder="Add a description..."
                              rows={4}
                              value={description}
                              onChange={(e) => {
                                const onlyWords = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // removes numbers & special chars
                                setDescription(onlyWords);
                              }}
                              style={{
                                width: "100%",
                                padding: 10,
                                border: "1px solid #ccc",
                                borderRadius: 4,
                                fontSize: 14,
                                transition: "border-color 0.15s ease",
                              }}
                              onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                              onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                            />
                            <small style={{ display: "block", marginTop: 6, color: "#888" }}>
                              Minimum 30 characters required
                            </small>
                          </div>



                          <div>
                            <button
                              type="button"
                              onClick={handleStep5Continue}
                              style={{
                                backgroundColor: "#ED2027",
                                color: "#fff",
                                padding: "12px 28px",
                                borderRadius: 6,
                                fontWeight: 600,
                                border: "none",
                                cursor: "pointer",
                                fontSize: 15,
                                transition: "background-color 0.15s ease",
                              }}
                              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#c41b21")}
                              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ED2027")}
                            >
                              Continue
                            </button>
                          </div>

                        </>
                      )}

                  </>
                )}

                {listingType === "Sell" && (
                  <>
                    {propertyType === "Commercial" &&
                      subPropertyType === "Storage" &&
                      (subPropertyQuestionOption === "Ware House" ||
                        subPropertyQuestionOption === "Cold Storage") && (
                        <>

                          <h4 style={{ color: "#333", fontWeight: 600, fontSize: 18, marginBottom: 20 }}>
                            Add pricing and details...
                          </h4>


                          <div style={{ marginBottom: 20 }}>
                            <label style={{ fontWeight: 600, display: "block", marginBottom: 10 }}>
                              Ownership
                            </label>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                              {["Freehold", "Leasehold", "Co-operative society", "Power of Attorney"].map(
                                (type) => {
                                  const isSelected = selectedOwnership === type;
                                  return (
                                    <button
                                      key={type}
                                      type="button"
                                      onClick={() => setSelectedOwnership(type)}
                                      style={{
                                        padding: "8px 18px",
                                        border: "1px solid",
                                        borderColor: isSelected ? "#ED2027" : "#ddd",
                                        borderRadius: 20,
                                        background: isSelected ? "#ED2027" : "#fff",
                                        color: isSelected ? "#fff" : "#333",
                                        cursor: "pointer",
                                        fontSize: 14,
                                        fontWeight: isSelected ? 600 : 500,
                                        transition: "all 0.15s ease",
                                      }}

                                      onMouseOut={(e) => !isSelected && (e.currentTarget.style.borderColor = "#ddd")}
                                    >
                                      {type}
                                    </button>
                                  );
                                }
                              )}
                            </div>
                          </div>

                          <div style={{ marginBottom: 20 }}>
                            <label style={{ fontWeight: 600, display: "block", marginBottom: 10 }}>
                              Price Details
                            </label>

                            <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                              <input
                                type="text"
                                placeholder="Expected Price"
                                value={expectedPrice}
                                onChange={(e) => setExpectedPrice(e.target.value)}
                                style={{
                                  flex: 1,
                                  padding: 10,
                                  border: "1px solid #ccc",
                                  borderRadius: 4,
                                  fontSize: 14,
                                  transition: "border-color 0.15s ease",
                                }}
                                onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                              />
                              <input
                                type="text"
                                placeholder="Price per sq.yards"
                                value={pricePerSqYards}
                                onChange={(e) => setPricePerSqYards(e.target.value)}
                                style={{
                                  flex: 1,
                                  padding: 10,
                                  border: "1px solid #ccc",
                                  borderRadius: 4,
                                  fontSize: 14,
                                  transition: "border-color 0.15s ease",
                                }}
                                onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                              />
                            </div>




                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                              <label
                                style={{
                                  fontSize: 14,
                                  accentColor: "#ED2027",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={checkboxes.allInclusive}
                                  onChange={() => toggleCheckbox("allInclusive")}
                                />
                                All inclusive price
                              </label>

                              <label
                                style={{
                                  fontSize: 14,
                                  accentColor: "#ED2027",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={checkboxes.taxExcluded}
                                  onChange={() => toggleCheckbox("taxExcluded")}
                                />
                                Tax and Govt. charges excluded
                              </label>

                              <label
                                style={{
                                  fontSize: 14,
                                  accentColor: "#ED2027",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={checkboxes.negotiable}
                                  onChange={() => toggleCheckbox("negotiable")}
                                />
                                Price Negotiable
                              </label>
                            </div>

                            <div style={{ marginBottom: 20, marginTop: 20 }}>

                              <div
                                style={{
                                  position: "relative",
                                  display: "inline-block",
                                  width: "100%",
                                  cursor: "pointer",
                                  border: "1px solid #ccc",
                                  borderRadius: 4,
                                  padding: "10px 40px 10px 16px",
                                  background: "#fff",
                                  fontSize: 14,
                                  color: "#333",
                                  userSelect: "none",
                                }}
                                onClick={() => setIsOpen(!isOpen)}
                                onMouseOver={(e) => (e.currentTarget.style.borderColor = "#ED2027")}
                                onMouseOut={(e) => (e.currentTarget.style.borderColor = "#ccc")}
                              >
                                <span>{isOpen ? "Close Pricing Details" : "Add More Pricing Details"}</span>
                                <span
                                  style={{
                                    position: "absolute",
                                    right: 12,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    fontSize: 12,
                                    pointerEvents: "none",
                                  }}
                                >
                                  {isOpen ? "▲" : "▼"}
                                </span>
                              </div>


                              {isOpen && (
                                <div style={{ marginTop: 20 }}>
                                  <label
                                    style={{
                                      fontWeight: 600,
                                      display: "block",
                                      marginBottom: 10,
                                    }}
                                  >
                                    Additional Pricing Details (Optional)
                                  </label>


                                  <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                                    <input
                                      type="text"
                                      placeholder="Maintenance"
                                      value={maintenance}
                                      onChange={(e) => setMaintenance(e.target.value)}
                                      style={{
                                        flex: 1,
                                        padding: 10,
                                        border: "1px solid #ccc",
                                        borderRadius: 4,
                                        fontSize: 14,
                                      }}
                                      onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                      onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                                    />

                                    <select
                                      value={maintenanceFreq}
                                      onChange={(e) => setMaintenanceFreq(e.target.value)}
                                      style={{
                                        width: 160,
                                        padding: 10,
                                        border: "1px solid #ccc",
                                        borderRadius: 4,
                                        fontSize: 14,
                                        background: "#fff",
                                      }}
                                      onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                      onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                                    >
                                      <option>Monthly</option>
                                      <option>Quarterly</option>
                                      <option>Yearly</option>
                                    </select>
                                  </div>


                                  <input
                                    type="text"
                                    placeholder="Expected rental"
                                    value={expectedRental}
                                    onChange={(e) => setExpectedRental(e.target.value)}
                                    style={{
                                      width: "100%",
                                      padding: 10,
                                      marginBottom: 10,
                                      border: "1px solid #ccc",
                                      borderRadius: 4,
                                      fontSize: 14,
                                    }}
                                    onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                    onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                                  />


                                  <input
                                    type="text"
                                    placeholder="Booking Amount"
                                    value={bookingAmount}
                                    onChange={(e) => setBookingAmount(e.target.value)}
                                    style={{
                                      width: "100%",
                                      padding: 10,
                                      marginBottom: 10,
                                      border: "1px solid #ccc",
                                      borderRadius: 4,
                                      fontSize: 14,
                                    }}
                                    onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                    onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                                  />


                                  <input
                                    type="text"
                                    placeholder="Annual dues payable"
                                    value={annualDues}
                                    onChange={(e) => setAnnualDues(e.target.value)}
                                    style={{
                                      width: "100%",
                                      padding: 10,
                                      marginBottom: 10,
                                      border: "1px solid #ccc",
                                      borderRadius: 4,
                                      fontSize: 14,
                                    }}
                                    onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                    onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                                  />
                                </div>
                              )}
                            </div>

                            <div style={{ marginBottom: 20 }}>
                              <label style={{ fontWeight: 600, display: "block", marginBottom: 10 }}>
                                What makes your property unique
                              </label>
                              <textarea
                                placeholder="Add a description..."
                                rows={4}
                                value={description}
                                onChange={(e) => {
                                  const onlyWords = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // removes numbers & special chars
                                  setDescription(onlyWords);
                                }}
                                style={{
                                  width: "100%",
                                  padding: 10,
                                  border: "1px solid #ccc",
                                  borderRadius: 4,
                                  fontSize: 14,
                                  transition: "border-color 0.15s ease",
                                }}
                                onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                              />
                              <small style={{ display: "block", marginTop: 6, color: "#888" }}>
                                Minimum 30 characters required
                              </small>
                            </div>



                            <div>
                              <button
                                type="button"
                                onClick={handleStep5Continue}
                                style={{
                                  backgroundColor: "#ED2027",
                                  color: "#fff",
                                  padding: "12px 28px",
                                  borderRadius: 6,
                                  fontWeight: 600,
                                  border: "none",
                                  cursor: "pointer",
                                  fontSize: 15,
                                  transition: "background-color 0.15s ease",
                                }}
                                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#c41b21")}
                                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ED2027")}
                              >
                                Continue
                              </button>
                            </div>
                          </div></>
                      )}
                  </>
                )}

                {listingType === "Rent" && (
                  <>
                    {propertyType === "Commercial" &&
                      subPropertyType === "Storage" &&
                      (subPropertyQuestionOption === "Ware House" ||
                        subPropertyQuestionOption === "Cold Storage") && (
                        <>
                          <h4 style={{ color: "#333", fontWeight: 600, fontSize: 18, marginBottom: 20 }}>
                            Add pricing and details...
                          </h4>
                          {/* Rent Details */}
                          <div className="step3-section">
                            <h6 className="step3-subheader">Rent Details</h6>
                            <div className="step3-price-group">
                              <input
                                type="number"
                                placeholder="₹ Expected Rent"
                                value={expectedRent}
                                onChange={(e) => setExpectedRent(e.target.value)}
                                className={`step3-input ${!expectedRent ? "error-border" : ""}`}
                              />
                            </div>
                            <small className="step3-subnote">₹ Price in words</small>

                            {/* Checkboxes */}
                            <div className="step3-checkbox-group">
                              <label className="step3-checkbox-label">
                                <input
                                  type="checkbox"
                                  checked={elecWaterExcluded}
                                  onChange={(e) => setElecWaterExcluded(e.target.checked)}
                                  className="step3-checkbox"
                                />
                                Electricity & Water charges excluded
                              </label>
                              <label className="step3-checkbox-label">
                                <input
                                  type="checkbox"
                                  checked={priceNegotiable}
                                  onChange={(e) => setPriceNegotiable(e.target.checked)}
                                  className="step3-checkbox"
                                />
                                Price Negotiable
                              </label>
                            </div>
                          </div>
                          {/* Additional Price Details */}
                          <div className="step3-section">
                            <button
                              type="button"
                              onClick={() => setShowAdditionalPricing((prev) => !prev)}
                              className="step3-toggle-btn"
                            >
                              {showAdditionalPricing
                                ? "− Hide  more Rent Details"
                                : "+ Add more Rent Details (Optional)"}
                            </button>

                            {showAdditionalPricing && (
                              <div className="step3-additional-fields">
                                {/* Maintenance + unit */}
                                <div className="step3-input-group">
                                  <input
                                    type="number"
                                    placeholder="Maintenance"
                                    value={maintenance}
                                    onChange={(e) => setMaintenance(e.target.value)}
                                    className="step3-input"
                                  />
                                  <select
                                    value={maintenanceUnit}
                                    onChange={(e) => setMaintenanceUnit(e.target.value)}
                                    className="step3-unit-select"
                                  >
                                    <option value="">Select</option>
                                    <option value="Monthly">Monthly</option>
                                    <option value="Annually">Annually</option>
                                    <option value="One Time">One Time</option>
                                    <option value="Per Unit">Per Unit</option>
                                  </select>
                                </div>

                                {/* Booking Amount */}
                                <input
                                  type="number"
                                  placeholder="Booking Amount"
                                  value={bookingAmount}
                                  onChange={(e) => setBookingAmount(e.target.value)}
                                  className="step3-input"
                                />

                                {/* Membership Charge */}
                                <input
                                  type="number"
                                  placeholder="Membership Charge"
                                  value={membershipCharge}
                                  onChange={(e) => setMembershipCharge(e.target.value)}
                                  className="step3-input"
                                />
                              </div>
                            )}
                          </div>

                          <div style={{ marginBottom: 20 }}>
                            <label style={{ fontWeight: 600, display: "block", marginBottom: 10 }}>
                              What makes your property unique
                            </label>
                            <textarea
                              placeholder="Add a description..."
                              rows={4}
                              value={description}
                              onChange={(e) => {
                                const onlyWords = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // removes numbers & special chars
                                setDescription(onlyWords);
                              }}
                              style={{
                                width: "100%",
                                padding: 10,
                                border: "1px solid #ccc",
                                borderRadius: 4,
                                fontSize: 14,
                                transition: "border-color 0.15s ease",
                              }}
                              onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                              onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                            />
                            <small style={{ display: "block", marginTop: 6, color: "#888" }}>
                              Minimum 30 characters required
                            </small>
                          </div>



                          <div>
                            <button
                              type="button"
                              onClick={handleStep5Continue}
                              style={{
                                backgroundColor: "#ED2027",
                                color: "#fff",
                                padding: "12px 28px",
                                borderRadius: 6,
                                fontWeight: 600,
                                border: "none",
                                cursor: "pointer",
                                fontSize: 15,
                                transition: "background-color 0.15s ease",
                              }}
                              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#c41b21")}
                              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ED2027")}
                            >
                              Continue
                            </button>
                          </div>

                        </>
                      )}
                  </>
                )}

                {(listingType === "Sell" || listingType === "Joint Venture") && (
                  <>
                    {propertyType === "Commercial" &&
                      subPropertyType === "Industry" &&
                      (subPropertyQuestionOption === "Factory" ||
                        subPropertyQuestionOption === "Manufacturing") && (
                        <>

                          <h4 style={{ color: "#333", fontWeight: 600, fontSize: 18, marginBottom: 20 }}>
                            Add pricing and details...
                          </h4>


                          <div style={{ marginBottom: 20 }}>
                            <label style={{ fontWeight: 600, display: "block", marginBottom: 10 }}>
                              Ownership
                            </label>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                              {["Freehold", "Leasehold", "Co-operative society", "Power of Attorney"].map(
                                (type) => {
                                  const isSelected = selectedOwnership === type;
                                  return (
                                    <button
                                      key={type}
                                      type="button"
                                      onClick={() => setSelectedOwnership(type)}
                                      style={{
                                        padding: "8px 18px",
                                        border: "1px solid",
                                        borderColor: isSelected ? "#ED2027" : "#ddd",
                                        borderRadius: 20,
                                        background: isSelected ? "#ED2027" : "#fff",
                                        color: isSelected ? "#fff" : "#333",
                                        cursor: "pointer",
                                        fontSize: 14,
                                        fontWeight: isSelected ? 600 : 500,
                                        transition: "all 0.15s ease",
                                      }}

                                      onMouseOut={(e) => !isSelected && (e.currentTarget.style.borderColor = "#ddd")}
                                    >
                                      {type}
                                    </button>
                                  );
                                }
                              )}
                            </div>
                          </div>

                          <div style={{ marginBottom: 20 }}>
                            <label style={{ fontWeight: 600, display: "block", marginBottom: 10 }}>
                              Price Details
                            </label>

                            <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                              <input
                                type="text"
                                placeholder="Expected Price"
                                value={expectedPrice}
                                onChange={(e) => setExpectedPrice(e.target.value)}
                                style={{
                                  flex: 1,
                                  padding: 10,
                                  border: "1px solid #ccc",
                                  borderRadius: 4,
                                  fontSize: 14,
                                  transition: "border-color 0.15s ease",
                                }}
                                onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                              />
                              <input
                                type="text"
                                placeholder="Price per sq.yards"
                                value={pricePerSqYards}
                                onChange={(e) => setPricePerSqYards(e.target.value)}
                                style={{
                                  flex: 1,
                                  padding: 10,
                                  border: "1px solid #ccc",
                                  borderRadius: 4,
                                  fontSize: 14,
                                  transition: "border-color 0.15s ease",
                                }}
                                onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                              />
                            </div>




                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                              <label
                                style={{
                                  fontSize: 14,
                                  accentColor: "#ED2027",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={checkboxes.allInclusive}
                                  onChange={() => toggleCheckbox("allInclusive")}
                                />
                                All inclusive price
                              </label>

                              <label
                                style={{
                                  fontSize: 14,
                                  accentColor: "#ED2027",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={checkboxes.taxExcluded}
                                  onChange={() => toggleCheckbox("taxExcluded")}
                                />
                                Tax and Govt. charges excluded
                              </label>

                              <label
                                style={{
                                  fontSize: 14,
                                  accentColor: "#ED2027",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={checkboxes.negotiable}
                                  onChange={() => toggleCheckbox("negotiable")}
                                />
                                Price Negotiable
                              </label>
                            </div>

                            <div style={{ marginBottom: 20, marginTop: 20 }}>

                              <div
                                style={{
                                  position: "relative",
                                  display: "inline-block",
                                  width: "100%",
                                  cursor: "pointer",
                                  border: "1px solid #ccc",
                                  borderRadius: 4,
                                  padding: "10px 40px 10px 16px",
                                  background: "#fff",
                                  fontSize: 14,
                                  color: "#333",
                                  userSelect: "none",
                                }}
                                onClick={() => setIsOpen(!isOpen)}
                                onMouseOver={(e) => (e.currentTarget.style.borderColor = "#ED2027")}
                                onMouseOut={(e) => (e.currentTarget.style.borderColor = "#ccc")}
                              >
                                <span>{isOpen ? "Close Pricing Details" : "Add More Pricing Details"}</span>
                                <span
                                  style={{
                                    position: "absolute",
                                    right: 12,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    fontSize: 12,
                                    pointerEvents: "none",
                                  }}
                                >
                                  {isOpen ? "▲" : "▼"}
                                </span>
                              </div>


                              {isOpen && (
                                <div style={{ marginTop: 20 }}>
                                  <label
                                    style={{
                                      fontWeight: 600,
                                      display: "block",
                                      marginBottom: 10,
                                    }}
                                  >
                                    Additional Pricing Details (Optional)
                                  </label>


                                  <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                                    <input
                                      type="text"
                                      placeholder="Maintenance"
                                      value={maintenance}
                                      onChange={(e) => setMaintenance(e.target.value)}
                                      style={{
                                        flex: 1,
                                        padding: 10,
                                        border: "1px solid #ccc",
                                        borderRadius: 4,
                                        fontSize: 14,
                                      }}
                                      onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                      onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                                    />

                                    <select
                                      value={maintenanceFreq}
                                      onChange={(e) => setMaintenanceFreq(e.target.value)}
                                      style={{
                                        width: 160,
                                        padding: 10,
                                        border: "1px solid #ccc",
                                        borderRadius: 4,
                                        fontSize: 14,
                                        background: "#fff",
                                      }}
                                      onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                      onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                                    >
                                      <option>Monthly</option>
                                      <option>Quarterly</option>
                                      <option>Yearly</option>
                                    </select>
                                  </div>


                                  <input
                                    type="text"
                                    placeholder="Expected rental"
                                    value={expectedRental}
                                    onChange={(e) => setExpectedRental(e.target.value)}
                                    style={{
                                      width: "100%",
                                      padding: 10,
                                      marginBottom: 10,
                                      border: "1px solid #ccc",
                                      borderRadius: 4,
                                      fontSize: 14,
                                    }}
                                    onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                    onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                                  />


                                  <input
                                    type="text"
                                    placeholder="Booking Amount"
                                    value={bookingAmount}
                                    onChange={(e) => setBookingAmount(e.target.value)}
                                    style={{
                                      width: "100%",
                                      padding: 10,
                                      marginBottom: 10,
                                      border: "1px solid #ccc",
                                      borderRadius: 4,
                                      fontSize: 14,
                                    }}
                                    onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                    onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                                  />


                                  <input
                                    type="text"
                                    placeholder="Annual dues payable"
                                    value={annualDues}
                                    onChange={(e) => setAnnualDues(e.target.value)}
                                    style={{
                                      width: "100%",
                                      padding: 10,
                                      marginBottom: 10,
                                      border: "1px solid #ccc",
                                      borderRadius: 4,
                                      fontSize: 14,
                                    }}
                                    onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                    onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                                  />
                                </div>
                              )}
                            </div>

                            <div style={{ marginBottom: 20 }}>
                              <label style={{ fontWeight: 600, display: "block", marginBottom: 10 }}>
                                What makes your property unique
                              </label>
                              <textarea
                                placeholder="Add a description..."
                                rows={4}
                                value={description}
                                onChange={(e) => {
                                  const onlyWords = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // removes numbers & special chars
                                  setDescription(onlyWords);
                                }}
                                style={{
                                  width: "100%",
                                  padding: 10,
                                  border: "1px solid #ccc",
                                  borderRadius: 4,
                                  fontSize: 14,
                                  transition: "border-color 0.15s ease",
                                }}
                                onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                              />
                              <small style={{ display: "block", marginTop: 6, color: "#888" }}>
                                Minimum 30 characters required
                              </small>
                            </div>



                            <div>
                              <button
                                type="button"
                                onClick={handleStep5Continue}
                                style={{
                                  backgroundColor: "#ED2027",
                                  color: "#fff",
                                  padding: "12px 28px",
                                  borderRadius: 6,
                                  fontWeight: 600,
                                  border: "none",
                                  cursor: "pointer",
                                  fontSize: 15,
                                  transition: "background-color 0.15s ease",
                                }}
                                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#c41b21")}
                                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ED2027")}
                              >
                                Continue
                              </button>
                            </div>
                          </div></>
                      )}
                  </>
                )}

                {listingType === "Rent" && (
                  <>
                    {propertyType === "Commercial" &&
                      subPropertyType === "Industry" &&
                      (subPropertyQuestionOption === "Factory" ||
                        subPropertyQuestionOption === "Manufacturing") && (
                        <>
                          <h4 style={{ color: "#333", fontWeight: 600, fontSize: 18, marginBottom: 20 }}>
                            Add pricing and details...
                          </h4>
                          {/* Rent Details */}
                          <div className="step3-section">
                            <h6 className="step3-subheader">Rent Details</h6>
                            <div className="step3-price-group">
                              <input
                                type="number"
                                placeholder="₹ Expected Rent"
                                value={expectedRent}
                                onChange={(e) => setExpectedRent(e.target.value)}
                                className={`step3-input ${!expectedRent ? "error-border" : ""}`}
                              />
                            </div>
                            <small className="step3-subnote">₹ Price in words</small>

                            {/* Checkboxes */}
                            <div className="step3-checkbox-group">
                              <label className="step3-checkbox-label">
                                <input
                                  type="checkbox"
                                  checked={elecWaterExcluded}
                                  onChange={(e) => setElecWaterExcluded(e.target.checked)}
                                  className="step3-checkbox"
                                />
                                Electricity & Water charges excluded
                              </label>
                              <label className="step3-checkbox-label">
                                <input
                                  type="checkbox"
                                  checked={priceNegotiable}
                                  onChange={(e) => setPriceNegotiable(e.target.checked)}
                                  className="step3-checkbox"
                                />
                                Price Negotiable
                              </label>
                            </div>
                          </div>
                          {/* Additional Price Details */}
                          <div className="step3-section">
                            <button
                              type="button"
                              onClick={() => setShowAdditionalPricing((prev) => !prev)}
                              className="step3-toggle-btn"
                            >
                              {showAdditionalPricing
                                ? "− Hide  more Rent Details"
                                : "+ Add more Rent Details (Optional)"}
                            </button>

                            {showAdditionalPricing && (
                              <div className="step3-additional-fields">
                                {/* Maintenance + unit */}
                                <div className="step3-input-group">
                                  <input
                                    type="number"
                                    placeholder="Maintenance"
                                    value={maintenance}
                                    onChange={(e) => setMaintenance(e.target.value)}
                                    className="step3-input"
                                  />
                                  <select
                                    value={maintenanceUnit}
                                    onChange={(e) => setMaintenanceUnit(e.target.value)}
                                    className="step3-unit-select"
                                  >
                                    <option value="">Select</option>
                                    <option value="Monthly">Monthly</option>
                                    <option value="Annually">Annually</option>
                                    <option value="One Time">One Time</option>
                                    <option value="Per Unit">Per Unit</option>
                                  </select>
                                </div>

                                {/* Booking Amount */}
                                <input
                                  type="number"
                                  placeholder="Booking Amount"
                                  value={bookingAmount}
                                  onChange={(e) => setBookingAmount(e.target.value)}
                                  className="step3-input"
                                />

                                {/* Membership Charge */}
                                <input
                                  type="number"
                                  placeholder="Membership Charge"
                                  value={membershipCharge}
                                  onChange={(e) => setMembershipCharge(e.target.value)}
                                  className="step3-input"
                                />
                              </div>
                            )}
                          </div>

                          <div style={{ marginBottom: 20 }}>
                            <label style={{ fontWeight: 600, display: "block", marginBottom: 10 }}>
                              What makes your property unique
                            </label>
                            <textarea
                              placeholder="Add a description..."
                              rows={4}
                              value={description}
                              onChange={(e) => {
                                const onlyWords = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // removes numbers & special chars
                                setDescription(onlyWords);
                              }}
                              style={{
                                width: "100%",
                                padding: 10,
                                border: "1px solid #ccc",
                                borderRadius: 4,
                                fontSize: 14,
                                transition: "border-color 0.15s ease",
                              }}
                              onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                              onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                            />
                            <small style={{ display: "block", marginTop: 6, color: "#888" }}>
                              Minimum 30 characters required
                            </small>
                          </div>



                          <div>
                            <button
                              type="button"
                              onClick={handleStep5Continue}
                              style={{
                                backgroundColor: "#ED2027",
                                color: "#fff",
                                padding: "12px 28px",
                                borderRadius: 6,
                                fontWeight: 600,
                                border: "none",
                                cursor: "pointer",
                                fontSize: 15,
                                transition: "background-color 0.15s ease",
                              }}
                              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#c41b21")}
                              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ED2027")}
                            >
                              Continue
                            </button>
                          </div>

                        </>
                      )}
                  </>
                )}



                {/* rrrr */}
                {(listingType === "Sell" || listingType === "Joint Venture") && (
                  <>
                    {propertyType === "Commercial" &&
                      subPropertyType === "Hospitality" &&
                      (subPropertyQuestionOption === "Hotel / Resorts" ||
                        subPropertyQuestionOption === "Guest-House / Banquet Hall") && (
                        <>

                          <h4 style={{ color: "#333", fontWeight: 600, fontSize: 18, marginBottom: 20 }}>
                            Add pricing and details...
                          </h4>


                          <div style={{ marginBottom: 20 }}>
                            <label style={{ fontWeight: 600, display: "block", marginBottom: 10 }}>
                              Ownership
                            </label>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                              {["Freehold", "Leasehold", "Co-operative society", "Power of Attorney"].map(
                                (type) => {
                                  const isSelected = selectedOwnership === type;
                                  return (
                                    <button
                                      key={type}
                                      type="button"
                                      onClick={() => setSelectedOwnership(type)}
                                      style={{
                                        padding: "8px 18px",
                                        border: "1px solid",
                                        borderColor: isSelected ? "#ED2027" : "#ddd",
                                        borderRadius: 20,
                                        background: isSelected ? "#ED2027" : "#fff",
                                        color: isSelected ? "#fff" : "#333",
                                        cursor: "pointer",
                                        fontSize: 14,
                                        fontWeight: isSelected ? 600 : 500,
                                        transition: "all 0.15s ease",
                                      }}

                                      onMouseOut={(e) => !isSelected && (e.currentTarget.style.borderColor = "#ddd")}
                                    >
                                      {type}
                                    </button>
                                  );
                                }
                              )}
                            </div>
                          </div>

                          <div style={{ marginBottom: 20 }}>
                            <label style={{ fontWeight: 600, display: "block", marginBottom: 10 }}>
                              Price Details
                            </label>

                            <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                              <input
                                type="text"
                                placeholder="Expected Price"
                                value={expectedPrice}
                                onChange={(e) => setExpectedPrice(e.target.value)}
                                style={{
                                  flex: 1,
                                  padding: 10,
                                  border: "1px solid #ccc",
                                  borderRadius: 4,
                                  fontSize: 14,
                                  transition: "border-color 0.15s ease",
                                }}
                                onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                              />
                              <input
                                type="text"
                                placeholder="Price per sq.yards"
                                value={pricePerSqYards}
                                onChange={(e) => setPricePerSqYards(e.target.value)}
                                style={{
                                  flex: 1,
                                  padding: 10,
                                  border: "1px solid #ccc",
                                  borderRadius: 4,
                                  fontSize: 14,
                                  transition: "border-color 0.15s ease",
                                }}
                                onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                              />
                            </div>




                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                              <label
                                style={{
                                  fontSize: 14,
                                  accentColor: "#ED2027",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={checkboxes.allInclusive}
                                  onChange={() => toggleCheckbox("allInclusive")}
                                />
                                All inclusive price
                              </label>

                              <label
                                style={{
                                  fontSize: 14,
                                  accentColor: "#ED2027",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={checkboxes.taxExcluded}
                                  onChange={() => toggleCheckbox("taxExcluded")}
                                />
                                Tax and Govt. charges excluded
                              </label>

                              <label
                                style={{
                                  fontSize: 14,
                                  accentColor: "#ED2027",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={checkboxes.negotiable}
                                  onChange={() => toggleCheckbox("negotiable")}
                                />
                                Price Negotiable
                              </label>
                            </div>

                            <div style={{ marginBottom: 20, marginTop: 20 }}>

                              <div
                                style={{
                                  position: "relative",
                                  display: "inline-block",
                                  width: "100%",
                                  cursor: "pointer",
                                  border: "1px solid #ccc",
                                  borderRadius: 4,
                                  padding: "10px 40px 10px 16px",
                                  background: "#fff",
                                  fontSize: 14,
                                  color: "#333",
                                  userSelect: "none",
                                }}
                                onClick={() => setIsOpen(!isOpen)}
                                onMouseOver={(e) => (e.currentTarget.style.borderColor = "#ED2027")}
                                onMouseOut={(e) => (e.currentTarget.style.borderColor = "#ccc")}
                              >
                                <span>{isOpen ? "Close Pricing Details" : "Add More Pricing Details"}</span>
                                <span
                                  style={{
                                    position: "absolute",
                                    right: 12,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    fontSize: 12,
                                    pointerEvents: "none",
                                  }}
                                >
                                  {isOpen ? "▲" : "▼"}
                                </span>
                              </div>


                              {isOpen && (
                                <div style={{ marginTop: 20 }}>
                                  <label
                                    style={{
                                      fontWeight: 600,
                                      display: "block",
                                      marginBottom: 10,
                                    }}
                                  >
                                    Additional Pricing Details (Optional)
                                  </label>


                                  <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                                    <input
                                      type="text"
                                      placeholder="Maintenance"
                                      value={maintenance}
                                      onChange={(e) => setMaintenance(e.target.value)}
                                      style={{
                                        flex: 1,
                                        padding: 10,
                                        border: "1px solid #ccc",
                                        borderRadius: 4,
                                        fontSize: 14,
                                      }}
                                      onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                      onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                                    />

                                    <select
                                      value={maintenanceFreq}
                                      onChange={(e) => setMaintenanceFreq(e.target.value)}
                                      style={{
                                        width: 160,
                                        padding: 10,
                                        border: "1px solid #ccc",
                                        borderRadius: 4,
                                        fontSize: 14,
                                        background: "#fff",
                                      }}
                                      onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                      onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                                    >
                                      <option>Monthly</option>
                                      <option>Quarterly</option>
                                      <option>Yearly</option>
                                    </select>
                                  </div>


                                  <input
                                    type="text"
                                    placeholder="Expected rental"
                                    value={expectedRental}
                                    onChange={(e) => setExpectedRental(e.target.value)}
                                    style={{
                                      width: "100%",
                                      padding: 10,
                                      marginBottom: 10,
                                      border: "1px solid #ccc",
                                      borderRadius: 4,
                                      fontSize: 14,
                                    }}
                                    onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                    onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                                  />


                                  <input
                                    type="text"
                                    placeholder="Booking Amount"
                                    value={bookingAmount}
                                    onChange={(e) => setBookingAmount(e.target.value)}
                                    style={{
                                      width: "100%",
                                      padding: 10,
                                      marginBottom: 10,
                                      border: "1px solid #ccc",
                                      borderRadius: 4,
                                      fontSize: 14,
                                    }}
                                    onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                    onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                                  />


                                  <input
                                    type="text"
                                    placeholder="Annual dues payable"
                                    value={annualDues}
                                    onChange={(e) => setAnnualDues(e.target.value)}
                                    style={{
                                      width: "100%",
                                      padding: 10,
                                      marginBottom: 10,
                                      border: "1px solid #ccc",
                                      borderRadius: 4,
                                      fontSize: 14,
                                    }}
                                    onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                    onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                                  />
                                </div>
                              )}
                            </div>

                            <div style={{ marginBottom: 20 }}>
                              <label style={{ fontWeight: 600, display: "block", marginBottom: 10 }}>
                                What makes your property unique
                              </label>
                              <textarea
                                placeholder="Add a description..."
                                rows={4}
                                value={description}
                                onChange={(e) => {
                                  const onlyWords = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // removes numbers & special chars
                                  setDescription(onlyWords);
                                }}
                                style={{
                                  width: "100%",
                                  padding: 10,
                                  border: "1px solid #ccc",
                                  borderRadius: 4,
                                  fontSize: 14,
                                  transition: "border-color 0.15s ease",
                                }}
                                onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                              />
                              <small style={{ display: "block", marginTop: 6, color: "#888" }}>
                                Minimum 30 characters required
                              </small>
                            </div>



                            <div>
                              <button
                                type="button"
                                onClick={handleStep5Continue}
                                style={{
                                  backgroundColor: "#ED2027",
                                  color: "#fff",
                                  padding: "12px 28px",
                                  borderRadius: 6,
                                  fontWeight: 600,
                                  border: "none",
                                  cursor: "pointer",
                                  fontSize: 15,
                                  transition: "background-color 0.15s ease",
                                }}
                                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#c41b21")}
                                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ED2027")}
                              >
                                Continue
                              </button>
                            </div>
                          </div></>
                      )}
                  </>
                )}

                {listingType === "Rent" && (
                  <>
                    {propertyType === "Commercial" &&
                      subPropertyType === "Hospitality" &&
                      (subPropertyQuestionOption === "Hotel / Resorts" ||
                        subPropertyQuestionOption === "Guest-House / Banquet Hall") && (
                        <>
                          <h4 style={{ color: "#333", fontWeight: 600, fontSize: 18, marginBottom: 20 }}>
                            Add pricing and details...
                          </h4>
                          {/* Rent Details */}
                          <div className="step3-section">
                            <h6 className="step3-subheader">Rent Details</h6>
                            <div className="step3-price-group">
                              <input
                                type="number"
                                placeholder="₹ Expected Rent"
                                value={expectedRent}
                                onChange={(e) => setExpectedRent(e.target.value)}
                                className={`step3-input ${!expectedRent ? "error-border" : ""}`}
                              />
                            </div>
                            <small className="step3-subnote">₹ Price in words</small>

                            {/* Checkboxes */}
                            <div className="step3-checkbox-group">
                              <label className="step3-checkbox-label">
                                <input
                                  type="checkbox"
                                  checked={elecWaterExcluded}
                                  onChange={(e) => setElecWaterExcluded(e.target.checked)}
                                  className="step3-checkbox"
                                />
                                Electricity & Water charges excluded
                              </label>
                              <label className="step3-checkbox-label">
                                <input
                                  type="checkbox"
                                  checked={priceNegotiable}
                                  onChange={(e) => setPriceNegotiable(e.target.checked)}
                                  className="step3-checkbox"
                                />
                                Price Negotiable
                              </label>
                            </div>
                          </div>
                          {/* Additional Price Details */}
                          <div className="step3-section">
                            <button
                              type="button"
                              onClick={() => setShowAdditionalPricing((prev) => !prev)}
                              className="step3-toggle-btn"
                            >
                              {showAdditionalPricing
                                ? "− Hide  more Rent Details"
                                : "+ Add more Rent Details (Optional)"}
                            </button>

                            {showAdditionalPricing && (
                              <div className="step3-additional-fields">
                                {/* Maintenance + unit */}
                                <div className="step3-input-group">
                                  <input
                                    type="number"
                                    placeholder="Maintenance"
                                    value={maintenance}
                                    onChange={(e) => setMaintenance(e.target.value)}
                                    className="step3-input"
                                  />
                                  <select
                                    value={maintenanceUnit}
                                    onChange={(e) => setMaintenanceUnit(e.target.value)}
                                    className="step3-unit-select"
                                  >
                                    <option value="">Select</option>
                                    <option value="Monthly">Monthly</option>
                                    <option value="Annually">Annually</option>
                                    <option value="One Time">One Time</option>
                                    <option value="Per Unit">Per Unit</option>
                                  </select>
                                </div>

                                {/* Booking Amount */}
                                <input
                                  type="number"
                                  placeholder="Booking Amount"
                                  value={bookingAmount}
                                  onChange={(e) => setBookingAmount(e.target.value)}
                                  className="step3-input"
                                />

                                {/* Membership Charge */}
                                <input
                                  type="number"
                                  placeholder="Membership Charge"
                                  value={membershipCharge}
                                  onChange={(e) => setMembershipCharge(e.target.value)}
                                  className="step3-input"
                                />
                              </div>
                            )}
                          </div>

                          <div style={{ marginBottom: 20 }}>
                            <label style={{ fontWeight: 600, display: "block", marginBottom: 10 }}>
                              What makes your property unique
                            </label>
                            <textarea
                              placeholder="Add a description..."
                              rows={4}
                              value={description}
                              onChange={(e) => {
                                const onlyWords = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // removes numbers & special chars
                                setDescription(onlyWords);
                              }}
                              style={{
                                width: "100%",
                                padding: 10,
                                border: "1px solid #ccc",
                                borderRadius: 4,
                                fontSize: 14,
                                transition: "border-color 0.15s ease",
                              }}
                              onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                              onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                            />
                            <small style={{ display: "block", marginTop: 6, color: "#888" }}>
                              Minimum 30 characters required
                            </small>
                          </div>



                          <div>
                            <button
                              type="button"
                              onClick={handleStep5Continue}
                              style={{
                                backgroundColor: "#ED2027",
                                color: "#fff",
                                padding: "12px 28px",
                                borderRadius: 6,
                                fontWeight: 600,
                                border: "none",
                                cursor: "pointer",
                                fontSize: 15,
                                transition: "background-color 0.15s ease",
                              }}
                              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#c41b21")}
                              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ED2027")}
                            >
                              Continue
                            </button>
                          </div>

                        </>
                      )}
                  </>
                )}



                {listingType === "Sell" && (
                  <>
                    {propertyType === "Commercial" &&
                      (subPropertyType === "Others") && (
                        <>

                          <h4 style={{ color: "#333", fontWeight: 600, fontSize: 18, marginBottom: 20 }}>
                            Add pricing and details...
                          </h4>


                          <div style={{ marginBottom: 20 }}>
                            <label style={{ fontWeight: 600, display: "block", marginBottom: 10 }}>
                              Ownership
                            </label>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                              {["Freehold", "Leasehold", "Co-operative society", "Power of Attorney"].map(
                                (type) => {
                                  const isSelected = selectedOwnership === type;
                                  return (
                                    <button
                                      key={type}
                                      type="button"
                                      onClick={() => setSelectedOwnership(type)}
                                      style={{
                                        padding: "8px 18px",
                                        border: "1px solid",
                                        borderColor: isSelected ? "#ED2027" : "#ddd",
                                        borderRadius: 20,
                                        background: isSelected ? "#ED2027" : "#fff",
                                        color: isSelected ? "#fff" : "#333",
                                        cursor: "pointer",
                                        fontSize: 14,
                                        fontWeight: isSelected ? 600 : 500,
                                        transition: "all 0.15s ease",
                                      }}

                                      onMouseOut={(e) => !isSelected && (e.currentTarget.style.borderColor = "#ddd")}
                                    >
                                      {type}
                                    </button>
                                  );
                                }
                              )}
                            </div>
                          </div>

                          <div style={{ marginBottom: 20 }}>
                            <label style={{ fontWeight: 600, display: "block", marginBottom: 10 }}>
                              Price Details
                            </label>

                            <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                              <input
                                type="text"
                                placeholder="Expected Price"
                                value={expectedPrice}
                                onChange={(e) => setExpectedPrice(e.target.value)}
                                style={{
                                  flex: 1,
                                  padding: 10,
                                  border: "1px solid #ccc",
                                  borderRadius: 4,
                                  fontSize: 14,
                                  transition: "border-color 0.15s ease",
                                }}
                                onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                              />
                              <input
                                type="text"
                                placeholder="Price per sq.yards"
                                value={pricePerSqYards}
                                onChange={(e) => setPricePerSqYards(e.target.value)}
                                style={{
                                  flex: 1,
                                  padding: 10,
                                  border: "1px solid #ccc",
                                  borderRadius: 4,
                                  fontSize: 14,
                                  transition: "border-color 0.15s ease",
                                }}
                                onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                              />
                            </div>




                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                              <label
                                style={{
                                  fontSize: 14,
                                  accentColor: "#ED2027",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={checkboxes.allInclusive}
                                  onChange={() => toggleCheckbox("allInclusive")}
                                />
                                All inclusive price
                              </label>

                              <label
                                style={{
                                  fontSize: 14,
                                  accentColor: "#ED2027",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={checkboxes.taxExcluded}
                                  onChange={() => toggleCheckbox("taxExcluded")}
                                />
                                Tax and Govt. charges excluded
                              </label>

                              <label
                                style={{
                                  fontSize: 14,
                                  accentColor: "#ED2027",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={checkboxes.negotiable}
                                  onChange={() => toggleCheckbox("negotiable")}
                                />
                                Price Negotiable
                              </label>
                            </div>

                            <div style={{ marginBottom: 20, marginTop: 20 }}>

                              <div
                                style={{
                                  position: "relative",
                                  display: "inline-block",
                                  width: "100%",
                                  cursor: "pointer",
                                  border: "1px solid #ccc",
                                  borderRadius: 4,
                                  padding: "10px 40px 10px 16px",
                                  background: "#fff",
                                  fontSize: 14,
                                  color: "#333",
                                  userSelect: "none",
                                }}
                                onClick={() => setIsOpen(!isOpen)}
                                onMouseOver={(e) => (e.currentTarget.style.borderColor = "#ED2027")}
                                onMouseOut={(e) => (e.currentTarget.style.borderColor = "#ccc")}
                              >
                                <span>{isOpen ? "Close Pricing Details" : "Add More Pricing Details"}</span>
                                <span
                                  style={{
                                    position: "absolute",
                                    right: 12,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    fontSize: 12,
                                    pointerEvents: "none",
                                  }}
                                >
                                  {isOpen ? "▲" : "▼"}
                                </span>
                              </div>


                              {isOpen && (
                                <div style={{ marginTop: 20 }}>
                                  <label
                                    style={{
                                      fontWeight: 600,
                                      display: "block",
                                      marginBottom: 10,
                                    }}
                                  >
                                    Additional Pricing Details (Optional)
                                  </label>


                                  <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                                    <input
                                      type="text"
                                      placeholder="Maintenance"
                                      value={maintenance}
                                      onChange={(e) => setMaintenance(e.target.value)}
                                      style={{
                                        flex: 1,
                                        padding: 10,
                                        border: "1px solid #ccc",
                                        borderRadius: 4,
                                        fontSize: 14,
                                      }}
                                      onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                      onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                                    />

                                    <select
                                      value={maintenanceFreq}
                                      onChange={(e) => setMaintenanceFreq(e.target.value)}
                                      style={{
                                        width: 160,
                                        padding: 10,
                                        border: "1px solid #ccc",
                                        borderRadius: 4,
                                        fontSize: 14,
                                        background: "#fff",
                                      }}
                                      onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                      onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                                    >
                                      <option>Monthly</option>
                                      <option>Quarterly</option>
                                      <option>Yearly</option>
                                    </select>
                                  </div>


                                  <input
                                    type="text"
                                    placeholder="Expected rental"
                                    value={expectedRental}
                                    onChange={(e) => setExpectedRental(e.target.value)}
                                    style={{
                                      width: "100%",
                                      padding: 10,
                                      marginBottom: 10,
                                      border: "1px solid #ccc",
                                      borderRadius: 4,
                                      fontSize: 14,
                                    }}
                                    onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                    onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                                  />


                                  <input
                                    type="text"
                                    placeholder="Booking Amount"
                                    value={bookingAmount}
                                    onChange={(e) => setBookingAmount(e.target.value)}
                                    style={{
                                      width: "100%",
                                      padding: 10,
                                      marginBottom: 10,
                                      border: "1px solid #ccc",
                                      borderRadius: 4,
                                      fontSize: 14,
                                    }}
                                    onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                    onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                                  />


                                  <input
                                    type="text"
                                    placeholder="Annual dues payable"
                                    value={annualDues}
                                    onChange={(e) => setAnnualDues(e.target.value)}
                                    style={{
                                      width: "100%",
                                      padding: 10,
                                      marginBottom: 10,
                                      border: "1px solid #ccc",
                                      borderRadius: 4,
                                      fontSize: 14,
                                    }}
                                    onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                    onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                                  />
                                </div>
                              )}
                            </div>

                            <div style={{ marginBottom: 20 }}>
                              <label style={{ fontWeight: 600, display: "block", marginBottom: 10 }}>
                                What makes your property unique
                              </label>
                              <textarea
                                placeholder="Add a description..."
                                rows={4}
                                value={description}
                                onChange={(e) => {
                                  const onlyWords = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // removes numbers & special chars
                                  setDescription(onlyWords);
                                }}
                                style={{
                                  width: "100%",
                                  padding: 10,
                                  border: "1px solid #ccc",
                                  borderRadius: 4,
                                  fontSize: 14,
                                  transition: "border-color 0.15s ease",
                                }}
                                onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                                onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                              />
                              <small style={{ display: "block", marginTop: 6, color: "#888" }}>
                                Minimum 30 characters required
                              </small>
                            </div>



                            <div>
                              <button
                                type="button"
                                onClick={handleStep5Continue}
                                style={{
                                  backgroundColor: "#ED2027",
                                  color: "#fff",
                                  padding: "12px 28px",
                                  borderRadius: 6,
                                  fontWeight: 600,
                                  border: "none",
                                  cursor: "pointer",
                                  fontSize: 15,
                                  transition: "background-color 0.15s ease",
                                }}
                                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#c41b21")}
                                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ED2027")}
                              >
                                Continue
                              </button>
                            </div>
                          </div></>
                      )}

                  </>
                )}


                {listingType === "Rent" && (
                  <>
                    {propertyType === "Commercial" &&
                      (subPropertyType === "Others") && (
                        <>
                          <h4 style={{ color: "#333", fontWeight: 600, fontSize: 18, marginBottom: 20 }}>
                            Add pricing and details...
                          </h4>
                          {/* Rent Details */}
                          <div className="step3-section">
                            <h6 className="step3-subheader">Rent Details</h6>
                            <div className="step3-price-group">
                              <input
                                type="number"
                                placeholder="₹ Expected Rent"
                                value={expectedRent}
                                onChange={(e) => setExpectedRent(e.target.value)}
                                className={`step3-input ${!expectedRent ? "error-border" : ""}`}
                              />
                            </div>
                            <small className="step3-subnote">₹ Price in words</small>

                            {/* Checkboxes */}
                            <div className="step3-checkbox-group">
                              <label className="step3-checkbox-label">
                                <input
                                  type="checkbox"
                                  checked={elecWaterExcluded}
                                  onChange={(e) => setElecWaterExcluded(e.target.checked)}
                                  className="step3-checkbox"
                                />
                                Electricity & Water charges excluded
                              </label>
                              <label className="step3-checkbox-label">
                                <input
                                  type="checkbox"
                                  checked={priceNegotiable}
                                  onChange={(e) => setPriceNegotiable(e.target.checked)}
                                  className="step3-checkbox"
                                />
                                Price Negotiable
                              </label>
                            </div>
                          </div>
                          {/* Additional Price Details */}
                          <div className="step3-section">
                            <button
                              type="button"
                              onClick={() => setShowAdditionalPricing((prev) => !prev)}
                              className="step3-toggle-btn"
                            >
                              {showAdditionalPricing
                                ? "− Hide  more Rent Details"
                                : "+ Add more Rent Details (Optional)"}
                            </button>

                            {showAdditionalPricing && (
                              <div className="step3-additional-fields">
                                {/* Maintenance + unit */}
                                <div className="step3-input-group">
                                  <input
                                    type="number"
                                    placeholder="Maintenance"
                                    value={maintenance}
                                    onChange={(e) => setMaintenance(e.target.value)}
                                    className="step3-input"
                                  />
                                  <select
                                    value={maintenanceUnit}
                                    onChange={(e) => setMaintenanceUnit(e.target.value)}
                                    className="step3-unit-select"
                                  >
                                    <option value="">Select</option>
                                    <option value="Monthly">Monthly</option>
                                    <option value="Annually">Annually</option>
                                    <option value="One Time">One Time</option>
                                    <option value="Per Unit">Per Unit</option>
                                  </select>
                                </div>

                                {/* Booking Amount */}
                                <input
                                  type="number"
                                  placeholder="Booking Amount"
                                  value={bookingAmount}
                                  onChange={(e) => setBookingAmount(e.target.value)}
                                  className="step3-input"
                                />

                                {/* Membership Charge */}
                                <input
                                  type="number"
                                  placeholder="Membership Charge"
                                  value={membershipCharge}
                                  onChange={(e) => setMembershipCharge(e.target.value)}
                                  className="step3-input"
                                />
                              </div>
                            )}
                          </div>

                          <div style={{ marginBottom: 20 }}>
                            <label style={{ fontWeight: 600, display: "block", marginBottom: 10 }}>
                              What makes your property unique
                            </label>
                            <textarea
                              placeholder="Add a description..."
                              rows={4}
                              value={description}
                              onChange={(e) => {
                                const onlyWords = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // removes numbers & special chars
                                setDescription(onlyWords);
                              }}
                              style={{
                                width: "100%",
                                padding: 10,
                                border: "1px solid #ccc",
                                borderRadius: 4,
                                fontSize: 14,
                                transition: "border-color 0.15s ease",
                              }}
                              onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                              onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                            />
                            <small style={{ display: "block", marginTop: 6, color: "#888" }}>
                              Minimum 30 characters required
                            </small>
                          </div>



                          <div>
                            <button
                              type="button"
                              onClick={handleStep5Continue}
                              style={{
                                backgroundColor: "#ED2027",
                                color: "#fff",
                                padding: "12px 28px",
                                borderRadius: 6,
                                fontWeight: 600,
                                border: "none",
                                cursor: "pointer",
                                fontSize: 15,
                                transition: "background-color 0.15s ease",
                              }}
                              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#c41b21")}
                              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ED2027")}
                            >
                              Continue
                            </button>
                          </div>

                        </>
                      )}
                  </>
                )}






                {/* <div style={{ padding: "20px", maxWidth: "700px" }}>
                  <h4 style={{ color: "#333", fontWeight: 600, fontSize: 18, marginBottom: 20 }}>
                    Add pricing and details...
                  </h4>

                 
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ fontWeight: 600, display: "block", marginBottom: 10 }}>
                      Ownership
                    </label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                      {["Freehold", "Leasehold", "Co-operative society", "Power of Attorney"].map(
                        (type) => {
                          const isSelected = selectedOwnership === type;
                          return (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setSelectedOwnership(type)}
                              style={{
                                padding: "8px 18px",
                                border: "1px solid",
                                borderColor: isSelected ? "#ED2027" : "#ddd",
                                borderRadius: 20,
                                background: isSelected ? "#ED2027" : "#fff",
                                color: isSelected ? "#fff" : "#333",
                                cursor: "pointer",
                                fontSize: 14,
                                fontWeight: isSelected ? 600 : 500,
                                transition: "all 0.15s ease",
                              }}
                              
                              onMouseOut={(e) => !isSelected && (e.currentTarget.style.borderColor = "#ddd")}
                            >
                              {type}
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>

               
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ fontWeight: 600, display: "block", marginBottom: 10 }}>
                      Price Details
                    </label>

                    <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                      <input
                        type="text"
                        placeholder="Expected Price"
                        value={expectedPrice}
                        onChange={(e) => setExpectedPrice(e.target.value)}
                        style={{
                          flex: 1,
                          padding: 10,
                          border: "1px solid #ccc",
                          borderRadius: 4,
                          fontSize: 14,
                          transition: "border-color 0.15s ease",
                        }}
                        onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                        onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                      />
                      <input
                        type="text"
                        placeholder="Price per sq.yards"
                        value={pricePerSqYards}
                        onChange={(e) => setPricePerSqYards(e.target.value)}
                        style={{
                          flex: 1,
                          padding: 10,
                          border: "1px solid #ccc",
                          borderRadius: 4,
                          fontSize: 14,
                          transition: "border-color 0.15s ease",
                        }}
                        onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                        onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                      />
                    </div>

                    
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <label
                        style={{
                          fontSize: 14,
                          accentColor: "#ED2027",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={checkboxes.allInclusive}
                          onChange={() => toggleCheckbox("allInclusive")}
                        />
                        All inclusive price
                      </label>

                      <label
                        style={{
                          fontSize: 14,
                          accentColor: "#ED2027",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={checkboxes.taxExcluded}
                          onChange={() => toggleCheckbox("taxExcluded")}
                        />
                        Tax and Govt. charges excluded
                      </label>

                      <label
                        style={{
                          fontSize: 14,
                          accentColor: "#ED2027",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={checkboxes.negotiable}
                          onChange={() => toggleCheckbox("negotiable")}
                        />
                        Price Negotiable
                      </label>
                    </div>
                  </div>

                 
                  <div style={{ marginBottom: 20 }}>
                   
                    <div
                      style={{
                        position: "relative",
                        display: "inline-block",
                        width: "100%",
                        cursor: "pointer",
                        border: "1px solid #ccc",
                        borderRadius: 4,
                        padding: "10px 40px 10px 16px",
                        background: "#fff",
                        fontSize: 14,
                        color: "#333",
                        userSelect: "none",
                      }}
                      onClick={() => setIsOpen(!isOpen)}
                      onMouseOver={(e) => (e.currentTarget.style.borderColor = "#ED2027")}
                      onMouseOut={(e) => (e.currentTarget.style.borderColor = "#ccc")}
                    >
                      <span>{isOpen ? "Close Pricing Details" : "Add More Pricing Details"}</span>
                      <span
                        style={{
                          position: "absolute",
                          right: 12,
                          top: "50%",
                          transform: "translateY(-50%)",
                          fontSize: 12,
                          pointerEvents: "none",
                        }}
                      >
                        {isOpen ? "▲" : "▼"}
                      </span>
                    </div>

                 
                    {isOpen && (
                      <div style={{ marginTop: 20 }}>
                        <label
                          style={{
                            fontWeight: 600,
                            display: "block",
                            marginBottom: 10,
                          }}
                        >
                          Additional Pricing Details (Optional)
                        </label>

                       
                        <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                          <input
                            type="text"
                            placeholder="Maintenance"
                            value={maintenance}
                            onChange={(e) => setMaintenance(e.target.value)}
                            style={{
                              flex: 1,
                              padding: 10,
                              border: "1px solid #ccc",
                              borderRadius: 4,
                              fontSize: 14,
                            }}
                            onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                            onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                          />

                          <select
                            value={maintenanceFreq}
                            onChange={(e) => setMaintenanceFreq(e.target.value)}
                            style={{
                              width: 160,
                              padding: 10,
                              border: "1px solid #ccc",
                              borderRadius: 4,
                              fontSize: 14,
                              background: "#fff",
                            }}
                            onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                            onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                          >
                            <option>Monthly</option>
                            <option>Quarterly</option>
                            <option>Yearly</option>
                          </select>
                        </div>

                      
                        <input
                          type="text"
                          placeholder="Expected rental"
                          value={expectedRental}
                          onChange={(e) => setExpectedRental(e.target.value)}
                          style={{
                            width: "100%",
                            padding: 10,
                            marginBottom: 10,
                            border: "1px solid #ccc",
                            borderRadius: 4,
                            fontSize: 14,
                          }}
                          onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                          onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                        />

                    
                        <input
                          type="text"
                          placeholder="Booking Amount"
                          value={bookingAmount}
                          onChange={(e) => setBookingAmount(e.target.value)}
                          style={{
                            width: "100%",
                            padding: 10,
                            marginBottom: 10,
                            border: "1px solid #ccc",
                            borderRadius: 4,
                            fontSize: 14,
                          }}
                          onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                          onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                        />

                       
                        <input
                          type="text"
                          placeholder="Annual dues payable"
                          value={annualDues}
                          onChange={(e) => setAnnualDues(e.target.value)}
                          style={{
                            width: "100%",
                            padding: 10,
                            marginBottom: 10,
                            border: "1px solid #ccc",
                            borderRadius: 4,
                            fontSize: 14,
                          }}
                          onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                          onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                        />
                      </div>
                    )}
                  </div>

                 
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ fontWeight: 600, display: "block", marginBottom: 10 }}>
                      Do you charge brokerage?
                    </label>

                 
                    <div style={{ display: "flex", gap: 20 }}>
                      <label
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          cursor: "pointer",
                          accentColor: "#ED2027",
                          fontWeight: brokerage === "yes" ? 600 : 500,
                        }}
                      >
                        <input
                          type="radio"
                          name="brokerage"
                          value="yes"
                          checked={brokerage === "yes"}
                          onChange={() => setBrokerage("yes")}
                        />
                        Yes
                      </label>

                      <label
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          cursor: "pointer",
                          accentColor: "#ED2027",
                          fontWeight: brokerage === "no" ? 600 : 500,
                        }}
                      >
                        <input
                          type="radio"
                          name="brokerage"
                          value="no"
                          checked={brokerage === "no"}
                          onChange={() => setBrokerage("no")}
                        />
                        No
                      </label>
                    </div>

                  
                    {brokerage === "yes" && (
                      <div style={{ marginTop: 15 }}>
                        <input
                          type="text"
                          placeholder="Enter Brokerage Amount"
                          value={brokerageAmount}
                          onChange={(e) => setBrokerageAmount(e.target.value)}
                          style={{
                            width: "100%",
                            padding: 10,
                            border: "1px solid #ccc",
                            borderRadius: 4,
                            fontSize: 14,
                            transition: "border-color 0.15s ease",
                          }}
                          onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                          onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                        />
                      </div>
                    )}
                  </div>

                
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ fontWeight: 600, display: "block", marginBottom: 10 }}>
                      What makes your property unique
                    </label>
                    <textarea
                      placeholder="Add a description..."
                      rows={4}
                      value={description}
                      onChange={(e) => {
                        const onlyWords = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // removes numbers & special chars
                        setDescription(onlyWords);
                      }}
                      style={{
                        width: "100%",
                        padding: 10,
                        border: "1px solid #ccc",
                        borderRadius: 4,
                        fontSize: 14,
                        transition: "border-color 0.15s ease",
                      }}
                      onMouseOver={(e) => (e.target.style.borderColor = "#ED2027")}
                      onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                    />
                    <small style={{ display: "block", marginTop: 6, color: "#888" }}>
                      Minimum 30 characters required
                    </small>
                  </div>


                  
                  <div>
                    <button
                      type="button"
                      onClick={handleStep5Continue}
                      style={{
                        backgroundColor: "#ED2027",
                        color: "#fff",
                        padding: "12px 28px",
                        borderRadius: 6,
                        fontWeight: 600,
                        border: "none",
                        cursor: "pointer",
                        fontSize: 15,
                        transition: "background-color 0.15s ease",
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#c41b21")}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ED2027")}
                    >
                      Continue
                    </button>
                  </div>
                </div> */}
              </>
            )}

            {currentStep === 6 && (
              <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
                <h4
                  style={{
                    color: "#333",
                    fontWeight: 600,
                    fontSize: "clamp(16px, 4vw, 18px)",
                    marginBottom: 20,
                  }}
                >
                  Select Amenities
                </h4>

                <div style={{ marginBottom: 25 }}>
                  <h5
                    style={{
                      color: "#444",
                      fontWeight: 600,
                      fontSize: "clamp(14px, 3.5vw, 15px)",
                      marginBottom: 15,
                    }}
                  >
                    Amenities
                  </h5>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                      gap: "10px",
                    }}
                  >
                    {allAmenities.length > 0 ? (
                      allAmenities.map((amenity) => (
                        <button
                          key={amenity.name}
                          type="button"
                          onClick={() => toggleAmenity(amenity.name)}
                          className={`amenity-btn ${selectedAmenities.includes(amenity.name) ? "active" : ""
                            }`}
                        >
                          {amenity.image && (
                            <img
                              src={`${api.imageUrl}/${amenity.image}`}
                              alt={amenity.name}
                              className="amenity-icon"
                              style={{
                                width: 20,
                                height: 20,
                                marginRight: 6,
                                verticalAlign: "middle",
                              }}
                            />
                          )}
                          {amenity.name}
                        </button>
                      ))
                    ) : (
                      <p>No amenities found.</p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleUpdate6}
                  className="submit-btn"
                  style={{ marginTop: "80px" }}
                >
                  Submit Property
                </button>
              </div>
            )}



          </div>
        </div>
      </div>
    </div >
  );
};

export default UpdateProperty;