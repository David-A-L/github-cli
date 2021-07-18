import {
    Sequelize,
    Model,
    ModelDefined,
    DataTypes,
    HasManyGetAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyHasAssociationMixin,
    Association,
    HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin,
    Optional,
} from 'sequelize';

const sequelize = new Sequelize('sqlite::memory:');

// These are all the attributes in the User model
interface UserAttributes {
    id: number;
    name: string;
    preferredName: string | null;
}

// Some attributes are optional in `User.build` and `User.create` calls
interface UserCreationAttributes extends Optional<UserAttributes, "id"> { }

class User extends Model<UserAttributes, UserCreationAttributes>
    implements UserAttributes {
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.
    public name!: string;
    public preferredName!: string | null; // for nullable fields

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Since TS cannot determine model association at compile time
    // we have to declare them here purely virtually
    // these will not exist until `Model.init` was called.
    public getProjects!: HasManyGetAssociationsMixin<Project>; // Note the null assertions!
    public addProject!: HasManyAddAssociationMixin<Project, number>;
    public hasProject!: HasManyHasAssociationMixin<Project, number>;
    public countProjects!: HasManyCountAssociationsMixin;
    public createProject!: HasManyCreateAssociationMixin<Project>;

    // You can also pre-declare possible inclusions, these will only be populated if you
    // actively include a relation.
    public readonly projects?: Project[]; // Note this is optional since it's only populated when explicitly requested in code

    public static associations: {
        projects: Association<User, Project>;
    };
}

interface ProjectAttributes {
    id: number;
    ownerId: number;
    name: string;
}

interface ProjectCreationAttributes extends Optional<ProjectAttributes, "id"> { }

class Project extends Model<ProjectAttributes, ProjectCreationAttributes>
    implements ProjectAttributes {
    public id!: number;
    public ownerId!: number;
    public name!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

interface AddressAttributes {
    userId: number;
    address: string;
}

// You can write `extends Model<AddressAttributes, AddressAttributes>` instead,
// but that will do the exact same thing as below
class Address extends Model<AddressAttributes> implements AddressAttributes {
    public userId!: number;
    public address!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

// You can also define modules in a functional way
interface NoteAttributes {
    id: number;
    title: string;
    content: string;
}

// You can also set multiple attributes optional at once
interface NoteCreationAttributes extends Optional<NoteAttributes, 'id' | 'title'> { };

Project.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        ownerId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        name: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "projects",
    }
);

User.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        preferredName: {
            type: new DataTypes.STRING(128),
            allowNull: true,
        },
    },
    {
        tableName: "users",
        sequelize, // passing the `sequelize` instance is required
    }
);

Address.init(
    {
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
        },
        address: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
    },
    {
        tableName: "address",
        sequelize, // passing the `sequelize` instance is required
    }
);

// And with a functional approach defining a module looks like this
const Note: ModelDefined<
    NoteAttributes,
    NoteCreationAttributes
> = sequelize.define(
    'Note',
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: new DataTypes.STRING(64),
            defaultValue: 'Unnamed Note',
        },
        content: {
            type: new DataTypes.STRING(4096),
            allowNull: false,
        },
    },
    {
        tableName: 'notes',
    }
);

// Here we associate which actually populates out pre-declared `association` static and other methods.
User.hasMany(Project, {
    sourceKey: "id",
    foreignKey: "ownerId",
    as: "projects", // this determines the name in `associations`!
});

Address.belongsTo(User, { targetKey: "id" });
User.hasOne(Address, { sourceKey: "id" });

export { sequelize };