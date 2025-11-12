import React, { useState } from "react";
import ImageContainer from "./GalleryImage";
import { UserAvatar, Icon, Button } from "../../Component";
import { findUpper } from "../../../utils/Utils";
import { Card } from "reactstrap";

const GalleryCard = ({ img, asin, score, userImg, productName, heartCount, className }) => {
  const [heart, setHeart] = useState(false);
  const onHeartClick = () => {
    setHeart(!heart);
  };

  

  return (
    <Card className="card-bordered gallery">
      <ImageContainer img={img} />
      <div className="gallery-body card-inner align-center justify-between flex-wrap g-2">
        <div className="user-card w-full">
          <div className="user-info w-full">
            <span className="lead-text">{asin}</span>
            <span className="sub-text">{productName}</span>
            <span className="lead-text !justify-end"><span className="!text-thin !text-xs mr-1">SCORE</span>{score}%</span>
          </div>
        </div>

      </div>
    </Card>
  );
};

export default GalleryCard;
