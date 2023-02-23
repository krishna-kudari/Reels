
interface ProviderProps {
    children: React.ReactNode;
    onsomething?: (arg: any) => void;
    error?: string | { message: string };
}


