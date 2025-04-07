import mongoose, {Schema} from "mongoose";

const bmiSchema = new mongoose.Schema(
    {
        height: {
            type: Number,
            min: 0,
        },
        weight: {
            type: Number,
            min: 0,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        }
    },
    {
        timestamps: true,
    },
);

bmiSchema.virtual('bmi').get(function() {
    if (this.height && this.weight) {
      const heightInMeters = this.height / 100; // Assuming height is in cm
      return this.weight / (heightInMeters * heightInMeters);
    }
    return null;
});
bmiSchema.set('toJSON', { virtuals: true });
bmiSchema.set('toObject', { virtuals: true });


export const Bmi = mongoose.model("Bmi", bmiSchema);
