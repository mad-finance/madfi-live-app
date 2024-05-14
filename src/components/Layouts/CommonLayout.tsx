import { Header } from "../Header";

export const CommonLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {children}
    </div>
  );
};

export default CommonLayout;
