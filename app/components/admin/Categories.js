import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";

export default function Categories({ categories, setCategories }) {
  const categoryFetcher = useFetcher();

  useEffect(() => {
    if (categoryFetcher.type === "init") {
      categoryFetcher.load("/admin/categories?index");
    }
  }, [categoryFetcher]);

  function handleCategoryCheck(e) {
    if (e.target.checked) {
      setCategories([...categories, e.target.value]);
    } else {
      // remove from list
      setCategories(categories.filter((check) => check !== e.target.value));
    }
  }

  // console.log(checked);

  return (
    <>
      <fieldset>
        <legend className="text-sm font-medium text-gray-900">
          Categories
        </legend>
        <div className="mt-4 flex gap-5">
          {categoryFetcher?.data?.map((cat) => (
            <div key={cat.id} className="flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id={cat.id}
                  value={cat.id}
                  name={cat.slug}
                  checked={categories.includes(cat.id)}
                  onChange={handleCategoryCheck}
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor={cat.id} className="font-medium text-gray-700">
                  {cat.name}
                </label>
              </div>
            </div>
          ))}
        </div>
      </fieldset>
    </>
  );
}
