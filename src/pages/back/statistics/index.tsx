import React from "react";
import ReactECharts from "echarts-for-react";
import "./index.scss";

const Statistics = () => {
  // 1. 柱形图 - 近7天文章发布量
  const barChartOption = {
    title: {
      text: "近7天文章发布量",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    xAxis: {
      type: "category",
      data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      axisLabel: {
        interval: 0,
        rotate: 30,
      },
    },
    yAxis: {
      type: "value",
      name: "发布量(篇)",
    },
    series: [
      {
        name: "文章发布量",
        data: [12, 19, 15, 22, 18, 25, 30],
        type: "bar",
        showBackground: true,
        backgroundStyle: {
          color: "rgba(180, 180, 180, 0.2)",
        },
        itemStyle: {
          color: "#5470c6",
        },
      },
    ],
  };

  // 2. 折线图 - 近30天访问量趋势
  const lineChartOption = {
    title: {
      text: "近30天访问量趋势",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["总访问量", "独立访客"],
      bottom: 0,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: Array.from({ length: 30 }, (_, i) => `${i + 1}日`),
    },
    yAxis: {
      type: "value",
      name: "访问量(次)",
    },
    series: [
      {
        name: "总访问量",
        data: Array.from(
          { length: 30 },
          () => Math.floor(Math.random() * 1000) + 500
        ),
        type: "line",
        smooth: true,
        symbol: "none",
        lineStyle: {
          width: 3,
          color: "#91cc75",
        },
      },
      {
        name: "独立访客",
        data: Array.from(
          { length: 30 },
          () => Math.floor(Math.random() * 600) + 300
        ),
        type: "line",
        smooth: true,
        symbol: "none",
        lineStyle: {
          width: 3,
          color: "#ee6666",
        },
      },
    ],
  };

  // 3. 扇形图 - 文章分类占比
  const pieChartOption = {
    title: {
      text: "文章分类占比",
      left: "center",
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c}篇 ({d}%)",
    },
    legend: {
      orient: "vertical",
      left: "left",
      data: ["前端开发", "后端开发", "数据库", "人工智能", "其他"],
    },
    series: [
      {
        name: "文章分类",
        type: "pie",
        radius: ["30%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "18",
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: "前端开发" },
          { value: 735, name: "后端开发" },
          { value: 580, name: "数据库" },
          { value: 484, name: "人工智能" },
          { value: 300, name: "其他" },
        ],
      },
    ],
  };

  // 4. 雷达图 - 文章质量评估
  const radarChartOption = {
    title: {
      text: "文章质量评估",
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      data: ["平均质量", "优质文章"],
      bottom: 0,
    },
    radar: {
      indicator: [
        { name: "内容深度", max: 100 },
        { name: "技术价值", max: 100 },
        { name: "原创性", max: 100 },
        { name: "可读性", max: 100 },
        { name: "实用性", max: 100 },
      ],
      radius: "65%",
    },
    series: [
      {
        name: "文章质量",
        type: "radar",
        data: [
          {
            value: [75, 82, 68, 79, 85],
            name: "平均质量",
            areaStyle: {
              color: "rgba(64, 158, 255, 0.2)",
            },
            lineStyle: {
              color: "#409EFF",
            },
          },
          {
            value: [95, 88, 92, 97, 90],
            name: "优质文章",
            areaStyle: {
              color: "rgba(103, 194, 58, 0.2)",
            },
            lineStyle: {
              color: "#67C23A",
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="bigBox">
      <span className="title">数据统计情况</span>
      <div className="myChartBox">
        <div className="chart-item">
          <ReactECharts option={barChartOption} />
        </div>
        <div className="chart-item">
          <ReactECharts option={lineChartOption} />
        </div>
        <div className="chart-item">
          <ReactECharts option={pieChartOption} />
        </div>
        <div className="chart-item">
          <ReactECharts option={radarChartOption} />
        </div>
      </div>
    </div>
  );
};

export default Statistics;
