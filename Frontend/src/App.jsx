import React from 'react'
import {Route,Routes} from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import HomeScreen from './pages/HomeScreen.jsx'
import NewClaim from './pages/NewClaim.jsx'
import MyClaims from './pages/MyClaims.jsx'
import MyComments from './pages/MyComments.jsx'
import Claim from './pages/Claim.jsx'
import Bookmarks from './pages/Bookmarks.jsx'
import VerifiedFacts from './pages/VerifiedFacts.jsx'


const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/signUp' element={<SignUp/>}></Route>
        <Route path='/home' element={<HomeScreen/>}></Route>
        <Route path='/newClaim' element={<NewClaim/>}></Route>
        <Route path='/myClaims' element={<MyClaims/>}></Route>
        <Route path='/myComments' element={<MyComments/>}></Route>
        <Route path='/claim/:id' element={<Claim/>}></Route>
        <Route path='/bookmarks' element={<Bookmarks/>}></Route>
        <Route path='/verifiedFacts' element={<VerifiedFacts/>}></Route>

      </Routes>
    </div>
  )
}

export default App