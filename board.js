async function uploadImage(file) {
  const formData = new FormData();
  formData.append("reqtype", "fileupload");
  formData.append("fileToUpload", file);

  const res = await fetch("https://catbox.moe/user/api.php", {
    method: "POST",
    body: formData,
  });

  const url = await res.text();
  return url;
}
