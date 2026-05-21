
// load emotions
fetch("api/get-entries.php?chip_id=" + "04:E3:9E:20:21:02:89")
    .then(response => response.json())
    .then(data => {

       console.log(data);
       
    }) 
    .catch(error => {
        console.error("Error during unload:", error);
    });
