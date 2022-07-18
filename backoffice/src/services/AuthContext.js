import React from 'react'

const AuthContext = React.createContext(undefined);

export {
    AuthContext
};

export function useContext() {
    const context = React.useContext(AuthContext);

    if (! context){
        throw new Error("El contexto debe estar dentro del proveedor.");
    }

    return context;
}