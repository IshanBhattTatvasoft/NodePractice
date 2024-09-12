import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../utils/database.js";

const OrderItem = sequelize.define('orderItem', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantity: {
        type: DataTypes.INTEGER,
    }
});

export default OrderItem;