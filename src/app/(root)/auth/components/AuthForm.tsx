"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

import { useCallback, useEffect, useState } from "react";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import AuthSocialButton from "./AuthSocialButton";
// import { BsGithub, BsGoogle } from "react-icons/bs";
import axios from "axios";
// import { toast } from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

type Props = {};

type variant = "Login" | "Register";

const AuthForm = (props: Props) => {
	const session = useSession();
	const router = useRouter();
	const [variant, setVariant] = useState<variant>("Login");
	const [isLoading, setIsLoading] = useState(false);

	const formSchema = z.object({
		name: z.string().optional(),
		email: z.string().email(),
		password: z.string().min(6),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	useEffect(() => {
		if (session?.status === "authenticated") {
			console.log("Authendticated");
			router.push("/");
		}
	}, [session?.status, router]);

	const toggleVariant = useCallback(() => {
		if (variant === "Login") {
			setVariant("Register");
		} else {
			setVariant("Login");
		}
	}, [variant]);

	const onSubmit: SubmitHandler<FieldValues> = (data: any) => {
		setIsLoading(true);

		if (variant === "Register") {
			axios
				.post("/api/register", data)
				.then(() => {
					// toast.success("Succesfully signed up");
					signIn("credentials", data);
				})
				.catch((err) => {
					// toast.error(err.response.data);
				})
				.finally(() => setIsLoading(false));
		}

		if (variant === "Login") {
			signIn("credentials", {
				...data,
				redirect: false,
			})
				.then((callback) => {
					if (callback?.error) {
						// toast.error("Invalid credentials");
						console.log("Invalid Credentials");
					}

					if (callback?.ok && !callback?.error) {
						// toast.success("Logged in");
						router.push("/");
					}
				})
				.finally(() => setIsLoading(false));
		}
	};

	const socialAction = (action: string) => {
		setIsLoading(true);
		signIn(action, { redirect: false })
			.then((callback) => {
				if (callback?.error) {
					// toast.error("Invalid credentials");
				}

				if (callback?.ok && !callback?.error) {
					// toast.success("Logged in");
				}
			})
			.finally(() => setIsLoading(false));
	};

	return (
		<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-3">
			<div
				className="
      bg-gradient-to-br from-blue-800 via-black to-blue-800 
      px-4 py-8 shadow sm:rounded-lg sm:px-10"
			>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						{variant === "Register" && (
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input placeholder="e.g: james bond" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder="someone@example.com"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="**********"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit">Submit</Button>
					</form>
				</Form>

				{/* <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
					{variant === "Register" && (
						<Input
							disabled={isLoading}
							register={register}
							errors={errors}
							required
							id="name"
							label="Name"
							dark={true}
						/>
					)}
					<Input
						disabled={isLoading}
						register={register}
						errors={errors}
						required
						id="email"
						label="Email address"
						type="email"
						dark={true}
					/>
					<Input
						disabled={isLoading}
						register={register}
						errors={errors}
						required
						id="password"
						label="Password"
						type="password"
						dark={true}
					/>
					<div>
						<Button disabled={isLoading} dark={true} fullWidth type="submit">
							{variant === "Login" ? "Sign in" : "Register"}
						</Button>
					</div>
				</form> */}
				<div className="mt-6">
					<div className="relative">
						<div
							className="
                absolute 
                inset-0 
                flex 
                items-center
              "
						>
							<div className="w-full border-t border-sky-500" />
						</div>
						<div className="relative flex justify-center text-sm">
							<span
								className="
              bg-gradient-to-br from-blue-900 via-slate-900 to-blue-900 
              px-2 py-1 rounded-full text-white"
							>
								Or continue with
							</span>
						</div>
					</div>

					<div className="mt-6 flex gap-2">
						{/* <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialAction("github")}
            />
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => socialAction("google")}
            /> */}
					</div>
				</div>
				<div
					className="
            flex 
            gap-2 
            justify-center 
            text-sm 
            mt-6 
            px-2 
            text-white
          "
				>
					<div>
						{variant === "Login"
							? "Don't have an account yet?"
							: "Already have an account?"}
					</div>
					<div onClick={toggleVariant} className="underline cursor-pointer">
						{variant === "Login" ? "Create an account" : "Login"}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AuthForm;
