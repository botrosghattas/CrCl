import CommentCard from "@/components/CommentCard";
import EditModal from "@/components/EditModal";
import Navbar from "@/components/Navbar";
import { authCreatedContext } from "@/context/AuthContext";
import type { axiosResponse } from "@/types/axiosResponse.types";
import type { Comment, Post } from "@/types/post.types";
import {
    Badge,
    Button,
    Dropdown,
    Label,
    Skeleton,
    toast,
    useOverlayState,
    type Key,
} from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useRef, useState } from "react";
import { BiEdit, BiShare } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoClose, IoTrashOutline } from "react-icons/io5";
import { MdOutlinePhotoLibrary } from "react-icons/md";
import { VscSend } from "react-icons/vsc";
import { Navigate, useNavigate, useParams } from "react-router";

async function getPost(tkn: string, postID: string) {
    const { data } = await axios.get<axiosResponse<Post>>(
        `https://route-posts.routemisr.com/posts/${postID}`,
        {
            headers: {
                Authorization: "Bearer " + tkn,
            },
        },
    );
    return data.data.post;
}

async function getAllComments(tkn: string, postID: string) {
    const { data } = await axios.get<axiosResponse<Comment[]>>(
        `https://route-posts.routemisr.com/posts/${postID}/comments`,
        {
            headers: {
                Authorization: "Bearer " + tkn,
            },
        },
    );
    return data.data.comments;
}

async function createComment(
    tkn: string,
    content: string,
    image: File | undefined,
    postID: string,
) {
    const formData = new FormData();
    if (content) formData.append("content", content);
    if (image) formData.append("image", image);

    const { data } = await axios.post(
        `https://route-posts.routemisr.com/posts/${postID}/comments`,
        formData,
        {
            headers: {
                Authorization: "Bearer " + tkn,
                "Content-Type": "multipart/form-data",
            },
        },
    );
    return data;
}

//DELETE POST
async function deletePost(tkn: string, postID: string) {
    const { data } = await axios.delete(
        `https://route-posts.routemisr.com/posts/${postID}`,
        {
            headers: {
                Authorization: "Bearer " + tkn,
            },
        },
    );
    return data;
}

//SAVE/UNSAVE POST
async function savePost(tkn: string, postID: string) {
    const { data } = await axios.put(
        `https://route-posts.routemisr.com/posts/${postID}/bookmark`,
        {},
        {
            headers: {
                Authorization: "Bearer " + tkn,
            },
        },
    );
    return data;
}

