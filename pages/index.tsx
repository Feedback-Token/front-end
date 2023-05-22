import { useEffect, useState } from "react";
import { Layout } from "../components/layout";
import { CardGrid } from "@/components/card-grid";
import { UserData } from "@/components/user-data";
import LandingPage from "@/components/landing-page";
import { useAccount } from "wagmi";

export default function Home() {
  const { address } = useAccount();
  const [isReady, setIsReady] = useState(false);
  const [showLandingPage, setShowLandingPage] = useState(false);

  useEffect(() => {
    if (address) {
      setIsReady(true);
      setShowLandingPage(false);
    } else {
      setIsReady(false);
      setShowLandingPage(true);
    }
  }, [address]);

  return (
    <Layout title="BrainCloud">
      {isReady ? (
        <>
          <UserData />
          <CardGrid />
        </>
      ) : showLandingPage ? (
        <LandingPage />
      ) : (
        <></>
      )}
    </Layout>
  );
}
