const { MongoClient, ObjectId } = require('mongodb');

const mongoose = require('mongoose')
const UserCreate = require('../config/userschema')


const url = process.env.MONGODBURI;

const client = new MongoClient(url)

const bcrypt = require('bcryptjs')

async function connectDB() {
    await client.connect()
    await mongoose.connect(url)

}


//////
async function signUpFunction(objSignup) {
    try {




        const userCreated = await UserCreate.create({
            name: objSignup.name,
            surname: objSignup.surname,
            password: await bcrypt.hash(objSignup.password, 10),
            email: objSignup.email,
            bornOn: new Date(`${objSignup.day}/${objSignup.month}/${objSignup.year}`),
            gender: objSignup.gender
        })




        return userCreated


    } catch (error) {
        return error

    }

}







////




//////funzione esclusiva del login!
async function findUser(x) {

    try {

        let result = await client.db('social').collection('users').findOne(x)



        return result
    } catch (e) {
        console.log(e)
    }


}


async function findManyUserSearch(x) {

    try {

        const result = []
        const cursor = await client.db('social').collection('users').find({ $or: [{ name: { $regex: x } }, { surname: { $regex: x } }] })

        for await (e of cursor) {
            const searchUser = {
                _id: e._id,
                name: e.name,
                surname: e.surname,
                imgProfile: e.imgProfile
            }
            await result.push(searchUser)
        }
        return await result

    } catch (e) {
        console.log(e)
    }


}


async function addPost(user, isHim, postContent) {

    try {

        let userLogin = await client.db('social').collection('users').findOne(user)
        let userToPost = await client.db('social').collection('users').findOne(isHim)

        if (userLogin.password == userToPost.password) {



            if (!postContent.img) postContent.img = false
            const postCreated = {
                _id: new ObjectId,
                content: postContent.content,
                img: postContent.img,
                time: new Date().getTime(),
                like: [],
                author: user.name,
                comment: []
            }

            if (!postCreated) return console.log('post nn creato')

            return await client.db('social').collection('users').updateOne({ _id: userLogin._id }, {
                $push: {
                    posts: postCreated
                }
            })

        } else {

            return console.log('non e lui qualcuno prova postare senza auht')
        }



    } catch (e) {
        console.log(e)
    }


}



async function homePost(user, datePostToFetch) {

    try {

        const arr = []
        const result = []
        let userLogin = await client.db('social').collection('users').findOne(user)

        await arr.push(userLogin._id)


        if (userLogin.friends) {


            for await (e of userLogin.friends) {
                arr.push(ObjectId(e))

            }


            for await (e of arr) {

                let friendsPost = await client.db('social').collection('users').findOne(e)


                if (friendsPost !== null && friendsPost.posts) {
                    for await (i of friendsPost.posts) {
                        i.imgProfile = friendsPost.imgProfile
                        i.name = friendsPost.name
                        i.author = friendsPost._id.toString()

                        if (i.time < datePostToFetch) {

                            result.push(i)

                        }


                    }



                }

            }


            result.sort((a, b) => {
                return b.time - a.time;
            })

            result.length = 3
            return result


        } else if (await userLogin.posts) {


            for await (i of userLogin.posts) {
                i.imgProfile = userLogin.imgProfile
                i.name = userLogin.name
                i.author = userLogin._id.toString()


                result.push(i)
            }

            result.sort((a, b) => {
                return b.time - a.time;
            });




            return await result

        }







    } catch (e) {
        console.log(e)
    }


}

async function userPagePost(user, datePostToFetch) {

    const posts = await client.db('social').collection('users').findOne(user._id)
    const arr = []
    for await (i of posts.posts) {



        if (i.time < datePostToFetch) {
            i.imgProfile = user.imgProfile
            i.name = user.name
            i.author = user._id.toString()
            arr.push(i)

        }
    }


    arr.sort((a, b) => {
        return b.time - a.time;
    })

    arr.length = 3

    return arr

}

//Like function//
async function likeFunction(reqUser, userId, postId) {

    try {



        // ASSOLUTAMENTE DA SCRIVERE UN CODICE SOLO SU MONGODB IF ELSE

        let result = await client.db('social').collection('users').findOne({ "_id": ObjectId(userId), posts: { $elemMatch: { "_id": ObjectId(postId), like: { $in: [reqUser] } } } })

        if (await !result || null) {
            await client.db('social').collection('users').updateOne({ "_id": ObjectId(userId), posts: { $elemMatch: { "_id": ObjectId(postId) } } }, { $addToSet: { "posts.$.like": reqUser } })

        } else {
            await client.db('social').collection('users').updateOne({ "_id": ObjectId(userId), posts: { $elemMatch: { "_id": ObjectId(postId) } } }, { $pull: { "posts.$.like": reqUser } })

        }







    } catch (e) {
        console.log(e)
    }


}



