import React, {useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './containers/Home';
import Signup from './containers/Signup';
import Login from './containers/Login';
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [isSignup, setIsSignup] = useState(false);
  function loginAsUser (user) {
    setUser({
      name: user.name,
      username: user.username,
      role: user.role,
    });
  }
  function handleLogout () {
    setUser(null);
  }

  return (
    <div className="App">
      {user
        ? <Home user={user} handleLogout={handleLogout} />
        : isSignup
          ? <Signup handleLogin={() => setIsSignup(false)} loginAsUser={loginAsUser}/>
          : <Login handleSignup={() => setIsSignup(true)} loginAsUser={loginAsUser}/>
      }
    </div>
    
  );
}

export default App;
