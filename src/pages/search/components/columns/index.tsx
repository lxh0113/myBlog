import { useNavigate } from "react-router-dom";
import "./index.scss";
import { Collapse } from "antd";
import { SearchColumn } from "../../../../types";
export default function SearchColumns(props: { column: SearchColumn }) {
  console.log(props.column);

  const navigate = useNavigate();

  const toArticle = (id: number) => {
    navigate("/article/" + id);
  };

  return (
    <div className="searchColumnsBox">
      <div className="userInfo">
        <img src={props.column.user?.avatar!} alt="" />
        <h2 style={{ marginLeft: 20 }}>{props.column.user?.username}</h2>
      </div>
      <>
        <div>
          <Collapse
            items={[
              {
                key: props.column.column?.id!,
                label: props.column.column?.name,
                children: (
                  <div style={{ cursor: "pointer" }}>
                    {props.column.articles?.map(
                      (article: any, articleIndex: number) => {
                        return (
                          <p
                            className="searchColumnArticleTitle"
                            onClick={() => toArticle(article.id)}
                            key={articleIndex}
                          >
                            {article.title}
                          </p>
                        );
                      }
                    )}
                  </div>
                ),
              },
            ]}
          />
        </div>
      </>
    </div>
  );
}
