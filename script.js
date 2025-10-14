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