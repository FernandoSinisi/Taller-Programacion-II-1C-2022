import React from 'react'

const MusicalPreferencesContext = React.createContext();





export function useMusicalContext(){
    const context = React.useContext(MusicalPreferencesContext);
    if (! context){
        throw new Error("Error: 'useMusicalContext' debe estar dentro del proveedor");
    }
    return context;
}

export {
    MusicalPreferencesContext
};

/*
if ( route.params.body === undefined ){
            
            navigation.navigate('SignInScreen',{
              email: route.params.email,
              password: route.params.password
            })
          }else{
            signIn(route.params.id);
          }
*/