import { CircleAlert, X } from "lucide-react";
import { toast } from "sonner";

const ToastError = (message: string) => {
  toast.custom((t) => (
    <div className="flex justify-between gap-3 px-2 bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-200 rounded-md text-xs shadow-none ring-1 ring-red-300/75 dark:ring-red-800/75">
      <div className="flex items-center gap-2 py-4">
				<div>
        <CircleAlert className=" h-[18px] w-[18px] fill-red-600 dark:fill-red-200 text-red-100 dark:text-red-950" />
				</div>
        {message}
      </div>
      <div className="pt-2">
        <X
          className="h-[18px] w-[18px] hover:text-red-400 cursor-pointer"
          onClick={() => toast.dismiss(t)}
        />
      </div>
    </div>
  ));
};

export default ToastError;
