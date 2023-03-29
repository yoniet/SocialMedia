const User = require('../models/user.model')
const extend = require('lodash/extend')
const formidable = require('formidable')
const fs = require('fs')
const path = require('path')
const errorHandler = require('../helpers/dbErrorHandler')

const profileImage = path.join(__dirname, '../public/images/', 'images.png')


const create = async (req, res) => {

  const user = new User(req.body)
  try {
    await user.save()
    return res.status(200).json({
      message: "Successfully signed up!"
    })
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

/**
 * Load user and append to req.
 */
const userByID = async (req, res, next, id) => {
  try {
    let user = await User.findById(id)
      .populate('following', '_id name')
      .populate('followers', '_id name')
    if (!user)
      return res.status('400').json({
        error: "User not found"
      })
    req.profile = user
    next()
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve user"
    })
  }
}

const read = (req, res) => {
  req.profile.hashed_password = undefined
  req.profile.salt = undefined
  return res.json(req.profile)
}

const list = async (req, res) => {
  try {
    let users = await User.find().select('name email updated created')
    res.json(users)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const update = async (req, res) => {

  let form = new formidable.IncomingForm()
  form.keepExtensions = true

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Photo could not be uploaded"
      })
    }

    let user = req.profile
    user = extend(user, fields)
    user.updated = Date.now()
    if (files.photo) {
      user.photo.data = fs.readFileSync(files.photo.filepath);
      user.photo.contentType = files.photo.type
    }
    try {
      await user.save()
      user.hashed_password = undefined
      user.salt = undefined
      res.json(user)

    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  })
}

const remove = async (req, res) => {
  try {
    let user = req.profile
    let deletedUser = await user.remove()
    deletedUser.hashed_password = undefined
    deletedUser.salt = undefined
    res.json(deletedUser)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const photo = (req, res, next) => {
  if (req.profile.photo.data) {
    res.set("Content-Type", req.profile.photo.contentType)
    return res.send(req.profile.photo.data)
  }
  next()
}

const defaultPhoto = (req, res) => {
  return res.sendFile(profileImage)
}

// These functions are responsible for users' followers and following 
const addFollowing = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.body.userId, { $push: { following: req.body.followId } })
    next()
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const addFollower = async (req, res) => {
  try {
    let result = await User.findByIdAndUpdate(req.body.followId,
      { $push: { followers: req.body.userId } },
      // if you want to return document itself after update was applied and not object
      { new: true })
      .populate('following', '_id name')
      .populate('followers', '_id name')
      .exec()
    result.hashed_password = undefined
    result.salt = undefined
    res.json(result)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const removeFollowing = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.body.userId,
      { $pull: { following: req.body.unfollowId } })
    next()
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const removeFollower = async (req, res) => {
  try {
    let result = await User.findByIdAndUpdate(req.body.unfollowId, { $pull: { followers: req.body.userId } }, { new: true })
      .populate('following', '_id name')
      .populate('followers', '_id name')
      .exec()
    result.hashed_password = undefined
    result.salt = undefined
    res.json(result)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

// This query will return an array of users that are not followed by the current user
const findPeople = async (req, res) => {
  

  let following =  req.profile.following
  following.push(req.profile._id)
  try {
    // Returns only those who the user is not following
    let users = await User.find({_id: {$nin: following}})
                          .select('name')
    res.json(users)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

module.exports = {
  create,
  userByID,
  read,
  list,
  remove,
  update,
  photo,
  defaultPhoto,
  addFollowing,
  addFollower,
  removeFollowing,
  removeFollower,
  findPeople
}
