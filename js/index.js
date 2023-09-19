let root = document.querySelector(":root");
let body = document.body;
let modal = document.getElementById("modal");
let newTask = document.getElementById("newTask");
let addBtn = document.getElementById("addBtn");
let searchInput = document.getElementById('searchInput');
let gridBtn = document.getElementById("gridBtn")
let barsBtn = document.getElementById("barsBtn");
let changeAppMode = document.getElementById("appMode");
let sections = document.querySelectorAll("section");
let tasks = document.querySelectorAll(".tasks");


// data
let statusTaskInput = document.getElementById("status");
let categoryTaskInput = document.getElementById("category");
let titleTaskInput = document.getElementById("title");
let descriptionTaskInput = document.getElementById("description");

let toDo = document.getElementById("toDo");
let inProgress = document.getElementById("inProgress");
let done = document.getElementById("done");

// counter decleration 
let nextUpCount = document.getElementById("nextUpCount");
let inProgressCount = document.getElementById("inProgressCount");
let doneCount = document.getElementById("doneCount");

// variables decleration
let tasksArr=[];
let taskHTML;
let updateIndex;
let nextUpCounter = 0;
let inProgressCounter = 0;
let doneCounter = 0;
let regexTitle = /^\w{3,}(\s\w+)*$/;
let regexDescription = /^(?=.{5,100}$)\w{1,}(\s\w*)*$/;


if(localStorage.getItem('tasks')){
tasksArr = JSON.parse(localStorage.getItem('tasks')) 
for(i=0;i<tasksArr.length;i++){
    displayTasks(i)
}
}

// =========> show modal
function showModal() {
    modal.classList.remove("d-none");
    modal.classList.add("d-flex");
    body.style.overflow = "hidden";
    scroll(0,0)
}
newTask.addEventListener("click", showModal);

// =========> hide modal
function hideModal(){
    modal.classList.remove("d-flex");
    modal.classList.add("d-none");
    body.style.overflow = "auto";
}
modal.addEventListener("click", function (event) {

    if(event.target.id =='modal')
    hideModal()
});

// =========> add task 
function addTask(){
    if(validation(regexTitle,titleTaskInput)&&
    validation(regexDescription,descriptionTaskInput)){
        if(addBtn.innerHTML.trim() == "Add Task"){
            let task ={
                Status:statusTaskInput.value,
                Category:categoryTaskInput.value,
                Title: titleTaskInput.value,
                Desc: descriptionTaskInput.value 
            }
            tasksArr.push(task);
            setLocalStorage()
            displayTasks(tasksArr.length - 1)
        }   
        else if (addBtn.innerHTML.trim() == "Update Task") {
            updateTask(updateIndex)
            
        }
    }
}
addBtn.addEventListener('click',function(){
    addTask();
    titleTaskInput.value='';
    descriptionTaskInput.value='';

})

// ==========> display task
function displayTasks(index){
    taskHTML =`
    <div class="task" >
      <h3 class="text-capitalize">${tasksArr[index].Title}</h3>
      <p class="description text-capitalize">${tasksArr[index].Desc}</p>
      <h4 class="category ${tasksArr[index].Category} text-capitalize">${tasksArr[index].Category}</h4>
      <ul class="task-options list-unstyled d-flex gap-3 fs-5 m-0">
        <li><i class="fa-solid fa-pen-to-square" onclick="getTaskInfo(${index})"></i></li>
        <li><i class="fa-solid fa-trash-can" onclick="deleteTask(${index})"></i></li>
        <li><i class="fa-solid fa-palette" onclick="changeColor(event)"></i></li>
      </ul>
  </div>
  `;
  setHTMLocation(tasksArr[index].Status)
  hideModal()
}

function setHTMLocation(status){

    if(status =='nextUp'){
    toDo.innerHTML += taskHTML;
    nextUpCounter ++;
    nextUpCount.innerHTML=nextUpCounter;
}
    else if(status =='inProgress'){
    inProgress.innerHTML += taskHTML;
    inProgressCounter ++;
    inProgressCount.innerHTML=inProgressCounter;
    }
    else if(status =='done'){
    done.innerHTML += taskHTML;
    doneCounter ++;
    doneCount.innerHTML=doneCounter;
}

    }

    function setLocalStorage(){
        localStorage.setItem('tasks', JSON.stringify(tasksArr))

    }
// ============>> Delete Task...
    function deleteTask(index){
        tasksArr.splice( index , 1);
        setLocalStorage();
        resetContainer();
        resetCounter()
        for(i=0;i<tasksArr.length;i++){
            displayTasks(i)
        }}
