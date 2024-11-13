import React from "react";
import { Chart } from "react-google-charts";

const options = {
    hAxis: {
        title: "Date",
        format: "dd MMM"
    },
    vAxis: {
        title: "News Count",
    },
    legend: "none",
    chartArea: {
        left: 100,
        top: 10,
        width: "90%",
        height: "80%"
    }
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
