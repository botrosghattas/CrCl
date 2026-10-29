import { Controller, useForm } from "react-hook-form";
import Input from "../../components/Input";
import SelectInput from "../../components/SelectInput";
import DateInput from "@/components/DateInput";
import { Link, useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type registrationData } from "./register.schema";
import { toast } from "@heroui/react";
import axios, { isAxiosError } from "axios";
import {RotatingLines} from 'react-loader-spinner'
import { useState } from "react";

export default function Register() {

    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            username: "",
            email: "",
            gender: "",
            dateOfBirth: "",
            password: "",
            rePassword: "",
        },
        mode: "onTouched",
    });

    const nav = useNavigate()

    async function formSubmit(formData: registrationData) {
        setLoading(true)
        try {
            let res = await axios.post(
                "https://route-posts.routemisr.com/users/signup",
                formData,
            );
            toast.success(res.data.message);
        } catch (error: unknown) {
            isAxiosError(error) && toast.danger(error.response?.data.message)
        } finally {
            setLoading(false)
            setTimeout((()=> nav("/login")), 3000)
        }
    }

    return (
        <div className="w-full max-w-xl bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-xlg xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-2 md:space-y-1 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    Create an account
                </h1>
                <form
                    noValidate
                    onSubmit={handleSubmit(formSubmit)}
                    className="space-y-4 md:space-y-6"
                    action="#"
                >
                    <Input
                        label="Full Name"
                        type="text"
                        id="fullName"
                        placeholder="Enter Your Full Name"
                        {...register("name")}
                        error={errors.name?.message}
                    />

                    <Input
                        label="Username"
                        type="text"
                        id="username"
                        placeholder="Enter your username"
                        {...register("username")}
                        error={errors.username?.message}
                    />
                    <Input
                        label="Email"
                        type="email"
                        id="email"
                        placeholder="name@example.com"
                        {...register("email")}
                        error={errors.email?.message}
                    />
                    <Controller
                        name="gender"
                        control={control}
                        render={({ field, fieldState }) => (
                            <SelectInput
                                label="Gender"
                                placeholder="Select your gender"
                                options={[
                                    { value: "male", label: "Male" },
                                    { value: "female", label: "Female" },
                                ]}
                                {...field}
                                error={fieldState.error?.message}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="dateOfBirth"
                        render={({ field, fieldState }) => (
                            <DateInput
                                label="Date of Birth"
                                {...field}
                                error={fieldState.error?.message}
                            />
                        )}
                    />

                    <Input
                        label="Password"
                        type="password"
                        id="password"
                        placeholder="Enter Your Password"
                        {...register("password")}
                        error={errors.password?.message}
                    />
                    <Input
                        label="Confirm Your Password"
                        type="password"
                        id="rePassword"
                        placeholder="Re-enter Your Password"
                        {...register("rePassword")}
                        error={errors.rePassword?.message}
                    />
                    <button
                        type="submit"
                        className="w-full text-white bg-brand-500 hover:bg-brand-400 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-brand-500 dark:hover:bg-brand-400 dark:focus:ring-brand hover:cursor-pointer flex justify-center"
                        disabled={loading}
                    >
                        {loading ? <RotatingLines width={20} height={20} color="white"/> : "Create account"}
                    </button>
                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                        >
                            Login here
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
