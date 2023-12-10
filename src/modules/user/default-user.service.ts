import { UserService } from "./user-service.interface";
import { DocumentType, types } from "@typegoose/typegoose";
import { UserEntity, UserModel } from "./user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { inject, injectable } from "inversify";
import { AppComponent } from "../../types/app-component.enum";
import { LoggerInterface } from "../../logger/logger.interface";

@injectable()
export class DefaultUserService implements UserService {
    constructor(
        @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
        @inject(AppComponent.UserModel) private readonly userModel: types.ModelType<UserEntity>
    ){}

    public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
        const user = new UserEntity(dto);
        user.setPassword(dto.password, salt);
    
        const result = await this.userModel.create(user);
        this.logger.info(`New user created: ${user.email}`);

        return result;
      }

      public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
        return this.userModel.findOne({email});
      }
    
      public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
        const existedUser = await this.findByEmail(dto.email);
    
        if (existedUser) {
          return existedUser;
        }
    
        return this.create(dto, salt);
      }
}