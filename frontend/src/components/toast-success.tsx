import { CircleCheck, X } from "lucide-react";
import { toast } from "sonner";

const ToastSuccess = (message: string) => {
  toast.custom((t) => (
    <div className="flex justify-between gap-3 px-2 bg-green-100 text-green-600 dark:bg-green-950/95 dark:text-green-200 rounded-md text-xs shadow-none ring-1 ring-green-300/75 dark:ring-green-800/75">
      <div className="flex items-center gap-2 py-4">
				<div>
        <CircleCheck className=" h-[18px] w-[18px] fill-green-600 dark:fill-green-200 text-green-100 dark:text-green-950/95" />
				</div>
        {message}
      </div>
      <div className="pt-2">
        <X
          className="h-[18px] w-[18px] hover:text-emerald-400 cursor-pointer"
          onClick={() => toast.dismiss(t)}
        />
      </div>
    </div>
  ));
};

export default ToastSuccess;
