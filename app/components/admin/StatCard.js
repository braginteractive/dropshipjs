import { UsersIcon } from "@heroicons/react/24/outline";
import { Link } from "@remix-run/react";

export default function StatCard({
  title = "Stat",
  icon: Icon = UsersIcon,
  value = "XXX",
  link = "/admin",
}) {
  return (
    <div className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6">
      <dt>
        <div className="absolute rounded-md bg-indigo-500 p-3">
          <Icon className="h-6 w-6 text-white" aria-hidden="true" />
        </div>
        <p className="ml-16 truncate text-sm font-medium text-gray-500">
          {title}
        </p>
      </dt>
      <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>

        <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
          <div className="text-sm">
            <Link
              to={link}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              View all
              <span className="sr-only"> {title} stats</span>
            </Link>
          </div>
        </div>
      </dd>
    </div>
  );
}
