import { useNavigate } from "react-router-dom";
import "./index.scss";
import { Collapse, Divider } from "antd";

export default function SearchColumns(props: any) {

    console.log(props.column)

    const columnsList:{
        name:string;
        articles:[]
    }[]=props.column.columnsList

    console.log(columnsList)

    const navigate=useNavigate()

    const toArticle=(id:number)=>{
        navigate('/article/'+id)   
    }
 
  return (
    <div className="searchColumnsBox">
      <div className="userInfo">
        <img src={props.column.user.avatar} alt="" />
        <h2 style={{ marginLeft: 20 }}>{props.column.user.name}</h2>
      </div>
     <>
     
     { props.column.columnsList.map((item:any, index:number) => {
        return (
          <div key={index}>
            <Collapse
                  items={[
                    {
                      key: {index}+'',
                      label: item.name,
                      children: (
                        <div style={{cursor:'pointer'}}>
                            {
                                item.articles.map((article:any,articleIndex:number) => {
                                    return (<p className="searchColumnArticleTitle" onClick={()=>toArticle(article.id)} key={articleIndex}>{article.title}</p>)
                                })
                            }
                        </div>
                      ),
                    },
                  ]}
                />
          </div>
        );
      })}
     </>
    </div>
  );
}
