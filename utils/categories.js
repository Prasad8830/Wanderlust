// "trending" is not stored on listings, it sorts all listings by review count
module.exports.categories = [
    { value: "trending", label: "Trending", icon: "fa-solid fa-fire" },
    { value: "hotels", label: "Hotels", icon: "fa-solid fa-hotel" },
    { value: "rooms", label: "Rooms", icon: "fa-solid fa-house-chimney-window" },
    { value: "iconic-cities", label: "Iconic Cities", icon: "fa-solid fa-mountain-city" },
    { value: "mountains", label: "Mountains", icon: "fa-solid fa-mountain-sun" },
    { value: "castles", label: "Castles", icon: "fa-brands fa-fort-awesome" },
    { value: "amazing-pools", label: "Amazing Pools", icon: "fa-solid fa-person-swimming" },
    { value: "beachfront", label: "Beachfront", icon: "fa-solid fa-umbrella-beach" },
    { value: "camping", label: "Camping", icon: "fa-solid fa-campground" },
    { value: "boats", label: "Boats", icon: "fa-solid fa-sailboat" },
    { value: "domes", label: "Domes", icon: "fa-solid fa-igloo" },
    { value: "arctic", label: "Arctic", icon: "fa-solid fa-snowflake" },
];

module.exports.listingCategories = module.exports.categories
    .map((c) => c.value)
    .filter((v) => v !== "trending");
