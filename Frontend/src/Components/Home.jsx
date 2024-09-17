import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const goToInsertReceipt = () => {
        navigate('/ReceiptUploader');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="container mx-auto p-4">
                <header className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-800">Receipt Analyzer</h1>
                </header>
                <section className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-gray-700">About Our Analyzer</h2>
                        <p className="text-gray-600 mt-4">
                            Our Receipt Analyzer is a powerful tool that helps you keep track of your expenses by analyzing
                            and extracting key information from your receipts. Whether you need to categorize your spending,
                            track specific items, or just save digital copies, our analyzer makes it simple and efficient.
                        </p>
                        <p className="text-gray-600 mt-4">
                            Upload your receipts and let our system automatically detect the items, prices, and more. Stay organized
                            and gain insights into your spending habits effortlessly.
                        </p>
                        <p className="text-gray-600 mt-4">
                            Get started today and take control of your finances with ease!
                        </p>
                    </div>
                    <button
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        onClick={goToInsertReceipt}
                    >
                        Let's Get Started
                    </button>
                </section>
            </div>
        </div>
    );
}

export default Home;