//------reset----------
    function resetContainer(){
            toDo.innerHTML='';
        inProgress.innerHTML='';
        done.innerHTML='';
        }

    function resetCounter(){
    nextUpCounter = 0;
    inProgressCounter = 0;
    doneCounter = 0;
    }
// ------------------------
    function getTaskInfo(index){
        showModal();
        statusTaskInput.value=tasksArr[index].Status;
        categoryTaskInput.value = tasksArr[index].Category;
        titleTaskInput.value=tasksArr[index].Title;
        descriptionTaskInput.value=tasksArr[index].Desc;
        addBtn.innerHTML='Update Task';
        addBtn.classList.remove('btn-new-task');
        addBtn.classList.add('btn-update');
        updateIndex = index;
    }

    //============>> Update Task...
function updateTask(index){
    tasksArr[index].Status = statusTaskInput.value;
    tasksArr[index].Category = categoryTaskInput.value;
    tasksArr[index].Title = titleTaskInput.value;
    tasksArr[index].Desc = descriptionTaskInput.value;

    setLocalStorage();
    resetContainer();
    resetCounter();
    for(i=0;i<tasksArr.length;i++){
        displayTasks(i)
    }
    addBtn.innerHTML='Add Task';
    addBtn.classList.add('btn-new-task');
    addBtn.classList.remove('btn-update');
}

// ===============>> search tasks 
function searchTask(){
    let serchKey = searchInput.value;
    resetContainer();
    resetCounter();
    for(i=0;i<tasksArr.length;i++){
        if(tasksArr[i].Title.toLowerCase().includes(serchKey.toLowerCase()) || 
        tasksArr[i].Category.toLowerCase().includes(serchKey.toLowerCase()))
        displayTasks(i);
    }

    

}
searchInput.addEventListener("input",searchTask)

// ===========>> change color
function generateColor(){
    let color = "#";
    let colorArr = [0,1,2,3,4,5,6,7,8,9,"a","b","c","d","e","f"];
    for(i=1; i<= 6; i++){
        let randonIndex = Math.trunc(Math.random() * 16)
        color += colorArr[randonIndex];
    }
    return color + "55";
}
function changeColor(event){
    let element = event.target.parentElement.parentElement.parentElement;
    element.style.backgroundColor = generateColor();
}

function changeToBars(){
    gridBtn.classList.remove("active");
    barsBtn.classList.add("active");
    for(let i = 0; i<sections.length;i++){
        sections[i].classList.remove("col-md-6","col-lg-4");
        sections[i].style.overflow = "auto";
    }
    for(let j=0;j<=tasks.length;j++){
        tasks[j].setAttribute("data-view","bars")
    }
}
function changeToGrids(){
    gridBtn.classList.add("active");
    barsBtn.classList.remove("active");
    for(let i = 0; i<sections.length;i++){
        sections[i].classList.add("col-md-6","col-lg-4");
    }
    for(let j=0;j<=tasks.length;j++){
        tasks[j].removeAttribute("data-view")
    }
}

// =======>> change app mode 
function changeMode(){
    if(changeAppMode.classList.contains("fa-moon")){
    changeAppMode.classList.replace("fa-moon","fa-sun")
    root.style.setProperty("--main-black","#f1f1f1")
    root.style.setProperty("--sec-black","#ddd")
    root.style.setProperty("--text-color","#222")
    root.style.setProperty("--gray-color","#333")
    root.style.setProperty("--mid-gray","#f1f1f1")
    }
    else if (changeAppMode.classList.contains("fa-sun")){
        changeAppMode.classList.replace("fa-sun","fa-moon");
        root.style.setProperty("--main-black","#0d1117")
        root.style.setProperty("--sec-black","#161b22")
        root.style.setProperty("--text-color","#a5a6a7")
        root.style.setProperty("--gray-color","#dadada")
        root.style.setProperty("--mid-gray","#474a4e")
    }
}
changeAppMode.addEventListener("click",changeMode)


// ========>> validation
function validation(regex,element){
    if(regex.test(element.value)){
        element.classList.add("is-valid")
        element.classList.remove("is-invalid")
        element.parentElement.nextElementSibling.classList.add("d-none")
    }
    else{
        element.classList.add("is-invalid")
        element.classList.remove("is-valid")
        element.parentElement.nextElementSibling.classList.remove("d-none")
    }
    return regex.test(element.value)
}
titleTaskInput.addEventListener("input",function(){
    validation(regexTitle,titleTaskInput)
})
descriptionTaskInput.addEventListener("input",function(){
    validation(regexDescription,descriptionTaskInput)
})

