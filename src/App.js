import React, { Component } from "react";
import "./App.css";
import * as d3 from "d3";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = { wordFrequency: [] };
    this.svgRef = React.createRef();
  }
  componentDidUpdate() {
    this.renderChart();
  }
  getWordFrequency = (text) => {
    const stopWords = new Set([
      "the", "and", "a", "an", "in", "on", "at", "for", "with", "about", "as", "by", "to", "of", "from", "that",
      "which", "who", "whom", "this", "these", "those", "it", "its", "they", "their", "them", "we", "our", "ours",
      "you", "your", "he", "him", "his", "she", "her", "hers", "was", "were", "is", "am", "are", "be", "been", "being",
      "have", "has", "had", "doing", "if", "each", "how", "with", "by", "about", "against"
    ]);
    const words = text.toLowerCase().replace(/[.,/#!$%^&*;:{}=_`~()]/g, "").split(" ");
    const filteredWords = words.filter(word => !stopWords.has(word));
    return Object.entries(
      filteredWords.reduce((freq, word) => {
        freq[word] = (freq[word] || 0) + 1;
        return freq;
      }, {})
    );
  }
  renderChart = () => {
    const { wordFrequency } = this.state;
    const topWords = wordFrequency.sort((a, b) => b[1] - a[1]).slice(0, 5);
    const svg = d3.select(this.svgRef.current);
    const width = 900;
    const height = 300;
    svg.attr("width", width).attr("height", height);
    const fontSizeScale = d3.scaleLinear()
      .domain([topWords[topWords.length - 1][1], topWords[0][1]])
      .range([15, 65]);
    let xPosition = 80;
    const padding = 80;
    const words = svg.selectAll("text")
      .data(topWords, d => d[0]);
    words.join(
      enter => enter.append("text")
        .attr("x", xPosition)
        .attr("y", height / 2)
        .attr("font-size", 0)
        .attr("fill", "black")
        .text(d => d[0])
        .call(enter => enter.transition()
          .duration(1000)
          .attr("font-size", d => fontSizeScale(d[1]))
          .attr("x", (d) => {
            const currentX = xPosition;
            xPosition += fontSizeScale(d[1]) * 2 + padding;
            return currentX;
          })
        ),

      update => update
        .call(update => update.transition()
          .duration(1000)
          .attr("font-size", d => fontSizeScale(d[1]))
          .attr("x", (d) => {
            const currentX = xPosition;
            xPosition += fontSizeScale(d[1]) * 2 + padding;
            return currentX;
          })
        ),
      exit => exit
        .transition()
        .duration(500)
        .attr("font-size", 0)
        .remove()
    );
  };
  handleGenerate = () => {
    const inputText = document.getElementById("input_field").value;
    const wordFrequency = this.getWordFrequency(inputText);
    this.setState({ wordFrequency }, () => {
      this.renderChart();
    });
  }

  render() {
    return (
      <div className="parent">
        <div className="child1" style={{ width: 1000 }}>
          <textarea
            id="input_field"
            style={{ height: 150, width: 1000 }}
            placeholder="Enter your text here..."
          />
          <button
            style={{ marginTop: 10, height: 40, width: 1000 }}
            onClick={this.handleGenerate}
          >
            Generate WordCloud
          </button>
        </div>
        <div className="child2">
          <svg ref={this.svgRef} className="svg_parent"></svg>
        </div>
      </div>
    );
  }
}

export default App;
