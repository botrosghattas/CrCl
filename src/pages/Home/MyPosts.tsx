import NewPost from "@/components/NewPost";
import PostCard from "@/components/PostCard";
import { authCreatedContext } from "@/context/AuthContext";
import type { axiosResponse } from "@/types/axiosResponse.types";
import type { Post } from "@/types/post.types";
import { Skeleton } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import { Navigate } from "react-router";


async function fetchMyPosts(tkn:string, userID: string) {
    const { data } = await axios.get<axiosResponse<Post[]>>(
        `https://route-posts.routemisr.com/users/${userID}/posts`,
        {
            headers: {
                Authorization: "Bearer " + tkn,
            },
        },
    );
    return data.data.posts;
}

export default function MyPosts() {
    const auth = useContext(authCreatedContext);
    if (!auth) return <Navigate to="/login" />;

    const { token, user, isUserProfilePending } = auth;

    const { data, isPending } = useQuery({
        queryKey: ["myPosts"],
        queryFn: ()=>fetchMyPosts(token!, user!._id),
        enabled: !!user
    });

    return (
        <div>
            <NewPost />
            {isPending || isUserProfilePending ? (
                <div className="space-y-5">
                    <div className="w-full max-w-md space-y-3">
                        <Skeleton className="h-4 w-full rounded" />
                        <Skeleton className="h-4 w-5/6 rounded" />
                        <Skeleton className="h-4 w-4/6 rounded" />
                        <Skeleton className="h-4 w-full rounded" />
                        <Skeleton className="h-4 w-3/6 rounded" />
                    </div>
                    <div className="w-full max-w-md space-y-3">
                        <Skeleton className="h-4 w-full rounded" />
                        <Skeleton className="h-4 w-5/6 rounded" />
                        <Skeleton className="h-4 w-4/6 rounded" />
                        <Skeleton className="h-4 w-full rounded" />
                        <Skeleton className="h-4 w-3/6 rounded" />
                    </div>
                </div>
            ) : (
                <div className="space-y-7">
                    {data!.length> 0 ? data?.map((post) => (
                        <PostCard {...post} key={post._id} />
                    )): <p>You have not created any posts</p>}
                </div>
            )}
        </div>
    );
}
