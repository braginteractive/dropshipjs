export default function Skeleton() {
  return (
    <div className="mt-10">
      <div className="flex h-full animate-pulse flex-row items-center justify-center space-x-5">
        {/* <div className="h-12 w-12 rounded-full bg-gray-300 "></div> */}
        <div className="flex h-full w-full flex-col space-y-3 p-2">
          <div className="h-8 rounded-md bg-gray-300"></div>
          <div className="h-8 rounded-md bg-gray-300 "></div>
          <div className="h-8 rounded-md bg-gray-300 "></div>
          <div className="h-8 rounded-md bg-gray-300 "></div>
          <div className="h-8 rounded-md bg-gray-300 "></div>
        </div>
      </div>
    </div>
  );
}
