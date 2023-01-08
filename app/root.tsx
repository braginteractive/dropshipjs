import type {
  LinksFunction,
  LoaderArgs,
  MetaFunction,
  LoaderFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useTransition,
  useCatch,
} from "@remix-run/react";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import { getUser } from "./session.server";
import { getCart } from "~/cookies";
import TopBarProgress from "react-topbar-progress-indicator";

TopBarProgress.config({
  barColors: {
    "0": "rgb(21, 128, 61)",
    "1.0": "rgb(76, 29, 149)",
  },
  barThickness: 5,
});

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "DropshipJS",
  viewport: "width=device-width,initial-scale=1",
});

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
  cart: Awaited<ReturnType<typeof getCart>>;
  env: object;
};

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  return json<LoaderData>({
    user: await getUser(request),
    cart: await getCart(request),
    env: {
      CLOUDINARY_CLOUDNAME: process.env.CLOUDINARY_CLOUDNAME,
    },
  });
};

export default function App() {
  const transition = useTransition();

  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-neutral-50">
        {(transition.state === "loading" ||
          transition.state === "submitting") && <TopBarProgress />}
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {/* <LiveReload /> */}

        <LiveReload port={Number(process.env.REMIX_DEV_SERVER_WS_PORT)} />
      </body>
    </html>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body className="bg-neutral-900">
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 ">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h1 className="text-lg font-medium leading-6 text-gray-900">
                Error
              </h1>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>{error.message}</p>
              </div>
            </div>
          </div>
          <Scripts />
        </div>
      </body>
    </html>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <html>
      <head>
        <title>Oops!</title>
        <Meta />
        <Links />
      </head>

      <body className="bg-neutral-900">
        {/* <Nav /> */}
        <div className="mx-auto max-w-7xl py-6 text-center sm:px-6 lg:px-8">
          <div className="px-4 py-5 sm:p-6">
            <div className="mt-12 flex -rotate-6 justify-center">
              <h1 className="inline-block rounded-lg border-2 border-red-600 bg-red-600 p-6 text-9xl font-extrabold uppercase text-white">
                {caught.status}
              </h1>
            </div>

            <div className="mt-8 text-sm text-white">
              <p>{caught.statusText}</p>
            </div>
          </div>

          <Scripts />
        </div>
      </body>
    </html>
  );
}
