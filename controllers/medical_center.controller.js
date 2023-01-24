//admin
// exports.verifyOwner = async function (req, res) {
//   try {
//     const owner = await User.findById(req.params.id);
//     if (!owner)
//       return res
//         .status(200)
//         .json({ code: 200, success: true, message: "This account dose not exists" });

//     if (owner.is_verified == true)
//       return res
//         .status(200)
//         .json({ code: 200, success: true, message: "This account already verified"});

//     owner.is_verified = true;

//     await owner.save();
    
//     res.status(200).json({
//       code: 200,
//       success: true,
//       message: "Verified in successfully",
//     });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ code: 500, success: false, message: "Internal Server Error" });
//   }
// };