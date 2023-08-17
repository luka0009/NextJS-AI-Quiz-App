"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const page = () => {
	return (
		<div>
			<Button onClick={() => signOut()}>Sign out</Button>
		</div>
	);
};

export default page;
