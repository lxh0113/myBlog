import { useState } from "react";
import { Affix, Button, Space, Input } from "antd";
import { Carousel } from "antd";

import { SearchOutlined } from "@ant-design/icons";

import "./css/body.scss";
import logoText from "../../../assets/image/logoText.png";

import slider1 from "../../../assets/slider/1.gif"
import slider2 from "../../../assets/slider/2.gif"
import slider3 from "../../../assets/slider/3.gif"
import slider4 from "../../../assets/slider/4.gif"
import { useNavigate } from "react-router-dom";

export default function Body() {
  let [affix, setAffix] = useState(false);

  const affixedChange = (value: any) => {
    setAffix(value);
    console.log(value);
  };

  const sliderImage=[
   slider1,
   slider2,
   slider3,
   slider4,
  ]

  const navigate=useNavigate()
  const [searchText,setSearchText]=useState('')

  const toSearch=(e?:any)=>{
    if(e.key==='Enter')
    {
      navigate('/search/'+searchText)
    }
    else return
  }

  return (
    <div className="homeBodyBox">
      <div className="inputBox">
        <img src={logoText} alt="" />
        <Space.Compact style={{ marginBottom: 20 }}>
          <Input value={searchText} onChange={(e)=>setSearchText(e.target.value)} onKeyUp={(e)=>toSearch(e)} style={{ height: 50, width: 300 }} placeholder="搜索关键词" />
          <Button
            style={{ height: 50, width: 100 }}
            icon={<SearchOutlined />}
            type="primary"
            onClick={toSearch}
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
              value={searchText} onChange={(e)=>setSearchText(e.target.value)}
                onKeyUp={(e)=>toSearch(e)}
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

      <div className="sliderBox">
        <Carousel autoplay>
          { sliderImage.map((item,index)=>{
            return (
              <div key={index} className="sliderItem">
                <img src={item} alt="" />
              </div>
            )
          }) }
        </Carousel>
      </div>
    </div>
  );
}
