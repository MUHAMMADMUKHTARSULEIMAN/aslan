const SaveCardSkeleton = () => {
  return (
    <div className="w-full p-3 bg-neutral-600/10 rounded-xl animate-pulse">
      <div className="grid grid-cols-[4fr_5fr] gap-2 mb-3">
        <div className="rounded-[9px] w-full aspect-3/2 object-cover bg-neutral-500/10"></div>
        <div className="aspect-15/8">
          <div className="flex flex-col gap-2">
            <div className="rounded-sm h-4 bg-neutral-500/10 w-[80%]"></div>
            <div className="rounded-sm h-4 bg-neutral-500/10 w-full"></div>
            <div className="rounded-sm h-4 bg-neutral-500/10 w-[60%]"></div>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <section className="w-full flex flex-col gap-2">
          <div className="w-[60%] rounded-sm h-4 bg-neutral-500/10"></div>
          <div className="w-[25%] rounded-sm h-3.5 bg-neutral-500/10"></div>
        </section>
        <div className="w-[15%] rounded-sm h-2.5 bg-neutral-500/10"></div>
      </div>
    </div>
  );
};

export default SaveCardSkeleton;
