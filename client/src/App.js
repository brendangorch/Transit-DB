import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LoginPage from './Components/LoginPage/LoginPage';
import LandingPage from './Components/LandingPage/LandingPage';
import AccountSettingsPage from './Components/AccountSettingsPage/AccountSettingsPage';
import FindATrainPage from './Components/FindATrainPage/FindATrainPage';
import FindAStationPage from './Components/FindAStationPage/FindAStationPage';
import Favourite from './Components/favourite/favourite'
import PurchaseATicketPage from './Components/PurchaseATicketPage/PurchaseATicketPage';

const App = () => {
  return (
    <>
    <Routes>
      {/* // the pages for the user go here */}
      <Route path='/' element = {< LoginPage />} />
      <Route path='/landingpage' element = {< LandingPage />} />
      <Route path='/accountsettingspage' element = {< AccountSettingsPage/>} />
      <Route path='/findatrainpage' element = {<FindATrainPage/>}/>
      <Route path='/findastationpage' element={<FindAStationPage/>}/>
      <Route path='/favourite' element={<Favourite />}/>
      <Route path='/purchaseaticketpage' element={<PurchaseATicketPage />}/>
    </Routes>
    </>
  );
};

export default App;
