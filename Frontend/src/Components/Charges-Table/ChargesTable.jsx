import React, { useState } from 'react';
import './ChargesTable.css';

const ChargesTable = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('');
    const [filterValue, setFilterValue] = useState('');
    const [showFilters, setShowFilters] = useState(false); // Toggle filter visibility
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Number of rows per page

    // Sample data for the table
    const data = [
        { charges: "Service Fee", amount: 100, category: "Services", payee: "John Doe", payment_type: "Credit Card", date: "2024-09-05", time: "10:30 AM" },
        { charges: "Product Purchase", amount: 250, category: "Products", payee: "Jane Smith", payment_type: "Cash", date: "2024-09-05", time: "12:45 PM" },
        { charges: "Consultation", amount: 300, category: "Consulting", payee: "Michael Johnson", payment_type: "Debit Card", date: "2024-09-04", time: "03:00 PM" },
        { charges: "Subscription", amount: 400, category: "Services", payee: "Emma Wilson", payment_type: "Credit Card", date: "2024-09-03", time: "02:00 PM" },
    ];

    // Handle global search
    const handleGlobalSearch = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    // Handle filter selection (checkbox toggle)
    const handleFilterCheckboxChange = (filter) => {
        setActiveFilter(filter === activeFilter ? '' : filter);
        setFilterValue('');
    };

    // Handle column filter
    const handleFilterValueChange = (event) => {
        setFilterValue(event.target.value);
    };

    // Filter data based on global search and selected filter
    const filteredData = data.filter((row) => {
        const matchesGlobalSearch = Object.values(row).some(value =>
            value.toString().toLowerCase().includes(searchTerm)
        );

        let matchesFilter = true;

        if (activeFilter && filterValue) {
            switch (activeFilter) {
                case 'charges':
                case 'category':
                case 'payee':
                    matchesFilter = row[activeFilter].toLowerCase().includes(filterValue);
                    break;
                case 'amount':
                    matchesFilter = parseFloat(row[activeFilter]) > parseFloat(filterValue);
                    break;
                case 'payment_type':
                    matchesFilter = row[activeFilter] === filterValue;
                    break;
                case 'date':
                    matchesFilter = row[activeFilter] === filterValue;
                    break;
                default:
                    break;
            }
        }

        return matchesGlobalSearch && matchesFilter;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    // Navigate to the next page
    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    // Navigate to the previous page
    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    // Different filter input based on active filter
    const renderFilterInput = () => {
        if (['charges', 'category', 'payee'].includes(activeFilter)) {
            return (
                <input
                    type="text"
                    placeholder={`Enter ${activeFilter}`}
                    value={filterValue}
                    onChange={handleFilterValueChange}
                />
            );
        } else if (activeFilter === 'amount') {
            return (
                <input
                    type="number"
                    placeholder="Enter amount"
                    value={filterValue}
                    onChange={handleFilterValueChange}
                />
            );
        } else if (activeFilter === 'payment_type') {
            return (
                <select value={filterValue} onChange={handleFilterValueChange}>
                    <option value="">Select Payment Type</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Cash">Cash</option>
                </select>
            );
        } else if (activeFilter === 'date') {
            return (
                <input
                    type="date"
                    value={filterValue}
                    onChange={handleFilterValueChange}
                />
            );
        }

        return null;
    };

    return (
        <div className="table-container">
            <div className="table-component-container">
                {/* Global Search */}
                <div className="global-search">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleGlobalSearch}
                        className="global-search-input"
                    />
                    <button onClick={() => setShowFilters(!showFilters)}>
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>
                </div>

                {/* Filter Options (conditionally rendered) */}
                {showFilters && (
                    <div className="filter-container">
                        <div className="filter-selection">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={activeFilter === 'charges'}
                                    onChange={() => handleFilterCheckboxChange('charges')}
                                /> Charges
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={activeFilter === 'amount'}
                                    onChange={() => handleFilterCheckboxChange('amount')}
                                /> Amount
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={activeFilter === 'category'}
                                    onChange={() => handleFilterCheckboxChange('category')}
                                /> Category
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={activeFilter === 'payee'}
                                    onChange={() => handleFilterCheckboxChange('payee')}
                                /> Payee
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={activeFilter === 'payment_type'}
                                    onChange={() => handleFilterCheckboxChange('payment_type')}
                                /> Payment Type
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={activeFilter === 'date'}
                                    onChange={() => handleFilterCheckboxChange('date')}
                                /> Date
                            </label>
                        </div>
                        {/* Show filter input based on selected column */}
                        {activeFilter && (
                            <div className="filter-input">
                                {renderFilterInput()}
                            </div>
                        )}
                    </div>
                )}

                {/* Charges Table */}
                <table className="charges-table">
                    <thead>
                        <tr>
                            <th>Charges</th>
                            <th>Amount</th>
                            <th>Category</th>
                            <th>Payee</th>
                            <th>Payment Type</th>
                            <th>Date</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((row, index) => (
                            <tr key={index}>
                                <td>{row.charges}</td>
                                <td>{row.amount}</td>
                                <td>{row.category}</td>
                                <td>{row.payee}</td>
                                <td>{row.payment_type}</td>
                                <td>{row.date}</td>
                                <td>{row.time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="pagination-controls">
                    <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                        Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChargesTable;
