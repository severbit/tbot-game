import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("postgresql://postgres:lJUgoocBQQVsHGklRNRCciefREZlaXUA@tramway.proxy.rlwy.net:38044/railway",
    {
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true, // Railway требует SSL
                rejectUnauthorized: false // Игнорировать ошибку самоподписанного сертификата
            }
        }
    }
)

