import React from 'react';
import { Link, Route, Routes, NavLink } from 'react-router-dom';
import RedirectToLogin from '../pages/unAuthApp/RedirectToLogin.jsx';
import Login from '../pages/unAuthApp/Login.jsx';
import Register from '../pages/unAuthApp/Register.jsx';
import Footer from '../components/Footer.jsx';
import PartFooter from '../core/Footer/PartFooter.jsx';
import WrapperBackGround from '../components/WrapperBackGround.jsx';
import SocialMedia from '../components/Footer/SocialMedia.jsx';
import LocalOffice from '../components/Footer/LocalOffice.jsx';
import CenterLocale from '../components/Footer/CenterLocale.jsx';
import WrapperBody from '../components/WrapperBody.jsx';
import dataOffice from '@/data/dataOffice.js';
import { useState, useEffect } from 'react';
function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<RedirectToLogin />} />{' '}
    </Routes>
  );
}

function UnauthenticatedApp() {
  const [office, setOffice] = useState(1);
  const [title, setTitle] = useState('1');

  const onchangeOffice = (number) => {
    setOffice(number);
  };

  useEffect(() => {
    setTitle(dataOffice(office));
  }, [office]);
  // dataOffice(office);
  return (
    <WrapperBackGround>
      <nav className="flex justify-center space-x-4 py-3">
        <NavLink
          to="/login"
          style={({ isActive, isPending, isTransitioning }) => {
            return {
              fontWeight: isActive ? 'bold' : '',
              color: isPending ? 'red' : 'blue',
              color: !isActive ? 'black' : 'blue',
              viewTransitionName: isTransitioning ? 'slide' : '',
              textDecoration: isActive ? 'underline  blue' : ''
            };
          }}>
          Login
        </NavLink>
        <NavLink
          to="/Register"
          style={({ isActive, isPending, isTransitioning }) => {
            return {
              fontWeight: isActive ? 'bold' : '',
              color: isPending ? 'red' : 'blue',
              color: !isActive ? 'black' : 'blue',
              viewTransitionName: isTransitioning ? 'slide' : '',
              textDecoration: isActive ? 'underline  blue' : ''
            };
          }}>
          Register
        </NavLink>
      </nav>
      <WrapperBody customClass="lg:h-4/5 h-max">
        <AppRoutes />
      </WrapperBody>
      <Footer>
        <div className="flex flex-col lg:flex-row-reverse h-full w-full">
          <PartFooter width="3/6">
            <SocialMedia />
          </PartFooter>
          <PartFooter width="2/6">
            <CenterLocale title={title} />
          </PartFooter>
          {/* <div className={`flex lg:h-full h-1/3 lg:w-2/6   border`}> any</div> */}
          <PartFooter width="1/6">
            <LocalOffice localOffice={office} onchangeOffice={onchangeOffice} />
          </PartFooter>
          {/* <div className={`flex lg:h-full h-1/3 lg:w-1/6   border`}> any</div> */}
        </div>
      </Footer>
    </WrapperBackGround>
  );
}

export default UnauthenticatedApp;
