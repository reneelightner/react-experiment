import { Component, Prop, Watch, Element, h } from '@stencil/core';
import Highcharts from 'highcharts';

@Component({
  tag: 'custom-chart',
  styleUrl: 'custom-chart.css',
  shadow: true,
})
export class CustomChart {
  @Element() el: HTMLElement;

  @Prop() options: any;  // Chart options passed as a prop
  chart: Highcharts.Chart | null = null;

  // Watch for changes in options and re-render the chart
  @Watch('options')
  optionsChanged() {
    this.renderChart();
  }

  componentDidLoad() {
    // Delay rendering the chart to ensure the element is fully rendered
    setTimeout(() => {
      this.renderChart(); // Render the chart when the component is first loaded
    }, 100); // Delay by 100ms (you can adjust this delay as needed)
  }

  renderChart() {
    if (!this.options || !this.el) return;
  
    // Access the container directly
    const chartContainer = this.el.shadowRoot.querySelector('#chart-container')!;  // Non-null assertion
  
    if (!chartContainer) {
      console.error('Chart container not found!');
      return;
    }
  
    // Initialize or update the chart
    if (this.chart) {
      this.chart.destroy();  // Destroy the existing chart if any
    }
  
    try {
      // Render the new chart
      this.chart = Highcharts.chart(chartContainer as HTMLElement, this.options);  // Cast to HTMLElement
    } catch (error) {
      console.error('Error rendering chart:', error);
    }
  }
  
  render() {
    return (
      <div id="chart-container" style={{ height: '400px', width: '100%' }}></div>  
    )
  }
}
