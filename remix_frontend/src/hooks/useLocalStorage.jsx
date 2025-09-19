import {useState, useEffect} from "react";

/**
 * This is a custom hook for keeping the state, which in this app will be logged in user/token info, synced with localStorage.
 * This way when the page is refreshed/reloaded, a logged in user would still be logged in.
 * 
 * Starts out by checking in localStorage to see if there exists an attribute key, which as supplied as "key" in the props.
 * If it doesn't, sets value of localStorageValue (piece of state in this hook) to the initialValue given as the 2nd prop.
 * BUT if it does exist, sets the value of the localStorageValue to this existing value.
 * 
 * Whenever the value of the key attribute in localStorage changes or the key prop to check changes, it either removes the key attribute from localStorage
 * if localStorageValue is null or sets the key attribute in localStorageValue to be the new value of localStorageValue.
 * 
 * Other components have access to the localStorageValue and can change it, and when it's changed it's also updated in localStorage through this hook.
 * 
 * NOTE: setLocalStorageValue returned by this hook and the setLocalStorageValue used in the useEffect hook are 2 different functions.
 * Other components can change the value of localStorageValue by calling setLocalStorageValue and setting it to a new value.
 * When this happens, the setLocalStorageValue in the useEffect hook runs to update the key prop in localStorage to this new localStorageValue.
 */
function useLocalStorage(key, initialValue = null) {
  const value = window.localStorage.getItem(key) || initialValue;

  const [localStorageValue, setLocalStorageValue]= useState(value);

  useEffect(function setLocalStorageValue() {
    if (!localStorageValue) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, localStorageValue);
    }
  }, [key, localStorageValue]);

  return [localStorageValue, setLocalStorageValue];
}

export default useLocalStorage;