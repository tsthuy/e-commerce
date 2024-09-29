const Shop = require("../model/shop");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const express = require("express");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const Withdraw = require("../model/withdraw");
const sendMail = require("../utils/sendMail");
const router = express.Router();

// create withdraw request --- only for seller
router.post(
  "/create-withdraw-request",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { amount } = req.body;

      // Tìm shop của seller
      const shop = await Shop.findById(req.seller._id);

      // Kiểm tra xem shop có đủ số dư để rút không
      if (shop.availableBalance < amount) {
        return next(new ErrorHandler("Not enough balance to withdraw this amount", 400));
      }

      // Tạo dữ liệu cho yêu cầu rút tiền
      const data = {
        seller: req.seller,
        amount,
      };

      // Tạo yêu cầu rút tiền
      const withdraw = await Withdraw.create(data);

      // Trừ số dư khả dụng
      shop.availableBalance -= amount;
      await shop.save();

      // Gửi email sau khi yêu cầu rút tiền đã được tạo thành công
      try {
        await sendMail({
          email: req.seller.email,
          subject: "Withdraw Request",
          message: `Hello ${req.seller.name}, Your withdraw request of ${amount}$ is processing. It will take 3 to 7 days to process!`,
        });
      } catch (error) {
        return next(new ErrorHandler("Withdraw created but failed to send email", 500));
      }

      // Trả về phản hồi thành công
      res.status(201).json({
        success: true,
        withdraw,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


// get all withdraws --- admnin

router.get(
  "/get-all-withdraw-request",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const withdraws = await Withdraw.find().sort({ createdAt: -1 });

      res.status(201).json({
        success: true,
        withdraws,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update withdraw request ---- admin
router.put(
  "/update-withdraw-request/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { sellerId } = req.body;

      // Tìm và cập nhật yêu cầu rút tiền
      const withdraw = await Withdraw.findByIdAndUpdate(
        req.params.id,
        {
          status: "succeed",
          updatedAt: Date.now(),
        },
        { new: true }
      );

      if (!withdraw) {
        return next(new ErrorHandler("Withdraw request not found", 404));
      }

      const seller = await Shop.findById(sellerId);
      if (!seller) {
        return next(new ErrorHandler("Seller not found", 404));
      }

      // Tạo transaction mới cho seller
      const transection = {
        _id: withdraw._id,
        amount: withdraw.amount,
        updatedAt: withdraw.updatedAt,
        status: withdraw.status,
      };

      seller.transections = [...seller.transections, transection];
      await seller.save();
      try {
        await sendMail({
          email: seller.email,
          subject: "Payment confirmation",
          message: `Hello ${seller.name}, Your withdraw request of ${withdraw.amount}$ is on the way. Delivery time depends on your bank's rules it usually takes 3days to 7days.`,
        });
      } catch (error) {
        console.error("Error sending email:", error.message);
        // Log lỗi nhưng không gửi phản hồi lại
      }
      // Gửi phản hồi thành công ngay lập tức
      return res.status(201).json({
        success: true,
        withdraw,
      });

      // Gửi email xác nhận sau khi đã gửi phản hồi
      

    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete withdraw request ---- admin
router.delete(
  "/delete-withdraw-request/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const withdraw = await Withdraw.findById(req.params.id);

      if (!withdraw) {
        return next(new ErrorHandler("Withdraw request not found", 404));
      }

      await withdraw.deleteOne();

      res.status(201).json({
        message: "Withdraw request deleted successfully",
        success: true,
      });
    } catch (error) {
      console.log(error);
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
module.exports = router;