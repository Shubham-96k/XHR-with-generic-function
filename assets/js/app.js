const cl = console.log;

const posts = document.getElementById("postcontainer");
const showsidebar = document.getElementById("showsidebar");
const opensidebar = document.getElementById("opensidebar");
const hidesidebar = document.getElementById("hidesidebar");
const backdrop = document.getElementById("backdrop");
const addbtn = document.getElementById("addbtn");
const updatebtn = document.getElementById("updatebtn");
const PostApi = document.getElementById("PostApi");
const loader = document.getElementById('loader');

//#######Get Form Controls #########

const postform = document.getElementById("postform");
const titleControl = document.getElementById("title");
const bodyControl = document.getElementById("body");
const useridControl = document.getElementById("userid");

let array = [];
cl(array);

let baseurl = `https://jsonplaceholder.typicode.com`;
let posturl = `${baseurl}/posts`;

let token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`

const onEdit = eve => {
    let getid = eve.closest(".card").id;
    localStorage.setItem("editId", getid);
    let editurl = `${baseurl}/posts/${getid}`;
    makeApiCall("GET", editurl);
}

const onRemove = eve => {
    let getcardid = eve.closest(".card").id;
    let deleteurl = `${baseurl}/posts/${getcardid}`;
    makeApiCall("DELETE", deleteurl);
}

const templatingofPosts = eve => {
    let result = " ";
    eve.forEach(ele => {
        result += `
            <div class="card mb-2" id="${ele.id}">
                <div class="card-header bg-dark text-white">
                    ${ele.title}
                </div>
                <div class="card-body">
                    <p>${ele.body}</p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-outline-primary" onclick="onEdit(this)">Edit</button>
                    <button class="btn btn-outline-danger" onclick="onRemove(this)">Delete</button>
                </div>
            </div>
        `
    });
    posts.innerHTML = result;
}

const makeApiCall = ((methodname, apiUrl, bodymsg = null) => {
    loader.classList.remove("d-none");
    let xhr = new XMLHttpRequest();
    xhr.open(methodname, apiUrl);
    xhr.setRequestHeader('token', token);
    xhr.setRequestHeader('content-type', 'application/JSON')
    xhr.send(JSON.stringify(bodymsg));
    xhr.onload = () => {
    loader.classList.add("d-none");
    if(xhr.status >= 200 || xhr.status <= 299 && xhr.readyState === 4){
        // cl(xhr.response);
        // let data = JSON.parse(xhr.response);
        if(methodname === "GET"){
            array = JSON.parse(xhr.response);
            if(Array.isArray(array)){
                templatingofPosts(array);
            }else{
                addbtn.classList.add("d-none");
                updatebtn.classList.remove("d-none");
                titleControl.value = array.title;
                bodyControl.value = array.body;
                useridControl.value = array.userId;
                onActive();
            }
        }else if(methodname === "PUT"){
            let updtdid = JSON.parse(xhr.response).id;
            let getcard = document.getElementById(updtdid);
            let childcards = [...getcard.children];//returns htmlcollection
            childcards[0].innerHTML = `<h2>${bodymsg.title}</h2>`
            childcards[1].innerHTML = `<p>${bodymsg.body}</p>`
            postform.reset();
            updatebtn.classList.add("d-none");
            addbtn.classList.remove("d-none");
            onActive();
        }else if(methodname === "DELETE"){
            let getconfirmation = confirm('are you sure, you want to delete post!')
            if(getconfirmation){
                let getindex = apiUrl.indexOf("posts/");
                let getid = apiUrl.slice(getindex + 6);
                let card = document.getElementById(getid);
                card.remove();
            }else{
                return;
            }
        }else if(methodname === "POST"){
            let card = document.createElement("div");
            card.className = "card mb-2";
            card.id = JSON.parse(xhr.response).id;
            card.innerHTML = `
                <div class="card-header bg-dark text-white">
                    ${bodymsg.title}
                </div>
                <div class="card-body">
                    <p>${bodymsg.body}</p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-outline-primary" onclick="onEdit(this)">Edit</button>
                    <button class="btn btn-outline-danger" onclick="onRemove(this)">Delete</button>
                </div>
                `
                posts.prepend(card);
                postform.reset();
                onActive();
        }else{
            alert(`something went wrong`);
        }


        
    }else{
        alert(`something Went wrong !!!`);
    }
}
    xhr.onerror = function(){
        loader.classList.add("d-none");
    }
})

makeApiCall("GET", posturl);

const onUpdate = () => {
    let updtobj = {
        title  : titleControl.value,
        body : bodyControl.value,
        userId : useridControl.value
    }
    cl(updtobj);
    let updtid = localStorage.getItem("editId");
    let updturl = `${baseurl}/posts/${updtid}`
    makeApiCall("PUT", updturl, updtobj);
}

const onAddPost = eve => {
    eve.preventDefault();
    let postobj = {
        title : titleControl.value,
        body : bodyControl.value,
        userId : useridControl.value,
    }
    makeApiCall("POST", posturl, postobj);
}

const onActive = () => {
    opensidebar.classList.toggle("active");
    backdrop.classList.toggle("active");
}

postform.addEventListener("submit", onAddPost);
updatebtn.addEventListener("click", onUpdate);
showsidebar.addEventListener("click", onActive);
hidesidebar.addEventListener("click", onActive);
backdrop.addEventListener("click", onActive);

// const onEdit = eve => {
//     let getid = eve.closest(".card").id;
//     localStorage.setItem("editId", getid);
//     let getobjurl = `${baseurl}/posts/${getid}`;
//     let xhr = new XMLHttpRequest();
//     cl(xhr);
//     xhr.open("GET",getobjurl,true);
//     xhr.send();
//     xhr.onload = function(){
//         let getobj = JSON.parse(xhr.response);
//         if(xhr.status === 200){
//             onActive();
//             titleControl.value = getobj.title;
//             bodyControl.value = getobj.body;
//             useridControl.value = getobj.userId;
//             addbtn.classList.add("d-none");
//             updatebtn.classList.remove("d-none");
//         }else{
//             alert("something went wrong !!!");
//         }
//     }   
// }

// const onUpdate = () => {
//     let updateobj = {
//         title : titleControl.value,
//         body : bodyControl.value,
//         userId : useridControl.value,
//     }
//     let getid = JSON.parse(localStorage.getItem("editId"));
//     let updateurl = `${baseurl}/posts/${getid}`;
//     let xhr = new XMLHttpRequest();
//     xhr.open("PATCH", updateurl, true);
//     xhr.send(JSON.stringify(updateobj));
//     xhr.onload = function(){
//         if(xhr.status === 200){
//             let getindex = postArray.findIndex(post => {
//                 return post.id === getid;
//             });
//             postArray[getindex].title = updateobj.title;
//             postArray[getindex].body = updateobj.body;
//             postArray[getindex].userId = updateobj.userId;
//             templating(postArray);
//             addbtn.classList.remove("d-none");
//             updatebtn.classList.add("d-none");
//             postform.reset();
//             onActive(); 
//             Swal.fire({
//                 position: "bottom-end",
//                 icon: "success",
//                 title: "Post Updated Successfully",
//                 timer: 1500
//               });
//         }else{
//             alert("something went wrong !!!")
//         }
//     }
    
// }

// const onRemove = eve => {
//     let getid = eve.closest(".card").id;
//     let deleteurl = `${baseurl}/posts/${getid}`;
//     let xhr = new XMLHttpRequest();
//     xhr.open("DELETE", deleteurl);
//     xhr.send();
//     xhr.onload = () => {
//         if(xhr.status === 200){
//             Swal.fire({
//                 title: "Are you sure?",
//                 text: "You won't be able to revert this!",
//                 icon: "warning",
//                 showCancelButton: true,
//                 confirmButtonColor: "#3085d6",
//                 cancelButtonColor: "#d33",
//                 confirmButtonText: "Yes, delete it!"
//               }).then((result) => {
//                 if (result.isConfirmed) {
//                   Swal.fire({
//                     title: "Deleted!",
//                     text: "Your file has been deleted.",
//                     icon: "success",
//                     timer : 1500
//                   });
//                   document.getElementById(getid).remove();
//                 }
//               });
//         }else{
//             alert("something went wrong !!!")
//         }
//     }
// }

// const createApiobj = eve => {
//     let xhr = new XMLHttpRequest();
//     xhr.open("POST", posturl, true); 
//     xhr.send(JSON.stringify(eve));
//     xhr.onload = function(){
//         if(xhr.status === 200 || xhr.status === 201){
//             cl(xhr.response);
//             eve.id = JSON.parse(xhr.response).id;
//             postArray.push(eve);
//             addposttemp(eve)
//             onActive();
//             Swal.fire({
//                 position: "center",
//                 icon: "success",
//                 title: `Post has been Successfully added`,
//                 timer: 1500
//               });
//         }else{
//             alert("something went wrong!!!")
//         }
//         postform.reset();
//     }
// }

// const onAddPost = eve => {
//     eve.preventDefault();
//     let postobj = {
//         title : titleControl.value,
//         body : bodyControl.value,
//         userId : useridControl.value,
//     }
//     createApiobj(postobj);
// }

// const geturl = () => {
// let xhr = new XMLHttpRequest();
//     xhr.open("GET", posturl, true);
//     xhr.send();
//     xhr.onload = function(){
//         cl(xhr.status);
//         cl(xhr.response);
//         if(xhr.status === 200){ 
//             postArray = JSON.parse(xhr.response);            
//             templating(postArray);
//         }else{
//             alert("something went wrong!!!")
//         }

//     }
// }
 
// geturl();