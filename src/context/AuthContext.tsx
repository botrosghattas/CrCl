import type { axiosResponse } from "@/types/axiosResponse.types";
import type { User } from "@/types/user.types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { createContext, useState } from "react"

type AuthContextType = {
    token: string | null;
    updateToken: (tkn: string) => void;
    user: User | undefined;
    isUserProfilePending: boolean
};

export const authCreatedContext = createContext<AuthContextType | undefined>(undefined);

type ReactChildren = {
    children: React.ReactNode
}

async function getUserProfile(tkn: string) {
    const {data} = await axios.get<axiosResponse<User>>(
        "https://route-posts.routemisr.com/users/profile-data",
        {
            headers: {
                Authorization: "Bearer " + tkn,
            },
        },
    );
    return data.data.user;
}

export default function AuthContext({children}:ReactChildren) {

    const [token, setToken] = useState(()=>localStorage.getItem("token"));

    
    const { data: user, isPending: isUserProfilePending } = useQuery({
        queryKey: ["userProfile"],
        queryFn: () => getUserProfile(token!),
        enabled: !!token
    });
    

    function updateToken (tkn: string) {
        setToken(tkn)
        localStorage.setItem("token", tkn)
    }

    return (
        <authCreatedContext.Provider value={{token, user, isUserProfilePending, updateToken}}>
            {children}
        </authCreatedContext.Provider>

    )
}
