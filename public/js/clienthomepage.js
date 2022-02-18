
const rootPost = document.querySelector('#rootPost')
const body = document.querySelector('body')
console.log(rootPost)
import {postLike} from './likefunction.js'
import {toggleDblockFromComments, showComment, commentDataPost} from './commentfunction.js'



class Posts {
    constructor(obj, userInfo) {
         this._id = obj._id,
            this.time = obj.time,
            this.name = obj.name,
            this.like = obj.like,
            this.imgProfile = obj.imgProfile,
            this.img = obj.img,
            this.content = obj.content,
            this.comment = obj.comment,
            this.author = obj.author,
            this.userInfo_id = userInfo._id,
            this.userImgProfile = userInfo.imgProfile
    }

    div = document.createElement('div');
    button = document.createElement('button');



    createDom() {
        this.div.classList = 'card mt-5';
        this.div.style = 'background-color: #242526;';
        

        let imgDom = `<div class="container-fluid p-0 d-flex justify-content-center bg-dark"
        style="max-height: 50vh;min-height: 40vh; ">
        <img src="${this.img}" class=" " alt="..." style="object-fit: contain; max-width: 100%;">
        </div>`;



        this.div.innerHTML = `<div class="card-body">
        <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex gap-4 align-items-center">
                <div>
                    <a class=" text-light" href="${this.author}"><img class="rounded-circle"
                            src="${this.imgProfile}" style="width: 37px;height: 37px;object-fit: cover; "></a>
                </div>
                <div>
                    <h6 class="m-0">
                         ${this.name} 
                    </h6><span>
                    ${new Date(this.time).toLocaleString()}
                    </span>
                </div>
            </div>


            <span>
                <i class="fas fa-ellipsis-v"></i>
            </span>


        </div>
        <div class="mt-3">
            <p>
                 ${this.content} 
            </p>
        </div>
    </div>
${this.img ? imgDom : 'no foto'}

            <div class="card-body lino">
                <div class="d-flex justify-content-between border-bottom border-secondary">
                <div><i class="far fa-thumbs-up"></i><span>
                ${this.like.length}  
            </span></div>
                    <div>commenti:
                    ${this.comment.length}
                    </div>

                </div>

               

                <div class="row gap-1 justify-content-around mt-2">
                    <div role="button" class="likebutton col-3 text-center ${this.like.includes(this.userInfo_id)? 'text-primary':''}">
                        
                        <i class="far fa-thumbs-up" style="font-size: 2rem;"></i>
                    </div>

                    <div role="button"  class="commentbutton col-3 text-center">
                        <i class="far fa-comment-alt" style="font-size: 2rem;"></i>
                    </div>
                    <div class="sharebutton col-3 text-center">
                        <i class="fas fa-share" style="font-size: 2rem;"></i>
                    </div>

                </div>

                <div class="hideelementcomment d-flex gap-2 align-items-center mt-3 d-none">

                    <img class="rounded-circle" src="${this.userImgProfile}" style="width: 37px;height: 37px;">

                    <textarea 
                        class="form-control rounded-pill" placeholder="Leave a comment here" id="floatingTextarea2"
                        style="height: 50px;resize: none;"></textarea>

                </div>

                
                <div>
                    <span role="button" class="showCommentDomElement">Commenti</span>

                    
                    <div class="rootcomments"></div>

                </div>

                



            </div>`;


        rootPost.appendChild(this.div)
       const btnLike = this.div.querySelector('.likebutton')
       const btnComment = this.div.querySelector('.commentbutton')
       const showCommentDomElement = this.div.querySelector('.showCommentDomElement')
       const rootComments = this.div.querySelector('.rootcomments')
       const hideelementcomment = this.div.querySelector('.hideelementcomment')
       const textArea = this.div.querySelector('textarea')

       
       btnLike.addEventListener('click',()=>postLike(btnLike,this.author+'/'+this._id))
       btnComment.addEventListener('click',()=>toggleDblockFromComments(hideelementcomment))
       showCommentDomElement.addEventListener('click',()=>showComment(rootComments,this.author+'/'+this._id))
       textArea.addEventListener('keyup',()=>commentDataPost(textArea,rootComments,this.author+'/'+this._id))
      
       

    }




}



///user info

async function fetchDataUserFunction() {
    let methods = {
        method: 'POST',
        body: JSON.stringify({ postsUserInfo: true }),
        headers: { 'Content-Type': 'application/json' }
    }

    const _data = await fetch(window.location.href, methods);
    const _dataJson = await _data.json();
    
    return _dataJson

}

const userInfo = fetchDataUserFunction()









////fetch post
let datePost;
async function fetchDataFunction(fetchFrom) {
    let methods = {
        method: 'POST',
        body: JSON.stringify({ postsFrom: fetchFrom }),
        headers: { 'Content-Type': 'application/json' }
    }



    fetch(window.location.href, methods)
        .then(data => data.json())
        .then(result => createPosts(result))
        

}


fetchDataFunction(new Date().getTime())


async function createPosts(result) {



    for (let i = 0; i < result.length; i++) {
        
        if (result[i] == null || !result[i]) {
            return console.log('post finiti')
        }

        
        new Posts(result[i], await userInfo).createDom()
        datePost = result[i].time

    }



}


window.addEventListener('scroll', function () {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {

        fetchDataFunction(datePost)
    }
});



