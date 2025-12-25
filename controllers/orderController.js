import Cart from "../models/Cart.js";
import Order from "../models/Order.js";

export const placeOrder = async (req,res)=>{
  try{
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    if(!cart || cart.items.length===0) return res.status(400).json({message:"Cart is empty"});

    const totalAmount = cart.items.reduce((sum,item)=>sum + item.product.price*item.quantity,0);
    const order = new Order({ user: req.user.id, items: cart.items, totalAmount });
    await order.save();

    cart.items = [];
    await cart.save();

    res.status(201).json({ message: "Order placed", order });
  }catch(err){
    res.status(500).json({ message: err.message });
  }
};

export const myOrders = async (req,res)=>{
  try{
    const orders = await Order.find({ user:req.user.id }).populate("items.product");
    res.json(orders);
  }catch(err){
    res.status(500).json({ message: err.message });
  }
};
