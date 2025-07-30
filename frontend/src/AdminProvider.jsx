import React, { createContext, useState } from 'react';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [adminId, setAdminId] = useState(null);
  const [Qtime, setQTime] = useState(0);
  const [index,setIndex]=useState(0);
  const [socket, setSocket] = useState(null);
  const [aname, setName] = useState("");
  const [isLogin, setIsLogin] = useState(false);

   const BASE_URL = 'quizgamehub.duckdns.org/api';
//  const BASE_URL = 'localhost:8000'; 
  
   const logout = () => {
    localStorage.removeItem('adminId');
    localStorage.removeItem('adminSessionExpiry');
    setAdminId(null);
    setIsLogin(false);
  };


  return (
    <AdminContext.Provider value={{ adminId, setAdminId,Qtime,setQTime,index,setIndex ,socket, setSocket, aname, setName , isLogin, setIsLogin,logout ,BASE_URL}}>
      {children}
    </AdminContext.Provider>
  );
};
