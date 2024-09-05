import './Home.css'; // Assuming you have a CSS file for styling
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const goToInsertReceipt = () => {
        navigate('/ReceiptUploader'); // Update this path according to your routing setup
    };

    return (
        <div className="home-container">
            <header>
                <h1>Receipt Analyzer</h1>
            </header>
            <section className="content-section">
                <div className="project-description">
                    <h2>About Our Analyzer</h2>
                    <p>
                        Our Receipt Analyzer is a powerful tool that helps you keep track of your expenses by analyzing
                        and extracting key information from your receipts. Whether you need to categorize your spending,
                        track specific items, or just save digital copies, our analyzer makes it simple and efficient.
                    </p>
                    <p>
                        Upload your receipts and let our system automatically detect the items, prices, and more. Stay organized
                        and gain insights into your spending habits effortlessly.
                    </p>
                    <p>
                        Get started today and take control of your finances with ease!
                    </p>
                </div>
                <button className="insert-receipt-button" onClick={goToInsertReceipt}>
                    Lets Get Started
                </button>
            </section>
        </div>
    );
}

export default Home;
