import { useIsMounted } from "../hooks/app-hooks";
import { Layout } from "../components/layout";
import { CardGrid } from "@/components/card-grid";
import { UserData } from "@/components/user-data";
import LandingPage from "@/components/landing-page";
import { useAccount } from "wagmi";

export default function Home() {
  const { address } = useAccount();
  const isMounted = useIsMounted();

  return (
    <Layout title="BrainCloud">
      {isMounted() && address ? (
        <>
          <UserData />
          <CardGrid />
        </>
      ) : (
        <LandingPage />
      )}
    </Layout>
  );
}
