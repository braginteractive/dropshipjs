import { HomeIcon, ArrowSmallLeftIcon } from "@heroicons/react/24/outline";
import { useLocation, NavLink } from "@remix-run/react";

export default function Breadcrumbs() {
  const location = useLocation();

  //console.log(location);

  function generateBreadcrumbs() {
    const asPathNestedRoutes = location.pathname
      .split("/")
      .filter((v) => v.length > 0);

    // Iterate over the list of nested route parts and build
    // a "crumb" object for each one.
    const crumblist = asPathNestedRoutes.map((subpath, idx) => {
      // We can get the partial nested route for the crumb
      // by joining together the path parts up to this point.
      const to = "/" + asPathNestedRoutes.slice(0, idx + 1).join("/");
      // The title will just be the route string for now
      const text = subpath;
      return { to, text };
    });

    return crumblist;
  }
  const breadcrumbs = generateBreadcrumbs();

  return (
    breadcrumbs.length > 1 && (
      <div className="bg-white px-4 sm:px-8">
        <div className=" py-3">
          <nav className="flex" aria-label="Breadcrumb">
            <div className="flex sm:hidden">
              <NavLink
                to="/admin"
                className="group inline-flex space-x-3 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                <ArrowSmallLeftIcon
                  className="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-600"
                  aria-hidden="true"
                />
                <span>Back to Dashboard</span>
              </NavLink>
            </div>
            <div className="hidden sm:block">
              <ol className="flex items-center space-x-4">
                {breadcrumbs.map((item, count) => (
                  <li key={item.text}>
                    <div className="flex items-center">
                      {item.text === "admin" ? (
                        <NavLink
                          to={item.to}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <HomeIcon
                            className="h-5 w-5 flex-shrink-0"
                            aria-hidden="true"
                          />
                          <span className="sr-only">Dashboard</span>
                        </NavLink>
                      ) : (
                        <>
                          <svg
                            className="h-5 w-5 flex-shrink-0 text-gray-300"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            aria-hidden="true"
                          >
                            <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                          </svg>
                          {/* If it's th elast item, dont make link. You are currently on that page */}
                          {breadcrumbs.length - 1 === count ? (
                            <span className="ml-4 text-sm font-medium capitalize text-gray-500">
                              {item.text}
                            </span>
                          ) : (
                            <NavLink
                              end
                              to={item.to}
                              className="ml-4 text-sm font-medium capitalize text-gray-500 hover:text-gray-700"
                              aria-current={item.current ? "page" : undefined}
                            >
                              {item.text}
                            </NavLink>
                          )}
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </nav>
        </div>
      </div>
    )
  );
}
