import { Pull, sequelize } from "./orm";

const init = async () => {
    return sequelize.sync();
}

const close = async () => {
    return sequelize.close()
}

const reset = async () => {
    return sequelize.sync({ force: true });
}

const savePulls = async (pulls: any) => {
    return Pull.bulkCreate(pulls.map((p: any) => {
        return { id: p.id, data: p };
    }));
}

const getPulls = async () => {
    return Pull.findAll();
}

export { init, close, reset, savePulls, getPulls };