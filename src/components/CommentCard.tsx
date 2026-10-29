import { authCreatedContext } from "@/context/AuthContext";
import type { CommentCreator } from "@/types/post.types";
import {
    Button,
    Dropdown,
    Label,
    toast,
    type Key,
} from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import { BiEdit } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { Navigate } from "react-router";
import { useOverlayState } from "@heroui/react";
import EditModal from "./EditModal";
import { IoTrashOutline } from "react-icons/io5";

type CommentCardProps = {
    userPhoto: string;
    userName: string;
    content: string | null;
    image: string | null;
    commentID: string;
    commentCreator: CommentCreator;
    postID: string;
};

async function deleteComment(tkn: string, commentID: string, postID: string) {
    const { data } = await axios.delete(
        `https://route-posts.routemisr.com/posts/${postID}/comments/${commentID}`,
        {
            headers: {
                Authorization: "Bearer " + tkn,
            },
        },
    );
    return data;
}

export default function CommentCard({
    userPhoto,
    userName,
    content,
    image,
    commentID,
    commentCreator,
    postID,
}: CommentCardProps) {
    const auth = useContext(authCreatedContext);
    if (!auth) return <Navigate to="login" />;
    const { token, user: userProfile } = auth;

    const queryClient = useQueryClient();


    const state = useOverlayState({
        defaultOpen: false,
    });
    


    //DELETE A COMMENT
    const { mutate } = useMutation({
        mutationFn: ({
            tkn,
            commentID,
            postID,
        }: {
            tkn: string;
            commentID: string;
            postID: string;
        }) => deleteComment(tkn, commentID, postID),
        onSuccess: () => {
            toast.success("Comment deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["comments", postID] });
            queryClient.invalidateQueries({ queryKey: ["allPosts"] });
            queryClient.invalidateQueries({ queryKey: ["myPosts"] });
            queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
            queryClient.invalidateQueries({ queryKey: ["feed"] });
        },
    });

    

    function handleSelection(key: Key) {
        switch (key) {
            case "delete":
                mutate({ tkn: token as string, commentID, postID });
                break;
        }
    }

    return (
        <div className="flex justify-between">
            <div className="flex gap-3 items-start">
                <div>
                    <img
                        className="rounded-full w-8.5 h-8.5"
                        src={userPhoto}
                        alt=""
                    />
                </div>
                <div className="bg-gray-800 p-3 rounded-md">
                    <p className="text-gray-400 text-sm">{userName}</p>
                    {content && <div>{content}</div>}
                    {image && (
                        <div className="max-w-35">
                            <img src={image} />
                        </div>
                    )}
                </div>
            </div>
            {userProfile?._id === commentCreator._id && (
                <Dropdown>
                    <Button
                        className="bg-transparent hover:bg-gray-700"
                        aria-label="Menu"
                    >
                        <BsThreeDots />
                    </Button>
                    <Dropdown.Popover placement="bottom right">
                        <Dropdown.Menu onAction={(key) => handleSelection(key)}>
                            <>
                                <Dropdown.Item
                                    id="edit"
                                    textValue="Edit Comment"
                                >
                                    <div className="flex items-center gap-2">
                                        <BiEdit />
                                        <Button
                                            className="bg-transparent p-0 h-auto"
                                            onClick={state.open}
                                        >
                                            {" "}
                                            Edit Comment
                                        </Button>
                                    </div>
                                </Dropdown.Item>
                                <Dropdown.Item
                                    id="delete"
                                    textValue="Delete Comment"
                                    variant="danger"
                                >
                                    <Label className="flex items-center gap-2">
                                        <IoTrashOutline />
                                        Delete Comment
                                    </Label>
                                </Dropdown.Item>
                            </>
                        </Dropdown.Menu>
                    </Dropdown.Popover>
                </Dropdown>
            )}
            <EditModal state={state} editTarget="comment" postID={postID} commentID={commentID} content={content!} image={image!} />
        </div>
    );
}
