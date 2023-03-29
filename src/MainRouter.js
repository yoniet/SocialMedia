import React from 'react'
import { Routes, Route } from "react-router-dom";
import Menu from './components/core/Menu'
import Home from './components/core/Home'
import Users from './components/users/Users'
import SignUp from './components/users/SignUp'
import Profile from './components/users/Profile'
import EditProfile from './components/users/EditProfile';
import NotFound from './NotFound';
import PrivateRoutes from './components/auth/PrivateRoutes';
import SignIn from './components/auth/SignIn';

const MainRouter = (props) => {
  return (<div>
    <Menu />
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route path="/users" element={<Users />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route
        element={<PrivateRoutes />}
      >
        <Route path="/user/:userId" element={<Profile />} />
        <Route path="/user/edit/:userId" element={<EditProfile />} />

      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </div>)
}

export default MainRouter;