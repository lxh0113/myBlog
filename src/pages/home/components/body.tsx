import { useEffect, useState } from "react";
import { Affix, Button, Space, Input } from "antd";
import { Carousel } from "antd";

import { SearchOutlined } from "@ant-design/icons";

import "./css/body.scss";
import logoText from "../../../assets/image/logoText.png";

import { useNavigate } from "react-router-dom";
import { getCarouselAPI } from "../../../apis/carousel";

export default function Body() {
  let [affix, setAffix] = useState(false);

  const affixedChange = (value: any) => {
    setAffix(value);
    console.log(value);
  };

  interface sliderItem{
    id:number;
    url:string;
  }

  const [sliderImage, setSliderImage] = useState<Array<sliderItem>>([]);

  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");

  const toSearch = (e?: any) => {
    if (e.key === "Enter") {
      navigate("/search/" + searchText);
    } else return;
  };

  useEffect(() => {
    const getCarousels = async () => {
      const res = await getCarouselAPI();

      if (res.data.code === 200) {
        setSliderImage(res.data.data);
      }
    };

    getCarousels();
  },[]);

  return (
    <div className="homeBodyBox">
      <div className="inputBox">
        <img src={logoText} alt="" />
        <Space.Compact style={{ marginBottom: 20 }}>
          <Input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyUp={(e) => toSearch(e)}
            style={{ height: 50, width: 300 }}
            placeholder="搜索关键词"
          />
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
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyUp={(e) => toSearch(e)}
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
          {sliderImage.map((item, index) => {
            return (
              <div key={index} className="sliderItem">
                <img src={item.url} alt="" />
              </div>
            );
          })}
        </Carousel>
      </div>
    </div>
  );
}
