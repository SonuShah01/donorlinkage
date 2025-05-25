
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-blood-blue text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">DonorLinkage</h3>
            <p className="text-sm">
              Connecting blood donors with those in need. Our mission is to create a seamless network that saves lives.
            </p>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-blood-cyan hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/register" className="text-blood-cyan hover:text-white transition-colors">Become a Donor</Link></li>
              <li><Link to="/request" className="text-blood-cyan hover:text-white transition-colors">Request Blood</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-blood-cyan hover:text-white transition-colors">Blood Donation FAQ</a></li>
              <li><a href="#" className="text-blood-cyan hover:text-white transition-colors">Eligibility Criteria</a></li>
              <li><a href="#" className="text-blood-cyan hover:text-white transition-colors">Donation Process</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="text-sm">Email: contact@donorlinkage.com</li>
              <li className="text-sm">Phone: (555) 123-4567</li>
              <li className="text-sm">Emergency Hotline: (555) 911-BLOOD</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-blood-lightblue mt-8 pt-4 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} DonorLinkage. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
