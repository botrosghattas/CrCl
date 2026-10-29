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

type response = axiosResponse<Post[]>;

async function getAllPosts(tkn:string) {
    const { data } = await axios.get<response>(
        "https://route-posts.routemisr.com/posts",
        {
            headers: {
                Authorization: "Bearer " + tkn,
            },
        },
    );
    return data;
}

export default function Community() {
    const auth = useContext(authCreatedContext);
    if (!auth) return <Navigate to="/login" />;

    const { token } = auth;

    

    const { data, isPending } = useQuery({
        queryKey: ["allPosts"],
        queryFn: ()=>getAllPosts(token!),
    });

    return (
        <div>
            <NewPost />
            {isPending ? (
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
                    {data?.data.posts.map((post) => (
                        <PostCard {...post} key={post._id} />
                    ))}
                </div>
            )}
        </div>
    );
}
