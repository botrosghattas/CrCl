import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import RightSideBar from "@/components/RightSideBar";
import { authCreatedContext } from "@/context/AuthContext";
import type { axiosResponse } from "@/types/axiosResponse.types";
import type { Post } from "@/types/post.types";
import { Skeleton, Tabs } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import { BsCake2 } from "react-icons/bs";
import { LuMail } from "react-icons/lu";
import { Navigate } from "react-router";

async function getSavedPosts(tkn: string) {
    const { data } = await axios.get<axiosResponse<Post[]>>(
        "https://route-posts.routemisr.com/users/bookmarks",
        {
            headers: {
                Authorization: "Bearer " + tkn,
            },
        },
    );
    return data.data.bookmarks;
}

async function fetchMyPosts(tkn: string, userID: string) {
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

export default function Profile() {
    const auth = useContext(authCreatedContext);
    if (!auth) return <Navigate to="/login" />;
    const { token, user, isUserProfilePending } = auth;

    let DOB: string;

    const { data, isPending } = useQuery({
        queryKey: ["bookmarks"],
        queryFn: () => getSavedPosts(token!),
    });

    const { data: myPosts, isPending: isMyPostsPending } = useQuery({
        queryKey: ["myPosts"],
        queryFn: () => fetchMyPosts(token!, user!._id),
        enabled: !!user,
    });

    if (user) {
        DOB = new Date(user?.dateOfBirth).toLocaleDateString("en-GB");
    }

    return (
        <>
            <Navbar />
            <section className="pt-10 pb-5 px-5 dark:bg-gray-900 min-h-screen">
                <div className="rounded-3xl border border-gray-700 bg-gray-800 p-5  backdrop-blur-xl sm:p-7 max-w-6xl mx-auto">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="grow">
                            <div className="flex items-center gap-4">
                                <div className="group/avatar relative shrink-0">
                                    <div className="rounded-full">
                                        {isUserProfilePending ? (
                                            <Skeleton className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md ring-2 ring-[#dbeafe]" />
                                        ) : (
                                            <img
                                                alt="Thane Cooley"
                                                className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md ring-2 ring-[#dbeafe]"
                                                src="https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className="pb-1 grow">
                                    {isUserProfilePending ? (
                                        <>
                                            <Skeleton className="h-6 w-full rounded-lg" />
                                            <Skeleton className="mt-2 h-4 w-4/6 rounded" />
                                        </>
                                    ) : (
                                        <>
                                            <h2 className="truncate text-2xl font-black tracking-tight text-white sm:text-4xl">
                                                {user?.name}
                                            </h2>
                                            <p className="mt-1 text-lg font-semibold text-gray-400 sm:text-xl">
                                                {user?.username}
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="grid w-full grid-cols-2 gap-2 lg:w-130">
                            <div className="rounded-2xl border border-gray-600 bg-gray-700 px-3 py-3 text-center sm:px-4 sm:py-4">
                                <p className="text-[11px] font-bold uppercase tracking-wide text-gray-300 sm:text-xs">
                                    Followers
                                </p>
                                <p className="mt-1 text-2xl font-black text-white sm:text-3xl">
                                    {user?.followers.length}
                                </p>
                            </div>
                            <div className="rounded-2xl border border-gray-600 bg-gray-700 px-3 py-3 text-center sm:px-4 sm:py-4">
                                <p className="text-[11px] font-bold uppercase tracking-wide text-gray-300 sm:text-xs">
                                    Following
                                </p>
                                <p className="mt-1 text-2xl font-black text-white sm:text-3xl">
                                    {user?.following.length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 grid gap-4 lg:grid-cols-[1.3fr_.7fr]">
                        <div className="rounded-2xl border border-gray-600 bg-gray-700 p-4">
                            <h3 className="text-sm font-extrabold text-white">
                                About
                            </h3>
                            <div className="mt-3 space-y-2 text-sm text-gray-300">
                                <div className="flex items-center gap-2">
                                    <LuMail className="text-white" />
                                    {isUserProfilePending ? (
                                        <Skeleton className="h-3 w-1/2 rounded mb-2" />
                                    ) : (
                                        user?.email
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <BsCake2 className="text-white" />
                                    {isUserProfilePending ? (
                                        <Skeleton className="h-3 w-1/4 rounded" />
                                    ) : (
                                        DOB!
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                            <div className="rounded-2xl border border-gray-600 bg-gray-700 px-4 py-3">
                                <p className="text-xs font-bold uppercase tracking-wide text-gray-300">
                                    My posts
                                </p>
                                <div className="mt-1 text-2xl font-black text-white">
                                    {isMyPostsPending ? (
                                        <Skeleton className="h-4 w-1/8 rounded" />
                                    ) : (
                                        myPosts?.length
                                    )}
                                </div>
                            </div>
                            <div className="rounded-2xl border border-gray-600 bg-gray-700 px-4 py-3">
                                <p className="text-xs font-bold uppercase tracking-wide text-gray-300">
                                    Saved posts
                                </p>
                                <div className="mt-1 text-2xl font-black text-white">
                                    {isPending ? (
                                        <Skeleton className="h-4 w-1/8 rounded" />
                                    ) : (
                                        data?.length
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="max-w-6xl mx-auto mt-5 grid grid-cols-1 gap-y-4 lg:grid-cols-3 gap-x-4">
                    <div className="lg:order-last">
                        <RightSideBar />
                    </div>

                    <Tabs className="w-full col-span-2">
                        <Tabs.ListContainer className="bg-gray-800">
                            <Tabs.List aria-label="Options" className="">
                                <Tabs.Tab
                                    id="myPosts"
                                    className="text-white data-[selected=true]:text-brand-500 data-[hovered=true]:text-brand-500 data-[hovered=true]:opacity-100"
                                >
                                    My Posts
                                    <Tabs.Indicator className="w-1/2 bg-brand-500 h-0.5 inset-s-auto -bottom-1 top-auto" />
                                </Tabs.Tab>
                                <Tabs.Tab
                                    id="saved"
                                    className="text-white data-[selected=true]:text-brand-500 data-[hovered=true]:text-brand-500 data-[hovered=true]:opacity-100"
                                >
                                    Saved Posts
                                    <Tabs.Indicator className="w-1/2 bg-brand-500 h-0.5 inset-s-auto -bottom-1 top-auto" />
                                </Tabs.Tab>
                            </Tabs.List>
                        </Tabs.ListContainer>
                        <Tabs.Panel className="pt-4" id="myPosts">
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
                                                {myPosts && myPosts.length> 0 ? myPosts?.map((post) => (
                                                    <PostCard {...post} key={post._id} />
                                                )): <p>You have not created any posts</p>}
                                            </div>
                                        )}
                        </Tabs.Panel>
                        <Tabs.Panel className="pt-4" id="saved">
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
                                            <div className="space-y-5">
                                                
                                                {data && data.length > 0 ? (
                                                    data?.map((post) => (
                                                        <PostCard {...post} key={post._id} />
                                                    ))
                                                ) : (
                                                    <p>You have no saved posts</p>
                                                )}
                                            </div>
                                        )}
                        </Tabs.Panel>
                    </Tabs>
                </div>
            </section>
        </>
    );
}
