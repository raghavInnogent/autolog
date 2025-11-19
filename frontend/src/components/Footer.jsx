import React from 'react'
import '../styles/components/Footer.css'

export default function Footer(){
	return (
		<footer className="footer">
			<div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
				<div>AutoLog © {new Date().getFullYear()}</div>
				<div style={{color:'var(--muted)'}}>Built for vehicle maintenance tracking</div>
			</div>
		</footer>
	)
}