//comment function//
async function commentFunction(reqUser, userId, postId) {

    try {



        // 

        const result = await client.db('social').collection('users').updateOne({ "_id": ObjectId(userId), posts: { $elemMatch: { "_id": ObjectId(postId) } } }, { $addToSet: { "posts.$.comment": reqUser } })


        return result






    } catch (e) {
        console.log(e)
    }


}

// show comments function
async function showComment(userId, postId) {

    try {

        const result = await client.db('social').collection('users').findOne({ "_id": ObjectId(userId), posts: { $elemMatch: { "_id": ObjectId(postId) } } });

        const { password, ...others } = await result
        return others

    } catch (e) {
        console.log(e)
    }


}








async function friendRequestFunction(requestFriendship) {

    const result = []
    let friendRequest = await client.db('social').collection('users').find({
        '_id': { $in: requestFriendship }
    });

    for await (ele of friendRequest) {
        const { password, ...resultWithOutPass } = ele
        result.push(resultWithOutPass)
    }

    return result

}

async function removeMyRequestFriend(user, friend) {

    try {



        let friendRequest = await client.db('social').collection('users').findOneAndUpdate(
            { _id: ObjectId(user) }, { $pull: { friendRequestSended: friend } });

        let _friendRequest = await client.db('social').collection('users').findOneAndUpdate(
            { _id: ObjectId(friend) }, { $pull: { friendRequest: user } });


    } catch (error) {
        console.log(error)
    }




}


async function acceptRefuseRequestFriend(userUrl, friendUrl, bool) {

    try {



        let friendRequest = await client.db('social').collection('users').findOneAndUpdate(
            { _id: ObjectId(userUrl) }, { $pull: { friendRequest: friendUrl } });

        let _friendRequest = await client.db('social').collection('users').findOneAndUpdate(
            { _id: ObjectId(friendUrl) }, { $pull: { friendRequestSended: userUrl } });


        if (bool === true) {

            console.log('amicizia accetatata')


            let acceptFriend = await client.db('social').collection('users').findOneAndUpdate(
                { _id: ObjectId(userUrl) }, { $addToSet: { friends: friendUrl } });

            let _acceptFriend = await client.db('social').collection('users').findOneAndUpdate(
                { _id: ObjectId(friendUrl) }, { $addToSet: { friends: userUrl } });

            return
        }

        console.log('amicizia rifiutata')


    } catch (error) {
        console.log(error)
    }




}


async function sendRequestFriend(userUrl, friendUrl) {

    try {

        let friendRequest = await client.db('social').collection('users').findOneAndUpdate(
            { _id: ObjectId(userUrl) }, { $addToSet: { friendRequestSended: friendUrl } });

        let _friendRequest = await client.db('social').collection('users').findOneAndUpdate(
            { _id: ObjectId(friendUrl) }, { $addToSet: { friendRequest: userUrl } });




    } catch (error) {
        console.log(error)
    }




}



async function userWhoCommentFunction(x) {

    try {

        const result = await client.db('social').collection('users').findOne(x)
        if (result) {
            const { password, ...others } = result;

            return others

        }




    } catch (e) {
        console.log(e)
    }


}





async function changeImgProfileFunction(user, img) {

    try {

        let result = await client.db('social').collection('users').findOneAndUpdate({ _id: ObjectId(user) }, { $set: { imgProfile: img } })


        return result
    } catch (e) {
        console.log(e)
    }


}

async function changeimgBackgroundFunction(user, img) {

    try {

        let result = await client.db('social').collection('users').findOneAndUpdate({ _id: ObjectId(user) }, { $set: { imgBackground: img } })


        return result
    } catch (e) {
        console.log(e)
    }


}






module.exports = {
    connectDB: connectDB,
    findUser: findUser,
    addPost: addPost,
    homePost: homePost,
    userPagePost: userPagePost,
    findManyUserSearch: findManyUserSearch,
    likeFunction: likeFunction,
    signUpFunction: signUpFunction,
    friendRequestFunction: friendRequestFunction,
    removeMyRequestFriend: removeMyRequestFriend,
    acceptRefuseRequestFriend: acceptRefuseRequestFriend,
    sendRequestFriend: sendRequestFriend,
    commentFunction: commentFunction,
    showComment: showComment,
    userWhoCommentFunction: userWhoCommentFunction,
    changeImgProfileFunction: changeImgProfileFunction,
    changeimgBackgroundFunction: changeimgBackgroundFunction
}