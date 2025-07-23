import { sequelize } from "./db.js";
import { DataTypes } from "sequelize";

export const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    chatId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true
    },
    rightAnswers: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    wrongAnswers: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {tableName: "users"});

