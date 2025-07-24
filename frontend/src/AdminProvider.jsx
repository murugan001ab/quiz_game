import React, { createContext, useState } from 'react';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [adminId, setAdminId] = useState(null);
  const [Qtime, setQTime] = useState(0);
  const [index,setIndex]=useState(0);
  const [socket, setSocket] = useState(null);


  return (
    <AdminContext.Provider value={{ adminId, setAdminId,Qtime,setQTime,index,setIndex ,socket, setSocket }}>
      {children}
    </AdminContext.Provider>
  );
};
