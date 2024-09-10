"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite";

import { cookies } from "next/headers";
import { ID } from "node-appwrite";
import { parseStringify } from "@/lib/utils";

export const signIn = async ({ email, password }: signInProps) => {
  try {
    const { account } = await createAdminClient();

    const response = await account.createEmailPasswordSession(email, password);
    return parseStringify(response);
  } catch (e) {
    console.error("SignIn Error: ", e);
  }
};

export const signUp = async (userData: SignUpParams) => {
  const { email, password, firstName, lastName } = userData;
  console.log("userData signUp func: ", userData);
  let newUserAccount;

  try {
    const { account } = await createAdminClient();

    newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`,
    );
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUserAccount);
  } catch (e) {
    console.error("SignUp Error: ", e);
  }
};

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();

    const user = await account.get();

    return parseStringify(user);
  } catch (error) {
    return null;
  }
}

export const logoutAccount = async () => {
  try {
    const { account } = createSessionClient();

    cookies().delete("appwrite-session");

    await account.deleteSession("current");
  } catch (error) {
    return null;
  }
};
