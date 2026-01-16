import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let body: any = {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Internal server error',
    };

    // 🎯 HttpException (BadRequest, Unauthorized, dll)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        body.message = res;
      } else if (typeof res === 'object') {
        body = {
          ...res,
        };
      }

      body.code = body.code ?? HttpStatus[status];
    }

    response.status(status).json({
      statusCode: status,
      path: request.url,
      ...body,
    });
  }
}
