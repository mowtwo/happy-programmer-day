import { useEffect, useMemo, useState } from "react";

function useCycleIndex(maxIndex: number, minIndex = 0, initIndex = minIndex) {
  const [index, setIndex] = useState(initIndex);

  const next = () => {
    setIndex((i) => {
      if (i + 1 <= maxIndex) {
        return i + 1;
      } else {
        return minIndex;
      }
    });
  };

  const back = () => {
    setIndex((i) => {
      if (i - 1 >= minIndex) {
        return i - 1;
      } else {
        return maxIndex;
      }
    });
  };

  return [index, next, back] as const;
}

function useTypo(pointers: string[]) {
  const [cycleIndex, next] = useCycleIndex(pointers.length - 1);
  const [index, setIndex] = useState(0);
  const pointer = useMemo(() => pointers[index] ?? "", [index]);
  useEffect(() => {
    let timer = setInterval(() => {
      if (pointer === "") {
        next();
      } else {
        setIndex(-1);
      }
    }, 1500);
    const cleanup = () => {
      clearInterval(timer);
    };
    return cleanup;
  }, [pointer]);
  useEffect(() => {
    setIndex(cycleIndex);
  }, [cycleIndex]);
  return [pointer, index, cycleIndex] as const;
}

function App() {
  const [pointer, index] = useTypo([".", "_", "|", "&", "*", "%", "$", "^"]);
  return (
    <div className="fixed flex items-center justify-center  top-0 left-0 w-100% h-100% bg-black">
      <div
        className="fixed left-50% top-50% translate--50% text-size-8 whitespace-nowrap text-dark-100 transition-500"
        style={{
          opacity: index >= 0 ? 0 : 1,
          zIndex: index >= 0 ? 1 : 2,
        }}
      >
        Happy Every Day {"#^_^"}
      </div>
      <div
        className="relative text-size-22 text-light-50 font-bold transition-200"
        style={{
          opacity: index >= 0 ? 1 : 0.1,
          zIndex: index >= 0 ? 2 : 1,
        }}
      >
        10
        <span className="font-normal">{pointer}</span>
        24
      </div>
    </div>
  );
}

export default App;
