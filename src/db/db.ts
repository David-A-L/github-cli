import { sequelize } from "./orm";

const init = async () => {
    return sequelize.sync();
}

const close = async () => {
    return sequelize.close()
}

const reset = async () => {
    return sequelize.sync({ force: true });
}

export { init, close, reset };