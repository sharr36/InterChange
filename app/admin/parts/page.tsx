import { prisma } from "@/lib/prisma";

export default async function PartsApproval() {
  const pendingParts = await prisma.part.findMany({
    where: { status: "PENDING" },
    include: {
      category: true,
      createdBy: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Parts Approval Queue
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Review and approve parts submitted by users
        </p>
      </div>

      {pendingParts.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No pending parts to review
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingParts.map((part) => (
            <div
              key={part.id}
              className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {part.partNumber}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {part.description}
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Manufacturer:
                      </span>{" "}
                      <span className="text-gray-600 dark:text-gray-400">
                        {part.manufacturer}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Category:
                      </span>{" "}
                      <span className="text-gray-600 dark:text-gray-400">
                        {part.category.name}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Submitted by:
                      </span>{" "}
                      <span className="text-gray-600 dark:text-gray-400">
                        {part.createdBy.name || part.createdBy.email}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Submitted:
                      </span>{" "}
                      <span className="text-gray-600 dark:text-gray-400">
                        {new Date(part.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {part.specifications && (
                    <div className="mt-3">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Specifications:
                      </span>
                      <pre className="mt-1 text-xs bg-gray-50 dark:bg-gray-900 p-2 rounded">
                        {JSON.stringify(part.specifications, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
                <div className="ml-4 flex flex-col space-y-2">
                  <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700">
                    Approve
                  </button>
                  <button className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700">
                    Reject
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
