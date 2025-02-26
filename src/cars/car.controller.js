import Product from "../products/product.model.js";
import Cart from "../cars/car.model.js";
import Invoice from "../facturas/factura.model.js";

export const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found!"
            });
        }

        let cart = await Cart.findOne({ user: req.usuario.id });

        if (!cart) {
            cart = new Cart({ user: req.usuario.id, products: [] });
        }

        const productIndex = cart.products.findIndex(item => item.product.toString() === productId);

        if (productIndex > -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await cart.save();
        res.status(200).json({
            success: true,
            message: "Product added to cart!",
            cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error adding product to cart!",
            error: error.message
        });
    }
};

export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.usuario.id }).populate("products.product");

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found!"
            });
        }

        res.status(200).json({
            success: true,
            cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching cart!",
            error: error.message
        });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        let cart = await Cart.findOne({ user: req.usuario.id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found!"
            });
        }

        cart.products = cart.products.filter(item => item.product.toString() !== productId);
        await cart.save();

        res.status(200).json({
            success: true,
            message: "Product removed from cart!",
            cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error removing product from cart!",
            error: error.message
        });
    }
};

export const checkout = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.usuario.id }).populate("products.product");

        if (!cart || cart.products.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty!"
            });
        }

        let total = 0;
        for (let item of cart.products) {
            if (item.product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Not enough stock for product: ${item.product.name}`
                });
            }
            total += item.product.price * item.quantity;
        }

        const invoice = new Invoice({
            user: req.usuario.id,
            products: cart.products.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price
            })),
            total,
            status: 'Paid'
        });

        await invoice.save();

        for (let item of cart.products) {
            await Product.findByIdAndUpdate(item.product._id, {
                $inc: { stock: -item.quantity, sold: item.quantity }
            });
        }

        await Cart.findOneAndDelete({ user: req.usuario.id });

        res.status(200).json({
            success: true,
            message: "Purchase completed successfully!",
            invoice
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error during checkout!",
            error: error.message
        });
    }
};

export const purchaseHistory = async (req, res) => {
    try {
        const invoices = await Invoice.find({ user: req.usuario.id }).populate("products.product");

        if (!invoices.length) {
            return res.status(404).json({
                success: false,
                message: "No purchase history found!"
            });
        }

        res.status(200).json({
            success: true,
            invoices
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching purchase history!",
            error: error.message
        });
    }
};
