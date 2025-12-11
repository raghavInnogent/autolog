import { Link } from 'react-router-dom'
import { FiCheckCircle, FiBell, FiTrendingUp, FiFileText, FiLayers, FiShield } from 'react-icons/fi'
import { FaCar, FaChartLine, FaCalendarAlt, FaTools } from 'react-icons/fa'
import heroDashboard from '../assets/hero_dashboard.png'
import featuresTracking from '../assets/features_tracking.png'
import analyticsPreview from '../assets/analytics_preview.png'
import '../styles/pages/LandingPage.css'

export default function LandingPage() {
    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero-section-landing">
                <div className="hero-content">
                    <div className="hero-text">
                        <h1 className="hero-title">
                            Smart Vehicle Maintenance
                            <span className="highlight"> Made Simple</span>
                        </h1>
                        <p className="hero-subtitle">
                            Never miss a service again. Track maintenance, manage expenses, and keep your vehicle in perfect condition with AutoLog's intelligent platform.
                        </p>
                        <div className="hero-cta">
                            <Link to="/register" className="cta-button primary">
                                Get Started Free
                            </Link>
                            <Link to="#features" className="cta-button secondary">
                                Learn More
                            </Link>
                        </div>
                        <div className="hero-stats">
                            <div className="stat-item-landing">
                                <FaCar size={24} color="#FFC300" />
                                <div>
                                    <div className="stat-number-landing">Multi-Vehicle</div>
                                    <div className="stat-label-landing">Support</div>
                                </div>
                            </div>
                            <div className="stat-item-landing">
                                <FiBell size={24} color="#FFC300" />
                                <div>
                                    <div className="stat-number-landing">Smart Alerts</div>
                                    <div className="stat-label-landing">& Reminders</div>
                                </div>
                            </div>
                            <div className="stat-item-landing">
                                <FiTrendingUp size={24} color="#FFC300" />
                                <div>
                                    <div className="stat-number-landing">Cost Analytics</div>
                                    <div className="stat-label-landing">& Insights</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="hero-image">
                        <img src={heroDashboard} alt="AutoLog Dashboard" />
                    </div>
                </div>
            </section>

            {/* Problem-Solution Section */}
            <section className="problem-solution">
                <div className="container">
                    <h2 className="section-title">The Problem We Solve</h2>
                    <div className="problem-grid">
                        <div className="problem-card">
                            <div className="problem-icon">⚠️</div>
                            <h3>Missed Services</h3>
                            <p>Inconsistent reminders lead to overdue maintenance and costly repairs</p>
                        </div>
                        <div className="problem-card">
                            <div className="problem-icon">📄</div>
                            <h3>Disorganized Records</h3>
                            <p>Physical invoices get lost, making it impossible to track service history</p>
                        </div>
                        <div className="problem-card">
                            <div className="problem-icon">💸</div>
                            <h3>Hidden Costs</h3>
                            <p>No visibility into spending patterns and total ownership costs</p>
                        </div>
                    </div>
                    <div className="solution-banner">
                        <h3>AutoLog is Your Complete Solution</h3>
                        <p>A centralized, intelligent logbook that offers clarity, early alerts, and complete vehicle health history</p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="features-section">
                <div className="container">
                    <h2 className="section-title">Powerful Features</h2>
                    <p className="section-subtitle">Everything you need to manage your vehicle maintenance efficiently</p>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <FiFileText size={32} />
                            </div>
                            <h3>Service History & Expenses</h3>
                            <p>Upload invoices or enter details manually. Our OCR technology extracts key data automatically - service dates, items, costs, and mileage.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <FiBell size={32} />
                            </div>
                            <h3>Predictive Maintenance</h3>
                            <p>Get timely reminders for oil changes, general service, tire checks, pollution certificates, insurance renewals, and warranties.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <FiShield size={32} />
                            </div>
                            <h3>Anomaly Detection</h3>
                            <p>Automatically flags overdue services, frequent repairs, or unusual cost spikes to keep you informed.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <FaChartLine size={32} />
                            </div>
                            <h3>Dashboard & Analytics</h3>
                            <p>Visualize past services, upcoming due dates, spending by category, cost per kilometer, and total ownership cost.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <FiLayers size={32} />
                            </div>
                            <h3>Document Storage</h3>
                            <p>Organize insurance papers, emission certificates, and warranties with automatic expiry notifications.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <FaCar size={32} />
                            </div>
                            <h3>Multi-Vehicle Support</h3>
                            <p>Switch between vehicles, compare costs, and manage reminders for families or small fleets effortlessly.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works">
                <div className="container">
                    <h2 className="section-title">How It Works</h2>
                    <div className="steps-grid">
                        <div className="step-card">
                            <div className="step-number">1</div>
                            <div className="step-icon">
                                <FaCar size={40} />
                            </div>
                            <h3>Register Your Vehicle</h3>
                            <p>Add vehicle details including model, purchase date, and odometer reading</p>
                        </div>

                        <div className="step-card">
                            <div className="step-number">2</div>
                            <div className="step-icon">
                                <FiFileText size={40} />
                            </div>
                            <h3>Upload Service Records</h3>
                            <p>Scan invoices or enter service details manually - our OCR does the rest</p>
                        </div>

                        <div className="step-card">
                            <div className="step-number">3</div>
                            <div className="step-icon">
                                <FaCalendarAlt size={40} />
                            </div>
                            <h3>Get Smart Reminders</h3>
                            <p>Receive timely alerts for upcoming maintenance and document renewals</p>
                        </div>

                        <div className="step-card">
                            <div className="step-number">4</div>
                            <div className="step-icon">
                                <FaChartLine size={40} />
                            </div>
                            <h3>Optimize & Save</h3>
                            <p>Analyze spending patterns and make informed decisions to reduce costs</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Analytics Preview */}
            <section className="analytics-preview">
                <div className="container">
                    <div className="preview-content">
                        <div className="preview-text">
                            <h2>Comprehensive Analytics Dashboard</h2>
                            <ul className="benefits-list">
                                <li><FiCheckCircle /> Track service trends over time</li>
                                <li><FiCheckCircle /> Monitor cost per kilometer</li>
                                <li><FiCheckCircle /> Compare vehicle expenses</li>
                                <li><FiCheckCircle /> Identify cost-saving opportunities</li>
                                <li><FiCheckCircle /> Export detailed reports</li>
                            </ul>
                            <Link to="/register" className="cta-button primary">
                                Start Tracking Now
                            </Link>
                        </div>
                        <div className="preview-image">
                            <img src={analyticsPreview} alt="Analytics Dashboard" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="final-cta">
                <div className="container">
                    <h2>Ready to Take Control of Your Vehicle Maintenance?</h2>
                    <p>Join thousands of vehicle owners who trust AutoLog to keep their vehicles in perfect condition</p>
                    <div className="cta-buttons">
                        <Link to="/register" className="cta-button primary large">
                            Get Started Free
                        </Link>
                        <Link to="/login" className="cta-button secondary large">
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-section">
                            <h3>AutoLog</h3>
                            <p>Smart vehicle maintenance tracking for modern vehicle owners</p>
                        </div>
                        <div className="footer-section">
                            <h4>Product</h4>
                            <ul>
                                <li><Link to="#features">Features</Link></li>
                                <li><Link to="/register">Get Started</Link></li>
                                <li><Link to="/login">Sign In</Link></li>
                            </ul>
                        </div>
                        <div className="footer-section">
                            <h4>Company</h4>
                            <ul>
                                <li><a href="#about">About</a></li>
                                <li><a href="#contact">Contact</a></li>
                                <li><a href="#privacy">Privacy</a></li>
                            </ul>
                        </div>
                        <div className="footer-section">
                            <h4>Support</h4>
                            <ul>
                                <li><a href="#help">Help Center</a></li>
                                <li><a href="#docs">Documentation</a></li>
                                <li><a href="#faq">FAQ</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2024 AutoLog. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}