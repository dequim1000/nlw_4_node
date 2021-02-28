import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/UsersRepository";
import * as yup from 'yup';
import { AppError } from "../errors/AppError";

class UserController{
    async create(request: Request, response: Response){
        const { name, email } = request.body;
        
        const schema = yup.object().shape({
            name: yup.string().required(),
            email: yup.string().email().required(),
        });

        /*if(!(await schema.isValid(request.body))){
            return response.status(400).json({
                error: "Validation Failed!@"
            });
        }*/

        try {
            await schema.validate(request.body, {abortEarly:false})
        } catch (err) {
            throw new AppError(err);
        }

        const userRepository = getCustomRepository(UsersRepository);

        //SELECT * FROM USERS WHERE EMAIL = "EMAIL"
        //Verificar se o Email ja existe
        const userAlredyExists = await userRepository.findOne({
            email
        });

        if(userAlredyExists){
            throw new AppError("User already exists!");
        }

        //Não consegue passar direto para o Save por isso usar o Create e dps o Save
        //Cadastrar o Usuario e mostrar em um JSON 
        const user = userRepository.create({
            name, 
            email
        })

        await userRepository.save(user);

        return response.status(201).json(user);
    }

    async show(request: Request, response: Response){
        const usersRepository = getCustomRepository(UsersRepository);

        const all = await usersRepository.find(); // Lista todos os registros na tabela

        return response.status(201).json(all);
    }
}

export { UserController };
