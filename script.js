var state = {
  querySet: [],
  page: 1,
  rows: 9,
  window: 5,
};

async function  fetchCountry () {
  document.getElementById("card-holder").innerHTML = '<img src="./Spinner-1s-200px.svg" id="spin" alt="">';
  document.getElementById("spin").style.display = "block";
    try {
      const response = await fetch ("https://restcountries.eu/rest/v2/all")
      const data = await response.json()
      setTimeout(() => {
        document.getElementById("spin").style.display="none";
        state.querySet = data;
        buildTable ();
      }, 1000);
    } catch(e) {
      const error = "oops,seems like there was an error, try again!";
      e = error
      alert(e)
      document.getElementById("spin").style.display="none";

      // document.getElementById("modal").style.display = "flex";
    }
}

fetchCountry();

//pagination

/*
	1 - Loop Through Array & Access each value
  2 - Create Table Rows & append to table
*/

function pagination(querySet, page, rows) {
  var trimStart = (page - 1) * rows;
  var trimEnd = trimStart + rows;

  var trimmedData = querySet.slice(trimStart, trimEnd);
  

  var pages = Math.round(querySet.length / rows);

  return {
    querySet: trimmedData,
    pages: pages,
  };
}

function pageButtons(pages) {
  var wrapper = document.getElementById("pagination-wrapper");

  wrapper.innerHTML = ``;

  var maxLeft = state.page - Math.floor(state.window / 2);
  var maxRight = state.page + Math.floor(state.window / 2);

  if (maxLeft < 1) {
    maxLeft = 1;
    maxRight = state.window;
  }

  if (maxRight > pages) {
    maxLeft = pages - (state.window - 1);

    if (maxLeft < 1) {
      maxLeft = 1;
    }
    maxRight = pages;
  }

  for (var page = maxLeft; page <= maxRight; page++) {
    if (page === state.page) {
      wrapper.innerHTML += `<button value=${page} class="page btn _inv-btn">${page}</button>`;
    } else {
      wrapper.innerHTML += `<button value=${page} class="page btn">${page}</button>`;
    }
  }

  if (state.page != 1) {
    wrapper.innerHTML = `<button value=${1} class="page btn">&#171; First</button>` + wrapper.innerHTML;
  }

  if (state.page != pages) {
    wrapper.innerHTML += `<button value=${pages} class="page btn">Last &#187;</button>`;
  }

  document.querySelectorAll(".page").forEach((item) => {
    item.addEventListener("click", (e) => {
      el("card-holder").innerHTML = "";
      state.page = Number(e.currentTarget.value);
      buildTable();
    });
  });
}

function buildTable() {
  var table = el("card-holder");
  var data = pagination(state.querySet, state.page, state.rows);
  var myList = data.querySet;

  for (var i = 1 in myList) {
    //Keep in mind we are using "Template Litterals to create rows"
    const div = document.createElement("div");

    div.className = "card";

    div.innerHTML = `
          <div class= 'img'><img src='${myList[i].flag}' class ='flag'/></div>
  
          <div class= 'text'>
<h1>${myList[i].name}</h1>
<h3>Capital: ${myList[i].capital}</h3>
<p>Region: ${myList[i].region}</p>
<p>Sub-region: ${myList[i].subregion}</p>
<p>Population: ${myList[i].population}</p>
<p>Time zone: <span>${myList[i].timezones}</span> </p>
</div>
    `;

    table.append(div);
  }

  pageButtons(data.pages);
  document.querySelector(".pagination-holder").style.visibility = "visible";
}
function el(item) {
  return document.getElementById(item);
}
