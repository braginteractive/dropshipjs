import { useLoaderData, Form } from "@remix-run/react";
import { useState } from "react";
import { useOptionalUser } from "~/lib/user";
import { getPrintfulCountries } from "~/lib/printful";

export const loader = async () => {
  const countries = await getPrintfulCountries();
  return countries;
};

export default function Checkout() {
  const user = useOptionalUser();
  const countries = useLoaderData();
  const [selectedCountry, setSelectedCountry] = useState();
  const [selectedState, setSelectedState] = useState();
  //const [billingCheckbox, setBillingCheckbox] = useState(true);

  const availableState = countries?.result?.find(
    (c) => c.code === selectedCountry
  );

  return (
    <>
      <Form
        method="post"
        action="/checkout"
        className="px-4 pt-16 pb-36 sm:px-6 lg:col-start-1 lg:row-start-1 lg:px-0 lg:pb-16"
      >
        <div className="mx-auto max-w-lg lg:max-w-none">
          <section aria-labelledby="contact-info-heading">
            <h2
              id="contact-info-heading"
              className="text-lg font-medium text-gray-900"
            >
              Contact information
            </h2>

            <div className="mt-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  defaultValue={user?.email}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </section>

          <section aria-labelledby="shipping-heading" className="mt-10">
            <h2
              id="shipping-heading"
              className="text-lg font-medium text-gray-900"
            >
              Shipping address
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="first-name"
                    name="first-name"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="last-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="last-name"
                    name="last-name"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="sm:col-span-6">
                <label
                  htmlFor="company"
                  className="block text-sm font-medium text-gray-700"
                >
                  Company
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="company"
                    name="company"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="address1"
                    name="address1"
                    autoComplete="street-address"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="address2"
                  className="block text-sm font-medium text-gray-700"
                >
                  Apartment, suite, etc.
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="address2"
                    name="address2"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="countries"
                  className="block text-sm font-medium text-gray-700"
                >
                  Country
                </label>
                <div className="mt-1">
                  <select
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    id="countries"
                    name="country_code"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    // defaultValue="US"
                  >
                    {countries?.result?.map((value, key) => {
                      return (
                        <option value={value.code} key={key}>
                          {value.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700"
                >
                  State
                </label>
                <div className="mt-1">
                  <select
                    disabled={!availableState?.states}
                    onChange={(e) => setSelectedState(e.target.value)}
                    id="state"
                    name="state_code"
                    autoComplete="address-level1"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option>--Choose State--</option>
                    {availableState?.states?.map((e, key) => {
                      return (
                        <option value={e.code} key={key}>
                          {e.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700"
                >
                  City
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="city"
                    name="city"
                    autoComplete="address-level2"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="postal-code"
                  className="block text-sm font-medium text-gray-700"
                >
                  Postal code
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="postal-code"
                    name="zip"
                    autoComplete="postal-code"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="mt-10 border-t border-gray-200 pt-6 sm:flex sm:items-center sm:justify-between">
            <input type="hidden" name="_action" value="continue_to_payment" />
            <button
              type="submit"
              className="w-full rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:order-last sm:ml-6 sm:w-auto"
            >
              Continue to Payment
            </button>
            <p className="mt-4 text-center text-sm text-gray-500 sm:mt-0 sm:text-left">
              You won't be charged until the next step.
            </p>
          </div>
        </div>
      </Form>
    </>
  );
}

//   <section aria-labelledby="billing-heading" className="mt-10">
//     <h2
//       id="billing-heading"
//       className="text-lg font-medium text-gray-900"
//     >
//       Billing information
//     </h2>

//     <div className="mt-6 flex items-center">
//       <input
//         onChange={() => setBillingCheckbox((prevCheck) => !prevCheck)}
//         id="same-as-shipping"
//         name="same-as-shipping"
//         type="checkbox"
//         defaultChecked={billingCheckbox}
//         className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
//       />
//       <div className="ml-2">
//         <label
//           htmlFor="same-as-shipping"
//           className="text-sm font-medium text-gray-900"
//         >
//           Same as shipping information
//         </label>
//       </div>
//     </div>

//     {!billingCheckbox && (
//       <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
//         <div className="sm:col-span-3">
//           <label
//             htmlFor="first-name"
//             className="block text-sm font-medium text-gray-700"
//           >
//             First Name
//           </label>
//           <div className="mt-1">
//             <input
//               type="text"
//               id="first-name"
//               name="first-name"
//               className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//             />
//           </div>
//         </div>
//       </div>
//     )}
//   </section>
