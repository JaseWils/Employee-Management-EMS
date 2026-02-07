import React, { useState } from 'react';
import './AdvancedSearch.css';

const AdvancedSearch = ({ onSearch, filters = [] }) => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [searchParams, setSearchParams] = useState({
        query: '',
        filters: {}
    });

    const handleSearch = () => {
        onSearch(searchParams);
    };

    const handleFilterChange = (filterName, value) => {
        setSearchParams(prev => ({
            ...prev,
            filters: {
                ...prev.filters,
                [filterName]: value
            }
        }));
    };

    const clearFilters = () => {
        setSearchParams({
            query: '',
            filters: {}
        });
        onSearch({ query: '', filters: {} });
    };

    return (
        <div className="advanced-search">
            <div className="search-input-wrapper">
                <i className="fa fa-search"></i>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchParams.query}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, query: e.target.value }))}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button onClick={() => setShowAdvanced(!showAdvanced)} className="advanced-toggle">
                    <i className={`fa fa-sliders-h ${showAdvanced ? 'active' : ''}`}></i>
                </button>
                <button onClick={handleSearch} className="search-btn">
                    Search
                </button>
            </div>

            {showAdvanced && (
                <div className="advanced-filters">
                    <div className="filters-grid">
                        {filters.map((filter, index) => (
                            <div key={index} className="filter-item">
                                <label>{filter.label}</label>
                                {filter.type === 'select' ? (
                                    <select
                                        value={searchParams.filters[filter.name] || ''}
                                        onChange={(e) => handleFilterChange(filter.name, e.target.value)}
                                    >
                                        <option value="">All</option>
                                        {filter.options.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                ) : filter.type === 'date' ? (
                                    <input
                                        type="date"
                                        value={searchParams.filters[filter.name] || ''}
                                        onChange={(e) => handleFilterChange(filter.name, e.target.value)}
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        placeholder={filter.placeholder}
                                        value={searchParams.filters[filter.name] || ''}
                                        onChange={(e) => handleFilterChange(filter.name, e.target.value)}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="filter-actions">
                        <button onClick={clearFilters} className="btn-clear">
                            Clear All
                        </button>
                        <button onClick={handleSearch} className="btn-apply">
                            Apply Filters
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdvancedSearch;