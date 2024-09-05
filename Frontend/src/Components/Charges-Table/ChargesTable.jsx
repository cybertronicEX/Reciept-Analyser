import React, { useState } from 'react';
import './ChargesTable.css';

const ChargesTable = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('');
    const [filterOption, setFilterOption] = useState('');
    const [filterValue, setFilterValue] = useState('');

    // Sample data for the table
    const data = [
        { charges: "Service Fee", amount: 100, category: "Services", payee: "John Doe", payment_type: "Credit Card", date: "2024-09-05", time: "10:30 AM" },
        { charges: "Product Purchase", amount: 250, category: "Products", payee: "Jane Smith", payment_type: "Cash", date: "2024-09-05", time: "12:45 PM" },
        { charges: "Consultation", amount: 300, category: "Consulting", payee: "Michael Johnson", payment_type: "Debit Card", date: "2024-09-04", time: "03:00 PM" },
    ];

    // Handle global search
    const handleGlobalSearch = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    // Handle filter selection
    const handleFilterOptionChange = (event) => {
        setFilterOption(event.target.value);
        setFilterValue(''); // Reset the value when the option changes
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
                    if (filterOption === 'contains') {
                        matchesFilter = row[activeFilter].toLowerCase().includes(filterValue);
                    } else if (filterOption === 'startsWith') {
                        matchesFilter = row[activeFilter].toLowerCase().startsWith(filterValue);
                    } else if (filterOption === 'endsWith') {
                        matchesFilter = row[activeFilter].toLowerCase().endsWith(filterValue);
                    }
                    break;

                case 'amount':
                    const value = parseFloat(filterValue);
                    if (filterOption === 'greaterThan') {
                        matchesFilter = row[activeFilter] > value;
                    } else if (filterOption === 'lessThan') {
                        matchesFilter = row[activeFilter] < value;
                    } else if (filterOption === 'equals') {
                        matchesFilter = row[activeFilter] === value;
                    }
                    break;

                case 'payment_type':
                    matchesFilter = row[activeFilter] === filterValue;
                    break;

                case 'date':
                    matchesFilter = row[activeFilter] === filterValue; // Implement advanced date filtering logic if needed
                    break;

                default:
                    break;
            }
        }

        return matchesGlobalSearch && matchesFilter;
    });

    // Different filter input depending on the active filter
    const renderFilterInput = () => {
        if (activeFilter === 'amount') {
            return (
                <>
                    <select value={filterOption} onChange={handleFilterOptionChange}>
                        <option value="">Select Option</option>
                        <option value="greaterThan">Greater than</option>
                        <option value="lessThan">Less than</option>
                        <option value="equals">Equal to</option>
                    </select>
                    <input
                        type="number"
                        placeholder="Enter value"
                        value={filterValue}
                        onChange={handleFilterValueChange}
                    />
                </>
            );
        } else if (['charges', 'category', 'payee'].includes(activeFilter)) {
            return (
                <>
                    <select value={filterOption} onChange={handleFilterOptionChange}>
                        <option value="">Select Option</option>
                        <option value="contains">Contains</option>
                        <option value="startsWith">Starts with</option>
                        <option value="endsWith">Ends with</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Enter text"
                        value={filterValue}
                        onChange={handleFilterValueChange}
                    />
                </>
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
                </div>

                {/* Filter Dropdown */}
                <div className="filter-container">
                    <div className="filter-selection">
                        <label>Filter</label>
                        <select
                            value={activeFilter}
                            onChange={(e) => {
                                setActiveFilter(e.target.value);
                                setFilterOption('');
                                setFilterValue('');
                            }}
                        >
                            <option value="">...</option>
                            <option value="charges">Charges</option>
                            <option value="amount">Amount</option>
                            <option value="category">Category</option>
                            <option value="payee">Payee</option>
                            <option value="payment_type">Payment Type</option>
                            <option value="date">Date</option>
                            <option value="time">Time</option>
                        </select>
                    </div>
                    <hr></hr>
                    {/* Show filter input based on selected column */}
                    {activeFilter && (
                        <div className="filter-input">
                            {renderFilterInput()}
                        </div>
                    )}
                </div>
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
                        {filteredData.map((row, index) => (
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
            </div>
        </div>
    );
};

export default ChargesTable;
