import "./index.scss";
import ColumnArticle from "../../../content/column";
import { useEffect, useState } from "react";
import { getAllColumnsAPI } from "../../../../apis/column";
import { message } from "antd";
import { Column } from "../../../../types";

export default function ColumnContent(props:{
  id:number|null
}) {
  const [columnsList,setColumnList] = useState<Column[]>([])

  useEffect(()=>{
    const getColumns=async()=>{
      const res = await getAllColumnsAPI(props.id!);
      if(res.data.code===200){
        setColumnList(res.data.data)
      }
      else message.error(res.data.msg)
    }

    getColumns()
  },[props.id])

  return (
    <div className="myArticleContentColumnBox">
      {columnsList.map((item) => {
        return <ColumnArticle key={item.id} column={item}></ColumnArticle>;
      })}
    </div>
  );
}
