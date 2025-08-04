import { Command } from "cmdk";
import { useForm } from "react-hook-form";
import { useToast } from "~/hooks/useToast";
import { myFetch } from "~/utils/data";

export function AddSourceDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { register, handleSubmit } = useForm<{ name: string, url: string }>();
  const toast = useToast();

  const onSubmit = handleSubmit(async (data) => {
    await myFetch("/api/sources", {
      method: "POST",
      body: JSON.stringify(data),
    });
    toast.success("Source added successfully!");
    onOpenChange(false);
  });

  return (
    <Command.Dialog open={open} onOpenChange={onOpenChange} label="Add new source">
      <div className="p-4">
        <h2 className="text-lg font-semibold">Add a new RSS source</h2>
        <form className="mt-4 space-y-4" onSubmit={onSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Source Name
            </label>
            <input
              {...register("name", { required: true })}
              type="text"
              id="name"
              name="name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="url" className="block text-sm font-medium">
              RSS Feed URL
            </label>
            <input
              {...register("url", { required: true })}
              type="url"
              id="url"
              name="url"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Add Source
            </button>
          </div>
        </form>
      </div>
    </Command.Dialog>
  );
}
