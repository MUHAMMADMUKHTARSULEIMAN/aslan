import { Info, X } from "lucide-react";
import { toast } from "sonner";

const ToastInfo = (message: string) => {
  toast.custom((t) => (
    <div className="flex justify-between gap-3 px-2 bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-950 dark:text-fuchsia-200 rounded-md text-xs shadow-none ring-1 ring-fuchsia-300/75 dark:ring-fuchsia-800/75">
      <div className="flex items-center gap-2 py-4">
				<div>
        <Info className=" h-[18px] w-[18px] fill-fuchsia-600 dark:fill-fuchsia-200 text-fuchsia-100 dark:text-fuchsia-950" />
				</div>
        {message}
      </div>
      <div className="pt-2">
        <X
          className="h-[18px] w-[18px] hover:text-fuchsia-400 cursor-pointer"
          onClick={() => toast.dismiss(t)}
        />
      </div>
    </div>
  ));
};

export default ToastInfo;
