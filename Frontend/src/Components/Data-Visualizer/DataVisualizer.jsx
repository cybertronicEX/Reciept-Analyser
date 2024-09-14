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
                const response = await axios.get('https://reciept-analyser.vercel.app/api/charges');
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

            const response = await axios.post('https://reciept-analyser.vercel.app/api/ai/process-data', { filteredData });

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
        <div className="data-visualization-container">
            <h2>Data Visualization</h2>

            <div className="date-range-picker">
                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="Start Date"
                    maxDate={today}
                />
                <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="End Date"
                    maxDate={today}
                />
                <button onClick={processFilteredData} disabled={!startDate || !endDate}>Analyze</button>
            </div>
            <div className='suggestions'>
                {loadingRecommendation ? (
                    <div className="loading-screen">
                        <div className="spinner"></div>
                        <p>Analyzing...</p>
                    </div>
                ) : (
                    apiResponse && (
                        <div className="api-response">
                            <h3>Our Findings...</h3>
                            <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
                        </div>
                    )
                )}
            </div>
            {loading ? (
                <>
                    <div className="spinner"></div>
                    <p>Loading data...</p>
                </>
            ) : (
                <>
                    <div className="chart-container">
                        <h3>Expenses Over Time</h3>
                        <Line data={expensesData} options={{ responsive: true }} />
                    </div>

                    <div className="chart-container-pie">
                        <div>
                            <h3>Who took your money?</h3>
                            <Pie data={repetitivePaymentsChartData} options={{ responsive: true }} />
                        </div>

                        <div>
                            <h3>Spending by Category</h3>
                            <Pie data={categoryChartData} options={{ responsive: true }} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default DataVisualizationPage;
