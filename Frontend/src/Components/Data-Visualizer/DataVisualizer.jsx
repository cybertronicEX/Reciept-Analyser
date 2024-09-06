import React, { useState } from 'react';
import { Line, Pie, Bar } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'chart.js/auto'; // Required for chart.js to work
import './DataVisualizerPage.css'
const DataVisualizationPage = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    // Dummy data (same structure as your table)
    const dummyData = [
        { charges: "Service Fee", amount: 100, category: "Services", payee: "John Doe", payment_type: "Credit Card", date: "2024-09-01", time: "10:30 AM" },
        { charges: "Product Purchase", amount: 250, category: "Products", payee: "Jane Smith", payment_type: "Cash", date: "2024-09-02", time: "12:45 PM" },
        { charges: "Consultation", amount: 300, category: "Consulting", payee: "Michael Johnson", payment_type: "Debit Card", date: "2024-09-03", time: "03:00 PM" },
        { charges: "Maintenance Fee", amount: 150, category: "Maintenance", payee: "John Doe", payment_type: "Credit Card", date: "2024-09-05", time: "09:00 AM" },
        { charges: "Product Purchase", amount: 200, category: "Products", payee: "Jane Smith", payment_type: "Cash", date: "2024-09-06", time: "11:30 AM" },
        { charges: "Consultation", amount: 400, category: "Consulting", payee: "Michael Johnson", payment_type: "Debit Card", date: "2024-09-07", time: "02:00 PM" },
    ];

    // Filter the dummy data by date range
    const filterDataByDateRange = () => {
        if (!startDate || !endDate) return dummyData;

        return dummyData.filter((item) => {
            const itemDate = new Date(item.date);
            return itemDate >= startDate && itemDate <= endDate;
        });
    };

    const filteredData = filterDataByDateRange();

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
                ],
            },
        ],
    };

    return (
        <div className="data-visualization-container">
            <h2>Data Visualization</h2>
            <div className='suggestions'>
            <h3>Suggestion....</h3>
            <input
                    type="text"
                    value={'Maybe go slow on the boba tea.....'}
                    disabled
                
                />
            </div>
            <div className="date-range-picker">
                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="Start Date"
                />
                <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="End Date"
                    minDate={startDate}
                />
            </div>
     

            <div className="chart-container">
                <h3>Expenses Over Time</h3>
                <Line data={expensesData} options={{ responsive: true }} />
            </div>

            <div className="chart-container">
                <h3>Repetitive Payments</h3>
                <Pie data={repetitivePaymentsChartData} options={{ responsive: true }} />
            </div>
        </div>


    );
};

export default DataVisualizationPage;
