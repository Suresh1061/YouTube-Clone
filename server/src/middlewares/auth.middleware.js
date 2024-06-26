import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js"


// export const verifyJWT = asyncHandler(async (req, _, next) => { 
//     console.log(req.cookies)
//     console.log(req.header("Authorization"))
//     try {
//         const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
//         console.log(token)
//         if (!token) {
//             throw new ApiError(401, "Unauthorized request")
//         }

//         const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
//         console.log(decodedToken);

//         const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
//         console.log(user)

//         if (!user) {
//             throw new ApiError(401, "invalid access token")
//         }

//         req.user = user
//         next()
//     } catch (error) {
//         console.log(error)
//         throw new ApiError(401, error?.message || "Invalid access token")
//     }
// })

export const verifyJWT = asyncHandler(async (req, _, next) => {
    // console.log("cookies start : ")
    // console.log(req.cookies)
    // console.log(req.cookies.accessToken)
    // console.log(req.cookies.refreshToken)
    // console.log("cookies end : ")
    
    try {
        let token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        // Fallback mechanism: prioritize headers over cookies if cookies are not available
        if (!token && !req.cookies) {
            throw new ApiError(401, "Unauthorized request")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        // console.log(decodedToken);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        // console.log(user)

        if (!user) {
            throw new ApiError(401, "invalid access token")
        }

        req.user = user
        next()
    } catch (error) {
        console.log("print error")
        console.log(error)
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})
