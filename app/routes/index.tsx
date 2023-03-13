import Footer from "~/components/Footer";
import Header from "~/components/Header";
import { Link, useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import Product from "~/components/Product";
import Modal from "~/components/Modal";
import MetaImage from "~/images/social-share.jpg";
import { Button } from "~/components/Button";
import logoPrintful from "~/images/logos/printful.svg";
import logoRemix from "~/images/logos/remix.svg";
import logoStripe from "~/images/logos/stripe.svg";
import logoCloudinary from "~/images/logos/cloudinary.svg";
import logoSendGrid from "~/images/logos/sendgrid.svg";
import logoReact from "~/images/logos/reactjs.svg";
import screenshotDashboard from "~/images/screenshots/dashboard.png";
import screenshotPrisma from "~/images/screenshots/prisma.png";
import screenshotFly from "~/images/screenshots/flyio.png";
import screenshotMedia from "~/images/screenshots/media.png";
import { Tab } from "@headlessui/react";
import classNames from "~/lib/classNames";
import CloudMedia from "~/components/CloudMedia";

const logos = [
  { name: "Printful", logo: logoPrintful },
  { name: "Stripe", logo: logoStripe },
  { name: "Remix", logo: logoRemix },

  { name: "Cloudinary", logo: logoCloudinary },
  { name: "SendGrid", logo: logoSendGrid },
  { name: "React", logo: logoReact },
];

const features = [
  {
    title: "Tailwind CSS",
    description:
      "The front and backend of DropshipJS is styled with the utility-first CSS framework.",
    image: screenshotDashboard,
  },
  {
    title: "Prisma",
    description:
      "Prisma provides a nice database ORM to work with your custom models and queries.",
    image: screenshotPrisma,
  },
  {
    title: "Cloudinary",
    description:
      "Upload your product and category images directly to Cloudinary from the admin area.",
    image: screenshotMedia,
  },
  {
    title: "Ship with Fly.io",
    description: "Servers next to your users with PostgreSQL clusters.",
    image: screenshotFly,
  },
];

export function meta() {
  const meta = {
    title: "Dropshipping with Printful and Remix  | DropshipJS.com ",
    description: "Shirts, hoodies, shorts, hats, accessories, and more.",
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

export default function Index() {
  const categoryFetcher = useFetcher();
  const productFetcher = useFetcher();
  const [tabOrientation, setTabOrientation] = useState("horizontal");
  const [openModal, setOpenModal] = useState(false);

  function toggleModal() {
    setOpenModal(!openModal);
  }

  useEffect(() => {
    if (categoryFetcher.type === "init") {
      categoryFetcher.load("/categories?index");
    }
  }, [categoryFetcher]);

  useEffect(() => {
    if (productFetcher.type === "init") {
      productFetcher.load("/products?index");
    }
  }, [productFetcher]);

  //console.log(productFetcher.data);

  return (
    <>
      <Header />
      <section id="hero" className="pt-20 pb-16 text-center lg:pt-32">
        <h1 className="font-display mx-auto max-w-7xl text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
          Launch a{" "}
          <span className="relative whitespace-nowrap text-indigo-600">
            <svg
              aria-hidden="true"
              viewBox="0 0 418 42"
              className="absolute top-2/3 left-0 h-[0.58em] w-full fill-indigo-300/70"
              preserveAspectRatio="none"
            >
              <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
            </svg>
            <span className="relative">dropshipping store</span>
          </span>{" "}
          with your favorite tools and resources.
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg tracking-tight text-slate-700">
          DropshipJS is a merchandise ecommerce app that captures payment and
          automatically fulfills customers orders with the help of Printful,
          Stripe, Cloudinary and SendGrid. All powered by the full stack web
          framework provided by Remix!
        </p>
        <div className="mt-10 flex justify-center gap-x-6">
          <Button href="https://github.com/braginteractive/dropshipjs">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="mr-3 h-6 w-6 fill-white"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.607 9.607 0 0 1 12 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48 3.97-1.32 6.833-5.054 6.833-9.458C22 6.463 17.522 2 12 2Z"
              ></path>
            </svg>
            Documentation
          </Button>
          <button
            onClick={toggleModal}
            className="group inline-flex items-center justify-center rounded-full bg-white py-2 px-4 text-sm text-slate-900 ring-1 hover:bg-blue-50 focus:outline-none focus-visible:outline-white active:bg-blue-200 active:text-slate-600"
          >
            <svg
              aria-hidden="true"
              className="h-3 w-3 flex-none fill-blue-600 group-active:fill-current"
            >
              <path d="m9.997 6.91-7.583 3.447A1 1 0 0 1 1 9.447V2.553a1 1 0 0 1 1.414-.91L9.997 5.09c.782.355.782 1.465 0 1.82Z" />
            </svg>
            <span className="ml-3">Watch video</span>
          </button>
          <Modal openModal={openModal} toggleModal={toggleModal}>
            <iframe
              width="1000"
              height="500"
              src="https://www.youtube.com/embed/EnmaNiDc0NA"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="aspect-video w-full"
            ></iframe>
          </Modal>
        </div>
        <div className="mx-auto mt-36 max-w-7xl text-center lg:mt-44">
          <p className="font-display text-sm text-slate-900">
            DropshipJS uses the following libraries and resources
          </p>
          <ul className="mt-4 grid grid-cols-2 justify-center gap-x-8  md:grid-cols-3 lg:grid-cols-6 ">
            {logos.map((company) => (
              <li key={company.name} className="justify-self-center ">
                <img
                  className="h-24 w-full"
                  src={company.logo}
                  alt={company.name}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="features"
        className="relative overflow-hidden bg-gradient-to-r from-indigo-800 to-violet-900  pt-20 pb-28 sm:py-32 "
      >
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
            <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl md:text-5xl">
              Started from the Remix Blues Stack.
            </h2>
            <p className="mt-6 text-lg tracking-tight text-blue-100">
              Fly.io, Prisma, PostgreSQL, Tailwind CSS and more.
            </p>
          </div>
          <Tab.Group
            as="div"
            className="mt-16 grid grid-cols-1 items-center gap-y-2 pt-10 sm:gap-y-6 md:mt-20 lg:grid-cols-12 lg:pt-0"
            vertical={tabOrientation === "vertical"}
          >
            {({ selectedIndex }) => (
              <>
                <div className="-mx-4 flex overflow-x-auto pb-4 sm:mx-0 sm:overflow-visible sm:pb-0 lg:col-span-5">
                  <Tab.List className="relative z-10 flex gap-x-4 whitespace-nowrap px-4 sm:mx-auto sm:px-0 lg:mx-0 lg:block lg:gap-x-0 lg:gap-y-1 lg:whitespace-normal">
                    {features.map((feature, featureIndex) => (
                      <div
                        key={feature.title}
                        className={classNames(
                          "group relative rounded-full py-1 px-4 lg:rounded-r-none lg:rounded-l-xl lg:p-6",
                          selectedIndex === featureIndex
                            ? "bg-white lg:bg-white/10 lg:ring-1 lg:ring-inset lg:ring-white/10"
                            : "hover:bg-white/10 lg:hover:bg-white/5"
                        )}
                      >
                        <h3>
                          <Tab
                            className={classNames(
                              "font-display text-lg focus:outline-none",
                              selectedIndex === featureIndex
                                ? "text-blue-600 lg:text-white"
                                : "text-blue-100 hover:text-white lg:text-white"
                            )}
                          >
                            <span className="absolute inset-0 rounded-full lg:rounded-r-none lg:rounded-l-xl" />
                            {feature.title}
                          </Tab>
                        </h3>
                        <p
                          className={classNames(
                            "mt-2 hidden text-sm lg:block",
                            selectedIndex === featureIndex
                              ? "text-white"
                              : "text-blue-100 group-hover:text-white"
                          )}
                        >
                          {feature.description}
                        </p>
                      </div>
                    ))}
                  </Tab.List>
                </div>
                <Tab.Panels className="lg:col-span-7">
                  {features.map((feature) => (
                    <Tab.Panel key={feature.title} unmount={false}>
                      <div className="relative sm:px-6 lg:hidden">
                        <div className="absolute -inset-x-4 top-[-6.5rem] bottom-[-4.25rem] bg-white/10 ring-1 ring-inset ring-white/10 sm:inset-x-0 sm:rounded-t-xl" />
                        <p className="relative mx-auto max-w-2xl text-base text-white sm:text-center">
                          {feature.description}
                        </p>
                      </div>
                      <div className="mt-10 w-[45rem] overflow-hidden rounded-xl bg-slate-50 shadow-xl shadow-blue-900/20 sm:w-auto lg:mt-0 lg:w-[67.8125rem]">
                        <img className="w-full" src={feature.image} alt="" />
                      </div>
                    </Tab.Panel>
                  ))}
                </Tab.Panels>
              </>
            )}
          </Tab.Group>
        </div>
      </section>

      <section
        aria-labelledby="category-heading"
        className="py-24 xl:mx-auto xl:max-w-7xl xl:px-8"
      >
        <div className="mb-20 text-center">
          <h3 className="text-lg font-semibold uppercase leading-8 text-indigo-600">
            Live Demo
          </h3>
          <p className="text-black-900 mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Grab some new JavaScript swag.
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            All transactions will be processed by Stripe and shipped by
            Printful. <br /> See something you like?
          </p>
        </div>

        <div className="px-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8 xl:px-0">
          <h2
            id="category-heading"
            className="text-2xl font-bold tracking-tight text-gray-900"
          >
            Shop by Category
          </h2>
          <Link
            to="/categories"
            className="hidden text-sm font-semibold text-indigo-600 hover:text-indigo-500 sm:block"
          >
            Browse all categories
            <span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>

        <div className="mt-4 flow-root">
          <div className="-my-2">
            <div className="relative box-content h-80 overflow-x-auto py-2 xl:overflow-visible">
              <div className="min-w-screen-xl absolute flex space-x-8 px-4 sm:px-6 lg:px-8 xl:relative xl:grid xl:grid-cols-5 xl:gap-x-8 xl:space-x-0 xl:px-0">
                {categoryFetcher?.data
                  ?.filter((show) => show.featured)
                  .map((category) => (
                    <Link
                      key={category.name}
                      to={`/categories/${category.slug}`}
                      className="relative flex h-80 w-56 flex-col overflow-hidden rounded-lg p-6 hover:opacity-75 xl:w-auto"
                    >
                      <span aria-hidden="true" className="absolute inset-0">
                        <CloudMedia
                          alt={category.name}
                          className="h-full w-full object-cover object-center"
                          id={category.image}
                        />
                      </span>
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-gray-800 opacity-50"
                      />
                      <span className="relative mt-auto text-center text-xl font-bold text-white">
                        {category.name}
                      </span>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 px-4 sm:hidden">
          <Link
            to="/categories"
            className="block text-sm font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Browse all categories
            <span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>
      </section>

      <section aria-labelledby="products-heading">
        <div className="mx-auto max-w-7xl py-24 px-4 sm:px-6 sm:py-32 lg:px-8 lg:pt-32">
          <div className="md:flex md:items-center md:justify-between">
            <h2
              id="products-heading"
              className="text-2xl font-bold tracking-tight text-gray-900"
            >
              Latest Products
            </h2>
            <Link
              to="/products"
              className="hidden text-sm font-medium text-indigo-600 hover:text-indigo-500 md:block"
            >
              Shop all products
              <span aria-hidden="true"> &rarr;</span>
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-3 sm:gap-x-6 lg:gap-x-8">
            {productFetcher?.data?.products?.map((product) => (
              <Product key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-8 text-sm md:hidden">
            <Link
              to="/products"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Shop all products
              <span aria-hidden="true"> &rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
