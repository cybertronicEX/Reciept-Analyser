import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Pie } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'chart.js/auto'; // Required for chart.js to work
import './DataVisualizerPage.css';

const DataVisualizationPage = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const today = new Date();
    const [apiResponse, setApiResponse] = useState(null);
    const [loadingRecommendation, setLoadingRecommendation] = useState(false); // New state for loading recommendation


    useEffect(() => {
        // Fetch data from the backend API
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/charges');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const parseDate = (dateString) => {
        const [day, month, year] = dateString.split('/');
        return new Date(`${year}-${month}-${day}`);
    };

    // Filter the data by date range
    const filterDataByDateRange = () => {
        if (!startDate || !endDate) return data;

        return data.filter((item) => {
            const itemDate = parseDate(item.date); // Use parsed date here
            return itemDate >= startDate && itemDate <= endDate;
        });
    };

    const filteredData = filterDataByDateRange();


    // Function to call the API and get the result
    const processFilteredData = async () => {
        try {
            setLoadingRecommendation(true); // Start loading

            const response = await axios.post('http://localhost:5001/api/ai/process-data', { filteredData });

            // Display response data
            if (response && response.data) {
                setApiResponse(response.data);
            } else {
                console.error('Unexpected response format');
            }
        } catch (error) {
            console.error('Error processing data:', error);
        } finally {
            setLoadingRecommendation(false); // End loading
        }
    };
    // Prepare data for the Expenses Over Time chart
    const expensesData = {
        labels: filteredData.map((item) => item.date),
        datasets: [
            {
                label: 'Amount Spent',
                data: filteredData.map((item) => item.amount),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Prepare data for Repetitive Payments (Total amount per payee)
    const repetitivePaymentsData = filteredData.reduce((acc, item) => {
        const found = acc.find((i) => i.payee === item.payee);
        if (found) {
            found.amount += item.amount;
        } else {
            acc.push({ payee: item.payee, amount: item.amount });
        }
        return acc;
    }, []);

    const repetitivePaymentsChartData = {
        labels: repetitivePaymentsData.map((item) => item.payee),
        datasets: [
            {
                label: 'Repetitive Payments',
                data: repetitivePaymentsData.map((item) => item.amount),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(199, 199, 199, 0.6)',
                ],
            },
        ],
    };


    // Prepare data for Spending Categories (Total amount per category)
    const categoryData = filteredData.reduce((acc, item) => {
        const found = acc.find((i) => i.category === item.category);
        if (found) {
            found.amount += item.amount;
        } else {
            acc.push({ category: item.category, amount: item.amount });
        }
        return acc;
    }, []);

    // Prepare data for the Spending by Category pie chart
    const categoryChartData = {
        labels: categoryData.map((item) => item.category),
        datasets: [
            {
                label: 'Spending by Category',
                data: categoryData.map((item) => item.amount),
                backgroundColor: [
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(199, 199, 199, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                ],
            },
        ],
    };

    return (
        <div className="content-container">
            <div className="background-blur"></div>
            <div className="min-h-screen p-6">
                <div className="max-w-6xl mx-auto">
    
                    <div className="bg-white p-6 rounded-lg shadow-md mb-8 text-center">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Analyze Your Spending</h3>
                        <p className="text-gray-600 mb-6">
                            Pick your dates, hit "Analyze," and let our AI suggest ways to save money and spend smarter.
                        </p>
                        <div className="flex justify-center items-center flex-wrap gap-4">
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                placeholderText="Start Date"
                                maxDate={today}
                                className="w-40 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                placeholderText="End Date"
                                maxDate={today}
                                className="w-40 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button 
                                onClick={processFilteredData} 
                                disabled={!startDate || !endDate} 
                                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Analyze
                            </button>
                        </div>
                    </div>
    
                    {/* Our Findings Section */}
                    {apiResponse && (
                        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Our Findings...</h3>
                            <p className="text-gray-600">
                                {apiResponse}
                            </p>
                        </div>
                    )}
    
                    <div className="bg-white p-6 rounded-lg shadow-md mb-8 max-w-full">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Expenses Over Time</h3>
                        <div className="relative h-64">
                            <Line data={expensesData} options={{ responsive: true, maintainAspectRatio: false }} />
                        </div>
                    </div>
    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Who Took Your Money?</h3>
                            <div className="relative h-64">
                                <Pie data={repetitivePaymentsChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                            </div>
                        </div>
    
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Spending by Category</h3>
                            <div className="relative h-64">
                                <Pie data={categoryChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    
    
    
    
    
    
};

export default DataVisualizationPage;
