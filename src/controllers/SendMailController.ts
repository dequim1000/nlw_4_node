import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";
import { resolve } from 'path';
import { AppError } from "../errors/AppError";

class SendMailController {
    async execute(request: Request, response: Response){
        const { email, survey_id } = request.body;
        
        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        //Pega o email passado por parametro e joga para a varivel userAlreadyExists
        const user = await usersRepository.findOne({email});
        // Se o usuario nao existir, exiba mensagem de erro
        if(!user){
            throw new AppError("User does not exists!");
        }

        const survey = await surveysRepository.findOne({
            id: survey_id
        });

        if(!survey){
            throw new AppError("Survey does not exists!");
        }

        

        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs"); //passando o path para poder usar em varias aplicações

        //Salvar as infomarções na tabela suerveyUser
        const surveysUsersAlreadyExists = await surveysUsersRepository.findOne({
            where: {user_id: user.id, value: null}, //Condição de AND
            relations: ["user", "survey"],
            //where: [{user_id: user.id}, {value: null}], Condição de OR
        });

        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            id: "",
            link: process.env.URL_MAIL,
        };

        if(surveysUsersAlreadyExists){
            variables.id = surveysUsersAlreadyExists.id;
            await SendMailService.execute(email, survey.title, variables, npsPath);
            return response.json(surveysUsersAlreadyExists);
        }

        //Salvar as informações na tabela surveyUser
        const surveyUser = surveysUsersRepository.create({ 
            user_id: user.id, 
            survey_id,
        });
        await surveysUsersRepository.save(surveyUser); //se tudo funcionar, vai salvar a variavel dentro do surveyUser

        variables.id = surveyUser.id;
        
        
        //Enviar email para o usuario
        await SendMailService.execute(email, survey.title, variables, npsPath);

        return response.json(surveyUser);
    }
}

export { SendMailController }