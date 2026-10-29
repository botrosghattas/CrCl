import { SlUserFollow } from "react-icons/sl";
import { IconContext } from "react-icons";
import axios from "axios";
import { useContext } from "react";
import { authCreatedContext } from "@/context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@heroui/react";
import {Spinner} from "@heroui/react";


export type FriendSuggestionType = {
    photo: string;
    name: string;
    followersCount: number;
    username: string;
    _id: string;
    mutualFollowersCount: number;
};

export default function FriendSuggestion({
    photo,
    name,
    followersCount,
    username,
    _id
}: FriendSuggestionType) {

    const queryClient = useQueryClient()

    const auth = useContext(authCreatedContext)
    if (!auth) return

    const {token} = auth


    async function followUser({_id,name}:{_id:string, name:string}) {
        const {data} = await axios.put(
            `https://route-posts.routemisr.com/users/${_id}/follow`,null,
            {
                headers: {
                    Authorization:
                        "Bearer " + token,
                },
            },
        );
        return {data, name}
    }

    const {mutate, isPending} = useMutation({
        mutationFn: followUser,
        onSuccess: ()=> {
            toast.success(`You followed ${name}`);
            queryClient.invalidateQueries({ queryKey: ["friendSuggestions"] });
            queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        },
        onError: () => toast.danger(`Failed to follow ${name}`)    
    })

    return (
        <div className="border dark:border-gray-700 rounded-lg p-2.5">
            <div className="flex justify-between items-center">
                <div className="flex gap-3">
                    <div>
                        <img
                            className="rounded-full w-8.5 h-8.5"
                            src={photo}
                            alt=""
                        />
                    </div>
                    <div className="">
                        <p className="text-sm">{name}</p>
                        <p className="text-gray-400 text-xs">@{username}</p>
                    </div>
                </div>
                <div>
                    <IconContext.Provider
                        value={{
                            className: "hover:cursor-pointer hover:text-brand-500",
                        }}
                    >
                        <button onClick={()=>mutate({_id, name})}>
                            {isPending ? <Spinner /> : <SlUserFollow />}
                        </button>
                    </IconContext.Provider>
                    
                </div>
            </div>
            <span className="rounded-full text-xs dark:text-gray-300 dark:bg-gray-600 px-2 py-0.5">
                {followersCount} followers
            </span>
        </div>
    );
}
