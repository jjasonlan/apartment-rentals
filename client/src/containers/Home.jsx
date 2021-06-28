import React, { useState, useEffect } from "react";
import AdminUsers from "./admin/AdminUsers";
import Navbar from './Navbar';
import Map from './Map';
import GridView from './GridView';
import './Home.css';

export default function Home(props) {
  const { user, handleLogout } = props;
  const [tab, setTab] = useState('home');
  const [apartments, setApartments] = useState([]);
  const [displayedApartments, setDisplayedApartments] = useState([]);
  // apartment filters
  const [ minSize, setMinSize ] = useState(null);
  const [ maxSize, setMaxSize ] = useState(null);
  const [ minRooms, setMinRooms ] = useState(null);
  const [ maxRooms, setMaxRooms ] = useState(null);
  const [ minPrice, setMinPrice ] = useState(null);
  const [ maxPrice, setMaxPrice ] = useState(null);
  const filters = {
    minSize,
    maxSize,
    minRooms,
    maxRooms,
    minPrice,
    maxPrice,
  };
  const setFilters = {
    setMinSize,
    setMaxSize,
    setMinRooms,
    setMaxRooms,
    setMinPrice,
    setMaxPrice,
  };
  const gotoHome = () => setTab('home');
  const gotoUsers = () => setTab('users');
  const gotoMap = () => setTab('map');
  useEffect(() => {
    fetch('/apartments')
    .then(res => res.json())
    .then(res => {
      const { apartments } = res;
      setApartments(apartments);
    })
  }, []);

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
        : tab === 'map'
          ? <Map
              user={user}
              apartments={displayedApartments}
              />
            : <GridView
              allApartments={apartments}
              setApartments={setApartments}
              apartments={displayedApartments}
              setFilteredApartments={setDisplayedApartments}
              filters={filters}
              setFilters={setFilters}
              user={user}
            />
      }
    </div>
  )
};
