import { cookies } from "next/headers";

export async function login(formData: FormData) {
    const user = { email: formData.get('email'), password: formData.get('password') };

}