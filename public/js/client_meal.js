const randomForm = document.querySelector("#random_form");
const searchForm = document.querySelector("#search_form");
const searchInput = document.querySelector("#search_input");

randomForm.addEventListener("submit", randomData);
//searchForm.addEventListener("submit", mealData);

function randomData(e) {
  e.preventDefault();

  getApi();
}

const getApi = async () => {
  let res = await fetch("http://localhost:5000/find");
  let data = await res.json();
  console.log(data);
};
