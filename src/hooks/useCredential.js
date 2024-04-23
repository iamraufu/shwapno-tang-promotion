import { useEffect, useState } from "react";
import outlets from '../data/outlets.json'

const useCredential = () => {

    const code = localStorage.getItem('code')
    const [user, setUser] = useState({});

    // getting userInfo from localStorage id and backend API
    const userData = () => {
        const fetchData = async () => {
            try {
                const outlet = outlets.find(outlet => outlet.code.toLowerCase() === code.toLowerCase().trim() && outlet.code.toLowerCase() === code.toLowerCase().trim())
                const isOutletExist = Boolean(outlet)
                isOutletExist && setUser(outlet)

            } catch (error) {
                fetchData();
            }
        };
        fetchData();
    }

    // persist login
    useEffect(() => {
        if (code) {
            userData()
        } else {
            setUser({})
        }
        //eslint-disable-next-line
    }, [])

    // email
    const logOut = () => {
        localStorage.removeItem('code')
        setUser({})
    }

    return {
        user,
        setUser,
        logOut
    }
};

export default useCredential;