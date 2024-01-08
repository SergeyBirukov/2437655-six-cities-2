import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { MiddlewareInterface } from './middleware.interface.js';
import { IsDocumentExistsInterface} from '../../common/is-document-exists.interface.js';
import { HttpError} from '../exceptions/http-error.enum.js';

export class IsDocumentExistsMiddleware implements MiddlewareInterface {
  constructor(
    private readonly service: IsDocumentExistsInterface,
    private readonly entityName: string,
    private readonly paramName: string,
  ) {}

  public async execute({ params }: Request, _res: Response, next: NextFunction): Promise<void> {
    const documentId = params[this.paramName];
    if (!(await this.service.isExists(documentId))) {
      throw new HttpError(StatusCodes.NOT_FOUND, `${this.entityName} with ${documentId} not found.`, 'DocumentExists');
    }

    next();
  }
}
