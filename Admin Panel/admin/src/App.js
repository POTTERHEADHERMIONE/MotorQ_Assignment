import logo from './logo.svg';
import './App.css';
import Admin from './admin/admin';
import { BrowserRouter as Router, Route, Switch, Link,Routes } from 'react-router-dom';
import VehicleBrands from './admin/vehicles-manager/vehicle-brands';
import UsersManager from './admin/users-manager/users-manager';
import RentalsManager from './admin/rentals-manager/rentals-manager';
import WebSocketClient from './WebSocket'; 

function App() {
  return (
    <div className="App">
     <Admin/>
   <Routes>
   <Route path='vehicle'  Component={VehicleBrands}/>
   <Route path='user' Component={UsersManager}/>
   <Route path='rentals' components={RentalsManager}/>
   </Routes>
   <WebSocketClient />
    </div>
  );
}

export default App;
