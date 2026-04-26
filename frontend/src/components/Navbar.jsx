import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span>SpectraGuard</span>
      </div>
      <ul className="navbar-links">
        <li><a href="#about">About</a></li>
        <li><a href="#demo">Demo</a></li>
        <li><a href="#contact">Contact Us</a></li>
      </ul>
      <div className="navbar-profile">
        <div className="profile-placeholder"></div>
      </div>
    </nav>
  );
}
