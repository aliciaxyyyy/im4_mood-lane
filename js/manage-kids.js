// manage-kids.js - JavaScript code for the manage-kids.html page of the Mood Lane application. This script handles the loading of existing children, adding new children, and deleting children from the list. It interacts with the backend API to fetch, add, and delete child records, updating the UI accordingly.

// load kids
fetch("api/get-kids.php")
    .then(response => response.json())
    .then(data => {
        let list = document.getElementById("kids-list")
        console.log(data);

        data.kids.forEach((element, index) => {
          let childDiv = document.createElement("div");
          childDiv.className = "child-entry";
          childDiv.innerHTML = `<p class="child-name">${element.name}</p><p>Chip ID: <br/>${element.chip_id}</p><button class="delete-button" data-id="${element.id}">Delete</button>`;
          list.appendChild(childDiv);
        });
    }) 
    .catch(error => {
        console.error("Error during unload:", error);
    });


document
  .getElementById("addChildForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const chip_id = document.getElementById("chipId").value.trim();

    try {
      const response = await fetch("api/add-child.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, chip_id }),
      });
      const result = await response.json();

      if (result.status === "success") {
        window.location.reload(); // Reload the page to show the new child in the list
      } else {
        alert(result.message || "Failed to add child.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  });


    // .then(response => response.json())
    // .then(data => {
    //     let table = document.getElementById("output-records")

    //     data.forEach((element, index) => {
    //         let row = table.insertRow();
    //         let cell1 = row.insertCell(0);
    //         let cell2 = row.insertCell(1);
    //         let cell3 = row.insertCell(2);
    //         let cell4 = row.insertCell(3);
    //         cell1.innerHTML = index + 1 + ".";
    //         cell2.innerHTML = element.verkehrsmittel;
    //         cell3.innerHTML = element.verspaetungen;
    //         cell4.innerHTML = new Date(element.datum).toLocaleDateString();
    //         cell1.className = "rank";
    //     });
    // }) 
    // .catch(error => {
    //     console.error("Error during unload:", error);
    // });

// delete child
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-button")) {
    const id = e.target.getAttribute("data-id");
    try {
      const response = await fetch(`api/delete-child.php?id=${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.status === "success") {
        window.location.reload(); // Reload the page to update the list
      } else {
        alert(result.message || "Failed to delete child.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  }

  // selection is handled on the Overview page (index.html)
});