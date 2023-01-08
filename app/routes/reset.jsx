import * as React from "react";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import {
  getUserByEmail,
  updateUserToken,
  getUserByToken,
  updateUserPassword,
} from "~/models/user.server";
import { validateEmail } from "~/lib/user";
import { getUserId } from "~/session.server";
import { sendPasswordResetEmail } from "~/lib/sendgrid";
import Alert from "~/components/Alert";
import ImageFallback from "~/lib/imageFallback";
import Logo from "~/images/logo.png";
import LogoW from "~/images/logo.webp";

export const meta = () => {
  return {
    title: "Reset Password",
  };
};

export const loader = async ({ request }) => {
  //if there is a user logged in, then they should know their password..
  const userId = await getUserId(request);
  if (userId) return redirect("/");

  // Get token from password rest link
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  // if (!token) {
  //   return json({ message: "Invalid token. Please try again. " });
  // }

  // Go grab the user that matches the token
  const user = await getUserByToken(token);

  return json({ user });
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);
  const { email, password, confirmPassword } = values;

  //Form Action: Send password reset email after validating user
  if (_action === "send_password_reset_email") {
    if (!validateEmail(email)) {
      return json({ errors: { email: "Email is invalid" } }, { status: 400 });
    }

    // get user with the valid email supplied
    const user = await getUserByEmail(email);

    if (!user) {
      return json(
        { errors: { email: "Can't find your account." } },
        { status: 400 }
      );
    }

    // Go update the user with a password reset token
    const updatedUser = await updateUserToken(email);

    // Send email with password reset link
    try {
      const resetEmail = await sendPasswordResetEmail(
        updatedUser.password.passwordResetToken,
        email
      );
      return json({ message: "Email sent" });
    } catch (error) {
      return json({ error });
    }
  }

  //Form Action:  Reset the user password in db
  if (_action === "password_reset") {
    if (typeof password !== "string") {
      return json(
        { errors: { password: "Password is required" } },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return json(
        { errors: { password: "Password is too short" } },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return json(
        { errors: { confirmPassword: "Password doesnt match" } },
        { status: 400 }
      );
    }

    // Update the user with the updated password
    const resetPassword = await updateUserPassword(email, password);

    return json({ message: "Password reset" });
  }
};

export default function ResetPage() {
  const data = useLoaderData();
  const actionData = useActionData();
  const emailRef = React.useRef(null);

  //console.log(data, actionData);

  React.useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-lg px-8">
        <Link to="/">
          <ImageFallback
            src={LogoW}
            fallback={Logo}
            alt="DropshipJS"
            width={200}
            height={30}
            className="w-full px-6"
          />
        </Link>
        {/* If there is a user with a valid token, show a form with password reset fields */}
        {data.user ? (
          <div>
            <Form
              method="post"
              action={"/reset?token=" + data.user.password.passwordResetToken}
              className="mt-5 space-y-6 rounded bg-white p-8"
              noValidate
            >
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    aria-invalid={
                      actionData?.errors?.password ? true : undefined
                    }
                    aria-describedby="password-error"
                    className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
                  />
                  {actionData?.errors?.password && (
                    <div className="pt-1 text-red-700" id="password-error">
                      {actionData.errors.password}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    aria-invalid={
                      actionData?.errors?.confirmPassword ? true : undefined
                    }
                    aria-describedby="password-error"
                    className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
                  />
                  {actionData?.errors?.confirmPassword && (
                    <div className="pt-1 text-red-700" id="password-error">
                      {actionData.errors.confirmPassword}
                    </div>
                  )}
                </div>
              </div>
              <input type="hidden" name="email" value={data.user.email} />
              <input type="hidden" name="_action" value="password_reset" />
              <button
                type="submit"
                className="w-full rounded bg-blue-600  py-2 px-4 text-white hover:bg-blue-500 focus:bg-blue-400"
              >
                Reset Password
              </button>
            </Form>
          </div>
        ) : (
          <Form
            method="post"
            className="mt-5 space-y-6 rounded bg-white p-8"
            noValidate
          >
            {/* If there isnt a valid token, show email reset form */}
            <Alert
              type="success"
              message={data?.message || actionData?.message}
            />
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  ref={emailRef}
                  id="email"
                  required
                  autoFocus={true}
                  name="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={actionData?.errors?.email ? true : undefined}
                  aria-describedby="email-error"
                  className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
                />
                {actionData?.errors?.email && (
                  <div className="pt-1 text-red-700" id="email-error">
                    {actionData.errors.email}
                  </div>
                )}
              </div>
            </div>
            <input
              type="hidden"
              name="_action"
              value="send_password_reset_email"
            />
            <button
              type="submit"
              className="w-full rounded bg-blue-600  py-2 px-4 text-white hover:bg-blue-500 focus:bg-blue-400"
            >
              Email Password Reset
            </button>

            <div className="flex items-center justify-between">
              <div className="text-center text-sm text-gray-500">
                Back to{" "}
                <Link
                  className="text-blue-500 underline"
                  to={{
                    pathname: "/login",
                  }}
                >
                  Login
                </Link>
              </div>
            </div>
          </Form>
        )}
      </div>
    </div>
  );
}
