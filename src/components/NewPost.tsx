import { authCreatedContext } from "@/context/AuthContext";
import { Badge, Skeleton, toast } from "@heroui/react";
import { useContext, useRef, useState } from "react";
import { MdOutlinePhotoLibrary } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { RotatingLines } from "react-loader-spinner";

import { Navigate } from "react-router";

export default function NewPost() {
    const auth = useContext(authCreatedContext);
    if (!auth) return <Navigate to="/login" />;

    const { token, user, isUserProfilePending } = auth;

    const queryClient = useQueryClient();

    const postBody = useRef<HTMLTextAreaElement>(null);
    const postImage = useRef<HTMLInputElement>(null);

    const [image, setImage] = useState<string | null>(null);

    function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            setImage(URL.createObjectURL(e.target.files[0]));
        }
    }

    async function post() {
        let body;
        let image;
        if (postBody.current?.value) {
            body = postBody.current.value;
        }

        if (postImage.current?.files?.[0]) {
            image = postImage.current?.files?.[0];
        }
        const { data } = await axios.post(
            "https://route-posts.routemisr.com/posts",
            {
                body,
                image,
            },
            {
                headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "multipart/form-data",
                },
            },
        );
        return data;
    }

    const { mutate, isPending } = useMutation({
        mutationFn: post,
        onSuccess: (onMutateResult) => {
            queryClient.invalidateQueries({ queryKey: ["allPosts"] });
            queryClient.invalidateQueries({ queryKey: ["myPosts"] });
            queryClient.invalidateQueries({ queryKey: ["feed"] });
            toast.success(onMutateResult.message, {
                timeout: 2000,
            });
            if (postBody.current) postBody.current.value = ""
            if (postImage.current) postImage.current.value = ""
            setImage(null)
        },
        onError: () => toast.danger("failed to create post"),
    });

    return (
        <div className="border rounded-lg dark:bg-gray-800 dark:border-gray-700 p-6 mb-7">
            {isUserProfilePending ? (
                <div className="flex items-center gap-3 mb-4">
                    <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                    <Skeleton className="h-3 w-24 rounded-lg" />
                </div>
            ) : (
                <div className="flex gap-3 items-center mb-4">
                    <div>
                        <img
                            className="h-10 w-10 rounded-full"
                            src={user?.photo}
                            alt=""
                        />
                    </div>
                    <div>
                        <p className="font-bold">{user?.name}</p>
                    </div>
                </div>
            )}

            <textarea
                rows={5}
                className="mb-0 dark:bg-gray-700 border dark:border-gray-600 placeholder:text-gray-400 dark:text-gray-300 rounded-lg w-full focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                name="body"
                id="postBody"
                ref={postBody}
                placeholder={`What's on your mind${user ? ", " + user?.name.slice(0, user?.name.indexOf(" ")) : ""}?`}
            ></textarea>
            <div className="flex mt-1 justify-between items-center">
                <div>
                    <label
                        htmlFor="postImage"
                        className="flex gap-2 dark:text-gray-300 items-center text-sm dark:hover:bg-gray-600 px-2 py-1 rounded-md hover:cursor-pointer"
                    >
                        <MdOutlinePhotoLibrary />
                        <span>Upload photo</span>
                    </label>
                    <input
                        ref={postImage}
                        type="file"
                        className="hidden"
                        id="postImage"
                        name="image"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                </div>
                <button
                    onClick={() => mutate()}
                    className="px-3 py-1.5 bg-brand-500 rounded-xs text-sm hover:cursor-pointer"
                >
                    {isPending ? (
                        <RotatingLines width={20} height={20} color="white" />
                    ) : (
                        "Post"
                    )}
                </button>
            </div>
            {image && (
                <Badge.Anchor className="mt-3">
                    <img className="w-30" src={image} alt="" />
                    <Badge
                        className="bg-brand-500 hover:cursor-pointer"
                        size="sm"
                        onClick={() => {
                            setImage(null);
                            if (postImage.current) {
                                postImage.current.value = "";
                            }
                        }}
                    >
                        <IoClose className="text-white" />
                    </Badge>
                </Badge.Anchor>
            )}
        </div>
    );
}
