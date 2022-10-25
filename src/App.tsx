import { useEffect } from "react";
import { useMemo } from "react";
import { useState } from "react";
import "./App.css";
import ErrorMessageIcon from "./assets/msg_error-0.png";

interface ErrorWindowProps {
  title?: string;
  content?: string;
  top?: number;
  left?: number;
}

const ErrorWindow = ({
  title = "System Message",
  content = "Error",
  top = 0,
  left = 0,
}: ErrorWindowProps) => {
  return (
    <div
      className="window"
      style={{
        left,
        top,
      }}
    >
      <div className="title-bar">
        <div className="title-bar-text">{title}</div>
        <div className="title-bar-controls">
          <button aria-label="Close"></button>
        </div>
      </div>
      <div className="window-body">
        <p>
          <img src={ErrorMessageIcon} alt="icon" /> {content}
        </p>
        <section className="field-row">
          <button>OK</button>
        </section>
      </div>
    </div>
  );
};

const nextNumber = (
  current: number,
  min: number,
  max: number,
  step: number,
  reverse = false
): [n: number, reverse: boolean] => {
  if (reverse) {
    current -= step;
    if (current < min) {
      return nextNumber(current + step, min, max, step, false);
    } else {
      return [current, reverse];
    }
  } else {
    current += step;
    if (current > max) {
      return nextNumber(current - step, min, max, step, true);
    } else {
      return [current, reverse];
    }
  }
};

const useNextNumber = (
  init_number: number,
  min: number,
  max: number,
  step: number,
  init_reverse = false
) => {
  const [cache, setCache] = useState([init_number, init_reverse] as const);
  const number = useMemo(() => cache[0], [cache]);
  const reverse = useMemo(() => cache[1], [cache]);

  const next = () => {
    setCache((c) => {
      return nextNumber(c[0], min, max, step, c[1]);
    });
  };

  return [number, next, reverse] as const;
};

const useNextPosition = (init_left: number, init_top: number, step: number) => {
  const [top, nextTop] = useNextNumber(
    init_top,
    0,
    window.innerHeight,
    step,
    false
  );
  const [left, nextLeft] = useNextNumber(
    init_left,
    0,
    window.innerWidth,
    step,
    false
  );
  const position = useMemo(
    () => ({
      top,
      left,
    }),
    [top, left]
  );

  const nextPosition = () => {
    nextTop();
    nextLeft();
  };

  return [position, nextPosition] as const;
};

const useErrorPush = (init_start = false) => {
  const [array, setArray] = useState<
    { top: number; left: number; id: number }[]
  >([]);
  const [position, nextPosition] = useNextPosition(0, 0, 10);
  const [starting, setStarting] = useState(init_start);

  useEffect(() => {
    if (starting) {
      const timer = setInterval(() => {
        nextPosition();
      }, 100);
      const cleanup = () => clearInterval(timer);
      return cleanup;
    }
  }, [starting]);

  useEffect(() => {
    setArray((old) => {
      return [
        ...old,
        {
          left: position.left,
          top: position.top,
          id: Date.now(),
        },
      ];
    });
  }, [position]);

  const start = () => {
    setStarting(true);
  };

  const pause = () => {
    setStarting(false);
  };

  const stop = () => {
    pause();
    setArray([]);
  };

  return [
    array,
    {
      start,
      pause,
      stop,
      starting,
    },
  ] as const;
};

const App = () => {
  const [array, { start, starting }] = useErrorPush();
  return (
    <div className="app">
      <div className="flex-center">
        <button
          onClick={() => {
            start();
          }}
        >
          1024 一起摇摆
        </button>
      </div>
      {starting ? (
        <div className="fixed">
          {array.map((item) => {
            return (
              <ErrorWindow key={item.id} top={item.top} left={item.left} />
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default App;
