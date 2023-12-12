import { Outlet,redirect,useLoaderData,useNavigate} from "react-router-dom";
import Wrapper from "../assets/wrappers/Dashboard";
import {BigSidebar,SmallSidebar,Navbar} from '../components/';
import { createContext, useContext, useState } from "react";
import { checkDefaultTheme } from "../App";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const loader = async ()=>{
  try {
    //sending back the token from client to server to get information about the current client/ user
    const {data} = await customFetch.get('/users/current-user');
    return data;
  } catch (error) {
    return redirect('/');
  }
}

const DashboardContext=createContext();



const DashboardLayout = () => {
  //get information about the current user by invoking the useLoaderData() function, then we will get the information from the loader() function defined above
  const {user} = useLoaderData();

  //alternative to redirect().
  const navigate = useNavigate();

  const [showSidebar,setShowSidebar]= useState(false);
  const [isDarkTheme,setIsDarkTheme]= useState(checkDefaultTheme());

  const toggleDarkTheme= ()=>{
    const newDarkTheme= !isDarkTheme;
    setIsDarkTheme(newDarkTheme);
    document.body.classList.toggle('dark-theme',newDarkTheme);
    localStorage.setItem('darkTheme',newDarkTheme);
  };

  const toggleSidebar= ()=>{
    setShowSidebar(!showSidebar);
  }

  const logoutUser= async ()=>{
    navigate('/');
    await customFetch.get('/auth/logout');
    toast.success('Logging out...');
  }

  return (
    <DashboardContext.Provider 
      value={{
        user,
        showSidebar,
        isDarkTheme,
        toggleDarkTheme,
        toggleSidebar,
        logoutUser
      }}
    >
      <Wrapper>
        <main className="dashboard">
          <SmallSidebar />
          <BigSidebar />
          <div>
            <Navbar />
            <div className="dashboard-page">
              <Outlet context={{user}}/>
            </div>
          </div>
        </main>
      </Wrapper>
    </DashboardContext.Provider>
  );
};

export const useDasboardContext = () => useContext(DashboardContext);
export default DashboardLayout