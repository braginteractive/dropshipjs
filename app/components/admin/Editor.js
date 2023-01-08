import ReactQuill from "react-quill";

export default function Editor({ defaultValue, editorChange }) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  return (
    <ReactQuill
      theme="snow"
      bounds={".editor"}
      modules={modules}
      defaultValue={defaultValue}
      onChange={editorChange}
    />
  );
}
