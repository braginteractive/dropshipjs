export default function checkImgURL(url) {
  return url?.match(/\.(jpeg|jpg|gif|png)$/) != null;
}
