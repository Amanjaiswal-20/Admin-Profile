const User = require('../models/userModel')
const Token = require('../models/tokenModel')
const AppError = require('../utils/appError')
const mongoose = require('mongoose')
const multer = require('multer')
const sharp = require('sharp')

exports.createUser = async (req, res, next) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role
        });

        res.status(201).json({
            status: 'success',
            data: newUser
        });
    } catch (err) {
        res.status(500).json({
            status: "Error",
            message: err.message
        })
    }
};

//ONLY ADMIN
exports.getAllUsers = (async (req, res, next) => {
    try {
        const users = await User.find()
        res.status(200).json({
            status: "success",
            results: users.length,
            data: {
                data: users
            }
        })
    } catch (err) {
        res.status(500).json({
            status: "Error",
            message: err.message
        })
    }
})

exports.getMe = (async (req, res, next) => {
    try {
        //Recieve userId from request body after authentication
        const userId = req.user._id
        if (!userId || !mongoose.isValidObjectId(userId)) {
            throw new AppError('Please Login Again', 500)
        }
        const user = await User.findById(userId)
        res.status(200).json({
            status: "success",
            data: {
                data: user
            }
        })
    } catch (err) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    }
})


exports.getAllPublicUsers = (async (req, res, next) => {
    try {
        const users = await User.find({ profileType: 'public' })
        res.status(200).json({
            status: "success",
            results: users.length,
            data: {
                data: users
            }
        })
    } catch (err) {
        res.status(500).json({
            status: "Error",
            message: err.message
        })
    }
})

exports.updateUsers = (async (req, res, next) => {

    try {

        const userId = req.user._id
        if (!userId || !mongoose.isValidObjectId(userId)) {
            throw new AppError('Please Login Again', 500)
        }
        let user;
        if (req.body.password) {
            user = await User.findById(userId)
            user.name = req.body.name || user.name;
            user.password = req.body.password;
            user.email = req.body.email || user.email;
            await user.save();

            let token;
            if (
                req.headers.authorization &&
                req.headers.authorization.startsWith('Bearer')
            ) {
                token = req.headers.authorization.split(' ')[1];
            }

            await Token.create({ token: token })


        } else {
            user = await User.findByIdAndUpdate(userId, req.body, {
                new: true,
                runValidators: true
            })
        }
        if (!user) {
            throw new AppError('No document found with that id', 404)
        }
        res.status(200).json({
            status: "success",
            data: {
                data: user
            }
        })
    } catch (err) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    }
})

exports.makeProfilePublic = async (req, res, next) => {
    try {
        const userId = req.user._id
        if (!userId || !mongoose.isValidObjectId(userId)) {
            throw new AppError('Please Login Again', 500)
        }
        const user = await User.findByIdAndUpdate(userId, { profileType: 'public' }, {
            new: true,
            runValidators: true
        })
        if (!user) {
            throw new AppError('No document found with that id', 404)
        }
        res.status(200).json({
            status: "success",
            data: {
                data: user
            }
        })
    } catch (err) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    }
}
exports.makeProfilePrivate = async (req, res, next) => {
    try {
        const userId = req.user._id
        if (!userId || !mongoose.isValidObjectId(userId)) {
            throw new AppError('Please Login Again', 500)
        }
        const user = await User.findByIdAndUpdate(userId, { profileType: 'private' }, {
            new: true,
            runValidators: true
        })
        if (!user) {
            throw new AppError('No document found with that id', 404)
        }
        res.status(200).json({
            status: "success",
            data: {
                data: user
            }
        })
    } catch (err) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    }
}


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/img/users")
    },
    filename: (req, file, cb) => {
        cb(null, `user-${req.user.name}-${Date.now()}.jpeg`)
    },
})

// const multerStorage = multer.memoryStorage();

// const multerFilter = (req, file, cb) => {
//     if (file.mimetype.startsWith('image')) {
//         cb(null, true);
//     } else {
//         cb(new AppError('Not an image! Please upload only images.', 400), false);
//     }
// };

const upload = multer({
    storage: storage
    //fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('file');



exports.updatePhoto = async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.name || req.body.email) {

        throw new AppError(
            'This route is only for updating Photo. Please use patch request at /.',
            400
        )

    }

    let user = await User.find({ _id: req.user._id })
    if (req.file) user.photo = req.file.filename;

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user._id, user, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
};

