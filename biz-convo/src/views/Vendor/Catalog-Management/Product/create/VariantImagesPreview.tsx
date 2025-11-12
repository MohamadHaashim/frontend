import React, { useMemo } from "react";

interface Variant {
  variant_id: number;
  retailer_id: string;
  item_group_id: string;
  title: string;
  currency: string;
  price: string;
  sale_price: string;
  sale_price_enabled?: boolean;
  availability: boolean;
  description: string;
  brand: string;
  condition: string;
  url: string;
  category: string;
  catalog_id: string;
  status: boolean;
  content_id: string;
  images: File[];
  product_id?: string;
}

interface Props {
  variant: Variant;
}

const VariantImagesPreview: React.FC<Props> = ({ variant }) => {
  // Memoize generated preview URLs for the images
  const imagesPreview = useMemo(() => {
    return variant.images.slice(0, 4).map((file, idx) => {
      const url = URL.createObjectURL(file);
      const isImage = file.type.includes("image");

      const style: React.CSSProperties = {
        position: "absolute",
        left: `${idx * 18}px`,
        // top: `${Math.min(idx, 3) * 5}px`,
        top:0,
        zIndex: variant.images.length - idx,
        background: "#fff",
        width: "40px",
        height: "40px",
        marginLeft: "2px",
        objectFit: "cover",
        borderRadius: "4px",
        border: "1px solid #ccc",
        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        transition: "transform 0.2s ease, z-index 0.2s ease",
        cursor: "pointer",
      };

      const onMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
        e.currentTarget.style.transform = "scale(1.1)";
        e.currentTarget.style.zIndex = "999";
      };

      const onMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.zIndex = (variant.images.length - idx).toString();
      };

      return isImage ? (
        <img
          key={idx}
          src={url}
          alt={`preview-${idx}`}
          style={style}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
      ) : (
        <video
          key={idx}
          src={url}
          style={style}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          muted
          loop
          playsInline
        />
      );
    });
  }, [variant.images]);

  if (variant.images.length === 0) return null;

  return (
    <div className="d-flex align-items-center justify-content-center" 
      style={{
        position: "relative",
        width: "100%",
        height: "40px",
     
      }}
    >
      {imagesPreview}
      {variant.images.length > 4 && (
        <div
          style={{
            position: "absolute",
            left: `${4 * 22}px`,
            top: "0",
            zIndex: 0,
            width: "40px",
            height: "40px",
            borderRadius: "4px",
            background: "#eee",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "14px",
            border: "1px solid #ccc",
            boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
          }}
        >
          +{variant.images.length - 4}
        </div>
      )}
    </div>
  );
};

export default React.memo(VariantImagesPreview);
