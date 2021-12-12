//===== Exibir os Posts na Tela =====

//Referência o elemento html
const postsContainer = document.querySelector("#posts-container");
const loaderContainer = document.querySelector(".loader");
const filterInput = document.querySelector("#filter");

let page = 1;

const getPosts = async () => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=5&_page=${page}`
  );
  //Retorna Meu Request e o Transforma em um objeto JSON
  return response.json();
};

const addPostsIntoDOM = async () => {
  const posts = await getPosts();
  const postsTemplate = posts
    .map(
      //Destructuring no objeto (item)
      ({ id, title, body }) =>
        `<div class="post">
        <div class="number">${id}</div>
        <div class="post-info">
        <h2 class="post-title">${title}</h2>
        <p class="post-body">${body}</p>
        </div>
     </div>`
    )
    .join("");

  postsContainer.innerHTML += postsTemplate;
};

addPostsIntoDOM();
//===== Request dos Próximos Posts =====

const getNextPosts = () => {
  setTimeout(() => {
    // Atualiza o número da página
    page++;
    addPostsIntoDOM();
  }, 300);
};

//Função para remover o loader após 1sec
const removeLoader = () => {
  setTimeout(() => {
    loaderContainer.classList.remove("show");
    getNextPosts();
  }, 1000);
};

//Adiciona a classe .show ao loader
const showLoader = () => {
  loaderContainer.classList.add("show");
  //Chama a função removerLoader ^
  removeLoader();
};
const handleScrollToPageBottom = () => {
  const { clientHeight, scrollHeight, scrollTop } = document.documentElement;
  //Avisa quando faltar 10px para chegar ao fim da página
  const isPageBottomAlmostReached =
    scrollTop + clientHeight >= scrollHeight - 10;

  //Se entrar na condição chama a função showLoader() ^
  if (isPageBottomAlmostReached) {
    showLoader();
  }
};

const showPostIfMatchInputValue = (inputValue) => (post) => {
  const postTitle = post.querySelector(".post-title").textContent.toLowerCase();
  const postBody = post.querySelector(".post-body").textContent.toLowerCase();
  const postContainsInputValue =
    postTitle.includes(inputValue) || postBody.includes(inputValue);
  if (postContainsInputValue) {
    post.style.display = "flex";
    return;
  }

  post.style.display = "none";
};

const handleInputValue = (event) => {
  //Captura o value dos caracteres digitados
  const inputValue = event.target.value.toLowerCase();
  const posts = document.querySelectorAll(".post");

  //Obtém o conteúdo dos
  posts.forEach(showPostIfMatchInputValue(inputValue));
};

//Captura evento scroll na página
window.addEventListener("scroll", handleScrollToPageBottom);

filterInput.addEventListener("input", handleInputValue);
