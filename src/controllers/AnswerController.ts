import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
class AnswerController{

    async execute(request: Request, response: Response){
        const { value } = request.params;
        const { u } = request.query;

        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const surveyUser = await surveysUsersRepository.findOne({
            id: String(u),
        })

        if(!surveyUser){
            throw new AppError("Survey User does not exists!");
        }

        surveyUser.value = Number(value);

        await surveysUsersRepository.save(surveyUser);

        return response.json(surveyUser);
    }
}

export { AnswerController };

//http://localhost:3333/answers/2?u=3b2401b6-ce7c-467e-bfb7-83e831a11390
/**
 * 
 Route Params => Parâmentros que compôe a rota 
 routes.get("/answers/:value")

 Query Params => Busca, Paginação, não obrigatórios
 ?
 chave=valor
 * 
 */