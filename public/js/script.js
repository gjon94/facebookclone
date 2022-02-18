

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






const addPost = document.querySelector('#addPost')
if(addPost !== null)addPost.addEventListener('keyup', addPostFunction)


async function addPostFunction() {

  try {

    console.log(addPost.value.charCodeAt(addPost.value.length - 1))
    
    if (addPost.value.charCodeAt(addPost.value.length - 1) === 10) {

      console.log('qui')
      if (addPost.value.trim().length < 1) {
        addPost.blur();
        addPost.value = '';
        return
      }
      const requestOptions = {
        method: "POST",
        body: JSON.stringify({

          content: addPost.value.trim()


        }),
        headers: { 'Content-Type': 'application/json' }
      }


      addPost.blur()
      await fetch(window.location.href, requestOptions)
        .then(data => data)
        .then(_data => console.log(_data))
        addPost.value = ''



    }




  } catch (error) {
    console.log(error)
  }





}