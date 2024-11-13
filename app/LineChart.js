import React from "react";
import { Chart } from "react-google-charts";

const options = {
    title: "Line Chart Example",
    hAxis: {
        title: "Date",
        format: "dd MMM"
    },
    vAxis: { title: "News Count" },
    legend: "none",
};

function LineChart({ data }) {
    return (
        <Chart
            chartType="LineChart"
            width="100%"
            height="100%"
            data={data}
            options={options}
        />
    );
}

export default LineChart;
