import React from 'react'
import { Routes , Route} from 'react-router'
import HomePage from './pages/HomePage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import NotificationPage from './pages/NotificationPage.jsx'
import CallPage from './pages/CallPage.jsx'
import ChatPage from './pages/ChatPage.jsx'
import OnBoardingPage from './pages/OnBoardingPage.jsx'
import toast, { Toaster } from 'react-hot-toast'
import { Navigate } from 'react-router'
import PageLoader from './components/PageLoader.jsx'
import useAuthUser from './hooks/useAuthUser.js'
import Layout from './components/Layout.jsx'
import { useThemeStore } from './store/useThemeStore.jsx'

const App = () => {
  const {theme} = useThemeStore();
  const {isLoading , authUser} = useAuthUser();

  if(isLoading)return <PageLoader/>;

  const isAuthenticated = Boolean(authUser);
  const isOnBoarded = authUser ?.isOnBoarded;

  return (
    <div className='h-screen' data-theme={theme}>
        <Routes>
          <Route
           path = "/" 
           element = {
            isAuthenticated && isOnBoarded ?(
              <Layout showSidebar={true}>
              <HomePage/>
              </Layout>
               ):(
              <Navigate to = {!isAuthenticated ? "login" : "/onboarding"}/>)
          }></Route>
          <Route path = "/signup" element = {!isAuthenticated ? <SignUpPage/> : <Navigate to ={isOnBoarded ? "/" : "/onboarding"}/>}></Route>
          <Route path = "/login" element = {!isAuthenticated ? <LoginPage/> :  <Navigate to ={isOnBoarded ? "/" : "/onboarding"}/>}></Route>
          <Route path = "/notifications" element = {isAuthenticated ? <NotificationPage/> :  <Navigate to ="/login"/>}></Route>
          <Route path = "/call" element = {isAuthenticated ? <CallPage/>  :  <Navigate to ="/login"/>}></Route>
          <Route path = "/chat" element = {isAuthenticated ? <ChatPage/> :  <Navigate to ="/login"/>}></Route>
          <Route path = "/onboarding" element = {isAuthenticated ?(
            !isOnBoarded?(
            <OnBoardingPage/>
            ):(
              <Navigate to="/"/>
              )):(
                 <Navigate to="/login"/>  
              )}></Route>
        </Routes>
        <Toaster/>
    </div>    
  )
}

export default App
