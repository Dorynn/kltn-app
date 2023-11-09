import React from 'react';
import Chart from 'react-apexcharts';

export function ApexChart(props) {
    const { options, series } = props;
    return (
        <div id="chart">
            <Chart
                options={options}
                series={series}
                type="line"
                height={350}
            />
        </div>
    );

}

export default ApexChart;