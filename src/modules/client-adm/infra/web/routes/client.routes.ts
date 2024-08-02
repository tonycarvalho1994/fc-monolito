import { Router } from "express";
import { AddClientController } from "../controllers/add-client.controller";
import AddClientUseCase from "../../../usecase/add-client/add-client.usecase";
import ClientRepository from "../../../repository/client.repository";

const clientRouter = Router();

const clientRepository = new ClientRepository();
const addClientUseCase = new AddClientUseCase(clientRepository);
const addClientController = new AddClientController(addClientUseCase);

clientRouter.post("/", addClientController.handle.bind(addClientController));

export default clientRouter;
