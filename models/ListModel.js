import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
    {
        googlePlaceId: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        category: { 
            type: String, 
            default: "" 
        },
        ratingGoogle: {
            type: Number,
            default: null
        },
        ratingUser: {
            type: Number,
            min: 1,
            max: 5,
            required: true
        },
        comment: {
            type: String,
            trim: true,
            maxlength: 300
        },
        image: {
            type: String,
            default: null
        }
    },
    { _id: false }
);

const listSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 40
        },
        description: {
            type: String,
            trim: true,
            maxlength: 200,
            default:""
        },

        restaurants: [restaurantSchema],

        isPublic: {
            type: Boolean,
            default: true
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    },
    { timestamps: true }
);

const List = mongoose.model("List", listSchema);
export default List;