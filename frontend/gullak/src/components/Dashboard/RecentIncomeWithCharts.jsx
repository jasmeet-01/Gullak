import React, { useEffect, useState } from 'react'
import CustomPieChart from '../Charts/CustomPieChart';

const COLORS= ["#20815cff", "#FA2C32","#FF6900","#4f39f6"]

const RecentIncomeWithCharts = ({data, totalIncome}) => {

    const  [chartData, setChartData] =useState([]);

    const prepareCharData=() =>{
        const dataArr= data?.map((item) => ({
            name: item?.source,
            amount: item?.amount,
        }));

        setChartData(dataArr);
    };

    useEffect(() =>{
        prepareCharData();

        return () => {};
    }, [data]);
  return (
    <div className="card">
        <div className="flex items-center justify-between">
            <h5 className="text-lg">Last 60 days Income</h5>
        </div>
        <CustomPieChart
            data={chartData}
            label="Total Income"
            totalAmount={`$${totalIncome}`}
            showTextAnchor
            colors={COLORS}
        />
    </div>

    
  )
}

export default RecentIncomeWithCharts