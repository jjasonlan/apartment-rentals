import React, { useState } from "react";
import AdminUsers from "./admin/AdminUsers";
import Navbar from './Navbar';
import './Home.css';

export default function Home(props) {
  const { user, handleLogout } = props;
  const [tab, setTab] = useState('home');
  const gotoHome = () => setTab('home');
  const gotoUsers = () => setTab('users');
  const gotoMap = () => setTab('map');

  return (
    <div className="container">
      <Navbar
        user={user}
        gotoHome={gotoHome}
        gotoMap={gotoMap}
        gotoUsers={gotoUsers}
        handleLogout={handleLogout}
      />
      {tab === 'users' ? <AdminUsers user={user} />
        : tab === 'map' ? <div>Map</div>
          : <div>Home</div>
      }
    </div>
  )
};
