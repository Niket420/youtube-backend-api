const asyncHandler = (requestFunction)=>{
    return (req,res,next)=>{
        Promise.resolve(requestFunction(req,res)).catch((err)=>next())
    }
}

export {asyncHandler}