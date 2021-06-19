import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './containers/Home';
import Signup from './containers/Signup';
import Login from './containers/Login';
import "./App.css";

function App() {
  const [user, setUser] = React.useState(null);
  const [isSignup, setIsSignup] = React.useState(false);
  function loginAsUser (user) {
    setUser({
      name: user.name,
      username: user.username,
      role: user.role,
    });
  }

  return (
    <div className="App">
      {user
        ? <Home user={user} />
        : isSignup
          ? <Signup handleLogin={() => setIsSignup(false)} loginAsUser={loginAsUser}/>
          : <Login handleSignup={() => setIsSignup(true)} loginAsUser={loginAsUser}/>
      }
    </div>
    
  );
}

export default App;
