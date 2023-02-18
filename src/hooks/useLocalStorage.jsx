import { useState , useEffect} from 'react';

const useLocalStorage = (key, initialValue) => {
    const [state, setstate] = useState(()=>{
        let initial_value = initialValue;
        if(typeof initialValue === "function"){
            initial_value = initialValue();
            console.log(initial_value);
        }
        try {
            const value = localStorage.getItem(key);
            return value? JSON.parse(value) :initial_value;
        } catch (error) {
            return initial_value;
        }
    });

    useEffect(()=>{
        try {
            const serializedState = JSON.stringify(state);
            localStorage.setItem(key,serializedState);
        } catch (error) {
            console.log(`Error saving state to localStorage: ${error}`);
        }
    },[state, setstate]);
    return [state, setstate];
}

export default useLocalStorage;