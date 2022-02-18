export  async function postLike(button, url) {

    try {
  
      button.classList.toggle("text-primary")
  
      const requestOptions = {
        method: "POST",
        body: JSON.stringify({ action: "like" }),
        headers: { 'Content-Type': 'application/json' }
      }
      return fetch(url, requestOptions)
  
  
  
  
    } catch (error) {
      console.log(error)
    }
 
  
  }