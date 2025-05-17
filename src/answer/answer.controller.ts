// src/answer/answer.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AnswerService } from '@/answer/answer.service';

@Controller('answer')
export class AnswerController {
  constructor(private readonly answerSvc: AnswerService) {}
  @Post()
  async submit(
    @Body('userId') userId: string,
    @Body('sessionId') sessionId: string,
    @Body('questionId') questionId: string,
    @Body('choice') choice: number,
  ) {
    return this.answerSvc.submitAnswer(
      userId,
      sessionId,
      questionId,
      choice,
    );
  }
}
