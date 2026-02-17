const leaderBoardContainer = document.querySelector("#leader-board-container");
const API_URL = "http://127.0.0.1:3000";

window.onload = async () => {
  try {
    const response = await fetch(`${API_URL}/getuserscores`);
    const data = await response.json();
    createElements(data);
  } catch (error) {
    console.error(error);
  }
};

function createElements(data) {
  let arr = data.sort((a, b) => a.score - b.score);

  arr.forEach((element,index) => {
    if (element.score !== 0)
      leaderBoardContainer.innerHTML += `
          <div class="user-ranking">
        <div class="user-logo">${index + 1}</div>
        <p class="user-name">${element.username}</p>
        <p class="user-score">${element.score} ms</p>
      </div>
        
        `;
  });

}
