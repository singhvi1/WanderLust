// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }
  
          form.classList.add('was-validated')
        }, false)
      })
  })()




  //<!-- auto size of description -->
  // document.addEventListener("DOMContentLoaded", function () {
  //     const textarea = document.getElementById("description");

  //     function autoResize() {
  //         textarea.style.height = "auto"; // Reset height
  //         textarea.style.overflow = "hidden"; // Hide scrollbar
  //         textarea.style.height = textarea.scrollHeight + "px"; // Expand height
  //     }

  //     textarea.addEventListener("input", autoResize);
  //     autoResize(); // Adjust height on page load
  // });