import "./index.scss";

import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Image, message, Upload } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { addCarouselAPI, deleteCarouselAPI, getCarouselAPI } from "../../../apis/carousel";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export default function HomeImage() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const addCarousel=async (url:string)=>{
    console.log(url)
    const res = await addCarouselAPI(url);

    if(res.data.code===200){
      setImageFlag(imageFlag + 1);
    }
    else {
      message.error("上传出错")
    }
  }

  const handleChange: UploadProps["onChange"] = ({
    file,
    fileList: newFileList,
  }) => {
    setFileList(newFileList)
    if (file.status === "done") {

      addCarousel(file.response.data)
    }
  };

  const deleteCarousel=async(id:number)=>{
    const res= await deleteCarouselAPI(id);

    if(res.data.code===200){
      message.success("删除成功")
    }
    else {
      message.error("操作失败")
    }
  }

  const handleRemove:UploadProps['onRemove']=((file)=>{
    console.log(file)
    deleteCarousel(parseInt(file.uid))
  })

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const [imageFlag, setImageFlag] = useState(0);

  useEffect(() => {
    const getImage = async () => {
      const res = await getCarouselAPI();

      if (res.data.code === 200) {
        setFileList(
          res.data.data.map((item: any) => {
            return {
              uid: item.id,
              name: item.id + ".png",
              status: "done",
              url: item.url,
            };
          })
        );
      } else {
        message.error("出错啦");
      }
    };

    getImage();
  }, [imageFlag]);

  return (
    <div className="myHomeImageBox">
      <Upload
        action="http://localhost:8080/api/upload"
        listType="picture-card"
        name="file"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        onRemove={handleRemove}
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </div>
  );
}
