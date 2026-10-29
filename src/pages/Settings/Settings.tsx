import Input from "@/components/Input";
import Navbar from "@/components/Navbar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RotatingLines } from "react-loader-spinner";
import { changePasswordSchema, type changePasswordData } from "./changePassword.schema";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@heroui/react";
import type { axiosResponse } from "@/types/axiosResponse.types";
import { useContext } from "react";
import { authCreatedContext } from "@/context/AuthContext";
import { Navigate } from "react-router";

async function changePassword (tkn:string, currentP:string, newP:string) {
    const { data } = await axios.patch<axiosResponse<any>>(
        "https://route-posts.routemisr.com/users/change-password",
        {
            password: currentP,
            newPassword: newP,
        },
        {
            headers: {
                Authorization: "Bearer " + tkn
            }
        }
    );
    return data
}

export default function Settings() {

    const auth = useContext(authCreatedContext)
    if(!auth) return <Navigate to="/login"/>
    const {token} = auth
    
    const {
            register,
            handleSubmit,
            formState: { errors },
        } = useForm({
            resolver: zodResolver(changePasswordSchema),
            defaultValues: {
                currentPassword: "",
                newPassword: "",
                reNewPassword: "",
            },
            mode: "onTouched",
        });

    const { mutate, isPending } = useMutation({
        mutationFn: ({
            tkn,
            currentP,
            newP,
        }: {
            tkn: string;
            currentP: string;
            newP: string;
        }) => changePassword(tkn, currentP, newP),
        onSuccess: (onMutateResult) => toast.success(onMutateResult.message),
        onError: (onMutateResult) => toast.danger(onMutateResult.message),
    });

    function formSubmit (formData: changePasswordData) {
        mutate({tkn: token!, currentP: formData.currentPassword, newP: formData.newPassword})
    }

    return (
        <>
            <Navbar />
            <div className="pt-10 pb-5 px-5 dark:bg-gray-900 min-h-screen">
                <div className="mx-auto max-w-3xl">
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-xlg xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-2 md:space-y-1 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Change Password
                            </h1>
                            <form
                                onSubmit={handleSubmit(formSubmit)}
                                noValidate
                                className="space-y-4 md:space-y-6"
                                action="#"
                            >
                                <Input
                                    label="Current Password"
                                    type="password"
                                    id="password"
                                    placeholder="Enter your current password"
                                    {...register("currentPassword")}
                                    error={errors.currentPassword?.message}
                                />

                                <Input
                                    label="New password"
                                    type="password"
                                    id="newPassword"
                                    placeholder="Enter your new password"
                                    {...register("newPassword")}
                                    error={errors.newPassword?.message}
                                />

                                <Input
                                    label="Confirm new password"
                                    type="password"
                                    id="reNewPassword"
                                    placeholder="Re-enter your new password"
                                    {...register("reNewPassword")}
                                    error={errors.reNewPassword?.message}
                                />

                                <button
                                    type="submit"
                                    className="w-full text-white bg-brand-500 hover:bg-brand-400 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-brand-500 dark:hover:bg-brand-400 dark:focus:ring-brand hover:cursor-pointer flex justify-center"
                                    disabled={isPending}
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
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
