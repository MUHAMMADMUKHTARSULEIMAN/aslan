const ArticleCardSkeleton = () => {
  return (
    <section className="w-full flex flex-col gap-6 rounded-xl bg-neutral-600/10 animate-pulse">
      <div className="rounded-t-lg w-full aspect-3/2 object-cover bg-neutral-500/10"></div>
      <section className="mx-4 mb-6 max-h-52 flex flex-col">
        <section className="flex flex-col gap-2.5 mb-4">
          <div className="w-full rounded-sm h-4 bg-neutral-500/10"></div>
          <div className="w-[60%] rounded-sm h-4 bg-neutral-500/10"></div>
        </section>
        <section className="flex flex-col gap-2 mb-6">
					<div className="w-[75%] rounded-sm h-3 bg-neutral-500/10"></div>
					<div className="w-full rounded-sm h-3 bg-neutral-500/10"></div>
					<div className="w-[88%] rounded-sm h-3 bg-neutral-500/10"></div>
					<div className="w-[25%] rounded-sm h-3 bg-neutral-500/10"></div>
				</section>
				<section className="flex justify-between items-center">
					<div className="w-[48%] rounded-sm h-4 bg-neutral-500/10"></div>
					<div className="w-[26%] rounded-lg h-8 bg-neutral-500/10"></div>
				</section>
      </section>
    </section>
  );
};

export default ArticleCardSkeleton;
