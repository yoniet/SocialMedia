const Post = require('../models/post.model');
const errorHandler = require('../helpers/dbErrorHandler');
const formidable = require('formidable')
const fs = require('fs')

const listNewsFeed = async (req, res) => {
    let following = req.profile.following
    following.push(req.profile._id)

    try {
        let posts = await Post.find({
            postedBy: {
                $in:
                    req.profile.following
            }
        })
            // Each post will also contain the "id" and "name" of user created the post and the 
            // users who left comments on the post.
            .populate('comments.postedBy', '_id name')
            // find all the posts that have "postedBy" user's references that match the current 
            // user's followings and the current user.
            .populate('postedBy', '_id name')
            // The posts that are returned will be stored by the "created timestamp",
            // with the most recent post listed first.
            .sort('-created')
            .exec()
        res.json(posts)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const remove = async (req, res) => {
    let post = req.post
    try {
        let deletedPost = await post.remove()
        res.json(deletedPost)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const create = async (req, res, next) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true

    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            })
        }
        let post = new Post(fields)
        post.postedBy = req.profile
        if (files.photo) {
            post.photo.data = fs.readFileSync(files.photo.filepath)
            post.photo.contentType = files.photo.type
        }
        try {
            let result = await post.save()
            res.json(result)
        } catch (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        }
    })
}

// return the specific post by its "postID"
const postByID = async (req, res, next, id) => {
    try {
        let post = await Post.findById(id)
            .populate('postedBy', '_id name')
            .exec()
        if (!post) {
            return res.status(400).json({
                error: "Post not found"
            })
        }
        req.post = post
        next()
    } catch (err) {
        return res.status(400).json({
            error: "Could not retrieve use post"
        })
    }
}

// return the list of posts that were created by a specific user.
const listByUser = async (req, res) => {
    try {
        let posts = await Post.find({ postedBy: req.profile._id })
            .populate('comments.postedBy', '_id name')
            .populate('postedBy', '_id name')
            .sort('-created')
            .exec()
        res.json(posts)
    } catch (err) {
        return res.status('400').json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

// This method checks whether the signed-in user is the original creator of the post
// before executing the 'next' method.
const isPoster = (req, res, next) => {
    let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id
    if (!isPoster) {
        return res.status('403').json({
            error: "User is not authorized"
        })
    }
    next()
}

// like API will be a PUT request that will update the 'likes' array in the Post document.
// The post ID that's received in the request body will be used to find the specific "Post"
// document and update it by pushing the current user's Id to the 'likes' arrays.
const like = async (req, res) => {
    try {
        let result = await Post.findByIdAndUpdate(req.body.postId,
            { $push: { likes: req.body.userId } },
            // return document itself after update was applied and not object
            { new: true }
        )
        res.json(result)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}


const unlike = async (req, res) => {
    try {
        let result = await Post.findByIdAndUpdate(req.body.postId,
            { $pull: { likes: req.body.userId } },
            { new: true }
        )
        res.json(result)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const photo = (req, res, next) => {
    res.set("Content-Type", req.post.photo.contentType)
    return res.send(req.post.photo.data)
}

// this method will find the relevant 'post' to be
// updated by its ID and push the comment object that's received in the 
// request body to the "comments" array of the post.
const comment = async (req, res) => {
    let comment = req.body.comment
    comment.postedBy = req.body.userId
    try {
        // In the result, the updated 'post' will be sent back with 
        // details of the "postedBy" users populated in the post and in the comments.
        let result = await Post.findByIdAndUpdate(req.body.postId,
            { $push: { comments: comment } },
            { new: true })
            .populate('comments.postedBy', '_id name')
            .populate('postedBy', '_id name')
            .exec()
        res.json(result)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

// This method will find the relevant post by 'ID' and pull the comment
// with the deleted comment's 'ID' from the comments array in the post
const uncomment = async (req, res) => {
    let comment = req.body.comment
    try {
        let result = await Post.findByIdAndUpdate(req.body.postId, 
                                    {$pull: {comments: {_id: comment._id}}},
                                    {new: true})
                                    .populate('comments.postedBy', '_id name')
                                    .populate('postedBy', '_id name')
                                    .exec()
        res.json(result)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}


module.exports = {
    listNewsFeed,
    listByUser,
    create,
    postByID,
    photo,
    isPoster,
    remove,
    like,
    unlike,
    comment,
    uncomment
}