import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import styled from 'styled-components';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, loginWithGoogle, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    loginWithGoogle();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <Nav>
      <NavContainer>
        <Logo to="/" onClick={handleNavClick}>Green Planet</Logo>
        
        <NavMenu $isOpen={isOpen}>
          <NavLink to="/" onClick={handleNavClick}>Home</NavLink>
          <NavLink to="/products" onClick={handleNavClick}>Products</NavLink>
          <NavLink to="/blogs" onClick={handleNavClick}>Blogs</NavLink>
          <NavLink to="/donations" onClick={handleNavClick}>Donations</NavLink>
          
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" onClick={handleNavClick}>Dashboard</NavLink>
              <NavLink to="/cart" onClick={handleNavClick}>
                Cart ({getCartItemsCount()})
              </NavLink>
              <UserMenu>
                <UserAvatar src={user?.avatar} alt={user?.name} />
                <UserName>{user?.name}</UserName>
                <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
              </UserMenu>
            </>
          ) : (
            <GoogleButton onClick={handleLogin}>
              Sign in with Google
            </GoogleButton>
          )}
        </NavMenu>
        
        <Hamburger onClick={() => setIsOpen(!isOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </Hamburger>
      </NavContainer>
    </Nav>
  );
};

// Styled components
const Nav = styled.nav`
  background: #2e7d32;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const Logo = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
  z-index: 101;
`;

const NavMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #2e7d32;
    padding: 2rem;
    display: ${props => props.$isOpen ? 'flex' : 'none'};
    justify-content: center;
    gap: 2rem;
    z-index: 100;
    transition: transform 0.3s ease-in-out;
  }
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
    padding: 1rem;
    text-align: center;
    width: 100%;
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    margin-top: 1rem;
  }
`;

const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid white;

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
  }
`;

const UserName = styled.span`
  color: white;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const LogoutButton = styled.button`
  background: #ff4757;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background: #ff3742;
  }

  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 1.1rem;
  }
`;

const GoogleButton = styled.button`
  background: #4285f4;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background: #357ae8;
  }

  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 1.1rem;
  }
`;

const Hamburger = styled.div`
  display: none;
  flex-direction: column;
  cursor: pointer;
  z-index: 101;

  span {
    width: 25px;
    height: 3px;
    background: white;
    margin: 3px 0;
    transition: 0.3s;
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

export default Navbar;