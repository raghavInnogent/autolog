import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiCheck, FiCalendar, FiMessageSquare, FiBook, FiSearch } from 'react-icons/fi'
import '../styles/pages/LandingPage.css'

export default function LandingPage() {
    const [subtextIndex, setSubtextIndex] = useState(0);
    const subtextParts = [
        "Online bookings",
        "SMS reminders",
        "digital service book and much more.",
        "Everything in one place."
    ];

    useEffect(() => {
        if (subtextIndex < subtextParts.length) {
            const timer = setTimeout(() => {
                setSubtextIndex(prev => prev + 1);
            }, 800); // Delay between parts appearing
            return () => clearTimeout(timer);
        }
    }, [subtextIndex]);

    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="landing-hero">
                <div className="hero-content">
                    <h1>A Simpler Life with Online Records</h1>
                    <div className="hero-subtext">
                        {subtextParts.map((part, index) => (
                            <span
                                key={index}
                                className={`subtext-part ${index < subtextIndex ? 'visible' : ''}`}
                            >
                                {part}{index < subtextParts.length - 1 && index !== 2 ? ', ' : ' '}
                            </span>
                        ))}
                    </div>
                    <Link to="/signup" className="cta-button">Start for free</Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="landing-section">
                <h2 className="section-title">Everything you need</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <FiCalendar size={32} className="feature-icon" />
                        <h3>Online bookings</h3>
                        <p>Customers can book appointments 24/7 through your website while you focus on your work.</p>
                    </div>
                    <div className="feature-card">
                        <FiMessageSquare size={32} className="feature-icon" />
                        <h3>SMS reminders</h3>
                        <p>Automatic notifications for MOT, service and oil changes. Stay in touch with customers automatically.</p>
                    </div>
                    <div className="feature-card">
                        <FiBook size={32} className="feature-icon" />
                        <h3>Digital service book</h3>
                        <p>Complete vehicle history with photos and documents. Accessible anytime, anywhere.</p>
                    </div>
                    <div className="feature-card">
                        <FiSearch size={32} className="feature-icon" />
                        <h3>Smart Search</h3>
                        <p>Quick access to all the data you need at work. Find customer records instantly.</p>
                    </div>
                </div>
            </section>

            {/* Solutions Section */}
            <section className="landing-section" style={{ background: 'var(--card)' }}>
                <h2 className="section-title">For every type of operation</h2>
                <div className="solutions-grid">
                    <div className="solution-item">
                        <h4>Auto Service</h4>
                        <p>Comprehensive solution for professional services</p>
                    </div>
                    <div className="solution-item">
                        <h4>Tyre Service</h4>
                        <p>Specialized functions for tyres</p>
                    </div>
                    <div className="solution-item">
                        <h4>Fleet Management</h4>
                        <p>Corporate vehicle management</p>
                    </div>
                    <div className="solution-item">
                        <h4>Small Garage</h4>
                        <p>Simple solution for small operations</p>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="landing-hero" style={{ minHeight: '40vh', background: 'transparent' }}>
                <h2>Ready to start?</h2>
                <p>Try Autolog for 7 days completely free. No commitments, cancel anytime.</p>
                <Link to="/signup" className="cta-button">Get Started Now</Link>
            </section>
        </div>
    )
}