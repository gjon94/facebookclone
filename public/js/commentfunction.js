export async function showComment(thisElement, url) {

    try {



        const requestOptions = {
            method: "GET",

        }

        const data = await fetch(url, requestOptions)
            .then(response => response.json())

        showCommentPushDomElement(thisElement, data)




    } catch (error) {
        console.log(error)
    }


}



function showCommentPushDomElement(thisElement, data) {
    thisElement.innerHTML = '';



    if (data.comment) {
        data.comment.reverse()
        for (let i = 0; i < data.comment.length; i++) {

            thisElement.innerHTML += `  <div class="d-flex gap-2 align-items-center mt-3 ">
  
        <a href="${data.comment[i].userComment}"><img class="rounded-circle" src="${data.comment[i].imgProfile}" style="width: 37px;height: 37px;"></a>
  
        <p class="rounded-pill text-break bg-secondary" style="padding:15px;">
        <a>${data.comment[i].nameUser}</a>
        ${data.comment[i].value}</p>
        </div>`;


        }


    }

}











export async function commentDataPost(thisElement, rootComments, url) {

    try {

        

        if (thisElement.value.charCodeAt(thisElement.value.length - 1) === 10) {

            if (thisElement.value.trim().length < 1) {
                thisElement.blur();
                thisElement.value = '';
                return
            }
            const requestOptions = {
                method: "POST",
                body: JSON.stringify({ action: "comment", value: thisElement.value.trim() }),
                headers: { 'Content-Type': 'application/json' }
            }


            thisElement.blur();
            
            await fetch(url, requestOptions)
                .then(data => data.json())
                .then(_data => innerComment(_data))

            function innerComment(_data) {
                const div = document.createElement('div')
                div.innerHTML += `<div class="d-flex gap-2 align-items-center mt-3 ">
  
            <a href="${_data._id}"><img class="rounded-circle" src="${_data.imgProfile}" style="width: 37px;height: 37px;"></a>
  
            <p class="rounded-pill text-break bg-secondary" style="padding:15px;">
            <a>${thisElement.name}</a>
            ${thisElement.value}</p>
            </div>`;
            rootComments.prepend(div)
                thisElement.value = ''
            }






        }




    } catch (error) {
        console.log(error)
    }


}





export async function toggleDblockFromComments(hideelementcomment) {

    try {

        hideelementcomment.classList.remove("d-none")

    } catch (error) {
        console.log(error)
    }


}












async function removeMyRequestFriend(e) {

    const requestOptions = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friendUrl: e })
    }

    fetch('/friendrequest', requestOptions)
}


async function acceptRefuseRequestFriend(userUrl, bool) {

    const requestOptions = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            friendUrl: userUrl,
            decision: bool
        })
    }

    fetch('/friendrequest', requestOptions)

}

async function addFriend(userUrl) {
    const requestOptions = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            friendUrl: userUrl,
        })
    }

    fetch('/friendrequest', requestOptions)
}


