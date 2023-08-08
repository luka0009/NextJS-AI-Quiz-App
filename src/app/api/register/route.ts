import bcrypt from "bcrypt";
import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { name, email, password } = body;

		if (!name || !email || !password) {
			return new NextResponse("All fields are required", { status: 400 });
		}

		const userExists = await prisma.user.findUnique({
			where: {
				email,
			},
		});

		if (userExists) {
			return new NextResponse("Email already in use", { status: 400 });
		}

		const hashedPassword = await bcrypt.hash(password, 12);
		const user = await prisma.user.create({
			data: {
				name,
				email,
				hashedPassword,
			},
		});

		return NextResponse.json(user);
	} catch (err: any) {
		console.log(err);
		return new NextResponse("Internal Error", { status: 500 });
	}
}
