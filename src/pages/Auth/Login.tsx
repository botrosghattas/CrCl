import {useForm } from "react-hook-form";
import Input from "../../components/Input";
import { Link, useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@heroui/react";
import axios, { isAxiosError } from "axios";
import { RotatingLines } from "react-loader-spinner";
import { useContext, useState } from "react";
import { loginSchema, type loginData } from "./login.schema";
import { authCreatedContext } from "@/context/AuthContext";

export default function Login() {
    const [loading, setLoading] = useState(false);
    
    const auth = useContext(authCreatedContext);
    if (!auth) return null; // or throw error
    const { updateToken } = auth;

    const nav = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onTouched",
    });

    async function formSubmit(formData: loginData) {
        setLoading(true);
        try {
            let res = await axios.post(
                "https://route-posts.routemisr.com/users/signin",
                formData,
            );
            updateToken(res.data.data.token)
            nav("/home")
        } catch (error: unknown) {
            isAxiosError(error) && toast.danger(error.response?.data.message);
        } finally {
            setLoading(false);

        }
    }

    return (
        <div className="w-full max-w-xl bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-xlg xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-2 md:space-y-1 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    Login
                </h1>
                <form
                    noValidate
                    onSubmit={handleSubmit(formSubmit)}
                    className="space-y-4 md:space-y-6"
                    action="#"
                >
                    <Input
                        label="Email"
                        type="email"
                        id="email"
                        placeholder="name@example.com"
                        {...register("email")}
                        error={errors.email?.message}
                    />

                    <Input
                        label="Password"
                        type="password"
                        id="password"
                        placeholder="Enter Your Password"
                        {...register("password")}
                        error={errors.password?.message}
                    />

                    <button
                        type="submit"
                        className="w-full text-white bg-brand-500 hover:bg-brand-400 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-brand-500 dark:hover:bg-brand-400 dark:focus:ring-brand hover:cursor-pointer flex justify-center"
                        disabled={loading}
                    >
                        {loading ? (
                            <RotatingLines
                                width={20}
                                height={20}
                                color="white"
                            />
                        ) : (
                            "Login"
                        )}
                    </button>
                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                        >
                            Sign up here
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
