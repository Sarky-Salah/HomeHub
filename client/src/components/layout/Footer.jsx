// client/src/components/layout/Footer.jsx
import "./Footer.css"

function Footer() {
    return (
        <footer className="footer">
            © {new Date().getFullYear()} HomeHub 
            <p className="copyright-text mb-0">Copyright &copy; 2026 HomeHub. Property of The-One Developers. All Rights Reserved.</p>
            <p>Email: <a href="mailto:info@theonedevs.com">info@theonedevs.com</a> &nbsp;&nbsp;&nbsp; Tel: (+256) 0782669545</p>

            <div>
                <a href="ContactUs.jsx">Contact Us</a> |
                <a href="Privacy.jsx">Privacy</a> |
                <a href="Terms&Conditions.jsx">Terms & Conditions</a>
            </div>
        </footer>
    );
}

export default Footer;