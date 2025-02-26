import { Schema, model } from "mongoose";

const FacturaSchema = Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        products: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: [1, "Quantity must be at least 1!"],
                },
                price: {
                    type: Number,
                    required: true,
                },
            },
        ],

        total: {
            type: Number,
            required: true,
        },

        status: {
            type: String,
            enum: ['Pending', 'Paid', 'Cancelled'],
            default: 'Pending',
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

FacturaSchema.pre('save', function(next) {
    const total = this.products.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    
    if (this.total !== total) {
        return next(new Error('Total does not match the sum of the product prices!'));
    }

    next();
});

export default model('Factura', FacturaSchema);
