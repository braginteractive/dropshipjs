import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage, AdvancedVideo } from "@cloudinary/react";
import { useMatches } from "@remix-run/react";

export default function CloudMedia({ id, video = false, ...props }) {
  const match = useMatches();
  const cloudName = match[0].data.env.CLOUDINARY_CLOUDNAME;

  //console.log(props.video);
  const cloudinary = new Cloudinary({
    cloud: { cloudName },
  });

  return (
    <>
      {id.startsWith("http") ? (
        <img src={id} alt={props.alt} {...props} />
      ) : video ? (
        <AdvancedVideo cldVid={cloudinary.video(id)} {...props} controls />
      ) : (
        <AdvancedImage cldImg={cloudinary.image(id)} {...props} />
      )}
    </>
  );
}
