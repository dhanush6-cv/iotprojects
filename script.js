function searchProjects() {
  let input = document.getElementById("searchInput").value.toLowerCase();
  let projects = document.getElementsByClassName("project-item");

  for (let i = 0; i < projects.length; i++) {
    let title = projects[i].getElementsByTagName("h3")[0].innerText.toLowerCase();
    if (title.includes(input)) {
      projects[i].style.display = "";
    } else {
      projects[i].style.display = "none";
    }
  }
}
  function triggerUpload() {
    document.getElementById('fileInput').click();
  }

  function previewProfile(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        document.getElementById('profilePic').src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }