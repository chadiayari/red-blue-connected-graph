import * as d3 from "d3";
import { parseBasicGraphFromGraph } from "../../util/graph-string";


/**
 * Render the D3 Graph
 * @param {React.MutableRefObject} container 
 * @param {Graph<string>} data 
 */
export function renderGraph(container, data) {
  const containerRect = container.current?.getBoundingClientRect();

  const height = containerRect?.height || 0;
  const width = containerRect?.width || 0;
  const { links, nodes } = getGraphD3FromGraph(data);
  const name = (d) => {
    return d.name;
  };
  const color = (d) => {
    return d.color === "RED" ? "rgb(222, 140, 140)" : "rgb(102, 150, 232)";
  };
  container.current.innerHTML = "";
  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3.forceLink(links).id((d) => d.name)
    )
    .force("charge", d3.forceManyBody().strength(-150))
    .force("x", d3.forceX())
    .force("y", d3.forceY());
  const svg = d3
    .select(container.current)
    .append("svg")
    .attr("viewBox", [-width / 2, -height / 2, width, height]);

  const link = svg
    .append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 1)
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-width", (d) => Math.sqrt(d.value));

  const node = svg
    .append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 2)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", 12)
    .attr("fill", color);

  const label = svg
    .append("g")
    .attr("class", "labels")
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "central")
    .text((d) => {
      return name(d);
    });

  simulation.on("tick", () => {
    //update link positions
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    // update node positions
    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

    // update label positions
    label
      .attr("x", (d) => {
        return d.x;
      })
      .attr("y", (d) => {
        return d.y;
      });
  });

  return {
    destroy: () => {
      simulation.stop();
    },
    nodes: () => {
      return svg.node();
    },
  };
}


/**
 * Adapt Graph to D3 Node/Link struct
 * @param {Graph<string>} data 
 */
function getGraphD3FromGraph(data) {
  let graph = parseBasicGraphFromGraph(data);
  const nodes = Array.from(graph.nodes); 
  return {
    nodes,
    links: graph.links.map((x) => ({
      target: x[0],
      source: x[1],
    })),
  };
}
