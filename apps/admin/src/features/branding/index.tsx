import { useState } from "react";
import ContentArea from "./components/content-area/content-area";
import { ContentsLayout } from "@/compos/layout";

const Branding = () => {
  const [isCancel, setIsCancel] = useState(false);

    const handleApplyButton = () => {
      console.log('apply button clicked');
    };

    const handleCancelButton = () => {
      setIsCancel(true);
    };

  return (
    <ContentsLayout
        title={<>Branding</>}
        titleRightSide={<></>}
    >
        <ContentArea isCancel={isCancel} onChangeCancel={setIsCancel}/>
    </ContentsLayout>
);
}

export default Branding;