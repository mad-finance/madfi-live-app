import { useRouter } from "next/router";
import MirrorSvg from "@/assets/svg/mirror.svg";

export default () => {
  const router = useRouter();
  const isLivePage = router.pathname.includes('/live/');

  return (
    <footer className="flex items-center justify-between py-1 bg-black relative z-9 border-t-[0.1px] border-t-slate-700 w-full">
      <div className={`px-4 xs:px-8 md:px-16 py-12 ${isLivePage ? 'pb-36' : 'pb-12'} mx-auto`}>
        <div className="flex items-center justify-between gap-8">
          <div className="flex items-center justify-evenly w-full md:w-fit md:gap-8">
            <img src="/clubspace-logo.png" alt="Clubspace logo" className="max-w-[75px]" />
          </div>
          <div className="flex flex-col items-center md:items-start gap-8">
            <div className="text-normal font-extrabold text-5xl font-ownersx">
              <p className="text-1xl tracking-wide w-full font-ownersx text-center text-[15px] landing-page-subtext-shadow whitespace-nowrap">
                ClubSpace by{" "}
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://madfinance.xyz"
                  className="link-hover font-helvetica-text text-secondary"
                >
                  MAD FINANCE
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
