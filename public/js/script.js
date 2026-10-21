//form validation
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
})()


// taxSwitch button
let taxSwitch = document.getElementById("flexSwitchCheckDefault");
if(taxSwitch) {
    taxSwitch.addEventListener("click", ()=>{
        let taxInfo = document.getElementsByClassName("tax-info");
        for(info of taxInfo){
            if(info.style.display != "inline"){
                info.style.display = "inline";
            }
            else{
                info.style.display = "none";
            }
        }
    });
}

// search: reload results when the query is cleared (e.g. with the x button)
let searchInput = document.querySelector(".search-input");
if(searchInput) {
    let searchForm = searchInput.form;
    searchForm.addEventListener("submit", ()=>{
        // leave empty q out of the url
        if(searchInput.value.trim() === ""){
            searchInput.removeAttribute("name");
        }
    });
    searchInput.addEventListener("input", ()=>{
        let hasQuery = new URLSearchParams(window.location.search).has("q");
        if(searchInput.value === "" && hasQuery){
            searchForm.requestSubmit();
        }
    });
}

