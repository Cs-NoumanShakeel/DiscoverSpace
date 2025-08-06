import { Link } from "react-router-dom";
import "../styles/footer.css";

export default function Footer() {
    return (
        <div className="footer">
            <div className="link-columns">
                <div className="footer-col">
                    <Link to='/'><i className="fab fa-facebook-f" /> Facebook</Link>
                    <Link to='/'><i className="fab fa-instagram" /> Instagram</Link>
                    <Link to='/'><i className="fab fa-square-x-twitter" /> Twitter/X</Link>
                    <Link to='/'><i className="fab fa-whatsapp" /> Whatsapp</Link>
                    
                </div>
                <div className="footer-col">
                    <Link to='/'>About</Link>
                    <Link to='/'>Faq</Link>
                    <Link to='/'>Languages</Link>
                    <Link to='/'>Contact</Link>
                </div>
                <div className="footer-col">
                    <Link to='/'>Join Us</Link>
                    <Link to='/'>Blogs</Link>
                    <Link to='/'>Future Trends</Link>
                    <Link to='/'>Recommendations</Link>
                  
                </div>
            </div>
            <div className="copyright">
                <p>© Copyright Pakistan.info - All rights reserved - Disclaimer & Privacy Policy</p>
            </div>
        </div>
    );
}
