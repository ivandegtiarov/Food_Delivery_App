import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "./../helpers/authHelper.js";
import JWT from "jsonwebtoken";
import orderModel from "../models/orderModel.js";
import mongoose from "mongoose";
import deliveryModel from "../models/deliveryModel.js";
const ObjectId = mongoose.Types.ObjectId;





export const createDelivery = async (req, res) => {
  try {
    const { courier, orderId, latitude, longitude } = req.body;

    // Создание нового объекта доставки
    const newDelivery = await deliveryModel({
      courier,
      orderId,
      latitude,
      longitude,
    });

    // Сохранение доставки в базе данных
    const savedDelivery = await newDelivery.save();

    res.status(201).json({
      success: true,
      message: 'Доставка создана успешно',
      delivery: savedDelivery,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Не удалось создать доставку',
      error: error.message,
    });
  }
};




export const getDelivery = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Поиск доставки по идентификатору заказа
    const delivery = await deliveryModel.findOne({ orderId });

    res.status(200).json(delivery); // Возвращает найденную доставку или null, если доставка не найдена
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Не удалось выполнить запрос',
      error: error.message,
    });
  }
};


export const updateDelivery = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { latitude, longitude } = req.body;

    // Поиск доставки по идентификатору заказа
    const delivery = await deliveryModel.findOne({ orderId });

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Доставка не найдена',
      });
    }

    // Обновление данных доставки
    delivery.latitude = latitude;
    delivery.longitude = longitude;

    const updatedDelivery = await delivery.save();

    res.status(200).json(updatedDelivery);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Не удалось выполнить запрос',
      error: error.message,
    });
  }
};





// Контроллер для получения информации о заказе по его ID
export const getOrderById = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.orderId).populate({ path: "products", populate: { path: "category" } }).populate("buyer");
    if (!order) {
      return res.status(404).json({ message: "Заказ не найден" });
    }
    return res.status(200).json({ order });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Ошибка на сервере" });
  }
};

export const getInfoStatus = async (req, res) => {
  try {
    const orders = await orderModel
      .find({
        $or: [
          { status: "Готується" },
          { status: "Приймається кур'єром" },
          { status: "Доставляется" },
          { status: "Доставлено" }
        ]
      })
      .populate("products")
      .populate("buyer")
      .populate("courier")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};


export const getOrderByStatus = async (req, res) => {
  try {
    const orders = await orderModel
      .find({status: "Доставлено"})
      .populate("products")
      .populate("buyer")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};


export const getUsersByRole = async(req, res) => {
  try {
    const users = await userModel.find({ role: 0 });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, adress, answer } = req.body;
    //validations
    if (!name) {
      return res.send({ error: "Name is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    if (!phone) {
      return res.send({ message: "Phone no is Required" });
    }
    if (!adress) {
      return res.send({ message: "Address is Required" });
    }
    if (!answer) {
      return res.send({ message: "Answer is Required" });
    }
    //check user
    const exisitingUser = await userModel.findOne({ email });
    //exisiting user
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register please login",
      });
    }
    //register user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new userModel({
      name,
      email,
      phone,
      adress,
      password: hashedPassword,
      answer,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Errro in Registeration",
      error,
    });
  }
};

//POST LOGIN
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registerd",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        adress: user.adress,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

//forgotPasswordController

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Emai is required" });
    }
    if (!answer) {
      res.status(400).send({ message: "answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New Password is required" });
    }
    //check
    const user = await userModel.findOne({ email, answer });
    //validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email Or Answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

//test controller
export const testController = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};


//update prfole
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, adress, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    //password
    if (password && password.length < 6) {
      return res.json({ error: "Passsword is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        adress: adress || user.adress,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Update profile",
      error,
    });
  }
};


//orders
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products")
      .populate("buyer", "name")
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};
//orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate({ path: "products", populate: { path: "category" } })
      .populate("buyer")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

//courier orders

export const getCourierOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ status: "Приймається кур'єром" })
      .populate({ path: "products", populate: { path: "category" } })
      .populate("buyer")
      .populate("courier")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Getting Courier Orders",
      error,
    });
  }
};

/// status "Доставлено"
export const getCourierOrdersInProgressController = async (req, res) => {
  try {
    const courierId = req.user._id;
    const orders = await orderModel
      .find({ status: "Доставляется", courier: courierId })
      .populate({ path: "products", populate: { path: "category" } })
      .populate("buyer")
      .populate("courier")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Getting Courier Orders",
      error,
    });
  }
};

/// status "Доставлено"
export const getCourierOrdersCompletedController = async (req, res) => {
  try {
    const courierId = req.user._id;
    const orders = await orderModel
      .find({ status: "Доставлено", courier: courierId })
      .populate({ path: "products", populate: { path: "category" } })
      .populate("buyer")
      .populate("courier")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Getting Courier Orders",
      error,
    });
  }
};


//Money for one courier
export const getTotalEarnings = async (req, res) => {
  const courierId = req.user._id;
  try {
    const orders = await orderModel.find({ courier: courierId, status: "Доставлено" });
    let totalEarnings = 0;
    orders.forEach((order) => {
      totalEarnings += order.courierPrice;
    });
    res.json({courier: courierId, totalEarnings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

/// take order
export const takeOrder = async (req, res) => {
  const { orderId } = req.params;
  const { courier } = req.body;

  try {
    const order = await orderModel.findByIdAndUpdate(
      orderId,
      { courier },
      { new: true }
    )
    .populate("products")
    .populate("buyer")
    .populate({ path: "products", populate: { path: "category" } })
    res.status(200).json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};




//order status
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
};  


export const countProductPurchases = async (req, res) => {

  try {
    const result = await orderModel.aggregate([
      {
        $unwind: "$products",
      },
      {
        $lookup: {
          from: "products",
          localField: "products",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      {
        $unwind: "$productInfo",
      },
      {
        $group: {
          _id: "$productInfo._id",
          name: { $first: "$productInfo.name" },
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


