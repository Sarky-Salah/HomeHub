// client/src/pages/lanlord/landlordDashboard.jsx

import { useEffect, useState } from "react";
import PropertyCard from "../../components/PropertyCard";
import { useAuth } from "../../context/AuthContext";
import API_BASE from "../../config/api";
import "../../styles/property.css"
import "../../styles/global.css"

function TenantDashboard() {
    const [properties, setProperties] = useState([]);
    const { user } = useAuth();
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [search, setSearch] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(false);
    const isLoggedIn = !!user;

    const [filters, setFilters] = useState({
        minPrice: "",
        maxPrice: "",
        location: "",
        propertyType: ""
    });

    const [appliedFilters, setAppliedFilters] = useState({
        minPrice: "",
        maxPrice: "",
        location: "",
        propertyType: ""
    });
    
    useEffect(() => {

        const handleScroll = () => {
    
            if (
                window.innerHeight + window.scrollY >=
                document.documentElement.scrollHeight - 200 &&
                hasMore &&
                !loading
            ) {
                setPage(prev => prev + 1);
            }
        };
    
        window.addEventListener("scroll", handleScroll);
    
        return () =>
            window.removeEventListener("scroll", handleScroll);
    
    }, [hasMore, loading]);

    useEffect(() => {
        const loadProperties = async () => {
    
            if (loading) return;
    
            setLoading(true);
    
            const query = new URLSearchParams({
                page,
                search: appliedSearch,
                sort: sortBy,
                minPrice: appliedFilters.minPrice,
                maxPrice: appliedFilters.maxPrice,
                location: appliedFilters.location,
                propertyType: appliedFilters.propertyType
            });
    
            const res = await fetch(
                `${API_BASE}/api/properties?${query}`
            );
    
            const data = await res.json();
    
            if (data.success) {
    
                if (page === 1) {
                    setProperties(data.properties);
                } else {
                    setProperties(prev => [
                        ...prev,
                        ...data.properties
                    ]);
                }
    
                setHasMore(page < data.totalPages);
            }
    
            setLoading(false);
        };
    
        loadProperties();
    
    }, [
        page,
        appliedSearch,
        appliedFilters,
        sortBy
    ]);

    return (
        <div>
            <div className="page-containers">
                <h1>HomeHub</h1>
                <h2>Your Stay Simplified</h2>
            </div>
            <div className="page-containers">
                <div className="horizontal">
                    <h1>
                        Welcome Back, {user?.fullname}
                    </h1>
                    <div className="search-bar">
                        <input className="input"
                            type="text"
                            placeholder="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button className="input"
                        onClick={() => { setProperties([]); setPage(1); setAppliedSearch(search); }} >
                        Search
                    </button>
                </div>
                <div className="horizontal">
                    <h1>
                        Landlord's Dashboard
                    </h1>
                    <div>
                        <select className="filter-btn"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >   <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                            <option value="priceLow">Price: Low → High</option>
                            <option value="priceHigh">Price: High → Low</option>
                        </select> &nbsp;&nbsp;
                        <div className="filter-dropdown">
                            <button
                                className="filter-btn"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                Filters ▼
                            </button>

                            {showFilters && (

                                <div className="filter-panel">

                                    <h3>Filter Properties</h3>

                                    <input
                                        type="number"
                                        placeholder="Minimum Price"
                                        value={filters.minPrice}
                                        onChange={(e)=>
                                            setFilters({
                                                ...filters,
                                                minPrice: e.target.value
                                            })
                                        }
                                    />

                                    <input
                                        type="number"
                                        placeholder="Maximum Price"
                                        value={filters.maxPrice}
                                        onChange={(e)=>
                                            setFilters({
                                                ...filters,
                                                maxPrice: e.target.value
                                            })
                                        }
                                    />

                                    <input
                                        placeholder="Location"
                                        value={filters.location}
                                        onChange={(e)=>
                                            setFilters({
                                                ...filters,
                                                location: e.target.value
                                            })
                                        }
                                    />

                                    <select
                                        value={filters.propertyType}
                                        onChange={(e)=>
                                            setFilters({
                                                ...filters,
                                                propertyType: e.target.value
                                            })
                                        }
                                    >
                                        <option value="">All Property Types</option>
                                        <option value="Apartment">Apartment</option>
                                        <option value="House">House</option>
                                        <option value="Hostel">Hostel</option>
                                        <option value="Commercial">Commercial</option>
                                    </select>

                                    <div className="filter-buttons">
                                        <button
                                            className="apply-filter"
                                            onClick={() => {
                                                setProperties([]);
                                                setPage(1);
                                                setAppliedFilters(filters);
                                                setShowFilters(false);
                                            }}
                                        >
                                            Apply Filters
                                        </button>

                                        <button
                                            className="clear-filter"
                                            onClick={() => {

                                                const emptyFilters = {
                                                    minPrice: "",
                                                    maxPrice: "",
                                                    location: "",
                                                    propertyType: ""
                                                };

                                                setFilters(emptyFilters);
                                                setAppliedFilters(emptyFilters);
                                                setSearch("");
                                                setAppliedSearch("");

                                                setProperties([]);
                                                setPage(1);

                                                setShowFilters(false);
                                            }}
                                        >
                                            Clear
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <hr /><hr />
                <div className="properties-container">
                    <div className="properties-list">
                        {properties
                            .filter((property) => property.availability)
                            .map((property) => (
                                <PropertyCard
                                    key={property._id}
                                    property={property}
                                    isLoggedIn={isLoggedIn}
                                />
                            ))}
                    </div>
                    {loading && (
                        <div className="loading-more">
                            Loading more properties...
                        </div>
                    )}

                    {!hasMore && properties.length > 0 && (
                        <div className="end-properties">
                            No more properties.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TenantDashboard;