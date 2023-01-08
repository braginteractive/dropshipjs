import { Form } from "@remix-run/react";
import { useState } from "react";
import { useOptionalUser } from "~/lib/user";

export default function CheckoutForm({ countries, validation }) {
  const user = useOptionalUser();

  // set to the users country
  const [selectedCountry, setSelectedCountry] = useState(
    user?.addresses[0]?.country_code
  );
  // set to the users state
  const [selectedState, setSelectedState] = useState();

  // set to the users billing country
  const [selectedBillingCountry, setSelectedBillingCountry] = useState(
    user?.addresses[1]?.country_code
  );
  // set to the users billing state
  const [selectedBillingState, setSelectedBillingState] = useState();
  const [billingCheckbox, setBillingCheckbox] = useState(true);

  // get all the states for the selected country
  const availableState = countries?.result?.find(
    (c) => c.code === selectedCountry
  );

  // get all the states for the selected billing country
  const availableBillingState = countries?.result?.find(
    (c) => c.code === selectedBillingCountry
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
              Contact Information
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
                  aria-invalid={
                    Boolean(validation?.formErrors?.email) || undefined
                  }
                  aria-errormessage={
                    validation?.formErrors?.email ? "email-error" : undefined
                  }
                />
                {validation?.formErrors?.email ? (
                  <p className="text-red-500">
                    {validation?.formErrors?.email}
                  </p>
                ) : null}
              </div>
            </div>
          </section>

          <section aria-labelledby="shipping-heading" className="mt-10">
            <h2
              id="shipping-heading"
              className="text-lg font-medium text-gray-900"
            >
              Shipping Address
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="first_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    defaultValue={user?.first_name}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    aria-invalid={
                      Boolean(validation?.formErrors?.first_name) || undefined
                    }
                    aria-errormessage={
                      validation?.formErrors?.first_name
                        ? "first-name-error"
                        : undefined
                    }
                  />
                  {validation?.formErrors?.first_name ? (
                    <p className="text-red-500">
                      {validation?.formErrors?.first_name}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="last_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    defaultValue={user?.last_name}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="address1"
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
                    defaultValue={user?.addresses[0]?.address1}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    aria-invalid={
                      Boolean(validation?.formErrors?.address1) || undefined
                    }
                    aria-errormessage={
                      validation?.formErrors?.address1
                        ? "address1-error"
                        : undefined
                    }
                  />
                  {validation?.formErrors?.address1 ? (
                    <p className="text-red-500">
                      {validation?.formErrors?.address1}
                    </p>
                  ) : null}
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
                    defaultValue={user?.addresses[0]?.address2}
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
                    defaultValue={user?.addresses[0]?.country_code}
                    id="countries"
                    name="country_code"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                    defaultValue={user?.addresses[0]?.state_code}
                    id="state"
                    name="state_code"
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
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    defaultValue={user?.addresses[0]?.city}
                    aria-invalid={
                      Boolean(validation?.formErrors?.city) || undefined
                    }
                    aria-errormessage={
                      validation?.formErrors?.city ? "city-error" : undefined
                    }
                  />
                  {validation?.formErrors?.city ? (
                    <p className="text-red-500">
                      {validation?.formErrors?.city}
                    </p>
                  ) : null}
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
                    defaultValue={user?.addresses[0]?.zip}
                    aria-invalid={
                      Boolean(validation?.formErrors?.zip) || undefined
                    }
                    aria-errormessage={
                      validation?.formErrors?.zip ? "zip-error" : undefined
                    }
                  />
                  {validation?.formErrors?.zip ? (
                    <p className="text-red-500">
                      {validation?.formErrors?.zip}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </section>

          <section aria-labelledby="billing-heading" className="mt-10 hidden">
            <h2
              id="billing-heading"
              className="text-lg font-medium text-gray-900"
            >
              Billing Information
            </h2>

            <div className="mt-6 flex items-center">
              <input
                onChange={() => setBillingCheckbox((prevCheck) => !prevCheck)}
                id="same-as-shipping"
                name="same-as-shipping"
                type="checkbox"
                defaultChecked={billingCheckbox}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="ml-2">
                <label
                  htmlFor="same-as-shipping"
                  className="text-sm font-medium text-gray-900"
                >
                  Same as shipping information
                </label>
              </div>
            </div>

            {!billingCheckbox && (
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="b_first_name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="b_first_name"
                      name="b_first_name"
                      defaultValue={user?.addresses[1]?.first_name}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="b_last_name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="b_last_name"
                      name="b_last_name"
                      defaultValue={user?.addresses[1]?.last_name}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label
                    htmlFor="b_address1"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Address
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="b_address1"
                      name="b_address1"
                      autoComplete="street-address"
                      defaultValue={user?.addresses[1]?.address1}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label
                    htmlFor="b_address2"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Apartment, suite, etc.
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="b_address2"
                      name="b_address2"
                      defaultValue={user?.addresses[1]?.address2}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label
                    htmlFor="b_countries"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Country
                  </label>
                  <div className="mt-1">
                    <select
                      onChange={(e) =>
                        setSelectedBillingCountry(e.target.value)
                      }
                      defaultValue={user?.addresses[1]?.country_code}
                      id="b_countries"
                      name="b_country_code"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                    htmlFor="b_state"
                    className="block text-sm font-medium text-gray-700"
                  >
                    State
                  </label>
                  <div className="mt-1">
                    <select
                      disabled={!availableBillingState?.states}
                      onChange={(e) => setSelectedBillingState(e.target.value)}
                      defaultValue={user?.addresses[1]?.state_code}
                      id="b_state"
                      name="b_state_code"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option>--Choose State--</option>
                      {availableBillingState?.states?.map((e, key) => {
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
                    htmlFor="b_city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="b_city"
                      name="b_city"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      defaultValue={user?.addresses[1]?.city}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="b_postal-code"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Postal code
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="b_postal-code"
                      name="b_zip"
                      autoComplete="postal-code"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      defaultValue={user?.addresses[1]?.zip}
                    />
                  </div>
                </div>
              </div>
            )}
          </section>

          <div className="mt-10 border-t border-gray-200 pt-6 sm:flex sm:items-center sm:justify-between">
            <input type="hidden" name="id" value={user?.id} />
            <input
              type="hidden"
              name="shipping_id"
              value={user?.addresses[0]?.id}
            />
            <input
              type="hidden"
              name="billing_id"
              value={user?.addresses[1]?.id}
            />
            <input type="hidden" name="_action" value="continue_to_payment" />
            <button
              type="submit"
              className="w-full rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:order-last sm:ml-6 sm:w-auto"
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
