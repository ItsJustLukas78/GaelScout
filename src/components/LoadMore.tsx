import { useInView } from 'react-intersection-observer';
import Spinner from "@/components/Spinner";
import {useEffect} from "react";

interface LoadMoreProps {
  loadMore: () => any
  active: boolean
}

export default function LoadMore({ loadMore, active }: LoadMoreProps) {
  const [ref, inView] = useInView();

  useEffect(() => {
    if (!active) {
      return;
    }

    let timeout: NodeJS.Timeout;

    if (inView) {
      // delay
      timeout = setTimeout(() => {
        loadMore();
      }, 500);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    }

  }, [inView]);

  return (
    <div ref={ref} className="flex justify-center items-center w-full h-20">
      {active &&
        <Spinner />
      }
    </div>
  );
}