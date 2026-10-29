import { authCreatedContext } from "@/context/AuthContext";
import type { axiosResponse } from "@/types/axiosResponse.types";
import type { Comment, Post } from "@/types/post.types";
import { Modal, Skeleton, toast, type UseOverlayStateReturn } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useRef, useState } from "react";
import { MdOutlinePhotoLibrary } from "react-icons/md";
import { RotatingLines } from "react-loader-spinner";
import { Navigate } from "react-router";

async function edit(
    editTarget: "comment" | "post",
    tkn: string,
    postID: string,
    newContent: string | undefined,
    newImage: File | undefined,
    commentID?: string,
) {
    const formData = new FormData();

    if (newContent) formData.append(editTarget === "post" ? "body" : "content", newContent);
    if (newImage instanceof File) formData.append("image", newImage);

    const url =
        editTarget === "comment"
            ? `https://route-posts.routemisr.com/posts/${postID}/comments/${commentID}`
            : `https://route-posts.routemisr.com/posts/${postID}`;

    
    const { data } = await axios.put<axiosResponse<Comment | Post>>(
        url,
        formData,
        {
            headers: {
                Authorization: "Bearer " + tkn,
            },
        },
    );
    return data;
}

type EditModalProps = {
    state: UseOverlayStateReturn;
    postID: string;
    commentID?: string;
    content: string | undefined;
    image: string | undefined;
    editTarget: "comment" | "post"
}

export default function EditModal({state, postID, commentID, content, image, editTarget}:EditModalProps) {
    const auth = useContext(authCreatedContext);
    if (!auth) return <Navigate to="login" />;
    const { token, user: userProfile, isUserProfilePending } = auth;

    const queryClient = useQueryClient();

    const [newContent, setNewContent] = useState(content);
    const [displayImage, setDisplayImage] = useState(image);
    const newImageInput = useRef<HTMLInputElement>(null);

    function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            setDisplayImage(URL.createObjectURL(e.target.files[0]));
        }
    }

    //EDIT
    const { mutate, isPending } = useMutation({
        mutationFn: ({
            tkn,
            postID,
            newContent,
            editTarget,
            commentID
        }: {
            tkn: string;
            postID: string;
            newContent: string | undefined;
            editTarget: "comment" | "post";
            commentID?: string;
        }) => {
            let newImage;
            if (newImageInput.current?.files) {
                newImage = newImageInput.current.files[0];
            }
            switch (editTarget) {
                case "comment":
                    return edit(editTarget, tkn, postID, newContent, newImage, commentID);
                    break;

                case "post":
                    return edit(editTarget, tkn, postID, newContent, newImage);
                    break;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["comments", postID],
            });
            queryClient.invalidateQueries({ queryKey: ["allPosts"] });
            queryClient.invalidateQueries({ queryKey: ["myPosts"] });
            queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
            queryClient.invalidateQueries({ queryKey: ["feed"] });
            queryClient.invalidateQueries({ queryKey: ["post", postID] });
            queryClient.invalidateQueries({ queryKey: ["feed"] });
            state.close();
        },
        onError: (onMutateResult) => toast.danger(onMutateResult.message),
    });

    return (
        <Modal state={state}>
            <Modal.Backdrop>
                <Modal.Container size="lg">
                    <Modal.Dialog className="bg-gray-900">
                        <Modal.CloseTrigger className="bg-gray-800 text-gray-400" />
                        <Modal.Body>
                            <div>
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
                                                src={userProfile?.photo}
                                                alt=""
                                            />
                                        </div>
                                        <div>
                                            <p className="font-bold text-white">
                                                {userProfile?.name}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <textarea
                                    value={newContent}
                                    onChange={(e) =>
                                        setNewContent(e.target.value)
                                    }
                                    rows={3}
                                    className="dark:bg-gray-800 border dark:border-gray-700 placeholder:text-gray-400 dark:text-gray-300 rounded-lg w-full focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                                    name="body"
                                    id="postBody"
                                ></textarea>
                                <div className="flex mt-1 justify-between items-center">
                                    <div>
                                        <label
                                            htmlFor="newCommentImage"
                                            className="flex gap-2 dark:text-gray-300 items-center text-sm dark:hover:bg-gray-600 px-2 py-1 rounded-md hover:cursor-pointer"
                                        >
                                            <MdOutlinePhotoLibrary />
                                            <span>Upload photo</span>
                                        </label>
                                        <input
                                            ref={newImageInput}
                                            onChange={handleImageUpload}
                                            type="file"
                                            className="hidden"
                                            id="newCommentImage"
                                            name="image"
                                            accept="image/*"
                                        />
                                    </div>
                                    <button
                                        className="text-white px-3 py-1.5 bg-brand-500 rounded-xs text-sm hover:cursor-pointer"
                                        onClick={() =>
                                            mutate({
                                                tkn: token!,
                                                postID,
                                                newContent,
                                                editTarget,
                                                commentID,
                                            })
                                        }
                                    >
                                        {isPending ? (
                                            <RotatingLines
                                                width={20}
                                                height={20}
                                                color="white"
                                            />
                                        ) : (
                                            "Submit"
                                        )}
                                    </button>
                                </div>
                                {displayImage && (
                                        <img
                                            className="w-30 mt-3"
                                            src={displayImage}
                                            alt=""
                                        />
                                )}
                            </div>
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}
