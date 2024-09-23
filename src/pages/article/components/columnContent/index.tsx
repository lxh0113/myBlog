import "./index.scss";
import Column from "../../../content/column";

export default function ColumnContent() {
  const columnsList = [
    {
      id: 1,
      name: "12",
      userId: 2,
    },
    {
      id: 2,
      name: "fff",
      userId: 2,
    },
    {
      id: 3,
      name: "vv",
      userId: 2,
    },
  ];

  return (
    <div className="myArticleContentColumnBox">
      {columnsList.map((item) => {
        return <Column key={item.id} column={item}></Column>;
      })}
    </div>
  );
}
