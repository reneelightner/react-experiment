import Highcharts from 'highcharts';
export declare class CustomChart {
    el: HTMLElement;
    options: any;
    chart: Highcharts.Chart | null;
    optionsChanged(): void;
    componentDidLoad(): void;
    renderChart(): void;
    render(): any;
}
