import Footer from "~/components/Footer";
import Header from "~/components/Header";
import { Outlet } from "@remix-run/react";
import MetaImage from "~/images/social-share.jpg";

export function meta() {
  const meta = {
    title: "Apparel Categories | DropshipJS.com ",
    description:
      "Shop from our official online store here. Shirts, hoodies, shorts, hats, accessories, and more.",
  };
  return {
    title: meta.title,
    description: meta.description,
    image: MetaImage,
    "og:url": "https://dropshipjs.com",
    "og:image": MetaImage,
    "og:type": "website",
    "twitter:card": "summary_large_image",
    "twitter:title": meta.title,
    "twitter:description": meta.description,
    "twitter:image": MetaImage,
  };
}

export default function Categories() {
  return (
    <>
      <Header />

      <div className="mx-auto max-w-7xl py-24 px-4 sm:py-16 sm:px-6 lg:px-8">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