export default function Post() {
    const auth = useContext(authCreatedContext);
    if (!auth) return <Navigate to="/login" />;
    const { token, user, isUserProfilePending } = auth;

    const { id: postID } = useParams();

    const queryClient = useQueryClient();

    const state = useOverlayState({
        defaultOpen: false,
    });

    const [comment, setComment] = useState("");
    const [commentImage, setCommentImage] = useState<string | null>(null);
    const commentImageInput = useRef<HTMLInputElement>(null);

    const { data, isPending } = useQuery({
        queryKey: ["post", postID],
        queryFn: () => getPost(token!, postID!),
        gcTime: 1000 * 60,
    });

    const { data: comments, isPending: isCommentsPending } = useQuery({
        queryKey: ["comments", postID],
        queryFn: () => getAllComments(token!, postID!),
    });

    const nav = useNavigate();

    let postDate;
    if (data) {
        postDate = new Date(data.createdAt).toLocaleDateString();
    }

    function handleSelection(key: Key, tkn: string, postID: string) {
        switch (key) {
            case "delete":
                mutate({ fn: () => deletePost(tkn, postID) });
                nav("/home");
                break;

            case "save":
                mutate({ fn: () => savePost(tkn, postID) });
                break;

            case "unsave":
                mutate({ fn: () => savePost(tkn, postID) });
                break;
        }
    }

    const { mutate } = useMutation({
        mutationFn: ({ fn }: { fn: () => Promise<any> }) => fn(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["post", postID] });
        },
        onError: (onMutateResult) => {
            toast.danger(onMutateResult.message);
        },
    });

    const { mutate: createCommentMutateFn } = useMutation({
        mutationFn: ({
            tkn,
            content,
            image,
            postID,
        }: {
            tkn: string;
            content: string;
            image: File | undefined;
            postID: string;
        }) => createComment(tkn, content, image, postID),
        onSuccess: (onMutateResult) => {
            queryClient.invalidateQueries({ queryKey: ["comments", postID] });
            toast.success(onMutateResult.message);
            setComment("");
            setCommentImage(null);
            if (commentImageInput.current) {
                commentImageInput.current.value = "";
            }
        },
        onError: (onMutateResult) => toast.danger(onMutateResult.message),
    });

    function handleCommentImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            setCommentImage(URL.createObjectURL(e.target.files[0]));
        }
    }

    return (
        <>
            <Navbar />
            <div className="pt-10 pb-5 px-5 dark:bg-gray-900 min-h-screen">
                <div className="mx-auto max-w-4xl">
                    {isPending ? (
                    <div className="w-full max-w-md space-y-3">
                        <Skeleton className="h-4 w-full rounded" />
                        <Skeleton className="h-4 w-5/6 rounded" />
                        <Skeleton className="h-4 w-4/6 rounded" />
                        <Skeleton className="h-4 w-full rounded" />
                        <Skeleton className="h-4 w-3/6 rounded" />
                    </div>
                ) : (
                    <div className="border overflow-hidden space-y-3 rounded-md dark:bg-gray-800 dark:border-gray-700">
                        <div className="flex px-3 pt-3 justify-between items-start">
                            <div className="flex gap-3">
                                <div>
                                    <img
                                        className="rounded-full w-8.5 h-8.5"
                                        src={data?.user.photo}
                                        alt=""
                                    />
                                </div>
                                <div>
                                    <p>{data?.user.name}</p>
                                    <span className="text-gray-400 text-xs">
                                        {postDate}
                                    </span>
                                </div>
                            </div>
                            <Dropdown>
                                <Button
                                    className="bg-transparent hover:bg-gray-700"
                                    aria-label="Menu"
                                >
                                    <BsThreeDots />
                                </Button>
                                <Dropdown.Popover placement="bottom right">
                                    <Dropdown.Menu
                                        onAction={(key) =>
                                            handleSelection(
                                                key,
                                                token!,
                                                postID!,
                                            )
                                        }
                                    >
                                        {data?.bookmarked ? (
                                            <Dropdown.Item
                                                id="unsave"
                                                textValue="Save Post"
                                            >
                                                <Label className="flex items-center gap-2">
                                                    <FaBookmark /> Unsave Post
                                                </Label>
                                            </Dropdown.Item>
                                        ) : (
                                            <Dropdown.Item
                                                id="save"
                                                textValue="Save Post"
                                            >
                                                <Label className="flex items-center gap-2">
                                                    <FaRegBookmark />
                                                    Save Post
                                                </Label>
                                            </Dropdown.Item>
                                        )}
                                        {user?._id === data?.user._id && (
                                            <>
                                                <Dropdown.Item
                                                    id="edit"
                                                    textValue="Edit post"
                                                >
                                                    <Button
                                                        onClick={state.open}
                                                        className="flex items-center gap-2 bg-transparent p-0 h-auto"
                                                    >
                                                        <BiEdit />
                                                        Edit post
                                                    </Button>
                                                </Dropdown.Item>
                                                <Dropdown.Item
                                                    id="delete"
                                                    textValue="Delete Post"
                                                    variant="danger"
                                                >
                                                    <Label className="flex items-center gap-2">
                                                        <IoTrashOutline />
                                                        Delete Post
                                                    </Label>
                                                </Dropdown.Item>
                                            </>
                                        )}
                                    </Dropdown.Menu>
                                </Dropdown.Popover>
                            </Dropdown>
                        </div>
                        {data?.body && <p className="px-3">{data.body}</p>}
                        {data?.image && (
                            <div className="overflow flex justify-center items-center overflow-hidden max-h-120">
                                <img
                                    className="w-full object-cover object-center"
                                    src={data.image}
                                />
                            </div>
                        )}

                        <div className="flex justify-evenly mx-3 py-3 border-t dark:border-gray-700">
                            <div className="flex gap-2 items-center">
                                <IoMdHeartEmpty />
                                <button className="text-gray-300 text-sm sm:text-base">
                                    Like
                                </button>
                            </div>
                            <div className="flex gap-2 items-center">
                                <BiShare />
                                <button className="text-gray-300 text-sm sm:text-base">
                                    Share
                                </button>
                            </div>
                        </div>

                        <div className="bg-gray-900">
                            <div className="p-3">
                                <>
                                    {isCommentsPending ? (
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                                            <div className="flex-1 space-y-2">
                                                <Skeleton className="h-3 w-36 rounded-lg" />
                                                <Skeleton className="h-3 w-24 rounded-lg" />
                                            </div>
                                        </div>
                                    ) : (
                                        comments &&
                                        comments.length > 0 && (
                                            <div className="space-y-3">
                                                {comments?.map((comment) => (
                                                    <CommentCard
                                                        key={comment._id}
                                                        userName={
                                                            comment
                                                                .commentCreator
                                                                .name
                                                        }
                                                        userPhoto={
                                                            comment
                                                                .commentCreator
                                                                .photo
                                                        }
                                                        content={
                                                            comment.content
                                                        }
                                                        image={comment.image}
                                                        commentID={comment._id}
                                                        commentCreator={
                                                            comment.commentCreator
                                                        }
                                                        postID={postID!}
                                                    />
                                                ))}
                                            </div>
                                        )
                                    )}

                                    <div className="flex gap-3 items-start mt-4">
                                        <div>
                                            {isUserProfilePending ? (
                                                <Skeleton className="h-8.5 w-8.5 shrink-0 rounded-full" />
                                            ) : (
                                                <img
                                                    className="rounded-full w-8.5 h-8.5"
                                                    src={user?.photo}
                                                    alt=""
                                                />
                                            )}
                                        </div>
                                        <div className="relative w-full">
                                            <textarea
                                                value={comment}
                                                onChange={(e) =>
                                                    setComment(e.target.value)
                                                }
                                                rows={3}
                                                className="[&::-webkit-scrollbar]:none [-ms-overflow-style:none] [scrollbar-width:none] resize-none pb-10 pr-10 mb-0 dark:bg-gray-800 border dark:border-gray-700 placeholder:text-gray-400 dark:text-gray-300 rounded-lg w-full focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                                                name="comment"
                                                id="commentBody"
                                                placeholder={`Comment as ${user?.name.slice(0, user?.name.indexOf(" "))}...`}
                                            ></textarea>
                                            <button
                                                className="hover:cursor-pointer text-brand-500 absolute bottom-4 right-3"
                                                onClick={() =>
                                                    createCommentMutateFn({
                                                        tkn: token!,
                                                        content: comment,
                                                        image: commentImageInput
                                                            .current
                                                            ?.files?.[0],
                                                        postID: postID!,
                                                    })
                                                }
                                            >
                                                <VscSend />
                                            </button>
                                            <div className="absolute bottom-4 left-3">
                                                <label
                                                    htmlFor="commentImage"
                                                    className="flex gap-2 dark:text-gray-300 items-center text-sm dark:hover:bg-gray-600 px-2 py-1 rounded-md hover:cursor-pointer"
                                                >
                                                    <MdOutlinePhotoLibrary />
                                                    <span>Upload photo</span>
                                                </label>
                                                <input
                                                    ref={commentImageInput}
                                                    type="file"
                                                    className="hidden"
                                                    id="commentImage"
                                                    name="commentImage"
                                                    accept="image/*"
                                                    onChange={
                                                        handleCommentImageUpload
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {commentImage && (
                                        <Badge.Anchor className="mt-3">
                                            <img
                                                className="w-30"
                                                src={commentImage}
                                                alt=""
                                            />
                                            <Badge
                                                className="bg-brand-500 hover:cursor-pointer"
                                                size="sm"
                                                onClick={() => {
                                                    setCommentImage(null);
                                                    if (
                                                        commentImageInput.current
                                                    ) {
                                                        commentImageInput.current.value =
                                                            "";
                                                    }
                                                }}
                                            >
                                                <IoClose className="text-white" />
                                            </Badge>
                                        </Badge.Anchor>
                                    )}
                                </>
                            </div>
                        </div>

                        <EditModal
                            state={state}
                            postID={postID!}
                            content={data?.body}
                            image={data?.image}
                            editTarget="post"
                        />
                    </div>
                )}
                </div>
                
            </div>
        </>
    );
}
