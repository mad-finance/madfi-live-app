export const SpaceEnded = ({ handle }: { handle: string }) => {
  return (
    <div className="h-screen">
      <div className="min-h-full px-4 py-8 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
        <div className="mx-auto max-w-max">
          <main className="sm:flex">
            <div className="sm:ml-6">
              <div className="sm:border-l sm:border-gray-200 sm:pl-6">
                <h1 className="animate-move-txt-bg gradient-txt text-4xl font-bold tracking-tight sm:text-5xl">Space Has Ended</h1>
                <p className="mt-1 text-base text-gray-500">hosted by @{handle}</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
