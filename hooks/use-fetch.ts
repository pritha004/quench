import { useState } from "react";
import { Alert } from "react-native";

type UseFetchReturn<T, Args extends any[]> = {
  data: T | undefined;
  loading: boolean;
  error: any;
  fn: (...args: Args) => Promise<void>;
  setData: React.Dispatch<React.SetStateAction<T | undefined>>;
};

const useFetch = <T, Args extends any[]>(
  cb: (...args: Args) => Promise<T>
): UseFetchReturn<T, Args> => {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const fn = async (...args: Args): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await cb(...args);
      setData(response);
      setError(null);
    } catch (error: any) {
      setError(error);
      Alert.alert("Error", error?.message ?? "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn, setData };
};

export default useFetch;
