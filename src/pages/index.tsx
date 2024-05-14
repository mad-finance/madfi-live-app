import { FC, useEffect, useState } from "react";
import { Hero } from "@/components/Hero";

const Home: FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <Hero />;
};

export default Home;
