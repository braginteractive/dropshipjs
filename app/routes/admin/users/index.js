import { getUsers, countUsers } from "~/models/user.server";
import { useLoaderData, Link } from "@remix-run/react";
import { json } from "@remix-run/node";
import PaginationTable from "~/components/admin/PaginationTable";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const currentPage = url.searchParams.get("page") || 1;
  const users = await getUsers(currentPage);
  const userCount = await countUsers();

  return json({ users, userCount });
};

export default function Users() {
  const { users, userCount } = useLoaderData();

  //console.log(users);
  return (
    <>
      <div className="px-4 sm:flex sm:items-center sm:px-6 md:px-0">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-extrabold text-gray-900">Users</h1>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          {/* <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Add user
          </button> */}
        </div>
      </div>
      <div className=" mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5  md:mx-0 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300 ">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
              >
                Name
              </th>

              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Role
              </th>
              <th
                scope="col"
                className="py-3.5 pr-4 text-right text-sm font-semibold text-gray-900 sm:table-cell sm:pr-6"
              >
                Orders
              </th>
              {/* <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Edit</span>
              </th> */}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {users.map((person) => (
              <tr key={person.email}>
                <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
                  <Link to="#" className="text-gray-500 hover:text-gray-900">
                    {person.first_name + " " + person.last_name}
                  </Link>
                  <dl className="font-normal lg:hidden">
                    <dt className="sr-only sm:hidden">Email</dt>
                    <dd className="mt-1 truncate text-gray-500 sm:hidden">
                      {person.email}
                    </dd>
                  </dl>
                </td>

                <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                  {person.email}
                </td>
                <td className="px-3 py-4 text-sm  text-gray-500">
                  {person.role}
                </td>
                <td className="py-4 pr-4 text-right text-sm text-gray-500  sm:pr-6">
                  <Link to={"#"}>{person.orders.length}</Link>
                </td>
                {/* <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <Link
                    to="#"
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit<span className="sr-only"> {person.first_name}</span>
                  </Link>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
        <PaginationTable count={userCount} />
      </div>
    </>
  );
}
