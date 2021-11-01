import { throttle } from "lodash";
import { useCallback, useEffect, useState } from "react";
import GraphD3 from "../../Components/GraphD3";

import ValidatedGraphInput from "../../Components/ValidatedGraphInput";
import Graph from "../../models/Graph";
import { parseGraphfromString } from "../../util/graph-string";
import Styles from "./MainPage.module.scss";

export default function MainPage() {
  const [graphString, setGraphString] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [isRedBlue, setIsRedBlue] = useState(true);
  const [throttledGraphData, setThrottledGraphData] =
    useState<Graph<string> | undefined>(undefined);
  // Throttle the Function
  const throttledEffect = useCallback(
    throttle((str) => {
      const graph = parseGraphfromString(str);
      setThrottledGraphData(graph);
      setIsConnected(graph.isConnectedGraph());
      setIsRedBlue(graph.isRedBlue());
    }, 1000),
    []
  );

  useEffect(() => {
    throttledEffect(graphString);
    return () => {};
  }, [graphString]);
  return (
    <div className={Styles.MainPage}>
      <div>
        <ValidatedGraphInput
          onChange={(e) => setGraphString(e.target.value)}
          value={graphString}
          name="graph-input"
          className={Styles.graphInput}
        ></ValidatedGraphInput>
        {graphString && (
          <ul className={Styles.result}>
            <li>
              The graph is&nbsp;
              {isConnected ? "connected" : "disconnected"}
            </li>
            <li>
              The graph is&nbsp;
              {isRedBlue ? "red-blue" : "not red-blue"}
            </li>
          </ul>
        )}
      </div>
      <GraphD3
        data={throttledGraphData}
        className={Styles.graphContainer}
      ></GraphD3>
    </div>
  );
}
