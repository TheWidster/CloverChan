const form = document.getElementById("postForm");
const postsDiv = document.getElementById("posts");

let posts = JSON.parse(localStorage.getItem("cloverchan_posts")) || [];
renderPosts();

// Form submission handler
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim() || "Anon";
  const message = document.getElementById("message").value.trim();
  const imageInput = document.getElementById("image");
  const imageFile = imageInput.files[0];

  if (!message && !imageFile) {
    alert("Say something or post a pic, coward.");
    return;
  }

  let imageUrl = "";
  if (imageFile) {
    imageUrl = await uploadToCatbox(imageFile);
    if (!imageUrl) {
      alert("Image upload failed.");
      return;
    }
  }

  const post = { name, message, image: imageUrl };
  posts.push(post);
  localStorage.setItem("cloverchan_posts", JSON.stringify(posts));
  renderPost(post);
  form.reset();
});

// Upload to Catbox
async function uploadToCatbox(file) {
  const formData = new FormData();
  formData.append("reqtype", "fileupload");
  formData.append("fileToUpload", file);

  try {
    const response = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      console.error("Failed to upload image:", response.statusText);
      return "";
    }

    const url = await response.text();
    if (!url.startsWith("https://")) {
      console.error("Catbox gave a weird response:", url);
      return "";
    }

    console.log("Uploaded image to:", url);
    return url;
  } catch (err) {
    console.error("Upload error:", err);
    return "";
  }
}

// Render all saved posts
function renderPosts() {
  postsDiv.innerHTML = "";
  posts.forEach(renderPost);
}

// Render a single post
function renderPost(post) {
  const div = document.createElement("div");
  div.innerHTML = `
    <p><strong>${post.name}</strong></p>
    ${post.image ? `<img src="${post.image}" alt="image">` : ""}
    <p>${post.message}</p>
    <hr>
  `;
  postsDiv.appendChild(div);
}
