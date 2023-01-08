import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

export default function Alert({ type, title, message }) {
  let icon = CheckCircleIcon;
  let color = "green";

  switch (type) {
    case "success":
      icon = CheckCircleIcon;
      color = "green";
      break;
    case "warning":
      icon = ExclamationTriangleIcon;
      color = "yellow";
      break;
    case "error":
      icon = XCircleIcon;
      color = "red";
      break;

    default:
      break;
  }

  const alertIcon = [
    {
      icon,
      color,
      message,
    },
  ];

  return (
    <>
      {message && (
        <>
          {alertIcon.map((i, idx) => (
            <div key={idx} className={`bg-${i.color}-50 rounded-md p-4`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  <i.icon
                    className={`h-5 w-5 text-${i.color}-400`}
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3">
                  {title && (
                    <h3 className={`text-sm font-medium text-${i.color}-800`}>
                      {title}
                    </h3>
                  )}
                  <p className={`text-${i.color}-800 text-sm`}>{message}</p>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
}
