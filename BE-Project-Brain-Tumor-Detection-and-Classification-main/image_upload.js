const image_input = document.querySelector("#image_input");
const display_image = document.querySelector("#display-image");
const predictions = document.querySelector("#predictions");
const table = document.querySelector(".table");
const td_glioma = document.querySelector(".glioma");
const td_meningioma = document.querySelector(".meningioma");
const td_no_tumor = document.querySelector(".no_tumor");
const td_pituitary = document.querySelector(".pituitary");
// predictions.style.display = "none";
predictions.innerHTML = "No image provided yet!";
table.classList.add("d-none");
image_input.addEventListener("change", (event) => {
  // console.log("Files: ", event.target.files.length);
  if (event.target.files.length) {
    td_glioma.innerHTML = "";
    td_meningioma.innerHTML = "";
    td_no_tumor.innerHTML = "";
    td_pituitary.innerHTML = "";
    td_glioma.className = "";
    td_meningioma.className = "";
    td_no_tumor.className = "";
    td_pituitary.className = "";
    let base64Image;
    let reader = new FileReader();
    reader.onload = function (e) {
      let dataURL = reader.result;
      image_input.disabled = true;
      predictions.innerHTML = "Please wait! Your image is processing...";
      display_image.src = URL.createObjectURL(event.target.files[0]);
      // console.log("dataURL: ", dataURL);
      base64Image = dataURL.replace(/^data:image\/[a-z]+;base64,/, "");
      // console.log("base64Image: ", base64Image);
      let data = {
        image: base64Image,
      };
      // console.log("data: ", data);

      axios
        .post(url, JSON.stringify(data), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then(function (response) {
          // console.log(response);
          // predictions.style.display = "block";
          predictions.innerHTML = "";
          table.classList.remove("d-none");
          let obj = { ...response.data.prediction };
          const maxKey = Object.keys(obj).reduce((a, b) =>
            obj[a] > obj[b] ? a : b
          );
          delete obj[maxKey];
          const secondMax = Object.keys(obj).reduce((a, b) =>
            obj[a] > obj[b] ? a : b
          );
          // console.log(maxKey, secondMax);
          const left_span = document.createElement("span");
          const right_span = document.createElement("span");
          left_span.style.float = "left";
          right_span.style.float = "right";
          left_span.innerText = `Image Shape: (${response.data.shape})`;
          right_span.innerText = `Image Mode: ${response.data.mode}`;
          predictions.appendChild(left_span);
          predictions.appendChild(right_span);
          predictions.classList.add("pb-5");
          td_glioma.innerHTML =
            (response.data.prediction.glioma * 100).toFixed(2) + "%";
          td_meningioma.innerHTML =
            (response.data.prediction.meningioma * 100).toFixed(2) + "%";
          td_no_tumor.innerHTML =
            (response.data.prediction.no_tumor * 100).toFixed(2) + "%";
          td_pituitary.innerHTML =
            (response.data.prediction.pituitary * 100).toFixed(2) + "%";
          if (maxKey === "glioma" && response.data.prediction[maxKey] !== 0) {
            td_glioma.className = "table-primary";
          } else if (
            maxKey === "meningioma" &&
            response.data.prediction[maxKey] !== 0
          ) {
            td_meningioma.className = "table-primary";
          } else if (
            maxKey === "no_tumor" &&
            response.data.prediction[maxKey] !== 0
          ) {
            td_no_tumor.className = "table-primary";
          } else if (
            maxKey === "pituitary" &&
            response.data.prediction[maxKey] !== 0
          ) {
            td_pituitary.className = "table-primary";
          }
          if (
            secondMax === "glioma" &&
            response.data.prediction[secondMax] !== 0
          ) {
            td_glioma.className = "table-secondary";
          } else if (
            secondMax === "meningioma" &&
            response.data.prediction[secondMax] !== 0
          ) {
            td_meningioma.className = "table-secondary";
          } else if (
            secondMax === "no_tumor" &&
            response.data.prediction[secondMax] !== 0
          ) {
            td_no_tumor.className = "table-secondary";
          } else if (
            secondMax === "pituitary" &&
            response.data.prediction[secondMax] !== 0
          ) {
            td_pituitary.className = "table-secondary";
          }
          image_input.disabled = false;
        })
        .catch(function (error) {
          // predictions.style.display = "block";
          predictions.classList.remove("pb-5");
          table.classList.add("d-none");
          predictions.innerHTML = "Error occured please try again!";
          image_input.disabled = false;
        });
    };
    reader.readAsDataURL(event.target.files[0]);

    // const url = "http://127.0.0.1:5000/predict";
    const url = "https://brain-tumor-model-api.herokuapp.com/predict";
    // predictions.style.display = "none";
    // const url = "http://localhost:8000/api/";
    // const url = "https://whispering-earth-53299.herokuapp.com/api/";
    // const data = new FormData();
    // data.append("id", "3");
    // data.append("name", "ImageZ");
    // data.append("image", event.target.files[0]);
  }
});
