import React from 'react'

const AuthContext = React.createContext();

export {
    AuthContext
};

export function useAuthUser(){
    const context = React.useContext(AuthContext);
    if (! context){
        throw new Error("Error: 'useAuthUser' debe estar dentro del proveedor");
    }
    return context;
}