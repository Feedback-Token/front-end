import {
  useEffect,
  useRef,
  useCallback,
  createContext,
  useContext,
  useState,
  FC,
} from "react";

interface AppState {
  subToken: string;
  setSubToken: React.Dispatch<React.SetStateAction<string>>;
  tokenAmount: string;
  setTokenAmount: React.Dispatch<React.SetStateAction<string>>;
}
const AppContext = createContext<AppState | undefined>(undefined);

export function useAppState(): AppState {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppProvider");
  }
  return context;
}

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: FC<AppProviderProps> = ({ children }) => {
  const [subToken, setSubToken] = useState<string>("0");
  const [tokenAmount, setTokenAmount] = useState<string>("0");

  const appState: AppState = {
    subToken,
    setSubToken,
    tokenAmount,
    setTokenAmount,
  };

  return <AppContext.Provider value={appState}>{children}</AppContext.Provider>;
};

export function useIsMounted() {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  return useCallback(() => isMounted.current, []);
}
