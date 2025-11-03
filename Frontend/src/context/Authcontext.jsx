import React from 'react'
import { createContext } from 'react'
export const authDataContext=createContext()
function Authcontext({children}) {
    const serverUrl="https://linkedin-backend-project.onrender.com"
    let value={
      serverUrl
    }
  return (
    <div>
    <authDataContext.Provider value={value}>
       {children} 
    </authDataContext.Provider>
    
    </div>
  )
}

export default Authcontext
