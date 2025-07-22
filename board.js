const form = document.getElementById("postForm");
const postsDiv = document.getElementById("posts");

let posts = JSON.parse(localStorage.getItem("cloverchan_posts")) || [];
renderPosts();

// Handle submission
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value || "Anon";
  const message = document.getElementById("message").value.trim();
  const imageFile = document.getElementById("image").files[0];

  if (!message && !imageFile) return alert("Post something, you creep.");

  let imageUrl = "";
  if (imageFile) {
    imageUrl = await uploadToCatbox(imageFile);
  }

  const post = { name, message, image: imageUrl };
  posts.push(post);
  localStorage.setItem("cloverchan_posts", JSON.stringify(posts));
  renderPost(post);
  form.reset();
});

async function uploadToCatbox(file) {
  const formData = new FormData();
  formData.append("reqtype", "fileupload");
  formData.append("fileToUpload", file);

  const response = await fetch("https://catbox.moe/user/api.php", {
    method: "POST",
    body: formData,
  });

  return await response.text();
}

function renderPosts() {
  postsDiv.innerHTML = "";
  posts.forEach(renderPost);
}

function renderPost(post) {
  const div = document.createElement("div");
  div.innerHTML = `
    <p><strong>${post.name}</strong></p>
    ${post.image ? `<img src="${post.image}">` : ""}
    <p>${post.message}</p>
    <hr>
  `;
  postsDiv.appendChild(div);
}

console.log("Catbox returned URL:", url);

}
