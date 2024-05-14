export const Footer = () => {
  return (
    <footer className="w-full bg-background py-24 border-t-foreground border-t-2 md:px-8 flex items-center justify-center">
      <div className="2xl:max-w-[1550px] max-w-7xl w-full px-64">
        <div className="flex justify-between w-full">
          <div className="w-full md:w-auto">
            <div className="pl-4 md:pl-8 w-max">
              <a className="w-full" href="https://madfi.xyz" target="_blank">
                <div className="text-normal font-extrabold uppercase text-4xl font-ownersx">
                  <span className="text-primary">MAD</span>
                  <span className="text-secondary">FI</span>
                </div>
              </a>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-28">
            <div className="flex flex-col gap-4">
              <span className="font-bold text-white">Socials</span>
              <a
                className="cursor-pointer text-[#989898] no-underline hover:text-white transition-colors"
                href="https://www.lensfrens.xyz/madfinance.lens"
              >
                Lens
              </a>
              <a
                className="cursor-pointer text-[#989898] no-underline hover:text-white transition-colors"
                href="https://twitter.com/madfiprotocol"
                target="_blank"
                rel="noreferrer"
              >
                Twitter
              </a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-bold text-white">Info</span>

              <a
                className="cursor-pointer text-[#989898] no-underline hover:text-white transition-colors"
                href="https://mirror.xyz/madfiprotocol.eth"
              >
                Blog
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
