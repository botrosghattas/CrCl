import { authCreatedContext } from "@/context/AuthContext";
import axios from "axios";
import { useContext } from "react";
import { LiaUserFriendsSolid } from "react-icons/lia";
import FriendSuggestion from "./FriendSuggestion";
import { type FriendSuggestionType } from "./FriendSuggestion";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@heroui/react";
import type { axiosResponse } from "@/types/axiosResponse.types";

type Response = axiosResponse<FriendSuggestionType[]>;

export default function RightSideBar() {
    const auth = useContext(authCreatedContext);
    if (!auth) return null;

    const { token } = auth;

    async function getFollowSuggestions() {
        const { data } = await axios.get<Response>(
            "https://route-posts.routemisr.com/users/suggestions?limit=5",
            {
                headers: {
                    Authorization: "Bearer " + token,
                },
            },
        );
        return data.data.suggestions;
    }

    const {
        data: suggestions,
        isLoading,
        isSuccess,
        isError,
        refetch
    } = useQuery({
        queryKey: ["friendSuggestions"],
        queryFn: getFollowSuggestions,
        retry: 1,
    });

    return (
        <div>
            <div className=" border rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700 space-y-4">
                <h2 className="flex items-center gap-2">
                    <LiaUserFriendsSolid />
                    <strong>Suggested Friends</strong>
                </h2>

                {isLoading ? (
                    <>
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-3 w-36 rounded-lg" />
                                <Skeleton className="h-3 w-24 rounded-lg" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-3 w-36 rounded-lg" />
                                <Skeleton className="h-3 w-24 rounded-lg" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-3 w-36 rounded-lg" />
                                <Skeleton className="h-3 w-24 rounded-lg" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-3 w-36 rounded-lg" />
                                <Skeleton className="h-3 w-24 rounded-lg" />
                            </div>
                        </div>
                    </>
                ) : isError ? (
                    <div>
                        <p className="rounded-lg p-2 border border-red-500 bg-red-200/15 text-red-500">
                            Failed to load friend suggestions
                        </p>
                        <span onClick={()=> void refetch()} className="hover:cursor-pointer p-2 text-xs underline text-red-500 mt-1">Try again</span>
                    </div>
                ) : (
                    isSuccess &&
                    suggestions.map((suggestion) => (
                        <FriendSuggestion
                            key={suggestion._id}
                            {...suggestion}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
