const form = document.getElementById("postForm");
const postsDiv = document.getElementById("posts");

let posts = JSON.parse(localStorage.getItem("cloverchan_posts")) || [];
renderPosts();

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim() || "Anon";
  const message = document.getElementById("message").value.trim();
  const imageFile = document.getElementById("image").files[0];

  if (!message && !imageFile) {
    alert("Say something or post a pic, coward.");
    return;
  }

  let imageUrl = "";
  if (imageFile) {
    imageUrl = await uploadTo0x0st(imageFile);
    if (!imageUrl) {
      alert("Image upload failed. Check console.");
      return;
    }
  }

  const post = { name, message, image: imageUrl };
  posts.push(post);
  localStorage.setItem("cloverchan_posts", JSON.stringify(posts));
  renderPost(post);
  form.reset();
});

async function uploadTo0x0st(file) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("https://0x0.st", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      console.error("Upload failed with status:", response.status);
      return "";
    }

    const url = (await response.text()).trim();
    console.log("0x0.st upload URL:", url);

    if (!url.startsWith("https://")) {
      console.error("Invalid upload URL:", url);
      return "";
    }

    return url;
  } catch (error) {
    console.error("Upload error:", error);
    return "";
  }
}

function renderPosts() {
  postsDiv.innerHTML = "";
  posts.forEach(renderPost);
}

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
