import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Forum() {
  const categories = await prisma.forumCategory.findMany({
    orderBy: { order: "asc" },
    include: {
      posts: {
        take: 1,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: { name: true, email: true },
          },
        },
      },
      _count: {
        select: { posts: true },
      },
    },
  });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/dashboard"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
          >
            ← Back to Dashboard
          </Link>
          <Link
            href="/forum/new"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          >
            New Discussion
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Community Forum
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discuss parts, ask questions, and share knowledge with the community
          </p>
        </div>

        <div className="space-y-4">
          {categories.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                No forum categories yet. Check back soon!
              </p>
            </div>
          ) : (
            categories.map((category) => (
              <div
                key={category.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <Link href={`/forum/${category.slug}`}>
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {category.name}
                        </h2>
                        {category.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {category.description}
                          </p>
                        )}
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-500">
                          <span>{category._count.posts} discussions</span>
                          {category.posts[0] && (
                            <>
                              <span className="mx-2">•</span>
                              <span>
                                Latest:{" "}
                                <strong>{category.posts[0].title}</strong> by{" "}
                                {category.posts[0].author.name ||
                                  category.posts[0].author.email}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="ml-4 text-gray-400 dark:text-gray-600">
                        →
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>

        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Forum Guidelines
          </h3>
          <ul className="list-disc list-inside text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>Be respectful and courteous to all members</li>
            <li>Stay on topic and keep discussions relevant to parts</li>
            <li>
              Share accurate information and cite sources when possible
            </li>
            <li>No spam, advertisements, or self-promotion</li>
            <li>Report any inappropriate content to moderators</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
