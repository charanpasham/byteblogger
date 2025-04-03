import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "~/server/db";
import { todos } from "~/server/db/schema";

export default async function HomePage() {
  const currentTodo = await db.query.todos.findMany();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          <span className="text-[hsl(280,100%,70%)]">Todo</span> App
        </h1>
        <form
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8"
          action={async (formData: FormData) => {
            "use server";
            const title = formData.get("title")?.toString().trim();
            if (!title || title.length === 0) {
              throw new Error("Title is required");
            }

            const todoData = {
              title,
              description:
                formData.get("description")?.toString().trim() || null,
            };
            await db.insert(todos).values({
              title: todoData.title,
              description: todoData.description,
              completed: false, // Assuming a default value for 'completed'
              createdAt: new Date(), // Assuming 'createdAt' is required
              updatedAt: null, // Assuming 'updatedAt' can be null
            });
            revalidatePath("/");
          }}
        >
          <input
            className="w-full rounded-md border border-gray-300 bg-white p-4 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Add Todo Here ...."
            name="title"
          />
          <button className="bg-gray-700">Add Todo</button>
        </form>

        <div>
          <h2 className="mb-4 text-3xl font-bold">Todos</h2>
          <ul className="space-y-4">
            {currentTodo.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-center gap-2 rounded-md bg-white p-4 shadow-md"
              >
                <h3 className="text-xl font-semibold text-gray-800">
                  {todo.title}
                </h3>
                <form
                  action={async (formData: FormData) => {
                    "use server";
                    const id = formData.get("id")?.toString();
                    await db.delete(todos).where(
                      eq(todos.id, Number(id)), // Ensure the id is a number
                    );
                    revalidatePath("/");
                  }}
                >
                  <input type="hidden" name="id" value={todo.id} />
                  <button className="cursor-pointer text-red-800">X</button>
                </form>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
