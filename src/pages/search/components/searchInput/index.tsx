import { useEffect, useState } from "react";
import { Affix, Button, Space, Input } from "antd";

import { SearchOutlined } from "@ant-design/icons";

import logoText from "../../../../assets/image/logoText.png";

import "./index.scss";
import { useNavigate, useParams } from "react-router-dom";

export default function SearchInput() {
  let [affix, setAffix] = useState(false);

  const affixedChange = (value: any) => {
    setAffix(value);
    console.log(value);
  };

  const [searchText, setSearchText] = useState("");

  const navigate=useNavigate()
  const param=useParams()

  const toDeal=(e:any)=>{
    if(e.key==="Enter"){
      navigate("/search/"+searchText)
    }
  }

  useEffect(()=>{
    setSearchText(param.word!)
  },[])

  return (
    <div className="searchInputBox">
      <div className="inputBox">
        <img src={logoText} alt="" />
        <Space.Compact style={{ marginBottom: 20 }}>
          <Input
            value={searchText}
            onChange={(e)=>setSearchText(e.target.value!)}
            onKeyUp={(e) => toDeal(e)}
            style={{ height: 50, width: 300 }}
            placeholder="搜索关键词"
          />
          <Button
            style={{ height: 50, width: 100 }}
            icon={<SearchOutlined />}
            type="primary"
            danger
          >
            搜索
          </Button>
        </Space.Compact>
      </div>

      <Affix
        offsetTop={90}
        style={{ width: "100vw" }}
        onChange={(affixed) => affixedChange(affixed)}
      >
        {affix ? (
          <div className="affixBox">
            <Space.Compact style={{ marginTop: 20, marginBottom: 20 }}>
              <Input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ height: 40, width: 400 }}
                placeholder="搜索关键词"
              />
              <Button
                style={{ height: 40, width: 100 }}
                icon={<SearchOutlined />}
                type="primary"
                danger
              >
                搜索
              </Button>
            </Space.Compact>
          </div>
        ) : (
          <div style={{ height: 0, width: "100%" }}></div>
        )}
      </Affix>
    </div>
  );
}
