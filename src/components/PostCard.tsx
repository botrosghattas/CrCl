import type { Comment, Post } from "@/types/post.types";
import { BsThreeDots } from "react-icons/bs";
import { IoMdHeartEmpty } from "react-icons/io";
import { BsChat } from "react-icons/bs";
import { BiEdit, BiShare } from "react-icons/bi";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
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
import { useContext, useRef, useState } from "react";
import { authCreatedContext } from "@/context/AuthContext";
import { Link, Navigate } from "react-router";
import { IoClose, IoTrashOutline } from "react-icons/io5";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { VscSend } from "react-icons/vsc";
import { MdOutlinePhotoLibrary } from "react-icons/md";
import { _date } from "zod/v4/core";
import CommentCard from "./CommentCard";
import type { axiosResponse } from "@/types/axiosResponse.types";
import EditModal from "./EditModal";

type postCardProps = Post;

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

export default function PostCard({
    user,
    body,
    _id,
    image,
    createdAt,
    bookmarked,
    topComment,
}: postCardProps) {
    const postDate = new Date(createdAt).toLocaleDateString();

    const auth = useContext(authCreatedContext);
    if (!auth) return <Navigate to="login" />;
    const { token, user: userProfile } = auth;

    const state = useOverlayState({
        defaultOpen: false,
    });

    const queryClient = useQueryClient();

    // DELETE POST MUTATION
    const { mutate } = useMutation({
        mutationFn: ({ fn }: { fn: () => Promise<any> }) => fn(),
        onSuccess: (onMutateResult) => {
            queryClient.invalidateQueries({ queryKey: ["myPosts"] });
            queryClient.invalidateQueries({ queryKey: ["feed"] });
            queryClient.invalidateQueries({ queryKey: ["allPosts"] });
            queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
            toast.success(onMutateResult.message);
        },
        onError: (onMutateResult) => {
            toast.danger(onMutateResult.message);
        },
    });

    //HANDLING MENU SELECTION
    function handleSelection(key: Key, tkn: string, postID: string) {
        switch (key) {
            case "delete":
                mutate({ fn: () => deletePost(tkn, postID) });
                break;

            case "save":
                mutate({ fn: () => savePost(tkn, postID) });
                break;

            case "unsave":
                mutate({ fn: () => savePost(tkn, postID) });
                break;
        }
    }

    //CREATE A COMMENT
    const [displayAllComments, setDisplayAllComments] = useState(false);

    const [comment, setComment] = useState("");
    const [commentImage, setCommentImage] = useState<string | null>(null);

    const commentImageInput = useRef<HTMLInputElement>(null);

    function handleCommentImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            setCommentImage(URL.createObjectURL(e.target.files[0]));
        }
    }

    async function createComment() {
        const content = comment;
        const commentImgFile = commentImageInput?.current?.files?.[0];
        if (!(content || commentImage)) {
            throw new Error("Cannot create an empty comment");
        }

        const formData = new FormData();
        if (content) formData.append("content", content);
        if (commentImgFile) formData.append("image", commentImgFile);

        const { data } = await axios.post(
            `https://route-posts.routemisr.com/posts/${_id}/comments`,
            formData,
            {
                headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "multipart/form-data",
                },
            },
        );
        return data;
    }

    const { mutate: createCommentMutateFn } = useMutation({
        mutationFn: createComment,
        onSuccess: (onMutateResult) => {
            queryClient.invalidateQueries({ queryKey: ["comments", _id] });
            queryClient.invalidateQueries({ queryKey: ["allPosts"] });
            queryClient.invalidateQueries({ queryKey: ["myPosts"] });
            queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
            queryClient.invalidateQueries({ queryKey: ["feed"] });
            toast.success(onMutateResult.message);
            setComment("");
            setCommentImage(null);
            if (commentImageInput.current) {
                commentImageInput.current.value = "";
            }
        },
        onError: (onMutateResult) => toast.danger(onMutateResult.message),
    });

    //GET ALL COMMENTS

    async function getAllComments() {
        const { data } = await axios.get<axiosResponse<Comment[]>>(
            `https://route-posts.routemisr.com/posts/${_id}/comments`,
            {
                headers: {
                    Authorization: "Bearer " + token,
                },
            },
        );
        return data.data.comments;
    }

    const { data: comments, isPending: isCommentsPending } = useQuery({
        queryKey: ["comments", _id],
        queryFn: getAllComments,
        enabled: displayAllComments,
    });

    return (
        <div className="border overflow-hidden space-y-3 rounded-md dark:bg-gray-800 dark:border-gray-700">
            <div className="flex px-3 pt-3 justify-between items-start">
                <div className="flex gap-3">
                    <div>
                        <img
                            className="rounded-full w-8.5 h-8.5"
                            src={user.photo}
                            alt=""
                        />
                    </div>
                    <div>
                        <p>{user.name}</p>
                        <Link to={`/posts/${_id}`} className="text-gray-400 text-xs hover:underline">{postDate}</Link>
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
                                handleSelection(key, token!, _id)
                            }
                        >
                            {bookmarked ? (
                                <Dropdown.Item
                                    id="unsave"
                                    textValue="Save Post"
                                >
                                    <Label className="flex items-center gap-2">
                                        <FaBookmark /> Unsave Post
                                    </Label>
                                </Dropdown.Item>
                            ) : (
                                <Dropdown.Item id="save" textValue="Save Post">
                                    <Label className="flex items-center gap-2">
                                        <FaRegBookmark />
                                        Save Post
                                    </Label>
                                </Dropdown.Item>
                            )}
                            {userProfile?._id === user._id && (
                                <>
                                    <Dropdown.Item
                                        id="edit"
                                        textValue="Edit post"
                                    >
                                        <Button onClick={state.open} className="flex items-center gap-2 bg-transparent p-0 h-auto">
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
            {body && <p className="px-3 wrap-break-word">{body}</p>}
            {image && (
                <div className="overflow flex justify-center items-center overflow-hidden max-h-120">
                    <img
                        className="w-full object-cover object-center"
                        src={image}
                    />
                </div>
            )}

            <div className="flex justify-evenly mx-3 mb-0 py-3 border-t dark:border-gray-700">
                <div className="flex gap-2 items-center">
                    <IoMdHeartEmpty />
                    <button className="text-gray-300 text-sm sm:text-base">
                        Like
                    </button>
                </div>
                <div className="flex gap-2 items-center">
                    <BsChat />
                    <button
                        className="text-gray-300 text-sm sm:text-base hover:cursor-pointer"
                        onClick={() =>
                            setDisplayAllComments(!displayAllComments)
                        }
                    >
                        Comments
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
                {(topComment || displayAllComments) && (
                    <div className="p-3">
                        {topComment && !displayAllComments && (
                            <CommentCard
                                userName={topComment.commentCreator.name}
                                userPhoto={topComment.commentCreator.photo}
                                content={topComment.content}
                                image={topComment.image}
                                commentID={topComment._id}
                                commentCreator={topComment.commentCreator}
                                postID={_id}
                            />
                        )}
                        {displayAllComments && (
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
                                    comments!.length > 0 && (
                                        <div className="space-y-3">
                                            {comments?.map((comment) => (
                                                <CommentCard
                                                    key={comment._id}
                                                    userName={
                                                        comment.commentCreator
                                                            .name
                                                    }
                                                    userPhoto={
                                                        comment.commentCreator
                                                            .photo
                                                    }
                                                    content={comment.content}
                                                    image={comment.image}
                                                    commentID={comment._id}
                                                    commentCreator={
                                                        comment.commentCreator
                                                    }
                                                    postID={_id}
                                                />
                                            ))}
                                        </div>
                                    )
                                )}

                                <div className="flex gap-3 items-start mt-4">
                                    <div>
                                        <img
                                            className="rounded-full w-8.5 h-8.5"
                                            src={userProfile?.photo}
                                            alt=""
                                        />
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
                                            placeholder={`Comment as ${userProfile?.name.slice(0, userProfile?.name.indexOf(" "))}...`}
                                        ></textarea>
                                        <button
                                            className="hover:cursor-pointer text-brand-500 absolute bottom-4 right-3"
                                            onClick={() =>
                                                createCommentMutateFn()
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
                                                if (commentImageInput.current) {
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
                        )}
                    </div>
                )}
            </div>
            <EditModal state={state} postID={_id} content={body} image={image!} editTarget="post"/>
        </div>
    );
}
