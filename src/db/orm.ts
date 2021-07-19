import {
    Sequelize,
    Model,
    DataTypes,
} from 'sequelize';

const sequelize = new Sequelize('sqlite::memory:', { logging: false });

interface PullAttributes {
    id: number;
    data: any;
}

class Pull extends Model<PullAttributes>
    implements PullAttributes {
    public id!: number;
    public data!: any;
}

Pull.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: false,
            primaryKey: true,
        },
        data: {
            type: DataTypes.JSON,
            allowNull: false,
        }
    },
    {
        sequelize,
        tableName: "Pulls",
    }
);


export { sequelize, Pull };