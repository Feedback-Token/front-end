import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { shortenAddress } from "../utils";
import { ConnectButton } from "./connect-button";
import { TriangleDownIcon } from "@chakra-ui/icons";
import {
  Avatar,
  AvatarBadge,
  Badge,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { useIsMounted } from "../hooks/app-hooks";
import { FC } from "react";
import {
  useAccount,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useSwitchNetwork,
  useNetwork,
} from "wagmi";

export const Wallet: FC = () => {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName();
  const { data: ensAvatar } = useEnsAvatar();
  const { disconnect } = useDisconnect();
  const router = useRouter();
  const handleRedirect = () => {
    router.push("/");
  };
  const signOut: () => void = async () => {
    disconnect();
  };
  const { chain } = useNetwork();
  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();
  const isMounted = useIsMounted();
  const [isLoadingApp, setIsLoading] = useState(true);

  useEffect(() => {
    if (isMounted()) {
      setIsLoading(false);
    }
  }, [isMounted]);

  if (isLoadingApp) {
    return <></>;
  }

  return address ? (
    <Menu>
      <MenuButton
        as={Button}
        backgroundColor="rgba(0,0,0,0)"
        rounded="full"
        pl={4}
      >
        <HStack mx={-1} spacing={1}>
          <Text fontSize={["md", "lg"]} mr={1}>
            {ensName || shortenAddress(address)}
          </Text>
          <Avatar fontWeight="700" size="sm" src={ensAvatar || undefined}>
            <AvatarBadge boxSize="1.25em" bg="orange.500" />
          </Avatar>
          <TriangleDownIcon ml={3} mr={-1} w={3} color="gray.400" />
        </HStack>
      </MenuButton>
      <MenuGroup />
      <MenuList>
        <MenuGroup title="Network">
          {chains &&
            chains.map((x) => (
              <MenuItem
                key={`network-${x.id}`}
                onClick={() => chain?.id !== x.id && switchNetwork?.(x.id)}
              >
                <Text pl="3">
                  {x.name}
                  <Badge
                    variant="outline"
                    colorScheme="green"
                    ml={2}
                    hidden={chain?.id !== x.id}
                  >
                    Connected
                  </Badge>
                  <Badge
                    variant="outline"
                    colorScheme="yellow"
                    ml={2}
                    hidden={!isLoading || pendingChainId !== chain?.id}
                  >
                    Loading...
                  </Badge>
                </Text>
              </MenuItem>
            ))}
        </MenuGroup>
        <MenuDivider />
        <MenuItem
          onClick={() => {
            signOut();
            handleRedirect();
          }}
        >
          Disconnect
        </MenuItem>
      </MenuList>
    </Menu>
  ) : (
    <ConnectButton>Connect Wallet</ConnectButton>
  );
};
