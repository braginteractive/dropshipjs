import { Outlet } from "@remix-run/react";
import Footer from "~/components/Footer";
import Header from "~/components/Header";

export default function ProductsLayout() {
  return (
    <>
      <Header />

      <div className="mx-auto  max-w-7xl py-24 px-4 sm:py-16 sm:px-6 lg:px-8">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
